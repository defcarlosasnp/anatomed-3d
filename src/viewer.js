import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { ClipSystem } from './clipping.js';
import { Visuals } from './visuals.js';

const HOVER_EMISSIVE = new THREE.Color('#4a4a4a');
const SELECT_EMISSIVE = new THREE.Color('#14a896');
const TARGET_SIZE = 2; // tamaño del modelo normalizado (unidades de escena)

export class Viewer {
  constructor(container) {
    this.container = container;
    this.parts = new Map(); // key -> part
    this.meshes = []; // todas las mallas pickeables
    this.tickers = new Set();
    this.listeners = {};
    this.hoverKey = null;
    this.selectedKey = null;
    this.ghostSet = null;
    this.loader = new GLTFLoader();
    this.loader.setMeshoptDecoder(MeshoptDecoder);

    // renderer
    const r = (this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, stencil: true }));
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.localClippingEnabled = true;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.95;
    container.appendChild(r.domElement);

    this.labelRenderer = new CSS2DRenderer();
    Object.assign(this.labelRenderer.domElement.style, { position: 'absolute', top: '0', left: '0', pointerEvents: 'none' });
    container.appendChild(this.labelRenderer.domElement);

    // scene
    this.scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(r);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.45;
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#3a2a2a', 0.5));
    const key = (this.keyLight = new THREE.DirectionalLight('#ffffff', 1.6));
    key.position.set(2, 3, 4);
    this.scene.add(key, key.target);
    const rim = new THREE.DirectionalLight('#9fd8ff', 0.55); // luz de contorno para dar volumen
    rim.position.set(-3, 1.5, -3);
    this.scene.add(rim);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    this.controls = new OrbitControls(this.camera, r.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 0.25;
    this.controls.maxDistance = 12;
    this.controls.zoomSpeed = 1.1;
    this.controls.screenSpacePanning = true;

    this.root = new THREE.Group(); // escala normalizada
    this.space = new THREE.Group(); // coordenadas originales del modelo (metros)
    this.root.add(this.space);
    this.scene.add(this.root);

    this.clipSys = new ClipSystem(this);
    this.visuals = new Visuals(this);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this._initEvents();

    new ResizeObserver(() => this._resize()).observe(container);
    this._resize();

    this.clock = new THREE.Clock();
    r.setAnimationLoop(() => this._frame());
  }

  on(evt, fn) {
    (this.listeners[evt] ||= []).push(fn);
  }
  emit(evt, ...args) {
    (this.listeners[evt] || []).forEach((fn) => fn(...args));
  }

  // ------------------------------------------------------------------ carga
  async load(organ) {
    this.clear();
    this.organ = organ;
    const gltfs = await Promise.all((organ.models || []).map((url) => this.loader.loadAsync(url)));
    const nodes = gltfs.flatMap((g) => [...g.scene.children]);
    if (organ.build) nodes.push(...organ.build(THREE));
    for (const node of nodes) this._register(node);

    // normalizar: centrar y escalar
    this.root.scale.setScalar(1);
    this.root.updateMatrixWorld(true);
    const box = new THREE.Box3();
    for (const p of this.parts.values()) box.expandByObject(p.obj);
    const size = box.getSize(new THREE.Vector3());
    this.center = box.getCenter(new THREE.Vector3());
    this.scale = TARGET_SIZE / Math.max(size.x, size.y, size.z);
    this.space.position.copy(this.center).multiplyScalar(-1);
    this.root.scale.setScalar(this.scale);
    this.root.updateMatrixWorld(true);

    for (const p of this.parts.values()) this._measure(p);
    for (const p of this.parts.values()) this.applyState(p);
    this._updateClipPlane();
    this.visuals.layout();
    this.resetView(false);
  }

  /** Registra un nodo como parte (si su nombre está en organ.parts). */
  _register(node) {
    const info = this.organ.parts[node.name];
    if (!info) return null;
    this.space.add(node);
    const color = new THREE.Color(info.color || this.organ.groups.find((g) => g.id === info.group)?.color || '#cccccc');
    // vasos: superficie húmeda y brillante · tejidos: brillo suave con "sheen" aterciopelado
    const vessel = info.vessel ?? /arter|ven|vas|coron|portal/.test(info.group || '');
    const material = new THREE.MeshPhysicalMaterial({
      color,
      roughness: info.roughness ?? (vessel ? 0.32 : 0.55),
      metalness: 0,
      clearcoat: vessel ? 0.6 : 0.2,
      clearcoatRoughness: vessel ? 0.25 : 0.5,
      sheen: vessel ? 0 : 0.45,
      sheenRoughness: 0.7,
      sheenColor: color.clone().lerp(new THREE.Color('#ffffff'), 0.45),
      side: THREE.DoubleSide,
      clipShadows: true,
    });
    const meshes = [];
    node.traverse((o) => {
      if (o.isMesh) {
        if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
        o.material = material;
        o.userData.partKey = node.name;
        meshes.push(o);
        this.meshes.push(o);
      }
    });
    const part = {
      key: node.name,
      info,
      obj: node,
      meshes,
      material,
      baseColor: color.clone(),
      visible: !info.hidden,
      opacity: info.opacity ?? 1,
      tint: null,
    };
    this.parts.set(node.name, part);
    return part;
  }

  /** Cajas y centroides en coordenadas del modelo. */
  _measure(p) {
    this.root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(this.space.matrixWorld).invert();
    p.box = new THREE.Box3();
    for (const m of p.meshes) {
      m.userData.toSpace = new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld);
      m.geometry.computeBoundingBox();
      p.box.union(m.geometry.boundingBox.clone().applyMatrix4(m.userData.toSpace));
    }
    p.centroid = p.box.getCenter(new THREE.Vector3());
    p.obj.userData.baseMatrix = p.obj.matrix.clone();
  }

  /** Agrega una parte generada después de la carga (geometría en coordenadas del modelo). */
  addPart(node) {
    const p = this._register(node);
    if (!p) return null;
    this._measure(p);
    this.applyState(p);
    return p;
  }

  clear() {
    this.emit('clear');
    this.clipSys.clearCaps();
    this.visuals?.setSelection(null);
    this.tickers.clear();
    for (const c of [...this.space.children]) {
      this.space.remove(c);
      c.traverse((o) => {
        if (o.isCSS2DObject) o.element.remove();
        if (o.geometry) o.geometry.dispose();
        if (o.material && o.material.dispose) o.material.dispose();
      });
    }
    this.parts.clear();
    this.meshes = [];
    this.hoverKey = this.selectedKey = null;
    this.ghostSet = null;
    this.space.position.set(0, 0, 0);
  }

  // --------------------------------------------------------- estado visual
  applyState(p) {
    const m = p.material;
    let opacity = p.opacity;
    let visible = p.visible;
    if (this.ghostSet) {
      if (this.ghostSet.has(p.key)) {
        visible = true;
        opacity = 1;
      } else opacity = Math.min(opacity, 0.1);
    }
    for (const mesh of p.meshes) mesh.visible = visible;
    const transparent = opacity < 0.999;
    if (m.transparent !== transparent) m.needsUpdate = true;
    m.transparent = transparent;
    m.opacity = opacity;
    m.depthWrite = !transparent;
    for (const mesh of p.meshes) mesh.renderOrder = transparent ? 2 : 0;

    if (this.selectedKey === p.key) m.emissive.copy(SELECT_EMISSIVE);
    else if (this.hoverKey === p.key) m.emissive.copy(HOVER_EMISSIVE);
    else if (p.tint) m.emissive.copy(p.tint);
    else m.emissive.setRGB(0, 0, 0);

    m.clippingPlanes = this.clipSys.state.enabled ? this.clipSys.active : null;
    this.clipSys.markDirty();
  }

  refresh() {
    for (const p of this.parts.values()) this.applyState(p);
  }

  setVisible(key, v) {
    const p = this.parts.get(key);
    if (!p) return;
    p.visible = v;
    this.applyState(p);
  }

  setOpacity(key, v) {
    const p = this.parts.get(key);
    if (!p) return;
    p.opacity = v;
    this.applyState(p);
  }

  setTint(key, color) {
    const p = this.parts.get(key);
    if (!p) return;
    p.tint = color ? new THREE.Color(color) : null;
    this.applyState(p);
  }

  setSelected(key) {
    const prev = this.selectedKey;
    this.selectedKey = key;
    this.visuals.setSelection(key && this.parts.has(key) ? this.parts.get(key).meshes : null);
    for (const k of [prev, key]) if (k && this.parts.has(k)) this.applyState(this.parts.get(k));
  }

  setHover(key) {
    if (key === this.hoverKey) return;
    const prev = this.hoverKey;
    this.hoverKey = key;
    for (const k of [prev, key]) if (k && this.parts.has(k)) this.applyState(this.parts.get(k));
  }

  /** Atenúa todo excepto el conjunto dado (null = normal). */
  setGhost(keys) {
    this.ghostSet = keys && keys.length ? new Set(keys) : null;
    this.refresh();
  }

  // --------------------------------------------------------------- corte
  get clip() {
    return this.clipSys.state;
  }

  setClip(opts) {
    this.clipSys.set(opts);
    this.refresh();
  }

  _updateClipPlane() {
    this.clipSys.update();
  }

  /** Caja (mundo) del encuadre del órgano: organ.frame o el modelo completo. */
  frameBox() {
    const box = new THREE.Box3();
    for (const k of this.organ?.frame || []) if (this.parts.has(k)) box.expandByObject(this.parts.get(k).obj);
    if (box.isEmpty()) for (const p of this.parts.values()) box.expandByObject(p.obj);
    return box;
  }

  /**
   * Corte predefinido. normal/point en coordenadas del modelo. Se conserva el lado n·x ≤ d
   * y la cámara se ubica en el lado retirado, mirando la superficie de corte.
   */
  setClipPreset(normalSpace, pointSpace) {
    this.root.updateMatrixWorld(true);
    const n = normalSpace.clone().normalize(); // sin rotación entre modelo y mundo
    const p = this.space.localToWorld(pointSpace.clone());
    this.clipSys.state.enabled = true;
    this.clipSys.setPreset(n, p);
    this.refresh();
    const box = this.frameBox();
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const target = this.clipSys.active[0].projectPoint(sphere.center, new THREE.Vector3());
    if (this.clipSys.state.mode === 'slab') target.copy(sphere.center).addScaledVector(n, n.dot(p) - n.dot(sphere.center));
    const dist = (sphere.radius / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))) * 0.8;
    const dir = n.clone();
    if (Math.abs(dir.y) > 0.9) dir.add(new THREE.Vector3(0, 0, 0.35)).normalize();
    this._animateCamera(target, target.clone().addScaledVector(dir, dist), true);
  }

  // --------------------------------------------------------------- cámara
  resetView(animate = true) {
    // encuadre: partes indicadas en organ.frame o el modelo completo
    const box = new THREE.Box3();
    for (const k of this.organ?.frame || []) {
      const p = this.parts.get(k);
      if (p) box.expandByObject(p.obj);
    }
    let center = new THREE.Vector3();
    let radius = TARGET_SIZE / 2;
    if (!box.isEmpty()) {
      const s = box.getBoundingSphere(new THREE.Sphere());
      center = s.center;
      radius = s.radius * 0.9;
    }
    const dist = (radius / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))) * 1.25;
    const to = new THREE.Vector3(...(this.organ?.viewDir || [0.15, 0.1, 1])).normalize().multiplyScalar(dist).add(center);
    this._animateCamera(center, to, animate);
  }

  focusOn(keys) {
    const box = new THREE.Box3();
    for (const k of keys) {
      const p = this.parts.get(k);
      if (p) for (const m of p.meshes) box.expandByObject(m);
    }
    if (box.isEmpty()) return;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const r = Math.max(sphere.radius, 0.12);
    const dist = (r / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2))) * 1.15;
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    this._animateCamera(sphere.center, sphere.center.clone().add(dir.multiplyScalar(dist)), true);
  }

  _animateCamera(target, position, animate) {
    if (!animate) {
      this.controls.target.copy(target);
      this.camera.position.copy(position);
      this.controls.update();
      return;
    }
    const t0 = this.controls.target.clone();
    const p0 = this.camera.position.clone();
    const start = performance.now();
    const dur = 650;
    this._camAnim = () => {
      const k = Math.min(1, (performance.now() - start) / dur);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.controls.target.lerpVectors(t0, target, e);
      this.camera.position.lerpVectors(p0, position, e);
      if (k >= 1) this._camAnim = null;
    };
  }

  // -------------------------------------------------------------- etiquetas
  /** Crea una etiqueta HTML en coordenadas del modelo. */
  addLabel(posSpace, text, onClick) {
    const el = document.createElement('div');
    el.className = 'lm-label';
    el.textContent = text;
    if (onClick) el.addEventListener('click', (e) => (e.stopPropagation(), onClick()));
    const obj = new CSS2DObject(el);
    obj.position.copy(posSpace);
    obj.userData.isLabel = true;
    this.space.add(obj);
    return obj;
  }

  /** Pin HTML (punto clínico o nota) en coordenadas del modelo. */
  addPin(posSpace, html, cls, onClick, title) {
    const el = document.createElement('div');
    el.className = `pin ${cls || ''}`;
    el.innerHTML = html;
    if (title) el.title = title;
    if (onClick) {
      el.addEventListener('pointerdown', (e) => e.stopPropagation());
      el.addEventListener('click', (e) => (e.stopPropagation(), onClick()));
    }
    const obj = new CSS2DObject(el);
    obj.position.copy(posSpace);
    obj.userData.isPin = cls;
    this.space.add(obj);
    return obj;
  }

  setPinsVisible(cls, v) {
    this.space.traverse((o) => {
      if (o.userData.isPin === cls) o.visible = v;
    });
  }

  removePins(cls) {
    for (const o of [...this.space.children]) if (o.userData.isPin === cls) this.space.remove(o);
  }

  setLabelsVisible(v) {
    this.space.traverse((o) => {
      if (o.userData.isLabel) o.visible = v;
    });
  }

  /** Punto de la superficie de una parte más alejado del centro del órgano en la dirección de su centroide. */
  outerPoint(key) {
    const p = this.parts.get(key);
    if (!p) return null;
    const c = new THREE.Box3();
    for (const q of this.parts.values()) if (q.visible) c.union(q.box);
    const center = c.getCenter(new THREE.Vector3());
    const dir = p.centroid.clone().sub(center).normalize();
    let best = null;
    let bestD = -Infinity;
    const v = new THREE.Vector3();
    for (const m of p.meshes) {
      const pos = m.geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 3) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.userData.toSpace);
        const d = v.clone().sub(center).dot(dir);
        if (d > bestD) (bestD = d), (best = v.clone());
      }
    }
    return best;
  }

  /** Vértice más cercano (en coordenadas del modelo) de una parte. */
  nearestVertex(key, point) {
    const p = this.parts.get(key);
    let best = null;
    let bestD = Infinity;
    const v = new THREE.Vector3();
    for (const m of p.meshes) {
      const pos = m.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.userData.toSpace);
        const d = v.distanceToSquared(point);
        if (d < bestD) (bestD = d), (best = v.clone());
      }
    }
    return best;
  }

  // ---------------------------------------------------------------- picking
  pick(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.meshes, false);
    for (const h of hits) {
      if (!h.object.visible) continue;
      const p = this.parts.get(h.object.userData.partKey);
      if (!p || p.material.opacity < 0.3) continue;
      if (this.clipSys.isClipped(h.point)) continue;
      return { key: p.key, hit: h };
    }
    return null;
  }

  _initEvents() {
    const el = this.renderer.domElement;
    let down = null;
    let pending = null;
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      pending = e;
    });
    el.addEventListener('pointerleave', () => {
      pending = null;
      this.emit('hover', null, null);
    });
    el.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY, t: performance.now() }));
    el.addEventListener('pointerup', (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (moved < 6 && performance.now() - down.t < 500) this.emit('pick', this.pick(e.clientX, e.clientY), e);
      down = null;
    });
    el.addEventListener('dblclick', (e) => {
      const r = this.pick(e.clientX, e.clientY);
      if (r) this.focusOn([r.key]);
    });
    this._processHover = () => {
      if (!pending) return;
      const e = pending;
      pending = null;
      this.emit('hover', this.pick(e.clientX, e.clientY), e);
    };
  }

  _resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / Math.max(h, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
    this.visuals?.setSize(w, h);
  }

  _frame() {
    const dt = Math.min(this.clock.getDelta(), 0.1);
    const t = this.clock.elapsedTime;
    if (this._camAnim) this._camAnim();
    if (this.clipSys.dirty) this.clipSys.rebuildCaps();
    this._processHover?.();
    for (const fn of this.tickers) fn(dt, t);
    this.controls.update();
    this.visuals.render();
    this.labelRenderer.render(this.scene, this.camera);
  }
}

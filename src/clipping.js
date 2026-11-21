import * as THREE from 'three';

// Sistema de corte: un plano (corte simple) o dos planos paralelos (lámina / "tomografía"),
// con inclinación libre y relleno de las superficies cortadas mediante stencil buffer
// (una "tapa" por estructura, con su propio color).

const AXES = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
const Z = new THREE.Vector3(0, 0, 1);

function makeHelper(scene) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: '#7cd6cc', transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false }),
  );
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)), new THREE.LineBasicMaterial({ color: '#7cd6cc', transparent: true, opacity: 0.6 })));
  mesh.visible = false;
  mesh.renderOrder = 9999;
  scene.add(mesh);
  return mesh;
}

export class ClipSystem {
  constructor(viewer) {
    this.v = viewer;
    this.state = { enabled: false, mode: 'plane', axis: 'x', tiltA: 0, tiltB: 0, t: 0.5, thickness: 0.08, flip: false, caps: true };
    this.base = new THREE.Vector3(1, 0, 0);
    this.normal = new THREE.Vector3(1, 0, 0);
    this.planes = [new THREE.Plane(), new THREE.Plane()];
    this.active = []; // array estable que se pasa a los materiales
    this.helpers = [makeHelper(viewer.scene), makeHelper(viewer.scene)];
    this.capGroup = new THREE.Group();
    viewer.scene.add(this.capGroup);
    this.caps = []; // { mesh, part, plane }
    this.stencilChildren = [];
    this.dirty = false;
    this.capGeo = new THREE.PlaneGeometry(1, 1);
  }

  set(opts) {
    const o = { ...opts };
    if (o.axis) {
      this.base.fromArray(AXES[o.axis]);
      o.tiltA = o.tiltB = 0;
    }
    const prevCount = this.active.length;
    const prevEnabled = this.state.enabled;
    const prevCaps = this.state.caps;
    Object.assign(this.state, o);
    this.update();
    if (this.active.length !== prevCount || this.state.enabled !== prevEnabled || this.state.caps !== prevCaps) this.dirty = true;
  }

  /** Corte definido por una normal y un punto (ambos en coordenadas de mundo). */
  setPreset(normal, point) {
    this.base.copy(normal).normalize();
    Object.assign(this.state, { axis: null, tiltA: 0, tiltB: 0, flip: false });
    const [min, max] = this._range(this.base);
    this.state.t = THREE.MathUtils.clamp((this.base.dot(point) - min) / (max - min || 1), 0, 1);
    this.set({});
  }

  _range(n) {
    const box = this.v.frameBox();
    const c = [box.min, box.max];
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Vector3(c[i & 1].x, c[(i >> 1) & 1].y, c[(i >> 2) & 1].z);
      const d = n.dot(p);
      min = Math.min(min, d);
      max = Math.max(max, d);
    }
    return [min, max];
  }

  update() {
    const box = this.v.frameBox();
    if (box.isEmpty()) return;
    const s = this.state;
    // normal = base inclinada en dos ejes perpendiculares
    const u = new THREE.Vector3().crossVectors(this.base, Math.abs(this.base.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)).normalize();
    const w = new THREE.Vector3().crossVectors(this.base, u).normalize();
    this.normal
      .copy(this.base)
      .applyAxisAngle(u, THREE.MathUtils.degToRad(s.tiltA))
      .applyAxisAngle(w, THREE.MathUtils.degToRad(s.tiltB))
      .normalize();
    const n = this.normal;
    const [min, max] = this._range(n);
    const d = min + (max - min) * s.t;
    const th = Math.max(0.002, s.thickness * (max - min));
    const [P0, P1] = this.planes;
    this.active.length = 0;
    if (s.mode === 'slab') {
      P0.set(n.clone().negate(), d + th / 2); // conserva n·x ≤ d + th/2
      P1.set(n.clone(), -(d - th / 2)); // conserva n·x ≥ d − th/2
      this.active.push(P0, P1);
    } else {
      if (s.flip) P0.set(n.clone(), -d);
      else P0.set(n.clone().negate(), d);
      this.active.push(P0);
    }
    // planos visibles
    const size = box.getSize(new THREE.Vector3()).length() * 0.9;
    const center = box.getCenter(new THREE.Vector3());
    this.helpers.forEach((h, i) => {
      const pl = this.active[i];
      h.visible = s.enabled && !!pl;
      if (!pl) return;
      pl.projectPoint(center, h.position);
      h.quaternion.setFromUnitVectors(Z, pl.normal);
      h.scale.set(size, size, 1);
    });
    this._layoutCaps();
  }

  /** ¿El punto (mundo) queda fuera de la zona visible? */
  isClipped(p) {
    if (!this.state.enabled) return false;
    return this.active.some((pl) => pl.distanceToPoint(p) < 0);
  }

  markDirty() {
    if (this.state.enabled) this.dirty = true;
  }

  // ------------------------------------------------------------------ tapas
  clearCaps() {
    for (const c of this.stencilChildren) c.parent?.remove(c);
    this.stencilChildren = [];
    for (const c of this.caps) {
      this.capGroup.remove(c.mesh);
      c.mesh.material.dispose();
    }
    this.caps = [];
    (this._stencilMats || []).forEach((m) => m.dispose());
    this._stencilMats = [];
  }

  rebuildCaps() {
    this.dirty = false;
    this.clearCaps();
    if (!this.state.enabled || !this.state.caps) return;
    const mk = (side, op, plane) => {
      const m = new THREE.MeshBasicMaterial({
        side,
        depthWrite: false,
        depthTest: false,
        colorWrite: false,
        stencilWrite: true,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilFail: op,
        stencilZFail: op,
        stencilZPass: op,
        clippingPlanes: [plane],
      });
      this._stencilMats.push(m);
      return m;
    };
    const mats = this.active.map((pl) => ({ back: mk(THREE.BackSide, THREE.IncrementWrapStencilOp, pl), front: mk(THREE.FrontSide, THREE.DecrementWrapStencilOp, pl) }));
    let order = 1;
    for (const p of this.v.parts.values()) {
      if (p.info.cap === false || !p.meshes.length || !p.meshes[0].visible || p.material.opacity < 0.99) continue;
      this.active.forEach((pl, i) => {
        for (const m of p.meshes) {
          for (const mat of [mats[i].back, mats[i].front]) {
            const s = new THREE.Mesh(m.geometry, mat);
            s.renderOrder = order;
            s.raycast = () => {};
            m.add(s);
            this.stencilChildren.push(s);
          }
        }
        const color = (p.capColor || p.baseColor).clone().multiplyScalar(0.82);
        const capMat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.85,
          metalness: 0,
          side: THREE.DoubleSide,
          clippingPlanes: this.active.filter((_, j) => j !== i),
          stencilWrite: true,
          stencilRef: 0,
          stencilFunc: THREE.NotEqualStencilFunc,
          stencilFail: THREE.ReplaceStencilOp,
          stencilZFail: THREE.ReplaceStencilOp,
          stencilZPass: THREE.ReplaceStencilOp,
        });
        const cap = new THREE.Mesh(this.capGeo, capMat);
        cap.renderOrder = order + 0.1;
        cap.onAfterRender = (renderer) => renderer.clearStencil();
        cap.raycast = () => {};
        this.capGroup.add(cap);
        this.caps.push({ mesh: cap, part: p, plane: pl });
        order++;
      });
    }
    this._layoutCaps();
  }

  _layoutCaps() {
    if (!this.caps.length) return;
    const v = this.v;
    v.root.updateMatrixWorld(true);
    const flipZ = new THREE.Vector3();
    for (const c of this.caps) {
      const center = c.part.centroid.clone();
      v.space.localToWorld(center);
      const r = c.part.box.getSize(new THREE.Vector3()).length() * v.scale * 0.75;
      c.plane.projectPoint(center, c.mesh.position);
      flipZ.copy(c.plane.normal).negate();
      c.mesh.quaternion.setFromUnitVectors(Z, flipZ);
      c.mesh.scale.set(r * 2.6, r * 2.6, 1);
    }
  }
}

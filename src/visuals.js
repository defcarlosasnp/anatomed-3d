import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Calidad visual:
//  - "alta": oclusión ambiental (GTAO), contorno de selección y sombra de contacto en el piso.
//  - "básica": render directo (equipos modestos o celulares).
// Con el corte activo se usa siempre el render directo (las tapas usan el stencil del framebuffer).

export class Visuals {
  constructor(viewer) {
    this.v = viewer;
    const r = viewer.renderer;
    this.quality = 'high';
    // fondo: degradado CSS detrás del canvas transparente (una textura de fondo interfiere con GTAO/Outline)

    // ---- sombras
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    const key = viewer.keyLight;
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 6;
    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ opacity: 0.28, transparent: true, depthWrite: false }));
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.ground.renderOrder = -1;
    viewer.scene.add(this.ground);

    // ---- postproceso
    const size = r.getDrawingBufferSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4, stencilBuffer: true });
    this.composer = new EffectComposer(r, rt);
    this.composer.addPass(new RenderPass(viewer.scene, viewer.camera));
    this.gtao = new GTAOPass(viewer.scene, viewer.camera, size.x, size.y);
    this.gtao.updateGtaoMaterial({ radius: 0.18, distanceExponent: 1.5, thickness: 1.2, scale: 1.0, samples: 12 });
    this.gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
    this.gtao.blendIntensity = 0.85;
    // en el pase de normales/profundidad se excluyen objetos transparentes, el piso y las ayudas
    const orig = this.gtao.renderOverride.bind(this.gtao);
    this.gtao.renderOverride = (...args) => {
      const hidden = [];
      viewer.scene.traverse((o) => {
        if (o.visible && (o.isMesh || o.isLineSegments) && (o.material?.transparent || o === this.ground)) {
          o.visible = false;
          hidden.push(o);
        }
      });
      orig(...args);
      hidden.forEach((o) => (o.visible = true));
    };
    this.composer.addPass(this.gtao);
    this.outline = new OutlinePass(new THREE.Vector2(size.x, size.y), viewer.scene, viewer.camera);
    Object.assign(this.outline, { edgeStrength: 4, edgeGlow: 0.4, edgeThickness: 1.6, pulsePeriod: 0 });
    this.outline.visibleEdgeColor.set('#5ff0dc');
    this.outline.hiddenEdgeColor.set('#1f6f66');
    this.composer.addPass(this.outline);
    this.composer.addPass(new OutputPass());
  }

  setQuality(q) {
    this.quality = q;
    this.ground.visible = q === 'high';
    this.v.keyLight.castShadow = q === 'high';
  }

  /** Ubica el piso con sombra bajo el modelo y ajusta la cámara de sombras. */
  layout() {
    const box = this.v.frameBox();
    if (box.isEmpty()) return;
    const s = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const r = Math.max(s.x, s.y, s.z);
    this.ground.position.set(c.x, box.min.y - r * 0.04, c.z);
    this.ground.scale.set(r * 4, r * 4, 1);
    const key = this.v.keyLight;
    key.position.set(c.x + r * 0.6, c.y + r * 2.2, c.z + r * 0.9);
    key.target.position.copy(c);
    key.target.updateMatrixWorld();
    const cam = key.shadow.camera;
    cam.left = cam.bottom = -r * 1.2;
    cam.right = cam.top = r * 1.2;
    cam.near = 0.01;
    cam.far = r * 6;
    cam.updateProjectionMatrix();
    for (const p of this.v.parts.values()) for (const m of p.meshes) m.castShadow = true;
  }

  setSelection(meshes) {
    this.outline.selectedObjects = meshes || [];
  }

  setSize(w, h) {
    const pr = this.v.renderer.getPixelRatio();
    this.composer.setPixelRatio(pr);
    this.composer.setSize(w, h);
  }

  render() {
    const v = this.v;
    const direct = this.quality !== 'high' || v.clip.enabled;
    if (direct) v.renderer.render(v.scene, v.camera);
    else {
      // la oclusión ambiental se apaga si hay piezas atenuadas (recorridos/quiz) para no oscurecerlas
      this.gtao.enabled = !v.ghostSet;
      this.composer.render();
    }
  }
}

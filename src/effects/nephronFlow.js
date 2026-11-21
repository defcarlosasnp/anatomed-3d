import * as THREE from 'three';
import { PATHS, GLOM } from '../organs/nephron.js';

// Flujo del líquido tubular coloreado por osmolaridad + gradiente intersticial de fondo.
const C100 = new THREE.Color('#7cc4e8');
const C300 = new THREE.Color('#f4f1d0');
const C1200 = new THREE.Color('#e8743b');
const Y_TOP = 9;
const Y_PAP = -9.5;

export function osmColor(osm, out = new THREE.Color()) {
  if (osm <= 300) return out.copy(C100).lerp(C300, Math.max(0, (osm - 100) / 200));
  return out.copy(C300).lerp(C1200, Math.min(1, (osm - 300) / 900));
}
const interstitium = (y) => (y >= 0 ? 300 : 300 + 900 * Math.min(1, -y / -Y_PAP));

export function createNephronFlow(viewer) {
  const state = { running: false, adh: true, t: 0 };
  const extras = new THREE.Group();
  viewer.space.add(extras);

  // ---- fondo: intersticio corteza → papila
  const W = 16;
  const geo = new THREE.PlaneGeometry(W, Y_TOP - Y_PAP, 1, 40);
  const colors = [];
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) + (Y_TOP + Y_PAP) / 2;
    const c = osmColor(interstitium(y));
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const slab = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }));
  slab.position.set(-1, (Y_TOP + Y_PAP) / 2, -2.5);
  extras.add(slab);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-9, 0, -2.4), new THREE.Vector3(7, 0, -2.4)]),
    new THREE.LineDashedMaterial({ color: '#c9d1db', dashSize: 0.4, gapSize: 0.3, transparent: true, opacity: 0.6 }),
  );
  line.computeLineDistances();
  extras.add(line);
  const zone = (y, text) => {
    const l = viewer.addLabel(new THREE.Vector3(-8.6, y, -2.4), text);
    l.element.classList.add('zone');
    l.userData.isLabel = false; // siempre visibles
  };
  zone(7.5, 'CORTEZA · 300 mOsm/kg');
  zone(-1.2, 'MÉDULA EXTERNA · ~600');
  zone(-6.5, 'MÉDULA INTERNA · ~1200');

  // ---- trayecto del líquido: Bowman → proximal → asa → distal → colector
  const g = new THREE.Vector3(...GLOM);
  const segs = [
    { key: 'bowman', pts: [g.toArray(), PATHS.pct[0]] },
    { key: 'pct', pts: PATHS.pct },
    { key: 'dtl', pts: PATHS.dtl },
    { key: 'atl', pts: PATHS.atl },
    { key: 'tal', pts: PATHS.tal },
    { key: 'md', pts: PATHS.md },
    { key: 'dct', pts: PATHS.dct },
    { key: 'cd', pts: PATHS.cd },
  ];
  const samples = []; // {p, seg, u}
  for (const s of segs) {
    const curve = new THREE.CatmullRomCurve3(s.pts.map((p) => new THREE.Vector3(...p)));
    const n = Math.max(8, Math.round(curve.getLength() * 6));
    for (let i = 0; i <= n; i++) samples.push({ p: curve.getPointAt(i / n), seg: s.key, u: i / n });
  }
  const cum = [0];
  for (let i = 1; i < samples.length; i++) cum.push(cum[i - 1] + samples[i].p.distanceTo(samples[i - 1].p));
  const total = cum[cum.length - 1];

  function osmAt(s) {
    const y = s.p.y;
    switch (s.seg) {
      case 'bowman':
      case 'pct':
        return 300;
      case 'dtl':
      case 'atl':
        return interstitium(y);
      case 'tal': {
        const start = interstitium(PATHS.tal[0][1]);
        return start + (100 - start) * Math.min(1, s.u * 1.15);
      }
      case 'md':
      case 'dct':
        return 100;
      case 'cd':
        return state.adh ? Math.max(100, interstitium(y) * (y < 0 ? 0.97 : 1)) * (y >= 0 ? Math.min(1, 0.4 + s.u * 2.5) : 1) : 100 - 50 * s.u;
    }
    return 300;
  }

  const N = 70;
  const mat = new THREE.MeshBasicMaterial({ vertexColors: false });
  const pGeo = new THREE.SphereGeometry(0.13, 10, 8);
  const particles = new THREE.InstancedMesh(pGeo, mat, N);
  particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  particles.visible = false;
  particles.renderOrder = 5;
  extras.add(particles);
  const m4 = new THREE.Matrix4();
  const col = new THREE.Color();
  let idx = 0;

  function sampleAt(d) {
    while (idx > 0 && cum[idx] > d) idx--;
    while (idx < cum.length - 2 && cum[idx + 1] < d) idx++;
    const a = samples[idx];
    const b = samples[idx + 1];
    const k = (d - cum[idx]) / Math.max(1e-6, cum[idx + 1] - cum[idx]);
    return { p: a.p.clone().lerp(b.p, k), seg: a.seg, u: a.u + (b.u - a.u) * k };
  }

  function tick(dt) {
    state.t += dt;
    idx = 0;
    for (let i = 0; i < N; i++) {
      const d = ((i / N + state.t * 0.035) % 1) * total;
      const s = sampleAt(d);
      m4.makeTranslation(s.p.x, s.p.y, s.p.z);
      particles.setMatrixAt(i, m4);
      particles.setColorAt(i, osmColor(osmAt(s), col));
    }
    particles.instanceMatrix.needsUpdate = true;
    if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
  }

  return {
    get running() {
      return state.running;
    },
    start() {
      state.running = true;
      particles.visible = true;
      viewer.tickers.add(tick);
    },
    stop() {
      state.running = false;
      particles.visible = false;
      viewer.tickers.delete(tick);
    },
    setAdh(v) {
      state.adh = v;
    },
    dispose() {
      this.stop();
    },
  };
}

import * as THREE from 'three';

// Fases del ciclo normalizadas (0–1 = un latido)
const PHASES = [
  { end: 0.13, name: 'Sístole auricular', av: true, sl: false },
  { end: 0.19, name: 'Contracción isovolumétrica', av: false, sl: false },
  { end: 0.47, name: 'Eyección ventricular', av: false, sl: true },
  { end: 0.56, name: 'Relajación isovolumétrica', av: false, sl: false },
  { end: 0.75, name: 'Llenado ventricular rápido', av: true, sl: false },
  { end: 1.0, name: 'Diástasis', av: true, sl: false },
];

const ATRIA = ['ra', 'la'];
const VENTRICLES = ['rv', 'lv', 'ivs', 'chordae', 'pm_rv_post', 'pm_rv_ant', 'pm_rv_sep', 'pm_lv_al', 'pm_lv_pm', 'rca', 'rca_il', 'cx', 'lad', 'lad_sep', 'gcv', 'mcv', 'ilv'];
const AV_VALVES = ['tv', 'mv'];
const SL_VALVES = ['ao_l', 'ao_n', 'ao_r', 'pv_a', 'pv_l', 'pv_r'];

const g = (x, mu, s) => Math.exp(-((x - mu) ** 2) / (2 * s * s));
export function ecg(p) {
  return 0.14 * g(p, 0.06, 0.022) - 0.08 * g(p, 0.135, 0.006) + 1.0 * g(p, 0.15, 0.007) - 0.22 * g(p, 0.166, 0.007) + 0.28 * g(p, 0.38, 0.04);
}
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
function ventContraction(p) {
  return smooth(0.13, 0.26, p) * (1 - smooth(0.4, 0.54, p));
}
function atrialContraction(p) {
  return p < 0.14 ? Math.sin((p / 0.14) * Math.PI) : 0;
}

export function createHeartbeat(viewer, els) {
  const state = { running: false, bpm: 60, phase: 0, conduction: false };
  const ctx = els.canvas.getContext('2d');
  let sweepX = 0;
  let lastY = null;

  // pivotes
  const centroidOf = (keys) => {
    const b = new THREE.Box3();
    keys.forEach((k) => viewer.parts.get(k) && b.union(viewer.parts.get(k).box));
    return b.getCenter(new THREE.Vector3());
  };
  const pivA = centroidOf(ATRIA);
  const pivV = centroidOf(['rv', 'lv']);

  const tmp = new THREE.Matrix4();
  const scaleAbout = (obj, pivot, s) => {
    obj.matrixAutoUpdate = false;
    tmp.makeTranslation(pivot.x, pivot.y, pivot.z)
      .multiply(new THREE.Matrix4().makeScale(s, s, s))
      .multiply(new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z));
    obj.matrix.multiplyMatrices(tmp, obj.userData.baseMatrix);
    obj.matrixWorldNeedsUpdate = true;
  };

  // ------------------------------------------------ sistema de conducción
  const cond = buildConduction(viewer);

  // ------------------------------------------------ ECG UI
  els.valves.innerHTML = `
    <span><i data-v="av"></i> Tricúspide / Mitral</span>
    <span><i data-v="sl"></i> Pulmonar / Aórtica</span>`;
  const avDot = els.valves.querySelector('[data-v=av]');
  const slDot = els.valves.querySelector('[data-v=sl]');

  function drawEcg(prevPhaseAbs, phaseAbs, dt) {
    const W = els.canvas.width;
    const H = els.canvas.height;
    const pxPerSec = W / 4; // 4 s en pantalla
    const steps = Math.max(1, Math.round(dt * pxPerSec));
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#5ee6a8';
    for (let i = 1; i <= steps; i++) {
      const p = prevPhaseAbs + ((phaseAbs - prevPhaseAbs) * i) / steps;
      const y = H * 0.7 - ecg(p % 1) * H * 0.55;
      ctx.clearRect(sweepX, 0, 14, H);
      if (lastY !== null) {
        ctx.beginPath();
        ctx.moveTo(sweepX - 1, lastY);
        ctx.lineTo(sweepX, y);
        ctx.stroke();
      }
      lastY = y;
      sweepX++;
      if (sweepX >= W) {
        sweepX = 0;
        lastY = null;
      }
    }
  }

  function tick(dt) {
    const prevAbs = state.phase;
    state.phase += dt * (state.bpm / 60);
    const p = state.phase % 1;

    const a = atrialContraction(p);
    const v = ventContraction(p);
    for (const k of ATRIA) {
      const part = viewer.parts.get(k);
      if (part) scaleAbout(part.obj, pivA, 1 - 0.06 * a);
    }
    for (const k of VENTRICLES) {
      const part = viewer.parts.get(k);
      if (part) scaleAbout(part.obj, pivV, 1 - 0.065 * v);
    }

    const ph = PHASES.find((x) => p < x.end);
    if (ph !== state.lastPhase) {
      state.lastPhase = ph;
      els.phase.textContent = ph.name;
      avDot.classList.toggle('open', ph.av);
      slDot.classList.toggle('open', ph.sl);
      AV_VALVES.forEach((k) => viewer.setTint(k, ph.av ? '#1f6b3a' : '#5a1c18'));
      SL_VALVES.forEach((k) => viewer.setTint(k, ph.sl ? '#1f6b3a' : '#5a1c18'));
    }
    drawEcg(prevAbs, state.phase, dt);
    if (state.conduction) cond.update(p);
  }

  function reset() {
    for (const k of [...ATRIA, ...VENTRICLES]) {
      const part = viewer.parts.get(k);
      if (part) {
        part.obj.matrix.copy(part.obj.userData.baseMatrix);
        part.obj.matrixWorldNeedsUpdate = true;
      }
    }
    [...AV_VALVES, ...SL_VALVES].forEach((k) => viewer.setTint(k, null));
    state.lastPhase = null;
  }

  return {
    get running() {
      return state.running;
    },
    start() {
      if (state.running) return;
      state.running = true;
      ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
      sweepX = 0;
      lastY = null;
      viewer.tickers.add(tick);
    },
    stop() {
      state.running = false;
      viewer.tickers.delete(tick);
      reset();
    },
    setBpm(b) {
      state.bpm = b;
    },
    setRate(b) {
      state.bpm = b;
    },
    setConduction(on) {
      state.conduction = on;
      cond.setVisible?.(on);
      if (!on) cond.group.visible = false;
    },
    dispose() {
      this.stop();
      cond.dispose();
    },
  };
}

// --------------------------------------------------------------------------
// Sistema de conducción esquemático: puntos estimados a partir de las mallas.
function buildConduction(viewer) {
  const group = new THREE.Group();
  group.visible = false;
  viewer.space.add(group);
  const P = (k) => viewer.parts.get(k);
  if (!P('ra') || !P('lv') || !P('rv')) return { group, update() {}, dispose() {} };

  const valveKeys = ['tv', 'mv', 'ao_l', 'ao_n', 'ao_r', 'pv_a', 'pv_l', 'pv_r'].filter(P);
  const valveCenter = new THREE.Vector3();
  valveKeys.forEach((k) => valveCenter.add(P(k).centroid));
  valveCenter.divideScalar(valveKeys.length);

  const farthest = (key, from) => {
    let best = null;
    let bd = -1;
    const v = new THREE.Vector3();
    for (const m of P(key).meshes) {
      const pos = m.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.userData.toSpace);
        const d = v.distanceToSquared(from);
        if (d > bd) (bd = d), (best = v.clone());
      }
    }
    return best;
  };

  const sa = viewer.nearestVertex('ra', P('svc') ? P('svc').centroid : P('ra').box.max);
  // nodo AV: en el tabique interauricular, junto a la inserción septal de la tricúspide
  const septalTv = P('tv') && P('ivs') ? viewer.nearestVertex('tv', P('ivs').centroid) : valveCenter;
  const av = viewer.nearestVertex('ra', septalTv);
  const lvApex = farthest('lv', valveCenter);
  const rvApex = farthest('rv', valveCenter);
  const septum = lvApex.clone().lerp(rvApex, 0.5);
  const his = av.clone().lerp(septum, 0.22);
  const toward = (a, b, t) => a.clone().lerp(b, t);
  // ligera desviación de las ramas hacia su ventrículo
  const lbMid = toward(his, lvApex, 0.5).lerp(P('lv').centroid, 0.25);
  const rbMid = toward(his, rvApex, 0.5).lerp(P('rv').centroid, 0.25);

  const size = P('lv').box.getSize(new THREE.Vector3()).length();
  const radius = size * 0.012;
  const mat = new THREE.MeshBasicMaterial({ color: '#ffd84a', transparent: true, opacity: 0.85, depthTest: false });
  const tube = (pts) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 8, false), mat);
    mesh.renderOrder = 10;
    group.add(mesh);
    return curve;
  };
  const internodal = tube([sa, toward(sa, av, 0.5).lerp(P('ra').centroid, 0.3), av]);
  const hisC = tube([av, his]);
  const leftC = tube([his, lbMid, lvApex]);
  const rightC = tube([his, rbMid, rvApex]);

  const node = (pos, r, color) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true }));
    m.position.copy(pos);
    m.renderOrder = 11;
    group.add(m);
    return m;
  };
  const saNode = node(sa, radius * 3.2, '#ffef9a');
  const avNode = node(av, radius * 2.8, '#ffef9a');
  const pulses = [node(sa, radius * 2.4, '#ffffff'), node(his, radius * 2.4, '#ffffff'), node(his, radius * 2.4, '#ffffff')];

  const labels = [viewer.addLabel(sa, 'Nodo SA'), viewer.addLabel(av, 'Nodo AV'), viewer.addLabel(his, 'Haz de His')];
  labels.forEach((l) => {
    group.add(l);
    l.userData.isLabel = false; // no las controla el botón "Etiquetas"
    l.visible = false; // CSS2DRenderer no hereda la visibilidad del padre
  });

  function update(p) {
    // P (aurículas): 0.02–0.10 · retraso AV: 0.10–0.13 · His–Purkinje: 0.13–0.17
    const [a, b, c] = pulses;
    saNode.scale.setScalar(p < 0.04 ? 1.6 : 1);
    avNode.scale.setScalar(p > 0.09 && p < 0.13 ? 1.5 : 1);
    if (p < 0.02) {
      a.visible = true;
      a.position.copy(sa);
      b.visible = c.visible = false;
    } else if (p < 0.1) {
      a.visible = true;
      a.position.copy(internodal.getPoint((p - 0.02) / 0.08));
      b.visible = c.visible = false;
    } else if (p < 0.13) {
      a.visible = true;
      a.position.copy(av);
      b.visible = c.visible = false;
    } else if (p < 0.145) {
      a.visible = true;
      a.position.copy(hisC.getPoint((p - 0.13) / 0.015));
      b.visible = c.visible = false;
    } else if (p < 0.18) {
      const t = (p - 0.145) / 0.035;
      a.visible = false;
      b.visible = c.visible = true;
      b.position.copy(leftC.getPoint(t));
      c.position.copy(rightC.getPoint(t));
    } else {
      a.visible = b.visible = c.visible = false;
    }
  }

  return {
    group,
    update,
    setVisible(v) {
      group.visible = v;
      labels.forEach((l) => (l.visible = v));
    },
    dispose() {
      viewer.space.remove(group);
    },
  };
}

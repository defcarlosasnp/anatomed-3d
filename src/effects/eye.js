import * as THREE from 'three';

// Ojo izquierdo. Coordenadas del modelo: +X lateral (izquierda del paciente), +Y arriba, +Z anterior.
//  - Acomodación: ciclo lejos ↔ cerca (cristalino más convexo, miosis, contracción ciliar).
//  - Movimientos oculares: 6 posiciones diagnósticas de la mirada (prueba en "H").

const GLOBE = ['cornea', 'sclera', 'csj', 'conj_bulbar', 'iris', 'pupil', 'ciliary_body', 'ciliary_muscle', 'ciliary_proc', 'zonule', 'lens', 'aqueous', 'trabecular', 'schlemm', 'vitreous', 'retina', 'macula', 'fovea', 'optic_disc', 'ora', 'choroid'];

export const GAZES = [
  { id: 'primary', label: 'Posición primaria', yaw: 0, pitch: 0, muscles: [], text: 'Mirada al frente.' },
  { id: 'abd', label: '→ Afuera (abducción)', yaw: 28, pitch: 0, muscles: ['m_lr'], text: 'Recto lateral, inervado por el VI par (abducens). Su parálisis impide la abducción y produce diplopía horizontal al mirar hacia el lado afectado.' },
  { id: 'add', label: '← Adentro (aducción)', yaw: -28, pitch: 0, muscles: ['m_mr'], text: 'Recto medial, inervado por el III par (motor ocular común).' },
  { id: 'up_out', label: '↗ Arriba y afuera', yaw: 22, pitch: 22, muscles: ['m_sr'], text: 'En abducción, el recto superior (III par) es el elevador puro. Así se explora en la prueba en H.' },
  { id: 'up_in', label: '↖ Arriba y adentro', yaw: -22, pitch: 22, muscles: ['m_io'], text: 'En aducción, el oblicuo inferior (III par) es el elevador principal.' },
  { id: 'down_out', label: '↘ Abajo y afuera', yaw: 22, pitch: -22, muscles: ['m_ir'], text: 'En abducción, el recto inferior (III par) es el depresor puro.' },
  { id: 'down_in', label: '↙ Abajo y adentro', yaw: -22, pitch: -22, muscles: ['m_so', 'trochlea'], text: 'En aducción, el oblicuo superior (IV par, troclear) es el depresor principal. Su parálisis produce diplopía al bajar escaleras o leer, y el paciente compensa inclinando la cabeza hacia el lado sano.' },
];

export function createEye(viewer, els) {
  const P = (k) => viewer.parts.get(k);
  const globe = GLOBE.map(P).filter(Boolean);
  const center = P('sclera') ? P('sclera').centroid.clone() : new THREE.Vector3();
  const lens = P('lens');
  const pupil = P('pupil');
  const cil = P('ciliary_muscle');
  const state = { running: false, rate: 10, phase: 0, q: new THREE.Quaternion(), target: new THREE.Quaternion(), gaze: 'primary' };
  const ctx = els.canvas.getContext('2d');
  let sweepX = 0;
  let lastY = null;

  const tmp = new THREE.Matrix4();
  const about = (pivot, m) => new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z).multiply(m).multiply(new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z));

  function apply(near) {
    // rotación de todo el globo (mirada)
    const R = about(center, new THREE.Matrix4().makeRotationFromQuaternion(state.q));
    for (const p of globe) {
      let local = new THREE.Matrix4();
      if (p === lens && near) local = about(p.centroid, new THREE.Matrix4().makeScale(1 - 0.06 * near, 1 - 0.06 * near, 1 + 0.32 * near));
      if (p === pupil && near) local = about(p.centroid, new THREE.Matrix4().makeScale(1 - 0.35 * near, 1 - 0.35 * near, 1));
      if (p === cil && near) local = about(p.centroid, new THREE.Matrix4().makeScale(1 - 0.04 * near, 1 - 0.04 * near, 1));
      tmp.multiplyMatrices(R, local);
      p.obj.matrixAutoUpdate = false;
      p.obj.matrix.multiplyMatrices(tmp, p.obj.userData.baseMatrix);
      p.obj.matrixWorldNeedsUpdate = true;
    }
  }

  // ---- acomodación (usa el panel de monitor)
  const nearOf = (p) => (p < 0.15 ? 0 : p < 0.35 ? (p - 0.15) / 0.2 : p < 0.65 ? 1 : p < 0.85 ? 1 - (p - 0.65) / 0.2 : 0);
  const smooth = (x) => x * x * (3 - 2 * x);
  function draw(prev, cur, dt) {
    const W = els.canvas.width;
    const H = els.canvas.height;
    const steps = Math.max(1, Math.round(dt * (W / 12)));
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f2c14e';
    for (let i = 1; i <= steps; i++) {
      const p = prev + ((cur - prev) * i) / steps;
      const y = H * 0.85 - smooth(nearOf(p % 1)) * H * 0.7;
      ctx.clearRect(sweepX, 0, 14, H);
      if (lastY !== null) {
        ctx.beginPath();
        ctx.moveTo(sweepX - 1, lastY);
        ctx.lineTo(sweepX, y);
        ctx.stroke();
      }
      lastY = y;
      if (++sweepX >= W) (sweepX = 0), (lastY = null);
    }
  }
  function setPanel(near) {
    els.phase.textContent = near > 0.5 ? 'Visión cercana: acomodación' : 'Visión lejana: cristalino aplanado';
    els.valves.innerHTML = `
      <span>Músculo ciliar: <b>${near > 0.5 ? 'contraído (III par, M₃)' : 'relajado'}</b></span>
      <span>Zónula: <b>${near > 0.5 ? 'laxa' : 'tensa'}</b></span>
      <span>Cristalino: <b>+${(near * 10).toFixed(1)} D</b></span>
      <span>Pupila: <b>${near > 0.5 ? 'miosis' : 'normal'}</b></span>`;
  }

  // ---- interpolación de la mirada
  function tickGaze(dt) {
    state.q.slerp(state.target, Math.min(1, dt * 6));
  }

  let lastNearBucket = -1;
  function tick(dt) {
    tickGaze(dt);
    let near = 0;
    if (state.running) {
      const prev = state.phase;
      state.phase += dt * (state.rate / 60);
      near = smooth(nearOf(state.phase % 1));
      draw(prev, state.phase, dt);
      const b = Math.round(near * 10);
      if (b !== lastNearBucket) (lastNearBucket = b), setPanel(near);
    }
    apply(near);
  }
  viewer.tickers.add(tick);

  return {
    get running() {
      return state.running;
    },
    start() {
      state.running = true;
      ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
      sweepX = 0;
      lastY = null;
      setPanel(0);
    },
    stop() {
      state.running = false;
    },
    setRate(r) {
      state.rate = r;
    },
    gaze(id) {
      const g = GAZES.find((x) => x.id === id) || GAZES[0];
      state.gaze = g.id;
      // abducción del ojo izquierdo = rotación +Y; elevación = rotación −X
      state.target.setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(-g.pitch), THREE.MathUtils.degToRad(g.yaw), 0, 'YXZ'));
      for (const k of ['m_sr', 'm_ir', 'm_mr', 'm_lr', 'm_so', 'trochlea', 'm_io']) viewer.setTint(k, g.muscles.includes(k) ? '#1f8f5a' : null);
      return g;
    },
    dispose() {
      viewer.tickers.delete(tick);
      for (const p of globe) {
        p.obj.matrix.copy(p.obj.userData.baseMatrix);
        p.obj.matrixWorldNeedsUpdate = true;
      }
    },
  };
}

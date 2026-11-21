import * as THREE from 'three';

// Ventilación en reposo: expansión de los pulmones + espirograma + presiones.
// Ciclo normalizado 0–1, relación I:E ≈ 1:2.
const TI = 0.36;
const FIXED = new Set(['trachea', 'trach_cart', 'carina', 'mb_r', 'mb_l', 'cart_main']);

export function volumeFrac(p) {
  return p < TI ? (1 - Math.cos((Math.PI * p) / TI)) / 2 : (1 + Math.cos((Math.PI * (p - TI)) / (1 - TI))) / 2;
}
function flow(p) {
  // derivada normalizada (signo = dirección del flujo)
  return p < TI ? Math.sin((Math.PI * p) / TI) : -Math.sin((Math.PI * (p - TI)) / (1 - TI)) * (TI / (1 - TI));
}

export function createBreathing(viewer, els) {
  const state = { running: false, rate: 12, phase: 0 };
  const ctx = els.canvas.getContext('2d');
  let sweepX = 0;
  let lastY = null;

  const box = new THREE.Box3();
  for (const p of viewer.parts.values()) if (!FIXED.has(p.key)) box.union(p.box);
  const c = box.getCenter(new THREE.Vector3());
  const pivot = new THREE.Vector3(c.x, box.max.y, c.z);
  const movable = [...viewer.parts.values()].filter((p) => !FIXED.has(p.key));
  const m = new THREE.Matrix4();
  const tmpS = new THREE.Matrix4();

  els.valves.innerHTML = `
    <span>P. alveolar: <b data-v="palv">0</b> cmH₂O</span>
    <span>P. pleural: <b data-v="ppl">−5</b> cmH₂O</span>
    <span>Volumen: <b data-v="vol">2400</b> mL</span>
    <span>Flujo: <b data-v="flow">0</b></span>`;
  const out = Object.fromEntries([...els.valves.querySelectorAll('[data-v]')].map((e) => [e.dataset.v, e]));

  function draw(prev, cur, dt) {
    const W = els.canvas.width;
    const H = els.canvas.height;
    const steps = Math.max(1, Math.round(dt * (W / 12))); // 12 s en pantalla
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#7cc4e8';
    for (let i = 1; i <= steps; i++) {
      const p = prev + ((cur - prev) * i) / steps;
      const y = H * 0.85 - volumeFrac(p % 1) * H * 0.7;
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

  function tick(dt) {
    const prev = state.phase;
    state.phase += dt * (state.rate / 60);
    const p = state.phase % 1;
    const v = volumeFrac(p);
    tmpS.makeScale(1 + 0.03 * v, 1 + 0.075 * v, 1 + 0.04 * v);
    m.makeTranslation(pivot.x, pivot.y, pivot.z).multiply(tmpS).multiply(new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z));
    for (const part of movable) {
      part.obj.matrixAutoUpdate = false;
      part.obj.matrix.multiplyMatrices(m, part.obj.userData.baseMatrix);
      part.obj.matrixWorldNeedsUpdate = true;
    }
    const f = flow(p);
    els.phase.textContent = p < TI ? 'Inspiración (activa: diafragma)' : 'Espiración (pasiva: retracción elástica)';
    out.palv.textContent = (-f).toFixed(1).replace('-', '−');
    out.ppl.textContent = (-5 - 2.5 * v).toFixed(1).replace('-', '−');
    out.vol.textContent = Math.round(2400 + 500 * v);
    out.flow.textContent = f > 0.05 ? '→ entra' : f < -0.05 ? '← sale' : '0';
    draw(prev, state.phase, dt);
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
      for (const part of movable) {
        part.obj.matrix.copy(part.obj.userData.baseMatrix);
        part.obj.matrixWorldNeedsUpdate = true;
      }
    },
    setRate(r) {
      state.rate = r;
    },
    dispose() {
      this.stop();
    },
  };
}

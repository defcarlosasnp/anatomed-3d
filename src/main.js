import './style.css';
import { Viewer } from './viewer.js';
import { organs, comingSoon } from './organs/index.js';
import { createHeartbeat } from './effects/heartbeat.js';
import { createStomachEffects } from './effects/stomach.js';
import { createChordae } from './effects/heartExtras.js';
import { createBreathing } from './effects/breathing.js';
import { createNephronFlow } from './effects/nephronFlow.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const viewer = new Viewer($('#viewport'));
// los popovers van en <body>: la barra usa transform, lo que rompe position: fixed
document.querySelectorAll('.tool-pop').forEach((p) => document.body.appendChild(p));
let organ = null;
let fx = {}; // efectos del órgano actual (heartbeat / stomach)
let selection = null; // { key, region }
let mode = 'explore'; // explore | tour | quiz
let labelsOn = false;

// ======================================================== pestañas de órganos
function buildTabs() {
  const nav = $('#organ-tabs');
  nav.innerHTML = '';
  organs.forEach((o) => {
    const b = document.createElement('button');
    b.className = 'organ-tab';
    b.textContent = o.name;
    b.dataset.id = o.id;
    b.onclick = () => loadOrgan(o.id);
    nav.appendChild(b);
  });
  comingSoon.forEach((name) => {
    const b = document.createElement('button');
    b.className = 'organ-tab';
    b.disabled = true;
    b.innerHTML = `${esc(name)}<small>pronto</small>`;
    nav.appendChild(b);
  });
}

async function loadOrgan(id) {
  if (organ?.id === id) return;
  stopModes();
  fx.anim?.ctrl.dispose?.();
  fx.anim?.ctrl.stop?.();
  fx = {};
  organ = organs.find((o) => o.id === id);
  document.querySelectorAll('.organ-tab').forEach((b) => b.classList.toggle('on', b.dataset.id === id));
  history.replaceState(null, '', `#${id}`);
  $('#loading').classList.remove('hidden');
  $('#organ-title').textContent = organ.name;
  $('#organ-sub').textContent = organ.subtitle;
  selection = null;

  try {
    await viewer.load(organ);
  } catch (err) {
    console.error(err);
    $('#loading').innerHTML = `<span>No se pudo cargar el modelo: ${esc(err.message)}</span>`;
    return;
  }

  // efectos específicos
  const monitor = { canvas: $('#ecg-canvas'), phase: $('#ecg-phase'), valves: $('#valve-state') };
  if (organ.id === 'heart') createChordae(viewer);
  if (organ.regions) {
    const lm = organ.landmarks ? await fetch(organ.landmarks).then((r) => r.json()) : [];
    fx.stomach = createStomachEffects(viewer, organ, lm);
  }
  if (organ.animation === 'heartbeat') {
    fx.heart = createHeartbeat(viewer, monitor);
    fx.anim = { label: 'Latido', panel: { label: 'FC', unit: 'lpm', min: 40, max: 160, value: 60 }, ctrl: fx.heart };
  } else if (organ.animation === 'breathing') {
    fx.anim = { label: 'Respiración', panel: { label: 'FR', unit: 'rpm', min: 6, max: 40, value: 12 }, ctrl: createBreathing(viewer, monitor) };
  } else if (organ.animation === 'peristalsis' && fx.stomach) {
    const st = fx.stomach;
    fx.anim = {
      label: 'Peristaltismo',
      chip: 'Ondas peristálticas antrales · real ≈ 3/min (acelerado ×5)',
      ctrl: { start: () => st.startPeristalsis(), stop: () => st.stopPeristalsis(), get running() { return st.peristalsis; } },
    };
  } else if (organ.animation === 'flow') {
    fx.nephron = createNephronFlow(viewer);
    fx.anim = { label: 'Flujo', chip: 'Color = osmolaridad del líquido tubular: azul ~100 · crema 300 · naranja ~1200 mOsm/kg', ctrl: fx.nephron };
  }
  buildLabels();
  buildTree();
  buildPhysiology();
  configureToolbar();
  renderInfo();
  $('#loading').classList.add('hidden');
}

// ============================================================ etiquetas
function buildLabels() {
  if (fx.stomach) {
    for (const l of fx.stomach.landmarks()) {
      const name = organ.landmarkNames?.[l.en] || l.en;
      viewer.addLabel(l.pos, name);
    }
  }
  for (const k of organ.labelParts || []) addPartLabel(k);
  viewer.setLabelsVisible(labelsOn);
}
function addPartLabel(key) {
  const p = viewer.parts.get(key);
  if (!p) return;
  const pos = viewer.outerPoint(key);
  if (pos) viewer.addLabel(pos, p.info.name, () => select({ key }, true));
}

// ======================================================= árbol de estructuras
function buildTree() {
  const tree = $('#tree');
  tree.innerHTML = '';
  for (const g of organ.groups) {
    const keys = [...viewer.parts.keys()].filter((k) => organ.parts[k].group === g.id);
    if (!keys.length) continue;
    const div = document.createElement('div');
    div.className = 'group';
    div.dataset.group = g.id;
    div.innerHTML = `
      <div class="group-head">
        <span class="caret">▾</span>
        <button class="eye" title="Mostrar/ocultar grupo">👁</button>
        <span class="swatch" style="background:${g.color}"></span>
        <span>${esc(g.name)}</span>
        <span class="count">${keys.length}</span>
      </div>
      <div class="items"></div>`;
    const items = div.querySelector('.items');
    for (const k of keys) {
      const p = viewer.parts.get(k);
      const row = document.createElement('div');
      row.className = 'item';
      row.dataset.key = k;
      row.innerHTML = `<button class="eye" title="Mostrar/ocultar">👁</button><span class="swatch" style="background:#${p.baseColor.getHexString()}"></span><span class="name">${esc(p.info.name)}</span>`;
      row.querySelector('.eye').onclick = (e) => {
        e.stopPropagation();
        viewer.setVisible(k, !p.visible);
        syncTree();
      };
      row.onclick = () => {
        if (!p.visible) viewer.setVisible(k, true), syncTree();
        if (mode === 'quiz') return;
        select({ key: k }, true);
      };
      row.onmouseenter = () => viewer.setHover(k);
      row.onmouseleave = () => viewer.setHover(null);
      items.appendChild(row);

      // regiones del estómago como subelementos
      if (organ.regions?.part === k) {
        for (const r of organ.regions.list) {
          const rr = document.createElement('div');
          rr.className = 'item region';
          rr.dataset.key = k;
          rr.dataset.region = r.key;
          rr.style.paddingLeft = '48px';
          rr.innerHTML = `<span class="swatch" style="background:${r.color}"></span><span class="name">${esc(r.name)}</span>`;
          rr.onclick = () => mode !== 'quiz' && select({ key: k, region: r.key }, true);
          rr.onmouseenter = () => fx.stomach?.setHover(r.key);
          rr.onmouseleave = () => fx.stomach?.setHover(null);
          items.appendChild(rr);
        }
      }
    }
    div.querySelector('.group-head').onclick = () => div.classList.toggle('collapsed');
    div.querySelector('.group-head .eye').onclick = (e) => {
      e.stopPropagation();
      const anyVisible = keys.some((k) => viewer.parts.get(k).visible);
      keys.forEach((k) => viewer.setVisible(k, !anyVisible));
      syncTree();
    };
    tree.appendChild(div);
  }
  syncTree();
  filterTree($('#search').value);
}

function syncTree() {
  document.querySelectorAll('#tree .group').forEach((gEl) => {
    const rows = [...gEl.querySelectorAll('.item:not(.region)')];
    let any = false;
    rows.forEach((row) => {
      const p = viewer.parts.get(row.dataset.key);
      row.classList.toggle('hidden-part', !p.visible);
      row.querySelector('.eye').classList.toggle('off', !p.visible);
      any ||= p.visible;
    });
    gEl.querySelector('.group-head .eye').classList.toggle('off', !any);
  });
  document.querySelectorAll('#tree .item').forEach((row) => {
    const sel = selection && row.dataset.key === selection.key && (row.dataset.region || null) === (selection.region || null);
    row.classList.toggle('sel', !!sel);
  });
}

function filterTree(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('#tree .group').forEach((gEl) => {
    let shown = 0;
    gEl.querySelectorAll('.item').forEach((row) => {
      const info = row.dataset.region
        ? organ.regions.list.find((r) => r.key === row.dataset.region)
        : organ.parts[row.dataset.key];
      const hay = `${info.name} ${info.en}`.toLowerCase();
      const ok = !q || hay.includes(q);
      row.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    gEl.style.display = shown ? '' : 'none';
    if (q) gEl.classList.remove('collapsed');
  });
}
$('#search').addEventListener('input', (e) => filterTree(e.target.value));

// ============================================================== selección
function select(sel, focus = false) {
  selection = sel;
  viewer.setSelected(sel && !sel.region ? sel.key : null);
  fx.stomach?.setSelected(sel?.region || null);
  if (sel && focus) viewer.focusOn([sel.key]);
  syncTree();
  renderInfo();
  if (sel) {
    switchTab('info');
    document.querySelector(`#tree .item.sel`)?.scrollIntoView({ block: 'nearest' });
  }
}

function infoFor(sel) {
  if (!sel) return null;
  if (sel.region) {
    const r = organ.regions.list.find((x) => x.key === sel.region);
    return { ...r, groupName: 'Región del estómago', groupColor: r.color };
  }
  const p = organ.parts[sel.key];
  const g = organ.groups.find((x) => x.id === p.group);
  const gi = organ.groupInfo?.[p.group] || {};
  return { ...p, func: p.func || gi.func, clinic: p.clinic || gi.clinic, groupName: g?.name, groupColor: g?.color };
}

function renderInfo() {
  const el = $('#tab-info');
  const info = infoFor(selection);
  if (!info) {
    el.innerHTML = `
      <div class="info-empty">
        <span class="big">${organ?.icon || '🫀'}</span>
        Haz <b>clic</b> en una estructura del modelo o de la lista para ver su anatomía y fisiología.<br><br>
        <span class="small">🖱 Arrastrar: rotar · Rueda: zoom · Clic derecho: mover · Doble clic: enfocar<br>📱 Un dedo: rotar · Pellizcar: zoom · Dos dedos: mover</span>
      </div>`;
    return;
  }
  el.innerHTML = `
    <div class="info">
      <span class="badge"><span class="swatch" style="background:${info.groupColor}"></span>${esc(info.groupName)}</span>
      <h2>${esc(info.name)}</h2>
      <div class="en">${esc(info.en)}</div>
      ${info.desc ? `<h4>Anatomía</h4><p>${esc(info.desc)}</p>` : ''}
      ${info.func ? `<h4>Fisiología</h4><p>${esc(info.func)}</p>` : ''}
      ${info.clinic ? `<h4>Correlación clínica</h4><p class="clinic">${esc(info.clinic)}</p>` : ''}
      <div class="info-actions">
        <button data-a="focus">🎯 Enfocar</button>
        ${selection.region ? '' : '<button data-a="isolate">◎ Aislar</button><button data-a="hide">🚫 Ocultar</button>'}
        <button data-a="showall">👁 Restaurar vista</button>
      </div>
    </div>`;
  el.querySelectorAll('[data-a]').forEach((b) => {
    b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'focus') viewer.focusOn([selection.key]);
      if (a === 'isolate') {
        for (const k of viewer.parts.keys()) viewer.setVisible(k, k === selection.key);
        viewer.focusOn([selection.key]);
      }
      if (a === 'hide') {
        viewer.setVisible(selection.key, false);
        select(null);
      }
      if (a === 'showall') for (const [k, p] of viewer.parts) viewer.setVisible(k, !p.info.hidden);
      syncTree();
    };
  });
}

function buildPhysiology() {
  $('#tab-phys').innerHTML = `<div class="phys">${organ.physiology
    .map((s) => `<details ${s.open ? 'open' : ''}><summary>${esc(s.title)}</summary><div>${s.html}</div></details>`)
    .join('')}</div>`;
}

function switchTab(t) {
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('on', b.dataset.tab === t));
  $('#tab-info').classList.toggle('hidden', t !== 'info');
  $('#tab-phys').classList.toggle('hidden', t !== 'phys');
}
document.querySelectorAll('.tab').forEach((b) => (b.onclick = () => switchTab(b.dataset.tab)));

// ============================================================ eventos 3D
const tooltip = $('#tooltip');
function nameOf(res) {
  if (!res) return null;
  const region = fx.stomach && res.key === organ.regions?.part ? fx.stomach.regionOf(res.hit) : null;
  const info = region ? organ.regions.list.find((r) => r.key === region) : organ.parts[res.key];
  return { region, label: region ? `${organ.parts[res.key].name} · ${info.name}` : info.name };
}

viewer.on('hover', (res, e) => {
  const n = nameOf(res);
  if (!n || mode === 'quiz') {
    tooltip.classList.add('hidden');
    viewer.setHover(null);
    fx.stomach?.setHover(null);
    viewer.renderer.domElement.style.cursor = n ? 'pointer' : '';
    return;
  }
  viewer.renderer.domElement.style.cursor = 'pointer';
  viewer.setHover(n.region ? null : res.key);
  fx.stomach?.setHover(n.region);
  const rect = $('#viewport').getBoundingClientRect();
  tooltip.textContent = n.label;
  tooltip.style.left = `${e.clientX - rect.left}px`;
  tooltip.style.top = `${e.clientY - rect.top}px`;
  tooltip.classList.remove('hidden');
});

viewer.on('pick', (res) => {
  if (mode === 'quiz') return quizAnswer(res);
  if (!res) return select(null);
  const n = nameOf(res);
  select({ key: res.key, region: n.region || undefined });
});

// ============================================================== toolbar
function configureToolbar() {
  $('#xray-label').textContent = `Opacidad: ${organ.xray.label}`;
  $('#btn-anim').classList.toggle('hidden', !fx.anim);
  $('#btn-anim').classList.remove('on');
  if (fx.anim) $('#btn-anim').textContent = `▶ ${fx.anim.label}`;
  if (fx.anim?.panel) {
    const pn = fx.anim.panel;
    Object.assign($('#bpm'), { min: pn.min, max: pn.max, value: pn.value });
    $('#bpm-val').textContent = pn.value;
    $('#rate-label').textContent = pn.label;
    $('#rate-unit').textContent = pn.unit;
    fx.anim.ctrl.setRate?.(pn.value);
  }
  $('#btn-tour').classList.toggle('hidden', !organ.tours?.length);
  $('#ecg').classList.add('hidden');
  $('#btn-xray').classList.remove('on');
  $('#btn-clip').classList.remove('on');
  $('#xray-pop').classList.add('hidden');
  $('#clip-pop').classList.add('hidden');
  viewer.setClip({ enabled: false });
  const ex = $('#btn-extra');
  ex.classList.toggle('hidden', !organ.extra);
  if (organ.extra) {
    ex.textContent = organ.extra.label;
    ex.classList.toggle('on', !!organ.extra.defaultOn);
    if (organ.extra.id === 'regions') fx.stomach?.setShow(!!organ.extra.defaultOn);
    if (organ.extra.id === 'adh') fx.nephron?.setAdh(!!organ.extra.defaultOn);
  }
  $('#btn-labels').classList.toggle('on', labelsOn);
  $('#hud-top').innerHTML = `<span class="chip">${esc(organ.name)} · ${viewer.parts.size} estructuras</span>`;
}

function togglePop(btn, pop) {
  const show = pop.classList.contains('hidden');
  document.querySelectorAll('.tool-pop').forEach((p) => p.classList.add('hidden'));
  if (show) {
    pop.classList.remove('hidden');
    const r = btn.getBoundingClientRect();
    const w = pop.offsetWidth;
    pop.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2))}px`;
    pop.style.top = `${r.top - pop.offsetHeight - 10}px`;
  }
  return show;
}

function applyXray(on) {
  const v = on ? +$('#xray-val').value / 100 : 1;
  for (const k of viewer.parts.keys()) if (organ.xray.groups.includes(organ.parts[k].group)) viewer.setOpacity(k, v);
}

$('#toolbar').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'reset') viewer.resetView();
  if (act === 'labels') {
    labelsOn = !labelsOn;
    b.classList.toggle('on', labelsOn);
    viewer.setLabelsVisible(labelsOn);
  }
  if (act === 'clip') {
    const on = !b.classList.contains('on');
    b.classList.toggle('on', on);
    viewer.setClip({ enabled: on });
    // capas que solo tienen sentido con el corte (p. ej. pared gástrica)
    for (const [k, p] of viewer.parts) if (p.info.showOnClip) viewer.setVisible(k, on);
    syncTree();
    if (on) togglePop(b, $('#clip-pop'));
    else $('#clip-pop').classList.add('hidden');
  }
  if (act === 'xray') {
    const on = !b.classList.contains('on');
    b.classList.toggle('on', on);
    applyXray(on);
    if (on) togglePop(b, $('#xray-pop'));
    else $('#xray-pop').classList.add('hidden');
  }
  if (act === 'anim') toggleAnim(b);
  if (act === 'extra') {
    const on = !b.classList.contains('on');
    b.classList.toggle('on', on);
    if (organ.extra.id === 'regions') fx.stomach?.setShow(on);
    if (organ.extra.id === 'adh') fx.nephron?.setAdh(on);
    if (organ.extra.id === 'conduction') {
      fx.heart?.setConduction(on);
      if (on && !fx.heart.running) toggleAnim($('#btn-anim'));
    }
  }
  if (act === 'tour') startTour();
  if (act !== 'tour') $('#tour-pop').classList.add('hidden');
  if (act === 'quiz') startQuiz();
});

function toggleAnim(b) {
  if (!fx.anim) return;
  const on = !b.classList.contains('on');
  b.classList.toggle('on', on);
  b.textContent = `${on ? '⏸' : '▶'} ${fx.anim.label}`;
  $('#ecg').classList.toggle('hidden', !(on && fx.anim.panel));
  if (on) fx.anim.ctrl.start();
  else {
    fx.anim.ctrl.stop();
    if (fx.heart) {
      fx.heart.setConduction(false);
      $('#btn-extra').classList.remove('on');
    }
  }
  const hud = $('#hud-top');
  hud.querySelector('.peri')?.remove();
  if (on && fx.anim.chip) hud.insertAdjacentHTML('beforeend', `<span class="chip peri">${esc(fx.anim.chip)}</span>`);
}

$('#clip-axis').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  $('#clip-axis').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
  viewer.setClip({ axis: b.dataset.axis });
});
$('#clip-pos').addEventListener('input', (e) => viewer.setClip({ t: e.target.value / 1000 }));
$('#clip-flip').addEventListener('change', (e) => viewer.setClip({ flip: e.target.checked }));
$('#xray-val').addEventListener('input', () => applyXray(true));
$('#bpm').addEventListener('input', (e) => {
  $('#bpm-val').textContent = e.target.value;
  fx.anim?.ctrl.setRate?.(+e.target.value);
});
document.addEventListener('pointerdown', (e) => {
  if (!e.target.closest('.tool-pop') && !e.target.closest('.tool-group')) {
    document.querySelectorAll('.tool-pop').forEach((p) => p.classList.add('hidden'));
  }
});

// ============================================================== recorrido
const tour = { steps: [], i: 0 };
function startTour(index) {
  if (index === undefined && organ.tours?.length > 1) {
    const pop = $('#tour-pop');
    pop.innerHTML = organ.tours.map((t, i) => `<button data-i="${i}">${esc(t.name)}</button>`).join('');
    pop.querySelectorAll('button').forEach((b) => (b.onclick = () => (pop.classList.add('hidden'), startTour(+b.dataset.i))));
    togglePop($('#btn-tour'), pop);
    return;
  }
  stopModes();
  const t = organ.tours?.[index || 0];
  if (!t) return;
  mode = 'tour';
  tour.t = t;
  tour.steps = t.steps;
  tour.i = 0;
  $('#tour-card').classList.remove('hidden');
  showStep();
}
function showStep() {
  const s = tour.steps[tour.i];
  $('#tour-step').textContent = `${tour.t.name} · ${tour.i + 1}/${tour.steps.length}`;
  $('#tour-title').textContent = s.title;
  $('#tour-text').textContent = s.text;
  const parts = [...(s.parts || [])];
  if (s.regions) parts.push(organ.regions.part);
  viewer.setGhost(parts);
  fx.stomach?.setFocus(s.regions || (parts.includes(organ.regions?.part) ? null : []));
  viewer.focusOn(parts);
  $('#tour-prev').disabled = tour.i === 0;
  $('#tour-next').textContent = tour.i === tour.steps.length - 1 ? 'Terminar ✓' : 'Siguiente →';
}
$('#tour-prev').onclick = () => tour.i > 0 && (tour.i--, showStep());
$('#tour-next').onclick = () => (tour.i < tour.steps.length - 1 ? (tour.i++, showStep()) : stopModes());
$('#tour-close').onclick = () => stopModes();

// ================================================================== quiz
const quiz = { qs: [], i: 0, score: 0, answered: false };
function startQuiz() {
  stopModes();
  mode = 'quiz';
  select(null);
  const pool = [...viewer.parts.keys()]
    .filter((k) => viewer.parts.get(k).visible && k !== organ.regions?.part && viewer.parts.get(k).info.quiz !== false)
    .map((k) => ({ key: k }));
  if (organ.regions) organ.regions.list.forEach((r) => pool.push({ key: organ.regions.part, region: r.key }));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  quiz.qs = pool.slice(0, 10);
  quiz.i = 0;
  quiz.score = 0;
  $('#quiz-card').classList.remove('hidden');
  showQuestion();
}
function showQuestion() {
  quiz.answered = false;
  const q = quiz.qs[quiz.i];
  $('#quiz-progress').textContent = `Pregunta ${quiz.i + 1}/${quiz.qs.length} · Puntaje ${quiz.score}`;
  $('#quiz-target').textContent = infoFor(q).name;
  $('#quiz-feedback').textContent = '';
  $('#quiz-feedback').className = 'feedback';
  $('#quiz-next').classList.add('hidden');
  $('#quiz-skip').classList.remove('hidden');
  viewer.setSelected(null);
  fx.stomach?.setSelected(null);
  viewer.resetView();
}
function quizAnswer(res) {
  if (quiz.answered || !res) return;
  const q = quiz.qs[quiz.i];
  const region = fx.stomach && res.key === organ.regions?.part ? fx.stomach.regionOf(res.hit) : undefined;
  const ok = res.key === q.key && (q.region ? region === q.region : true);
  const fb = $('#quiz-feedback');
  quiz.answered = true;
  if (ok) {
    quiz.score++;
    fb.textContent = '✓ ¡Correcto!';
    fb.className = 'feedback ok';
  } else {
    const picked = infoFor({ key: res.key, region: q.region ? region : undefined });
    fb.textContent = `✗ Eso es: ${picked.name}. Te muestro la correcta.`;
    fb.className = 'feedback bad';
  }
  revealAnswer(q);
}
function revealAnswer(q) {
  viewer.setSelected(q.region ? null : q.key);
  fx.stomach?.setSelected(q.region || null);
  viewer.setVisible(q.key, true);
  viewer.focusOn([q.key]);
  $('#quiz-progress').textContent = `Pregunta ${quiz.i + 1}/${quiz.qs.length} · Puntaje ${quiz.score}`;
  $('#quiz-skip').classList.add('hidden');
  $('#quiz-next').classList.remove('hidden');
  $('#quiz-next').textContent = quiz.i === quiz.qs.length - 1 ? 'Ver resultado' : 'Siguiente →';
}
$('#quiz-skip').onclick = () => {
  quiz.answered = true;
  $('#quiz-feedback').textContent = 'Esta era la respuesta:';
  revealAnswer(quiz.qs[quiz.i]);
};
$('#quiz-next').onclick = () => {
  if (quiz.i < quiz.qs.length - 1) {
    quiz.i++;
    showQuestion();
  } else {
    const pct = Math.round((quiz.score / quiz.qs.length) * 100);
    $('#quiz-target').textContent = `Resultado: ${quiz.score}/${quiz.qs.length} (${pct} %)`;
    $('#quiz-feedback').textContent = pct >= 80 ? '¡Excelente! 🎉' : pct >= 50 ? 'Bien, sigue practicando.' : 'Repasa con el recorrido guiado y vuelve a intentarlo.';
    $('#quiz-feedback').className = 'feedback ' + (pct >= 50 ? 'ok' : 'bad');
    $('#quiz-next').classList.add('hidden');
    $('#quiz-skip').classList.add('hidden');
    viewer.setSelected(null);
    fx.stomach?.setSelected(null);
  }
};
$('#quiz-close').onclick = () => stopModes();

function stopModes() {
  if (mode === 'tour') {
    viewer.setGhost(null);
    fx.stomach?.setFocus(null);
  }
  if (mode === 'quiz') {
    viewer.setSelected(null);
    fx.stomach?.setSelected(null);
  }
  mode = 'explore';
  $('#tour-card').classList.add('hidden');
  $('#quiz-card').classList.add('hidden');
}

// ============================================================ móvil
const togglePanel = (id) => {
  const p = $(id);
  const open = !p.classList.contains('open');
  document.querySelectorAll('.panel').forEach((x) => x.classList.remove('open'));
  p.classList.toggle('open', open);
};
$('#btn-left').onclick = () => togglePanel('#panel-left');
$('#btn-right').onclick = () => togglePanel('#panel-right');
$('#viewport').addEventListener('pointerdown', () => document.querySelectorAll('.panel').forEach((x) => x.classList.remove('open')));

// ============================================================ inicio
buildTabs();
const fromHash = () => organs.find((o) => `#${o.id}` === location.hash)?.id;
window.addEventListener('hashchange', () => fromHash() && loadOrgan(fromHash()));
loadOrgan(fromHash() || organs[0].id);

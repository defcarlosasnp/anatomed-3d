import './style.css';
import * as THREE from 'three';
import { Viewer } from './viewer.js';
import { organs, comingSoon } from './organs/index.js';
import { createHeartbeat } from './effects/heartbeat.js';
import { createStomachEffects } from './effects/stomach.js';
import { createChordae } from './effects/heartExtras.js';
import { createBreathing } from './effects/breathing.js';
import { createNephronFlow } from './effects/nephronFlow.js';
import { createEye, GAZES } from './effects/eye.js';
import { createQuiz, MODES } from './features/quiz.js';
import { Progress, Notes, load as loadPref, save as savePref, summary, resetAll } from './features/store.js';
import { downloadBackup, importBackupText, buildSyncLink, readSyncFromUrl, applySync, drawQR } from './features/sync.js';
import { resolvePoint, resolveCut } from './features/geometry.js';

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
let poisOn = false;
let noteMode = false;
let poiPos = {}; // id -> Vector3 (coordenadas del modelo)

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
  } else if (organ.animation === 'accommodation') {
    fx.eye = createEye(viewer, monitor);
    fx.anim = { label: 'Acomodación', panel: { label: 'Ciclos', unit: '/min', min: 4, max: 30, value: 10 }, ctrl: fx.eye };
  } else if (organ.animation === 'flow') {
    fx.nephron = createNephronFlow(viewer);
    fx.anim = { label: 'Flujo', chip: 'Color = osmolaridad del líquido tubular: azul ~100 · crema 300 · naranja ~1200 mOsm/kg', ctrl: fx.nephron };
  }
  buildLabels();
  buildPins();
  buildTree();
  buildPhysiology();
  configureToolbar();
  buildClipPresets();
  renderInfo();
  updateProgress();
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

// ================================================ puntos clínicos y notas
function buildPins() {
  poiPos = {};
  viewer.removePins('poi');
  viewer.removePins('note');
  (organ.pois || []).forEach((poi, i) => {
    const pos = resolvePoint(viewer, poi.at, true);
    if (!pos) return;
    poiPos[poi.id] = pos;
    viewer.addPin(pos, `<span>${i + 1}</span>`, 'poi', () => select({ poi: poi.id }, true), poi.name);
  });
  viewer.setPinsVisible('poi', poisOn);
  buildNotePins();
}

function buildNotePins() {
  viewer.removePins('note');
  for (const n of Notes.list(organ.id)) {
    viewer.addPin(new THREE.Vector3(...n.pos), '<span>✎</span>', 'note', () => select({ note: n.id }), n.text || 'Nota');
  }
}

function focusPoint(posSpace) {
  const target = viewer.space.localToWorld(posSpace.clone());
  const dir = viewer.camera.position.clone().sub(viewer.controls.target).normalize();
  const dist = THREE.MathUtils.clamp(viewer.camera.position.distanceTo(viewer.controls.target) * 0.75, 1.8, 3.2);
  viewer._animateCamera(target, target.clone().addScaledVector(dir, dist), true);
}

// ================================================================ progreso
function studyItems() {
  const ids = [...viewer.parts.keys()].filter((k) => viewer.parts.get(k).info.quiz !== false && k !== organ.regions?.part);
  if (organ.regions) organ.regions.list.forEach((r) => ids.push(`${organ.regions.part}:${r.key}`));
  (organ.pois || []).forEach((p) => ids.push(`poi:${p.id}`));
  return ids;
}
function updateProgress() {
  const ids = studyItems();
  const n = Progress.viewedCount(organ.id, ids);
  const pct = ids.length ? Math.round((n / ids.length) * 100) : 0;
  $('#progress').innerHTML = `<div class="bar"><i style="width:${pct}%"></i></div><span>Revisado: ${n}/${ids.length} (${pct} %) · Dominio quiz: ${quiz.mastery()} %</span>`;
}

// ======================================================= árbol de estructuras
function buildTree() {
  const tree = $('#tree');
  tree.innerHTML = '';
  buildSpecialGroups(tree);
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
      row.innerHTML = `<button class="eye" title="Mostrar/ocultar">👁</button><span class="swatch" style="background:#${p.baseColor.getHexString()}"></span><span class="name">${esc(p.info.name)}</span><span class="seen-mark" title="Revisada">✓</span>`;
      row.querySelector('.eye').onclick = (e) => {
        e.stopPropagation();
        viewer.setVisible(k, !p.visible);
        syncTree();
      };
      row.onclick = () => {
        if (!p.visible) viewer.setVisible(k, true), syncTree();
        if (quiz.active) return;
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
          rr.innerHTML = `<span class="swatch" style="background:${r.color}"></span><span class="name">${esc(r.name)}</span><span class="seen-mark" title="Revisada">✓</span>`;
          rr.onclick = () => !quiz.active && select({ key: k, region: r.key }, true);
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

function buildSpecialGroups(tree) {
  const mk = (cls, title, rows, hint) => {
    const div = document.createElement('div');
    div.className = `group special ${cls}`;
    div.innerHTML = `<div class="group-head"><span class="caret">▾</span><span>${title}</span><span class="count">${rows.length}</span></div><div class="items"></div>`;
    const items = div.querySelector('.items');
    if (!rows.length && hint) items.innerHTML = `<p class="hint">${hint}</p>`;
    rows.forEach((r) => items.appendChild(r));
    div.querySelector('.group-head').onclick = () => div.classList.toggle('collapsed');
    tree.appendChild(div);
    return div;
  };
  const poiRows = (organ.pois || [])
    .filter((poi) => poiPos[poi.id])
    .map((poi, i) => {
      const row = document.createElement('div');
      row.className = 'item';
      row.dataset.poi = poi.id;
      row.dataset.search = `${poi.name} ${poi.desc || ''}`;
      row.innerHTML = `<span class="pin-num">${i + 1}</span><span class="name">${esc(poi.name)}</span><span class="seen-mark">✓</span>`;
      row.onclick = () => select({ poi: poi.id }, true);
      return row;
    });
  if (poiRows.length) mk('pois', '📍 Puntos clínicos', poiRows).classList.add('collapsed');
  const noteRows = Notes.list(organ.id).map((n) => {
    const row = document.createElement('div');
    row.className = 'item';
    row.dataset.note = n.id;
    row.dataset.search = n.text;
    row.innerHTML = `<span class="pin-num note">✎</span><span class="name">${esc(n.text || 'Nota sin texto')}</span>`;
    row.onclick = () => select({ note: n.id });
    return row;
  });
  mk('notes', '📝 Mis notas', noteRows, 'Usa ✏️ Nota en la barra inferior y haz clic en el modelo para dejar una nota.');
}

function syncTree() {
  document.querySelectorAll('#tree .group:not(.special)').forEach((gEl) => {
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
    let sel = false;
    let id = null;
    if (row.dataset.poi) {
      sel = selection?.poi === row.dataset.poi;
      id = `poi:${row.dataset.poi}`;
    } else if (row.dataset.note) sel = selection?.note === row.dataset.note;
    else {
      sel = !!selection && !selection.poi && !selection.note && row.dataset.key === selection.key && (row.dataset.region || null) === (selection.region || null);
      id = row.dataset.region ? `${row.dataset.key}:${row.dataset.region}` : row.dataset.key;
    }
    row.classList.toggle('sel', sel);
    if (id) row.classList.toggle('seen', Progress.isViewed(organ.id, id));
  });
}

function filterTree(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('#tree .group').forEach((gEl) => {
    let shown = 0;
    gEl.querySelectorAll('.item').forEach((row) => {
      let hay;
      if (row.dataset.search !== undefined) hay = row.dataset.search.toLowerCase();
      else {
        const info = row.dataset.region ? organ.regions.list.find((r) => r.key === row.dataset.region) : organ.parts[row.dataset.key];
        hay = `${info.name} ${info.en}`.toLowerCase();
      }
      const ok = !q || hay.includes(q);
      row.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    gEl.style.display = shown || (gEl.classList.contains('notes') && !q) ? '' : 'none';
    if (q) gEl.classList.remove('collapsed');
  });
}
$('#search').addEventListener('input', (e) => filterTree(e.target.value));

// ============================================================== selección
function select(sel, focus = false) {
  selection = sel;
  const isPart = sel && sel.key;
  viewer.setSelected(isPart && !sel.region ? sel.key : null);
  fx.stomach?.setSelected(isPart ? sel.region || null : null);
  document.querySelectorAll('.pin.sel').forEach((el) => el.classList.remove('sel'));
  if (sel?.poi) {
    viewer.space.traverse((o) => o.userData.isPin === 'poi' && o.element.title === organ.pois.find((x) => x.id === sel.poi)?.name && o.element.classList.add('sel'));
    if (focus && poiPos[sel.poi]) focusPoint(poiPos[sel.poi]);
  } else if (sel?.note) {
    const n = Notes.list(organ.id).find((x) => x.id === sel.note);
    if (n && focus) focusPoint(new THREE.Vector3(...n.pos));
  } else if (sel && focus) viewer.focusOn([sel.key]);
  if (sel && !sel.note) {
    const id = sel.poi ? `poi:${sel.poi}` : sel.region ? `${sel.key}:${sel.region}` : sel.key;
    if (Progress.markViewed(organ.id, id)) updateProgress();
  }
  syncTree();
  renderInfo();
  if (sel) {
    switchTab('info');
    document.querySelector(`#tree .item.sel`)?.scrollIntoView({ block: 'nearest' });
  }
}

function infoFor(sel) {
  if (!sel) return null;
  if (sel.poi) {
    const poi = organ.pois.find((x) => x.id === sel.poi);
    return poi && { ...poi, en: 'Punto de referencia clínico', groupName: 'Punto clínico', groupColor: '#f2c14e' };
  }
  if (sel.region) {
    const r = organ.regions.list.find((x) => x.key === sel.region);
    return { ...r, groupName: 'Región del estómago', groupColor: r.color };
  }
  const p = organ.parts[sel.key];
  const g = organ.groups.find((x) => x.id === p.group);
  const gi = organ.groupInfo?.[p.group] || {};
  return { ...p, func: p.func || gi.func, clinic: p.clinic || gi.clinic, groupName: g?.name, groupColor: g?.color };
}

function renderNote(el) {
  const n = Notes.list(organ.id).find((x) => x.id === selection.note);
  if (!n) return select(null);
  const part = organ.parts[n.key];
  el.innerHTML = `
    <div class="info">
      <span class="badge"><span class="swatch" style="background:#f2c14e"></span>Mi nota</span>
      <h2>Nota${part ? ` · ${esc(part.name)}` : ''}</h2>
      <div class="en">${new Date(n.created).toLocaleString('es-CL')} · guardada solo en este navegador</div>
      <textarea id="note-text" rows="6" placeholder="Escribe tu nota (ej. «preguntaron esto en la prueba»)…">${esc(n.text)}</textarea>
      <div class="info-actions">
        <button data-a="save" class="primary">💾 Guardar</button>
        <button data-a="focus">🎯 Ir a la nota</button>
        <button data-a="del">🗑 Borrar</button>
      </div>
    </div>`;
  const ta = el.querySelector('#note-text');
  setTimeout(() => !n.text && ta.focus(), 50);
  el.querySelector('[data-a=save]').onclick = () => {
    Notes.update(organ.id, n.id, ta.value.trim());
    buildNotePins();
    buildTree();
    select({ note: n.id });
  };
  el.querySelector('[data-a=focus]').onclick = () => focusPoint(new THREE.Vector3(...n.pos));
  el.querySelector('[data-a=del]').onclick = () => {
    Notes.remove(organ.id, n.id);
    buildNotePins();
    buildTree();
    select(null);
  };
}

function renderInfo() {
  const el = $('#tab-info');
  if (selection?.note) return renderNote(el);
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
        ${selection.region || selection.poi ? '' : '<button data-a="isolate">◎ Aislar</button><button data-a="hide">🚫 Ocultar</button>'}
        <button data-a="showall">👁 Restaurar vista</button>
      </div>
    </div>`;
  el.querySelectorAll('[data-a]').forEach((b) => {
    b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'focus') selection.poi ? focusPoint(poiPos[selection.poi]) : viewer.focusOn([selection.key]);
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
  if (!n || quiz.clickMode) {
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
  const n = nameOf(res);
  if (quiz.active) {
    quiz.onPick(res, n?.region || undefined);
    return;
  }
  if (noteMode) {
    if (!res) return;
    const pos = viewer.space.worldToLocal(res.hit.point.clone());
    const note = Notes.add(organ.id, pos.toArray(), res.key);
    setNoteMode(false);
    buildNotePins();
    buildTree();
    select({ note: note.id });
    return;
  }
  if (!res) return select(null);
  select({ key: res.key, region: n.region || undefined });
});

function setNoteMode(on) {
  noteMode = on;
  $('#btn-note').classList.toggle('on', on);
  viewer.renderer.domElement.classList.toggle('placing', on);
  $('#hud-top').querySelector('.note-hint')?.remove();
  if (on) $('#hud-top').insertAdjacentHTML('beforeend', '<span class="chip note-hint">✏️ Haz clic en el modelo donde quieres la nota (Esc para cancelar)</span>');
}
document.addEventListener('keydown', (e) => e.key === 'Escape' && noteMode && setNoteMode(false));

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
  $('#btn-pois').classList.toggle('hidden', !organ.pois?.length);
  $('#btn-pois').classList.toggle('on', poisOn);
  setNoteMode(false);
  syncClipUI();
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
    // el panel de corte va al costado del visor para no tapar el modelo
    if (pop.id === 'clip-pop' && window.innerWidth > 860) {
      const vr = $('#viewport').getBoundingClientRect();
      pop.style.left = `${vr.right - w - 12}px`;
      pop.style.top = `${vr.top + 12}px`;
    }
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
    setClipEnabled(on);
    syncClipUI();
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
    if (organ.extra.id === 'gaze') {
      b.classList.toggle('on', true);
      openGazeMenu(b);
    }
    if (organ.extra.id === 'conduction') {
      fx.heart?.setConduction(on);
      if (on && !fx.heart.running) toggleAnim($('#btn-anim'));
    }
  }
  if (act === 'pois') {
    poisOn = !poisOn;
    b.classList.toggle('on', poisOn);
    viewer.setPinsVisible('poi', poisOn);
    if (poisOn) document.querySelector('#tree .group.pois')?.classList.remove('collapsed');
  }
  if (act === 'note') setNoteMode(!noteMode);
  if (act === 'tour') startTour();
  if (act !== 'tour') $('#tour-pop').classList.add('hidden');
  if (act === 'quiz') openQuizMenu();
  if (act !== 'quiz') $('#quiz-pop').classList.add('hidden');
  if (act !== 'extra') $('#gaze-pop').classList.add('hidden');
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
  viewer.setClip({ axis: b.dataset.axis });
  syncClipUI();
});
$('#clip-mode').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  viewer.setClip({ mode: b.dataset.mode });
  syncClipUI();
});
$('#clip-pos').addEventListener('input', (e) => viewer.setClip({ t: e.target.value / 1000 }));
$('#clip-thick').addEventListener('input', (e) => viewer.setClip({ thickness: e.target.value / 100 }));
$('#clip-tilt-a').addEventListener('input', (e) => viewer.setClip({ tiltA: +e.target.value }));
$('#clip-tilt-b').addEventListener('input', (e) => viewer.setClip({ tiltB: +e.target.value }));
$('#clip-flip').addEventListener('change', (e) => viewer.setClip({ flip: e.target.checked }));
$('#clip-caps').addEventListener('change', (e) => viewer.setClip({ caps: e.target.checked }));

/** Refleja el estado del corte en los controles. */
function syncClipUI() {
  const c = viewer.clip;
  $('#clip-axis').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x.dataset.axis === c.axis));
  $('#clip-mode').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x.dataset.mode === c.mode));
  $('#clip-pos').value = Math.round(c.t * 1000);
  $('#clip-thick').value = Math.round(c.thickness * 100);
  $('#clip-tilt-a').value = c.tiltA;
  $('#clip-tilt-b').value = c.tiltB;
  $('#clip-flip').checked = c.flip;
  $('#clip-caps').checked = c.caps;
  $('#slab-row').classList.toggle('hidden', c.mode !== 'slab');
  $('#flip-row').classList.toggle('hidden', c.mode === 'slab');
  $('#clip-pos-label').textContent = c.mode === 'slab' ? 'Posición de la lámina (desliza para recorrer)' : 'Posición del plano';
}

function setClipEnabled(on) {
  $('#btn-clip').classList.toggle('on', on);
  viewer.setClip({ enabled: on });
  for (const [k, p] of viewer.parts) if (p.info.showOnClip) viewer.setVisible(k, on);
  if (!on) {
    viewer.resetView();
    $('#clip-presets').querySelectorAll('button').forEach((x) => x.classList.remove('on'));
  }
  syncTree();
}

function buildClipPresets() {
  const box = $('#clip-presets');
  const presets = organ.cutPresets || [];
  box.innerHTML = presets.length ? `<div class="small muted">Cortes clínicos</div>${presets.map((c, i) => `<button data-i="${i}">${esc(c.name)}</button>`).join('')}` : '';
  box.querySelectorAll('button').forEach((b) => {
    b.onclick = () => {
      const r = resolveCut(viewer, presets[+b.dataset.i]);
      if (!r) return;
      if (!viewer.clip.enabled) setClipEnabled(true);
      viewer.setClipPreset(r.n, r.p);
      box.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      syncClipUI();
    };
  });
}
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

// ====================================================== movimientos oculares
function openGazeMenu(btn) {
  const pop = $('#gaze-pop');
  pop.innerHTML = `<div class="small muted pop-title">Posiciones diagnósticas de la mirada (ojo izquierdo)</div>${GAZES.map((g) => `<button data-g="${g.id}"><b>${esc(g.label)}</b></button>`).join('')}`;
  pop.querySelectorAll('button').forEach((b) => {
    b.onclick = () => {
      const g = fx.eye?.gaze(b.dataset.g);
      if (!g) return;
      pop.classList.add('hidden');
      $('#hud-top').querySelector('.gaze')?.remove();
      $('#btn-extra').classList.toggle('on', g.id !== 'primary');
      if (g.id !== 'primary') $('#hud-top').insertAdjacentHTML('beforeend', `<span class="chip gaze">👀 ${esc(g.label)}: ${esc(g.text)}</span>`);
    };
  });
  togglePop(btn, pop);
}

// ================================================================= calidad visual
const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 860;
let quality = loadPref('anatomed.quality', isMobile ? 'low' : 'high');
function applyQuality() {
  viewer.visuals.setQuality(quality);
  $('#btn-quality').textContent = quality === 'high' ? '✨ Visual: alta' : '◻ Visual: básica';
  $('#btn-quality').title = quality === 'high' ? 'Oclusión ambiental, sombras y contorno de selección (requiere más GPU)' : 'Render simple (más rápido)';
}
$('#btn-quality').onclick = () => {
  quality = quality === 'high' ? 'low' : 'high';
  savePref('anatomed.quality', quality);
  applyQuality();
};
applyQuality();

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
const quiz = createQuiz({
  viewer,
  getOrgan: () => organ,
  getFx: () => fx,
  infoFor,
  onStart: () => {
    stopModes();
    mode = 'quiz';
    select(null);
  },
});
function openQuizMenu() {
  const pop = $('#quiz-pop');
  const hasClin = organ.clinicalQs?.length;
  pop.innerHTML = `<div class="small muted pop-title">Dominio en ${esc(organ.name)}: ${quiz.mastery()} %</div>${MODES.filter((m) => m.id !== 'clinical' || hasClin)
    .map((m) => `<button data-m="${m.id}"><b>${m.label}</b><small>${m.hint}</small></button>`)
    .join('')}`;
  pop.querySelectorAll('button').forEach((b) => (b.onclick = () => (pop.classList.add('hidden'), quiz.start(b.dataset.m), updateProgress())));
  togglePop($('#btn-quiz'), pop);
}
$('#quiz-close').onclick = () => stopModes();

function stopModes() {
  if (mode === 'tour') {
    viewer.setGhost(null);
    fx.stomach?.setFocus(null);
  }
  if (mode === 'quiz') {
    quiz.stop();
    updateProgress();
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

// ======================================================= mis datos (respaldo)
function toast(msg, ms = 4000) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.add('hidden'), ms);
}
function describe(res) {
  const parts = [];
  if (res.viewed) parts.push(`${res.viewed} estructuras revisadas nuevas`);
  if (res.notesAdded) parts.push(`${res.notesAdded} notas nuevas`);
  if (res.notesUpdated) parts.push(`${res.notesUpdated} notas actualizadas`);
  return parts.length ? `Datos importados: ${parts.join(', ')}.` : 'Datos importados: no había nada nuevo.';
}
function refreshAfterImport() {
  if (!organ) return;
  buildNotePins();
  buildTree();
  updateProgress();
  renderInfo();
}
let lastLink = '';
async function openDataModal() {
  const sm = summary();
  $('#data-summary').textContent = `En este navegador: ${sm.viewed} estructuras revisadas · ${sm.answers} respuestas de quiz · ${sm.notes} notas.`;
  $('#data-modal').classList.remove('hidden');
  const msg = $('#data-qr-msg');
  msg.textContent = 'Generando código…';
  try {
    lastLink = await buildSyncLink();
    const fits = await drawQR($('#data-qr'), lastLink);
    $('#data-qr').classList.toggle('hidden', !fits);
    msg.textContent = fits ? '' : 'Tienes demasiados datos para un QR: usa "Copiar enlace" o el respaldo en archivo.';
  } catch {
    lastLink = '';
    $('#data-qr').classList.add('hidden');
    msg.textContent = 'Tu navegador no permite generar el enlace. Usa el respaldo en archivo.';
  }
  $('#data-share').classList.toggle('hidden', !navigator.share || !lastLink);
}
$('#btn-data').onclick = openDataModal;
$('#data-close').onclick = () => $('#data-modal').classList.add('hidden');
$('#data-modal').addEventListener('pointerdown', (e) => e.target.id === 'data-modal' && $('#data-modal').classList.add('hidden'));
document.addEventListener('keydown', (e) => e.key === 'Escape' && $('#data-modal').classList.add('hidden'));
$('#data-copy').onclick = async () => {
  if (!lastLink) return;
  try {
    await navigator.clipboard.writeText(lastLink);
    toast('Enlace copiado. Ábrelo en el otro dispositivo.');
  } catch {
    prompt('Copia este enlace:', lastLink);
  }
};
$('#data-share').onclick = () => navigator.share?.({ title: 'AnatoMed 3D — mis datos', text: 'Abre este enlace para importar mis notas y progreso:', url: lastLink }).catch(() => {});
$('#data-export').onclick = () => {
  downloadBackup();
  toast('Respaldo descargado.');
};
$('#data-import').onchange = async (e) => {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  try {
    const res = importBackupText(await file.text());
    refreshAfterImport();
    $('#data-modal').classList.add('hidden');
    toast(describe(res), 6000);
  } catch (err) {
    toast(err.message, 6000);
  }
};
$('#data-reset').onclick = () => {
  if (!confirm('¿Borrar TODO tu progreso, estadísticas del quiz y notas de este navegador? Esto no se puede deshacer (exporta un respaldo antes si quieres conservarlos).')) return;
  resetAll();
  refreshAfterImport();
  $('#data-modal').classList.add('hidden');
  toast('Progreso y notas borrados.');
};

/** Al abrir un enlace #sync=..., ofrece importar los datos y limpia la URL. */
async function handleSyncLink() {
  if (!location.hash.startsWith('#sync=')) return;
  try {
    const data = await readSyncFromUrl();
    history.replaceState(null, '', location.pathname);
    const sm = summary(data);
    if (confirm(`Este enlace trae datos de AnatoMed 3D:\n• ${sm.viewed} estructuras revisadas\n• ${sm.answers} respuestas de quiz\n• ${sm.notes} notas\n\n¿Importarlos y fusionarlos con los de este dispositivo?`)) {
      const res = applySync(data);
      setTimeout(() => toast(describe(res), 6000), 500);
    }
  } catch {
    history.replaceState(null, '', location.pathname);
    setTimeout(() => toast('El enlace de datos está dañado o incompleto.', 6000), 500);
  }
}

// ============================================================ inicio
buildTabs();
const fromHash = () => organs.find((o) => `#${o.id}` === location.hash)?.id;
window.addEventListener('hashchange', () => {
  if (location.hash.startsWith('#sync=')) {
    const current = organ?.id;
    handleSyncLink().finally(() => {
      refreshAfterImport();
      if (current) history.replaceState(null, '', `#${current}`);
    });
  } else if (fromHash()) loadOrgan(fromHash());
});
handleSyncLink().finally(() => loadOrgan(fromHash() || organs[0].id));

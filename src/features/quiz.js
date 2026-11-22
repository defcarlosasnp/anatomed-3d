import { Progress } from './store.js';

// Quiz con 4 modos:
//  click    → haz clic en la estructura pedida
//  write    → se resalta una estructura y escribes su nombre
//  clinical → preguntas clínicas de alternativas (organ.clinicalQs)
//  review   → repaso de las estructuras en que más te equivocas
// Las estadísticas por estructura se guardan en este navegador y ponderan la selección.

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const norm = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function lev(a, b) {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

/** Variantes aceptables de un nombre ("Válvula aórtica — valva no coronaria" → también "valva no coronaria", etc.). */
function variants(info) {
  const out = new Set();
  const add = (s) => s && norm(s).length > 1 && out.add(norm(s));
  const n = info.name;
  add(n);
  add(n.replace(/\(.*?\)/g, ''));
  n.split(/—|,|\(|\)/).forEach(add);
  add(info.en);
  return [...out];
}

export function grade(answer, info) {
  const a = norm(answer);
  if (!a) return { ok: false, score: 0 };
  let best = 0;
  for (const v of variants(info)) {
    const sim = 1 - lev(a, v) / Math.max(a.length, v.length);
    let s = sim;
    if (a.length >= 4 && v.includes(a) && a.length / v.length >= 0.55) s = Math.max(s, 0.85);
    best = Math.max(best, s);
  }
  return { ok: best >= 0.8, close: best >= 0.6, score: best };
}

function weightedSample(items, k, weightOf) {
  const pool = items.map((it) => ({ it, w: Math.max(0.05, weightOf(it)) }));
  const out = [];
  while (out.length < k && pool.length) {
    const total = pool.reduce((a, b) => a + b.w, 0);
    let r = Math.random() * total;
    let i = 0;
    while (r > pool[i].w && i < pool.length - 1) r -= pool[i++].w;
    out.push(pool.splice(i, 1)[0].it);
  }
  return out;
}

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const MODES = [
  { id: 'click', label: 'Clic en la estructura', hint: 'Te nombro una estructura y la encuentras en el modelo' },
  { id: 'write', label: 'Escribe el nombre', hint: 'Resalto una estructura y escribes cómo se llama' },
  { id: 'clinical', label: 'Preguntas clínicas', hint: 'Casos y preguntas de alternativas' },
  { id: 'review', label: 'Repasar mis errores', hint: 'Solo lo que más has fallado' },
];

export function createQuiz(ctx) {
  // ctx: { viewer, getOrgan, getFx, infoFor, onStart, onEnd }
  const q = { mode: null, items: [], i: 0, score: 0, answered: false, misses: [] };
  const itemId = (it) => (it.region ? `${it.key}:${it.region}` : it.key);

  function poolItems() {
    const organ = ctx.getOrgan();
    const v = ctx.viewer;
    const items = [...v.parts.keys()]
      .filter((k) => v.parts.get(k).visible && k !== organ.regions?.part && v.parts.get(k).info.quiz !== false)
      .map((k) => ({ key: k }));
    if (organ.regions) organ.regions.list.forEach((r) => items.push({ key: organ.regions.part, region: r.key }));
    return items;
  }

  function mastery() {
    const organ = ctx.getOrgan();
    const items = poolItems();
    if (!items.length) return 0;
    let sum = 0;
    for (const it of items) {
      const s = Progress.stat(organ.id, itemId(it));
      if (s.c + s.w) sum += s.c / (s.c + s.w);
    }
    return Math.round((sum / items.length) * 100);
  }

  function highlight(it) {
    const v = ctx.viewer;
    const fx = ctx.getFx();
    v.setSelected(it && !it.region ? it.key : null);
    fx.stomach?.setSelected(it?.region || null);
    // en "escribe el nombre" se atenúa el resto para que la estructura (aunque sea interna) se vea
    v.setGhost(it && q.mode === 'write' && !it.region ? [it.key] : null);
    if (it) {
      v.setVisible(it.key, true);
      v.focusOn([it.key]);
    }
  }

  function start(mode) {
    const organ = ctx.getOrgan();
    q.mode = mode;
    q.i = 0;
    q.score = 0;
    q.misses = [];
    if (mode === 'clinical') {
      q.items = shuffle((organ.clinicalQs || []).map((c, idx) => ({ ...c, idx }))).slice(0, 8);
      if (!q.items.length) return message('Este órgano aún no tiene preguntas clínicas.');
    } else {
      let pool = poolItems();
      if (mode === 'review') {
        pool = pool.filter((it) => Progress.stat(organ.id, itemId(it)).w > 0);
        if (!pool.length) return message('No tienes errores registrados en este órgano. Haz primero un quiz de clic o de escribir.');
        pool.sort((a, b) => {
          const sa = Progress.stat(organ.id, itemId(a));
          const sb = Progress.stat(organ.id, itemId(b));
          return sb.w / (sb.c + sb.w) - sa.w / (sa.c + sa.w);
        });
        q.items = pool.slice(0, 10);
        q.mode = 'click';
        q.review = true;
      } else {
        q.review = false;
        q.items = weightedSample(pool, 10, (it) => {
          const s = Progress.stat(organ.id, itemId(it));
          return ((s.w + 1) / (s.c + 1)) * (s.c + s.w ? 1 : 1.5);
        });
      }
    }
    ctx.onStart();
    $('#quiz-card').classList.remove('hidden');
    show();
  }

  function message(text) {
    ctx.onStart();
    $('#quiz-card').classList.remove('hidden');
    $('#quiz-progress').textContent = 'Quiz';
    $('#quiz-body').innerHTML = `<p>${esc(text)}</p>`;
    $('#quiz-feedback').textContent = '';
    $('#quiz-skip').classList.add('hidden');
    $('#quiz-next').classList.add('hidden');
    q.mode = 'message';
  }

  function header() {
    const label = q.review ? 'Repaso' : MODES.find((m) => m.id === q.mode)?.label.replace(/^\S+ /, '');
    $('#quiz-progress').textContent = `${label} · ${q.i + 1}/${q.items.length} · Puntaje ${q.score}`;
  }

  function show() {
    q.answered = false;
    const it = q.items[q.i];
    const fb = $('#quiz-feedback');
    fb.textContent = '';
    fb.className = 'feedback';
    $('#quiz-next').classList.add('hidden');
    $('#quiz-skip').classList.remove('hidden');
    header();
    const body = $('#quiz-body');
    if (q.mode === 'click') {
      highlight(null);
      ctx.viewer.resetView();
      body.innerHTML = `<p class="muted small">Haz clic en el modelo sobre:</p><h3>${esc(ctx.infoFor(it).name)}</h3>`;
    } else if (q.mode === 'write') {
      highlight(it);
      body.innerHTML = `<p class="muted small">¿Qué estructura está resaltada?</p>
        <form class="quiz-write"><input id="quiz-input" autocomplete="off" placeholder="Escribe el nombre…" /><button class="primary">Comprobar</button></form>`;
      const input = body.querySelector('input');
      setTimeout(() => input.focus(), 50);
      body.querySelector('form').onsubmit = (e) => {
        e.preventDefault();
        answerWrite(input.value);
      };
    } else if (q.mode === 'clinical') {
      ctx.viewer.setGhost(null);
      body.innerHTML = `<p class="quiz-q">${esc(it.q)}</p><div class="quiz-opts">${it.options
        .map((o, k) => `<button data-k="${k}">${String.fromCharCode(65 + k)}. ${esc(o)}</button>`)
        .join('')}</div>`;
      body.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => answerClinical(+b.dataset.k)));
    }
  }

  function finishAnswer(ok, text, id) {
    const organ = ctx.getOrgan();
    const fb = $('#quiz-feedback');
    q.answered = true;
    if (ok) q.score++;
    else q.misses.push(q.items[q.i]);
    if (id) Progress.record(organ.id, id, ok);
    fb.innerHTML = text;
    fb.className = `feedback ${ok ? 'ok' : 'bad'}`;
    header();
    $('#quiz-skip').classList.add('hidden');
    $('#quiz-next').classList.remove('hidden');
    $('#quiz-next').textContent = q.i === q.items.length - 1 ? 'Ver resultado' : 'Siguiente →';
  }

  function onPick(res, region) {
    if (q.mode !== 'click' || q.answered || !res) return false;
    const it = q.items[q.i];
    const ok = res.key === it.key && (it.region ? region === it.region : true);
    const picked = ctx.infoFor({ key: res.key, region: it.region ? region : undefined });
    finishAnswer(ok, ok ? '✓ ¡Correcto!' : `✗ Eso es: ${esc(picked?.name)}. Te muestro la correcta.`, itemId(it));
    highlight(it);
    return true;
  }

  function answerWrite(value) {
    if (q.answered) return;
    const it = q.items[q.i];
    const info = ctx.infoFor(it);
    const g = grade(value, info);
    const name = esc(info.name);
    finishAnswer(g.ok, g.ok ? `✓ ¡Correcto! <span class="muted">(${name})</span>` : g.close ? `≈ Casi. Era: <b>${name}</b>` : `✗ Era: <b>${name}</b>`, itemId(it));
  }

  function answerClinical(k) {
    if (q.answered) return;
    const it = q.items[q.i];
    const ok = k === it.answer;
    document.querySelectorAll('.quiz-opts button').forEach((b) => {
      const kk = +b.dataset.k;
      b.disabled = true;
      if (kk === it.answer) b.classList.add('right');
      else if (kk === k) b.classList.add('wrong');
    });
    finishAnswer(ok, `${ok ? '✓ Correcto.' : `✗ Correcta: ${String.fromCharCode(65 + it.answer)}.`} <span class="explain">${esc(it.explain || '')}</span>`, `q:${it.idx}`);
    if (it.parts?.length) {
      ctx.viewer.setGhost(it.parts);
      ctx.viewer.focusOn(it.parts);
    }
  }

  function skip() {
    if (q.answered) return;
    const it = q.items[q.i];
    if (q.mode === 'clinical') return answerClinical(-1);
    finishAnswer(false, `Era: <b>${esc(ctx.infoFor(it).name)}</b>`, itemId(it));
    highlight(it);
  }

  function next() {
    if (q.i < q.items.length - 1) {
      q.i++;
      show();
      return;
    }
    // resultado
    const pct = Math.round((q.score / q.items.length) * 100);
    ctx.viewer.setGhost(null);
    highlight(null);
    const missNames = q.misses.map((m) => (q.mode === 'clinical' ? m.q.slice(0, 70) + '…' : ctx.infoFor(m).name));
    $('#quiz-progress').textContent = 'Resultado';
    $('#quiz-body').innerHTML = `<h3>${q.score}/${q.items.length} (${pct} %)</h3>
      <p class="muted small">Dominio acumulado de este órgano: ${mastery()} %</p>
      ${missNames.length ? `<p class="small"><b>Para repasar:</b></p><ul class="small misses">${missNames.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}`;
    const fb = $('#quiz-feedback');
    fb.textContent = pct >= 80 ? '¡Excelente!' : pct >= 50 ? 'Bien, sigue practicando.' : 'Repasa con el recorrido guiado y vuelve a intentarlo.';
    fb.className = `feedback ${pct >= 50 ? 'ok' : 'bad'}`;
    $('#quiz-next').classList.add('hidden');
    $('#quiz-skip').classList.add('hidden');
    q.mode = 'done';
  }

  function stop() {
    if (!q.mode) return;
    q.mode = null;
    ctx.viewer.setGhost(null);
    highlight(null);
    $('#quiz-card').classList.add('hidden');
  }

  $('#quiz-skip').onclick = skip;
  $('#quiz-next').onclick = next;

  return {
    start,
    stop,
    onPick,
    mastery,
    get active() {
      return !!q.mode;
    },
    get clickMode() {
      return q.mode === 'click';
    },
  };
}

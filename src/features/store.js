// Persistencia local (solo en este navegador). Todo envuelto en try/catch:
// en modo privado o con almacenamiento bloqueado la app sigue funcionando sin guardar.

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- progreso
const PKEY = 'anatomed.progress.v1';
let progress = load(PKEY, {});
const org = (id) => (progress[id] ||= { viewed: {}, stats: {} });

export const Progress = {
  markViewed(organId, itemId) {
    const o = org(organId);
    if (o.viewed[itemId]) return false;
    o.viewed[itemId] = Date.now();
    save(PKEY, progress);
    return true;
  },
  isViewed(organId, itemId) {
    return !!org(organId).viewed[itemId];
  },
  viewedCount(organId, ids) {
    const v = org(organId).viewed;
    return ids.filter((id) => v[id]).length;
  },
  record(organId, itemId, ok) {
    const s = (org(organId).stats[itemId] ||= { c: 0, w: 0, last: 0 });
    if (ok) s.c++;
    else s.w++;
    s.last = Date.now();
    save(PKEY, progress);
  },
  stat(organId, itemId) {
    return org(organId).stats[itemId] || { c: 0, w: 0, last: 0 };
  },
  reset(organId) {
    progress[organId] = { viewed: {}, stats: {} };
    save(PKEY, progress);
  },
};

// ------------------------------------------------------------------- notas
const NKEY = 'anatomed.notes.v1';
let notes = load(NKEY, {});

export const Notes = {
  list(organId) {
    return notes[organId] || [];
  },
  add(organId, pos, key) {
    const n = { id: `n${Date.now().toString(36)}`, pos, key, text: '', created: Date.now() };
    (notes[organId] ||= []).push(n);
    save(NKEY, notes);
    return n;
  },
  update(organId, id, text) {
    const n = this.list(organId).find((x) => x.id === id);
    if (n) {
      n.text = text;
      n.updated = Date.now();
      save(NKEY, notes);
    }
  },
  remove(organId, id) {
    notes[organId] = this.list(organId).filter((x) => x.id !== id);
    save(NKEY, notes);
  },
};

// ------------------------------------------------- respaldo / sincronización
const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
const num = (x) => (Number.isFinite(+x) ? +x : 0);

/** Copia de todo lo guardado (progreso + notas). */
export function snapshot() {
  return JSON.parse(JSON.stringify({ progress, notes }));
}

/** Resumen numérico de lo guardado. */
export function summary(data = { progress, notes }) {
  let viewed = 0;
  let answers = 0;
  let nNotes = 0;
  for (const o of Object.values(data.progress || {})) {
    viewed += Object.keys(o.viewed || {}).length;
    for (const s of Object.values(o.stats || {})) answers += num(s.c) + num(s.w);
  }
  for (const list of Object.values(data.notes || {})) nNotes += (list || []).length;
  return { viewed, answers, notes: nNotes };
}

/**
 * Fusiona datos importados (de un archivo o de un enlace) con los locales.
 * Los datos importados no son confiables: se validan campo por campo.
 * - Revisadas: unión.  - Estadísticas del quiz: se conserva el máximo (reimportar no duplica).
 * - Notas: por id; si existe, gana la editada más recientemente.
 */
export function mergeSnapshot(data, { replace = false } = {}) {
  if (!isObj(data)) throw new Error('Formato no válido');
  const inP = isObj(data.progress) ? data.progress : {};
  const inN = isObj(data.notes) ? data.notes : {};
  if (replace) {
    progress = {};
    notes = {};
  }
  const res = { viewed: 0, notesAdded: 0, notesUpdated: 0 };
  for (const [organId, o] of Object.entries(inP)) {
    if (!isObj(o) || organId.length > 40) continue;
    const dst = (progress[organId] ||= { viewed: {}, stats: {} });
    const viewed = Array.isArray(o.viewed) ? Object.fromEntries(o.viewed.map((k) => [k, Date.now()])) : isObj(o.viewed) ? o.viewed : {};
    for (const [k, t] of Object.entries(viewed)) {
      if (typeof k !== 'string' || k.length > 120) continue;
      if (!dst.viewed[k]) res.viewed++;
      dst.viewed[k] = dst.viewed[k] ? Math.min(dst.viewed[k], num(t) || Date.now()) : num(t) || Date.now();
    }
    for (const [k, st] of Object.entries(isObj(o.stats) ? o.stats : {})) {
      if (typeof k !== 'string' || k.length > 120 || !isObj(st)) continue;
      const d = (dst.stats[k] ||= { c: 0, w: 0, last: 0 });
      d.c = Math.max(d.c, Math.min(9999, num(st.c)));
      d.w = Math.max(d.w, Math.min(9999, num(st.w)));
      d.last = Math.max(d.last, num(st.last));
    }
  }
  for (const [organId, list] of Object.entries(inN)) {
    if (!Array.isArray(list) || organId.length > 40) continue;
    const dst = (notes[organId] ||= []);
    for (const n of list) {
      if (!isObj(n) || typeof n.id !== 'string' || !Array.isArray(n.pos) || n.pos.length !== 3) continue;
      const clean = {
        id: n.id.slice(0, 40),
        pos: n.pos.map(num),
        key: typeof n.key === 'string' ? n.key.slice(0, 120) : '',
        text: typeof n.text === 'string' ? n.text.slice(0, 5000) : '',
        created: num(n.created) || Date.now(),
        updated: num(n.updated) || num(n.created) || Date.now(),
      };
      const i = dst.findIndex((x) => x.id === clean.id);
      if (i < 0) {
        dst.push(clean);
        res.notesAdded++;
      } else if ((dst[i].updated || dst[i].created) < clean.updated) {
        dst[i] = clean;
        res.notesUpdated++;
      }
    }
  }
  save(PKEY, progress);
  save(NKEY, notes);
  return res;
}

export function resetAll() {
  progress = {};
  notes = {};
  save(PKEY, progress);
  save(NKEY, notes);
}

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
      save(NKEY, notes);
    }
  },
  remove(organId, id) {
    notes[organId] = this.list(organId).filter((x) => x.id !== id);
    save(NKEY, notes);
  },
};

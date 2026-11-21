import QRCode from 'qrcode';
import { snapshot, mergeSnapshot } from './store.js';

// Respaldo y traspaso entre dispositivos SIN servidor:
//  - Archivo .json descargable / importable.
//  - Enlace con los datos comprimidos en el fragmento (#sync=...). El fragmento no se envía
//    al servidor al abrir el enlace, así que los datos viajan solo entre tus dispositivos.

const APP = 'AnatoMed 3D';
const VERSION = 1;

export function buildBackup() {
  return { app: APP, version: VERSION, exported: new Date().toISOString(), data: snapshot() };
}

export function downloadBackup() {
  const blob = new Blob([JSON.stringify(buildBackup(), null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `anatomed-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/** Lee un respaldo (texto JSON) y lo fusiona. Devuelve el resumen de cambios. */
export function importBackupText(text) {
  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new Error('El archivo no es un respaldo válido (JSON dañado).');
  }
  if (obj?.app !== APP || !obj.data) throw new Error('El archivo no es un respaldo de AnatoMed 3D.');
  if (obj.version > VERSION) throw new Error('El respaldo es de una versión más nueva de la app. Actualiza la página.');
  return mergeSnapshot(obj.data);
}

// ------------------------------------------------------------ enlace / QR
/** Versión compacta para el enlace: revisadas como lista (sin fechas) y coordenadas redondeadas. */
function compact() {
  const { progress, notes } = snapshot();
  const p = {};
  for (const [id, o] of Object.entries(progress)) {
    const viewed = Object.keys(o.viewed || {});
    const stats = {};
    for (const [k, s] of Object.entries(o.stats || {})) if (s.c || s.w) stats[k] = { c: s.c, w: s.w, last: s.last };
    if (viewed.length || Object.keys(stats).length) p[id] = { viewed, stats };
  }
  const n = {};
  for (const [id, list] of Object.entries(notes)) {
    if (list?.length) n[id] = list.map((x) => ({ ...x, pos: x.pos.map((v) => Math.round(v * 1e5) / 1e5) }));
  }
  return { a: 'am', v: VERSION, progress: p, notes: n };
}

const toB64url = (bytes) => {
  let s = '';
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (str) => {
  const b = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

async function deflate(text) {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function inflate(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return await new Response(stream).text();
}

export async function buildSyncLink() {
  const payload = toB64url(await deflate(JSON.stringify(compact())));
  return `${location.origin}${location.pathname}#sync=${payload}`;
}

/** Si la URL trae #sync=..., devuelve los datos decodificados (o null). */
export async function readSyncFromUrl() {
  const m = location.hash.match(/^#sync=([A-Za-z0-9_-]+)$/);
  if (!m) return null;
  const obj = JSON.parse(await inflate(fromB64url(m[1])));
  if (obj?.a !== 'am') throw new Error('Enlace no válido');
  return obj;
}

export function applySync(obj) {
  return mergeSnapshot(obj);
}

/** Dibuja el QR del enlace. Devuelve false si los datos no caben en un QR. */
export async function drawQR(canvas, link) {
  try {
    await QRCode.toCanvas(canvas, link, { errorCorrectionLevel: 'L', margin: 1, width: 240, color: { dark: '#0e1116', light: '#ffffff' } });
    return true;
  } catch {
    return false;
  }
}

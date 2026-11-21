// Calcula una transformación de semejanza (rotación + escala uniforme + traslación)
// que lleva piezas de un modelo "source" al espacio de un modelo "target".
// 1) inicialización con pares de centroides (Horn), 2) refinamiento ICP recortado.
// usage: node align.mjs <config.json> <out.json>
//   config: { source:{file, nodes:[...]}, target:{file, nodes:[...]}, pairs:[[srcNodes[], tgtNodes[]], ...], iterations }
import fs from 'node:fs';
import { NodeIO } from '@gltf-transform/core';

const [cfgFile, outFile] = process.argv.slice(2);
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
const io = new NodeIO();

function mulMat4Vec(m, v) {
  return [m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12], m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13], m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14]];
}
async function points(file, names, maxPts, extra = []) {
  const doc = await io.read(file);
  const want = new Set(names);
  const wantExtra = new Set(extra);
  const pts = [];
  const byName = {};
  for (const n of doc.getRoot().listNodes()) {
    const main = want.has(n.getName());
    if ((!main && !wantExtra.has(n.getName())) || !n.getMesh() || byName[n.getName()]) continue;
    const m = n.getWorldMatrix();
    const arr = (byName[n.getName()] = []);
    for (const prim of n.getMesh().listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      const v = [0, 0, 0];
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, v);
        const w = mulMat4Vec(m, v);
        if (main) pts.push(w);
        arr.push(w);
      }
    }
  }
  for (const nm of names) if (!byName[nm]) console.warn('missing node', nm, 'in', file);
  const step = Math.max(1, Math.floor(pts.length / maxPts));
  return { all: pts, sample: pts.filter((_, i) => i % step === 0), byName };
}
const centroid = (pts) => pts.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map((x) => x / pts.length);

// Jacobi para matriz simétrica 4x4 -> autovector del mayor autovalor
function largestEigenvector(A) {
  const n = 4;
  const a = A.map((r) => r.slice());
  const V = [...Array(n)].map((_, i) => [...Array(n)].map((_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2;
    if (off < 1e-18) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-20) continue;
        const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
  }
  let best = 0;
  for (let i = 1; i < n; i++) if (a[i][i] > a[best][best]) best = i;
  return V.map((r) => r[best]);
}

// Horn: semejanza que minimiza |s R p + t - q|
function horn(P, Q) {
  const cp = centroid(P);
  const cq = centroid(Q);
  let S = [...Array(3)].map(() => [0, 0, 0]);
  let sp = 0;
  let sq = 0;
  for (let i = 0; i < P.length; i++) {
    const p = [P[i][0] - cp[0], P[i][1] - cp[1], P[i][2] - cp[2]];
    const q = [Q[i][0] - cq[0], Q[i][1] - cq[1], Q[i][2] - cq[2]];
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) S[a][b] += p[a] * q[b];
    sp += p[0] ** 2 + p[1] ** 2 + p[2] ** 2;
    sq += q[0] ** 2 + q[1] ** 2 + q[2] ** 2;
  }
  const [[Sxx, Sxy, Sxz], [Syx, Syy, Syz], [Szx, Szy, Szz]] = S;
  const N = [
    [Sxx + Syy + Szz, Syz - Szy, Szx - Sxz, Sxy - Syx],
    [Syz - Szy, Sxx - Syy - Szz, Sxy + Syx, Szx + Sxz],
    [Szx - Sxz, Sxy + Syx, -Sxx + Syy - Szz, Syz + Szy],
    [Sxy - Syx, Szx + Sxz, Syz + Szy, -Sxx - Syy + Szz],
  ];
  const [w, x, y, z] = largestEigenvector(N);
  const R = [
    [w * w + x * x - y * y - z * z, 2 * (x * y - w * z), 2 * (x * z + w * y)],
    [2 * (x * y + w * z), w * w - x * x + y * y - z * z, 2 * (y * z - w * x)],
    [2 * (x * z - w * y), 2 * (y * z + w * x), w * w - x * x - y * y + z * z],
  ];
  const s = cfg.noScale ? 1 : Math.sqrt(sq / sp);
  const Rcp = [0, 1, 2].map((i) => R[i][0] * cp[0] + R[i][1] * cp[1] + R[i][2] * cp[2]);
  const t = [0, 1, 2].map((i) => cq[i] - s * Rcp[i]);
  return { R, s, t };
}
const apply = (T, p) => [0, 1, 2].map((i) => T.s * (T.R[i][0] * p[0] + T.R[i][1] * p[1] + T.R[i][2] * p[2]) + T.t[i]);
const compose = (A, B) => {
  // A después de B
  const R = [0, 1, 2].map((i) => [0, 1, 2].map((j) => A.R[i][0] * B.R[0][j] + A.R[i][1] * B.R[1][j] + A.R[i][2] * B.R[2][j]));
  return { R, s: A.s * B.s, t: apply(A, B.t) };
};

// grilla espacial para vecino más cercano
function buildGrid(pts, cell) {
  const g = new Map();
  const key = (x, y, z) => `${x},${y},${z}`;
  for (const p of pts) {
    const k = key(Math.floor(p[0] / cell), Math.floor(p[1] / cell), Math.floor(p[2] / cell));
    if (!g.has(k)) g.set(k, []);
    g.get(k).push(p);
  }
  return (q) => {
    const cx = Math.floor(q[0] / cell);
    const cy = Math.floor(q[1] / cell);
    const cz = Math.floor(q[2] / cell);
    let best = null;
    let bd = Infinity;
    for (let r = 1; r <= 4 && !best; r++)
      for (let dx = -r; dx <= r; dx++)
        for (let dy = -r; dy <= r; dy++)
          for (let dz = -r; dz <= r; dz++) {
            const arr = g.get(key(cx + dx, cy + dy, cz + dz));
            if (!arr) continue;
            for (const p of arr) {
              const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2;
              if (d < bd) (bd = d), (best = p);
            }
          }
    return [best, bd];
  };
}

const pairNames = (i) => (cfg.pairs || []).flatMap((p) => p[i]);
const src = await points(cfg.source.file, cfg.source.nodes, 4000, pairNames(0));
const tgt = await points(cfg.target.file, cfg.target.nodes, 40000, pairNames(1));

let T;
if (cfg.pairs) {
  const P = cfg.pairs.map(([a]) => centroid(a.flatMap((n) => src.byName[n] || [])));
  const Q = cfg.pairs.map(([, b]) => centroid(b.flatMap((n) => tgt.byName[n] || [])));
  T = horn(P, Q);
  const err = P.map((p, i) => Math.hypot(...apply(T, p).map((v, k) => v - Q[i][k])));
  console.log('pair init residuals (mm):', err.map((e) => (e * 1000).toFixed(1)).join(' '));
} else {
  const cs = centroid(src.sample);
  const ct = centroid(tgt.sample);
  T = { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], s: 1, t: [ct[0] - cs[0], ct[1] - cs[1], ct[2] - cs[2]] };
}

const nn = buildGrid(tgt.sample, 0.006);
const rms = (T) => {
  const d = src.sample.map((p) => nn(apply(T, p))[1]).sort((a, b) => a - b);
  return Math.sqrt(d.slice(0, Math.floor(d.length * 0.8)).reduce((a, b) => a + b, 0) / Math.floor(d.length * 0.8));
};
console.log('initial trimmed RMS (mm):', (rms(T) * 1000).toFixed(2));
for (let it = 0; it < (cfg.iterations ?? 40); it++) {
  const pairs = src.sample.map((p) => {
    const tp = apply(T, p);
    const [q, d] = nn(tp);
    return { tp, q, d };
  });
  pairs.sort((a, b) => a.d - b.d);
  const keep = pairs.slice(0, Math.floor(pairs.length * (cfg.trim ?? 0.8)));
  const dT = horn(
    keep.map((k) => k.tp),
    keep.map((k) => k.q),
  );
  T = compose(dT, T);
}
console.log('final trimmed RMS (mm):', (rms(T) * 1000).toFixed(2), 'scale', T.s.toFixed(4));

// matriz 4x4 column-major (glTF)
const m = [
  T.s * T.R[0][0], T.s * T.R[1][0], T.s * T.R[2][0], 0,
  T.s * T.R[0][1], T.s * T.R[1][1], T.s * T.R[2][1], 0,
  T.s * T.R[0][2], T.s * T.R[1][2], T.s * T.R[2][2], 0,
  T.t[0], T.t[1], T.t[2], 1,
];
fs.writeFileSync(outFile, JSON.stringify(m));

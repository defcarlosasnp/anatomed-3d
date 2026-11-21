// Extrae mallas seleccionadas de un GLB a un GLB compacto (+ JSON de puntos de referencia).
// usage: node extract.mjs <in.glb> <out.glb> <out-landmarks.json> <config.json>
// config: {
//   parts: [{ key, src: "Nombre nodo" | ["Nodo A", "Nodo B"] }],   // array = se agrupan en una sola parte
//   landmarkScopes: ["Heart.g/"],                                    // opcional (nodos .t/.j de Z-Anatomy)
//   transform: "T.json",                                             // opcional: matriz 4x4 (column-major)
//   matchPrefix: "Allen_"                                            // opcional: busca también "<prefix><nombre>"
// }
import fs from 'node:fs';
import path from 'node:path';
import { NodeIO, getBounds } from '@gltf-transform/core';
import { flatten, prune, dedup, weld, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

const [inFile, outFile, lmFile, cfgFile] = process.argv.slice(2);
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
const io = new NodeIO();
const doc = await io.read(inFile);
const root = doc.getRoot();
const scene = root.getDefaultScene() || root.listScenes()[0];
const T = cfg.transform ? JSON.parse(fs.readFileSync(path.resolve(path.dirname(cfgFile), cfg.transform), 'utf8')) : null;

function mul(a, b) {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
}
const applyT = (p) => (T ? [0, 1, 2].map((i) => T[i] * p[0] + T[4 + i] * p[1] + T[8 + i] * p[2] + T[12 + i]) : p);

function pathOf(n) {
  const parts = [];
  let p = n;
  while (p && p.propertyType === 'Node') {
    parts.unshift(p.getName());
    p = p.getParentNode();
  }
  return parts.join('/');
}

// ---- puntos de referencia (.t con ancla .j) ----
const landmarks = [];
for (const n of root.listNodes()) {
  const name = n.getName();
  if (!cfg.landmarkScopes || !name.endsWith('.t')) continue;
  const p = pathOf(n);
  if (!cfg.landmarkScopes.some((s) => p.includes(s))) continue;
  const j = n.listChildren().find((c) => c.getName().endsWith('.j'));
  if (!j) continue;
  let pos;
  if (j.getMesh()) {
    const b = getBounds(j);
    pos = [0, 1, 2].map((i) => (b.min[i] + b.max[i]) / 2);
  } else {
    const m = j.getWorldMatrix();
    pos = [m[12], m[13], m[14]];
  }
  landmarks.push({ en: name.slice(0, -2), pos: applyT(pos) });
}

// ---- mallas ----
await doc.transform(flatten());
const byName = new Map();
for (const n of root.listNodes()) if (n.getMesh() && !byName.has(n.getName())) byName.set(n.getName(), n);
const find = (nm) => byName.get(nm) || (cfg.matchPrefix ? byName.get(cfg.matchPrefix + nm) : null);

const kept = [];
for (const p of cfg.parts) {
  const srcs = Array.isArray(p.src) ? p.src : [p.src];
  const nodes = srcs.map((s) => {
    const n = find(s);
    if (!n) console.warn('MISSING:', s);
    return n;
  }).filter(Boolean);
  if (!nodes.length) continue;
  let node;
  if (nodes.length === 1 && !Array.isArray(p.src)) {
    node = nodes[0];
    for (const c of node.listChildren()) node.removeChild(c);
  } else {
    node = doc.createNode(p.key);
    for (const n of nodes) {
      for (const c of n.listChildren()) n.removeChild(c);
      n.getParentNode()?.removeChild(n);
      node.addChild(n);
    }
  }
  node.setName(p.key);
  kept.push(node);
}
for (const c of scene.listChildren()) scene.removeChild(c);
for (const s of root.listScenes()) if (s !== scene) s.dispose();
for (const n of kept) {
  if (T) n.setMatrix(mul(T, n.getMatrix()));
  scene.addChild(n);
}
for (const m of root.listMaterials()) m.dispose();
await doc.transform(prune(), dedup());
if (cfg.simplify) {
  await MeshoptSimplifier.ready;
  // solo posiciones: atributos extra y normales planas impiden fusionar vértices
  for (const m of root.listMeshes())
    for (const prim of m.listPrimitives())
      for (const sem of prim.listSemantics()) if (sem !== 'POSITION') prim.setAttribute(sem, null);
  await doc.transform(weld({ tolerance: 0.00002 }), simplify({ simplifier: MeshoptSimplifier, ratio: cfg.simplify.ratio ?? 0.4, error: cfg.simplify.error ?? 0.0004 }), prune());
}

const b = getBounds(scene);
console.log('parts', kept.length, 'bounds', b.min.map((v) => v.toFixed(3)).join(','), '→', b.max.map((v) => v.toFixed(3)).join(','));
if (cfg.verbose) {
  for (const n of kept) {
    const nb = getBounds(n);
    console.log(' ', n.getName().padEnd(26), 'c', [0, 1, 2].map((i) => ((nb.min[i] + nb.max[i]) / 2).toFixed(3)).join(','));
  }
}
await io.write(outFile, doc);
if (lmFile && lmFile !== '-') fs.writeFileSync(lmFile, JSON.stringify(landmarks, null, 1));
console.log('landmarks', landmarks.length, 'size', fs.statSync(outFile).size);

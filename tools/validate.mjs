import { NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { pathToFileURL, fileURLToPath } from 'node:url';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const root = fileURLToPath(new URL('../', import.meta.url)).split('\\').join('/');
const { organs } = await import(pathToFileURL(root + 'src/organs/index.js'));
const procedural = new Set(['chordae', 'm_long', 'm_circ', 'm_obl', 'submucosa', 'mucosa']);
for (const o of organs) {
  const names = new Set();
  for (const m of o.models) {
    const doc = await io.read(root + 'public/' + m);
    for (const n of doc.getRoot().getDefaultScene().listChildren()) names.add(n.getName());
  }
  if (o.build) for (const k of Object.keys(o.parts)) names.add(k);
  const keys = Object.keys(o.parts);
  const missing = keys.filter((k) => !names.has(k) && !procedural.has(k));
  const unused = [...names].filter((n) => !o.parts[n]);
  const refs = new Set([...(o.labelParts || []), ...(o.frame || []), ...(o.tours || []).flatMap((t) => t.steps.flatMap((s) => s.parts || []))]);
  const badRefs = [...refs].filter((k) => !o.parts[k]);
  const badGroups = keys.filter((k) => !o.groups.some((g) => g.id === o.parts[k].group));
  console.log(o.id.padEnd(8), 'parts', keys.length, '| sin malla:', missing.join(',') || '-', '| sin datos:', unused.join(',') || '-', '| refs malas:', badRefs.join(',') || '-', '| grupos malos:', badGroups.join(',') || '-');
}

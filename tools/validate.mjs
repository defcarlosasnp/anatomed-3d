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
  let refs = new Set([...(o.labelParts || []), ...(o.frame || []), ...(o.tours || []).flatMap((t) => t.steps.flatMap((s) => s.parts || []))]);
  const specKeys = (sp) => (typeof sp === 'string' ? (sp === 'center' ? [] : [sp]) : !sp ? [] : sp.between ? sp.between : sp.mid ? sp.mid.flatMap(specKeys) : sp.apex ? [sp.apex] : sp.key ? [sp.key] : []);
  for (const c of o.cutPresets || []) for (const sp of [...(c.through || []), ...(c.axis || []), c.at]) specKeys(sp).forEach((k) => refs.add(k));
  for (const poi of o.pois || []) specKeys(poi.at).forEach((k) => refs.add(k));
  for (const q of o.clinicalQs || []) (q.parts || []).forEach((k) => refs.add(k));
  const badRefs = [...refs].filter((k) => !o.parts[k]);
  const badAnswers = (o.clinicalQs || []).filter((q) => !(q.answer >= 0 && q.answer < q.options.length)).length;
  if (badAnswers) console.log(o.id, 'respuestas inválidas:', badAnswers);
  const badGroups = keys.filter((k) => !o.groups.some((g) => g.id === o.parts[k].group));
  console.log(o.id.padEnd(8), 'parts', keys.length, '| sin malla:', missing.join(',') || '-', '| sin datos:', unused.join(',') || '-', '| refs malas:', badRefs.join(',') || '-', '| grupos malos:', badGroups.join(',') || '-');
}

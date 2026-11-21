import { NodeIO } from '@gltf-transform/core';
const [file, filter, maxDepth] = process.argv.slice(2);
const io = new NodeIO();
const doc = await io.read(file);
const re = filter ? new RegExp(filter, 'i') : null;
const scene = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0];
function walk(n, depth, path) {
  const name = n.getName();
  const m = n.getMesh();
  const p = path + '/' + name;
  if ((!re || re.test(p)) && depth <= (maxDepth ? +maxDepth : 99)) {
    console.log('  '.repeat(depth) + name + (m ? ` [mesh ${m.listPrimitives().reduce((a, pr) => a + (pr.getAttribute('POSITION')?.getCount() || 0), 0)}v]` : '') + ` (${n.listChildren().length})`);
  }
  for (const c of n.listChildren()) walk(c, depth + 1, p);
}
for (const n of scene.listChildren()) walk(n, 0, '');

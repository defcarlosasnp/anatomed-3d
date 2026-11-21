import { NodeIO, getBounds } from '@gltf-transform/core';
const [file, ...names] = process.argv.slice(2);
const doc = await new NodeIO().read(file);
for (const n of doc.getRoot().listNodes()) {
  if (names.length && !names.includes(n.getName())) continue;
  if (!names.length && n.getParentNode()) continue;
  const b = getBounds(n);
  const c = [0, 1, 2].map((i) => ((b.min[i] + b.max[i]) / 2).toFixed(3));
  const s = [0, 1, 2].map((i) => (b.max[i] - b.min[i]).toFixed(3));
  console.log(n.getName().padEnd(40), 'c', c.join(','), 'size', s.join(','));
}

import { NodeIO } from '@gltf-transform/core';
const doc = await new NodeIO().read(process.argv[2]);
const names = new Map();
for (const n of doc.getRoot().listNodes()) {
  if (!n.getMesh()) continue;
  const nm = n.getName();
  const m = nm.match(/^Allen_(.*)_([LR])$/);
  const base = m ? m[1] : nm;
  const verts = n.getMesh().listPrimitives().reduce((a, p) => a + p.getAttribute('POSITION').getCount(), 0);
  const e = names.get(base) || { L: null, R: null, v: 0 };
  if (m) e[m[2]] = nm;
  else e.single = nm;
  e.v += verts;
  names.set(base, e);
}
const out = [...names].map(([base, e]) => ({ key: base, src: [e.L, e.R, e.single].filter(Boolean), v: e.v }));
console.log(JSON.stringify(out));

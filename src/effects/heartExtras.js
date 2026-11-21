import * as THREE from 'three';

// Cuerdas tendinosas esquemáticas: desde la punta de cada músculo papilar hacia el borde
// de su válvula AV, con ramificación de 2.º orden. Geometría en coordenadas del modelo.
const SETS = [
  { valve: 'tv', papillary: ['pm_rv_ant', 'pm_rv_post', 'pm_rv_sep'] },
  { valve: 'mv', papillary: ['pm_lv_al', 'pm_lv_pm'] },
];

function vertices(viewer, key) {
  const p = viewer.parts.get(key);
  const out = [];
  if (!p) return out;
  const v = new THREE.Vector3();
  for (const m of p.meshes) {
    const pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) out.push(v.fromBufferAttribute(pos, i).applyMatrix4(m.userData.toSpace).clone());
  }
  return out;
}

export function createChordae(viewer) {
  const group = new THREE.Group();
  group.name = 'chordae';
  const radius = 0.00042;
  for (const set of SETS) {
    const valveV = vertices(viewer, set.valve);
    const valvePart = viewer.parts.get(set.valve);
    if (!valveV.length || !valvePart) continue;
    for (const pk of set.papillary) {
      const pv = vertices(viewer, pk);
      if (!pv.length) continue;
      // punta del papilar: vértice más cercano al centro de la válvula
      const tip = pv.reduce((a, b) => (b.distanceToSquared(valvePart.centroid) < a.distanceToSquared(valvePart.centroid) ? b : a));
      // candidatos: vértices de la válvula más cercanos a la punta
      const cand = valveV
        .map((v) => ({ v, d: v.distanceToSquared(tip) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 160)
        .map((c) => c.v);
      // muestreo por punto más lejano para repartir las inserciones
      const picks = [cand[0]];
      while (picks.length < 8 && picks.length < cand.length) {
        let best = null;
        let bd = -1;
        for (const c of cand) {
          const d = Math.min(...picks.map((p) => p.distanceToSquared(c)));
          if (d > bd) (bd = d), (best = c);
        }
        picks.push(best);
      }
      // 4 cuerdas de primer orden, cada una se divide en 2
      for (let i = 0; i < picks.length; i += 2) {
        const a = picks[i];
        const b = picks[i + 1] || picks[i];
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const split = tip.clone().lerp(mid, 0.65);
        const main = new THREE.CatmullRomCurve3([tip, tip.clone().lerp(split, 0.5), split]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(main, 12, radius, 6, false)));
        for (const t of [a, b]) {
          const br = new THREE.LineCurve3(split, t);
          group.add(new THREE.Mesh(new THREE.TubeGeometry(br, 4, radius * 0.7, 5, false)));
        }
      }
    }
  }
  return group.children.length ? viewer.addPart(group) : null;
}

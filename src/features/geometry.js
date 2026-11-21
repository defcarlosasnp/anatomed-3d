import * as THREE from 'three';

// Utilidades para ubicar puntos sobre las mallas (coordenadas del modelo).

function eachVertex(viewer, key, fn) {
  const p = viewer.parts.get(key);
  if (!p) return false;
  const v = new THREE.Vector3();
  for (const m of p.meshes) {
    const pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) fn(v.fromBufferAttribute(pos, i).applyMatrix4(m.userData.toSpace));
  }
  return true;
}

/** Vértice extremo de una parte en una dirección. */
export function extremeVertex(viewer, key, dir) {
  const d = new THREE.Vector3(...dir).normalize();
  let best = null;
  let bd = -Infinity;
  eachVertex(viewer, key, (v) => {
    const k = v.dot(d);
    if (k > bd) (bd = k), (best = v.clone());
  });
  return best;
}

/** Vértice más lejano a un punto. */
export function farthestVertex(viewer, key, from) {
  let best = null;
  let bd = -1;
  eachVertex(viewer, key, (v) => {
    const k = v.distanceToSquared(from);
    if (k > bd) (bd = k), (best = v.clone());
  });
  return best;
}

/** Punto medio entre las superficies más cercanas de dos partes (límites, cisuras, surcos). */
export function between(viewer, a, b) {
  const pa = viewer.parts.get(a);
  const pb = viewer.parts.get(b);
  if (!pa || !pb) return null;
  const p1 = viewer.nearestVertex(a, pb.centroid);
  const p2 = viewer.nearestVertex(b, p1);
  const p3 = viewer.nearestVertex(a, p2);
  return p3.add(p2).multiplyScalar(0.5);
}

function valveCenter(viewer) {
  const keys = ['mv', 'tv', 'ao_l', 'ao_n', 'ao_r', 'pv_a', 'pv_l', 'pv_r'].filter((k) => viewer.parts.has(k));
  const c = new THREE.Vector3();
  keys.forEach((k) => c.add(viewer.parts.get(k).centroid));
  return c.divideScalar(keys.length || 1);
}

/**
 * Resuelve una especificación de punto:
 *  'clave'               → centroide de la parte (o su superficie externa si surface=true)
 *  { key, dir:[x,y,z] }  → vértice extremo en esa dirección
 *  { between:[a,b] }     → límite entre dos partes
 *  { mid:[spec, spec] }  → promedio de dos puntos
 *  { apex:'lv' }         → vértice más alejado del centro valvular (ápex ventricular)
 *  { key, add:[x,y,z] }  → centroide desplazado (metros)
 *  'center'              → centro del encuadre
 */
export function resolvePoint(viewer, spec, surface = false) {
  if (spec === 'center') return viewer.space.worldToLocal(viewer.frameBox().getCenter(new THREE.Vector3()));
  if (typeof spec === 'string') {
    const p = viewer.parts.get(spec);
    if (!p) return null;
    return surface ? viewer.outerPoint(spec) : p.centroid.clone();
  }
  if (spec.between) return between(viewer, ...spec.between);
  if (spec.mid) {
    const a = resolvePoint(viewer, spec.mid[0]);
    const b = resolvePoint(viewer, spec.mid[1]);
    return a && b ? a.add(b).multiplyScalar(0.5) : null;
  }
  if (spec.apex) return viewer.parts.has(spec.apex) ? farthestVertex(viewer, spec.apex, valveCenter(viewer)) : null;
  if (spec.dir) return extremeVertex(viewer, spec.key, spec.dir);
  if (spec.add) {
    const p = viewer.parts.get(spec.key);
    return p ? p.centroid.clone().add(new THREE.Vector3(...spec.add)) : null;
  }
  return null;
}

/**
 * Resuelve un corte predefinido → { n, p } en coordenadas del modelo. Se conserva el lado n·x ≤ n·p.
 *  { normal:[x,y,z], at: spec }
 *  { through:[a,b,c], toward:[x,y,z] }   plano por 3 puntos; n orientada hacia "toward"
 *  { axis:[a,b], at: spec }              n = dirección a→b (corte perpendicular a ese eje)
 */
export function resolveCut(viewer, cut) {
  let n;
  let p;
  if (cut.through) {
    const [a, b, c] = cut.through.map((s) => resolvePoint(viewer, s));
    if (!a || !b || !c) return null;
    n = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize();
    if (cut.toward && n.dot(new THREE.Vector3(...cut.toward)) < 0) n.negate();
    p = a.clone().add(b).add(c).divideScalar(3);
  } else if (cut.axis) {
    const a = resolvePoint(viewer, cut.axis[0]);
    const b = resolvePoint(viewer, cut.axis[1]);
    if (!a || !b) return null;
    n = b.clone().sub(a).normalize();
    p = resolvePoint(viewer, cut.at);
  } else {
    n = new THREE.Vector3(...cut.normal).normalize();
    p = resolvePoint(viewer, cut.at);
  }
  return p ? { n, p } : null;
}

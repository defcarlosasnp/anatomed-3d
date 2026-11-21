import * as THREE from 'three';

// Regiones del estómago y peristaltismo, calculados sobre la malla de Z-Anatomy.
// Sistema de coordenadas del modelo: +Y craneal, +X izquierda del paciente, +Z anterior.

// Normales promediadas por posición (las mallas tienen vértices duplicados en las costuras).
function smoothNormals(geo) {
  const pos = geo.attributes.position;
  const nrm = geo.attributes.normal;
  const acc = new Map();
  const keyOf = (i) => Math.round(pos.getX(i) * 1e5) + ',' + Math.round(pos.getY(i) * 1e5) + ',' + Math.round(pos.getZ(i) * 1e5);
  const keys = [];
  for (let i = 0; i < pos.count; i++) {
    const k = keyOf(i);
    keys.push(k);
    const a = acc.get(k) || [0, 0, 0];
    a[0] += nrm.getX(i);
    a[1] += nrm.getY(i);
    a[2] += nrm.getZ(i);
    acc.set(k, a);
  }
  const out = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const a = acc.get(keys[i]);
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    out[i * 3] = a[0] / l;
    out[i * 3 + 1] = a[1] / l;
    out[i * 3 + 2] = a[2] / l;
  }
  return out;
}

export function createStomachEffects(viewer, organ, landmarksRaw) {
  const cfg = organ.regions;
  const part = viewer.parts.get(cfg.part);
  if (!part) return null;

  const LM = {};
  for (const l of landmarksRaw) LM[l.en] = new THREE.Vector3(...l.pos);
  // Los puntos de Z-Anatomy son posiciones de etiqueta: se proyectan al vértice más cercano
  const snap = (name) => (LM[name] ? viewer.nearestVertex(cfg.part, LM[name]) : null);
  const cardia = snap('Cardia');
  const pylorus = snap('Pyloric part');
  const angular = snap('Angular incisure');
  const antrumLm = snap('Pyloric antrum');
  const bodyLm = LM['Body of stomach'];
  const lesser = LM['Lesser curvature of stomach'];
  const greater = LM['Greater curvature of stomach'];

  const regionIdx = Object.fromEntries(cfg.list.map((r, i) => [r.key, i]));
  const regionColors = cfg.list.map((r) => new THREE.Color(r.color));

  // Línea media aproximada (para el peristaltismo): cardias → cuerpo → ángulo → antro → píloro
  const spine = [cardia, bodyLm.clone().lerp(lesser, 0.5), greater.clone().lerp(angular, 0.5), antrumLm, pylorus];
  const segLen = [];
  let total = 0;
  for (let i = 0; i < spine.length - 1; i++) {
    const l = spine[i].distanceTo(spine[i + 1]);
    segLen.push(l);
    total += l;
  }
  const closest = new THREE.Vector3();
  const line = new THREE.Line3();
  const sOf = (v) => {
    let best = Infinity;
    let s = 0;
    let acc = 0;
    for (let i = 0; i < spine.length - 1; i++) {
      line.set(spine[i], spine[i + 1]);
      const t = line.closestPointToPointParameter(v, true);
      line.at(t, closest);
      const d = closest.distanceToSquared(v);
      if (d < best) (best = d), (s = (acc + t * segLen[i]) / total);
      acc += segLen[i];
    }
    return s;
  };

  const data = part.meshes.map((mesh) => {
    const geo = mesh.geometry;
    // el GLB guarda atributos intercalados: se separan para poder editar posiciones directamente
    for (const [name, attr] of Object.entries(geo.attributes)) {
      if (attr.isInterleavedBufferAttribute) geo.setAttribute(name, attr.clone());
    }
    const pos = geo.attributes.position;
    const n = pos.count;
    const region = new Uint8Array(n);
    const s = new Float32Array(n);
    const v = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(mesh.userData.toSpace);
      let r;
      if (v.distanceTo(cardia) < 0.016) r = 'cardia';
      else if (v.y > cardia.y + 0.002) r = 'fundus';
      else if (v.distanceTo(pylorus) < 0.017) r = 'pylorus';
      else if (v.x < angular.x + 0.03) r = 'antrum';
      else r = 'body';
      region[i] = regionIdx[r];
      s[i] = sOf(v);
    }
    const colors = new THREE.BufferAttribute(new Float32Array(n * 3), 3);
    geo.setAttribute('color', colors);
    return {
      mesh,
      region,
      s,
      colors,
      basePos: pos.array.slice(),
      normals: smoothNormals(geo),
      layers: [],
    };
  });

  // ------------------------------------------------ capas de la pared (esquemáticas)
  // Copias de la superficie desplazadas hacia adentro según la normal suavizada.
  const LAYERS = [
    { key: 'm_long', depth: 0.0012 },
    { key: 'm_circ', depth: 0.0024 },
    { key: 'm_obl', depth: 0.0036, skip: ['antrum', 'pylorus'] },
    { key: 'submucosa', depth: 0.0048 },
    { key: 'mucosa', depth: 0.006 },
  ];
  for (const L of LAYERS) {
    if (!organ.parts[L.key]) continue;
    const node = new THREE.Group();
    node.name = L.key;
    for (const d of data) {
      const scale = d.mesh.userData.toSpace.getMaxScaleOnAxis();
      const depth = L.depth / scale;
      const n = d.region.length;
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n * 3; i++) pos[i] = d.basePos[i] - d.normals[i] * depth;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(d.normals.slice(), 3));
      const src = d.mesh.geometry.index ? d.mesh.geometry.index.array : [...Array(n).keys()];
      const idx = [];
      const skip = new Set((L.skip || []).map((k) => regionIdx[k]));
      for (let t = 0; t < src.length; t += 3) {
        const a = src[t], b = src[t + 1], c = src[t + 2];
        if (skip.size && (skip.has(d.region[a]) || skip.has(d.region[b]) || skip.has(d.region[c]))) continue;
        idx.push(a, b, c);
      }
      g.setIndex(idx);
      const m = new THREE.Mesh(g);
      m.applyMatrix4(d.mesh.userData.toSpace);
      node.add(m);
      d.layers.push({ mesh: m, depth });
    }
    viewer.addPart(node);
  }

  part.material.vertexColors = true;
  part.material.color.set('#ffffff');
  part.material.needsUpdate = true;

  const state = { show: true, selected: null, hover: null, focus: null, peri: false };
  const base = part.baseColor;
  const c = new THREE.Color();
  const white = new THREE.Color('#ffffff');
  const dim = new THREE.Color('#1c1818');

  function paint() {
    for (const d of data) {
      const arr = d.colors.array;
      for (let i = 0; i < d.region.length; i++) {
        const ri = d.region[i];
        const key = cfg.list[ri].key;
        c.copy(state.show || state.focus ? regionColors[ri] : base);
        if (state.focus && !state.focus.has(key)) c.lerp(dim, 0.85);
        if (key === state.selected) c.lerp(white, 0.45);
        else if (key === state.hover) c.lerp(white, 0.22);
        arr[i * 3] = c.r;
        arr[i * 3 + 1] = c.g;
        arr[i * 3 + 2] = c.b;
      }
      d.colors.needsUpdate = true;
    }
  }
  paint();

  // ---------------------------------------------------------- peristaltismo
  const PERIOD = 4; // s por onda (≈3/min en la realidad; acelerado ×5)
  const AMP = 0.0045; // m
  function periTick(dt, t) {
    for (const d of data) {
      const pos = d.mesh.geometry.attributes.position;
      const arr = pos.array;
      for (let i = 0; i < d.s.length; i++) {
        const s = d.s[i];
        let k = 0;
        if (s > 0.3) {
          const x = (s - 0.3) / 0.7; // 0 = cuerpo medio, 1 = píloro
          for (const off of [0, 0.5]) {
            const w = (t / PERIOD + off) % 1;
            const dd = x - w;
            k = Math.max(k, Math.exp(-(dd * dd) / 0.004));
          }
          k *= 0.5 + 0.9 * x; // más intensas en el antro
        }
        const a = (AMP * k) / (d.mesh.userData.toSpace.getMaxScaleOnAxis() || 1);
        arr[i * 3] = d.basePos[i * 3] - d.normals[i * 3] * a;
        arr[i * 3 + 1] = d.basePos[i * 3 + 1] - d.normals[i * 3 + 1] * a;
        arr[i * 3 + 2] = d.basePos[i * 3 + 2] - d.normals[i * 3 + 2] * a;
        for (const L of d.layers) {
          const la = L.mesh.geometry.attributes.position.array;
          const dd = L.depth + a;
          la[i * 3] = d.basePos[i * 3] - d.normals[i * 3] * dd;
          la[i * 3 + 1] = d.basePos[i * 3 + 1] - d.normals[i * 3 + 1] * dd;
          la[i * 3 + 2] = d.basePos[i * 3 + 2] - d.normals[i * 3 + 2] * dd;
        }
      }
      pos.needsUpdate = true;
      for (const L of d.layers) L.mesh.geometry.attributes.position.needsUpdate = true;
    }
  }
  function periReset() {
    for (const d of data) {
      d.mesh.geometry.attributes.position.array.set(d.basePos);
      d.mesh.geometry.attributes.position.needsUpdate = true;
      for (const L of d.layers) {
        const la = L.mesh.geometry.attributes.position.array;
        for (let i = 0; i < la.length; i++) la[i] = d.basePos[i] - d.normals[i] * L.depth;
        L.mesh.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  return {
    regionOf(hit) {
      const d = data.find((x) => x.mesh === hit.object);
      if (!d || !hit.face) return null;
      return cfg.list[d.region[hit.face.a]].key;
    },
    setShow(v) {
      state.show = v;
      paint();
    },
    get show() {
      return state.show;
    },
    setSelected(key) {
      state.selected = key;
      paint();
    },
    setHover(key) {
      if (state.hover === key) return;
      state.hover = key;
      paint();
    },
    setFocus(keys) {
      state.focus = keys && keys.length ? new Set(keys) : null;
      paint();
    },
    startPeristalsis() {
      if (state.peri) return;
      state.peri = true;
      viewer.tickers.add(periTick);
    },
    stopPeristalsis() {
      state.peri = false;
      viewer.tickers.delete(periTick);
      periReset();
    },
    get peristalsis() {
      return state.peri;
    },
    landmarks() {
      return Object.keys(LM).map((en) => ({ en, pos: viewer.nearestVertex(cfg.part, LM[en]) }));
    },
  };
}

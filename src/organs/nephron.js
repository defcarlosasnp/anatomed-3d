// Nefrona yuxtamedular — modelo esquemático generado por código (no hay modelos libres de nefrona).
// Unidades arbitrarias: +Y = corteza, −Y = médula (papila en y ≈ −9.5). Límite corticomedular en y = 0.

const V = (x, y, z) => [x, y, z];

// Trayectos (los usa también effects/nephronFlow.js)
export const PATHS = {
  aff: [V(-4.5, 8.2, 0), V(-2.5, 7.6, 0.2), V(-1.3, 7.0, 0.3), V(-0.5, 6.4, 0.1)],
  eff: [V(0.4, 6.5, -0.1), V(1.0, 7.2, -0.6), V(1.8, 7.6, -1.0), V(2.8, 7.0, -1.4)],
  pct: [V(0.3, 5.2, 0.2), V(1.0, 4.6, 0.8), V(2.0, 5.0, 1.0), V(2.6, 5.8, 0.2), V(2.0, 6.4, -0.6), V(1.4, 5.6, -1.0), V(2.2, 4.6, -0.8), V(3.0, 4.2, 0.0), V(2.6, 3.4, 0.6), V(2.0, 2.6, 0.2), V(2.0, 1.8, 0)],
  dtl: [V(2.0, 1.8, 0), V(2.0, -1, 0), V(2.05, -4, 0), V(2.1, -7.5, 0), V(2.4, -8.6, 0)],
  atl: [V(2.4, -8.6, 0), V(2.8, -8.4, 0), V(3.0, -7, 0), V(3.0, -3.5, 0)],
  tal: [V(3.0, -3.5, 0), V(3.0, 0, 0), V(2.9, 3, 0.1), V(1.8, 4.0, 1.4), V(0.2, 5.9, 1.4), V(-0.6, 6.6, 0.9)],
  md: [V(-0.6, 6.6, 0.9), V(-0.9, 6.9, 0.6), V(-1.1, 7.1, 0.2)],
  dct: [V(-1.1, 7.1, 0.2), V(-1.8, 7.4, -0.4), V(-2.6, 6.8, -0.8), V(-2.2, 5.8, -0.2), V(-3.0, 5.2, 0.6), V(-3.8, 5.8, 0.4), V(-4.4, 6.4, 0)],
  cd: [V(-4.4, 6.4, 0), V(-5, 6.0, 0), V(-5, 2, 0), V(-5.1, -4, 0), V(-5.2, -9.5, 0)],
  vasa: [V(2.8, 7.0, -1.4), V(1.4, 1.5, -0.9), V(1.4, -6, -0.9), V(1.7, -8.0, -0.9), V(2.2, -6, -1.1), V(2.3, 1.5, -1.1), V(3.8, 0.5, -1.4)],
};
export const GLOM = V(0, 6, 0);

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function build(THREE) {
  const vec = (p) => new THREE.Vector3(...p);
  const tube = (name, pts, r, closed = false) => {
    const curve = new THREE.CatmullRomCurve3(pts.map(vec), closed);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(24, pts.length * 16), r, 12, closed));
    m.name = name;
    return m;
  };
  const nodes = [];
  nodes.push(tube('aff', PATHS.aff, 0.13));
  nodes.push(tube('eff', PATHS.eff, 0.1));
  nodes.push(tube('pct', PATHS.pct, 0.2));
  nodes.push(tube('dtl', PATHS.dtl, 0.11));
  nodes.push(tube('atl', PATHS.atl, 0.11));
  nodes.push(tube('tal', PATHS.tal, 0.17));
  nodes.push(tube('md', PATHS.md, 0.24));
  nodes.push(tube('dct', PATHS.dct, 0.18));
  // colector: tramo propio + segmento superior (otras nefronas que confluyen)
  const cd = new THREE.Group();
  cd.name = 'cd';
  cd.add(tube('cd_a', PATHS.cd, 0.3));
  cd.add(tube('cd_b', [V(-5, 9.2, 0), V(-5, 7.5, 0), V(-5, 6.0, 0)], 0.28));
  cd.add(tube('cd_c', [V(-6.6, 8.4, 0.4), V(-5.9, 6.6, 0.2), V(-5.05, 3.5, 0)], 0.22));
  nodes.push(cd);
  nodes.push(tube('vasa', PATHS.vasa, 0.09));

  // capilares peritubulares: siguen al túbulo proximal y al distal, desplazados
  const ptc = new THREE.Group();
  ptc.name = 'ptc';
  const off = (pts, d) => pts.map((p) => V(p[0] + d[0], p[1] + d[1], p[2] + d[2]));
  ptc.add(tube('ptc1', [PATHS.eff[3], ...off(PATHS.pct.slice(3), [0.35, 0.1, -0.45])], 0.07));
  ptc.add(tube('ptc2', [PATHS.eff[2], ...off(PATHS.dct.slice(1), [0.2, 0.35, -0.5])], 0.07));
  ptc.add(tube('ptc3', off(PATHS.pct.slice(0, 7).reverse(), [-0.3, -0.25, 0.45]), 0.07));
  nodes.push(ptc);

  // ovillo glomerular
  const glom = new THREE.Group();
  glom.name = 'glomerulus';
  const r = rng(7);
  const a = vec(PATHS.aff[3]);
  const e = vec(PATHS.eff[0]);
  for (let k = 0; k < 7; k++) {
    const pts = [a.clone()];
    for (let i = 0; i < 7; i++) {
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      const rad = 0.35 + r() * 0.35;
      pts.push(new THREE.Vector3(GLOM[0] + rad * Math.sin(ph) * Math.cos(th), GLOM[1] + rad * Math.cos(ph), GLOM[2] + rad * Math.sin(ph) * Math.sin(th)));
    }
    pts.push(e.clone());
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.06, 8, false));
    glom.add(m);
  }
  nodes.push(glom);

  const bow = new THREE.Mesh(new THREE.SphereGeometry(1.0, 40, 28));
  bow.position.set(...GLOM);
  bow.name = 'bowman';
  nodes.push(bow);
  return nodes;
}

export default {
  id: 'nephron',
  name: 'Nefrona',
  subtitle: 'Fisiología renal · esquema 3D',
  models: [],
  build,
  xray: { groups: ['vasos'], label: 'Vasos' },
  animation: 'flow',
  extra: { id: 'adh', label: 'ADH', defaultOn: true },
  labelParts: ['bowman', 'pct', 'dtl', 'atl', 'tal', 'md', 'dct', 'cd', 'vasa'],

  groups: [
    { id: 'corpusculo', name: 'Corpúsculo renal', color: '#d9534f' },
    { id: 'tubulo', name: 'Túbulo renal', color: '#e8c36a' },
    { id: 'colector', name: 'Sistema colector', color: '#7cc4e8' },
    { id: 'vasos', name: 'Vasos de la nefrona', color: '#c8372f' },
  ],

  parts: {
    glomerulus: {
      name: 'Glomérulo', en: 'Glomerulus', group: 'corpusculo', color: '#d64541',
      desc: 'Ovillo de capilares fenestrados entre dos arteriolas: la aferente y la eferente. Lo sostienen las células mesangiales.',
      func: 'Filtra ~20 % del plasma que llega (fracción de filtración). La presión capilar glomerular (~55 mmHg) es alta y casi constante a lo largo del capilar porque está entre dos resistencias arteriolares.',
      clinic: 'Síndrome nefrítico (hematuria, hipertensión, edema, por ejemplo la glomerulonefritis postestreptocócica) frente a nefrótico (proteinuria > 3,5 g/día, hipoalbuminemia, edema e hiperlipidemia; por ejemplo cambios mínimos o nefropatía membranosa).',
    },
    bowman: {
      name: 'Cápsula de Bowman', en: "Bowman's capsule", group: 'corpusculo', color: '#f3d9d4', opacity: 0.28,
      desc: 'Copa epitelial de doble hoja. La hoja visceral está formada por podocitos que abrazan los capilares; la parietal es un epitelio plano. Entre ambas queda el espacio urinario.',
      func: 'Recoge el ultrafiltrado (~180 L/día), que pasa al túbulo proximal por el polo urinario. La presión hidrostática del espacio de Bowman (~15 mmHg) se opone a la filtración.',
      clinic: 'En la glomerulonefritis rápidamente progresiva se forman semilunas (proliferación de la hoja parietal).',
    },
    aff: {
      name: 'Arteriola aferente', en: 'Afferent arteriole', group: 'vasos', color: '#d0352c',
      desc: 'Lleva la sangre al glomérulo. En su pared están las células yuxtaglomerulares (granulares), que secretan renina.',
      func: 'Es el efector de la autorregulación: se contrae si sube la presión (reflejo miogénico) o si la mácula densa detecta más NaCl (retroalimentación tubuloglomerular, mediada por adenosina). Las prostaglandinas la dilatan.',
      clinic: 'Los AINEs bloquean las prostaglandinas y contraen la aferente, lo que puede causar insuficiencia renal aguda en pacientes con volumen bajo.',
    },
    eff: {
      name: 'Arteriola eferente', en: 'Efferent arteriole', group: 'vasos', color: '#b8322b',
      desc: 'Sale del glomérulo y se ramifica en los capilares peritubulares (nefronas corticales) o en los vasos rectos (nefronas yuxtamedulares).',
      func: 'La angiotensina II la contrae, lo que mantiene la TFG cuando baja la perfusión. La sangre que sale tiene una presión oncótica alta, que favorece la reabsorción en los capilares peritubulares.',
    },
    pct: {
      name: 'Túbulo contorneado proximal', en: 'Proximal convoluted tubule', group: 'tubulo', color: '#e9b44c',
      desc: 'Epitelio cúbico con un gran borde en cepillo (microvellosidades) y muchas mitocondrias. Es el segmento más largo.',
      func: 'Reabsorbe ~65–70 % del Na⁺, Cl⁻, K⁺ y agua (de forma isoosmótica), el 100 % de la glucosa (SGLT2 y SGLT1) y de los aminoácidos, ~80 % del HCO₃⁻ y del fosfato. Secreta ácidos y bases orgánicos, incluidos muchos fármacos. Aquí se produce amoníaco.',
      clinic: 'La glucosuria aparece cuando la glucosa plasmática supera ~180–200 mg/dL (umbral renal). Los iSGLT2 (dapagliflozina) provocan glucosuria terapéutica. El síndrome de Fanconi es una disfunción proximal global.',
    },
    dtl: {
      name: 'Rama descendente del asa de Henle', en: 'Descending limb of loop of Henle', group: 'tubulo', color: '#f1d28a',
      desc: 'Porción recta del proximal seguida de la rama delgada descendente (epitelio plano), que baja hasta la médula interna.',
      func: 'Es muy permeable al agua (acuaporina-1) y poco a los solutos. El agua sale hacia el intersticio hiperosmolar y el líquido tubular se concentra hasta ~1200 mOsm/kg en la curva del asa.',
    },
    atl: {
      name: 'Rama delgada ascendente', en: 'Thin ascending limb', group: 'tubulo', color: '#f5dfa8',
      desc: 'Solo existe en las nefronas yuxtamedulares de asa larga, en la médula interna.',
      func: 'Es impermeable al agua y deja salir NaCl de forma pasiva. Empieza a diluir el líquido tubular.',
    },
    tal: {
      name: 'Rama ascendente gruesa (asa de Henle)', en: 'Thick ascending limb', group: 'tubulo', color: '#d9a03f',
      desc: 'Epitelio cúbico rico en mitocondrias. Asciende hasta la corteza y contacta con su propio glomérulo.',
      func: 'El cotransportador NKCC2 (Na⁺-K⁺-2Cl⁻) reabsorbe ~25 % del NaCl filtrado y el segmento es impermeable al agua. Por eso es el "segmento diluyente" (sale con ~100 mOsm/kg) y el motor del multiplicador por contracorriente. El reciclaje de K⁺ por ROMK genera un voltaje que impulsa la reabsorción paracelular de Ca²⁺ y Mg²⁺. Aquí se secreta la proteína de Tamm-Horsfall (uromodulina).',
      clinic: 'La furosemida bloquea el NKCC2: diuresis potente, hipopotasemia, alcalosis metabólica y calciuria (pérdida de Ca²⁺). El síndrome de Bartter tiene el mismo efecto por causa genética.',
    },
    md: {
      name: 'Mácula densa', en: 'Macula densa', group: 'tubulo', color: '#ffffff',
      desc: 'Placa de células altas y apretadas al final de la rama ascendente gruesa, en contacto con las arteriolas de su glomérulo. Con las células yuxtaglomerulares y el mesangio extraglomerular forma el aparato yuxtaglomerular.',
      func: 'Detecta el NaCl tubular (vía NKCC2). Si aumenta, libera adenosina, que contrae la aferente y baja la TFG (retroalimentación tubuloglomerular). Si disminuye, libera PGE₂ y NO, que estimulan la secreción de renina.',
    },
    dct: {
      name: 'Túbulo contorneado distal', en: 'Distal convoluted tubule', group: 'tubulo', color: '#c98a3a',
      desc: 'Segmento cortical corto, de epitelio cúbico sin borde en cepillo.',
      func: 'El cotransportador NCC (Na⁺-Cl⁻) reabsorbe ~5 % del NaCl y el segmento es impermeable al agua, así que la dilución continúa. Reabsorbe Ca²⁺ de forma regulada (PTH, TRPV5) y Mg²⁺ (TRPM6).',
      clinic: 'Tiazidas (bloquean el NCC): hipopotasemia, hiponatremia e hipercalcemia (reducen la calciuria, útiles en los cálculos de calcio). Síndrome de Gitelman: hipopotasemia con hipomagnesemia e hipocalciuria.',
    },
    cd: {
      name: 'Túbulo conector y colector', en: 'Connecting tubule / collecting duct', group: 'colector', color: '#7cc4e8',
      desc: 'Recoge el líquido de varias nefronas y desciende por la médula hasta los conductos papilares (de Bellini). Tiene células principales e intercaladas (α y β).',
      func: 'Células principales: reabsorben Na⁺ por ENaC (aldosterona), secretan K⁺ por ROMK y BK, y reabsorben agua por acuaporina-2 (ADH). Células intercaladas α: secretan H⁺ (H⁺-ATPasa, H⁺/K⁺-ATPasa). Células β: secretan HCO₃⁻. Pulsa ADH (con ▶ Flujo activo) para ver cómo cambia la orina.',
      clinic: 'Espironolactona y eplerenona (antagonistas de la aldosterona) y amilorida (bloquea ENaC) son diuréticos ahorradores de K⁺. El litio produce diabetes insípida nefrogénica. El SIADH causa hiponatremia por retención de agua.',
    },
    vasa: {
      name: 'Vasos rectos', en: 'Vasa recta', group: 'vasos', color: '#a33c5c',
      desc: 'Capilares largos en horquilla que nacen de las arteriolas eferentes de las nefronas yuxtamedulares y acompañan a las asas de Henle en la médula.',
      func: 'Funcionan como intercambiador por contracorriente: aportan O₂ a la médula sin disipar el gradiente osmótico, porque su flujo es bajo (~5–10 % del flujo renal). En la rama descendente ganan solutos y pierden agua; en la ascendente, al revés.',
      clinic: 'La médula vive con poco O₂ (PO₂ ~10–20 mmHg): la rama ascendente gruesa y la papila son muy vulnerables a la isquemia (necrosis tubular aguda, necrosis papilar).',
    },
    ptc: {
      name: 'Capilares peritubulares', en: 'Peritubular capillaries', group: 'vasos', color: '#c4504a',
      desc: 'Red capilar cortical que nace de la arteriola eferente y rodea los túbulos proximal y distal.',
      func: 'Recogen lo reabsorbido. Su presión hidrostática es baja (~20 mmHg) y la oncótica alta (~35 mmHg, porque el plasma ya se filtró), así que las fuerzas de Starling favorecen la reabsorción.',
    },
  },

  tours: [
    {
      name: 'Recorrido del filtrado',
      steps: [
        { title: '1. Arteriola aferente', parts: ['aff', 'glomerulus'], text: 'La sangre llega al glomérulo. Cerca está la mácula densa, que con las células yuxtaglomerulares forma el aparato yuxtaglomerular (renina).' },
        { title: '2. Filtración glomerular', parts: ['glomerulus', 'bowman'], text: 'Se filtran ~125 mL/min de plasma sin proteínas hacia el espacio de Bowman. Presión neta ≈ 55 − 15 − 30 = +10 mmHg.' },
        { title: '3. Túbulo proximal', parts: ['pct', 'ptc'], text: 'Reabsorbe ~2/3 del filtrado de forma isoosmótica (300 mOsm/kg), toda la glucosa y los aminoácidos, y la mayor parte del HCO₃⁻.' },
        { title: '4. Rama descendente', parts: ['dtl', 'vasa'], text: 'Sale agua hacia el intersticio hiperosmolar: el líquido llega a ~1200 mOsm/kg en la curva del asa.' },
        { title: '5. Ramas ascendentes', parts: ['atl', 'tal'], text: 'Son impermeables al agua. La rama gruesa bombea NaCl (NKCC2) y diluye el líquido a ~100 mOsm/kg. Así se construye el gradiente medular.' },
        { title: '6. Mácula densa', parts: ['md', 'aff', 'eff'], text: 'Detecta el NaCl que llega. Si aumenta, contrae la aferente (retroalimentación tubuloglomerular); si baja, estimula la renina.' },
        { title: '7. Túbulo distal', parts: ['dct'], text: 'El NCC reabsorbe ~5 % del NaCl (sitio de acción de las tiazidas) y aquí se regula el Ca²⁺ por PTH. El líquido sigue diluido.' },
        { title: '8. Colector y ADH', parts: ['cd'], text: 'Con ADH: entra acuaporina-2, el agua sale hacia la médula y la orina se concentra (hasta ~1200 mOsm/kg). Sin ADH: orina diluida (~50–100 mOsm/kg). Prueba el botón ADH con la animación activa.' },
      ],
    },
  ],

  physiology: [
    {
      title: 'Cómo leer la animación',
      open: true,
      html: `
<p>Pulsa <b>▶ Flujo</b>: las partículas son el líquido tubular y su color indica la osmolaridad.</p>
<p><span style="color:#7cc4e8">■</span> ~100 mOsm/kg (diluido) · <span style="color:#f4f1d0">■</span> 300 mOsm/kg (igual al plasma) · <span style="color:#e8743b">■</span> ~1200 mOsm/kg (concentrado)</p>
<p>La franja de fondo representa el intersticio: 300 mOsm/kg en la corteza y hasta 1200 en la papila. El botón <b>ADH</b> simula la presencia o ausencia de vasopresina.</p>
<p class="small muted">Es un esquema didáctico: las proporciones y longitudes no son reales (una nefrona mide ~3–5 cm de largo y unos 20–60 µm de diámetro).</p>`,
    },
    {
      title: 'Balance por segmento (% de la carga filtrada)',
      html: `
<table>
<tr><th>Segmento</th><th>Na⁺</th><th>Agua</th><th>Osm. del líquido</th></tr>
<tr><td>Túbulo proximal</td><td>65 %</td><td>65 %</td><td>300 (isoosmótico)</td></tr>
<tr><td>Rama descendente</td><td>—</td><td>15 %</td><td>↑ hasta 1200</td></tr>
<tr><td>Ramas ascendentes</td><td>25 %</td><td>0</td><td>↓ hasta ~100</td></tr>
<tr><td>Túbulo distal</td><td>5 %</td><td>0</td><td>~100</td></tr>
<tr><td>Colector</td><td>3–4 % (aldosterona)</td><td>variable (ADH)</td><td>50–1200</td></tr>
</table>
<p>Excreción final: &lt; 1 % del Na⁺ filtrado (FENa normal &lt; 1 %). En la insuficiencia renal aguda, FENa &lt; 1 % orienta a una causa prerrenal y &gt; 2 % a necrosis tubular aguda.</p>`,
    },
    {
      title: 'Equilibrio ácido-base renal',
      html: `
<ul>
<li><b>Túbulo proximal:</b> reabsorbe ~80 % del HCO₃⁻ filtrado (intercambiador NHE3 más anhidrasa carbónica) y genera NH₄⁺ a partir de glutamina, lo que crea HCO₃⁻ "nuevo".</li>
<li><b>Intercaladas α del colector:</b> secretan H⁺, que se excreta como acidez titulable (H₂PO₄⁻) y como NH₄⁺.</li>
<li>Acidosis tubular renal: tipo 1 (distal, falla la secreción de H⁺: pH urinario &gt; 5,5 y cálculos), tipo 2 (proximal, pierde HCO₃⁻) y tipo 4 (hipoaldosteronismo con hiperpotasemia).</li>
</ul>`,
    },
  ],
};

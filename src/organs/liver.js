// Hígado — Z-Anatomy (CC BY-SA 4.0): segmentos de Couinaud, vía biliar, páncreas y vasos
// en un mismo espacio, lo que permite mostrar la circulación portal completa.

const RED = '#c8372f';
const BLUE = '#3f66c9';
const PORTAL = '#7a5bd6';

const S = (n, roman, color, desc, extra = {}) => ({ name: `Segmento ${roman} (${n})`, en: `Liver segment ${roman}`, group: 'segmentos', color, desc, ...extra });

export default {
  id: 'liver',
  name: 'Hígado',
  subtitle: 'Sistema digestivo · Fisiología II',
  models: ['models/liver-organs.glb', 'models/liver-vessels.glb'],
  xray: { groups: ['segmentos'], label: 'Segmentos hepáticos' },
  frame: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 'gallbladder', 'pancreas'],
  labelParts: ['s2', 's3', 's4', 's5', 's6', 's7', 's8', 'gallbladder', 'portal', 'ivc_th'],

  groups: [
    { id: 'segmentos', name: 'Segmentos de Couinaud', color: '#9b4a3c' },
    { id: 'biliar', name: 'Vesícula y vía biliar', color: '#4d8a3a' },
    { id: 'portal', name: 'Sistema porta', color: PORTAL },
    { id: 'venas', name: 'Venas hepáticas y cava', color: BLUE },
    { id: 'arterias', name: 'Arterias', color: RED },
    { id: 'vecinos', name: 'Órganos vecinos', color: '#e1c07a' },
  ],

  groupInfo: {
    segmentos: {
      func: 'Cada segmento de Couinaud tiene su propio pedículo portal (rama de la vena porta, de la arteria hepática y conducto biliar) en el centro, y las venas hepáticas corren entre segmentos. Por eso cada uno puede resecarse por separado. La vena hepática media divide el hígado en derecho (V–VIII) e izquierdo (II–IV); la línea de Cantlie va de la vesícula a la VCI.',
      clinic: 'Las segmentectomías y hepatectomías (derecha o izquierda), el trasplante de donante vivo (lóbulo derecho o segmentos II–III) y la localización de tumores y metástasis se describen por segmentos.',
    },
    portal: { func: 'La vena porta aporta ~75 % del flujo hepático (~1 L/min) y ~50 % del O₂. Trae la sangre de estómago, intestino, bazo y páncreas: nutrientes, fármacos absorbidos (primer paso hepático), hormonas pancreáticas y productos de la degradación de la hemoglobina.' },
    arterias: { func: 'La arteria hepática aporta ~25 % del flujo y ~50 % del O₂. "Respuesta amortiguadora arterial": si baja el flujo portal, la arteria hepática se dilata (por acumulación de adenosina).' },
  },

  parts: {
    s1: S('lóbulo caudado', 'I', '#a35a4c', 'Lóbulo caudado, posterior, abrazando la vena cava inferior.', { func: 'Tiene irrigación portal doble (de las ramas derecha e izquierda) y drena por venas cortas directamente a la VCI.', clinic: 'En el síndrome de Budd-Chiari (trombosis de las venas hepáticas) el caudado se hipertrofia porque su drenaje directo a la cava se mantiene.' }),
    s2: S('lateral superior izquierdo', 'II', '#c06f5a', 'Segmento posterolateral del lóbulo izquierdo.', { clinic: 'Los segmentos II–III (sector lateral izquierdo) son el injerto habitual en el trasplante hepático pediátrico de donante vivo.' }),
    s3: S('lateral inferior izquierdo', 'III', '#d08568', 'Segmento anterolateral del lóbulo izquierdo, a la izquierda del ligamento falciforme.'),
    s4: S('medial izquierdo (cuadrado)', 'IV', '#b8644f', 'Segmento medial izquierdo: IVa superior y IVb inferior, que corresponde al lóbulo cuadrado. Está entre el ligamento falciforme y la línea de Cantlie.'),
    s5: S('anterior inferior derecho', 'V', '#9c4e40', 'Segmento anteroinferior derecho, junto al lecho vesicular.', { clinic: 'El cáncer de vesícula invade con frecuencia los segmentos IVb y V.' }),
    s6: S('posterior inferior derecho', 'VI', '#8a4236', 'Segmento posteroinferior derecho, en contacto con el riñón derecho y el ángulo hepático del colon.'),
    s7: S('posterior superior derecho', 'VII', '#7a392f', 'Segmento posterosuperior derecho, bajo el diafragma.'),
    s8: S('anterior superior derecho', 'VIII', '#a95747', 'Segmento anterosuperior derecho, bajo la cúpula diafragmática.', { clinic: 'Los abscesos amebianos son más frecuentes en el lóbulo derecho, sobre todo en los segmentos VII–VIII.' }),
    gallbladder: {
      name: 'Vesícula biliar', en: 'Gallbladder', group: 'biliar', color: '#4d8a3a',
      desc: 'Saco piriforme (fondo, cuerpo, infundíbulo y cuello) de 30–50 mL en la cara visceral del hígado. Drena por el conducto cístico.',
      func: 'Almacena la bilis y la concentra 5–10 veces (reabsorbe Na⁺, Cl⁻ y agua). La CCK, liberada por grasas y proteínas en el duodeno, la contrae y relaja el esfínter de Oddi.',
      clinic: 'Litiasis biliar ("4F": female, forty, fertile, fat). Colecistitis: signo de Murphy. El triángulo de Calot (conducto cístico, conducto hepático común y borde hepático) contiene la arteria cística y se diseca en la colecistectomía.',
    },
    bile_duct: {
      name: 'Colédoco (conducto biliar común)', en: 'Bile duct', group: 'biliar', color: '#6aa84f',
      desc: 'Une el conducto hepático común y el cístico. Desciende por el ligamento hepatoduodenal y por detrás de la cabeza del páncreas, y se une al conducto pancreático en la ampolla de Vater (papila mayor, 2.ª porción del duodeno).',
      clinic: 'La coledocolitiasis produce ictericia obstructiva. Colangitis: tríada de Charcot (fiebre, ictericia y dolor). El cáncer de cabeza de páncreas da ictericia indolora con vesícula palpable (signo de Courvoisier).',
    },
    pancreas: { name: 'Páncreas', en: 'Pancreas', group: 'vecinos', color: '#e1c07a', desc: 'Retroperitoneal. Su cabeza está en el marco duodenal y su cuello por delante de la confluencia esplenoportal.', func: 'La insulina y el glucagón pancreáticos llegan al hígado por la vena porta en alta concentración, por eso el hígado es su órgano diana principal.' },
    panc_duct: { name: 'Conducto pancreático (de Wirsung)', en: 'Pancreatic duct', group: 'vecinos', color: '#c9a453', desc: 'Recorre el páncreas y se une al colédoco en la ampolla de Vater.' },
    duodenum: { name: 'Duodeno', en: 'Duodenum', group: 'vecinos', color: '#d9a07a', desc: 'Recibe la bilis y el jugo pancreático en la papila mayor.' },
    stomach: { name: 'Estómago', en: 'Stomach', group: 'vecinos', color: '#dd9584', hidden: true, desc: 'Su curvatura menor está unida al hígado por el omento menor.' },
    portal: {
      name: 'Vena porta hepática', en: 'Hepatic portal vein', group: 'portal', color: PORTAL,
      desc: 'Se forma detrás del cuello del páncreas por la unión de la vena mesentérica superior y la esplénica. Asciende por el ligamento hepatoduodenal, por detrás del colédoco y de la arteria hepática, y se divide en ramas derecha e izquierda en el hilio.',
      func: 'Es un sistema porta (capilares → vena → capilares): lleva la sangre esplácnica a los sinusoides hepáticos antes de que llegue a la circulación general.',
      clinic: 'La hipertensión portal (gradiente > 5 mmHg; > 10 clínicamente significativo), sobre todo por cirrosis, produce várices esofagogástricas, esplenomegalia, ascitis, circulación colateral ("cabeza de medusa") y hemorroides.',
    },
    splenic_v: { name: 'Vena esplénica', en: 'Splenic vein', group: 'portal', color: PORTAL, desc: 'Corre por detrás del páncreas. Recibe la vena mesentérica inferior y las gástricas cortas.', clinic: 'Su trombosis (por pancreatitis) produce hipertensión portal "izquierda" (segmentaria) con várices gástricas aisladas.' },
    smv: { name: 'Vena mesentérica superior', en: 'Superior mesenteric vein', group: 'portal', color: PORTAL, desc: 'Drena el intestino delgado, el colon derecho y el transverso, y la cabeza del páncreas.', func: 'Tras una comida lleva la mayor parte de los nutrientes absorbidos (glucosa, aminoácidos) al hígado.' },
    hep_veins: {
      name: 'Venas hepáticas', en: 'Hepatic veins', group: 'venas', color: BLUE,
      desc: 'Tres venas (derecha, media e izquierda) que drenan los sinusoides hacia la VCI justo bajo el diafragma. Separan los sectores hepáticos.',
      clinic: 'Síndrome de Budd-Chiari: obstrucción del drenaje con hepatomegalia dolorosa y ascitis. En la insuficiencia cardíaca derecha, la congestión produce el "hígado en nuez moscada".',
    },
    ivc_th: { name: 'Vena cava inferior (porción torácica)', en: 'Inferior vena cava (thoracic)', group: 'venas', color: BLUE, desc: 'Atraviesa el diafragma (T8) y llega a la aurícula derecha. Recibe las venas hepáticas.' },
    ivc_abd: { name: 'Vena cava inferior (porción abdominal)', en: 'Inferior vena cava (abdominal)', group: 'venas', color: BLUE, desc: 'Retroperitoneal, a la derecha de la aorta. Su porción retrohepática está en un surco del área desnuda del hígado.' },
    celiac: { name: 'Tronco celíaco', en: 'Coeliac trunk', group: 'arterias', color: RED, desc: 'Sale de la aorta a la altura de T12 y se divide en gástrica izquierda, esplénica y hepática común.' },
    cha: { name: 'Arteria hepática común', en: 'Common hepatic artery', group: 'arterias', color: RED, desc: 'Se divide en la arteria hepática propia y la gastroduodenal.' },
    pha: { name: 'Arteria hepática propia', en: 'Proper hepatic artery', group: 'arterias', color: RED, desc: 'Asciende por el ligamento hepatoduodenal, a la izquierda del colédoco, y se divide en ramas derecha (que da la arteria cística) e izquierda.', func: 'Irriga sobre todo la vía biliar: los colangiocitos dependen casi solo de la sangre arterial.', clinic: 'La maniobra de Pringle pinza el ligamento hepatoduodenal (porta, arteria y colédoco) para controlar el sangrado hepático. Una trombosis de la arteria hepática tras un trasplante causa necrosis de la vía biliar.' },
    gda: { name: 'Arteria gastroduodenal', en: 'Gastroduodenal artery', group: 'arterias', color: RED, desc: 'Rama de la hepática común, por detrás del bulbo duodenal.' },
    splenic_a: { name: 'Arteria esplénica', en: 'Splenic artery', group: 'arterias', color: RED, desc: 'Rama tortuosa del tronco celíaco hacia el bazo, a lo largo del borde superior del páncreas.' },
    abd_ao: { name: 'Aorta abdominal', en: 'Abdominal aorta', group: 'arterias', color: RED, desc: 'Origen del tronco celíaco y de la arteria mesentérica superior.' },
  },

  tours: [
    {
      name: 'Circulación hepática',
      steps: [
        { title: '1. Afluentes del sistema porta', parts: ['smv', 'splenic_v', 'pancreas', 'duodenum'], text: 'La vena mesentérica superior (intestino) y la esplénica (bazo, estómago, páncreas) se unen detrás del cuello del páncreas.' },
        { title: '2. Vena porta', parts: ['portal'], text: 'Aporta ~75 % del flujo hepático: sangre rica en nutrientes, pobre en O₂, con insulina y glucagón. Presión normal ~5–10 mmHg.' },
        { title: '3. Arteria hepática', parts: ['celiac', 'cha', 'pha', 'abd_ao'], text: 'Aporta ~25 % del flujo, pero la mitad del O₂. Junto con la porta y el colédoco forma la tríada portal.' },
        { title: '4. Segmentos y sinusoides', parts: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'], text: 'En los sinusoides se mezclan la sangre portal y la arterial. Fluyen desde el espacio porta (zona 1, la más oxigenada) hacia la vena central (zona 3, la más sensible a la isquemia y al paracetamol).' },
        { title: '5. Venas hepáticas → cava', parts: ['hep_veins', 'ivc_th', 'ivc_abd'], text: 'La sangre ya procesada sale por las venas hepáticas a la VCI y a la aurícula derecha. El hígado recibe ~25 % del gasto cardíaco (~1,5 L/min).' },
        { title: '6. Bilis', parts: ['gallbladder', 'bile_duct', 'panc_duct', 'duodenum'], text: 'Se secretan ~600–1000 mL/día de bilis, que fluye en dirección contraria a la sangre (hacia el espacio porta), se almacena en la vesícula y se vierte al duodeno por acción de la CCK.' },
      ],
    },
  ],

  physiology: [
    {
      title: 'Lobulillo y acino hepático',
      open: true,
      html: `
<ul>
<li><b>Lobulillo clásico:</b> hexágono con una vena central y espacios porta en los vértices (vena porta, arteria hepática y conducto biliar).</li>
<li><b>Acino de Rappaport</b> (unidad funcional), con tres zonas: la <b>1</b> (periportal) es la más oxigenada y hace gluconeogénesis, β-oxidación y síntesis de urea; la <b>3</b> (pericentral) tiene poco O₂ y mucho CYP450, y hace glucólisis y lipogénesis.</li>
<li><b>Sinusoides</b> con endotelio fenestrado sin membrana basal, espacio de Disse, células de Kupffer (macrófagos) y células estrelladas de Ito (almacenan vitamina A; al activarse producen la fibrosis de la cirrosis).</li>
</ul>
<p class="clinic">La zona 3 se daña primero en la isquemia (hepatitis isquémica), la intoxicación por paracetamol (vía NAPQI) y el alcohol. La zona 1 se afecta en la eclampsia y por algunas toxinas.</p>`,
    },
    {
      title: 'Funciones metabólicas',
      html: `
<table>
<tr><th>Área</th><th>Funciones</th></tr>
<tr><td>Hidratos de carbono</td><td>Glucogenogénesis (con insulina), glucogenólisis y gluconeogénesis (con glucagón y cortisol). Mantiene la glucemia en ayunas.</td></tr>
<tr><td>Lípidos</td><td>β-oxidación, cetogénesis (el hígado produce cuerpos cetónicos, pero no los usa), síntesis de colesterol, VLDL y sales biliares.</td></tr>
<tr><td>Proteínas</td><td>Albúmina, factores de coagulación (II, VII, IX y X dependen de la vitamina K), proteínas de fase aguda. Ciclo de la urea: elimina el NH₃.</td></tr>
<tr><td>Almacenamiento</td><td>Glucógeno, vitaminas A, D y B₁₂, hierro (ferritina) y cobre.</td></tr>
<tr><td>Hormonas</td><td>Produce IGF-1, angiotensinógeno, trombopoyetina y hepcidina. Activa la vitamina D (25-hidroxilación). Inactiva la insulina, los estrógenos y la aldosterona.</td></tr>
</table>
<p class="clinic">En la insuficiencia hepática se ven hipoalbuminemia (edema y ascitis), INR prolongado (es el mejor marcador agudo de función), hipoglucemia, hiperamonemia (encefalopatía) y ginecomastia o arañas vasculares (por exceso de estrógenos).</p>`,
    },
    {
      title: 'Bilis y bilirrubina',
      html: `
<ul>
<li><b>Composición de la bilis:</b> sales biliares (emulsionan las grasas y forman micelas), fosfolípidos, colesterol, bilirrubina conjugada, HCO₃⁻ y agua.</li>
<li><b>Circulación enterohepática:</b> ~95 % de las sales biliares se reabsorben en el íleon terminal (transportador ASBT) y vuelven al hígado por la porta. El pool (~3 g) recircula 6–10 veces al día.</li>
<li><b>Bilirrubina:</b> hemo → biliverdina → bilirrubina no conjugada (viaja unida a la albúmina) → conjugación con UDP-glucuronosiltransferasa en el hepatocito → excreción por MRP2 a la bilis → urobilinógeno (intestino) → estercobilina (color de las heces) y urobilina (orina).</li>
</ul>
<p class="clinic">Hiperbilirrubinemia no conjugada: hemólisis, síndrome de Gilbert, Crigler-Najjar. Conjugada: obstrucción biliar (coluria y acolia), Dubin-Johnson, hepatitis.</p>`,
    },
    {
      title: 'Metabolismo de fármacos',
      html: `
<ul>
<li><b>Fase I</b> (CYP450: oxidación, reducción e hidrólisis). Inductores: rifampicina, carbamazepina, fenitoína, alcohol crónico, hierba de San Juan. Inhibidores: macrólidos, azoles, ritonavir, jugo de pomelo.</li>
<li><b>Fase II</b> (conjugación: glucuronidación, sulfatación, acetilación, glutatión) hace la molécula hidrosoluble para excretarla.</li>
<li><b>Primer paso hepático:</b> los fármacos orales pasan por la porta antes de llegar a la circulación sistémica. Por eso las dosis IV y orales pueden ser muy distintas (por ejemplo propranolol, morfina o nitroglicerina).</li>
</ul>`,
    },
  ],
};

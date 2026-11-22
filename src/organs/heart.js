// Corazón — datos anatómicos y fisiológicos.
// Modelo combinado:
//  - heart-hra.glb: cámaras, tabique, válvulas AV y músculos papilares del Human Reference Atlas
//    (NIH HuBMAP, Visible Human, CC BY 4.0), alineados por ICP al espacio de Z-Anatomy.
//  - heart-za.glb: válvulas sigmoideas, coronarias, venas cardíacas y grandes vasos de Z-Anatomy (CC BY-SA 4.0).
//  - Cuerdas tendinosas: generadas por código (effects/heartExtras.js).

const RED = '#c8372f';
const BLUE = '#3f66c9';

export default {
  id: 'heart',
  name: 'Corazón',
  subtitle: 'Sistema cardiovascular · Fisiología I',
  models: ['models/heart-hra.glb', 'models/heart-za.glb'],
  labelParts: ['ra', 'rv', 'la', 'lv', 'asc_ao', 'pt', 'svc', 'ivc', 'arch_ao'],
  xray: { groups: ['camaras'], label: 'Cámaras cardíacas' },
  animation: 'heartbeat',
  extra: { id: 'conduction', label: 'Conducción' },

  groups: [
    { id: 'camaras', name: 'Cámaras cardíacas', color: '#b4473e' },
    { id: 'valvulas', name: 'Válvulas', color: '#e9dcb5' },
    { id: 'papilares', name: 'Aparato subvalvular', color: '#8f3530' },
    { id: 'coronarias', name: 'Arterias coronarias', color: '#ff4a3d' },
    { id: 'venas_card', name: 'Venas cardíacas', color: '#5a7fe0' },
    { id: 'arterias', name: 'Grandes arterias', color: RED },
    { id: 'venas', name: 'Grandes venas', color: BLUE },
  ],

  groupInfo: {
    valvulas: {
      func: 'Las válvulas aseguran el flujo unidireccional de la sangre. Se abren y cierran pasivamente según el gradiente de presión a ambos lados. El cierre de las auriculoventriculares (AV) genera el primer ruido (S1) y el de las sigmoideas (semilunares) el segundo ruido (S2).',
    },
    papilares: {
      func: 'Se contraen junto con el ventrículo y tensan las cuerdas tendinosas. Así impiden que las valvas AV se everten (prolapsen) hacia la aurícula durante la sístole. No abren ni cierran la válvula.',
      clinic: 'La rotura de un músculo papilar (por ejemplo, tras un infarto inferior) produce una insuficiencia mitral aguda grave con edema pulmonar.',
    },
    coronarias: {
      func: 'Irrigan el propio miocardio. El corazón extrae ~70–75 % del O₂ arterial ya en reposo, por lo que cuando aumenta la demanda solo puede responder aumentando el flujo coronario (vasodilatación metabólica: adenosina, NO, ↓O₂, ↑CO₂).',
      clinic: 'El flujo del ventrículo izquierdo ocurre sobre todo en diástole, porque en sístole la contracción comprime los vasos intramurales. La taquicardia acorta la diástole y reduce la perfusión.',
    },
    venas_card: {
      func: 'Drenan la sangre desoxigenada del miocardio. La mayoría confluye en el seno coronario, que desemboca en la aurícula derecha. Las venas cardíacas mínimas (de Tebesio) drenan directamente a las cámaras.',
    },
  },

  parts: {
    // ---- Cámaras ----
    ra: {
      name: 'Aurícula derecha', en: 'Right atrium', group: 'camaras', color: '#c86a5c',
      desc: 'Recibe la sangre venosa sistémica por la vena cava superior, la vena cava inferior y el seno coronario. Contiene el nodo sinoauricular (en la unión con la VCS) y el nodo auriculoventricular (en el tabique interauricular, triángulo de Koch).',
      func: 'Funciona como reservorio y conducto durante la sístole ventricular. La contracción auricular ("patada auricular", onda P del ECG) aporta ~20–30 % del llenado ventricular final. Presión media normal: 2–6 mmHg (equivale a la presión venosa central).',
      clinic: 'En la fibrilación auricular se pierde la patada auricular. La onda "a" del pulso venoso yugular refleja la contracción de esta aurícula.',
    },
    rv: {
      name: 'Ventrículo derecho', en: 'Right ventricle', group: 'camaras', color: '#b24a40',
      desc: 'Es la cámara más anterior del corazón. Tiene una pared delgada (3–5 mm) con trabéculas carnosas, la banda moderadora y tres músculos papilares. Su salida es el infundíbulo (cono arterioso).',
      func: 'Impulsa la sangre a la circulación pulmonar, que es de baja resistencia. Presión normal: ~25/4 mmHg. Expulsa el mismo volumen sistólico que el VI, pero con mucho menos trabajo.',
      clinic: 'La hipertensión pulmonar crónica produce hipertrofia y dilatación del VD (cor pulmonale). La banda moderadora lleva la rama derecha del haz de His.',
    },
    la: {
      name: 'Aurícula izquierda', en: 'Left atrium', group: 'camaras', color: '#c86a5c',
      desc: 'Es la cámara más posterior. Recibe las cuatro venas pulmonares con sangre oxigenada. Su orejuela izquierda es tubular y trabeculada.',
      func: 'Recibe sangre oxigenada y la pasa al VI a través de la válvula mitral. Presión media: 8–10 mmHg (se estima con la presión de enclavamiento capilar pulmonar).',
      clinic: 'Está en contacto con el esófago, por eso la ecocardiografía transesofágica la visualiza muy bien. En la fibrilación auricular, la orejuela izquierda es el sitio principal de formación de trombos (riesgo de ACV).',
    },
    lv: {
      name: 'Ventrículo izquierdo', en: 'Left ventricle', group: 'camaras', color: '#a8433a',
      desc: 'Su pared es gruesa (8–12 mm) y forma el ápex del corazón. Tiene trabéculas finas y dos músculos papilares (anterolateral y posteromedial) unidos a la válvula mitral.',
      func: 'Bombea la sangre a la circulación sistémica, que es de alta resistencia. Presión ~120/10 mmHg. Valores típicos: VTD ~120 mL, VTS ~50 mL, volumen sistólico ~70 mL, fracción de eyección ~55–70 %.',
      clinic: 'La hipertensión arterial produce hipertrofia concéntrica. Una FE < 40 % define la insuficiencia cardíaca con fracción de eyección reducida.',
    },

    // ---- Válvulas ----
    tv: {
      name: 'Válvula tricúspide', en: 'Tricuspid valve', group: 'valvulas',
      desc: 'Válvula auriculoventricular derecha con tres valvas (anterior, posterior y septal), anillo fibroso, cuerdas tendinosas y tres músculos papilares. Su orificio (~7–9 cm²) es el más grande de las cuatro válvulas.',
      func: 'Se abre en diástole, cuando la presión de la AD supera la del VD, y se cierra al comenzar la sístole ventricular (componente T1 del primer ruido). Se ausculta en el foco tricuspídeo (4.º–5.º espacio intercostal, borde esternal izquierdo).',
      clinic: 'La insuficiencia tricuspídea produce ondas "v" gigantes en el pulso yugular, hepatomegalia pulsátil y un soplo que aumenta con la inspiración (signo de Rivero-Carvallo). La endocarditis tricuspídea es típica en usuarios de drogas intravenosas.',
    },
    mv: {
      name: 'Válvula mitral', en: 'Mitral valve', group: 'valvulas',
      desc: 'Válvula auriculoventricular izquierda (bicúspide), con una valva anterior (aórtica) y otra posterior (mural), en continuidad fibrosa con la válvula aórtica. Su orificio normal mide ~4–6 cm².',
      func: 'Se abre en diástole (llenado del VI) y se cierra al inicio de la sístole: es el componente M1, el principal del primer ruido. Se ausculta en el ápex (5.º espacio intercostal, línea medioclavicular).',
      clinic: 'Estenosis mitral (casi siempre reumática): chasquido de apertura, soplo diastólico en retumbo, dilatación de la AI y fibrilación auricular. Insuficiencia mitral: soplo holosistólico irradiado a la axila. Prolapso: clic mesosistólico.',
    },
    ao_l: {
      name: 'Válvula aórtica — valva coronaria izquierda', en: 'Left coronary leaflet', group: 'valvulas',
      desc: 'Valva semilunar de la válvula aórtica. Por encima de ella, en el seno aórtico izquierdo (de Valsalva), nace la arteria coronaria izquierda.',
    },
    ao_r: {
      name: 'Válvula aórtica — valva coronaria derecha', en: 'Right coronary leaflet', group: 'valvulas',
      desc: 'Valva semilunar de la válvula aórtica. En su seno aórtico nace la arteria coronaria derecha.',
    },
    ao_n: {
      name: 'Válvula aórtica — valva no coronaria', en: 'Non-coronary leaflet', group: 'valvulas',
      desc: 'Valva semilunar posterior de la válvula aórtica. De su seno no nace ninguna coronaria.',
      func: 'La válvula aórtica se abre cuando la presión del VI supera la diastólica aórtica (~80 mmHg) y se cierra al final de la eyección (A2 del segundo ruido y escotadura dicrótica del pulso aórtico).',
      clinic: 'La estenosis aórtica (calcificación senil o válvula bicúspide) da la tríada de angina, síncope y disnea, con soplo sistólico eyectivo irradiado a las carótidas.',
    },
    pv_a: {
      name: 'Válvula pulmonar — valva anterior', en: 'Anterior semilunar leaflet', group: 'valvulas',
      desc: 'Valva semilunar de la válvula pulmonar, en la salida del VD hacia el tronco pulmonar.',
    },
    pv_l: {
      name: 'Válvula pulmonar — valva izquierda', en: 'Left semilunar leaflet', group: 'valvulas',
      desc: 'Valva semilunar de la válvula pulmonar.',
    },
    pv_r: {
      name: 'Válvula pulmonar — valva derecha', en: 'Right semilunar leaflet', group: 'valvulas',
      desc: 'Valva semilunar de la válvula pulmonar.',
      func: 'Su cierre genera P2. En la inspiración aumenta el retorno al VD y P2 se retrasa, lo que produce el desdoblamiento fisiológico de S2.',
    },

    // ---- Papilares ----
    pm_rv_ant: { name: 'Músculo papilar anterior (VD)', en: 'Anterior papillary muscle (RV)', group: 'papilares', desc: 'Es el papilar más grande del VD. Recibe la banda moderadora (trabécula septomarginal), que lleva la rama derecha del haz de His, y fija sus cuerdas a las valvas anterior y posterior de la tricúspide.' },
    pm_rv_post: { name: 'Músculo papilar posterior (VD)', en: 'Posterior papillary muscle (RV)', group: 'papilares', desc: 'Papilar inferior (posterior) del VD. Sus cuerdas van a las valvas posterior y septal de la tricúspide.' },
    pm_rv_sep: { name: 'Músculo papilar septal (VD)', en: 'Septal papillary muscle (RV)', group: 'papilares', desc: 'Papilar pequeño que nace del tabique interventricular (a veces es solo un grupo de cuerdas). Lo acompaña el músculo papilar del cono (de Lancisi).' },
    pm_lv_al: {
      name: 'Músculo papilar anterolateral (VI)', en: 'Anterolateral papillary muscle (LV)', group: 'papilares',
      desc: 'Es el papilar más grande del VI. Sus cuerdas van a ambas valvas mitrales (mitad anterolateral de cada una).',
      clinic: 'Tiene irrigación doble (descendente anterior y circunfleja), por eso rara vez se rompe en un infarto.',
    },
    pm_lv_pm: {
      name: 'Músculo papilar posteromedial (VI)', en: 'Posteromedial papillary muscle (LV)', group: 'papilares',
      desc: 'Envía cuerdas a la mitad posteromedial de ambas valvas mitrales.',
      clinic: 'Suele tener irrigación única (descendente posterior, de la coronaria derecha en la dominancia derecha). Por eso es el que se rompe en el infarto inferior y produce una insuficiencia mitral aguda con edema pulmonar.',
    },
    chordae: {
      name: 'Cuerdas tendinosas', en: 'Chordae tendineae', group: 'papilares', color: '#efe6cf', quiz: false,
      desc: 'Cordones fibrosos de colágeno que unen los músculos papilares con el borde libre y la cara ventricular de las valvas AV. Hay cuerdas de primer, segundo y tercer orden. En este modelo son un trazado esquemático generado por código.',
      func: 'Actúan como "tensores": durante la sístole, la contracción papilar las mantiene tensas y las valvas coaptan sin prolapsar hacia la aurícula.',
      clinic: 'Su rotura (degeneración mixomatosa, endocarditis o infarto) produce una valva "flotante" (flail) con insuficiencia mitral aguda grave.',
    },
    ivs: {
      name: 'Tabique interventricular', en: 'Interventricular septum', group: 'camaras', color: '#9b3c34',
      desc: 'Pared que separa ambos ventrículos. Tiene una porción muscular (grande) y una membranosa (pequeña, superior, cerca de la válvula aórtica). Por su interior discurre el haz de His y se divide en sus ramas.',
      func: 'Funcionalmente pertenece al VI: se contrae con él y se engrosa en sístole. Sus 2/3 anteriores los irriga la descendente anterior (ramas septales) y el 1/3 posterior la descendente posterior.',
      clinic: 'La comunicación interventricular (CIV) es la cardiopatía congénita más frecuente y casi siempre afecta la porción membranosa: soplo holosistólico paraesternal izquierdo. Una rotura septal tras un infarto es una complicación mecánica grave.',
    },

    // ---- Coronarias ----
    lca: {
      name: 'Arteria coronaria izquierda (tronco)', en: 'Left coronary artery', group: 'coronarias',
      desc: 'Nace del seno aórtico izquierdo y pasa entre el tronco pulmonar y la orejuela izquierda. Tras 1–2 cm se divide en la descendente anterior y la circunfleja.',
      clinic: 'Una lesión del tronco común izquierdo pone en riesgo gran parte del VI ("widow maker" junto con la DA proximal).',
    },
    lad: {
      name: 'Arteria descendente anterior (interventricular anterior)', en: 'Anterior interventricular artery (LAD)', group: 'coronarias',
      desc: 'Recorre el surco interventricular anterior hacia el ápex. Da ramas diagonales (a la pared anterolateral) y ramas septales.',
      func: 'Irriga la cara anterior del VI, el ápex y los 2/3 anteriores del tabique interventricular.',
      clinic: 'Es la arteria que se ocluye con más frecuencia. Su oclusión da un infarto anterior, con elevación del ST en V1–V4.',
    },
    lad_sep: { name: 'Ramas septales de la descendente anterior', en: 'Septal branches of LAD', group: 'coronarias', desc: 'Penetran en el tabique interventricular e irrigan sus 2/3 anteriores, incluidas las ramas del haz de His.' },
    cx: {
      name: 'Arteria circunfleja', en: 'Circumflex artery', group: 'coronarias',
      desc: 'Recorre el surco coronario (auriculoventricular) izquierdo hacia la cara posterior. Da las ramas marginales obtusas.',
      func: 'Irriga la pared lateral y posterior del VI y la AI. En el ~10 % de las personas (dominancia izquierda) da la descendente posterior.',
      clinic: 'Su oclusión produce un infarto lateral (DI, aVL, V5–V6).',
    },
    rca: {
      name: 'Arteria coronaria derecha', en: 'Right coronary artery', group: 'coronarias',
      desc: 'Nace del seno aórtico derecho y recorre el surco coronario derecho. Da la rama del nodo SA (~60 %), la marginal aguda y, en el ~70–80 % de las personas (dominancia derecha), la descendente posterior.',
      func: 'Irriga la AD, el VD, la cara inferior del VI, el tercio posterior del tabique, el nodo SA (60 %) y el nodo AV (80 %).',
      clinic: 'Su oclusión produce un infarto inferior (DII, DIII, aVF), a menudo con bradicardia o bloqueo AV por isquemia nodal.',
    },
    rca_il: { name: 'Rama inferolateral de la coronaria derecha', en: 'Right inferolateral branch of RCA', group: 'coronarias', desc: 'Rama terminal posterior de la coronaria derecha que irriga la cara inferolateral del VI (rama posterolateral).' },

    // ---- Venas cardíacas ----
    cs: {
      name: 'Seno coronario', en: 'Coronary sinus', group: 'venas_card',
      desc: 'Colector venoso que recorre el surco coronario posterior y desemboca en la AD, entre el orificio de la VCI y la tricúspide.',
      clinic: 'Se canaliza para colocar el electrodo del VI en la terapia de resincronización cardíaca. Una vena cava superior izquierda persistente drena en él y lo dilata.',
    },
    gcv: { name: 'Vena cardíaca magna', en: 'Great cardiac vein', group: 'venas_card', desc: 'Acompaña a la descendente anterior y luego a la circunfleja. Al llegar a la cara posterior continúa como seno coronario.' },
    mcv: { name: 'Vena cardíaca media', en: 'Middle cardiac vein', group: 'venas_card', desc: 'Recorre el surco interventricular posterior junto a la descendente posterior y drena en el seno coronario.' },
    ilv: { name: 'Vena posterior del ventrículo izquierdo', en: 'Inferior vein of left ventricle', group: 'venas_card', desc: 'Drena la cara inferior (diafragmática) del VI hacia el seno coronario.' },

    // ---- Grandes arterias ----
    asc_ao: {
      name: 'Aorta ascendente', en: 'Ascending aorta', group: 'arterias', color: RED,
      desc: 'Nace del VI, en la raíz aórtica con los senos de Valsalva, de los que salen las coronarias.',
      func: 'Su elasticidad (efecto Windkessel) almacena parte del volumen sistólico y lo devuelve en diástole. Así mantiene un flujo continuo y la presión diastólica.',
      clinic: 'Es el sitio típico de la disección aórtica tipo A de Stanford (dolor torácico desgarrante, una emergencia quirúrgica).',
    },
    arch_ao: { name: 'Arco aórtico', en: 'Aortic arch', group: 'arterias', color: RED, desc: 'Da origen al tronco braquiocefálico, la carótida común izquierda y la subclavia izquierda. Tiene barorreceptores (vía nervio vago) y quimiorreceptores (cuerpos aórticos).', func: 'Sus barorreceptores participan en el reflejo barorreceptor, que regula la presión arterial latido a latido.' },
    bct: { name: 'Tronco braquiocefálico', en: 'Brachiocephalic trunk', group: 'arterias', color: RED, desc: 'Primera rama del arco aórtico. Se divide en la subclavia derecha y la carótida común derecha.' },
    pt: {
      name: 'Tronco pulmonar', en: 'Pulmonary trunk', group: 'arterias', color: BLUE,
      desc: 'Sale del VD (infundíbulo) y lleva sangre desoxigenada hacia los pulmones. Por eso se representa en azul aunque sea una arteria.',
      func: 'Presión normal ~25/10 mmHg, con una media < 20 mmHg. Una presión media ≥ 20 mmHg (antes ≥ 25) define la hipertensión pulmonar.',
    },
    pt_bif: { name: 'Bifurcación del tronco pulmonar', en: 'Bifurcation of pulmonary trunk', group: 'arterias', color: BLUE, desc: 'Lugar donde el tronco pulmonar se divide en las arterias pulmonares derecha e izquierda, bajo el arco aórtico. Aquí se une el ligamento arterioso (resto del conducto arterioso fetal).' },
    lpa: { name: 'Arteria pulmonar izquierda', en: 'Left pulmonary artery', group: 'arterias', color: BLUE, desc: 'Lleva sangre desoxigenada al pulmón izquierdo. El modelo incluye sus ramas lobares y segmentarias.' },
    rpa: { name: 'Arteria pulmonar derecha', en: 'Right pulmonary artery', group: 'arterias', color: BLUE, desc: 'Pasa por detrás de la aorta ascendente y de la VCS hacia el pulmón derecho.' },

    // ---- Grandes venas ----
    svc: { name: 'Vena cava superior', en: 'Superior vena cava', group: 'venas', color: BLUE, desc: 'Drena la cabeza, el cuello, los miembros superiores y el tórax (vía la ácigos) hacia la AD.', clinic: 'El síndrome de vena cava superior (por ejemplo, por un tumor pulmonar) produce edema facial y circulación colateral en el tórax.' },
    ivc: { name: 'Vena cava inferior (porción torácica)', en: 'Inferior vena cava', group: 'venas', color: BLUE, desc: 'Drena el abdomen, la pelvis y los miembros inferiores hacia la AD. Recibe las venas hepáticas justo bajo el diafragma.' },
    rspv: { name: 'Vena pulmonar superior derecha', en: 'Right superior pulmonary vein', group: 'venas', color: RED, desc: 'Lleva sangre oxigenada desde los lóbulos superior y medio del pulmón derecho a la AI. Es una vena, pero lleva sangre arterial (por eso va en rojo).' },
    ripv: { name: 'Vena pulmonar inferior derecha', en: 'Right inferior pulmonary vein', group: 'venas', color: RED, desc: 'Lleva sangre oxigenada desde el lóbulo inferior derecho a la AI.' },
    lspv: { name: 'Vena pulmonar superior izquierda', en: 'Left superior pulmonary vein', group: 'venas', color: RED, desc: 'Lleva sangre oxigenada desde el lóbulo superior izquierdo y la língula a la AI.', clinic: 'Los focos ectópicos en los ostium de las venas pulmonares desencadenan la fibrilación auricular. La ablación busca aislarlos eléctricamente.' },
    lipv: { name: 'Vena pulmonar inferior izquierda', en: 'Left inferior pulmonary vein', group: 'venas', color: RED, desc: 'Lleva sangre oxigenada desde el lóbulo inferior izquierdo a la AI.' },
  },

  tours: [
    {
      name: 'Recorrido de la sangre',
      steps: [
        { title: '1. Retorno venoso', parts: ['svc', 'ivc', 'ra'], text: 'La sangre desoxigenada del cuerpo llega a la aurícula derecha por las venas cavas superior e inferior. El seno coronario aporta la sangre del propio corazón.' },
        { title: '2. Válvula tricúspide', parts: ['tv', 'chordae', 'pm_rv_ant', 'pm_rv_post', 'pm_rv_sep'], text: 'En diástole la tricúspide está abierta y la sangre pasa de la AD al VD. Primero pasa por gradiente (~70 %) y luego por la contracción auricular (~20–30 %).' },
        { title: '3. Ventrículo derecho', parts: ['rv'], text: 'El VD se contrae (sístole) y la tricúspide se cierra, generando S1. Los músculos papilares tensan las cuerdas tendinosas para que las valvas no prolapsen.' },
        { title: '4. Válvula pulmonar', parts: ['pv_a', 'pv_l', 'pv_r'], text: 'Cuando la presión del VD supera la de la arteria pulmonar (~10 mmHg), la válvula pulmonar se abre y comienza la eyección.' },
        { title: '5. Circulación pulmonar', parts: ['pt', 'pt_bif', 'lpa', 'rpa'], text: 'El tronco pulmonar y sus ramas llevan la sangre a los capilares alveolares. Allí capta O₂ y elimina CO₂ (hematosis). Es un circuito de baja presión (~25/10 mmHg).' },
        { title: '6. Venas pulmonares', parts: ['rspv', 'ripv', 'lspv', 'lipv'], text: 'La sangre ya oxigenada vuelve por las cuatro venas pulmonares a la aurícula izquierda.' },
        { title: '7. Aurícula izquierda', parts: ['la'], text: 'La AI recibe la sangre oxigenada. Su presión (~8–10 mmHg) se estima clínicamente con la presión de enclavamiento capilar pulmonar.' },
        { title: '8. Válvula mitral', parts: ['mv', 'chordae', 'pm_lv_al', 'pm_lv_pm'], text: 'La sangre pasa al VI a través de la mitral, abierta durante la diástole. En sístole se cierra (componente M1 del primer ruido).' },
        { title: '9. Ventrículo izquierdo', parts: ['lv', 'ivs'], text: 'El VI genera ~120 mmHg y expulsa ~70 mL por latido (FE ~60 %). Gasto cardíaco = FC × VS ≈ 5 L/min en reposo.' },
        { title: '10. Válvula aórtica', parts: ['ao_l', 'ao_r', 'ao_n'], text: 'Se abre cuando la presión del VI supera ~80 mmHg (diastólica aórtica). Su cierre al final de la sístole genera A2 del segundo ruido.' },
        { title: '11. Aorta y circulación sistémica', parts: ['asc_ao', 'arch_ao', 'bct'], text: 'La aorta distribuye la sangre oxigenada a todo el cuerpo. Su pared elástica amortigua el pulso (efecto Windkessel).' },
        { title: '12. Circulación coronaria', parts: ['lca', 'lad', 'lad_sep', 'cx', 'rca', 'rca_il', 'cs', 'gcv', 'mcv', 'ilv'], text: 'Las coronarias nacen de los senos aórticos e irrigan el miocardio, sobre todo en diástole. La sangre venosa vuelve por el seno coronario a la AD y el ciclo se cierra.' },
      ],
    },
  ],

  physiology: [
    {
      title: 'Ciclo cardíaco',
      open: true,
      html: `
<p>Con una FC de 75 lpm, cada ciclo dura ~0,8 s: unos 0,3 s de sístole y 0,5 s de diástole. Al subir la FC se acorta sobre todo la diástole. Pulsa <b>▶ Latido</b> para verlo sincronizado con el ECG.</p>
<table>
<tr><th>Fase</th><th>Válvulas</th><th>Qué ocurre</th></tr>
<tr><td>Sístole auricular</td><td>AV abiertas · sigmoideas cerradas</td><td>Onda P → la contracción auricular completa el llenado (onda <i>a</i>; S4 si el ventrículo es rígido).</td></tr>
<tr><td>Contracción isovolumétrica</td><td>Todas cerradas</td><td>QRS. La presión ventricular sube con rapidez sin cambio de volumen. El cierre AV produce S1.</td></tr>
<tr><td>Eyección</td><td>Sigmoideas abiertas · AV cerradas</td><td>Sale el volumen sistólico (~70 mL). La onda T coincide con el final de la eyección.</td></tr>
<tr><td>Relajación isovolumétrica</td><td>Todas cerradas</td><td>Cierre aórtico/pulmonar → S2 y escotadura dicrótica.</td></tr>
<tr><td>Llenado ventricular</td><td>AV abiertas</td><td>Llenado rápido (S3 si hay sobrecarga de volumen), diástasis y luego una nueva sístole auricular.</td></tr>
</table>
<p><b>Presiones normales (mmHg):</b> AD 2–6 · VD 25/4 · AP 25/10 · AI 8–10 · VI 120/10 · Aorta 120/80.</p>`,
    },
    {
      title: 'Sistema de conducción',
      html: `
<ul>
<li><b>Nodo sinoauricular (SA):</b> es el marcapaso normal (60–100 lpm). Está en la unión de la VCS con la AD.</li>
<li><b>Nodo auriculoventricular (AV):</b> retrasa el impulso ~0,1 s para que las aurículas terminen de vaciarse antes de que se contraigan los ventrículos. Es el segmento PR del ECG (normal 0,12–0,20 s). Su ritmo intrínseco es de 40–60 lpm.</li>
<li><b>Haz de His → ramas derecha e izquierda → fibras de Purkinje:</b> conducen muy rápido (2–4 m/s) para que los ventrículos se contraigan de forma sincrónica (QRS &lt; 0,12 s). El ritmo de escape de Purkinje es de 20–40 lpm.</li>
</ul>
<p>Con <b>Conducción</b> ves el impulso viajando por el modelo. El trayecto es esquemático: las fibras de conducción no son mallas en Z-Anatomy.</p>`,
    },
    {
      title: 'Potenciales de acción',
      html: `
<p><b>Miocito ventricular (respuesta rápida):</b></p>
<ul>
<li>Fase 0: despolarización por entrada de Na⁺ (canales rápidos).</li>
<li>Fase 1: repolarización precoz (salida de K⁺, I<sub>to</sub>).</li>
<li>Fase 2: meseta. La entrada de Ca²⁺ por canales tipo L equilibra la salida de K⁺, y el Ca²⁺ dispara la liberación desde el retículo sarcoplásmico (acoplamiento excitación-contracción).</li>
<li>Fase 3: repolarización (K⁺, I<sub>Kr</sub>/I<sub>Ks</sub>).</li>
<li>Fase 4: potencial de reposo (~−90 mV, I<sub>K1</sub>).</li>
</ul>
<p>Gracias a la meseta, el período refractario es largo y el corazón no puede entrar en tetania.</p>
<p><b>Célula marcapaso (nodo SA/AV):</b> la fase 4 es inestable por la corriente <i>funny</i> (I<sub>f</sub>, Na⁺) y el Ca²⁺ tipo T. La fase 0 se debe al Ca²⁺ tipo L, por eso es lenta. El simpático (β₁) aumenta la pendiente de la fase 4 y sube la FC. El vago (M₂, ACh) la disminuye e hiperpolariza.</p>`,
    },
    {
      title: 'Gasto cardíaco y su regulación',
      html: `
<p><b>GC = FC × VS</b> ≈ 5 L/min en reposo. Índice cardíaco ≈ 2,5–4 L/min/m².</p>
<ul>
<li><b>Precarga:</b> es el estiramiento de la fibra al final de la diástole (VTD). Según la <i>ley de Frank-Starling</i>, a mayor llenado, mayor fuerza de contracción.</li>
<li><b>Poscarga:</b> es la resistencia contra la que eyecta el ventrículo (presión aórtica, estenosis aórtica). Al aumentar, baja el VS.</li>
<li><b>Contractilidad (inotropismo):</b> aumenta con el simpático (β₁ → AMPc → más Ca²⁺), la digoxina o las catecolaminas.</li>
<li><b>FC (cronotropismo):</b> simpático ↑, parasimpático ↓.</li>
</ul>
<p>Presión arterial media ≈ GC × RVP. El <b>reflejo barorreceptor</b> (seno carotídeo, nervio IX; arco aórtico, nervio X) ajusta la FC y la RVP latido a latido.</p>`,
    },
    {
      title: 'Ruidos cardíacos',
      html: `
<ul>
<li><b>S1:</b> cierre de las válvulas mitral y tricúspide (inicio de la sístole). Se oye mejor en el ápex.</li>
<li><b>S2:</b> cierre de las válvulas aórtica (A2) y pulmonar (P2). El desdoblamiento fisiológico aparece en inspiración.</li>
<li><b>S3:</b> llenado rápido en un ventrículo con sobrecarga de volumen. Es normal en niños y embarazadas; en adultos sugiere insuficiencia cardíaca.</li>
<li><b>S4:</b> contracción auricular contra un ventrículo rígido (hipertrofia). No existe en la fibrilación auricular.</li>
</ul>`,
    },
  ],
};

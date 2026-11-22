// Contenido adicional por órgano: cortes clínicos predefinidos, puntos de interés y preguntas clínicas.
// Coordenadas del modelo: +X = izquierda del paciente, +Y = craneal, +Z = anterior.
// Corte: se conserva el lado n·x ≤ n·p y la cámara mira desde el lado retirado (ver features/geometry.js).

const Q = (q, options, answer, explain, parts = []) => ({ q, options, answer, explain, parts });

export const EXTRAS = {
  // =================================================================== CORAZÓN
  heart: {
    cutPresets: [
      { name: 'Apical 4 cámaras (eco)', through: [{ apex: 'lv' }, 'mv', 'tv'], toward: [0, 0, 1] },
      { name: 'Eje largo paraesternal (eco)', through: [{ apex: 'lv' }, 'mv', { mid: ['ao_l', 'ao_n'] }], toward: [-1, 0, 0.4] },
      { name: 'Eje corto: músculos papilares', axis: [{ apex: 'lv' }, 'mv'], at: { mid: ['pm_lv_al', 'pm_lv_pm'] } },
      { name: 'Eje corto: válvula aórtica', axis: [{ apex: 'lv' }, 'mv'], at: { mid: ['ao_l', 'ao_n'] } },
      { name: 'Coronal (frontal)', normal: [0, 0, 1], at: 'center' },
    ],
    pois: [
      { id: 'f_ao', name: 'Foco aórtico', at: { key: 'asc_ao', dir: [-0.6, 0.2, 1] }, desc: '2.º espacio intercostal, borde esternal derecho. Proyección auscultatoria de la válvula aórtica.', clinic: 'Estenosis aórtica: soplo sistólico eyectivo (en diamante) irradiado a las carótidas, con S2 disminuido.' },
      { id: 'f_pu', name: 'Foco pulmonar', at: { key: 'pt', dir: [0.4, 0.3, 1] }, desc: '2.º espacio intercostal, borde esternal izquierdo.', clinic: 'Aquí se escucha mejor el desdoblamiento de S2. Un P2 aumentado sugiere hipertensión pulmonar.' },
      { id: 'f_erb', name: 'Foco de Erb (accesorio aórtico)', at: { key: 'rv', dir: [0.3, 0.6, 1] }, desc: '3.er espacio intercostal, borde esternal izquierdo.', clinic: 'La insuficiencia aórtica (soplo diastólico aspirativo) se escucha mejor aquí, con el paciente inclinado hacia adelante en espiración.' },
      { id: 'f_tri', name: 'Foco tricuspídeo', at: { key: 'rv', dir: [-0.3, -0.7, 1] }, desc: '4.º–5.º espacio intercostal, borde esternal izquierdo bajo.', clinic: 'Signo de Rivero-Carvallo: los soplos tricuspídeos aumentan con la inspiración (mayor retorno venoso al corazón derecho).' },
      { id: 'f_mit', name: 'Foco mitral (ápex / choque de punta)', at: { apex: 'lv' }, desc: '5.º espacio intercostal, línea medioclavicular izquierda. Corresponde al ápex del VI.', clinic: 'Insuficiencia mitral: soplo holosistólico irradiado a la axila. S3 y S4 se escuchan con la campana y el paciente en decúbito lateral izquierdo. Un choque de punta desplazado sugiere cardiomegalia.' },
      { id: 'crux', name: 'Cruz del corazón (crux cordis)', at: { key: 'cs', dir: [0, -0.4, -1] }, desc: 'Unión de los surcos auriculoventricular e interventricular posteriores.', func: 'La arteria que llega a la cruz y da la descendente posterior define la dominancia coronaria: derecha en ~70–80 %, izquierda en ~10 % y codominancia en el resto.' },
      { id: 'koch', name: 'Región del nodo AV (triángulo de Koch)', at: { between: ['tv', 'ivs'] }, desc: 'Triángulo en la AD delimitado por el tendón de Todaro, la valva septal de la tricúspide y el orificio del seno coronario. Su vértice aloja el nodo AV.', clinic: 'Zona de riesgo de bloqueo AV en la cirugía valvular tricuspídea y en la ablación de taquicardias por reentrada nodal.' },
    ],
    clinicalQs: [
      Q('Paciente con dolor torácico, elevación del ST en DII, DIII y aVF y bradicardia sinusal. ¿Qué arteria está más probablemente ocluida?', ['Descendente anterior', 'Coronaria derecha', 'Circunfleja', 'Tronco común izquierdo'], 1, 'El infarto inferior suele deberse a la coronaria derecha, que en la mayoría de las personas también irriga los nodos SA y AV: de ahí la bradicardia o el bloqueo.', ['rca', 'rca_il']),
      Q('Soplo sistólico eyectivo en el 2.º espacio intercostal derecho, irradiado a las carótidas, en un adulto mayor con síncope de esfuerzo. ¿Diagnóstico más probable?', ['Estenosis aórtica', 'Insuficiencia mitral', 'Estenosis mitral', 'Comunicación interventricular'], 0, 'La tríada angina, síncope y disnea con soplo eyectivo irradiado a las carótidas es típica de la estenosis aórtica calcificada.', ['ao_l', 'ao_n', 'ao_r']),
      Q('¿Dónde ocurre el retraso fisiológico de ~0,1 s que permite completar el llenado ventricular?', ['Nodo sinoauricular', 'Nodo auriculoventricular', 'Haz de His', 'Fibras de Purkinje'], 1, 'El nodo AV conduce lento (canales de Ca²⁺ tipo L). Se refleja en el intervalo PR (0,12–0,20 s).', ['ra', 'tv']),
      Q('Durante la contracción isovolumétrica del ventrículo:', ['Las AV están abiertas y las sigmoideas cerradas', 'Todas las válvulas están cerradas', 'Las sigmoideas están abiertas', 'Todas las válvulas están abiertas'], 1, 'La presión ventricular sube sin cambio de volumen: ya cerró la AV (S1) y aún no se abre la sigmoidea.', ['mv', 'tv', 'ao_l', 'ao_n', 'ao_r', 'pv_a', 'pv_l', 'pv_r']),
      Q('Tres días después de un infarto inferior aparece edema pulmonar agudo con un soplo holosistólico nuevo. ¿Qué estructura se rompió más probablemente?', ['Músculo papilar anterolateral', 'Músculo papilar posteromedial', 'Valva septal tricuspídea', 'Pared libre del VD'], 1, 'El papilar posteromedial tiene irrigación única (descendente posterior), por eso es más vulnerable. Su rotura produce una insuficiencia mitral aguda.', ['pm_lv_pm', 'mv', 'chordae']),
      Q('En la fibrilación auricular, ¿dónde se forman con más frecuencia los trombos?', ['Orejuela izquierda', 'Ápex del VI', 'Seno coronario', 'Orejuela derecha'], 0, 'Más del 90 % de los trombos en la fibrilación auricular no valvular se forman en la orejuela de la AI. De ahí la anticoagulación (escala CHA₂DS₂-VASc).', ['la']),
      Q('El flujo coronario del ventrículo izquierdo ocurre principalmente durante:', ['La sístole', 'La diástole', 'La contracción isovolumétrica', 'Por igual en sístole y diástole'], 1, 'En sístole la contracción comprime los vasos intramurales. Por eso la taquicardia, que acorta la diástole, reduce la perfusión del VI.', ['lca', 'lad', 'cx']),
      Q('Según la ley de Frank-Starling, un aumento del volumen telediastólico produce:', ['Disminución del volumen sistólico', 'Mayor fuerza de contracción y mayor volumen sistólico', 'Aumento de la frecuencia cardíaca', 'Disminución de la contractilidad'], 1, 'Más estiramiento del sarcómero (hasta un óptimo) aumenta la sensibilidad al Ca²⁺ y el solapamiento actina-miosina.', ['lv']),
    ],
  },

  // ================================================================== PULMONES
  lungs: {
    cutPresets: [
      { name: 'Coronal por los hilios', normal: [0, 0, 1], at: { mid: ['hilum_r', 'hilum_l'] } },
      { name: 'Axial a nivel de la carina', normal: [0, 1, 0], at: 'carina' },
      { name: 'Axial por las bases', normal: [0, 1, 0], at: { mid: ['r_s8', 'l_s8'] } },
      { name: 'Sagital: pulmón derecho', normal: [1, 0, 0], at: 'r_s4' },
      { name: 'Sagital: pulmón izquierdo', normal: [-1, 0, 0], at: 'l_s4' },
    ],
    pois: [
      { id: 'obl_r', name: 'Cisura oblicua derecha', at: { between: ['r_s2', 'r_s6'] }, desc: 'Separa el lóbulo inferior derecho de los lóbulos superior y medio. Va del nivel de T4–T5 por detrás hasta la 6.ª costilla por delante.' },
      { id: 'hor', name: 'Cisura horizontal', at: { between: ['r_s3', 'r_s4'] }, desc: 'Solo existe en el pulmón derecho: separa el lóbulo superior del medio, a la altura de la 4.ª costilla.', clinic: 'En la radiografía PA se ve como una línea fina horizontal. Su desplazamiento indica atelectasia o colapso lobar.' },
      { id: 'obl_l', name: 'Cisura oblicua izquierda', at: { between: ['l_s4', 'l_s8'] }, desc: 'Única cisura del pulmón izquierdo: separa el lóbulo superior (con la língula) del inferior.' },
      { id: 'apex', name: 'Vértice pulmonar (cúpula pleural)', at: { key: 'r_s1', dir: [0, 1, 0] }, desc: 'Asciende 2–3 cm sobre la clavícula, por detrás del músculo escaleno anterior.', clinic: 'Riesgo de neumotórax al puncionar la vena subclavia o al hacer un bloqueo supraclavicular. Tumor de Pancoast: síndrome de Horner y dolor en el plexo braquial.' },
      { id: 'seno', name: 'Seno costofrénico', at: { key: 'r_s9', dir: [-0.6, -1, 0] }, desc: 'Receso pleural más declive, entre la pleura costal y la diafragmática.', clinic: 'El derrame pleural primero borra el ángulo costofrénico en la radiografía (desde ~200 mL en PA). La toracocentesis se hace por encima de una costilla, en la línea axilar media o posterior.' },
      { id: 'carina', name: 'Carina', at: { key: 'carina', dir: [0, -1, 0] }, desc: 'Bifurcación traqueal a la altura de T4–T5 (ángulo de Louis).', clinic: 'Es la referencia para posicionar el tubo endotraqueal: su punta debe quedar 3–5 cm por encima.' },
      { id: 'lingula', name: 'Língula', at: { key: 'l_s5', dir: [0.3, -0.3, 1] }, desc: 'Lengüeta del lóbulo superior izquierdo, homóloga del lóbulo medio derecho.' },
    ],
    clinicalQs: [
      Q('Un adulto de pie aspira un maní. ¿Hacia dónde es más probable que vaya?', ['Bronquio principal izquierdo', 'Bronquio principal derecho, hacia los segmentos basales', 'Lóbulo superior izquierdo', 'Língula'], 1, 'El bronquio derecho es más corto, ancho y vertical. De pie, la gravedad lleva el cuerpo extraño a los segmentos basales.', ['mb_r', 'r_s10', 'r_s9']),
      Q('Paciente alcohólico, encontrado inconsciente en decúbito supino, desarrolla una neumonía aspirativa. ¿Qué segmento es el más afectado?', ['Superior (S6) del lóbulo inferior', 'Medial (S5) del lóbulo medio', 'Anterior (S3) del lóbulo superior', 'Basal anterior (S8)'], 0, 'En decúbito supino, el bronquio de S6 es el más declive (es la primera rama posterior del bronquio lobar inferior).', ['r_s6']),
      Q('Una neumonía borra el borde cardíaco derecho en la radiografía PA. ¿Qué lóbulo está comprometido?', ['Lóbulo medio', 'Língula', 'Lóbulo inferior derecho', 'Lóbulo superior derecho'], 0, 'Signo de la silueta: el lóbulo medio contacta con el borde derecho del corazón. La língula borra el izquierdo.', ['r_s4', 'r_s5']),
      Q('Una hipoxemia que NO corrige con O₂ al 100 % sugiere:', ['Shunt (V/Q = 0)', 'Hipoventilación alveolar', 'Aumento del espacio muerto', 'FiO₂ baja (altura)'], 0, 'En el shunt la sangre no contacta con alvéolos ventilados, así que aumentar la FiO₂ casi no cambia la PaO₂.'),
      Q('A nivel del mar, con FiO₂ 0,21 y PaCO₂ 40 mmHg, la PAO₂ esperada es aproximadamente:', ['150 mmHg', '100 mmHg', '60 mmHg', '40 mmHg'], 1, 'PAO₂ = 0,21 × (760 − 47) − 40/0,8 ≈ 150 − 50 = 100 mmHg.'),
      Q('¿Qué ley explica que los alvéolos pequeños tiendan a colapsar si falta el surfactante?', ['Ley de Laplace', 'Ley de Boyle', 'Ley de Fick', 'Ley de Poiseuille'], 0, 'P = 2T/r: con igual tensión superficial, un radio menor exige más presión para mantener el alvéolo abierto. El surfactante reduce T.'),
      Q('Un tumor del vértice pulmonar (Pancoast) puede producir:', ['Síndrome de Horner (ptosis, miosis, anhidrosis)', 'Hemiplejía contralateral', 'Ictericia obstructiva', 'Diarrea secretora'], 0, 'Invade la cadena simpática cervical (ganglio estrellado) y el plexo braquial (dolor en el territorio de C8–T1).', ['r_s1', 'l_s12']),
    ],
  },

  // ================================================================== ESTÓMAGO
  stomach: {
    cutPresets: [
      { name: 'Coronal: capas de la pared', normal: [0, 0, 1], at: 'stomach' },
      { name: 'Transversal por el cuerpo', normal: [0, 1, 0], at: 'stomach' },
      { name: 'Sagital por el antro', normal: [1, 0, 0], at: { key: 'stomach', add: [-0.03, 0, 0] } },
    ],
    pois: [
      { id: 'ugej', name: 'Unión gastroesofágica', at: { between: ['oesophagus', 'stomach'] }, desc: 'Transición del epitelio escamoso esofágico al cilíndrico gástrico (línea Z). Coincide con el esfínter esofágico inferior fisiológico.', clinic: 'El esófago de Barrett es un ascenso de la línea Z con metaplasia intestinal por reflujo crónico. Es una lesión precursora del adenocarcinoma.' },
      { id: 'pyl', name: 'Píloro', at: { between: ['stomach', 'duodenum'] }, desc: 'Esfínter de la capa muscular circular entre el antro y el duodeno.', clinic: 'La estenosis pilórica (hipertrófica del lactante o péptica en el adulto) produce vómitos y alcalosis hipoclorémica.' },
      { id: 'lecho', name: 'Lecho gástrico (pared posterior)', at: { between: ['stomach', 'pancreas'] }, desc: 'Detrás de la bolsa omental: páncreas, bazo, riñón y suprarrenal izquierdos, y mesocolon transverso.', clinic: 'Una úlcera de la pared posterior puede penetrar hasta el páncreas (dolor irradiado a la espalda y aumento de la lipasa).' },
      { id: 'celiac', name: 'Origen del tronco celíaco', at: { key: 'celiac' }, desc: 'A la altura de T12, inmediatamente bajo el hiato aórtico. Lo rodea el plexo celíaco.', clinic: 'El bloqueo del plexo celíaco alivia el dolor del cáncer de páncreas. En el síndrome del ligamento arcuato, este comprime el tronco.' },
    ],
    clinicalQs: [
      Q('En la gastritis atrófica autoinmune, ¿qué células se destruyen y causan la anemia perniciosa?', ['Células parietales del fundus y cuerpo', 'Células G del antro', 'Células principales', 'Células mucosas del cardias'], 0, 'Sin células parietales no hay factor intrínseco ni absorción de B₁₂ (anemia megaloblástica). La aclorhidria eleva la gastrina.', ['stomach']),
      Q('¿Qué hormona liberan las células G del antro para estimular la secreción de HCl?', ['Gastrina', 'Secretina', 'Colecistoquinina', 'Somatostatina'], 0, 'La gastrina actúa sobre receptores CCK₂ de las células parietales y ECL (que liberan histamina). La somatostatina la inhibe cuando el pH antral es menor de 3.'),
      Q('¿Dónde actúa el omeprazol?', ['H⁺/K⁺-ATPasa de la célula parietal', 'Receptor H₂', 'Receptor muscarínico M₃', 'Anhidrasa carbónica'], 0, 'Los IBP inhiben de forma irreversible la bomba de protones, que es el paso final común de la secreción ácida.'),
      Q('Lactante de 4 semanas con vómitos en proyectil no biliosos después de comer y una "oliva" palpable en el epigastrio. ¿Diagnóstico?', ['Estenosis hipertrófica del píloro', 'Atresia duodenal', 'Reflujo gastroesofágico fisiológico', 'Acalasia'], 0, 'La hipertrofia de la capa circular pilórica produce alcalosis metabólica hipoclorémica e hipopotasémica. El tratamiento es la piloromiotomía.', ['stomach', 'duodenum']),
      Q('¿En qué fase se produce la mayor parte de la secreción ácida?', ['Cefálica', 'Gástrica', 'Intestinal', 'Interdigestiva'], 1, 'La fase gástrica aporta ~60 % (por distensión y péptidos, vía gastrina y reflejos vagovagales). La cefálica, ~30 %.'),
      Q('Una úlcera duodenal posterior con hemorragia masiva suele erosionar la arteria:', ['Gastroduodenal', 'Gástrica izquierda', 'Esplénica', 'Mesentérica superior'], 0, 'La gastroduodenal pasa justo por detrás de la primera porción del duodeno.', ['gda', 'duodenum']),
      Q('La relajación receptiva del fundus está mediada por:', ['El vago, con NO y VIP (fibras no adrenérgicas no colinérgicas)', 'El simpático α₁', 'La gastrina', 'La motilina'], 0, 'Es un reflejo vagovagal inhibitorio. Tras una vagotomía se pierde y aparecen saciedad precoz y dumping.'),
    ],
  },

  // ==================================================================== HÍGADO
  liver: {
    cutPresets: [
      { name: 'Transversal por la vena porta', normal: [0, 1, 0], at: 'portal' },
      { name: 'Plano de Cantlie (hígado der./izq.)', through: ['gallbladder', 'ivc_th', { key: 'ivc_th', add: [0, 0.06, 0] }], toward: [1, 0, 0] },
      { name: 'Coronal por el hilio', normal: [0, 0, 1], at: 'portal' },
    ],
    pois: [
      { id: 'cantlie', name: 'Línea de Cantlie', at: { between: ['s4', 's5'] }, desc: 'Línea imaginaria del lecho vesicular a la VCI, por donde pasa la vena hepática media. Divide el hígado funcional en derecho (V–VIII) e izquierdo (II–IV).', clinic: 'Es el plano de sección en las hepatectomías derecha e izquierda.' },
      { id: 'porta', name: 'Porta hepatis (hilio)', at: { key: 'portal', dir: [0, 1, 0] }, desc: 'Fisura transversa de la cara visceral por donde entran la vena porta y la arteria hepática y sale el conducto hepático común.' },
      { id: 'calot', name: 'Triángulo de Calot', at: { between: ['gallbladder', 'bile_duct'] }, desc: 'Delimitado por el conducto cístico, el conducto hepático común y el borde inferior del hígado. Contiene la arteria cística.', clinic: 'Lograr la "visión crítica de seguridad" en este triángulo antes de seccionar evita lesionar la vía biliar en la colecistectomía.' },
      { id: 'vater', name: 'Ampolla de Vater', at: { between: ['bile_duct', 'duodenum'] }, desc: 'Unión del colédoco y el conducto pancreático en la papila mayor (2.ª porción duodenal), rodeada por el esfínter de Oddi.', clinic: 'Un cálculo impactado aquí puede causar colangitis y pancreatitis biliar. La CPRE accede por esta papila.' },
      { id: 'falc', name: 'Ligamento falciforme', at: { between: ['s3', 's4'] }, desc: 'Separa anatómicamente los lóbulos derecho e izquierdo y contiene el ligamento redondo (resto de la vena umbilical).', clinic: 'En la hipertensión portal, las venas paraumbilicales se recanalizan ("cabeza de medusa").' },
      { id: 'ivcr', name: 'VCI retrohepática', at: { key: 'ivc_abd', dir: [0, 1, 0] }, desc: 'Porción de la cava en el área desnuda del hígado, donde recibe las venas hepáticas.', clinic: 'Las lesiones traumáticas de esta zona son de las más letales del abdomen.' },
    ],
    clinicalQs: [
      Q('En la intoxicación por paracetamol, ¿qué zona del acino hepático se necrosa primero?', ['Zona 1 (periportal)', 'Zona 2 (intermedia)', 'Zona 3 (pericentral)', 'Todas por igual'], 2, 'La zona 3 tiene más CYP2E1 (que produce NAPQI) y menos O₂ y glutatión. El antídoto es la N-acetilcisteína.', ['s5', 's6', 's7', 's8']),
      Q('¿Cuál es el mejor marcador agudo de la función de síntesis hepática?', ['INR / tiempo de protrombina', 'Albúmina', 'GGT', 'Fosfatasa alcalina'], 0, 'El factor VII tiene una vida media de ~6 h, así que el INR cambia en horas. La albúmina (vida media ~20 días) refleja la función crónica.'),
      Q('Ictericia progresiva indolora con vesícula palpable (signo de Courvoisier). ¿Diagnóstico más probable?', ['Cáncer de cabeza de páncreas', 'Coledocolitiasis', 'Hepatitis A', 'Síndrome de Gilbert'], 0, 'La obstrucción tumoral lenta del colédoco distiende una vesícula sana. En la litiasis crónica la vesícula suele estar fibrosada.', ['pancreas', 'bile_duct', 'gallbladder']),
      Q('Las várices esofágicas de la cirrosis se forman por una anastomosis entre la vena gástrica izquierda y:', ['Las venas esofágicas (sistema ácigos)', 'Las venas rectales', 'Las venas paraumbilicales', 'Las venas renales'], 0, 'Es una anastomosis portosistémica en el esófago distal. Las otras opciones son colaterales en otros territorios (hemorroides, cabeza de medusa, esplenorrenales).', ['portal', 'splenic_v']),
      Q('La línea de Cantlie, que separa el hígado derecho del izquierdo, pasa por:', ['El lecho vesicular y la VCI (vena hepática media)', 'El ligamento falciforme', 'El ligamento redondo', 'El hilio esplénico'], 0, 'El ligamento falciforme marca la división anatómica (lóbulos), no la funcional (Couinaud).', ['s4', 's5', 'gallbladder', 'hep_veins']),
      Q('¿Qué estructura se pinza en la maniobra de Pringle?', ['El ligamento hepatoduodenal (porta, arteria hepática, colédoco)', 'El ligamento falciforme', 'La VCI infrahepática', 'La arteria esplénica'], 0, 'Controla el flujo de entrada al hígado. Si el sangrado persiste, sugiere una lesión de las venas hepáticas o de la cava.', ['portal', 'pha', 'bile_duct']),
      Q('¿Qué porcentaje aproximado del flujo hepático aporta la vena porta?', ['25 %', '50 %', '75 %', '95 %'], 2, 'La porta aporta ~75 % del flujo (~50 % del O₂). La arteria hepática, el resto.', ['portal']),
    ],
  },

  // ===================================================================== RIÑÓN
  kidney: {
    cutPresets: [
      { name: 'Coronal por el hilio (clásico)', normal: [0, 0, 1], at: 'pelvis' },
      { name: 'Transversal por el hilio', normal: [0, 1, 0], at: 'pelvis' },
      { name: 'Transversal por el polo superior', normal: [0, 1, 0], at: { key: 'capsule', add: [0, 0.03, 0] } },
    ],
    pois: [
      { id: 'sup', name: 'Polo superior', at: { key: 'capsule', dir: [0, 1, 0] }, desc: 'A la altura de T12, con la glándula suprarrenal encima. El riñón izquierdo está algo más alto que el derecho.' },
      { id: 'inf', name: 'Polo inferior', at: { key: 'capsule', dir: [0, -1, 0] }, desc: 'A la altura de L3. Desciende 2–3 cm con la inspiración.', clinic: 'En el riñón en herradura, los polos inferiores se fusionan y quedan atrapados bajo la arteria mesentérica inferior.' },
      { id: 'hilio', name: 'Hilio renal (VAP)', at: { key: 'hilum', dir: [-1, 0, 0.3] }, desc: 'De anterior a posterior: Vena, Arteria y Pelvis. A la altura de L1–L2 (plano transpilórico).' },
      { id: 'upj', name: 'Unión pieloureteral', at: { between: ['pelvis', 'ureter'] }, desc: 'Primera estrechez fisiológica del uréter.', clinic: 'Es la causa más frecuente de hidronefrosis congénita (estenosis de la unión) y un sitio de impactación de cálculos.' },
      { id: 'brodel', name: 'Línea de Brödel', at: { key: 'capsule', dir: [0.6, 0, -1] }, desc: 'Plano relativamente avascular entre los territorios de las ramas anterior y posterior de la arteria renal, en el borde posterolateral.', clinic: 'Es la vía de acceso para la nefrolitotomía y la nefrotomía, porque reduce el sangrado.' },
      { id: 'pap', name: 'Papilas y área cribosa', at: { key: 'papillae' }, desc: 'Vértices de las pirámides, donde los conductos de Bellini vierten la orina a los cálices menores.', clinic: 'La necrosis papilar (AINEs, diabetes, drepanocitosis) puede desprender papilas y causar cólico y hematuria.' },
    ],
    clinicalQs: [
      Q('¿En qué segmento actúa la furosemida?', ['Rama ascendente gruesa (NKCC2)', 'Túbulo proximal', 'Túbulo distal (NCC)', 'Colector (ENaC)'], 0, 'Al bloquear el NKCC2 se pierde ~25 % de la reabsorción de NaCl y el gradiente medular. Causa hipopotasemia, alcalosis y calciuria.', ['cortex', 'pyramids']),
      Q('¿Cuál es la tasa de filtración glomerular normal en un adulto joven?', ['~12 mL/min', '~125 mL/min', '~600 mL/min', '~1,1 L/min'], 1, '600 mL/min es el flujo plasmático renal y 1,1 L/min el sanguíneo. Fracción de filtración = 125/600 ≈ 20 %.'),
      Q('¿Qué arteriola contrae preferentemente la angiotensina II?', ['La eferente', 'La aferente', 'Los vasos rectos', 'Las arcuatas'], 0, 'Al contraer la eferente mantiene la TFG cuando baja la perfusión. Por eso los IECA pueden hacer caer la TFG en la estenosis renal bilateral.', ['intrarenal_a']),
      Q('¿Dónde se impactan con más frecuencia los cálculos ureterales?', ['En las estrecheces fisiológicas (unión pieloureteral, cruce de los ilíacos, unión ureterovesical)', 'En un cáliz menor', 'En la corteza renal', 'En la uretra prostática'], 0, 'La unión ureterovesical es la más estrecha y la más frecuente. El dolor migra del flanco a la ingle y los genitales.', ['ureter', 'pelvis']),
      Q('Paciente con litio, poliuria y orina diluida a pesar de una ADH plasmática alta. ¿Diagnóstico?', ['Diabetes insípida nefrogénica', 'Diabetes insípida central', 'SIADH', 'Polidipsia primaria'], 0, 'El litio entra a las células principales por ENaC e interfiere con la señal V2 y la acuaporina-2. No responde a la desmopresina.', ['pyramids']),
      Q('Varicocele izquierdo de aparición brusca en un adulto de 60 años. ¿Qué debe descartarse?', ['Tumor renal izquierdo con invasión de la vena renal', 'Hernia inguinal', 'Torsión testicular', 'Hidrocele'], 0, 'La vena gonadal izquierda drena en la renal izquierda. Un trombo tumoral obstruye su drenaje.', ['renal_v']),
      Q('¿Por encima de qué glucemia aproximada aparece glucosuria (umbral renal)?', ['~100 mg/dL', '~180–200 mg/dL', '~300–400 mg/dL', '~70 mg/dL'], 1, 'Por encima de ese valor se saturan los SGLT2/1 del túbulo proximal. Los iSGLT2 bajan ese umbral de forma terapéutica.', ['cortex']),
    ],
  },

  // =================================================================== NEFRONA
  nephron: {
    cutPresets: [{ name: 'Corte longitudinal', normal: [0, 0, 1], at: 'center' }],
    pois: [
      { id: 'jga', name: 'Aparato yuxtaglomerular', at: { key: 'md' }, desc: 'Mácula densa, células yuxtaglomerulares (renina) de la arteriola aferente y mesangio extraglomerular.', func: 'Integra la retroalimentación tubuloglomerular (ajusta la TFG) y la liberación de renina (presión arterial y volemia).' },
      { id: 'polo', name: 'Polo urinario', at: { between: ['bowman', 'pct'] }, desc: 'Salida del espacio de Bowman hacia el túbulo proximal. En el lado opuesto está el polo vascular (arteriolas).' },
      { id: 'curva', name: 'Curva del asa (máxima osmolaridad)', at: { key: 'dtl', dir: [0, -1, 0] }, desc: 'Punto más profundo del asa en la médula interna: el líquido tubular alcanza ~1200 mOsm/kg.' },
      { id: 'bellini', name: 'Papila: conducto de Bellini', at: { key: 'cd', dir: [0, -1, 0] }, desc: 'Terminación del colector en la papila. Desde aquí la orina ya no se modifica.' },
    ],
    clinicalQs: [
      Q('¿Qué segmento es impermeable al agua y diluye el líquido tubular hasta ~100 mOsm/kg?', ['Rama ascendente gruesa', 'Rama descendente delgada', 'Túbulo proximal', 'Colector con ADH'], 0, 'Reabsorbe NaCl (NKCC2) sin agua: es el "segmento diluyente".', ['tal']),
      Q('¿Cuál es la osmolaridad del líquido tubular al final del túbulo proximal?', ['~300 mOsm/kg (isoosmótico)', '~100 mOsm/kg', '~1200 mOsm/kg', '~600 mOsm/kg'], 0, 'El proximal reabsorbe agua y solutos en la misma proporción.', ['pct']),
      Q('Si la mácula densa detecta más NaCl, ¿qué sucede?', ['Se contrae la arteriola aferente y baja la TFG', 'Se dilata la aferente', 'Se libera ADH', 'Se contrae la eferente'], 0, 'Retroalimentación tubuloglomerular mediada por adenosina: evita perder sal cuando la TFG sube.', ['md', 'aff']),
      Q('Sin ADH, ¿cómo es la orina final?', ['Diluida (~50–100 mOsm/kg)', 'Isoosmótica (300)', 'Concentrada (~1200)', 'Igual que con ADH'], 0, 'Sin acuaporina-2 el colector no reabsorbe agua y la orina diluida del distal se excreta. Prueba el botón ADH.', ['cd']),
      Q('¿Qué transportador bloquean las tiazidas?', ['NCC del túbulo distal', 'NKCC2 de la rama ascendente gruesa', 'ENaC del colector', 'Acuaporina-2'], 0, 'Causan hipopotasemia e hiponatremia, y reducen la calciuria.', ['dct']),
      Q('Los vasos rectos funcionan como:', ['Intercambiador por contracorriente', 'Multiplicador por contracorriente', 'Barrera de filtración', 'Sitio de secreción de renina'], 0, 'Irrigan la médula sin disipar el gradiente que generó el asa (el multiplicador).', ['vasa']),
      Q('¿Dónde se reabsorbe la mayor parte de la glucosa filtrada?', ['Túbulo proximal (SGLT2)', 'Asa de Henle', 'Túbulo distal', 'Colector'], 0, 'SGLT2 reabsorbe ~90 % en el segmento S1 y SGLT1 el resto (S3).', ['pct']),
    ],
  },

  // ================================================================== ENCÉFALO
  brain: {
    cutPresets: [
      { name: 'Sagital media', normal: [1, 0, 0], at: 'center' },
      { name: 'Coronal por la cabeza del caudado', normal: [0, 0, 1], at: 'head_of_caudate' },
      { name: 'Coronal por el tálamo', normal: [0, 0, 1], at: 'thalamus' },
      { name: 'Coronal por el hipocampo', normal: [0, 0, 1], at: 'body_of_hippocampus' },
      { name: 'Axial por los ganglios basales', normal: [0, 1, 0], at: 'putamen' },
      { name: 'Axial por la protuberancia', normal: [0, 1, 0], at: 'basilar_part_of_pons' },
    ],
    pois: [
      { id: 'central', name: 'Surco central (de Rolando)', at: { between: ['precentral_gyrus', 'postcentral_gyrus'] }, desc: 'Separa el lóbulo frontal (M1 por delante) del parietal (S1 por detrás).', clinic: 'Referencia para el mapeo intraoperatorio. La inversión de fase de los potenciales somatosensoriales localiza el surco.' },
      { id: 'silvio', name: 'Cisura lateral (de Silvio)', at: { mid: [{ key: 'superior_temporal_gyrus', dir: [1, 0.5, 0.4] }, { key: 'inferior_frontal_gyrus_opercular_part', dir: [1, -0.5, 0] }] }, desc: 'Separa el lóbulo temporal del frontal y del parietal. En su profundidad está la ínsula y por ella corre la arteria cerebral media.', clinic: 'Es una localización frecuente de la hemorragia subaracnoidea aneurismática (aneurismas de la ACM).' },
      { id: 'calc', name: 'Cisura calcarina', at: { between: ['cuneus', 'lingual_gyrus_medial_occipitotemporal_gyrus'] }, desc: 'Cara medial del lóbulo occipital. En sus bordes está la corteza visual primaria (V1).' },
      { id: 'po', name: 'Cisura parietooccipital', at: { between: ['precuneus', 'cuneus'] }, desc: 'En la cara medial, separa el precúneo (parietal) del cúneo (occipital).' },
      { id: 'broca', name: 'Área de Broca (hemisferio izquierdo)', at: { key: 'inferior_frontal_gyrus_opercular_part', dir: [1, 0, 0.3] }, desc: 'Porciones opercular y triangular del giro frontal inferior del hemisferio dominante.', clinic: 'Su lesión produce afasia motora: habla no fluente con comprensión conservada.' },
      { id: 'wernicke', name: 'Área de Wernicke (hemisferio izquierdo)', at: { key: 'superior_temporal_gyrus', dir: [1, 0.1, -0.6] }, desc: 'Porción posterior del giro temporal superior y plano temporal del hemisferio dominante.', clinic: 'Su lesión produce afasia sensitiva: habla fluente sin sentido y mala comprensión.' },
      { id: 'uncus', name: 'Uncus', at: { key: 'anterior_parahippocampal_gyrus', dir: [0.3, -0.2, 1] }, desc: 'Extremo anterior y medial del giro parahipocampal, junto a la amígdala.', clinic: 'Herniación uncal (transtentorial): comprime el III par (midriasis ipsilateral, primer signo) y el pedúnculo cerebral, y produce coma.' },
      { id: 'monro', name: 'Agujero interventricular (de Monro)', at: { between: ['anterior_horn_of_lateral_ventricle', 'third_ventricle'] }, desc: 'Comunica cada ventrículo lateral con el tercer ventrículo.', clinic: 'Un quiste coloide puede obstruirlo y causar hidrocefalia aguda (cefalea posicional y riesgo de muerte súbita).' },
    ],
    clinicalQs: [
      Q('Paciente con habla no fluente y "telegráfica", que comprende bien y es consciente de su déficit. ¿Dónde está la lesión?', ['Giro frontal inferior izquierdo (Broca)', 'Temporal superior posterior (Wernicke)', 'Giro angular', 'Lóbulo occipital'], 0, 'Afasia de Broca: territorio de la división superior de la arteria cerebral media izquierda. A menudo se acompaña de hemiparesia derecha de predominio braquiofacial.', ['inferior_frontal_gyrus_opercular_part', 'inferior_frontal_gyrus_triangular_part']),
      Q('Un ACV de la arteria cerebral anterior produce un déficit motor que predomina en:', ['El miembro inferior contralateral', 'La cara y el brazo contralaterales', 'Ninguna extremidad (solo hemianopsia)', 'Solo el lenguaje (afasia)'], 0, 'La ACA irriga la cara medial, donde está la representación del miembro inferior (lobulillo paracentral).', ['paracentral_lobule_rostral_part', 'paracentral_lobule_caudal_part']),
      Q('Movimientos violentos de lanzamiento del brazo contralateral tras un ACV lacunar. ¿Qué estructura está lesionada?', ['Núcleo subtalámico', 'Putamen', 'Núcleo VPL del tálamo', 'Hemisferio cerebeloso'], 0, 'Hemibalismo: se pierde la excitación subtalámica del GPi, lo que desinhibe el tálamo motor.', ['subthalamic_nucleus']),
      Q('La enfermedad de Parkinson se debe principalmente a la pérdida de neuronas en:', ['La sustancia negra compacta', 'El núcleo caudado', 'El núcleo rojo', 'La oliva inferior'], 0, 'Se pierde la dopamina nigroestriada: la vía directa queda hipoactiva y la indirecta hiperactiva, lo que produce bradicinesia.', ['substantia_nigra', 'putamen']),
      Q('Hemianopsia bitemporal en un paciente con cefalea y galactorrea. ¿Qué estructura está comprimida?', ['El quiasma óptico', 'El tracto óptico', 'La radiación óptica', 'La corteza V1'], 0, 'Un prolactinoma o adenoma hipofisario comprime desde abajo las fibras nasales que se cruzan en el quiasma.', ['optic_chiasm']),
      Q('Amnesia anterógrada con confabulación en un paciente alcohólico desnutrido. ¿Qué estructuras están atrofiadas típicamente?', ['Los cuerpos mamilares', 'Solo el hipocampo derecho', 'El vermis cerebeloso', 'El putamen'], 0, 'Síndrome de Wernicke-Korsakoff (déficit de tiamina). Se administra tiamina antes que la glucosa.', ['mammillary_region_of_HTH', 'mammillothalamic_tract']),
      Q('Hidrocefalia con dilatación de los ventrículos laterales y del tercero, pero un cuarto ventrículo normal. ¿Dónde está la obstrucción?', ['En el acueducto cerebral', 'En los agujeros de Luschka y Magendie', 'No hay obstrucción (es comunicante)', 'Es una hidrocefalia normotensiva'], 0, 'Todo lo que está por encima del acueducto se dilata y lo de abajo queda normal.', ['cerebral_aqueduct', 'third_ventricle', 'fourth_ventricle']),
      Q('Dismetría, disdiadococinesia y temblor intencional en el brazo derecho. ¿Dónde está la lesión?', ['Hemisferio cerebeloso derecho', 'Vermis', 'Corteza motora derecha', 'Tálamo izquierdo'], 0, 'El cerebelo actúa sobre el mismo lado del cuerpo (doble cruce). El vermis produce sobre todo ataxia del tronco y la marcha.', ['lateral_hemisphere_of_cerebellum']),
    ],
  },
};

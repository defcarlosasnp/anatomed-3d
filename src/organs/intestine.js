// Intestino delgado y grueso — modelo combinado:
//  - Intestino (duodeno por porciones, yeyuno, íleon, ciego, apéndice, colon por segmentos, recto):
//    Human Reference Atlas (CC BY 4.0).
//  - Arterias y venas mesentéricas: Z-Anatomy (CC BY-SA 4.0), alineadas por ICP sobre el marco cólico.
//    La alineación es aproximada (la posición del ciego y las asas varía mucho entre personas).

const RED = '#c8372f';
const VEIN = '#6a5bd6';
const Q = (q, options, answer, explain, parts = []) => ({ q, options, answer, explain, parts });

export default {
  id: 'intestine',
  name: 'Intestino',
  subtitle: 'Sistema digestivo · Fisiología II',
  models: ['models/intestine-small.glb', 'models/intestine-large.glb', 'models/intestine-vessels.glb'],
  xray: { groups: ['yeyuno', 'colon'], label: 'Yeyuno-íleon y colon' },
  frame: ['jejunum', 'ileum', 'asc', 'trans', 'desc', 'sigmoid', 'rectum', 'caecum', 'd2'],
  labelParts: ['d2', 'jejunum', 'ileum', 'caecum', 'appendix', 'asc', 'trans', 'sigmoid', 'rectum'],

  groups: [
    { id: 'duodeno', name: 'Duodeno', color: '#d9a07a' },
    { id: 'yeyuno', name: 'Yeyuno e íleon', color: '#e6a58c' },
    { id: 'ciego', name: 'Ciego, apéndice y válvula ileocecal', color: '#c9906b' },
    { id: 'colon', name: 'Colon', color: '#b9846a' },
    { id: 'recto', name: 'Recto', color: '#a8705a' },
    { id: 'arterias', name: 'Arterias mesentéricas', color: RED },
    { id: 'venas', name: 'Venas mesentéricas', color: VEIN },
  ],

  groupInfo: {
    duodeno: { func: 'Recibe el quimo ácido, la bilis y el jugo pancreático. Neutraliza el ácido (HCO₃⁻ pancreático estimulado por la secretina, glándulas de Brunner) e inicia la digestión química. Es el principal sitio de absorción de hierro (DMT1 en forma Fe²⁺), calcio (transcelular, dependiente de vitamina D) y folato (yeyuno proximal).' },
    yeyuno: { func: 'Gran superficie absortiva (~200–250 m²) gracias a los pliegues circulares, las vellosidades y las microvellosidades. Glucosa y galactosa entran por SGLT1 y la fructosa por GLUT5, y salen por GLUT2. Los aminoácidos y péptidos usan PepT1. Las grasas se absorben como micelas y salen en quilomicrones por los linfáticos (quilíferos).' },
    colon: { func: 'Absorbe agua (~1,5 L/día de los ~1,5–2 L que llegan) y Na⁺ (ENaC, estimulado por la aldosterona). Secreta K⁺ y HCO₃⁻. La microbiota fermenta la fibra a ácidos grasos de cadena corta (butirato, que nutre al colonocito) y sintetiza vitamina K. Contracciones: haustraciones y movimientos en masa (reflejo gastrocólico).', clinic: 'El colon derecho tiene contenido líquido y el cáncer allí sangra y produce anemia. En el izquierdo el contenido es sólido y el cáncer produce obstrucción y cambio del hábito intestinal.' },
    arterias: { func: 'Intestino medio (de la 2.ª porción del duodeno a los 2/3 del transverso): arteria mesentérica superior. Intestino posterior (del 1/3 distal del transverso al recto superior): arteria mesentérica inferior. La arteria marginal (de Drummond) y el arco de Riolano las conectan.', clinic: 'Zonas limítrofes (watershed): el ángulo esplénico (punto de Griffiths) y la unión rectosigmoidea (punto de Sudeck) son las más vulnerables a la colitis isquémica. La isquemia mesentérica aguda produce dolor desproporcionado al examen físico.' },
    venas: { func: 'Drenan al sistema porta: la mesentérica superior se une con la esplénica (que recibe a la mesentérica inferior). Así, lo absorbido pasa primero por el hígado (primer paso hepático).' },
  },

  parts: {
    d1: { name: 'Duodeno — 1.ª porción (superior)', en: 'Superior part of duodenum', group: 'duodeno', color: '#dba77f', desc: 'Va del píloro a la rodilla superior, a la altura de L1. Es intraperitoneal en sus primeros 2 cm (el bulbo) y luego retroperitoneal.', clinic: 'Es el sitio más frecuente de úlcera péptica duodenal. La úlcera de la cara posterior puede erosionar la arteria gastroduodenal.' },
    bulb: { name: 'Bulbo duodenal (ampolla)', en: 'Duodenal bulb', group: 'duodeno', color: '#e3b38c', desc: 'Primeros ~2 cm del duodeno, móviles, de mucosa lisa ("gorro" en el estudio contrastado).', clinic: 'Más del 90 % de las úlceras duodenales están aquí, asociadas a H. pylori o AINEs.' },
    d2: { name: 'Duodeno — 2.ª porción (descendente)', en: 'Descending part of duodenum', group: 'duodeno', color: '#d9a07a', desc: 'Desciende a la derecha de L1–L3, abrazando la cabeza del páncreas. Allí están la papila mayor y la menor.', func: 'Recibe la bilis y el jugo pancreático. Marca el límite entre el intestino anterior (tronco celíaco) y el medio (arteria mesentérica superior).' },
    d3: { name: 'Duodeno — 3.ª porción (horizontal)', en: 'Horizontal part of duodenum', group: 'duodeno', color: '#cf9670', desc: 'Cruza de derecha a izquierda por delante de la aorta y la VCI, por detrás de los vasos mesentéricos superiores (L3).', clinic: 'Síndrome de la arteria mesentérica superior: tras una pérdida de peso brusca, el ángulo entre la aorta y la AMS se cierra y comprime esta porción (vómitos posprandiales).' },
    d4: { name: 'Duodeno — 4.ª porción (ascendente)', en: 'Ascending part of duodenum', group: 'duodeno', color: '#c98f68', desc: 'Asciende a la izquierda de la aorta hasta el ángulo duodenoyeyunal, suspendido por el ligamento de Treitz.', clinic: 'El ligamento de Treitz separa la hemorragia digestiva alta (proximal) de la baja (distal).' },
    papilla_major: { name: 'Papila mayor (ampolla de Vater)', en: 'Major duodenal papilla', group: 'duodeno', color: '#f0cf5a', desc: 'Desembocadura común del colédoco y del conducto pancreático (Wirsung), rodeada por el esfínter de Oddi, en la 2.ª porción.', func: 'La CCK relaja el esfínter de Oddi y contrae la vesícula, lo que coordina la llegada de bilis y enzimas con la comida.', clinic: 'Un cálculo impactado produce colangitis y pancreatitis biliar. El ampuloma da ictericia obstructiva. La CPRE canula esta papila.' },
    papilla_minor: { name: 'Papila menor (de Santorini)', en: 'Minor duodenal papilla', group: 'duodeno', color: '#e8c070', desc: 'Desembocadura del conducto pancreático accesorio (Santorini), ~2 cm por encima de la mayor.', clinic: 'En el páncreas divisum (fallo de fusión de los conductos), la mayor parte del jugo pancreático drena por aquí. Puede causar pancreatitis recurrente.' },
    jejunum: { name: 'Yeyuno', en: 'Jejunum', group: 'yeyuno', color: '#e8a98f', desc: 'Corresponde a los 2/5 proximales del intestino delgado, sobre todo en el cuadrante superior izquierdo. Tiene pared gruesa, pliegues circulares altos y abundantes, arcadas vasculares escasas y vasos rectos largos.', func: 'Es el sitio principal de absorción de nutrientes (hidratos de carbono, proteínas, lípidos, hierro y folato).', clinic: 'En la enfermedad celíaca, la atrofia vellositaria del duodeno y el yeyuno proximal produce malabsorción y anemia ferropénica.' },
    ileum: { name: 'Íleon', en: 'Ileum', group: 'yeyuno', color: '#e09c82', desc: 'Corresponde a los 3/5 distales del intestino delgado, en el cuadrante inferior derecho y la pelvis. Tiene pared más delgada, más arcadas, vasos rectos cortos y placas de Peyer.', func: 'Absorbe sales biliares (ASBT) y vitamina B₁₂ (complejo con el factor intrínseco, receptor cubilina). Contiene tejido linfoide (placas de Peyer, células M).' },
    ileum_term: { name: 'Íleon terminal', en: 'Terminal ileum', group: 'yeyuno', color: '#d88f75', desc: 'Últimos centímetros del íleon antes de la válvula ileocecal.', func: 'Sitio específico de absorción de vitamina B₁₂ y de sales biliares (circulación enterohepática). Aquí se libera el péptido YY (freno ileal).', clinic: 'La enfermedad de Crohn y la resección ileal producen déficit de B₁₂, diarrea por sales biliares, cálculos de colesterol y oxalúricos. Es un sitio frecuente de invaginación en niños (placas de Peyer hipertróficas).' },
    icv: { name: 'Válvula ileocecal', en: 'Ileocecal valve', group: 'ciego', color: '#c48a65', desc: 'Pliegues labiales en la desembocadura del íleon en el ciego.', func: 'Frena el paso del contenido ileal y limita el reflujo colónico (y bacteriano) al íleon. El reflejo gastroileal la relaja tras comer.', clinic: 'Si la válvula es competente, una obstrucción colónica distal forma un "asa cerrada" y el ciego puede perforarse (cuando su diámetro supera 10–12 cm).' },
    caecum: { name: 'Ciego', en: 'Caecum', group: 'ciego', color: '#c9906b', desc: 'Fondo de saco del colon en la fosa ilíaca derecha, bajo la válvula ileocecal. Es el segmento de mayor diámetro.', clinic: 'Ley de Laplace: por tener el mayor diámetro, es donde más tensión soporta la pared y donde se perfora en la obstrucción. Vólvulo de ciego.' },
    appendix: { name: 'Apéndice vermiforme', en: 'Vermiform appendix', group: 'ciego', color: '#b67c5a', desc: 'Divertículo de ~8 cm con abundante tejido linfoide. Nace en la confluencia de las tenias del ciego. Su posición varía (retrocecal ~65 %, pélvica, subcecal…).', clinic: 'Apendicitis: dolor periumbilical (visceral, T10) que migra a la fosa ilíaca derecha, sobre el punto de McBurney (1/3 lateral de la línea entre la espina ilíaca anterosuperior y el ombligo). Signos de Blumberg, Rovsing, psoas y obturador.' },
    asc: { name: 'Colon ascendente', en: 'Ascending colon', group: 'colon', color: '#bf8a6e', desc: 'Retroperitoneal. Asciende por el flanco derecho hasta el ángulo hepático.' },
    hflex: { name: 'Ángulo hepático (flexura cólica derecha)', en: 'Hepatic flexure', group: 'colon', color: '#b88367', desc: 'Curva del colon bajo el hígado, sobre el riñón derecho.' },
    trans: { name: 'Colon transverso', en: 'Transverse colon', group: 'colon', color: '#c4907a', desc: 'Intraperitoneal, móvil, suspendido por el mesocolon transverso. Lo cubre el omento mayor.', func: 'Sus 2/3 proximales pertenecen al intestino medio (arteria cólica media, de la mesentérica superior). El 1/3 distal es intestino posterior (cólica izquierda, de la mesentérica inferior).' },
    sflex: { name: 'Ángulo esplénico (flexura cólica izquierda)', en: 'Splenic flexure', group: 'colon', color: '#b17d62', desc: 'Más alta y aguda que la hepática. Está fijada por el ligamento frenocólico, junto al bazo.', clinic: 'Punto de Griffiths: zona limítrofe entre las arterias mesentérica superior e inferior. Es el sitio clásico de colitis isquémica.' },
    desc: { name: 'Colon descendente', en: 'Descending colon', group: 'colon', color: '#ad785e', desc: 'Retroperitoneal, en el flanco izquierdo hasta la cresta ilíaca.' },
    sigmoid: { name: 'Colon sigmoides', en: 'Sigmoid colon', group: 'colon', color: '#a67359', desc: 'Asa en "S", intraperitoneal, con mesosigmoides. Va de la cresta ilíaca izquierda a S3.', func: 'Almacena las heces antes de la defecación.', clinic: 'Es la localización más frecuente de la enfermedad diverticular (diverticulitis: dolor en la fosa ilíaca izquierda y fiebre). Vólvulo de sigmoides en adultos mayores (imagen en "grano de café").' },
    rectum: { name: 'Recto', en: 'Rectum', group: 'recto', color: '#a8705a', desc: 'Va de S3 al conducto anal (~12–15 cm). No tiene tenias ni haustras, y tiene tres pliegues transversos (válvulas de Houston).', func: 'Su distensión activa el reflejo rectoanal inhibitorio (el esfínter interno se relaja) y genera la urgencia defecatoria. El esfínter externo, voluntario (nervio pudendo), permite posponer la evacuación.', clinic: 'Enfermedad de Hirschsprung: aganglionosis del recto que se extiende en sentido proximal, con ausencia del reflejo rectoanal inhibitorio y megacolon. El tacto rectal es parte del examen físico abdominal.' },
    abd_ao: { name: 'Aorta abdominal', en: 'Abdominal aorta', group: 'arterias', color: RED, desc: 'Da la arteria mesentérica superior (L1) y la inferior (L3).' },
    sma: { name: 'Arteria mesentérica superior', en: 'Superior mesenteric artery', group: 'arterias', color: RED, desc: 'Nace a la altura de L1, pasa por delante de la 3.ª porción duodenal y por detrás del páncreas. Da las ramas pancreaticoduodenal inferior, yeyunales e ileales, ileocólica, cólica derecha y cólica media.', func: 'Irriga el intestino medio. Tras la comida su flujo aumenta 2–3 veces (hiperemia posprandial).', clinic: 'La embolia de la mesentérica superior (fibrilación auricular) es la causa principal de isquemia mesentérica aguda.' },
    ileocolic: { name: 'Arteria ileocólica', en: 'Ileocolic artery', group: 'arterias', color: RED, desc: 'Rama terminal de la mesentérica superior hacia el íleon terminal, el ciego, el apéndice y el colon ascendente proximal.' },
    ileocolic_colic: { name: 'Rama cólica de la ileocólica', en: 'Colic branch of ileocolic artery', group: 'arterias', color: RED, desc: 'Irriga el colon ascendente proximal.' },
    ileal_br: { name: 'Rama ileal de la ileocólica', en: 'Ileal branch of ileocolic artery', group: 'arterias', color: RED, desc: 'Se anastomosa con las últimas arterias ileales.' },
    appendicular: { name: 'Arteria apendicular', en: 'Appendicular artery', group: 'arterias', color: RED, desc: 'Rama de la ileocólica que corre por el mesoapéndice. Es una arteria terminal.', clinic: 'Como es terminal, la apendicitis con trombosis evoluciona a gangrena y perforación. Se liga en la apendicectomía.' },
    marginal: { name: 'Arteria marginal (de Drummond)', en: 'Marginal artery', group: 'arterias', color: RED, desc: 'Arcada continua paralela al borde mesentérico del colon que une las ramas cólicas de ambas mesentéricas.', clinic: 'Mantiene la irrigación del colon izquierdo cuando se liga la mesentérica inferior (cirugía de aneurisma aórtico o colectomía).' },
    right_colic: { name: 'Arteria cólica derecha', en: 'Right colic artery', group: 'arterias', color: RED, desc: 'Rama de la mesentérica superior hacia el colon ascendente (ausente en ~10–15 % de las personas).' },
    middle_colic: { name: 'Arteria cólica media', en: 'Middle colic artery', group: 'arterias', color: RED, desc: 'Corre por el mesocolon transverso e irriga los 2/3 proximales del transverso.' },
    ipd: { name: 'Arteria pancreaticoduodenal inferior', en: 'Inferior pancreaticoduodenal artery', group: 'arterias', color: RED, desc: 'Primera rama de la mesentérica superior. Se anastomosa con las pancreaticoduodenales superiores (del tronco celíaco), una conexión celíaco-mesentérica.' },
    ima: { name: 'Arteria mesentérica inferior', en: 'Inferior mesenteric artery', group: 'arterias', color: RED, desc: 'Nace a la altura de L3. Da la cólica izquierda, las sigmoideas y la rectal superior.', func: 'Irriga el intestino posterior (1/3 distal del transverso hasta el recto superior).', clinic: 'Se ocluye con frecuencia en los aneurismas de aorta abdominal y en la cirugía aórtica (riesgo de isquemia del sigmoides).' },
    left_colic: { name: 'Arteria cólica izquierda', en: 'Left colic artery', group: 'arterias', color: RED, desc: 'Irriga el transverso distal y el colon descendente.' },
    left_colic_a: { name: 'Rama ascendente de la cólica izquierda', en: 'Ascending branch of left colic artery', group: 'arterias', color: RED, desc: 'Hacia el ángulo esplénico. Puede formar el arco de Riolano con la cólica media.' },
    left_colic_d: { name: 'Rama descendente de la cólica izquierda', en: 'Descending branch of left colic artery', group: 'arterias', color: RED, desc: 'Hacia el colon descendente. Se anastomosa con las sigmoideas.' },
    sigmoid_a: { name: 'Arterias sigmoideas', en: 'Sigmoid arteries', group: 'arterias', color: RED, desc: 'Entre 2 y 4 ramas de la mesentérica inferior por el mesosigmoides.' },
    sup_rectal: { name: 'Arteria rectal superior', en: 'Superior rectal artery', group: 'arterias', color: RED, desc: 'Rama terminal de la mesentérica inferior hacia el recto superior. Se anastomosa con las rectales media e inferior (de la ilíaca interna).', clinic: 'Punto de Sudeck: zona limítrofe en la unión rectosigmoidea.' },
    smv: { name: 'Vena mesentérica superior', en: 'Superior mesenteric vein', group: 'venas', color: VEIN, desc: 'A la derecha de la arteria. Detrás del cuello del páncreas se une con la esplénica para formar la vena porta.', func: 'Lleva al hígado los nutrientes absorbidos en el intestino delgado.' },
    imv: { name: 'Vena mesentérica inferior', en: 'Inferior mesenteric vein', group: 'venas', color: VEIN, desc: 'Asciende a la izquierda del ángulo de Treitz y drena en la vena esplénica (a veces en la mesentérica superior).', clinic: 'Sus tributarias rectales superiores se anastomosan con las rectales media e inferior (sistémicas), formando una anastomosis portocava.' },
    sigmoid_v: { name: 'Venas sigmoideas', en: 'Sigmoid veins', group: 'venas', color: VEIN, desc: 'Drenan el sigmoides hacia la mesentérica inferior.' },
    middle_colic_v: { name: 'Vena cólica media', en: 'Middle colic vein', group: 'venas', color: VEIN, desc: 'Drena el colon transverso hacia la mesentérica superior.' },
    right_colic_v: { name: 'Vena cólica derecha', en: 'Right colic vein', group: 'venas', color: VEIN, desc: 'Drena el colon ascendente.' },
  },

  tours: [
    {
      name: 'Tránsito intestinal',
      steps: [
        { title: '1. Duodeno', parts: ['bulb', 'd1', 'd2', 'd3', 'd4', 'papilla_major', 'papilla_minor'], text: 'El quimo ácido estimula la secretina (que pide HCO₃⁻ al páncreas) y la CCK (que pide enzimas y contrae la vesícula). Por la papila mayor llegan la bilis y el jugo pancreático. Aquí se absorbe el hierro.' },
        { title: '2. Yeyuno', parts: ['jejunum'], text: 'Es el sitio principal de absorción de nutrientes. La motilidad posprandial es de segmentación (mezcla) y peristaltismo corto.' },
        { title: '3. Íleon', parts: ['ileum', 'ileum_term'], text: 'Se absorben la vitamina B₁₂ y las sales biliares. Las placas de Peyer forman parte de la vigilancia inmune. El péptido YY enlentece el vaciamiento (freno ileal).' },
        { title: '4. Válvula ileocecal y ciego', parts: ['icv', 'caecum', 'appendix'], text: 'Llegan ~1,5 L/día de contenido líquido. La válvula regula el paso y evita el reflujo bacteriano.' },
        { title: '5. Colon ascendente y transverso', parts: ['asc', 'hflex', 'trans'], text: 'Absorción de agua y Na⁺, fermentación de la fibra y haustraciones que mezclan y avanzan lentamente.' },
        { title: '6. Colon descendente y sigmoides', parts: ['sflex', 'desc', 'sigmoid'], text: 'Las heces se solidifican. Los movimientos en masa (1–3 al día, tras el reflejo gastrocólico) llevan el contenido al recto.' },
        { title: '7. Recto y defecación', parts: ['rectum'], text: 'La distensión rectal relaja el esfínter interno (reflejo rectoanal inhibitorio). El esfínter externo, voluntario, decide el momento.' },
        { title: '8. Irrigación', parts: ['abd_ao', 'sma', 'ileocolic', 'right_colic', 'middle_colic', 'marginal', 'ima', 'left_colic', 'sigmoid_a', 'sup_rectal'], text: 'La mesentérica superior irriga el intestino medio y la inferior el posterior, unidas por la arteria marginal. Las zonas limítrofes son el ángulo esplénico (Griffiths) y la unión rectosigmoidea (Sudeck).' },
      ],
    },
  ],

  cutPresets: [
    { name: 'Coronal (vista de atlas)', normal: [0, 0, 1], at: 'center' },
    { name: 'Axial por el ombligo (yeyuno)', normal: [0, 1, 0], at: 'jejunum' },
    { name: 'Axial por el ciego', normal: [0, 1, 0], at: 'caecum' },
    { name: 'Sagital por el recto', normal: [1, 0, 0], at: 'rectum' },
  ],

  pois: [
    { id: 'treitz', name: 'Ángulo de Treitz', at: { between: ['d4', 'jejunum'] }, desc: 'Ángulo duodenoyeyunal suspendido por el ligamento de Treitz (músculo suspensorio del duodeno).', clinic: 'Separa la hemorragia digestiva alta de la baja.' },
    { id: 'mcburney', name: 'Punto de McBurney (base del apéndice)', at: { between: ['appendix', 'caecum'] }, desc: 'Proyección cutánea habitual de la base del apéndice: 1/3 lateral de la línea entre la espina ilíaca anterosuperior derecha y el ombligo.', clinic: 'Su dolor a la palpación orienta a apendicitis. Pueden acompañarlo los signos de Blumberg, Rovsing, psoas y obturador.' },
    { id: 'icv_poi', name: 'Válvula ileocecal', at: 'icv', desc: 'Unión del íleon con el ciego.' },
    { id: 'griffiths', name: 'Punto de Griffiths (ángulo esplénico)', at: { key: 'sflex', dir: [0.5, 1, 0] }, desc: 'Zona limítrofe entre las arterias mesentérica superior e inferior.', clinic: 'Es el sitio clásico de la colitis isquémica: dolor abdominal izquierdo y rectorragia en un adulto mayor.' },
    { id: 'sudeck', name: 'Punto de Sudeck (unión rectosigmoidea)', at: { between: ['sigmoid', 'rectum'] }, desc: 'Zona limítrofe entre la última sigmoidea y la rectal superior.', clinic: 'Hay que considerarlo al definir la ligadura vascular en la cirugía de recto.' },
    { id: 'vater', name: 'Ampolla de Vater', at: 'papilla_major', desc: 'Papila mayor en la 2.ª porción duodenal.', clinic: 'Es el acceso de la CPRE. Un cálculo enclavado aquí causa pancreatitis biliar.' },
  ],

  clinicalQs: [
    Q('Paciente con enfermedad de Crohn y resección del íleon terminal. ¿Qué déficit es más esperable?', ['Vitamina B₁₂ (y sales biliares)', 'Hierro', 'Folato', 'Vitamina C'], 0, 'El íleon terminal absorbe la B₁₂ unida al factor intrínseco (receptor cubilina) y las sales biliares. Su pérdida produce anemia megaloblástica, diarrea biliar y cálculos.', ['ileum_term', 'ileum']),
    Q('¿Dónde se absorbe principalmente el hierro de la dieta?', ['Duodeno y yeyuno proximal', 'Íleon terminal', 'Colon ascendente', 'Estómago'], 0, 'El Fe³⁺ se reduce a Fe²⁺ (citocromo b duodenal), entra por DMT1 y sale por ferroportina, que es regulada por la hepcidina.', ['d1', 'd2', 'jejunum']),
    Q('Dolor periumbilical que migra a la fosa ilíaca derecha, con fiebre y Blumberg positivo. ¿Diagnóstico?', ['Apendicitis aguda', 'Diverticulitis', 'Colitis isquémica', 'Pancreatitis'], 0, 'El dolor visceral inicial (T10, periumbilical) pasa a ser somático cuando se irrita el peritoneo parietal en la fosa ilíaca derecha.', ['appendix', 'caecum']),
    Q('Paciente de 75 años con dolor abdominal izquierdo y rectorragia tras una hipotensión. ¿Qué zona es la más vulnerable?', ['Ángulo esplénico (punto de Griffiths)', 'Ciego', 'Duodeno', 'Íleon terminal'], 0, 'Es una zona limítrofe entre la mesentérica superior y la inferior: es sensible a la hipoperfusión (colitis isquémica no oclusiva).', ['sflex', 'marginal', 'middle_colic', 'left_colic']),
    Q('Recién nacido sin eliminación de meconio en las primeras 48 h, con distensión abdominal y ausencia del reflejo rectoanal inhibitorio. ¿Diagnóstico?', ['Enfermedad de Hirschsprung', 'Atresia duodenal', 'Íleo meconial por fibrosis quística', 'Estenosis pilórica'], 0, 'Falla la migración de la cresta neural y faltan los plexos mientérico y submucoso en el recto (y más arriba). El diagnóstico se confirma con biopsia rectal.', ['rectum', 'sigmoid']),
    Q('En el cólera, ¿cuál es el mecanismo de la diarrea?', ['Secretora: ↑AMPc → CFTR abierto → secreción de Cl⁻ y agua', 'Osmótica por lactosa', 'Inflamatoria con sangre', 'Por motilidad aumentada'], 0, 'La toxina activa la Gs de forma permanente, sube el AMPc y el CFTR queda abierto. El SGLT1 sigue funcionando, por eso las sales de rehidratación oral (glucosa + Na⁺) funcionan.', ['jejunum', 'ileum']),
    Q('¿Cómo salen del enterocito las grasas absorbidas?', ['Como quilomicrones, por los linfáticos (quilíferos)', 'Como ácidos grasos libres por la porta', 'Unidas a la albúmina en la porta', 'No se absorben'], 0, 'Se reesterifican a triglicéridos y se empaquetan con ApoB-48. Los triglicéridos de cadena media sí pasan directo a la porta.', ['jejunum']),
    Q('Adulto mayor con dolor en la fosa ilíaca izquierda, fiebre y leucocitosis. ¿Dónde está más probablemente el problema?', ['Sigmoides (diverticulitis)', 'Apéndice', 'Ciego', 'Duodeno'], 0, 'Los divertículos son pseudodivertículos que aparecen por presión intraluminal alta en los puntos débiles por donde penetran los vasos rectos. Son más frecuentes en el sigmoides.', ['sigmoid']),
  ],

  physiology: [
    {
      title: 'Digestión y absorción',
      open: true,
      html: `
<table>
<tr><th>Nutriente</th><th>Digestión</th><th>Absorción</th></tr>
<tr><td>Hidratos de carbono</td><td>Amilasa salival y pancreática, disacaridasas del borde en cepillo</td><td>Glucosa y galactosa por SGLT1; fructosa por GLUT5; salida por GLUT2</td></tr>
<tr><td>Proteínas</td><td>Pepsina, tripsina (activada por la enteroquinasa), quimotripsina y carboxipeptidasas</td><td>Aminoácidos por transportadores con Na⁺; di- y tripéptidos por PepT1</td></tr>
<tr><td>Lípidos</td><td>Lipasa pancreática (con colipasa) y sales biliares (micelas)</td><td>Reesterificación y quilomicrones por los linfáticos</td></tr>
<tr><td>Hierro</td><td>Fe³⁺ → Fe²⁺</td><td>Duodeno (DMT1 → ferroportina, regulada por la hepcidina)</td></tr>
<tr><td>Vitamina B₁₂</td><td>Se libera de las proteínas; se une a la haptocorrina y luego al factor intrínseco</td><td>Íleon terminal (cubilina)</td></tr>
<tr><td>Agua</td><td>Entran ~9 L/día (2 de la dieta y 7 de secreciones)</td><td>~7,5 L en el intestino delgado, ~1,4 L en el colon, ~0,1 L en las heces</td></tr>
</table>`,
    },
    {
      title: 'Motilidad',
      html: `
<ul>
<li><b>Ondas lentas</b> (células intersticiales de Cajal): ~12/min en el duodeno y ~8/min en el íleon (gradiente). Las espigas superpuestas producen la contracción.</li>
<li><b>Segmentación</b> (mezcla) y <b>peristaltismo</b>. La ley del intestino: contracción por encima y relajación por debajo del bolo (plexo mientérico, con ACh y sustancia P arriba, NO y VIP abajo).</li>
<li><b>Complejo motor migratorio</b> en ayunas (~cada 90 min, mediado por la motilina): barre los residuos. Si falta, aparece sobrecrecimiento bacteriano.</li>
<li><b>Colon:</b> haustraciones (mezcla lenta), movimientos en masa y reflejo gastrocólico tras las comidas.</li>
<li><b>Defecación:</b> distensión rectal → reflejo rectoanal inhibitorio (el esfínter interno se relaja) → control voluntario del esfínter externo y del puborrectal.</li>
</ul>`,
    },
    {
      title: 'Irrigación y desarrollo embrionario',
      html: `
<table>
<tr><th>Segmento embrionario</th><th>Arteria</th><th>Incluye</th></tr>
<tr><td>Intestino anterior</td><td>Tronco celíaco</td><td>Hasta la 2.ª porción del duodeno (papila)</td></tr>
<tr><td>Intestino medio</td><td>Mesentérica superior</td><td>Duodeno distal → 2/3 del transverso</td></tr>
<tr><td>Intestino posterior</td><td>Mesentérica inferior</td><td>1/3 distal del transverso → recto superior</td></tr>
</table>
<p class="clinic">Malrotación intestinal con vólvulo de intestino medio: vómitos biliosos en un neonato. Es una urgencia quirúrgica. El divertículo de Meckel (resto del conducto onfalomesentérico) sigue la "regla de los 2": 2 % de la población, a 2 pies de la válvula ileocecal y 2 tipos de mucosa ectópica.</p>`,
    },
  ],
};

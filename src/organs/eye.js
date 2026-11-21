// Ojo izquierdo — modelo combinado:
//  - Globo ocular (21 estructuras, incluidos canal de Schlemm, malla trabecular y humores): Human Reference Atlas
//    (CC BY 4.0), simplificado para la web.
//  - Nervio óptico y músculos extraoculares: Z-Anatomy (CC BY-SA 4.0), alineados por escala y traslación.

const Q = (q, options, answer, explain, parts = []) => ({ q, options, answer, explain, parts });

export default {
  id: 'eye',
  name: 'Ojo',
  subtitle: 'Órganos de los sentidos · Fisiología II',
  models: ['models/eye-hra.glb', 'models/eye-za-nerve.glb', 'models/eye-za-muscles.glb'],
  xray: { groups: ['fibrosa', 'anexos'], label: 'Esclera, córnea y conjuntiva' },
  frame: ['sclera', 'm_lr', 'm_mr', 'm_sr', 'm_ir'],
  viewDir: [0.45, 0.2, 1],
  animation: 'accommodation',
  extra: { id: 'gaze', label: '👀 Movimientos' },
  labelParts: ['cornea', 'iris', 'lens', 'sclera', 'optic_nerve', 'm_lr', 'm_sr', 'm_so'],

  groups: [
    { id: 'fibrosa', name: 'Túnica fibrosa', color: '#efe9e0' },
    { id: 'uvea', name: 'Úvea (túnica vascular)', color: '#6b4a3a' },
    { id: 'retina', name: 'Retina', color: '#d98a5a' },
    { id: 'medios', name: 'Medios transparentes', color: '#bfe3f2' },
    { id: 'drenaje', name: 'Drenaje del humor acuoso', color: '#5a8fd8' },
    { id: 'anexos', name: 'Conjuntiva', color: '#f0b8b8' },
    { id: 'musculos', name: 'Músculos extraoculares', color: '#b0473f' },
    { id: 'nervio', name: 'Nervio óptico', color: '#f2d06b' },
  ],

  groupInfo: {
    uvea: { func: 'La úvea es la capa vascular y pigmentada. El iris regula la luz que entra, el cuerpo ciliar produce humor acuoso y permite la acomodación, y la coroides nutre las capas externas de la retina (fotorreceptores).', clinic: 'Uveítis anterior (iritis): ojo rojo doloroso con fotofobia e inyección periquerática. Se asocia a espondiloartritis (HLA-B27) y sarcoidosis.' },
    musculos: { func: 'Seis músculos mueven el globo (4 rectos y 2 oblicuos). Todos los rectos y el oblicuo superior nacen del anillo tendinoso común (de Zinn). Inervación: "LR6 SO4, resto 3": recto lateral por el VI par, oblicuo superior por el IV par, y el resto más el elevador del párpado por el III par.', clinic: 'Parálisis del III par: ojo "abajo y afuera", ptosis y midriasis si es compresiva (aneurisma de la comunicante posterior). En la diabética, la pupila suele respetarse.' },
    medios: { func: 'La luz atraviesa córnea → humor acuoso → cristalino → humor vítreo hasta la retina. La córnea aporta ~43 D (2/3 del poder refractivo) y el cristalino ~20 D, que son variables con la acomodación.' },
    retina: { func: 'Tiene 10 capas. Los fotorreceptores (conos y bastones) están en la capa externa, así que la luz atraviesa la retina hasta llegar a ellos. La señal pasa a las células bipolares y luego a las ganglionares, cuyos axones forman el nervio óptico.' },
  },

  parts: {
    cornea: { name: 'Córnea', en: 'Cornea', group: 'fibrosa', color: '#d8eef7', opacity: 0.35, desc: 'Ventana transparente y avascular de la túnica fibrosa (~0,55 mm de espesor). Tiene 5–6 capas: epitelio, Bowman, estroma, Dua, Descemet y endotelio.', func: 'Es la lente más potente del ojo (~43 D). Se mantiene transparente gracias a la deshidratación activa del estroma (bomba endotelial) y a su disposición regular de colágeno. Tiene inervación sensitiva muy densa (V1, nervios ciliares largos).', clinic: 'Reflejo corneal: aferencia por el V1 y eferencia por el VII. Queratitis, úlcera corneal, queratocono. La cirugía refractiva (LASIK) remodela su curvatura.' },
    sclera: { name: 'Esclera', en: 'Sclera', group: 'fibrosa', color: '#f1ece3', desc: 'Capa fibrosa blanca y opaca que forma los 5/6 posteriores del globo. En la lámina cribosa la atraviesan los axones del nervio óptico.', func: 'Da forma y protección al globo y sirve de inserción a los músculos extraoculares.', clinic: 'Escleras azules en la osteogénesis imperfecta. La escleritis duele y se asocia a la artritis reumatoide.' },
    csj: { name: 'Limbo esclerocorneal', en: 'Corneoscleral junction (limbus)', group: 'fibrosa', color: '#e4d9c8', desc: 'Unión de la córnea con la esclera. Contiene las células madre del epitelio corneal y, en profundidad, el ángulo iridocorneal.', clinic: 'La inyección ciliar (periquerática) alrededor del limbo indica patología intraocular: uveítis, glaucoma agudo o queratitis.' },
    conj_bulbar: { name: 'Conjuntiva bulbar', en: 'Bulbar conjunctiva', group: 'anexos', color: '#f6d0d0', opacity: 0.3, desc: 'Mucosa transparente que cubre la esclera anterior hasta el limbo.', clinic: 'Conjuntivitis viral, bacteriana o alérgica: ojo rojo con inyección conjuntival y sin baja de visión. Hemorragia subconjuntival: indolora y benigna.' },
    conj_palp: { name: 'Conjuntiva palpebral', en: 'Palpebral conjunctiva', group: 'anexos', color: '#e8a0a0', desc: 'Recubre la cara interna de los párpados y se continúa con la bulbar en los fondos de saco.', clinic: 'Tracoma (Chlamydia), la principal causa infecciosa de ceguera. Su palidez es un signo de anemia.' },
    iris: { name: 'Iris', en: 'Iris', group: 'uvea', color: '#5b8a6e', desc: 'Diafragma pigmentado que separa la cámara anterior de la posterior. Tiene dos músculos: el esfínter de la pupila y el dilatador.', func: 'Esfínter (parasimpático: III par, ganglio ciliar, M₃) → miosis. Dilatador (simpático: ganglio cervical superior, α₁) → midriasis.', clinic: 'Pupila de Argyll Robertson (neurosífilis): acomoda pero no reacciona a la luz. Síndrome de Horner: miosis, ptosis y anhidrosis.' },
    pupil: { name: 'Pupila', en: 'Pupil', group: 'uvea', color: '#141414', desc: 'Abertura central del iris (2–4 mm con luz ambiente).', func: 'Reflejo fotomotor: aferencia por el II par → núcleo pretectal → Edinger-Westphal bilateral → eferencia por el III par. Por eso hay respuesta directa y consensual.', clinic: 'Defecto pupilar aferente relativo (pupila de Marcus Gunn): aparece en la neuritis óptica y en lesiones del nervio óptico (prueba de la linterna oscilante).' },
    ciliary_body: { name: 'Cuerpo ciliar', en: 'Ciliary body', group: 'uvea', color: '#7a5545', desc: 'Engrosamiento uveal entre el iris y la ora serrata. Contiene el músculo ciliar y los procesos ciliares.' },
    ciliary_muscle: { name: 'Músculo ciliar', en: 'Ciliary muscle', group: 'uvea', color: '#a04b3c', desc: 'Músculo liso anular del cuerpo ciliar.', func: 'Acomodación: al contraerse (parasimpático, M₃) relaja la zónula, y el cristalino se vuelve más convexo para enfocar de cerca. Su contracción también abre la malla trabecular, lo que favorece el drenaje del humor acuoso.', clinic: 'La pilocarpina (agonista M₃) produce miosis y contracción ciliar: se usa en el glaucoma de ángulo cerrado. La atropina causa cicloplejía y midriasis.' },
    ciliary_proc: { name: 'Procesos ciliares', en: 'Ciliary processes', group: 'uvea', color: '#8f5f4c', desc: 'Unos 70 pliegues radiales del cuerpo ciliar con epitelio biestratificado.', func: 'Secretan el humor acuoso (~2–3 µL/min) por transporte activo, con participación de la anhidrasa carbónica y la Na⁺/K⁺-ATPasa.', clinic: 'La acetazolamida, la dorzolamida y los β-bloqueadores tópicos (timolol) reducen la producción de humor acuoso en el glaucoma.' },
    choroid: { name: 'Coroides', en: 'Choroid', group: 'uvea', color: '#5a3a30', desc: 'Capa vascular pigmentada entre la esclera y la retina. Tiene uno de los flujos sanguíneos más altos del organismo.', func: 'Nutre el epitelio pigmentario y los fotorreceptores (el tercio externo de la retina). Su pigmento absorbe la luz dispersa.', clinic: 'Melanoma coroideo: el tumor intraocular primario más frecuente en adultos. En la DMAE húmeda se forman neovasos coroideos.' },
    retina: { name: 'Retina neurosensorial', en: 'Retina', group: 'retina', color: '#e09a6a', desc: 'Capa nerviosa interna, desde la ora serrata hasta el disco óptico. Está adherida firmemente solo en esos dos puntos.', func: 'Transduce la luz: bastones (visión escotópica, ~120 millones, rodopsina) y conos (visión fotópica y del color, ~6 millones, tres opsinas S/M/L). La luz cierra los canales de Na⁺ (vía transducina → PDE → ↓GMPc) e hiperpolariza el fotorreceptor.', clinic: 'Desprendimiento de retina: fotopsias, miodesopsias (moscas volantes) y una "cortina" en el campo visual. Es una urgencia. La retinopatía diabética es una causa principal de ceguera en adultos en edad laboral.' },
    macula: { name: 'Mácula lútea', en: 'Macula lutea', group: 'retina', color: '#f2c14e', desc: 'Zona de ~5 mm de diámetro, temporal al disco óptico, con pigmentos xantófilos (luteína y zeaxantina).', func: 'Visión central de alta resolución y del color.', clinic: 'Degeneración macular asociada a la edad: pérdida de la visión central (metamorfopsia en la rejilla de Amsler). Mancha rojo cereza en la oclusión de la arteria central de la retina y en la enfermedad de Tay-Sachs.' },
    fovea: { name: 'Fóvea', en: 'Fovea centralis', group: 'retina', color: '#ffdf7a', desc: 'Depresión central de la mácula (~1,5 mm). Solo tiene conos, desplaza las capas internas y es avascular.', func: 'Máxima agudeza visual: relación ~1:1 entre cono, bipolar y ganglionar. Es el punto que se alinea con el objeto que se fija.' },
    optic_disc: { name: 'Disco óptico (papila)', en: 'Optic disc', group: 'retina', color: '#f6e2b0', desc: 'Salida de los axones de las células ganglionares y entrada de la arteria y la vena centrales de la retina. Está ~15° nasal a la fóvea.', func: 'No tiene fotorreceptores, por eso corresponde a la mancha ciega fisiológica del campo visual.', clinic: 'Papiledema (hipertensión intracraneal): bordes borrosos y sin pulso venoso. Excavación papilar aumentada (relación copa/disco > 0,6) en el glaucoma.' },
    ora: { name: 'Ora serrata', en: 'Ora serrata', group: 'retina', color: '#c87a4a', desc: 'Borde dentado anterior de la retina neurosensorial, en la unión con el cuerpo ciliar.', clinic: 'Los desgarros retinianos periféricos cerca de la ora pueden originar un desprendimiento regmatógeno.' },
    lens: { name: 'Cristalino', en: 'Lens', group: 'medios', color: '#e6f3fa', opacity: 0.6, desc: 'Lente biconvexa avascular formada por fibras sin núcleo y una cápsula elástica. Está suspendida por la zónula.', func: 'Aporta ~20 D y es la parte variable del poder refractivo (acomodación). Con la edad pierde elasticidad, y la amplitud de acomodación baja de ~14 D a los 10 años a ~1 D a los 60.', clinic: 'Presbicia (> 40–45 años): dificultad para ver de cerca. Catarata: opacificación, la principal causa de ceguera reversible en el mundo; se trata con facoemulsificación y lente intraocular. Ectopia lentis en el síndrome de Marfan.' },
    zonule: { name: 'Zónula de Zinn', en: 'Suspensory ligament of lens', group: 'medios', color: '#d9e9ef', desc: 'Fibras de fibrilina que van del cuerpo ciliar al ecuador del cristalino.', func: 'En visión lejana está tensa (con el músculo ciliar relajado) y aplana el cristalino. Al contraerse el ciliar, la zónula se relaja y el cristalino se abomba.', clinic: 'Síndrome de Marfan (fibrilina-1): zónula débil que produce subluxación del cristalino hacia arriba y afuera.' },
    aqueous: { name: 'Humor acuoso', en: 'Aqueous humour', group: 'medios', color: '#bfe3f2', opacity: 0.22, desc: 'Líquido claro de las cámaras anterior y posterior.', func: 'Nutre la córnea y el cristalino y mantiene la presión intraocular (normal 10–21 mmHg). Recorrido: procesos ciliares → cámara posterior → pupila → cámara anterior → ángulo iridocorneal → malla trabecular → canal de Schlemm → venas epiesclerales.', clinic: 'Si aumenta la resistencia de salida, sube la presión intraocular y aparece el glaucoma (neuropatía óptica).' },
    vitreous: { name: 'Humor vítreo', en: 'Vitreous humour', group: 'medios', color: '#cfe8f3', opacity: 0.16, desc: 'Gel transparente (99 % agua, colágeno y ácido hialurónico) que llena la cámara vítrea (~4 mL).', clinic: 'Desprendimiento vítreo posterior con la edad (moscas volantes). La hemorragia vítrea en la retinopatía diabética proliferativa produce pérdida brusca de visión.' },
    trabecular: { name: 'Malla trabecular', en: 'Trabecular meshwork', group: 'drenaje', color: '#7fa8e0', desc: 'Tejido esponjoso en el ángulo iridocorneal, por delante del canal de Schlemm.', func: 'Es la vía principal (~85 %) de salida del humor acuoso (vía convencional). El ~15 % restante sale por la vía uveoescleral.', clinic: 'Glaucoma de ángulo abierto: aumenta la resistencia trabecular. Es crónico y asintomático, con pérdida periférica del campo visual. Los análogos de prostaglandinas (latanoprost) aumentan el drenaje uveoescleral.' },
    schlemm: { name: 'Canal de Schlemm', en: "Schlemm's canal", group: 'drenaje', color: '#3f6fc9', desc: 'Conducto circular en el limbo que recoge el humor acuoso y lo drena a las venas acuosas y epiesclerales.', clinic: 'En el glaucoma agudo de ángulo cerrado el iris bloquea el acceso al ángulo: ojo rojo muy doloroso, midriasis media arreactiva, córnea edematosa, halos, náuseas. Es una urgencia (iridotomía láser).' },
    m_sr: { name: 'Recto superior', en: 'Superior rectus', group: 'musculos', color: '#b0473f', desc: 'Nace del anillo de Zinn y se inserta por encima de la córnea.', func: 'Elevación (máxima en abducción), además de intorsión y aducción. Inervación: III par (rama superior).' },
    m_ir: { name: 'Recto inferior', en: 'Inferior rectus', group: 'musculos', color: '#a8433a', desc: 'Se inserta por debajo de la córnea.', func: 'Depresión (máxima en abducción), además de extorsión y aducción. Inervación: III par (rama inferior).', clinic: 'Puede quedar atrapado en una fractura del piso orbitario (blow-out): limitación de la mirada hacia arriba, diplopía y enoftalmos.' },
    m_mr: { name: 'Recto medial', en: 'Medial rectus', group: 'musculos', color: '#b84d44', desc: 'El más grueso de los rectos. Se inserta en el lado nasal.', func: 'Aducción pura. Inervación: III par (rama inferior).', clinic: 'Oftalmoplejía internuclear (fascículo longitudinal medial, típica de la esclerosis múltiple): el ojo no aduce al mirar al lado contrario y el otro ojo hace nistagmo.' },
    m_lr: { name: 'Recto lateral', en: 'Lateral rectus', group: 'musculos', color: '#a53f37', desc: 'Se inserta en el lado temporal.', func: 'Abducción pura. Inervación: VI par (abducens).', clinic: 'El VI par tiene el trayecto intracraneal más largo. Su parálisis es un signo falso localizador de hipertensión intracraneal.' },
    m_so: { name: 'Oblicuo superior', en: 'Superior oblique', group: 'musculos', color: '#c05a4e', desc: 'Su tendón pasa por la tróclea, en el ángulo superomedial de la órbita, y se inserta por detrás del ecuador.', func: 'Intorsión, depresión (máxima en aducción) y abducción. Inervación: IV par (troclear), el único par que sale por la cara dorsal del tronco.', clinic: 'Su parálisis (frecuentemente traumática) produce diplopía vertical al leer o bajar escaleras, con inclinación compensatoria de la cabeza hacia el lado sano.' },
    trochlea: { name: 'Tróclea del oblicuo superior', en: 'Trochlea', group: 'musculos', color: '#e6d6b0', desc: 'Polea fibrocartilaginosa en la fosa troclear del hueso frontal, que cambia la dirección del tendón del oblicuo superior.' },
    m_io: { name: 'Oblicuo inferior', en: 'Inferior oblique', group: 'musculos', color: '#b5534a', desc: 'Único músculo extraocular que no nace del vértice orbitario: nace del piso anteromedial de la órbita.', func: 'Extorsión, elevación (máxima en aducción) y abducción. Inervación: III par (rama inferior).' },
    m_lps: { name: 'Elevador del párpado superior', en: 'Levator palpebrae superioris', group: 'musculos', color: '#9a4038', desc: 'Va del vértice orbitario al párpado superior. Su porción lisa (músculo de Müller) es simpática.', func: 'Eleva el párpado. Inervación: III par (porción estriada) y simpático (músculo tarsal de Müller).', clinic: 'Ptosis completa en la parálisis del III par y ptosis leve en el síndrome de Horner (pérdida del Müller). Miastenia gravis: ptosis fluctuante que empeora con la fatiga.' },
    optic_nerve: { name: 'Nervio óptico (II)', en: 'Optic nerve', group: 'nervio', color: '#f2d06b', desc: 'Formado por ~1,2 millones de axones de células ganglionares. Es un tracto del SNC (mielina de oligodendrocitos, envuelto por meninges). Va del disco óptico al quiasma por el conducto óptico.', func: 'Lleva la información visual al cuerpo geniculado lateral (y al pretectum para el reflejo pupilar).', clinic: 'Neuritis óptica (esclerosis múltiple): pérdida visual dolorosa con defecto pupilar aferente. Neuropatía óptica isquémica, glaucoma. Las lesiones del nervio producen pérdida visual monocular.' },
  },

  tours: [
    {
      name: 'Camino de la luz',
      steps: [
        { title: '1. Córnea', parts: ['cornea', 'csj'], text: 'La luz entra por la córnea, que aporta ~43 D: la mayor parte del poder refractivo, por la diferencia de índice con el aire.' },
        { title: '2. Cámara anterior y humor acuoso', parts: ['aqueous', 'iris', 'pupil'], text: 'El iris regula la cantidad de luz con la pupila: miosis por el parasimpático (III par) y midriasis por el simpático.' },
        { title: '3. Cristalino y acomodación', parts: ['lens', 'zonule', 'ciliary_muscle', 'ciliary_body'], text: 'El cristalino ajusta el enfoque: al contraerse el músculo ciliar se relaja la zónula y el cristalino se abomba. Pulsa ▶ Acomodación.' },
        { title: '4. Humor vítreo', parts: ['vitreous'], text: 'Gel transparente que mantiene la forma del globo y deja pasar la luz hasta la retina.' },
        { title: '5. Retina, mácula y fóvea', parts: ['retina', 'macula', 'fovea'], text: 'Los conos de la fóvea dan la visión más nítida y del color. La luz hiperpolariza los fotorreceptores (cascada rodopsina → transducina → PDE → ↓GMPc).' },
        { title: '6. Disco óptico y nervio óptico', parts: ['optic_disc', 'optic_nerve'], text: 'Los axones ganglionares salen por la papila (mancha ciega) y forman el nervio óptico hacia el quiasma, el geniculado lateral y V1.' },
      ],
    },
    {
      name: 'Humor acuoso y glaucoma',
      steps: [
        { title: '1. Producción', parts: ['ciliary_proc', 'ciliary_body'], text: 'Los procesos ciliares secretan ~2–3 µL/min hacia la cámara posterior. La acetazolamida y el timolol reducen esa producción.' },
        { title: '2. Paso por la pupila', parts: ['aqueous', 'iris', 'lens'], text: 'El humor acuoso pasa entre el iris y el cristalino hacia la cámara anterior. Si el iris se adhiere al cristalino (bloqueo pupilar), el iris se abomba y cierra el ángulo.' },
        { title: '3. Ángulo y malla trabecular', parts: ['trabecular', 'csj'], text: 'Por la vía convencional sale el ~85 %. En el glaucoma de ángulo abierto aumenta la resistencia aquí.' },
        { title: '4. Canal de Schlemm', parts: ['schlemm'], text: 'Recoge el humor acuoso y lo envía a las venas epiesclerales. La presión intraocular normal es de 10–21 mmHg.' },
        { title: '5. Daño en el nervio óptico', parts: ['optic_disc', 'optic_nerve'], text: 'La presión elevada daña los axones en la lámina cribosa: aumenta la excavación papilar y se pierde el campo visual periférico (visión "en túnel").' },
      ],
    },
  ],

  cutPresets: [
    { name: 'Horizontal por el eje óptico', normal: [0, 1, 0], at: 'lens' },
    { name: 'Sagital por el eje óptico', normal: [1, 0, 0], at: 'lens' },
    { name: 'Coronal por el cristalino', normal: [0, 0, 1], at: 'lens' },
    { name: 'Coronal por el ecuador del globo', normal: [0, 0, 1], at: 'sclera' },
  ],

  pois: [
    { id: 'limbo', name: 'Limbo y ángulo iridocorneal', at: 'trabecular', desc: 'Unión córnea-esclera, con la malla trabecular y el canal de Schlemm en profundidad.', clinic: 'La gonioscopía evalúa si el ángulo está abierto o cerrado. Es clave para clasificar el glaucoma.' },
    { id: 'fovea', name: 'Fóvea', at: 'fovea', desc: 'Centro de la mácula: máxima agudeza visual.' },
    { id: 'papila', name: 'Papila (mancha ciega)', at: 'optic_disc', desc: 'Sin fotorreceptores, por eso corresponde a la mancha ciega, ~15° temporal al punto de fijación en el campo visual.', clinic: 'En el fondo de ojo se evalúan sus bordes (papiledema), su color (atrofia) y la excavación (glaucoma).' },
    { id: 'ora', name: 'Ora serrata', at: { key: 'ora', dir: [0, 1, 0.4] }, desc: 'Límite anterior de la retina neurosensorial.' },
    { id: 'troclea', name: 'Tróclea', at: 'trochlea', desc: 'Polea del oblicuo superior en el ángulo superomedial de la órbita.' },
    { id: 'zinn', name: 'Anillo de Zinn (vértice orbitario)', at: { key: 'm_lr', dir: [-0.3, 0, -1] }, desc: 'Anillo tendinoso común del que nacen los 4 rectos. Dentro pasan el II par, el III, el VI y el nasociliar.', clinic: 'Síndrome del vértice orbitario: oftalmoplejía, pérdida visual y alteración sensitiva del V1 (tumores, infecciones como la mucormicosis).' },
  ],

  clinicalQs: [
    Q('Paciente con el ojo izquierdo "abajo y afuera", ptosis completa y midriasis arreactiva. ¿Qué par craneal está afectado?', ['III (motor ocular común)', 'IV (troclear)', 'VI (abducens)', 'VII (facial)'], 0, 'La midriasis sugiere compresión (las fibras pupilares van en la periferia del nervio): hay que descartar un aneurisma de la arteria comunicante posterior. Quedan actuando el recto lateral (VI) y el oblicuo superior (IV).', ['m_sr', 'm_ir', 'm_mr', 'm_io', 'm_lps', 'iris']),
      Q('Un paciente no puede abducir el ojo derecho y tiene diplopía horizontal al mirar a la derecha. ¿Qué músculo y qué nervio fallan?', ['Recto lateral, VI par', 'Recto medial, III par', 'Oblicuo superior, IV par', 'Recto superior, III par'], 0, 'El VI par tiene un trayecto intracraneal largo. Su parálisis puede ser un signo falso localizador de hipertensión intracraneal.', ['m_lr']),
      Q('Diplopía vertical al bajar escaleras, con inclinación de la cabeza hacia el lado sano. ¿Qué músculo está parético?', ['Oblicuo superior', 'Oblicuo inferior', 'Recto inferior', 'Recto superior'], 0, 'El oblicuo superior (IV par) deprime el ojo en aducción, que es la posición para leer y bajar escaleras.', ['m_so', 'trochlea']),
      Q('Ojo rojo muy doloroso, con visión borrosa, halos alrededor de las luces, pupila en midriasis media arreactiva y náuseas. ¿Diagnóstico?', ['Glaucoma agudo de ángulo cerrado', 'Conjuntivitis viral', 'Hemorragia subconjuntival', 'Desprendimiento de retina'], 0, 'El iris bloquea el ángulo iridocorneal y la presión intraocular sube bruscamente (a menudo > 40 mmHg). Es una urgencia: se trata con fármacos hipotensores e iridotomía láser.', ['trabecular', 'schlemm', 'iris']),
      Q('Mujer de 46 años que necesita alejar el texto para leer. ¿Qué cambio fisiológico lo explica?', ['Pérdida de elasticidad del cristalino (presbicia)', 'Aumento de la curvatura corneal', 'Parálisis del músculo ciliar', 'Atrofia de la fóvea'], 0, 'Con la edad el cristalino se endurece y se pierde amplitud de acomodación. Se corrige con lentes positivos para cerca.', ['lens', 'zonule', 'ciliary_muscle']),
      Q('En el reflejo fotomotor, ¿cuál es la vía aferente y cuál la eferente?', ['Aferente II par, eferente III par', 'Aferente III par, eferente II par', 'Aferente V par, eferente VII par', 'Aferente II par, eferente simpático'], 0, 'II → núcleo pretectal → Edinger-Westphal bilateral → III → ganglio ciliar → esfínter de la pupila. La vía V → VII corresponde al reflejo corneal.', ['optic_nerve', 'iris', 'pupil']),
      Q('Paciente con fotopsias, moscas volantes y una "cortina" que avanza en el campo visual. ¿Diagnóstico más probable?', ['Desprendimiento de retina', 'Catarata', 'Presbicia', 'Conjuntivitis'], 0, 'La retina neurosensorial se separa del epitelio pigmentario. Es una urgencia oftalmológica.', ['retina', 'ora', 'vitreous']),
      Q('En el fondo de ojo de un paciente con cefalea matinal y vómitos se ven papilas con bordes borrosos y sin pulso venoso. ¿Qué sugiere?', ['Papiledema por hipertensión intracraneal', 'Glaucoma crónico', 'DMAE', 'Catarata'], 0, 'El aumento de la presión del LCR se transmite por la vaina del nervio óptico y produce edema de la papila.', ['optic_disc', 'optic_nerve']),
  ],

  physiology: [
    {
      title: 'Óptica y errores de refracción',
      open: true,
      html: `
<ul>
<li>Poder refractivo total ≈ 60 D: córnea ~43 D (fija) y cristalino ~20 D (variable).</li>
<li><b>Miopía:</b> la imagen se forma por delante de la retina (ojo largo). Se corrige con lentes divergentes (−).</li>
<li><b>Hipermetropía:</b> la imagen se forma por detrás (ojo corto). Se corrige con lentes convergentes (+).</li>
<li><b>Astigmatismo:</b> la curvatura corneal es distinta en cada meridiano. Se corrige con lentes cilíndricos.</li>
<li><b>Presbicia:</b> pérdida de acomodación con la edad. Se corrige con lentes + para cerca.</li>
</ul>
<p>Pulsa <b>▶ Acomodación</b> para ver el cristalino abombarse y la pupila contraerse. El gráfico muestra la potencia del cristalino en dioptrías.</p>`,
    },
    {
      title: 'Fototransducción',
      html: `
<ol>
<li>En oscuridad, el GMPc alto mantiene abiertos los canales de Na⁺/Ca²⁺ (corriente oscura): el fotorreceptor está despolarizado (~−40 mV) y libera glutamato.</li>
<li>Un fotón cambia el 11-cis-retinal a todo-trans, lo que activa la rodopsina.</li>
<li>Se activan la transducina (Gt) y la fosfodiesterasa (PDE6). Baja el GMPc y se cierran los canales.</li>
<li>El fotorreceptor se hiperpolariza (~−70 mV) y libera menos glutamato. Las bipolares ON se despolarizan y las OFF se hiperpolarizan.</li>
</ol>
<p class="clinic">El déficit de vitamina A produce ceguera nocturna, porque falta retinal para regenerar la rodopsina. La retinitis pigmentosa afecta primero a los bastones: ceguera nocturna y visión en túnel.</p>`,
    },
    {
      title: 'Movimientos oculares (prueba en H)',
      html: `
<p>Activa <b>👀 Movimientos</b> y elige una posición de la mirada: el globo rota y se resalta el músculo que se explora en esa posición.</p>
<table>
<tr><th>Mirada</th><th>Músculo explorado</th><th>Nervio</th></tr>
<tr><td>Afuera</td><td>Recto lateral</td><td>VI</td></tr>
<tr><td>Adentro</td><td>Recto medial</td><td>III</td></tr>
<tr><td>Arriba y afuera</td><td>Recto superior</td><td>III</td></tr>
<tr><td>Arriba y adentro</td><td>Oblicuo inferior</td><td>III</td></tr>
<tr><td>Abajo y afuera</td><td>Recto inferior</td><td>III</td></tr>
<tr><td>Abajo y adentro</td><td>Oblicuo superior</td><td>IV</td></tr>
</table>
<p class="small muted">En la exploración clínica, cada posición aísla la acción vertical de un músculo. Las acciones en la posición primaria son más complejas (los oblicuos también producen torsión).</p>`,
    },
    {
      title: 'Vía visual y campos',
      html: `
<ul>
<li>Retina → nervio óptico → <b>quiasma</b> (cruzan las fibras nasales) → tracto óptico → <b>cuerpo geniculado lateral</b> → radiaciones ópticas (asa de Meyer temporal) → <b>V1</b> (cisura calcarina).</li>
<li>Lesión del nervio: ceguera monocular. Quiasma: hemianopsia bitemporal. Tracto o radiación completa: hemianopsia homónima contralateral. Asa de Meyer: cuadrantanopsia superior. V1 (arteria cerebral posterior): hemianopsia homónima con respeto macular.</li>
</ul>
<p>Puedes ver el quiasma, el tracto y la radiación óptica en la pestaña <b>Encéfalo</b>.</p>`,
    },
  ],
};

// Encéfalo — Allen Human Brain Reference (vía Human Reference Atlas, CC BY 4.0).
// 142 estructuras (hemisferios izquierdo y derecho fusionados en una sola parte cada una).

// [nombre en español, grupo, oculto por defecto]
const N = {
  // ---- Lóbulo frontal ----
  precentral_gyrus: ['Giro precentral (corteza motora primaria, M1)', 'frontal'],
  superior_frontal_gyrus: ['Giro frontal superior', 'frontal'],
  middle_frontal_gyrus: ['Giro frontal medio', 'frontal'],
  inferior_frontal_gyrus_opercular_part: ['Giro frontal inferior, porción opercular (Broca, área 44)', 'frontal'],
  inferior_frontal_gyrus_triangular_part: ['Giro frontal inferior, porción triangular (Broca, área 45)', 'frontal'],
  frontal_operculum: ['Opérculo frontal', 'frontal'],
  gyrus_rectus_straight_gyrus: ['Giro recto', 'frontal'],
  medial_orbital_gyrus: ['Giro orbitario medial', 'frontal'],
  anterior_intermediate_orbital_gyrus: ['Giro orbitario intermedio anterior', 'frontal'],
  posterior_intermediate_orbital_gyrus: ['Giro orbitario intermedio posterior', 'frontal'],
  lateral_orbital_gyrus: ['Giro orbitario lateral', 'frontal'],
  paracentral_lobule_rostral_part: ['Lobulillo paracentral, parte rostral (motor del miembro inferior)', 'frontal'],
  frontal_pole: ['Polo frontal', 'frontal'],
  frontomarginal_gyrus: ['Giro frontomarginal', 'frontal'],
  rostral_gyrus: ['Giro rostral', 'frontal'],
  paracingulate_gyrus: ['Giro paracingulado', 'frontal'],
  // ---- Lóbulo parietal ----
  postcentral_gyrus: ['Giro poscentral (corteza somatosensitiva primaria, S1)', 'parietal'],
  supraparietal_lobule: ['Lobulillo parietal superior', 'parietal'],
  supramarginal_gyrus: ['Giro supramarginal (área 40)', 'parietal'],
  angular_gyrus: ['Giro angular (área 39)', 'parietal'],
  precuneus: ['Precúneo', 'parietal'],
  paracentral_lobule_caudal_part: ['Lobulillo paracentral, parte caudal (sensitivo del miembro inferior)', 'parietal'],
  parietal_operculum: ['Opérculo parietal (S2)', 'parietal'],
  // ---- Lóbulo temporal ----
  superior_temporal_gyrus: ['Giro temporal superior', 'temporal'],
  middle_temporal_gyrus: ['Giro temporal medio', 'temporal'],
  inferior_temporal_gyrus: ['Giro temporal inferior', 'temporal'],
  transverse_temporal_gyrus_Heschls_gyrus: ['Giro temporal transverso de Heschl (corteza auditiva primaria, A1)', 'temporal'],
  planum_temporale: ['Plano temporal (área de Wernicke)', 'temporal'],
  planum_polare: ['Plano polar', 'temporal'],
  temporal_pole: ['Polo temporal', 'temporal'],
  occipitotemporal_fusiform_gyrus_temporal_part: ['Giro fusiforme, parte temporal', 'temporal'],
  perirhinal_gyrus_rostral_part_of_FuGt: ['Corteza perirrinal', 'temporal'],
  temporal_agranular_insular_cortex_area_Tl: ['Corteza insular agranular temporal', 'insula'],
  // ---- Lóbulo occipital ----
  occipital_pole: ['Polo occipital', 'occipital'],
  cuneus: ['Cúneo (corteza visual, labio superior de la cisura calcarina)', 'occipital'],
  lingual_gyrus_medial_occipitotemporal_gyrus: ['Giro lingual (corteza visual, labio inferior de la calcarina)', 'occipital'],
  lateral_occipitotemporal_fusiform_gyrus_occipital_part: ['Giro fusiforme, parte occipital', 'occipital'],
  inferior_occipital_gyrus: ['Giro occipital inferior', 'occipital'],
  superior_occipital_gyrus: ['Giro occipital superior', 'occipital'],
  // ---- Ínsula ----
  long_insular_gyri: ['Giros insulares largos', 'insula'],
  short_insular_gyri: ['Giros insulares cortos', 'insula'],
  limen_insula: ['Limen de la ínsula', 'insula'],
  frontal_agranular_insular_cortex_area_Fl: ['Corteza insular agranular frontal', 'insula'],
  // ---- Límbico ----
  cingulate_gyrus_rostral_anterior_part: ['Giro cingulado anterior', 'limbico'],
  cingulate_gyrus_caudal_posterior_part: ['Giro cingulado posterior', 'limbico'],
  ingulo_parahippocampal_isthmus: ['Istmo del cíngulo', 'limbico'],
  subcallosal_gyrus_parolfactory_gyrus: ['Giro subcalloso (paraolfatorio)', 'limbico'],
  anterior_parahippocampal_gyrus: ['Giro parahipocampal anterior (corteza entorrinal)', 'limbico'],
  posterior_parahippocampal_gyrus: ['Giro parahipocampal posterior', 'limbico'],
  gyrus_ambiens: ['Giro ambiens', 'limbico'],
  head_of_hippocampus: ['Hipocampo — cabeza', 'limbico'],
  body_of_hippocampus: ['Hipocampo — cuerpo', 'limbico'],
  tail_of_hippocampus: ['Hipocampo — cola', 'limbico'],
  septal_nuclei: ['Núcleos septales', 'limbico'],
  bed_nucleus_of_stria_terminalis: ['Núcleo del lecho de la estría terminal', 'limbico'],
  // ---- Amígdala ----
  amygdaloid_complex: ['Complejo amigdalino (amígdala)', 'amigdala'],
  anterior_amygdaloid_area: ['Área amigdalina anterior', 'amigdala', true],
  central_nuclear_group: ['Núcleo central de la amígdala', 'amigdala', true],
  lateral_nucleus: ['Núcleo lateral de la amígdala', 'amigdala', true],
  basolateral_nucleus_basal_nucleus: ['Núcleo basolateral de la amígdala', 'amigdala', true],
  basomedial_nucleus_accessory_basal_nucleus: ['Núcleo basomedial de la amígdala', 'amigdala', true],
  anterior_cortical_nucleus: ['Núcleo cortical anterior de la amígdala', 'amigdala', true],
  posterior_cortical_nucleus: ['Núcleo cortical posterior de la amígdala', 'amigdala', true],
  medial_nucleus: ['Núcleo medial de la amígdala', 'amigdala', true],
  amygdalohippocampal_area: ['Área amigdalohipocampal', 'amigdala', true],
  // ---- Ganglios basales ----
  head_of_caudate: ['Núcleo caudado — cabeza', 'basales'],
  body_of_caudate: ['Núcleo caudado — cuerpo', 'basales'],
  tail_of_caudate: ['Núcleo caudado — cola', 'basales'],
  putamen: ['Putamen', 'basales'],
  posteroventral_putamen: ['Putamen posteroventral', 'basales', true],
  nucleus_accumbens: ['Núcleo accumbens', 'basales'],
  external_segment_of_globus_pallidus: ['Globo pálido externo (GPe)', 'basales'],
  internal_segment_of_globus_pallidus: ['Globo pálido interno (GPi)', 'basales'],
  claustrum: ['Claustro', 'basales'],
  basal_forebrain: ['Prosencéfalo basal (núcleo basal de Meynert)', 'basales'],
  subthalamic_nucleus: ['Núcleo subtalámico', 'basales'],
  // ---- Tálamo ----
  thalamus: ['Tálamo', 'talamo'],
  anterior_nuclear_complex_of_thalamus: ['Núcleos anteriores del tálamo', 'talamo', true],
  lateral_dorsal_nucleus_of_thalamus: ['Núcleo lateral dorsal del tálamo', 'talamo', true],
  mediodorsal_nucleus_of_thalamus: ['Núcleo mediodorsal del tálamo', 'talamo', true],
  reuniens_nucleus_medioventral_nucleus_of_thalamus: ['Núcleo reuniens', 'talamo', true],
  lateral_posterior_nucleus_of_thalamus: ['Núcleo lateral posterior del tálamo', 'talamo', true],
  pulvinar_of_thalamus: ['Pulvinar', 'talamo', true],
  ventral_anterior_nucleus_of_thalamus: ['Núcleo ventral anterior (VA)', 'talamo', true],
  ventral_lateral_nucleus_of_thalamus: ['Núcleo ventral lateral (VL)', 'talamo', true],
  ventral_posterior_lateral_nucleus: ['Núcleo ventral posterolateral (VPL)', 'talamo', true],
  ventral_posterior_medial_nucleus: ['Núcleo ventral posteromedial (VPM)', 'talamo', true],
  dorsal_lateral_geniculate_nucleus: ['Cuerpo geniculado lateral (NGL)', 'talamo', true],
  medial_geniculate_nuclei: ['Cuerpo geniculado medial (NGM)', 'talamo', true],
  centromedian_nucleus_of_thalamus: ['Núcleo centromediano', 'talamo', true],
  parafascicular_nucleus_of_thalamus: ['Núcleo parafascicular', 'talamo', true],
  midline_nuclear_complex: ['Núcleos de la línea media del tálamo', 'talamo', true],
  // ---- Hipotálamo / epitálamo ----
  hypothalamus: ['Hipotálamo', 'hipotalamo'],
  supraoptic_region_of_HTH: ['Hipotálamo — región supraóptica', 'hipotalamo'],
  preoptic_region_of_HTH: ['Hipotálamo — región preóptica', 'hipotalamo'],
  tuberal_region_of_HTH: ['Hipotálamo — región tuberal', 'hipotalamo'],
  mammillary_region_of_HTH: ['Hipotálamo — región mamilar (cuerpos mamilares)', 'hipotalamo'],
  zona_incerta: ['Zona incierta', 'hipotalamo'],
  habenular_nuclei: ['Núcleos habenulares (epitálamo)', 'hipotalamo'],
  pineal_body: ['Glándula pineal', 'hipotalamo'],
  // ---- Tronco encefálico ----
  midbrain_tegmentum: ['Tegmento del mesencéfalo', 'tronco'],
  cerebral_peduncle_crus_cerebri: ['Pedúnculo cerebral (pie)', 'tronco'],
  substantia_nigra: ['Sustancia negra', 'tronco'],
  red_nucleus: ['Núcleo rojo', 'tronco'],
  superior_colliculus: ['Colículo superior', 'tronco'],
  inferior_colliculus: ['Colículo inferior', 'tronco'],
  pretectal_region: ['Región pretectal', 'tronco'],
  basilar_part_of_pons: ['Protuberancia (puente), porción basilar', 'tronco'],
  pontine_tegmentum: ['Tegmento pontino', 'tronco'],
  pyramidal_part_of_medulla_oblongata: ['Pirámide bulbar', 'tronco'],
  tegmentum_of_medulla_oblongata: ['Tegmento del bulbo raquídeo', 'tronco'],
  inferior_olive: ['Oliva inferior', 'tronco'],
  // ---- Cerebelo ----
  cerebellar_vermis: ['Vermis cerebeloso', 'cerebelo'],
  paravermis_of_cerebellum: ['Paravermis (zona intermedia)', 'cerebelo'],
  lateral_hemisphere_of_cerebellum: ['Hemisferio cerebeloso lateral', 'cerebelo'],
  cerebellar_deep_nuclei: ['Núcleos profundos del cerebelo', 'cerebelo'],
  superior_cerebellar_peduncle_brachium_conjunctivum: ['Pedúnculo cerebeloso superior', 'cerebelo'],
  middle_cerebellar_peduncle: ['Pedúnculo cerebeloso medio', 'cerebelo'],
  inferior_cerebellar_peduncle: ['Pedúnculo cerebeloso inferior', 'cerebelo'],
  // ---- Sustancia blanca ----
  white_matter_of_forebrain: ['Sustancia blanca del prosencéfalo', 'blanca', true],
  white_matter_of_hindbrain: ['Sustancia blanca del rombencéfalo', 'blanca', true],
  corpus_callosum: ['Cuerpo calloso', 'blanca'],
  anterior_commissure: ['Comisura anterior', 'blanca'],
  fornix: ['Fórnix', 'blanca'],
  mammillothalamic_tract: ['Tracto mamilotalámico', 'blanca'],
  optic_tract: ['Tracto óptico', 'blanca'],
  optic_radiation: ['Radiación óptica', 'blanca'],
  optic_chiasm: ['Quiasma óptico', 'blanca'],
  // ---- Ventrículos ----
  anterior_horn_of_lateral_ventricle: ['Ventrículo lateral — asta anterior', 'ventriculos'],
  body_of_lateral_ventricle: ['Ventrículo lateral — cuerpo', 'ventriculos'],
  atrium_of_lateral_ventricle: ['Ventrículo lateral — atrio', 'ventriculos'],
  posterior_horn_of_lateral_ventricle: ['Ventrículo lateral — asta posterior', 'ventriculos'],
  inferior_horn_of_lateral_ventricle: ['Ventrículo lateral — asta inferior (temporal)', 'ventriculos'],
  third_ventricle: ['Tercer ventrículo', 'ventriculos'],
  cerebral_aqueduct: ['Acueducto cerebral (de Silvio)', 'ventriculos'],
  fourth_ventricle: ['Cuarto ventrículo', 'ventriculos'],
  central_canal_of_medulla_oblongata: ['Conducto central del bulbo', 'ventriculos'],
  // ---- Olfatorio ----
  olfactory_bulb: ['Bulbo olfatorio', 'olfatorio'],
  anterior_olfactory_nucleus: ['Núcleo olfatorio anterior', 'olfatorio'],
  olfactory_tract: ['Tracto olfatorio', 'olfatorio'],
  lateral_olfactory_gyrus: ['Giro olfatorio lateral', 'olfatorio'],
  piriform_region: ['Corteza piriforme (olfatoria primaria)', 'olfatorio'],
};

// Descripciones detalladas de las estructuras más importantes
const D = {
  precentral_gyrus: {
    desc: 'Está por delante del surco central (de Rolando). Contiene las neuronas piramidales gigantes de Betz (capa V), origen de buena parte del tracto corticoespinal.',
    func: 'Ejecuta el movimiento voluntario con organización somatotópica (homúnculo motor): la cara y la mano en la convexidad lateral, el miembro inferior en la cara medial (lobulillo paracentral).',
    clinic: 'Una lesión aquí da paresia contralateral con signos de motoneurona superior (espasticidad, hiperreflexia, Babinski). Un ACV de la arteria cerebral media afecta sobre todo la cara y el brazo; uno de la cerebral anterior, la pierna.',
  },
  postcentral_gyrus: {
    desc: 'Está por detrás del surco central (áreas 3, 1 y 2 de Brodmann).',
    func: 'Recibe la sensibilidad somática contralateral (tacto, propiocepción, dolor y temperatura) desde el tálamo: VPL para el cuerpo y VPM para la cara. Tiene organización somatotópica (homúnculo sensitivo).',
    clinic: 'Su lesión produce hipoestesia contralateral, astereognosia y pérdida de la discriminación entre dos puntos.',
  },
  inferior_frontal_gyrus_opercular_part: {
    desc: 'Junto con la porción triangular forma el área de Broca, en el hemisferio dominante (izquierdo en ~95 % de los diestros).',
    func: 'Planifica la producción del lenguaje (articulación, gramática y fluencia).',
    clinic: 'Afasia de Broca (motora): habla no fluente y "telegráfica", con comprensión conservada. El paciente es consciente de su déficit. A menudo se acompaña de hemiparesia derecha (arteria cerebral media, división superior).',
  },
  inferior_frontal_gyrus_triangular_part: { desc: 'Área 45 de Brodmann, parte anterior del área de Broca.', func: 'Procesamiento semántico y sintáctico del lenguaje expresivo.' },
  planum_temporale: {
    desc: 'Superficie superior del giro temporal superior, por detrás del giro de Heschl. Es mayor en el hemisferio izquierdo. Con la parte posterior del giro temporal superior forma el área de Wernicke (área 22).',
    func: 'Comprensión del lenguaje hablado y escrito.',
    clinic: 'Afasia de Wernicke (sensitiva): habla fluente pero sin sentido (parafasias, neologismos) y mala comprensión. El paciente suele no ser consciente del déficit (arteria cerebral media, división inferior). La afasia de conducción (repetición alterada) se debe a una lesión del fascículo arqueado.',
  },
  transverse_temporal_gyrus_Heschls_gyrus: { desc: 'Áreas 41 y 42 de Brodmann, en el fondo de la cisura lateral.', func: 'Corteza auditiva primaria con organización tonotópica. Recibe del cuerpo geniculado medial, y la representación es bilateral (cada oído llega a ambos hemisferios).', clinic: 'Una lesión unilateral casi no produce sordera porque la vía auditiva es bilateral.' },
  superior_temporal_gyrus: { desc: 'Giro más alto del lóbulo temporal, bajo la cisura lateral (de Silvio).', func: 'Audición (corteza auditiva primaria y asociativa) y, en el hemisferio dominante, comprensión del lenguaje (Wernicke, en su parte posterior).' },
  angular_gyrus: { desc: 'Rodea el extremo del surco temporal superior (área 39).', func: 'Integra lectura, escritura y cálculo (une lo visual con el lenguaje).', clinic: 'Síndrome de Gerstmann (hemisferio dominante): agrafia, acalculia, agnosia digital y confusión derecha-izquierda.' },
  supramarginal_gyrus: { desc: 'Área 40, rodea el extremo de la cisura lateral.', func: 'Procesamiento fonológico y praxias.', clinic: 'Su lesión puede dar apraxia ideomotora y afasia de conducción (el fascículo arqueado pasa por debajo).' },
  supraparietal_lobule: { func: 'Integración visuoespacial y esquema corporal.', clinic: 'Una lesión parietal no dominante (derecha) produce heminegligencia izquierda: el paciente ignora la mitad izquierda del espacio y de su cuerpo.' },
  cuneus: { desc: 'Cara medial del lóbulo occipital, sobre la cisura calcarina.', func: 'Corteza visual primaria (V1, área 17, estriada). El labio superior representa el campo visual inferior contralateral.', clinic: 'Una lesión aquí produce cuadrantanopsia inferior homónima contralateral. Un ACV de la arteria cerebral posterior da hemianopsia homónima con respeto macular.' },
  lingual_gyrus_medial_occipitotemporal_gyrus: { func: 'Labio inferior de la calcarina: representa el campo visual superior contralateral. También participa en el reconocimiento de colores y palabras.', clinic: 'Su lesión da cuadrantanopsia superior homónima contralateral ("pie in the sky", como el asa de Meyer temporal).' },
  occipitotemporal_fusiform_gyrus_temporal_part: { func: 'Vía visual ventral ("¿qué es?"): reconocimiento de caras (área fusiforme facial) y de palabras escritas.', clinic: 'Una lesión bilateral produce prosopagnosia (no reconocer caras).' },
  cingulate_gyrus_rostral_anterior_part: { desc: 'Rodea por encima la rodilla del cuerpo calloso.', func: 'Componente afectivo del dolor, motivación, detección de errores y control autonómico.', clinic: 'Una lesión bilateral produce mutismo acinético (abulia).' },
  cingulate_gyrus_caudal_posterior_part: { func: 'Forma parte del circuito de Papez y de la red neuronal por defecto. Participa en la memoria episódica y la orientación espacial.' },
  head_of_hippocampus: {
    desc: 'Formación cortical de tres capas (arquicorteza) en el suelo del asta temporal del ventrículo lateral. Incluye el giro dentado y los sectores CA1–CA4.',
    func: 'Consolida la memoria declarativa (episódica y semántica): pasa la memoria de corto a largo plazo y forma mapas espaciales (células de lugar). Su vía de salida es el fórnix.',
    clinic: 'La lesión bilateral produce amnesia anterógrada (caso H.M.). En el Alzheimer es una de las primeras zonas que se atrofian. CA1 (sector de Sommer) es muy sensible a la hipoxia. La esclerosis mesial temporal causa epilepsia del lóbulo temporal.',
  },
  amygdaloid_complex: {
    desc: 'Masa de núcleos en el polo anterior del lóbulo temporal medial, por delante del hipocampo.',
    func: 'Procesa las emociones (sobre todo el miedo), el condicionamiento emocional y la memoria emocional. Proyecta al hipotálamo, de donde salen las respuestas autonómicas y endocrinas del estrés.',
    clinic: 'Síndrome de Klüver-Bucy (lesión bilateral): pérdida del miedo, hiperoralidad, hipersexualidad y agnosia visual. Se asocia a trastornos de ansiedad y TEPT.',
  },
  head_of_caudate: {
    desc: 'Núcleo en forma de "C" que bordea el ventrículo lateral. Su cabeza forma la pared lateral del asta anterior. Con el putamen forma el estriado.',
    func: 'Es la entrada de los ganglios basales: recibe de la corteza (glutamato) y de la sustancia negra compacta (dopamina). Participa en el control motor, el aprendizaje de hábitos y la función ejecutiva.',
    clinic: 'Enfermedad de Huntington (expansión CAG, herencia autosómica dominante): atrofia del caudado con dilatación de las astas frontales, corea, demencia y alteraciones psiquiátricas.',
  },
  putamen: { desc: 'Parte lateral del núcleo lenticular. Con el caudado forma el estriado.', func: 'Es el principal núcleo de entrada del circuito motor de los ganglios basales.', clinic: 'Es la localización más frecuente de la hemorragia hipertensiva (arterias lenticuloestriadas). La pérdida de su aporte dopaminergico produce la enfermedad de Parkinson.' },
  internal_segment_of_globus_pallidus: { func: 'Es la salida principal de los ganglios basales: inhibe (GABA) los núcleos VA y VL del tálamo. La vía directa lo inhibe, liberando el movimiento; la indirecta lo excita, frenándolo.', clinic: 'Es un blanco de la estimulación cerebral profunda en el Parkinson y la distonía.' },
  external_segment_of_globus_pallidus: { func: 'Forma parte de la vía indirecta: inhibe el núcleo subtalámico.' },
  subthalamic_nucleus: { func: 'Excita (glutamato) el GPi como parte de la vía indirecta, lo que frena el movimiento.', clinic: 'Su lesión (ACV lacunar) produce hemibalismo contralateral. Es el blanco más usado en la estimulación cerebral profunda para el Parkinson.' },
  substantia_nigra: { desc: 'Lámina pigmentada (neuromelanina) del mesencéfalo, entre el pie peduncular y el tegmento. Tiene una parte compacta y otra reticulada.', func: 'La parte compacta envía dopamina al estriado (vía nigroestriada): por receptores D1 activa la vía directa y por D2 inhibe la indirecta. La parte reticulada es otra salida inhibitoria, sobre todo para los movimientos oculares.', clinic: 'Enfermedad de Parkinson: pérdida de neuronas dopaminérgicas (con cuerpos de Lewy). Produce bradicinesia, rigidez, temblor de reposo e inestabilidad postural.' },
  nucleus_accumbens: { func: 'Estriado ventral: circuito de recompensa y motivación (recibe dopamina del área tegmental ventral, vía mesolímbica).', clinic: 'Está implicado en las adicciones, y la vía mesolímbica en los síntomas positivos de la esquizofrenia.' },
  basal_forebrain: { func: 'El núcleo basal de Meynert es la principal fuente de acetilcolina para la corteza (atención y memoria).', clinic: 'Degenera en el Alzheimer, lo que justifica el uso de inhibidores de la colinesterasa (donepezilo).' },
  thalamus: {
    desc: 'Masa ovoide de sustancia gris a cada lado del tercer ventrículo, dividida en núcleos por la lámina medular interna.',
    func: 'Es la "puerta" de la corteza: toda la información sensitiva, excepto la olfatoria, hace relevo aquí. También integra circuitos motores (ganglios basales y cerebelo), límbicos y de alerta. Activa los núcleos para ver cada relevo.',
    clinic: 'Síndrome talámico (de Dejerine-Roussy): pérdida sensitiva contralateral seguida de dolor neuropático intenso.',
  },
  ventral_posterior_lateral_nucleus: { func: 'Relevo de la sensibilidad del cuerpo: lemnisco medial (tacto fino y propiocepción) y espinotalámico (dolor y temperatura). Proyecta a S1.' },
  ventral_posterior_medial_nucleus: { func: 'Relevo de la sensibilidad de la cara (trigémino) y del gusto. Proyecta a S1.' },
  dorsal_lateral_geniculate_nucleus: { func: 'Relevo visual: recibe del tracto óptico y proyecta a V1 por la radiación óptica.' },
  medial_geniculate_nuclei: { func: 'Relevo auditivo: recibe del colículo inferior y proyecta a A1 (giro de Heschl).' },
  ventral_lateral_nucleus_of_thalamus: { func: 'Relevo motor: recibe del cerebelo (núcleo dentado) y de los ganglios basales, y proyecta a la corteza motora.', clinic: 'Es un blanco de la estimulación cerebral profunda en el temblor esencial.' },
  ventral_anterior_nucleus_of_thalamus: { func: 'Relevo motor: recibe del globo pálido interno y proyecta a la corteza premotora.' },
  anterior_nuclear_complex_of_thalamus: { func: 'Forma parte del circuito de Papez: recibe del cuerpo mamilar (tracto mamilotalámico) y proyecta al cíngulo.' },
  mediodorsal_nucleus_of_thalamus: { func: 'Conecta con la corteza prefrontal: función ejecutiva, memoria de trabajo y emoción.' },
  pulvinar_of_thalamus: { func: 'Atención visual e integración de información visual con otras modalidades.' },
  hypothalamus: {
    desc: 'Forma el suelo y las paredes inferiores del tercer ventrículo. Por el infundíbulo se conecta con la hipófisis.',
    func: 'Mantiene la homeostasis: temperatura, hambre y saciedad, sed y osmolaridad (ADH), ritmos circadianos (núcleo supraquiasmático), control autonómico y eje hipotálamo-hipofisario (hormonas liberadoras, oxitocina y ADH).',
    clinic: 'Las lesiones producen diabetes insípida central, alteraciones de la temperatura, obesidad (lesión ventromedial) o anorexia (lesión lateral). El craneofaringioma comprime esta región.',
  },
  supraoptic_region_of_HTH: { func: 'Núcleos supraóptico y paraventricular (sintetizan ADH y oxitocina, que viajan a la neurohipófisis) y supraquiasmático (reloj circadiano).' },
  mammillary_region_of_HTH: { func: 'Los cuerpos mamilares reciben el fórnix y proyectan al tálamo anterior (circuito de Papez, memoria).', clinic: 'Síndrome de Wernicke-Korsakoff (déficit de tiamina, alcoholismo): atrofia de los cuerpos mamilares, amnesia y confabulación.' },
  pineal_body: { func: 'Secreta melatonina de noche (regulada por el núcleo supraquiasmático vía simpática).', clinic: 'Un pinealoma comprime el techo del mesencéfalo y produce el síndrome de Parinaud (parálisis de la mirada vertical) e hidrocefalia por compresión del acueducto.' },
  basilar_part_of_pons: { desc: 'Porción anterior de la protuberancia: núcleos pontinos y fibras transversas que forman el pedúnculo cerebeloso medio.', func: 'Por aquí pasan el tracto corticoespinal y el corticobulbar, y hace relevo la vía corticopontocerebelosa.', clinic: 'Síndrome de enclaustramiento (locked-in) por infarto de la arteria basilar: tetraplejía y anartria con conciencia conservada (solo puede mover los ojos en vertical).' },
  pyramidal_part_of_medulla_oblongata: { func: 'Por aquí pasa el tracto corticoespinal. En la decusación piramidal (unión bulbo-médula) cruzan ~85–90 % de las fibras (tracto corticoespinal lateral).', clinic: 'Explica por qué una lesión cortical o capsular produce hemiparesia contralateral, y una lesión medular, ipsilateral.' },
  cerebral_peduncle_crus_cerebri: { func: 'Por él descienden los tractos corticoespinal, corticobulbar y corticopontino.', clinic: 'Síndrome de Weber: parálisis del III par ipsilateral con hemiparesia contralateral.' },
  red_nucleus: { func: 'Recibe del cerebelo y la corteza. Origina el tracto rubroespinal (flexores del miembro superior).', clinic: 'Una lesión por encima del núcleo rojo produce postura de decorticación (flexión de brazos); por debajo, de descerebración (extensión).' },
  superior_colliculus: { func: 'Reflejos visuales y orientación de la mirada y la cabeza hacia los estímulos.' },
  inferior_colliculus: { func: 'Relevo de la vía auditiva hacia el cuerpo geniculado medial.' },
  tegmentum_of_medulla_oblongata: { func: 'Contiene los núcleos de los pares IX–XII, los centros respiratorio y cardiovascular, y la formación reticular.', clinic: 'Síndrome de Wallenberg (bulbar lateral, arteria PICA): disfagia, Horner, vértigo, ataxia ipsilateral y pérdida de dolor y temperatura cruzada (cara ipsilateral, cuerpo contralateral).' },
  cerebellar_vermis: { desc: 'Porción media del cerebelo.', func: 'Espinocerebelo y vestibulocerebelo: postura, equilibrio, tono del tronco y movimientos oculares. Proyecta por el núcleo fastigio.', clinic: 'El alcoholismo crónico produce degeneración del vermis anterior, con ataxia de la marcha (base amplia) y miembros superiores relativamente conservados.' },
  lateral_hemisphere_of_cerebellum: { func: 'Cerebrocerebelo: planificación y coordinación de los movimientos finos de los miembros ipsilaterales. Proyecta por el núcleo dentado → VL del tálamo → corteza motora.', clinic: 'Una lesión hemisférica produce signos ipsilaterales: dismetría, disdiadococinesia, temblor intencional y nistagmo.' },
  cerebellar_deep_nuclei: { func: 'Son toda la salida del cerebelo (núcleos dentado, emboliforme, globoso y fastigio). Las células de Purkinje de la corteza los inhiben (GABA).' },
  corpus_callosum: { desc: 'Gran comisura (~200 millones de axones) con rodilla, tronco y esplenio. Une ambos hemisferios.', func: 'Transfiere información entre hemisferios.', clinic: 'Síndrome de desconexión (callosotomía, cerebro dividido): el paciente no puede nombrar objetos palpados con la mano izquierda. La esclerosis múltiple produce lesiones callosas ("dedos de Dawson").' },
  fornix: { desc: 'Haz arqueado de fibras que sale del hipocampo, pasa bajo el cuerpo calloso y termina en los cuerpos mamilares.', func: 'Es la principal vía de salida del hipocampo (circuito de Papez).', clinic: 'Su lesión bilateral (tumores o cirugía del tercer ventrículo) produce amnesia anterógrada.' },
  optic_chiasm: { desc: 'Cruce de los nervios ópticos por encima de la silla turca.', func: 'Aquí cruzan las fibras de las hemirretinas nasales (campos temporales). Las temporales siguen sin cruzar.', clinic: 'Un adenoma hipofisario lo comprime desde abajo y produce hemianopsia bitemporal.' },
  optic_tract: { func: 'Lleva el campo visual contralateral al cuerpo geniculado lateral, y fibras al pretectum para el reflejo pupilar.', clinic: 'Su lesión produce hemianopsia homónima contralateral.' },
  optic_radiation: { func: 'Va del NGL a V1. El asa de Meyer (temporal) lleva el campo superior y la porción parietal, el inferior.', clinic: 'Una lesión temporal produce cuadrantanopsia superior ("pie in the sky"); una parietal, inferior.' },
  third_ventricle: { desc: 'Cavidad media entre ambos tálamos e hipotálamos. Se comunica con los laterales por los agujeros de Monro y con el cuarto por el acueducto.', clinic: 'Un quiste coloide del tercer ventrículo puede obstruir los agujeros de Monro y causar hidrocefalia aguda y muerte súbita.' },
  cerebral_aqueduct: { func: 'Comunica el tercer y el cuarto ventrículo. Es el punto más estrecho del sistema ventricular.', clinic: 'La estenosis del acueducto es la causa más frecuente de hidrocefalia congénita obstructiva (dilata los ventrículos laterales y el tercero, pero no el cuarto).' },
  fourth_ventricle: { desc: 'Cavidad romboidal entre la protuberancia, el bulbo y el cerebelo.', func: 'Drena el LCR al espacio subaracnoideo por los agujeros de Luschka (laterales) y Magendie (medio).', clinic: 'La malformación de Dandy-Walker (agenesia del vermis y dilatación quística del cuarto ventrículo) produce hidrocefalia.' },
  olfactory_bulb: { func: 'Recibe los axones de las neuronas olfatorias a través de la lámina cribosa. El olfato es la única vía sensitiva que llega a la corteza sin relevo talámico obligado.', clinic: 'Anosmia por fractura de la lámina cribosa o por COVID-19. Es un signo temprano en el Parkinson y el Alzheimer.' },
  claustrum: { func: 'Lámina de sustancia gris muy conectada con toda la corteza. Se ha propuesto que participa en la integración de la conciencia.' },
};

const GROUP_INFO = {
  frontal: { func: 'Corteza motora (M1 y premotora), control ejecutivo y planificación (prefrontal dorsolateral), conducta social e inhibición (orbitofrontal) y lenguaje expresivo (Broca).', clinic: 'Un síndrome frontal produce desinhibición, apatía, alteración del juicio, reflejos de liberación (prensión) e incontinencia.' },
  parietal: { func: 'Somatosensibilidad (S1), integración visuoespacial, atención y praxias (vía dorsal: "¿dónde?").' },
  temporal: { func: 'Audición, comprensión del lenguaje (Wernicke, hemisferio dominante), reconocimiento visual de objetos y caras (vía ventral) y memoria (temporal medial).' },
  occipital: { func: 'Visión: V1 en los bordes de la cisura calcarina y cortezas visuales asociativas alrededor.' },
  insula: { func: 'Interocepción (conciencia del estado corporal), gusto (corteza gustativa primaria), dolor, asco y control autonómico.' },
  limbico: { func: 'Sistema límbico: emoción, motivación, memoria y conductas de supervivencia. El circuito de Papez es hipocampo → fórnix → cuerpos mamilares → tálamo anterior → cíngulo → corteza entorrinal → hipocampo.' },
  amigdala: { func: 'Los núcleos basolateral (entrada) y central (salida hacia el hipotálamo y el tronco) median las respuestas de miedo. Activa los núcleos para verlos dentro del complejo.' },
  basales: { func: 'Circuito motor de los ganglios basales: corteza → estriado → (vía directa: GPi | vía indirecta: GPe → subtalámico → GPi) → tálamo VA/VL → corteza. La vía directa facilita el movimiento y la indirecta lo frena. La dopamina nigral favorece la directa (D1) e inhibe la indirecta (D2).', clinic: 'Hipocinéticos: Parkinson. Hipercinéticos: Huntington (corea), hemibalismo (lesión subtalámica), distonías.' },
  talamo: { func: 'Relevo y modulación de la información hacia la corteza. Los núcleos están ocultos por defecto: activa el ojo del grupo para verlos (y oculta el tálamo completo).' },
  hipotalamo: { func: 'Homeostasis y control neuroendocrino y autonómico. El epitálamo (habénula y pineal) regula los ritmos y la recompensa.' },
  tronco: { func: 'Por el tronco pasan todos los tractos ascendentes y descendentes. Contiene los núcleos de los pares craneales III–XII, la formación reticular (alerta y SARA) y los centros vitales (respiración y control cardiovascular).', clinic: 'Los síndromes cruzados (par craneal ipsilateral con hemiparesia o hipoestesia contralateral) localizan la lesión en el tronco.' },
  cerebelo: { func: 'Coordina el movimiento, el equilibrio, el tono y el aprendizaje motor comparando la orden motora con la retroalimentación sensorial. Actúa sobre el mismo lado del cuerpo.', clinic: 'Síndrome cerebeloso: ataxia, dismetría, disdiadococinesia, temblor intencional, nistagmo, disartria escándida e hipotonía. Romberg negativo (a diferencia de la ataxia sensitiva).' },
  blanca: { func: 'Fibras de proyección (cápsula interna, corona radiada), de asociación (fascículo arqueado, longitudinal superior) y comisurales (cuerpo calloso, comisura anterior). La sustancia blanca general está oculta por defecto.' },
  ventriculos: { func: 'Los plexos coroideos producen ~500 mL/día de LCR (volumen total ~150 mL, se renueva 3–4 veces al día). Recorrido: laterales → agujeros de Monro → tercer ventrículo → acueducto → cuarto ventrículo → agujeros de Luschka y Magendie → espacio subaracnoideo → granulaciones aracnoideas → senos venosos.', clinic: 'Hidrocefalia obstructiva (no comunicante) o comunicante (falla la reabsorción, por ejemplo tras una meningitis o una hemorragia subaracnoidea). Hidrocefalia normotensiva del adulto mayor: demencia, marcha magnética e incontinencia ("wet, wobbly, wacky").' },
  olfatorio: { func: 'Vía olfatoria: bulbo → tracto olfatorio → corteza piriforme y amígdala, sin relevo talámico obligado. Por eso los olores evocan emociones y recuerdos con tanta fuerza.' },
};

const parts = {};
for (const [key, [name, group, hidden]] of Object.entries(N)) {
  const pretty = key.replace(/_/g, ' ');
  parts[key] = { name, en: pretty.charAt(0).toUpperCase() + pretty.slice(1), group, hidden: !!hidden, ...(D[key] || {}) };
}

export default {
  id: 'brain',
  name: 'Encéfalo',
  subtitle: 'Neuroanatomía · Allen Human Brain',
  models: ['models/brain.glb'],
  viewDir: [1, 0.25, 0.15], // vista lateral izquierda
  xray: { groups: ['frontal', 'parietal', 'temporal', 'occipital', 'insula', 'limbico', 'olfatorio'], label: 'Corteza cerebral' },
  labelParts: ['precentral_gyrus', 'postcentral_gyrus', 'superior_temporal_gyrus', 'inferior_frontal_gyrus_opercular_part', 'frontal_pole', 'occipital_pole', 'lateral_hemisphere_of_cerebellum', 'basilar_part_of_pons', 'angular_gyrus'],

  groups: [
    { id: 'frontal', name: 'Lóbulo frontal', color: '#e8a87c' },
    { id: 'parietal', name: 'Lóbulo parietal', color: '#8fc1e3' },
    { id: 'temporal', name: 'Lóbulo temporal', color: '#a8d5a2' },
    { id: 'occipital', name: 'Lóbulo occipital', color: '#c9a7e8' },
    { id: 'insula', name: 'Ínsula', color: '#f2d06b' },
    { id: 'limbico', name: 'Sistema límbico', color: '#e88fa8' },
    { id: 'amigdala', name: 'Amígdala', color: '#d4577a' },
    { id: 'basales', name: 'Ganglios basales', color: '#5fb3a1' },
    { id: 'talamo', name: 'Tálamo', color: '#6a8fd8' },
    { id: 'hipotalamo', name: 'Hipotálamo y epitálamo', color: '#f0a04b' },
    { id: 'tronco', name: 'Tronco encefálico', color: '#b98b6e' },
    { id: 'cerebelo', name: 'Cerebelo', color: '#d98ba0' },
    { id: 'blanca', name: 'Sustancia blanca', color: '#efeadf' },
    { id: 'ventriculos', name: 'Sistema ventricular', color: '#4fc3f7' },
    { id: 'olfatorio', name: 'Vía olfatoria', color: '#c5e17a' },
  ],
  groupInfo: GROUP_INFO,
  parts,

  tours: [
    {
      name: 'Vía motora y sensitiva',
      steps: [
        { title: '1. Corteza motora primaria', parts: ['precentral_gyrus', 'paracentral_lobule_rostral_part'], text: 'Las neuronas piramidales de M1 inician el movimiento voluntario. Homúnculo: la pierna en la cara medial (paracentral), y la mano y la cara en la convexidad.' },
        { title: '2. Pedúnculo cerebral', parts: ['cerebral_peduncle_crus_cerebri'], text: 'Tras la corona radiada y el brazo posterior de la cápsula interna, el tracto corticoespinal desciende por el pie del pedúnculo.' },
        { title: '3. Protuberancia', parts: ['basilar_part_of_pons'], text: 'Las fibras corticoespinales se dividen en fascículos entre los núcleos pontinos. Las corticopontinas hacen relevo aquí hacia el cerebelo.' },
        { title: '4. Pirámides bulbares', parts: ['pyramidal_part_of_medulla_oblongata'], text: 'En la decusación piramidal cruza el ~85–90 % de las fibras. Por eso la corteza izquierda controla el hemicuerpo derecho.' },
        { title: '5. Modulación: ganglios basales y cerebelo', parts: ['putamen', 'internal_segment_of_globus_pallidus', 'lateral_hemisphere_of_cerebellum', 'cerebellar_deep_nuclei', 'thalamus'], text: 'Ambos actúan a través del tálamo (VA/VL) sobre la corteza: los ganglios basales seleccionan e inician el movimiento, y el cerebelo lo coordina y corrige.' },
        { title: '6. Vuelta sensitiva', parts: ['thalamus', 'postcentral_gyrus', 'paracentral_lobule_caudal_part'], text: 'La sensibilidad asciende por el lemnisco medial y el espinotalámico, hace relevo en el VPL/VPM del tálamo y llega a S1 (giro poscentral).' },
      ],
    },
    {
      name: 'Áreas del lenguaje',
      steps: [
        { title: '1. Corteza auditiva primaria', parts: ['transverse_temporal_gyrus_Heschls_gyrus'], text: 'El sonido llega por el colículo inferior y el geniculado medial al giro de Heschl.' },
        { title: '2. Wernicke: comprensión', parts: ['planum_temporale', 'superior_temporal_gyrus'], text: 'La parte posterior del temporal superior del hemisferio dominante decodifica el significado. Su lesión da afasia fluente con mala comprensión.' },
        { title: '3. Giros angular y supramarginal', parts: ['angular_gyrus', 'supramarginal_gyrus'], text: 'Integran la lectura y la escritura. El fascículo arqueado pasa por debajo hacia Broca: su lesión da afasia de conducción (falla la repetición).' },
        { title: '4. Broca: expresión', parts: ['inferior_frontal_gyrus_opercular_part', 'inferior_frontal_gyrus_triangular_part'], text: 'Planifica la articulación. Su lesión da afasia no fluente con comprensión conservada.' },
        { title: '5. Corteza motora de la cara', parts: ['precentral_gyrus'], text: 'Ejecuta los movimientos de labios, lengua y laringe para hablar.' },
      ],
    },
    {
      name: 'Circuito de Papez (memoria)',
      steps: [
        { title: '1. Hipocampo', parts: ['head_of_hippocampus', 'body_of_hippocampus', 'tail_of_hippocampus'], text: 'Consolida la memoria declarativa.' },
        { title: '2. Fórnix', parts: ['fornix'], text: 'Principal salida del hipocampo. Se arquea bajo el cuerpo calloso.' },
        { title: '3. Cuerpos mamilares', parts: ['mammillary_region_of_HTH'], text: 'Se atrofian en el síndrome de Wernicke-Korsakoff (déficit de tiamina).' },
        { title: '4. Tracto mamilotalámico → tálamo anterior', parts: ['mammillothalamic_tract', 'anterior_nuclear_complex_of_thalamus'], text: 'El núcleo anterior del tálamo hace relevo hacia el cíngulo.' },
        { title: '5. Giro cingulado', parts: ['cingulate_gyrus_rostral_anterior_part', 'cingulate_gyrus_caudal_posterior_part', 'ingulo_parahippocampal_isthmus'], text: 'Integra emoción y memoria.' },
        { title: '6. Parahipocampal / entorrinal → hipocampo', parts: ['anterior_parahippocampal_gyrus', 'posterior_parahippocampal_gyrus', 'head_of_hippocampus'], text: 'La corteza entorrinal cierra el circuito (vía perforante). Es la primera región afectada en el Alzheimer.' },
        { title: '7. Amígdala', parts: ['amygdaloid_complex'], text: 'Añade el tono emocional a los recuerdos: por eso los eventos emocionales se recuerdan mejor.' },
      ],
    },
    {
      name: 'Ganglios basales',
      steps: [
        { title: '1. Estriado', parts: ['head_of_caudate', 'body_of_caudate', 'tail_of_caudate', 'putamen', 'nucleus_accumbens'], text: 'Recibe glutamato de toda la corteza y dopamina de la sustancia negra.' },
        { title: '2. Globo pálido', parts: ['external_segment_of_globus_pallidus', 'internal_segment_of_globus_pallidus'], text: 'El GPi es la salida inhibitoria tónica hacia el tálamo. El GPe forma parte de la vía indirecta.' },
        { title: '3. Núcleo subtalámico', parts: ['subthalamic_nucleus'], text: 'Excita el GPi: frena el movimiento. Es blanco de la estimulación cerebral profunda.' },
        { title: '4. Sustancia negra', parts: ['substantia_nigra'], text: 'La dopamina facilita la vía directa (D1) e inhibe la indirecta (D2). Su pérdida produce el Parkinson.' },
        { title: '5. Tálamo motor → corteza', parts: ['thalamus', 'precentral_gyrus'], text: 'El tálamo VA/VL, desinhibido por la vía directa, excita la corteza motora y premotora.' },
      ],
    },
    {
      name: 'Circulación del LCR',
      steps: [
        { title: '1. Ventrículos laterales', parts: ['anterior_horn_of_lateral_ventricle', 'body_of_lateral_ventricle', 'atrium_of_lateral_ventricle', 'posterior_horn_of_lateral_ventricle', 'inferior_horn_of_lateral_ventricle'], text: 'Los plexos coroideos (en el cuerpo, el atrio y el asta temporal) producen la mayor parte del LCR (~500 mL/día).' },
        { title: '2. Tercer ventrículo', parts: ['third_ventricle'], text: 'Llega por los agujeros interventriculares de Monro.' },
        { title: '3. Acueducto de Silvio', parts: ['cerebral_aqueduct'], text: 'Es el punto más estrecho: su estenosis produce hidrocefalia de los ventrículos laterales y el tercero.' },
        { title: '4. Cuarto ventrículo', parts: ['fourth_ventricle', 'central_canal_of_medulla_oblongata'], text: 'Sale por los agujeros de Luschka y Magendie al espacio subaracnoideo, y se reabsorbe en las granulaciones aracnoideas hacia los senos venosos.' },
      ],
    },
  ],

  physiology: [
    {
      title: 'Cómo explorar',
      open: true,
      html: `
<ul>
<li>Usa <b>Transparencia</b> para volver translúcida la corteza y ver los núcleos profundos (ganglios basales, tálamo, hipocampo y ventrículos).</li>
<li>Usa <b>Corte</b> (sagital, coronal o transversal) como en los cortes de un atlas o de una resonancia.</li>
<li>Los núcleos del tálamo y de la amígdala están ocultos por defecto (se superponen al tálamo y la amígdala completos). Actívalos desde la lista.</li>
<li>Hay 5 recorridos: vía motora, lenguaje, Papez, ganglios basales y LCR.</li>
</ul>`,
    },
    {
      title: 'Núcleos de relevo del tálamo',
      html: `
<table>
<tr><th>Núcleo</th><th>Recibe</th><th>Proyecta a</th></tr>
<tr><td>VPL</td><td>Lemnisco medial, espinotalámico</td><td>S1 (cuerpo)</td></tr>
<tr><td>VPM</td><td>Trigémino, gusto</td><td>S1 (cara), ínsula</td></tr>
<tr><td>NGL</td><td>Tracto óptico</td><td>V1</td></tr>
<tr><td>NGM</td><td>Colículo inferior</td><td>A1</td></tr>
<tr><td>VA / VL</td><td>Ganglios basales, cerebelo</td><td>Corteza motora y premotora</td></tr>
<tr><td>Anterior</td><td>Cuerpos mamilares</td><td>Cíngulo (Papez)</td></tr>
<tr><td>Mediodorsal</td><td>Amígdala, prefrontal</td><td>Corteza prefrontal</td></tr>
<tr><td>Pulvinar</td><td>Colículo superior, cortezas</td><td>Corteza asociativa parieto-occipital</td></tr>
</table>`,
    },
    {
      title: 'Afasias',
      html: `
<table>
<tr><th>Tipo</th><th>Fluencia</th><th>Comprensión</th><th>Repetición</th><th>Lesión</th></tr>
<tr><td>Broca</td><td>✗</td><td>✓</td><td>✗</td><td>Frontal inferior</td></tr>
<tr><td>Wernicke</td><td>✓</td><td>✗</td><td>✗</td><td>Temporal superior posterior</td></tr>
<tr><td>Conducción</td><td>✓</td><td>✓</td><td>✗</td><td>Fascículo arqueado / supramarginal</td></tr>
<tr><td>Global</td><td>✗</td><td>✗</td><td>✗</td><td>Territorio extenso de la ACM</td></tr>
<tr><td>Transcortical motora</td><td>✗</td><td>✓</td><td>✓</td><td>Alrededor de Broca</td></tr>
<tr><td>Transcortical sensitiva</td><td>✓</td><td>✗</td><td>✓</td><td>Alrededor de Wernicke</td></tr>
</table>`,
    },
    {
      title: 'Territorios vasculares',
      html: `
<ul>
<li><b>Arteria cerebral anterior:</b> cara medial de los lóbulos frontal y parietal. Su oclusión da paresia y alteración sensitiva del miembro inferior contralateral, abulia e incontinencia.</li>
<li><b>Arteria cerebral media:</b> convexidad lateral. Su oclusión da paresia y alteración sensitiva de la cara y el brazo contralaterales; afasia si es el hemisferio dominante, heminegligencia si es el no dominante, y hemianopsia. Sus ramas lenticuloestriadas irrigan los ganglios basales y la cápsula interna (lagunas, hemorragia hipertensiva).</li>
<li><b>Arteria cerebral posterior:</b> occipital y temporal inferomedial y tálamo. Su oclusión da hemianopsia homónima con respeto macular y alteraciones de memoria.</li>
<li><b>Sistema vertebrobasilar:</b> tronco y cerebelo. Su afectación produce síndromes cruzados, vértigo, ataxia o síndrome de enclaustramiento.</li>
</ul>`,
    },
  ],
};

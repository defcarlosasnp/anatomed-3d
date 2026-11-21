// Estómago — datos anatómicos y fisiológicos.
// Mallas: public/models/stomach-organs.glb (VisceralSystem100) y stomach-vessels.glb (CardioVascular41).
// Las regiones del estómago se calculan en el navegador a partir de los puntos de referencia
// (stomach-landmarks.json) que trae Z-Anatomy.

const RED = '#c8372f';

export default {
  id: 'stomach',
  name: 'Estómago',
  subtitle: 'Sistema digestivo · Fisiología II',
  models: ['models/stomach-organs.glb', 'models/stomach-vessels.glb'],
  labelParts: ['oesophagus', 'duodenum', 'pancreas'],
  landmarks: 'models/stomach-landmarks.json',
  frame: ['stomach', 'duodenum', 'pancreas'], // encuadre inicial (el esófago completo es muy largo)
  xray: { groups: ['organo'], label: 'Estómago' },
  animation: 'peristalsis',
  extra: { id: 'regions', label: '🎨 Regiones', defaultOn: true },

  groups: [
    { id: 'organo', name: 'Estómago', color: '#d98b7b' },
    { id: 'capas', name: 'Capas de la pared', color: '#a8443b' },
    { id: 'tubo', name: 'Esófago y duodeno', color: '#cf8a6e' },
    { id: 'vecinos', name: 'Órganos vecinos', color: '#9b4a3c' },
    { id: 'arterias', name: 'Irrigación arterial', color: RED },
    { id: 'venas', name: 'Drenaje venoso', color: '#6a5bd6' },
  ],

  parts: {
    stomach: {
      name: 'Estómago', en: 'Stomach (gaster)', group: 'organo', color: '#dd9584', cap: false,
      desc: 'La superficie externa corresponde a la serosa (peritoneo visceral). Es una porción dilatada del tubo digestivo, en el hipocondrio izquierdo y el epigastrio. Tiene dos caras (anterior y posterior), dos curvaturas (menor y mayor) y dos orificios: el cardias (desde el esófago) y el píloro (hacia el duodeno). Haz clic en una región para ver su función.',
      func: 'Almacena el alimento (hasta ~1,5 L), lo mezcla y lo tritura hasta formar el quimo. Secreta ~2 L/día de jugo gástrico (HCl, pepsinógeno, factor intrínseco y moco) y regula el vaciamiento hacia el duodeno. Su pared tiene una capa muscular extra, la oblicua interna.',
    },
    m_long: {
      name: 'Muscular externa — capa longitudinal', en: 'Longitudinal muscle layer', group: 'capas', color: '#b5544a', quiz: false, hidden: true, showOnClip: true, cap: false,
      desc: 'Capa muscular lisa más externa (bajo la serosa), continuación de la longitudinal del esófago. Es más gruesa a lo largo de las curvaturas. Entre esta capa y la circular está el plexo mientérico (de Auerbach). Capa esquemática: aparece al activar ✂ Corte.',
      func: 'Junto con la capa circular genera el peristaltismo. El plexo mientérico controla la motilidad, y las células intersticiales de Cajal (el marcapaso) se ubican entre las capas musculares.',
    },
    m_circ: {
      name: 'Muscular externa — capa circular', en: 'Circular muscle layer', group: 'capas', color: '#a8443b', quiz: false, hidden: true, showOnClip: true, cap: false,
      desc: 'Capa muscular media, la más desarrollada. En el píloro se engruesa y forma el esfínter pilórico.',
      func: 'Sus contracciones anulares forman las ondas peristálticas que trituran y propulsan el contenido hacia el píloro.',
      clinic: 'Su hipertrofia en el píloro del lactante produce la estenosis hipertrófica del píloro.',
    },
    m_obl: {
      name: 'Muscular externa — capa oblicua interna', en: 'Oblique muscle layer', group: 'capas', color: '#93362f', quiz: false, hidden: true, showOnClip: true, cap: false,
      desc: 'Capa muscular más interna, exclusiva del estómago. Solo existe en el fundus y el cuerpo (no llega al antro), y sus fibras forman la "corbata suiza" en torno al cardias.',
      func: 'Permite la mezcla y el "amasado" del contenido gástrico y refuerza el mecanismo antirreflujo en el cardias.',
    },
    submucosa: {
      name: 'Submucosa', en: 'Submucosa', group: 'capas', color: '#f0d9b5', quiz: false, hidden: true, showOnClip: true, cap: false,
      desc: 'Tejido conectivo laxo con vasos sanguíneos y linfáticos y con el plexo submucoso (de Meissner).',
      func: 'El plexo submucoso regula la secreción glandular y el flujo sanguíneo local. Los pliegues gástricos (rugosidades) se forman por plegamiento de la mucosa y la submucosa.',
    },
    mucosa: {
      name: 'Mucosa gástrica', en: 'Gastric mucosa', group: 'capas', color: '#e06a7a', quiz: false, hidden: true, showOnClip: true, cap: false,
      desc: 'Epitelio cilíndrico simple secretor de moco, con fositas (foveolas) gástricas donde desembocan las glándulas, más la lámina propia y la muscularis mucosae. Su tipo de glándula cambia por región: cardiales, oxínticas en fundus y cuerpo, y pilóricas en el antro.',
      func: 'Secreta HCl, pepsinógeno, factor intrínseco, moco y HCO₃⁻, además de hormonas (gastrina, somatostatina, grelina). Mira la pestaña Fisiología.',
      clinic: 'Gastritis, úlcera péptica, metaplasia intestinal y adenocarcinoma gástrico nacen en esta capa.',
    },
    oesophagus: {
      name: 'Esófago', en: 'Oesophagus', group: 'tubo', color: '#c98170',
      desc: 'Tubo muscular de ~25 cm desde la faringe (C6) hasta el cardias (T11). Su tercio superior es de músculo estriado y el inferior de músculo liso. Atraviesa el diafragma por el hiato esofágico (T10).',
      func: 'Transporta el bolo mediante peristaltismo primario (iniciado por la deglución) y secundario (por distensión). El esfínter esofágico inferior (EEI, ~15–30 mmHg) se relaja al deglutir (vía VIP/NO vagal) y evita el reflujo.',
      clinic: 'Si el EEI es incompetente aparece la ERGE. En la acalasia el EEI no se relaja por pérdida de neuronas inhibitorias (imagen "en pico de pájaro"). El esófago de Barrett es una metaplasia intestinal por reflujo crónico.',
    },
    duodenum: {
      name: 'Duodeno', en: 'Duodenum', group: 'tubo', color: '#d9a07a',
      desc: 'Primera porción del intestino delgado (~25 cm), en forma de "C" alrededor de la cabeza del páncreas. En la papila mayor (2.ª porción) desembocan el colédoco y el conducto pancreático.',
      func: 'Recibe el quimo ácido y lo neutraliza con el HCO₃⁻ pancreático y biliar y las glándulas de Brunner. Sus células S liberan secretina (en respuesta al ácido) y sus células I liberan CCK (en respuesta a grasas y proteínas). Ambas frenan el vaciamiento y la secreción gástrica.',
      clinic: 'La úlcera duodenal (casi siempre en el bulbo) se asocia a H. pylori. El dolor típicamente mejora al comer.',
    },
    liver: {
      name: 'Hígado', en: 'Liver', group: 'vecinos', color: '#8e3b2f', hidden: true,
      desc: 'Su lóbulo izquierdo cubre la cara anterior del estómago. Lo une a la curvatura menor el omento menor (ligamento hepatogástrico).',
    },
    gallbladder: { name: 'Vesícula biliar', en: 'Gallbladder', group: 'vecinos', color: '#4d8a3a', desc: 'Almacena y concentra la bilis. Se contrae por acción de la CCK duodenal.' },
    pancreas: {
      name: 'Páncreas', en: 'Pancreas', group: 'vecinos', color: '#e1c07a',
      desc: 'Retroperitoneal, detrás del estómago (separado por la bolsa omental). Su cabeza está en el marco duodenal.',
      clinic: 'Una úlcera de la pared posterior del estómago puede penetrar hasta el páncreas. Un pseudoquiste pancreático se acumula en la bolsa omental, detrás del estómago.',
    },
    abd_ao: { name: 'Aorta abdominal', en: 'Abdominal aorta', group: 'arterias', color: RED, desc: 'Da origen al tronco celíaco a la altura de T12, la principal fuente de irrigación del estómago.' },
    celiac: {
      name: 'Tronco celíaco', en: 'Coeliac trunk', group: 'arterias', color: RED,
      desc: 'Primera rama ventral de la aorta abdominal (T12). Se divide en tres ramas: gástrica izquierda, hepática común y esplénica (trípode de Haller).',
      func: 'Irriga los derivados del intestino anterior: estómago, duodeno proximal, hígado, vías biliares, bazo y parte del páncreas.',
    },
    lga: {
      name: 'Arteria gástrica izquierda', en: 'Left gastric artery', group: 'arterias', color: RED,
      desc: 'Asciende hacia el cardias (da ramas esofágicas) y luego desciende por la curvatura menor, donde se anastomosa con la gástrica derecha.',
      clinic: 'Una úlcera de la curvatura menor puede erosionarla y causar una hemorragia digestiva alta.',
    },
    cha: { name: 'Arteria hepática común', en: 'Common hepatic artery', group: 'arterias', color: RED, desc: 'Va hacia la derecha y se divide en la hepática propia y la gastroduodenal. De ella o de la hepática propia nace la gástrica derecha (no incluida en el modelo).' },
    pha: { name: 'Arteria hepática propia', en: 'Proper hepatic artery', group: 'arterias', color: RED, desc: 'Asciende en el ligamento hepatoduodenal hacia el hígado. Suele dar la arteria gástrica derecha para la curvatura menor.' },
    gda: {
      name: 'Arteria gastroduodenal', en: 'Gastroduodenal artery', group: 'arterias', color: RED,
      desc: 'Desciende por detrás de la primera porción del duodeno. Da la gastroomental (gastroepiploica) derecha para la curvatura mayor y las pancreaticoduodenales superiores.',
      clinic: 'Una úlcera duodenal posterior puede erosionarla y causar una hemorragia masiva.',
    },
    splenic: { name: 'Arteria esplénica', en: 'Splenic artery', group: 'arterias', color: RED, desc: 'Tortuosa, recorre el borde superior del páncreas hacia el bazo. Da las arterias gástricas cortas (para el fundus) y la gastroomental izquierda (para la curvatura mayor). Estas ramas no están en el modelo.' },
    portal: {
      name: 'Vena porta hepática', en: 'Hepatic portal vein', group: 'venas', color: '#6a5bd6',
      desc: 'Se forma detrás del cuello del páncreas por la unión de la vena mesentérica superior y la esplénica. Las venas gástricas drenan en ella.',
      clinic: 'En la hipertensión portal (cirrosis), la vena gástrica izquierda (coronaria) se anastomosa con las venas esofágicas y forma várices esofágicas, que pueden sangrar.',
    },
  },

  // Regiones del estómago (calculadas sobre la malla)
  regions: {
    part: 'stomach',
    list: [
      {
        key: 'cardia', name: 'Cardias', en: 'Cardia', color: '#f2c14e',
        desc: 'Zona que rodea el orificio esofágico. Su mucosa contiene glándulas cardiales, sobre todo mucosas.',
        func: 'El esfínter esofágico inferior (fisiológico) y el ángulo de His (incisura cardial), junto con los pilares del diafragma, forman la barrera antirreflujo.',
        clinic: 'En la hernia hiatal por deslizamiento el cardias asciende al tórax y aumenta el reflujo.',
      },
      {
        key: 'fundus', name: 'Fondo (fundus)', en: 'Fundus of stomach', color: '#7cc4e8',
        desc: 'Porción por encima del plano horizontal que pasa por el cardias. Suele contener aire (la "cámara gástrica" de la radiografía).',
        func: 'Tiene glándulas oxínticas: células parietales (HCl y factor intrínseco) y principales (pepsinógeno). En lo motor hace la relajación receptiva y la acomodación: se relaja para recibir el alimento sin que suba la presión (reflejo vagovagal, NO/VIP).',
        clinic: 'Tras una vagotomía o una fundoplicatura se altera la acomodación, lo que causa saciedad precoz.',
      },
      {
        key: 'body', name: 'Cuerpo', en: 'Body of stomach', color: '#e58c7a',
        desc: 'Es la porción más grande, entre el fundus y la incisura angular. Su mucosa forma pliegues longitudinales (rugosidades).',
        func: 'Es la principal zona secretora (glándulas oxínticas). Las células parietales secretan HCl (bomba H⁺/K⁺-ATPasa) y factor intrínseco (necesario para absorber la vitamina B₁₂ en el íleon). Las principales secretan pepsinógeno. Las células ECL liberan histamina. En la curvatura mayor del cuerpo está el marcapaso gástrico (células intersticiales de Cajal, ~3 ondas/min).',
        clinic: 'En la gastritis atrófica autoinmune se destruyen las células parietales: aparecen aclorhidria, déficit de factor intrínseco, anemia perniciosa (megaloblástica) e hipergastrinemia.',
      },
      {
        key: 'antrum', name: 'Antro pilórico', en: 'Pyloric antrum', color: '#9b7fe0',
        desc: 'Porción distal a la incisura angular. Tiene una pared muscular gruesa y glándulas pilóricas.',
        func: 'Las células G secretan gastrina (estimulan la célula parietal y el crecimiento de la mucosa) y las células D secretan somatostatina (frena la gastrina cuando el pH < 3). En lo motor, contracciones potentes trituran el alimento y la retropulsión contra el píloro cerrado mezcla y reduce las partículas a menos de 1–2 mm.',
        clinic: 'Es la localización más frecuente de la gastritis por H. pylori y de la úlcera gástrica (curvatura menor del antro). Un gastrinoma (síndrome de Zollinger-Ellison) da úlceras múltiples y refractarias.',
      },
      {
        key: 'pylorus', name: 'Canal pilórico y píloro', en: 'Pyloric canal / pylorus', color: '#5cc68a',
        desc: 'Es el canal estrecho que termina en el esfínter pilórico, un engrosamiento de la capa circular. Marca el límite con el duodeno (vena prepilórica de Mayo).',
        func: 'Regula el vaciamiento gástrico: deja pasar líquidos y partículas pequeñas, y retiene los sólidos grandes. CCK, secretina, GIP y el reflejo enterogástrico (por grasas, ácido o hiperosmolaridad duodenal) lo contraen y enlentecen el vaciamiento.',
        clinic: 'La estenosis hipertrófica del píloro del lactante (3–6 semanas) produce vómitos en proyectil no biliosos, una "oliva" palpable y alcalosis metabólica hipoclorémica.',
      },
    ],
  },

  landmarkNames: {
    'Angular incisure': 'Incisura angular',
    'Anterior wall of stomach': 'Pared anterior',
    'Body of stomach': 'Cuerpo',
    Cardia: 'Cardias',
    'Cardiac notch': 'Incisura cardial (ángulo de His)',
    'Fundus of stomach': 'Fondo gástrico',
    'Greater curvature of stomach': 'Curvatura mayor',
    'Lesser curvature of stomach': 'Curvatura menor',
    'Posterior wall of stomach': 'Pared posterior',
    'Pyloric antrum': 'Antro pilórico',
    'Pyloric part': 'Porción pilórica',
  },

  tours: [
    {
      name: 'Recorrido del bolo alimenticio',
      steps: [
        { title: '1. Esófago', parts: ['oesophagus'], text: 'La deglución inicia el peristaltismo primario y el bolo baja en ~8–10 s. El EEI se relaja por adelantado (relajación receptiva esofágica, vía vagal VIP/NO).' },
        { title: '2. Cardias', regions: ['cardia'], parts: ['oesophagus'], text: 'El bolo entra por el cardias. El EEI, el ángulo de His y el diafragma impiden el reflujo del contenido ácido.' },
        { title: '3. Fondo: acomodación', regions: ['fundus'], text: 'El fundus se relaja (relajación receptiva y acomodación) para almacenar el alimento sin aumentar la presión intragástrica. En la fase cefálica (~30 % de la secreción), la sola vista u olor de la comida ya activa el vago.' },
        { title: '4. Cuerpo: secreción ácida', regions: ['body'], text: 'La distensión y los péptidos activan la fase gástrica (~60 % de la secreción). Las células parietales liberan HCl (pH 1–2), que activa el pepsinógeno a pepsina e inicia la digestión de proteínas. Las ondas lentas (~3/min) nacen aquí.' },
        { title: '5. Antro: trituración y gastrina', regions: ['antrum'], text: 'Fuertes contracciones peristálticas trituran el alimento y lo empujan contra el píloro cerrado (retropulsión). La gastrina de las células G estimula aún más la secreción ácida.' },
        { title: '6. Píloro: vaciamiento', regions: ['pylorus'], text: 'Solo pasan partículas < 1–2 mm. Los líquidos se vacían en minutos y los sólidos en 2–4 h. Las grasas son lo que más enlentece el vaciamiento (vía CCK).' },
        { title: '7. Duodeno: fase intestinal', parts: ['duodenum', 'pancreas', 'gallbladder'], text: 'El quimo ácido estimula la secretina (que pide HCO₃⁻ al páncreas) y las grasas la CCK (enzimas pancreáticas y contracción vesicular). Ambas hormonas inhiben el estómago (efecto enterogastrona).' },
        { title: '8. Irrigación del estómago', parts: ['abd_ao', 'celiac', 'lga', 'cha', 'pha', 'gda', 'splenic', 'portal'], text: 'Todas las arterias del estómago provienen del tronco celíaco: gástricas izquierda y derecha (curvatura menor), gastroomentales (curvatura mayor) y gástricas cortas (fundus). El drenaje venoso va a la vena porta.' },
      ],
    },
  ],

  physiology: [
    {
      title: 'Células de la mucosa gástrica',
      open: true,
      html: `
<table>
<tr><th>Célula</th><th>Región</th><th>Secreta</th></tr>
<tr><td>Parietal (oxíntica)</td><td>Fondo y cuerpo</td><td>HCl y factor intrínseco</td></tr>
<tr><td>Principal (zimógena)</td><td>Fondo y cuerpo</td><td>Pepsinógeno y lipasa gástrica</td></tr>
<tr><td>Mucosa superficial y del cuello</td><td>Todo el estómago</td><td>Moco y HCO₃⁻ (barrera mucosa)</td></tr>
<tr><td>ECL (enterocromafín-like)</td><td>Fondo y cuerpo</td><td>Histamina</td></tr>
<tr><td>G</td><td>Antro</td><td>Gastrina</td></tr>
<tr><td>D</td><td>Antro y cuerpo</td><td>Somatostatina (inhibe)</td></tr>
</table>
<p>Activa <b>🎨 Regiones</b> y haz clic en cada zona del estómago para ver qué hace.</p>`,
    },
    {
      title: 'Secreción de HCl (célula parietal)',
      html: `
<ol>
<li>La anhidrasa carbónica genera H⁺ y HCO₃⁻ a partir de CO₂ + H₂O.</li>
<li>La <b>H⁺/K⁺-ATPasa</b> (bomba de protones) saca H⁺ hacia la luz a cambio de K⁺. Los IBP (omeprazol) la inhiben de forma irreversible.</li>
<li>El Cl⁻ sale a la luz por canales apicales, y en la luz se forma el HCl.</li>
<li>El HCO₃⁻ pasa a la sangre a cambio de Cl⁻ (basolateral). Esto produce la <b>marea alcalina</b> posprandial.</li>
</ol>
<p><b>Estimulan:</b> ACh (vago, receptor M₃), gastrina (CCK₂) e histamina (H₂, el amplificador principal). Por eso los anti-H₂ reducen la secreción estimulada por cualquiera de los tres.<br>
<b>Inhiben:</b> somatostatina, pH antral &lt; 3, prostaglandinas E₂ y enterogastronas (secretina, GIP, CCK).</p>`,
    },
    {
      title: 'Fases de la secreción gástrica',
      html: `
<ul>
<li><b>Cefálica (~30 %):</b> vista, olor, gusto y masticación. Es vagal: ACh actúa sobre la célula parietal y el GRP sobre la célula G.</li>
<li><b>Gástrica (~60 %):</b> la distensión activa reflejos vagovagales y locales, y los péptidos y aminoácidos estimulan la gastrina. Es la fase principal.</li>
<li><b>Intestinal (~10 % estimulante, sobre todo inhibitoria):</b> el ácido, la grasa y la hiperosmolaridad duodenal liberan secretina, CCK y GIP, y activan el reflejo enterogástrico. Estos frenan la secreción y el vaciamiento.</li>
</ul>`,
    },
    {
      title: 'Motilidad y vaciamiento',
      html: `
<ul>
<li><b>Relajación receptiva y acomodación</b> (estómago proximal): vía vagal NANC (NO, VIP).</li>
<li><b>Ondas lentas</b> (~3/min) generadas por las células intersticiales de Cajal en la curvatura mayor. Solo producen contracción si se alcanza el umbral (potenciales en espiga, por ACh o gastrina).</li>
<li><b>Mezcla y trituración:</b> el peristaltismo antral empuja el contenido contra el píloro cerrado (retropulsión).</li>
<li><b>Vaciamiento:</b> líquidos con cinética exponencial, sólidos tras una fase de latencia. Lo enlentecen las grasas, el ácido, la hiperosmolaridad y la CCK.</li>
<li><b>En ayunas:</b> el complejo motor migratorio (fase III, mediado por motilina) "barre" los restos cada ~90–120 min.</li>
</ul>
<p>Pulsa <b>▶ Peristaltismo</b> para ver las ondas peristálticas recorriendo el estómago (simulación esquemática).</p>`,
    },
    {
      title: 'Barrera mucosa y úlcera péptica',
      html: `
<p>La mucosa se protege con una capa de <b>moco + HCO₃⁻</b> (que mantiene un pH ~7 junto al epitelio), uniones estrechas, renovación celular rápida, buen flujo sanguíneo y <b>prostaglandinas</b> (PGE₂, que estimulan el moco y el HCO₃⁻ e inhiben el ácido).</p>
<p class="clinic"><b>Úlcera péptica:</b> se produce cuando los factores agresivos (ácido, pepsina, <i>H. pylori</i>, AINEs que inhiben la COX y por tanto las prostaglandinas) superan a los defensivos. El tratamiento combina IBP, erradicación de <i>H. pylori</i> y suspensión de los AINEs.</p>`,
    },
    {
      title: 'Irrigación e inervación',
      html: `
<ul>
<li><b>Curvatura menor:</b> arterias gástricas izquierda (del tronco celíaco) y derecha (de la hepática).</li>
<li><b>Curvatura mayor:</b> gastroomental derecha (de la gastroduodenal) e izquierda (de la esplénica).</li>
<li><b>Fundus:</b> arterias gástricas cortas (de la esplénica).</li>
<li><b>Venas:</b> drenan a la vena porta. La gástrica izquierda forma anastomosis portocava con las venas esofágicas (várices en la hipertensión portal).</li>
<li><b>Inervación:</b> parasimpática por el vago (troncos anterior y posterior; estimula secreción y motilidad) y simpática por el plexo celíaco (T6–T9; dolor e inhibición).</li>
</ul>
<p class="muted small">El modelo incluye el tronco celíaco, las arterias gástrica izquierda, hepática común y propia, gastroduodenal y esplénica. Las ramas gastroomentales, gástrica derecha y gástricas cortas no están en Z-Anatomy.</p>`,
    },
  ],
};

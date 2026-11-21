// Pulmones — Human Reference Atlas (NIH HuBMAP, Visible Human Male, CC BY 4.0).
// Segmentos broncopulmonares, hilios, árbol bronquial y tráquea.

const seg = (name, en, group, color, desc, extra = {}) => ({ name, en, group, color, desc, ...extra });

export default {
  id: 'lungs',
  name: 'Pulmones',
  subtitle: 'Sistema respiratorio · Fisiología I',
  models: ['models/lung.glb', 'models/airway-trachea.glb', 'models/airway-bronchi.glb'],
  xray: { groups: ['lsd', 'lmd', 'lid', 'lsi', 'lii'], label: 'Segmentos pulmonares' },
  animation: 'breathing',
  labelParts: ['trachea', 'r_s1', 'r_s4', 'r_s9', 'l_s12', 'l_s4', 'l_s9'],

  groups: [
    { id: 'lsd', name: 'Lóbulo superior derecho', color: '#e39aa1' },
    { id: 'lmd', name: 'Lóbulo medio', color: '#9dbfe3' },
    { id: 'lid', name: 'Lóbulo inferior derecho', color: '#a9d59a' },
    { id: 'lsi', name: 'Lóbulo superior izquierdo', color: '#eec383' },
    { id: 'lii', name: 'Lóbulo inferior izquierdo', color: '#94d0cb' },
    { id: 'via', name: 'Vía aérea', color: '#e9e2cf' },
    { id: 'hilio', name: 'Hilios pulmonares', color: '#b07a86' },
  ],

  groupInfo: {
    lsd: { func: 'Cada segmento broncopulmonar es una unidad anatómica y funcional con su propio bronquio segmentario y su rama de la arteria pulmonar en el centro. Las venas pulmonares corren por los planos intersegmentarios. Por eso un segmento puede resecarse quirúrgicamente de forma aislada (segmentectomía).' },
    lmd: { func: 'El lóbulo medio tiene dos segmentos (lateral y medial). Su bronquio es largo y estrecho, rodeado de ganglios linfáticos.', clinic: 'Síndrome del lóbulo medio: la compresión del bronquio por adenopatías produce atelectasia o neumonía recurrente. En la radiografía de tórax, la neumonía del lóbulo medio borra el borde cardíaco derecho (signo de la silueta).' },
    lid: { func: 'Los segmentos basales reciben la mayor parte de la ventilación y de la perfusión en bipedestación (base: V/Q ≈ 0,6).', clinic: 'El bronquio principal derecho es más corto, ancho y vertical que el izquierdo. Por eso los cuerpos extraños y las aspiraciones van con más frecuencia al pulmón derecho: segmentos basales posteriores si el paciente está de pie y segmento superior (S6) si está en decúbito supino.' },
    lsi: { func: 'El pulmón izquierdo no tiene lóbulo medio: la língula (S4–S5) es su equivalente. Los segmentos apical y posterior suelen describirse fusionados (apicoposterior, S1+2); en este modelo aparecen por separado.' },
    lii: { func: 'Los segmentos basales anterior y medial suelen describirse fusionados (anteromedial, S7+8). Los ápices tienen más ventilación por unidad de perfusión (V/Q ≈ 3).' },
    via: { func: 'La zona de conducción (tráquea → bronquiolos terminales, generaciones 0–16) forma el espacio muerto anatómico (~150 mL, ~2 mL/kg): calienta, humidifica y filtra el aire. La zona respiratoria (bronquiolos respiratorios → sacos alveolares, generaciones 17–23) hace el intercambio gaseoso.' },
  },

  parts: {
    // ---- Pulmón derecho ----
    r_s1: seg('Segmento apical (S1) — LSD', 'Apical segment, right upper lobe', 'lsd', '#e9a3a8', 'Ocupa el vértice pulmonar, que asciende sobre la clavícula hasta la cúpula pleural.', { clinic: 'Los segmentos apical y posterior del lóbulo superior son la localización típica de la tuberculosis de reactivación (alta PO₂ alveolar y bajo drenaje linfático). El tumor de Pancoast del vértice puede producir el síndrome de Horner.' }),
    r_s2: seg('Segmento posterior (S2) — LSD', 'Posterior segment, right upper lobe', 'lsd', '#d98790', 'Segmento posterior del lóbulo superior derecho.', { clinic: 'Es un sitio de neumonía aspirativa cuando el paciente está en decúbito lateral derecho.' }),
    r_s3: seg('Segmento anterior (S3) — LSD', 'Anterior segment, right upper lobe', 'lsd', '#f2bcc0', 'Segmento anterior del lóbulo superior derecho, separado del lóbulo medio por la cisura horizontal.'),
    r_s4: seg('Segmento lateral (S4) — LM', 'Lateral segment, middle lobe', 'lmd', '#a8c8e8', 'Segmento lateral del lóbulo medio, entre las cisuras horizontal y oblicua.'),
    r_s5: seg('Segmento medial (S5) — LM', 'Medial segment, middle lobe', 'lmd', '#86acd6', 'Segmento medial del lóbulo medio, en contacto con el borde derecho del corazón.'),
    r_s6: seg('Segmento superior (S6) — LID', 'Superior segment, right lower lobe', 'lid', '#b8dcab', 'Segmento más alto del lóbulo inferior derecho. Su bronquio es la primera rama posterior del bronquio lobar inferior.', { clinic: 'Es el sitio más frecuente de neumonía aspirativa y absceso pulmonar en decúbito supino (pacientes con alteración de conciencia o alcohólicos).' }),
    r_s7: seg('Segmento basal medial (S7) — LID', 'Medial basal segment, right lower lobe', 'lid', '#99cc8a', 'Segmento basal medial (cardíaco), junto a la vena cava inferior.'),
    r_s8: seg('Segmento basal anterior (S8) — LID', 'Anterior basal segment, right lower lobe', 'lid', '#c9e8be', 'Segmento basal anterior del lóbulo inferior derecho, en contacto con el diafragma.'),
    r_s9: seg('Segmento basal lateral (S9) — LID', 'Lateral basal segment, right lower lobe', 'lid', '#86bf76', 'Segmento basal lateral, en el seno costodiafragmático.'),
    r_s10: seg('Segmento basal posterior (S10) — LID', 'Posterior basal segment, right lower lobe', 'lid', '#d6efcc', 'Segmento más posterior e inferior del pulmón derecho.', { clinic: 'Es la zona más declive en bipedestación. Allí se acumulan primero los derrames pleurales y se producen las aspiraciones en pacientes de pie.' }),
    // ---- Pulmón izquierdo ----
    l_s12: seg('Segmento apical (S1) — LSI', 'Apical segment, left upper lobe', 'lsi', '#f2cf8f', 'Vértice del pulmón izquierdo. Clásicamente se fusiona con el posterior (segmento apicoposterior, S1+2).'),
    l_s2: seg('Segmento posterior (S2) — LSI', 'Posterior segment, left upper lobe', 'lsi', '#e5b864', 'Segmento posterior del lóbulo superior izquierdo.'),
    l_s3: seg('Segmento anterior (S3) — LSI', 'Anterior segment, left upper lobe', 'lsi', '#f7deae', 'Segmento anterior del lóbulo superior izquierdo, por encima de la escotadura cardíaca.'),
    l_s4: seg('Segmento lingular superior (S4)', 'Superior lingular segment', 'lsi', '#e2afe0', 'Parte superior de la língula, una lengüeta del lóbulo superior izquierdo que rodea la escotadura cardíaca.', { clinic: 'La neumonía lingular borra el borde izquierdo del corazón en la radiografía (signo de la silueta).' }),
    l_s5: seg('Segmento lingular inferior (S5)', 'Inferior lingular segment', 'lsi', '#cf94cb', 'Parte inferior de la língula.'),
    l_s6: seg('Segmento superior (S6) — LII', 'Superior segment, left lower lobe', 'lii', '#a4d8d4', 'Segmento superior del lóbulo inferior izquierdo.'),
    l_s7: seg('Segmento basal medial (S7) — LII', 'Medial basal segment, left lower lobe', 'lii', '#82c6c1', 'Segmento basal medial. A la izquierda suele fusionarse con el anterior (anteromedial, S7+8).'),
    l_s8: seg('Segmento basal anterior (S8) — LII', 'Anterior basal segment, left lower lobe', 'lii', '#bce4e0', 'Segmento basal anterior del lóbulo inferior izquierdo.'),
    l_s9: seg('Segmento basal lateral (S9) — LII', 'Lateral basal segment, left lower lobe', 'lii', '#6bbab4', 'Segmento basal lateral del lóbulo inferior izquierdo.'),
    l_s10: seg('Segmento basal posterior (S10) — LII', 'Posterior basal segment, left lower lobe', 'lii', '#cdeeeb', 'Segmento basal posterior del lóbulo inferior izquierdo.'),
    // ---- Hilios ----
    hilum_r: seg('Hilio pulmonar derecho', 'Hilum of right lung', 'hilio', '#b07a86', 'Zona de la cara mediastínica por donde entran y salen las estructuras de la raíz pulmonar: bronquio principal, arteria pulmonar, dos venas pulmonares, arterias y venas bronquiales, linfáticos y nervios.', { func: 'A la derecha, el bronquio (epiarterial) queda por encima de la arteria pulmonar. Mnemotecnia RALS: Right Anterior, Left Superior, según la posición de la arteria pulmonar.', clinic: 'Las adenopatías hiliares bilaterales sugieren sarcoidosis; las unilaterales, un tumor o una infección (tuberculosis).' }),
    hilum_l: seg('Hilio pulmonar izquierdo', 'Hilum of left lung', 'hilio', '#a26c78', 'Raíz del pulmón izquierdo. Aquí la arteria pulmonar es la estructura más superior (pasa por encima del bronquio).'),
    // ---- Vía aérea ----
    trachea: seg('Tráquea', 'Trachea', 'via', '#eadfca', 'Tubo de ~10–12 cm × 2 cm, de C6 a T4–T5. Tiene 16–20 anillos cartilaginosos en "C", abiertos hacia atrás y cerrados por el músculo traqueal (liso).', { func: 'Conduce el aire y lo limpia mediante el aparato mucociliar (epitelio pseudoestratificado ciliado con células caliciformes). Es parte del espacio muerto anatómico.', clinic: 'La traqueostomía se hace entre el 2.º y 4.º anillo. La estenosis traqueal tras intubación prolongada produce estridor.' }),
    trach_cart: seg('Cartílagos traqueales', 'Tracheal cartilages', 'via', '#f5f0e2', 'Anillos de cartílago hialino en forma de "C" que mantienen la tráquea abierta.', { func: 'Impiden el colapso de la vía aérea con las presiones negativas de la inspiración. La pared posterior, membranosa, permite que el esófago se expanda al deglutir.', clinic: 'La traqueomalacia (cartílagos blandos) produce colapso espiratorio y estridor en lactantes.' }),
    carina: seg('Carina traqueal', 'Carina', 'via', '#d8c7a5', 'Espolón cartilaginoso en la bifurcación traqueal (T4–T5, ángulo de Louis).', { func: 'Su mucosa es la más sensible al reflejo tusígeno de toda la vía aérea.', clinic: 'En la broncoscopia, una carina ensanchada o roma sugiere adenopatías subcarinales (cáncer pulmonar) o crecimiento de la aurícula izquierda.' }),
    mb_r: seg('Bronquio principal derecho', 'Right main bronchus', 'via', '#e7d7b8', 'Corto (~2,5 cm), ancho y más vertical (~25° respecto al eje traqueal).', { clinic: 'Los cuerpos extraños aspirados y un tubo endotraqueal demasiado profundo (que deja sin ventilación el pulmón izquierdo) van preferentemente a este bronquio.' }),
    mb_l: seg('Bronquio principal izquierdo', 'Left main bronchus', 'via', '#e7d7b8', 'Largo (~5 cm), estrecho y más horizontal (~45°). Pasa bajo el arco aórtico y por delante del esófago.'),
    cart_main: seg('Cartílagos de los bronquios principales', 'Cartilage of main bronchi', 'via', '#f5f0e2', 'Anillos cartilaginosos incompletos de los bronquios principales.'),
    lb_rs: seg('Bronquio lobar superior derecho', 'Right superior lobar bronchus', 'via', '#dccaa6', 'Nace del bronquio principal derecho antes de que este entre al hilio (bronquio epiarterial). Da los bronquios segmentarios B1–B3.'),
    lb_ri: seg('Bronquio intermedio', 'Right intermediate bronchus', 'via', '#dccaa6', 'Continuación del bronquio principal derecho tras dar el lobar superior. Se divide en los lobares medio e inferior.'),
    lb_rm: seg('Bronquio lobar medio', 'Middle lobar bronchus', 'via', '#dccaa6', 'Da los bronquios B4 (lateral) y B5 (medial).'),
    lb_rl: seg('Bronquio lobar inferior derecho', 'Right inferior lobar bronchus', 'via', '#dccaa6', 'Da B6 (superior) y los cuatro basales (B7–B10).'),
    lb_ls: seg('Bronquio lobar superior izquierdo', 'Left superior lobar bronchus', 'via', '#dccaa6', 'Se divide en una división superior (B1+2, B3) y otra lingular (B4, B5).'),
    lb_li: seg('Bronquio lobar inferior izquierdo', 'Left inferior lobar bronchus', 'via', '#dccaa6', 'Da B6 y los bronquios basales.'),
    sb_r: seg('Bronquios segmentarios derechos', 'Right segmental bronchi', 'via', '#d2bc93', 'Diez bronquios terciarios (B1–B10), uno por cada segmento del pulmón derecho.', { func: 'A partir de aquí la vía aérea se divide ~23 veces. Aunque cada bronquiolo es estrecho, el área de sección total aumenta enormemente, por eso la mayor resistencia al flujo está en los bronquios medianos y no en los pequeños.', clinic: 'En el asma, la contracción del músculo liso, el edema y el moco estrechan los bronquios y bronquiolos (Poiseuille: R ∝ 1/r⁴).' }),
    sb_l: seg('Bronquios segmentarios izquierdos', 'Left segmental bronchi', 'via', '#d2bc93', 'Bronquios terciarios del pulmón izquierdo (8–10 según la fusión de segmentos).'),
    cart_lobar: seg('Cartílagos de los bronquios lobares', 'Cartilage of lobar bronchi', 'via', '#f5f0e2', 'En los bronquios lobares y segmentarios el cartílago se fragmenta en placas irregulares. Desaparece en los bronquiolos (< 1 mm).'),
  },

  tours: [
    {
      name: 'Recorrido del aire',
      steps: [
        { title: '1. Tráquea', parts: ['trachea', 'trach_cart'], text: 'El aire entra calentado y humidificado (37 °C, PH₂O 47 mmHg). La PO₂ inspirada traqueal es ≈ (760 − 47) × 0,21 ≈ 150 mmHg.' },
        { title: '2. Carina y bronquios principales', parts: ['carina', 'mb_r', 'mb_l', 'cart_main'], text: 'La tráquea se bifurca en T4–T5. El bronquio derecho es más vertical y ancho, por eso es el destino habitual de los cuerpos extraños aspirados.' },
        { title: '3. Bronquios lobares', parts: ['lb_rs', 'lb_ri', 'lb_rm', 'lb_rl', 'lb_ls', 'lb_li', 'cart_lobar'], text: 'Tres lóbulos a la derecha (superior, medio e inferior) y dos a la izquierda (superior con língula, e inferior).' },
        { title: '4. Bronquios segmentarios', parts: ['sb_r', 'sb_l'], text: 'Cada bronquio terciario ventila un segmento broncopulmonar. Hasta los bronquiolos terminales todo es zona de conducción: el espacio muerto anatómico (~150 mL).' },
        { title: '5. Segmentos del pulmón derecho', parts: ['r_s1', 'r_s2', 'r_s3', 'r_s4', 'r_s5', 'r_s6', 'r_s7', 'r_s8', 'r_s9', 'r_s10'], text: 'Diez segmentos. Ventilación alveolar = (VT − VD) × FR = (500 − 150) × 12 ≈ 4,2 L/min.' },
        { title: '6. Segmentos del pulmón izquierdo', parts: ['l_s12', 'l_s2', 'l_s3', 'l_s4', 'l_s5', 'l_s6', 'l_s7', 'l_s8', 'l_s9', 'l_s10'], text: 'La língula reemplaza al lóbulo medio. En bipedestación, las bases están mejor ventiladas y mucho mejor perfundidas que los ápices.' },
        { title: '7. Alvéolos: hematosis', parts: ['r_s9', 'r_s10', 'l_s9', 'l_s10'], text: 'En ~300 millones de alvéolos (~70 m²), el O₂ difunde a la sangre (PAO₂ ≈ 100 mmHg → PaO₂ ≈ 95) y el CO₂ sale (PvCO₂ 46 → PACO₂ 40). La sangre se equilibra en ~0,25 s de los ~0,75 s que pasa por el capilar.' },
        { title: '8. Hilios', parts: ['hilum_r', 'hilum_l'], text: 'Por el hilio entran el bronquio y la arteria pulmonar y salen las venas pulmonares, ahora con sangre oxigenada hacia la aurícula izquierda.' },
      ],
    },
  ],

  physiology: [
    {
      title: 'Mecánica ventilatoria',
      open: true,
      html: `
<ul>
<li><b>Inspiración (activa):</b> el diafragma (nervio frénico, C3–C5) desciende y los intercostales externos elevan las costillas. El volumen torácico aumenta, la presión pleural pasa de −5 a −7,5 cmH₂O y la alveolar baja a ~−1 cmH₂O, así que el aire entra.</li>
<li><b>Espiración en reposo (pasiva):</b> la retracción elástica del pulmón y la pared lleva la presión alveolar a ~+1 cmH₂O. La espiración forzada recluta abdominales e intercostales internos.</li>
<li><b>Distensibilidad (compliance)</b> = ΔV/ΔP ≈ 200 mL/cmH₂O. Disminuye en la fibrosis y el edema, y aumenta en el enfisema.</li>
<li><b>Surfactante</b> (neumocitos tipo II, dipalmitoilfosfatidilcolina): reduce la tensión superficial y evita el colapso de los alvéolos pequeños (ley de Laplace: P = 2T/r). Su déficit produce el síndrome de distrés respiratorio del recién nacido prematuro.</li>
</ul>
<p>Pulsa <b>▶ Respiración</b> para ver el espirograma y las presiones en tiempo real.</p>`,
    },
    {
      title: 'Volúmenes y capacidades',
      html: `
<table>
<tr><th>Parámetro</th><th>Valor aprox. (adulto 70 kg)</th></tr>
<tr><td>Volumen corriente (VT)</td><td>500 mL</td></tr>
<tr><td>Volumen de reserva inspiratorio</td><td>3000 mL</td></tr>
<tr><td>Volumen de reserva espiratorio</td><td>1100 mL</td></tr>
<tr><td>Volumen residual (VR)*</td><td>1200 mL</td></tr>
<tr><td>Capacidad residual funcional (CRF)*</td><td>2300 mL (VRE + VR)</td></tr>
<tr><td>Capacidad vital (CV)</td><td>4600 mL</td></tr>
<tr><td>Capacidad pulmonar total (CPT)*</td><td>5800 mL</td></tr>
</table>
<p class="small muted">* No se miden con espirometría simple: requieren pletismografía o dilución de helio.</p>
<p><b>Espacio muerto:</b> anatómico ~150 mL. El fisiológico se calcula con la ecuación de Bohr: VD/VT = (PaCO₂ − PECO₂)/PaCO₂. <b>Patrón obstructivo:</b> VEF₁/CVF &lt; 0,7. <b>Restrictivo:</b> CPT disminuida con VEF₁/CVF normal o aumentado.</p>`,
    },
    {
      title: 'Intercambio gaseoso y V/Q',
      html: `
<p><b>Gas alveolar:</b> PAO₂ = FiO₂ × (Patm − PH₂O) − PaCO₂/R = 0,21 × 713 − 40/0,8 ≈ 100 mmHg. Gradiente A–a normal &lt; 10–15 mmHg (aumenta con la edad).</p>
<p><b>Ley de Fick:</b> la difusión es proporcional al área × gradiente / grosor. El CO₂ difunde ~20 veces más rápido que el O₂.</p>
<p><b>Relación V/Q</b> (normal global ≈ 0,8):</p>
<ul>
<li>Ápex: V/Q ≈ 3 (PAO₂ alta). Base: V/Q ≈ 0,6 (en bipedestación hay más ventilación <i>y mucha más</i> perfusión).</li>
<li><b>Shunt</b> (V/Q = 0): no corrige con O₂ al 100 %. <b>Espacio muerto</b> (V/Q = ∞), por ejemplo en el tromboembolismo pulmonar.</li>
<li><b>Vasoconstricción pulmonar hipóxica:</b> desvía el flujo lejos de los alvéolos mal ventilados (al revés que en la circulación sistémica).</li>
</ul>`,
    },
    {
      title: 'Transporte de O₂ y CO₂',
      html: `
<ul>
<li>El O₂ viaja casi todo unido a la hemoglobina: CaO₂ = 1,34 × Hb × SaO₂ + 0,003 × PaO₂ ≈ 20 mL/dL.</li>
<li><b>Curva de disociación de la Hb</b> (sigmoidea, P50 ≈ 27 mmHg). Se desplaza a la derecha (libera más O₂ en los tejidos) con ↑CO₂, ↑H⁺ (efecto Bohr), ↑temperatura y ↑2,3-DPG. La HbF y el CO la desplazan a la izquierda.</li>
<li><b>CO₂:</b> ~70 % como HCO₃⁻ (anhidrasa carbónica del eritrocito, con intercambio de Cl⁻: <i>chloride shift</i>), ~23 % como carbaminohemoglobina y ~7 % disuelto. Efecto Haldane: la Hb desoxigenada transporta más CO₂.</li>
</ul>`,
    },
    {
      title: 'Control de la ventilación',
      html: `
<ul>
<li><b>Centros bulbares</b>: grupo respiratorio dorsal (inspiración) y ventral (espiración forzada). El complejo pre-Bötzinger genera el ritmo. Los centros pontinos (neumotáxico y apnéustico) modulan el patrón.</li>
<li><b>Quimiorreceptores centrales</b> (superficie ventral del bulbo): responden al H⁺ del LCR, que refleja la PaCO₂. Son el estímulo principal minuto a minuto.</li>
<li><b>Quimiorreceptores periféricos</b> (cuerpos carotídeos, vía nervio IX; aórticos, vía X): responden a PaO₂ &lt; 60 mmHg, ↑PaCO₂ y ↑H⁺.</li>
</ul>
<p class="clinic">En la EPOC con retención crónica de CO₂, el estímulo principal puede pasar a ser la hipoxemia. Por eso el O₂ se titula hacia SatO₂ 88–92 %.</p>`,
    },
  ],
};

// Riñón izquierdo — modelo combinado:
//  - Parénquima (cápsula, corteza, columnas, pirámides, papilas, hilio): Human Reference Atlas (CC BY 4.0).
//  - Pelvis renal, uréter, glándula suprarrenal, arterias y venas renales/intrarrenales: Z-Anatomy
//    (CC BY-SA 4.0), alineados por ICP al riñón del HRA.

const RED = '#c8372f';
const BLUE = '#3f66c9';

export default {
  id: 'kidney',
  name: 'Riñón',
  subtitle: 'Sistema urinario · Fisiología II',
  models: ['models/kidney-hra.glb', 'models/kidney-za-organs.glb', 'models/kidney-za-vessels.glb'],
  xray: { groups: ['externa'], label: 'Cápsula y corteza' },
  frame: ['capsule', 'suprarenal', 'pelvis'],
  labelParts: ['cortex', 'pelvis', 'ureter', 'renal_a', 'renal_v', 'suprarenal'],

  groups: [
    { id: 'externa', name: 'Cápsula y corteza', color: '#a9554a' },
    { id: 'interna', name: 'Médula y columnas', color: '#8b3f45' },
    { id: 'via', name: 'Vía urinaria', color: '#e6c76a' },
    { id: 'arterias', name: 'Arterias', color: RED },
    { id: 'venas', name: 'Venas', color: BLUE },
    { id: 'supra', name: 'Glándula suprarrenal', color: '#d9a441' },
  ],

  groupInfo: {
    interna: { func: 'La médula contiene las asas de Henle de las nefronas yuxtamedulares, los túbulos colectores y los vasos rectos. El intersticio medular es hiperosmolar: va de 300 mOsm/kg en el límite corticomedular a ~1200 mOsm/kg en la papila. Ese gradiente permite concentrar la orina.' },
    arterias: { func: 'Los riñones reciben ~20–25 % del gasto cardíaco (flujo sanguíneo renal ≈ 1,1 L/min; flujo plasmático renal ≈ 600 mL/min). Secuencia: renal → segmentarias → interlobares → arcuatas → interlobulillares (radiales corticales) → arteriola aferente → glomérulo → arteriola eferente → capilares peritubulares o vasos rectos.', clinic: 'Las arterias segmentarias son terminales (sin anastomosis): su oclusión produce un infarto renal en cuña. La estenosis de la arteria renal activa el sistema renina-angiotensina-aldosterona y causa hipertensión renovascular.' },
    venas: { func: 'El retorno venoso sigue el trayecto inverso hasta la vena renal, que desemboca en la vena cava inferior.' },
  },

  parts: {
    capsule: {
      name: 'Cápsula renal', en: 'Renal capsule', group: 'externa', color: '#b8665a', opacity: 0.35,
      desc: 'Capa fibrosa delgada que envuelve el parénquima. Por fuera la rodean la grasa perirrenal y la fascia renal (de Gerota). Se muestra semitransparente por defecto.',
      clinic: 'Su distensión brusca (obstrucción, pielonefritis o hematoma) causa el dolor lumbar con puño-percusión positiva.',
    },
    cortex: {
      name: 'Corteza renal', en: 'Renal cortex', group: 'externa', color: '#a64e44',
      desc: 'Zona externa granular de ~1 cm. Contiene los corpúsculos renales (glomérulos), los túbulos contorneados proximales y distales, y los rayos medulares.',
      func: 'Aquí ocurre la filtración glomerular (TFG ≈ 125 mL/min ≈ 180 L/día) y la mayor parte de la reabsorción (~65 % en el túbulo proximal). El 85 % de las nefronas son corticales, con asas de Henle cortas.',
      clinic: 'La necrosis cortical y la glomerulonefritis afectan esta zona. La TFG estimada (creatinina, CKD-EPI) clasifica la enfermedad renal crónica.',
    },
    columns: {
      name: 'Columnas renales (de Bertin)', en: 'Renal columns', group: 'interna', color: '#b05a50',
      desc: 'Prolongaciones de tejido cortical que se introducen entre las pirámides. Por ellas pasan las arterias y venas interlobares.',
      clinic: 'Una columna de Bertin hipertrófica puede simular una masa renal en la ecografía (pseudotumor).',
    },
    pyramids: {
      name: 'Pirámides renales (médula)', en: 'Renal pyramids', group: 'interna', color: '#7e3640',
      desc: 'Estructuras cónicas estriadas (8–18 por riñón; el modelo tiene 9) con la base hacia la corteza y el vértice (papila) hacia el seno renal. Cada pirámide con su corteza forma un lóbulo renal.',
      func: 'Contienen las asas de Henle, los túbulos colectores y los vasos rectos. El sistema multiplicador por contracorriente y el reciclaje de urea crean el gradiente osmótico. La ADH abre las acuaporinas-2 del colector para concentrar la orina hasta ~1200 mOsm/kg.',
      clinic: 'La necrosis papilar aparece con AINEs, diabetes, drepanocitosis y pielonefritis. En la diabetes insípida (falta de ADH o resistencia a ella) no se concentra la orina y hay poliuria.',
    },
    papillae: {
      name: 'Papilas renales', en: 'Renal papillae', group: 'interna', color: '#e0a0a8',
      desc: 'Vértices de las pirámides. Su área cribosa tiene los orificios de los conductos papilares (de Bellini), que vierten la orina en los cálices menores.',
      func: 'Es la zona de máxima osmolaridad intersticial (~1200 mOsm/kg). Desde aquí la orina ya no se modifica.',
    },
    hilum: {
      name: 'Hilio y seno renal', en: 'Renal hilum / sinus', group: 'via', color: '#e8d9a0',
      desc: 'Hendidura medial por donde pasan, de anterior a posterior, la vena renal, la arteria renal y la pelvis (mnemotecnia VAP). Se continúa hacia dentro con el seno renal, que contiene grasa, cálices y vasos.',
    },
    pelvis: {
      name: 'Pelvis renal y cálices', en: 'Renal pelvis', group: 'via', color: '#f0cf5a',
      desc: 'Embudo colector: los cálices menores se unen en 2–3 cálices mayores, que forman la pelvis. Esta se continúa con el uréter en la unión pieloureteral.',
      func: 'Su músculo liso tiene actividad marcapaso que inicia el peristaltismo ureteral (ondas de 1–5 por minuto).',
      clinic: 'La obstrucción de la unión pieloureteral es la causa más frecuente de hidronefrosis congénita. Los cálculos coraliformes (estruvita, por Proteus) ocupan la pelvis y los cálices.',
    },
    ureter: {
      name: 'Uréter', en: 'Ureter', group: 'via', color: '#e6c25a',
      desc: 'Tubo muscular de 25–30 cm que lleva la orina a la vejiga por peristaltismo. Pasa por detrás de los vasos gonadales y por delante de los vasos ilíacos.',
      clinic: 'Tiene tres estrecheces donde se impactan los cálculos (cólico renal): la unión pieloureteral, el cruce de los vasos ilíacos y la unión ureterovesical. En la histerectomía corre riesgo porque pasa bajo la arteria uterina ("el agua pasa bajo el puente").',
    },
    suprarenal: {
      name: 'Glándula suprarrenal izquierda', en: 'Left suprarenal gland', group: 'supra', color: '#d9a441',
      desc: 'Glándula endocrina semilunar sobre el polo superior y medial del riñón, dentro de la fascia renal.',
      func: 'Corteza, con sus tres zonas: glomerular (aldosterona, regulada por angiotensina II y K⁺), fascicular (cortisol, regulado por ACTH) y reticular (andrógenos). La médula secreta adrenalina y noradrenalina.',
      clinic: 'Hiperaldosteronismo primario (síndrome de Conn): hipertensión con hipopotasemia. Feocromocitoma: crisis de hipertensión, cefalea, sudoración y palpitaciones.',
    },
    renal_a: { name: 'Arteria renal izquierda', en: 'Left renal artery', group: 'arterias', color: RED, desc: 'Nace de la aorta a la altura de L1–L2 y es más corta que la derecha. Da la arteria suprarrenal inferior y se divide en las ramas anterior y posterior en el hilio.', clinic: 'La displasia fibromuscular (mujeres jóvenes, imagen en "collar de cuentas") y la ateroesclerosis (adultos mayores, en el ostium) causan estenosis renal e hipertensión renovascular.' },
    renal_a_ant: { name: 'Rama anterior de la arteria renal', en: 'Anterior branch of renal artery', group: 'arterias', color: RED, desc: 'Da las arterias segmentarias superior, anterosuperior, anteroinferior e inferior.' },
    renal_a_post: { name: 'Rama posterior de la arteria renal', en: 'Posterior branch of renal artery', group: 'arterias', color: RED, desc: 'Irriga el segmento posterior. Entre los territorios anterior y posterior queda una línea relativamente avascular (línea de Brödel), usada en el abordaje quirúrgico.' },
    intrarenal_a: {
      name: 'Arterias intrarrenales', en: 'Intrarenal arteries', group: 'arterias', color: '#e0443a',
      desc: 'Arterias segmentarias, interlobares (en las columnas), arcuatas (en la base de las pirámides) e interlobulillares (hacia la corteza).',
      func: 'Autorregulación: la TFG y el flujo renal se mantienen casi constantes con presiones arteriales medias de 80–180 mmHg, gracias al reflejo miogénico de la arteriola aferente y a la retroalimentación tubuloglomerular (mácula densa).',
    },
    suprarenal_a: { name: 'Arteria suprarrenal inferior', en: 'Inferior suprarenal artery', group: 'arterias', color: RED, desc: 'Rama de la arteria renal hacia la glándula suprarrenal, que además recibe arterias suprarrenales superior (de la frénica inferior) y media (de la aorta).' },
    renal_v: { name: 'Vena renal izquierda', en: 'Left renal vein', group: 'venas', color: BLUE, desc: 'Más larga que la derecha. Cruza por delante de la aorta, bajo la arteria mesentérica superior, para llegar a la VCI. Recibe las venas gonadal y suprarrenal izquierdas.', clinic: 'Síndrome del cascanueces: compresión entre la aorta y la mesentérica superior, con hematuria y varicocele izquierdo. Un tumor renal izquierdo puede producir varicocele izquierdo de aparición brusca.' },
    intrarenal_v: { name: 'Venas intrarrenales', en: 'Intrarenal veins', group: 'venas', color: '#5a7fe0', desc: 'Venas interlobulillares, arcuatas, interlobares y segmentarias. A diferencia de las arterias, se anastomosan entre sí.' },
  },

  tours: [
    {
      name: 'De la sangre a la orina',
      steps: [
        { title: '1. Arteria renal', parts: ['renal_a', 'renal_a_ant', 'renal_a_post'], text: 'Llega ~20 % del gasto cardíaco (~1,1 L/min de sangre, ~600 mL/min de plasma). En el hilio se divide en ramas anterior y posterior, y luego en arterias segmentarias terminales.' },
        { title: '2. Arterias intrarrenales', parts: ['intrarenal_a', 'columns'], text: 'Interlobares en las columnas de Bertin → arcuatas en la base de las pirámides → interlobulillares en la corteza → arteriolas aferentes.' },
        { title: '3. Corteza: filtración', parts: ['cortex'], text: 'En ~1 millón de glomérulos por riñón se filtran ~125 mL/min (fracción de filtración ≈ 20 %). Fuerzas de Starling: P. capilar glomerular (~55) − P. Bowman (~15) − P. oncótica (~30) ≈ +10 mmHg.' },
        { title: '4. Médula: concentración', parts: ['pyramids'], text: 'Las asas de Henle y los colectores atraviesan las pirámides. El gradiente intersticial (300 → 1200 mOsm/kg) más la ADH permiten excretar orina de 50 a 1200 mOsm/kg. Explora la pestaña Nefrona.' },
        { title: '5. Papilas y cálices', parts: ['papillae', 'pelvis'], text: 'La orina final sale por los conductos de Bellini a los cálices menores → mayores → pelvis. Se forman ~1–2 L/día: solo ~1 % del filtrado.' },
        { title: '6. Uréter', parts: ['ureter', 'pelvis'], text: 'Ondas peristálticas llevan la orina a la vejiga. La unión ureterovesical oblicua actúa como válvula antirreflujo.' },
        { title: '7. Retorno venoso', parts: ['intrarenal_v', 'renal_v'], text: 'La sangre ya filtrada vuelve por la vena renal a la VCI. La vena renal izquierda cruza por delante de la aorta.' },
        { title: '8. Suprarrenal y SRAA', parts: ['suprarenal', 'suprarenal_a'], text: 'Si baja la perfusión renal, las células yuxtaglomerulares liberan renina → angiotensina II → la zona glomerular suprarrenal secreta aldosterona → el túbulo colector reabsorbe Na⁺ y secreta K⁺.' },
      ],
    },
  ],

  physiology: [
    {
      title: 'Filtración glomerular',
      open: true,
      html: `
<p><b>TFG = Kf × [(P<sub>CG</sub> − P<sub>B</sub>) − (π<sub>CG</sub> − π<sub>B</sub>)]</b> ≈ 125 mL/min (180 L/día).</p>
<ul>
<li>La barrera de filtración tiene tres capas: endotelio fenestrado, membrana basal (con carga negativa) y podocitos (diafragmas de hendidura con nefrina). Filtra libremente moléculas &lt; 7 kDa; la albúmina (69 kDa, negativa) casi no pasa.</li>
<li>Contraer la arteriola <b>aferente</b> baja la TFG y el flujo renal. Contraer la <b>eferente</b> (angiotensina II) sube la TFG y baja el flujo renal, así que aumenta la fracción de filtración.</li>
<li><b>Aclaramiento</b>: C = (U × V)/P. Inulina = TFG; PAH ≈ flujo plasmático renal. La creatinina sobrestima un poco la TFG porque también se secreta.</li>
</ul>
<p class="clinic">Los IECA y ARA-II dilatan la eferente: protegen el glomérulo en la diabetes, pero pueden hacer caer la TFG en la estenosis renal bilateral.</p>`,
    },
    {
      title: 'Manejo tubular por segmento',
      html: `
<table>
<tr><th>Segmento</th><th>Qué hace</th><th>Fármaco / clínica</th></tr>
<tr><td>Túbulo proximal</td><td>Reabsorbe 65 % del Na⁺ y del agua (isoosmótico), 100 % de la glucosa y los aminoácidos, ~80 % del HCO₃⁻. Secreta ácidos y bases orgánicos.</td><td>Acetazolamida (inhibe la anhidrasa carbónica), iSGLT2. Síndrome de Fanconi.</td></tr>
<tr><td>Asa descendente</td><td>Permeable al agua, no a los solutos: el líquido se concentra.</td><td>—</td></tr>
<tr><td>Rama ascendente gruesa</td><td>Impermeable al agua. Cotransportador NKCC2 (25 % del Na⁺): diluye el túbulo y genera el gradiente medular. Reabsorbe Ca²⁺ y Mg²⁺ por vía paracelular.</td><td>Furosemida. Síndrome de Bartter.</td></tr>
<tr><td>Túbulo distal</td><td>Cotransportador NCC (5 % del Na⁺). Reabsorbe Ca²⁺ (regulado por PTH).</td><td>Tiazidas. Síndrome de Gitelman.</td></tr>
<tr><td>Colector</td><td>Células principales: ENaC (Na⁺), ROMK (K⁺) y acuaporina-2 (ADH). Células intercaladas α: secretan H⁺.</td><td>Espironolactona, amilorida. Diabetes insípida. SIADH.</td></tr>
</table>`,
    },
    {
      title: 'Concentración de la orina',
      html: `
<ul>
<li><b>Multiplicador por contracorriente:</b> la rama ascendente gruesa bombea NaCl al intersticio sin agua, la descendente pierde agua, y el gradiente se multiplica hasta ~1200 mOsm/kg en la papila.</li>
<li><b>Reciclaje de urea</b> (transportadores UT-A1/A3 en el colector medular, estimulados por la ADH): aporta ~50 % de la osmolaridad medular.</li>
<li><b>Vasos rectos</b> (intercambio por contracorriente): irrigan la médula sin "lavar" el gradiente.</li>
<li><b>ADH (vasopresina):</b> el receptor V2 activa el AMPc, que inserta acuaporina-2 en la membrana apical del colector y aumenta la reabsorción de agua.</li>
</ul>`,
    },
    {
      title: 'Regulación hormonal',
      html: `
<ul>
<li><b>Sistema renina-angiotensina-aldosterona:</b> se activa por ↓perfusión, ↓NaCl en la mácula densa o estímulo simpático β₁. La angiotensina II produce vasoconstricción, contrae la eferente, estimula la aldosterona, la ADH y la sed, y aumenta la reabsorción proximal de Na⁺.</li>
<li><b>Aldosterona:</b> ↑ENaC y bomba Na⁺/K⁺ en las células principales: reabsorbe Na⁺ y secreta K⁺ y H⁺.</li>
<li><b>Péptido natriurético auricular:</b> se libera por distensión auricular; dilata la aferente (↑TFG), inhibe la renina y produce natriuresis.</li>
<li><b>Funciones endocrinas del riñón:</b> eritropoyetina (fibroblastos peritubulares, en respuesta a hipoxia), calcitriol (1α-hidroxilasa proximal, estimulada por PTH) y renina.</li>
</ul>
<p class="clinic">En la enfermedad renal crónica aparecen anemia (falta de EPO), hiperparatiroidismo secundario (falta de calcitriol e hiperfosfatemia), acidosis metabólica e hiperpotasemia.</p>`,
    },
  ],
};

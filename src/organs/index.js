import heart from './heart.js';
import stomach from './stomach.js';
import lungs from './lungs.js';
import kidney from './kidney.js';
import nephron from './nephron.js';
import liver from './liver.js';
import brain from './brain.js';
import { EXTRAS } from './extras.js';

heart.icon = '🫀';
stomach.icon = '🫃';
lungs.icon = '🫁';
kidney.icon = '🫘';
nephron.icon = '🔬';
liver.icon = '🟤';
brain.icon = '🧠';

// Para agregar un órgano nuevo: crear su archivo de datos, extraer el GLB (ver tools/) y añadirlo aquí.
export const organs = [heart, lungs, stomach, liver, kidney, nephron, brain];
for (const o of organs) Object.assign(o, EXTRAS[o.id] || {});

export const comingSoon = [];

import heart from './heart.js';
import stomach from './stomach.js';
import lungs from './lungs.js';
import kidney from './kidney.js';
import nephron from './nephron.js';
import liver from './liver.js';
import brain from './brain.js';
import { EXTRAS } from './extras.js';
import eye from './eye.js';
import intestine from './intestine.js';

// Para agregar un órgano nuevo: crear su archivo de datos, extraer el GLB (ver tools/) y añadirlo aquí.
export const organs = [heart, lungs, stomach, intestine, liver, kidney, nephron, brain, eye];
for (const o of organs) Object.assign(o, EXTRAS[o.id] || {});

export const comingSoon = [];

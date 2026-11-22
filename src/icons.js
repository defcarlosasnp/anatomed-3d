// Íconos de línea (SVG, 24x24, trazo = color del texto).
const svg = (body) =>
  `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const ICONS = {
  reset: svg('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'),
  tag: svg('<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.3"/>'),
  layers: svg('<path d="M12 3 2 8l10 5 10-5z"/><path d="m2 13 10 5 10-5" opacity=".55"/>'),
  cut: svg('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1 20 20M8.1 15.9 20 4"/>'),
  play: svg('<path d="M7 4.5v15l12-7.5z"/>'),
  pause: svg('<path d="M8 4v16M16 4v16"/>'),
  zap: svg('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  grid: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  drop: svg('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
  eyes: svg('<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/><path d="M19 3l2 2-2 2"/>'),
  spark: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
  pin: svg('<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
  pencil: svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
  route: svg('<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16"/>'),
  target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  book: svg('<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20"/>'),
};

// ojo abierto + ojo tachado; el CSS muestra uno u otro según la clase .off
export const EYE =
  svg('<path class="eye-on" d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle class="eye-on" cx="12" cy="12" r="2.5"/>') +
  svg('<path class="eye-off" d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.6 6.6C3.7 8.4 2 12 2 12s3.5 6 10 6a9.7 9.7 0 0 0 4.4-1"/>');

/** Inserta el ícono indicado en data-icon al inicio de cada botón. */
export function iconize(buttons) {
  buttons.forEach((b) => b.insertAdjacentHTML('afterbegin', ICONS[b.dataset.icon] || ''));
}

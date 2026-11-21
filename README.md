# AnatoMed 3D

Atlas anatómico 3D interactivo para estudiar anatomía y fisiología en el navegador.

## Cómo usarlo

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Para generar una versión estática (carpeta `dist/`, se puede subir a GitHub Pages, Netlify, etc.):

```bash
npm run build
```

## Órganos

| Órgano | Fuente de los modelos | Destacado |
|---|---|---|
| **Corazón** (42) | HRA (cámaras, tabique, mitral y tricúspide completas, 5 papilares) + Z-Anatomy (sigmoideas por valva, coronarias, venas cardíacas, grandes vasos), alineados por ICP | Latido con ECG y válvulas, sistema de conducción, cuerdas tendinosas generadas |
| **Pulmones** (37) | HRA | 20 segmentos broncopulmonares, árbol bronquial con cartílagos; respiración con espirograma y presiones |
| **Estómago** (19) | Z-Anatomy | 5 regiones seleccionables, capas de la pared (aparecen con el corte), peristaltismo |
| **Hígado** (26) | Z-Anatomy | 8 segmentos de Couinaud, sistema porta, venas hepáticas, vía biliar |
| **Riñón** (16) | HRA (corteza, columnas, pirámides, papilas) + Z-Anatomy (pelvis, uréter, vasos intrarrenales, suprarrenal), alineados por ICP | Corte coronal con la arquitectura interna |
| **Nefrona** (13) | Generada por código | Flujo tubular coloreado por osmolaridad, gradiente medular, botón ADH |
| **Encéfalo** (142) | Allen Human Brain (vía HRA) | Giros, ganglios basales, núcleos talámicos, sistema límbico, ventrículos; 5 recorridos |

## Herramientas

| Herramienta | Qué hace |
|---|---|
| Rotar / zoom / mover | Arrastrar, rueda, clic derecho (en el celular: 1 dedo, pellizcar, 2 dedos) |
| Clic / doble clic | Información de la estructura / enfocarla |
| Lista lateral | Mostrar u ocultar, buscar, aislar, restaurar |
| ✂ Corte | Plano sagital, transversal o coronal |
| ◐ Transparencia | Vuelve translúcida la capa externa de cada órgano |
| 🏷 Etiquetas | Nombres sobre el modelo |
| ▶ Animación | Latido, respiración, peristaltismo o flujo tubular, según el órgano |
| 🧭 Recorrido | Guías paso a paso (con menú si hay varias) |
| 🎯 Quiz | 10 preguntas: haz clic en la estructura pedida |

## Estructura del proyecto

```
public/models/          GLB extraídos y comprimidos (meshopt)
src/viewer.js           motor 3D (Three.js): carga, picking, corte, cámara, etiquetas, partes generadas
src/effects/            latido + conducción, cuerdas tendinosas, respiración, estómago, nefrona
src/organs/*.js         contenido de cada órgano (textos, grupos, colores, recorridos, fisiología)
src/main.js             interfaz
tools/                  scripts para extraer, alinear, comprimir y validar modelos
tools/configs/          configuraciones usadas para generar los GLB actuales
```

## Agregar un órgano nuevo

1. Instalar las herramientas: `npm i -D fbx2gltf @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions meshoptimizer`.
2. Descargar las fuentes en `sources/`:
   - **Z-Anatomy**: los FBX de `Resources/Models/FBX/` en github.com/LluisV/Z-Anatomy (rama `PC-Version`). Se convierten con `FBX2glTF --binary`.
   - **Human Reference Atlas**: los GLB de github.com/hubmapconsortium/ccf-releases (`vX.Y/models/`). Ya vienen en GLB.
3. Ver los nombres de los nodos con `node tools/inspect.mjs archivo.glb "filtro" 99`.
4. Si se combinan fuentes, calcular la alineación con `node tools/align.mjs config.json T.json`. Usa ICP con escala; ver `tools/configs/align-heart.json`.
5. Extraer las piezas con `node tools/extract.mjs entrada.glb salida.glb - config.json`. La config asigna a cada nodo una clave corta; un array de nodos los agrupa en una sola pieza, y `"transform": "T.json"` aplica la alineación.
6. Comprimir con `node tools/compress.mjs salida.glb=public/models/x.glb`. No conviene si el código edita los vértices en vivo, como el peristaltismo.
7. Crear `src/organs/<organo>.js` (ver `lungs.js`), registrarlo en `src/organs/index.js` y comprobar con `node tools/validate.mjs`.

## Créditos y licencias

- **Z-Anatomy** (https://www.z-anatomy.com), basado en BodyParts3D (© The Database Center for Life Science). Licencia [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- **Human Reference Atlas** (NIH Common Fund HuBMAP, https://humanatlas.io/3d-reference-library). Modelos del Visible Human Project (NLM) y del Allen Human Brain Reference Atlas (Allen Institute). Licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Si publicas la app, mantén estas atribuciones. Los modelos derivados de Z-Anatomy deben compartirse bajo CC BY-SA.

## Notas y limitaciones

- **Alineación entre fuentes:** el corazón y el riñón combinan cuerpos distintos. Quedan diferencias de ~3 mm, y alguna valva sigmoidea puede asomar levemente por la pared.
- **Elementos esquemáticos:** el sistema de conducción, las cuerdas tendinosas, las capas gástricas y la nefrona se generan por código. Son correctos en su organización, pero no son mallas anatómicas.
- **Regiones del estómago:** son aproximadas. Se calculan a partir de los puntos de referencia de Z-Anatomy.
- **Lado de los modelos:** el riñón es el izquierdo. Los núcleos del tálamo y de la amígdala están ocultos por defecto, porque se superponen a la estructura completa.
- **Uso:** el contenido es de apoyo al estudio y no reemplaza la bibliografía de los ramos.

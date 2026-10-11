Análogos – sitio web (v0.1)

HTML + CSS + JS. No requiere instalar nada: abre `index.html` con la extensión Live Server de VS Code.
Para publicar: sube la carpeta a GitHub e impórtala en Vercel (sin configuración).

Archivos
- `index.html`  Estructura y textos de la página
- `css/style.css`  Diseño (colores en `:root`)
- `js/data.js`  DATOS: sitios de Luna/Marte (Andrés) y análogos terrestres (Emma). Aquí hay q editar más.
- `js/main.js`  Planeta 3D (Three.js), botones yyy cálculo del índice de similitud.
- `assets/` imágenes de las texturas y luego heightmaps y modelos.

Qué es de ejemplo (hay que cambiar)
1. Valores `v` en `js/data.js`  reemplazar con datos reales normalizados 0–1.
2. Los 5 análogos terrestres, sustituir por los de Emma y añadir los 2 de montaña.
3. La textura procedural ya usamos assets. hay q limpiar
4. Falta: fichas por sitio (flora/fauna/minerales), terreno 3D con heightmaps, modo rover, equipo, branding, video etc

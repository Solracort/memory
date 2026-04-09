# Memory Cards Game

Juego de memoria PWA desarrollado con **LitElement** y **Vite** para la prueba técnica de BBVA.

## Demo

🔗 [Ver aplicación desplegada](#) ← *(actualizar con URL de Netlify tras el deploy)*

---

## Descripción del juego

Se muestra un tablero 3×3 con los números del 1 al 9 en posiciones aleatorias. El jugador debe memorizarlos en el tiempo permitido según la dificultad, y después localizar el número que se le pide.

| Dificultad | Tiempo para memorizar | Puntos por acierto | Números a recordar |
|------------|----------------------|--------------------|--------------------|
| Bajo       | 10 segundos          | 10 pts             | 1                  |
| Medio      | 5 segundos           | 20 pts             | 1                  |
| Alto       | 2 segundos           | 30 pts             | 3 (bonus)          |

---

## Tecnologías

- **LitElement** (lit v3) — Web Components reactivos
- **Vite** — bundler y servidor de desarrollo
- **vite-plugin-pwa** + **Workbox** — service worker y soporte offline
- **Vitest** — tests unitarios con cobertura
- **ESLint** + **Prettier** — calidad y formato del código

---

## Estructura del proyecto

```
src/
├── components/
│   ├── app-button.js           # Botón reutilizable
│   ├── memory-card.js          # Carta individual del tablero
│   └── difficulty-selector.js  # Selector de dificultad
├── views/
│   ├── home-view.js            # Vista de login (ruta #/home)
│   ├── home-view.styles.js     # Estilos de home-view
│   ├── game-view.js            # Vista del juego (ruta #/game)
│   └── game-view.styles.js     # Estilos de game-view
├── services/
│   ├── game-service.js         # Lógica del juego (tablero, respuestas)
│   └── user-service.js         # Gestión del usuario en localStorage
├── constants/
│   └── game-config.js          # Configuración de dificultades
├── router.js                   # Router hash-based minimalista
├── app.js                      # Componente raíz <memory-app>
└── main.js                     # Punto de entrada + registro SW
test/
├── setup.js                    # Polyfills para LitElement en jsdom
├── services/                   # Tests de game-service y user-service
├── components/                 # Tests de los 3 componentes base
└── views/                      # Tests de home-view y game-view
```

---

## Instalación y ejecución local

### Requisitos previos

- Node.js v18 o superior
- npm v9 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd memory-game

# 2. Instalar dependencias
npm install

# 3. Arrancar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## Tests

```bash
# Ejecutar todos los tests con cobertura
npm test

# Modo watch (re-ejecuta al guardar)
npm run test:watch
```

El informe de cobertura HTML se genera en `coverage/index.html`.

---

## Build de producción

```bash
npm run build
```

Los archivos optimizados se generan en la carpeta `dist/`. El service worker de Workbox se genera automáticamente y precachea todos los assets para soporte offline.

---

## Linting y formato

```bash
# Analizar el código con ESLint
npm run lint

# Formatear con Prettier
npm run format
```

---

## PWA — Funcionalidad offline

La app usa un **service worker** generado por `vite-plugin-pwa` con la estrategia **precache** de Workbox:

1. En el primer acceso, el SW cachea todos los archivos JS, CSS y HTML
2. En accesos posteriores (incluso sin conexión), se sirven desde la caché
3. La app puede instalarse en la pantalla de inicio de dispositivos móviles

---

## Funcionalidades bonus implementadas

- ⏱ **Countdown visible** — muestra los segundos restantes; parpadea en rojo cuando quedan ≤ 3 s
- 📳 **Vibración al perder** — usa `navigator.vibrate(500)` en dispositivos compatibles
- 🧩 **3 números en dificultad "Alto"** — el jugador debe localizar 3 números consecutivos por ronda

---

## Decisiones técnicas

- **Router hash-based**: se usa `window.location.hash` en lugar de la History API para evitar configuración adicional de servidor. Las rutas son `#/home` y `#/game`.
- **localStorage**: almacena el nombre del jugador y el récord (high score), sin backend.
- **CSS con metodología BEM**: las clases siguen el patrón `bloque__elemento--modificador`.
- **CSS custom properties**: los colores principales se definen en el componente raíz para facilitar la personalización.
- **Estilos separados**: cada vista tiene su propio archivo `.styles.js` para mantenibilidad.

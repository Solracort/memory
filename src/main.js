import './app.js';

/**
 * Punto de entrada de la aplicación.
 *
 * Este archivo solo importa el componente raíz y registra el service worker.
 * El service worker es generado automáticamente por vite-plugin-pwa
 * y permite que la app funcione offline.
 */

// Registra el service worker solo en producción
if ('serviceWorker' in navigator) {
  // El archivo 'sw.js' lo genera vite-plugin-pwa en el build
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Si falla el registro, la app sigue funcionando (solo sin offline)
    });
  });
}

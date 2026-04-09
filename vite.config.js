import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // El plugin PWA genera el service worker y el manifest automáticamente
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      // Workbox precachea todos los assets del build para que funcione offline
      workbox: {
        // Precachea todos los assets necesarios para que la app funcione offline
        globPatterns: ['**/*.{js,css,html,ico,svg}'],
      },
      manifest: {
        name: 'Memory Cards Game',
        short_name: 'Memory',
        description: 'Juego de memoria con tarjetas numéricas',
        theme_color: '#004481',
        background_color: '#f4f4f4',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            // SVG escalable: 'any' es el valor correcto para imágenes vectoriales
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});

import { getUsername } from './services/user-service.js';

/**
 * Router hash-based minimalista.
 *
 * Usa el fragmento de la URL (#/home, #/game) como ruta.
 * Ventajas frente a History API:
 *   - No requiere configuración especial del servidor
 *   - Funciona directamente en Netlify / GitHub Pages sin redirects
 *
 * Rutas disponibles: 'home' | 'game'
 */

export const ROUTES = {
  HOME: 'home',
  GAME: 'game',
};

/**
 * Navega a una ruta cambiando el hash de la URL.
 * El cambio de hash dispara el evento 'hashchange' que escucha app.js.
 *
 * @param {string} route - Una de las claves de ROUTES
 */
export const navigate = (route) => {
  window.location.hash = `#/${route}`;
};

/**
 * Lee el hash actual de la URL y devuelve el nombre de la ruta.
 * Si la ruta no existe o no hay hash → redirige a 'home'.
 *
 * Protección de ruta: '#/game' requiere que exista un usuario guardado.
 * Si no hay usuario, redirige a 'home'.
 *
 * @returns {string} 'home' | 'game'
 */
export const getCurrentRoute = () => {
  // window.location.hash devuelve '#/home' → extraemos 'home'
  const hash = window.location.hash.replace('#/', '');
  const validRoutes = Object.values(ROUTES);

  // Si la ruta no existe → home
  if (!validRoutes.includes(hash)) {
    navigate(ROUTES.HOME);
    return ROUTES.HOME;
  }

  // Protección: no se puede acceder a /game sin usuario
  if (hash === ROUTES.GAME && !getUsername()) {
    navigate(ROUTES.HOME);
    return ROUTES.HOME;
  }

  return hash;
};

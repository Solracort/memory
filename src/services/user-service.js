/**
 * Servicio de usuario: gestiona el nombre y la puntuación en localStorage.
 *
 * Se usa localStorage porque la app funciona offline y no hay backend.
 * Las claves tienen prefijo 'memory_' para no colisionar con otras apps.
 */

const KEYS = {
  USERNAME: 'memory_username',
  SCORE: (name) => `memory_score_${name}`,
};

/** Guarda el nombre del jugador activo */
export const saveUsername = (name) => {
  localStorage.setItem(KEYS.USERNAME, name);
};

/** Recupera el nombre del jugador activo. Devuelve null si no hay ninguno */
export const getUsername = () => {
  return localStorage.getItem(KEYS.USERNAME);
};

/**
 * Guarda la puntuación de un jugador concreto.
 * Solo se sobreescribe si la nueva puntuación es mayor (high score).
 *
 * @param {string} name  - Nombre del jugador
 * @param {number} score - Puntuación de la partida actual
 */
export const saveScore = (name, score) => {
  const currentBest = getScore(name);
  if (score > currentBest) {
    localStorage.setItem(KEYS.SCORE(name), score);
  }
};

/**
 * Recupera la mejor puntuación de un jugador.
 *
 * @param {string} name - Nombre del jugador
 * @returns {number} La mejor puntuación guardada, o 0 si no hay ninguna
 */
export const getScore = (name) => {
  return Number(localStorage.getItem(KEYS.SCORE(name))) || 0;
};

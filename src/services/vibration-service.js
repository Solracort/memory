/**
 * Servicio de vibración háptica.
 *
 * Centraliza el acceso a la Vibration API para que cualquier parte
 * de la aplicación pueda desencadenar feedback táctil sin acoplarse
 * directamente a `navigator.vibrate`.
 */

/**
 * Ejecuta el patrón de vibración de error (fallo en la respuesta).
 * Patrón: vibra 200ms, pausa 100ms, vibra 200ms.
 *
 * Debe llamarse en el mismo tick que el gesto del usuario para que
 * el navegador permita la vibración.
 */
export const vibrateOnWrongAnswer = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
};

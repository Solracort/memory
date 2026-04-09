/**
 * Configuración de cada nivel de dificultad.
 *
 * time     → segundos que se ven los números antes de ocultarse
 * points   → puntos que otorga cada acierto
 * toGuess  → cuántos números tiene que recordar y acertar el jugador (bonus: 3 en alto)
 */
export const DIFFICULTY_CONFIG = {
  bajo: {
    label: 'Bajo',
    time: 10,
    points: 10,
    toGuess: 1,
  },
  medio: {
    label: 'Medio',
    time: 5,
    points: 20,
    toGuess: 1,
  },
  alto: {
    label: 'Alto',
    time: 2,
    points: 30,
    toGuess: 3,
  },
};

// Número total de cartas en el tablero (siempre un grid 3×3)
export const BOARD_SIZE = 9;

// Valores de estado visual de cada carta
export const CARD_STATE = {
  HIDDEN: 'hidden',   // Número oculto, esperando que el jugador haga click
  CORRECT: 'correct', // Acierto → fondo verde
  WRONG: 'wrong',     // Fallo → fondo rojo con número visible
};

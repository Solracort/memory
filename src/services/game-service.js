import { BOARD_SIZE, DIFFICULTY_CONFIG } from '../constants/game-config.js';

/**
 * Genera el tablero de juego: un array con los números 1-9 en orden aleatorio.
 *
 * Algoritmo Fisher-Yates: recorre el array de atrás hacia adelante
 * e intercambia cada elemento con uno aleatorio de los anteriores.
 * Garantiza que todos los órdenes son igual de probables.
 *
 * @returns {number[]} Array de 9 números, del 1 al 9, mezclados
 */
export const generateBoard = () => {
  // Crea [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const board = Array.from({ length: BOARD_SIZE }, (_, i) => i + 1);

  // Fisher-Yates shuffle
  for (let i = board.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [board[i], board[randomIndex]] = [board[randomIndex], board[i]];
  }

  return board;
};

/**
 * Elige aleatoriamente los números que el jugador tendrá que acertar.
 * La cantidad depende del nivel de dificultad (1 en bajo/medio, 3 en alto).
 *
 * @param {number[]} board    - El tablero actual (resultado de generateBoard)
 * @param {string}   difficulty - Clave de dificultad: 'bajo' | 'medio' | 'alto'
 * @returns {number[]} Los números que el jugador debe recordar y localizar
 */
export const getNumbersToGuess = (board, difficulty) => {
  const { toGuess } = DIFFICULTY_CONFIG[difficulty];

  // Copia el board y lo mezcla para elegir índices aleatorios sin repetición
  const shuffledIndices = Array.from({ length: board.length }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, toGuess);

  return shuffledIndices.map((index) => board[index]);
};

/**
 * Comprueba si la carta seleccionada por el jugador contiene el número buscado.
 *
 * @param {number[]} board         - El tablero actual
 * @param {number}   selectedIndex - Índice (0-8) de la carta pulsada
 * @param {number}   targetNumber  - El número que el jugador debe acertar
 * @returns {boolean} true si la carta seleccionada contiene targetNumber
 */
export const checkAnswer = (board, selectedIndex, targetNumber) => {
  return board[selectedIndex] === targetNumber;
};

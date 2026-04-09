import { describe, it, expect } from 'vitest';
import { generateBoard, getNumbersToGuess, checkAnswer } from '../../src/services/game-service.js';
import { BOARD_SIZE } from '../../src/constants/game-config.js';

// ─────────────────────────────────────────────────────────────────────────────
// generateBoard
// ─────────────────────────────────────────────────────────────────────────────
describe('generateBoard', () => {
  it('devuelve un array con exactamente 9 elementos', () => {
    const board = generateBoard();
    expect(board).toHaveLength(BOARD_SIZE);
  });

  it('contiene los números del 1 al 9 sin repeticiones', () => {
    const board = generateBoard();
    // Ordenamos y comparamos con el array esperado
    expect([...board].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('devuelve el tablero en un orden diferente cada vez (aleatoriedad)', () => {
    // La probabilidad de que 10 tableros sean idénticos es 1/9! ≈ 0%, así que
    // si al menos uno difiere, confirma que hay aleatoriedad real.
    const boards = Array.from({ length: 10 }, generateBoard);
    const allEqual = boards.every(
      (b) => JSON.stringify(b) === JSON.stringify(boards[0])
    );
    expect(allEqual).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getNumbersToGuess
// ─────────────────────────────────────────────────────────────────────────────
describe('getNumbersToGuess', () => {
  it('devuelve 1 número en dificultad "bajo"', () => {
    const board = generateBoard();
    expect(getNumbersToGuess(board, 'bajo')).toHaveLength(1);
  });

  it('devuelve 1 número en dificultad "medio"', () => {
    const board = generateBoard();
    expect(getNumbersToGuess(board, 'medio')).toHaveLength(1);
  });

  it('devuelve 3 números en dificultad "alto" (bonus)', () => {
    const board = generateBoard();
    expect(getNumbersToGuess(board, 'alto')).toHaveLength(3);
  });

  it('los números devueltos pertenecen al tablero', () => {
    const board = generateBoard();
    const numbers = getNumbersToGuess(board, 'alto');
    numbers.forEach((n) => {
      expect(board).toContain(n);
    });
  });

  it('los números no se repiten en dificultad "alto"', () => {
    const board = generateBoard();
    const numbers = getNumbersToGuess(board, 'alto');
    const unique = new Set(numbers);
    expect(unique.size).toBe(numbers.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkAnswer
// ─────────────────────────────────────────────────────────────────────────────
describe('checkAnswer', () => {
  // Usamos un tablero fijo para que los tests sean deterministas
  const board = [3, 7, 1, 9, 5, 2, 8, 4, 6]; // tablero conocido

  it('devuelve true cuando el índice seleccionado contiene el número buscado', () => {
    // board[0] = 3, así que buscar el 3 en índice 0 es correcto
    expect(checkAnswer(board, 0, 3)).toBe(true);
  });

  it('devuelve false cuando el índice no contiene el número buscado', () => {
    // board[0] = 3, buscar el 7 en índice 0 es incorrecto
    expect(checkAnswer(board, 0, 7)).toBe(false);
  });

  it('funciona correctamente en cualquier posición del tablero', () => {
    board.forEach((number, index) => {
      expect(checkAnswer(board, index, number)).toBe(true);
      // El número de la posición siguiente (si existe) debe dar false
      if (index + 1 < board.length) {
        expect(checkAnswer(board, index, board[index + 1])).toBe(false);
      }
    });
  });
});

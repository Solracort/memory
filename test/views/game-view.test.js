import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mockeamos los servicios para controlar qué datos recibe la vista
vi.mock('../../src/services/user-service.js', () => ({
  getUsername: vi.fn(() => 'Ana'),
  getScore: vi.fn(() => 50),
  saveScore: vi.fn(),
}));

import { saveScore } from '../../src/services/user-service.js';
import '../../src/views/game-view.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const createGameView = async () => {
  const el = document.createElement('game-view');
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
};

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('GameView — estado inicial (idle)', () => {
  let element;

  beforeEach(() => vi.clearAllMocks());
  afterEach(() => element?.remove());

  it('muestra el nombre del jugador en la cabecera', async () => {
    element = await createGameView();
    const header = element.shadowRoot.querySelector('.game__header');
    expect(header.textContent).toContain('Ana');
  });

  it('muestra la puntuación inicial en 0', async () => {
    element = await createGameView();
    const score = element.shadowRoot.querySelector('.game__score');
    expect(score.textContent).toContain('0');
  });

  it('muestra el récord del jugador', async () => {
    element = await createGameView();
    const best = element.shadowRoot.querySelector('.game__best-score');
    expect(best.textContent).toContain('50');
  });

  it('renderiza el selector de dificultad en estado idle', async () => {
    element = await createGameView();
    expect(element.shadowRoot.querySelector('difficulty-selector')).not.toBeNull();
  });

  it('renderiza el botón "Comenzar" en estado idle', async () => {
    element = await createGameView();
    const btn = element.shadowRoot.querySelector('app-button');
    expect(btn.label).toBe('Comenzar');
  });

  it('el tablero NO se muestra en estado idle', async () => {
    element = await createGameView();
    const board = element.shadowRoot.querySelector('.game__board');
    expect(board).toBeNull();
  });
});

describe('GameView — estado showing (números visibles)', () => {
  let element;

  // Usamos timers falsos para controlar setInterval sin esperar segundos reales
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    element?.remove();
    vi.useRealTimers();
  });

  it('muestra 9 cartas en el tablero al pulsar Comenzar', async () => {
    element = await createGameView();

    // Disparamos el click del botón Comenzar
    element.shadowRoot.querySelector('app-button').dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true, composed: true })
    );
    await element.updateComplete;

    const cards = element.shadowRoot.querySelectorAll('memory-card');
    expect(cards.length).toBe(9);
  });

  it('muestra el countdown cuando el juego empieza', async () => {
    element = await createGameView();

    element.shadowRoot.querySelector('app-button').dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true, composed: true })
    );
    await element.updateComplete;

    const countdown = element.shadowRoot.querySelector('.game__countdown');
    expect(countdown).not.toBeNull();
  });

  it('las cartas son visibles durante la fase de memorización', async () => {
    element = await createGameView();

    element.shadowRoot.querySelector('app-button').dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true, composed: true })
    );
    await element.updateComplete;

    const cards = element.shadowRoot.querySelectorAll('memory-card');
    // Todas las cartas deben tener visible=true durante la fase showing
    cards.forEach((card) => {
      expect(card.visible).toBe(true);
    });
  });
});

describe('GameView — fase guessing (adivinar)', () => {
  let element;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    element?.remove();
    vi.useRealTimers();
  });

  /** Arranca el juego y avanza el tiempo hasta que el countdown llega a 0 */
  const startAndAdvanceToGuessing = async (el) => {
    el.shadowRoot.querySelector('app-button').dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true, composed: true })
    );
    await el.updateComplete;
    // Dificultad 'medio' por defecto: 5 segundos
    vi.advanceTimersByTime(6000);
    await el.updateComplete;
  };

  it('oculta el countdown cuando termina el tiempo', async () => {
    element = await createGameView();
    await startAndAdvanceToGuessing(element);

    expect(element.shadowRoot.querySelector('.game__countdown')).toBeNull();
  });

  it('muestra la instrucción con el número a adivinar', async () => {
    element = await createGameView();
    await startAndAdvanceToGuessing(element);

    const instruction = element.shadowRoot.querySelector('.game__instruction');
    expect(instruction).not.toBeNull();
  });

  it('actualiza los puntos al acertar una carta', async () => {
    element = await createGameView();
    await startAndAdvanceToGuessing(element);

    // Buscamos la carta que contiene el número objetivo
    const targetNumber = element._numbersToGuess[0];
    const targetIndex = element._board.indexOf(targetNumber);
    const cards = element.shadowRoot.querySelectorAll('memory-card');

    cards[targetIndex].dispatchEvent(
      new CustomEvent('card-clicked', {
        detail: { index: targetIndex },
        bubbles: true,
        composed: true,
      })
    );
    await element.updateComplete;

    // Los puntos deben haber aumentado (dificultad medio = 20 puntos)
    expect(element._score).toBeGreaterThan(0);
    expect(saveScore).toHaveBeenCalled();
  });

  it('cambia el estado a "wrong" al fallar una carta', async () => {
    element = await createGameView();
    await startAndAdvanceToGuessing(element);

    // Buscamos una carta que NO sea la correcta
    const targetNumber = element._numbersToGuess[0];
    const wrongIndex = element._board.findIndex((n) => n !== targetNumber);

    element.shadowRoot.querySelectorAll('memory-card')[wrongIndex].dispatchEvent(
      new CustomEvent('card-clicked', {
        detail: { index: wrongIndex },
        bubbles: true,
        composed: true,
      })
    );
    await element.updateComplete;

    expect(element._gameState).toBe('wrong');
  });

  it('muestra el botón "Volver a jugar" tras perder', async () => {
    element = await createGameView();
    await startAndAdvanceToGuessing(element);

    const targetNumber = element._numbersToGuess[0];
    const wrongIndex = element._board.findIndex((n) => n !== targetNumber);

    element.shadowRoot.querySelectorAll('memory-card')[wrongIndex].dispatchEvent(
      new CustomEvent('card-clicked', {
        detail: { index: wrongIndex },
        bubbles: true,
        composed: true,
      })
    );
    await element.updateComplete;

    const btn = element.shadowRoot.querySelector('app-button');
    expect(btn.label).toBe('Volver a jugar');
  });
});

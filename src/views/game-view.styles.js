import { css } from 'lit';

/**
 * Estilos de la vista Game.
 * Se importan en game-view.js y se asignan a `static styles`.
 */
export const gameViewStyles = css`
  :host {
    display: block;
    min-height: 100vh;
    padding: 16px;
    box-sizing: border-box;
  }

  /* Layout en columna para mobile, fila para desktop */
  .game {
    max-width: 520px;
    margin: 0 auto;
  }

  /* ── Cabecera ── */
  .game__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .game__player {
    font-weight: 600;
    color: var(--color-primary, #004481);
  }

  .game__scores {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .game__score {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-primary, #004481);
  }

  .game__best-score {
    font-size: 0.8rem;
    color: #888;
  }

  /* ── Panel de configuración ── */
  .game__config {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .game__config h2 {
    margin: 0 0 12px;
    font-size: 1rem;
    color: #555555;
    font-weight: 600;
  }

  /* ── Tablero 3×3 ── */
  .game__board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 16px 0;
  }

  /* ── Instrucción al jugador ── */
  .game__instruction {
    text-align: center;
    padding: 16px;
    border-radius: 12px;
    background: #ffffff;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .game__instruction h2 {
    margin: 0 0 8px;
    font-size: 1rem;
    color: #555555;
  }

  /* Número a adivinar mostrado en grande */
  .game__target-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-primary, #004481);
  }

  /* Countdown: cambia a rojo cuando quedan ≤ 3 segundos */
  .game__countdown {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    color: var(--color-primary, #004481);
    margin: 8px 0;
  }

  .game__countdown--urgent {
    color: #e74c3c;
    animation: pulse 0.5s infinite alternate;
  }

  @keyframes pulse {
    from { transform: scale(1); }
    to   { transform: scale(1.15); }
  }

  /* ── Mensaje de game over ── */
  .game__gameover {
    text-align: center;
    padding: 24px;
    background: #ffffff;
    border-radius: 12px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .game__gameover h2 {
    color: #e74c3c;
    margin-top: 0;
  }

  .game__gameover .final-score {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-primary, #004481);
    margin: 8px 0;
  }

  /* ── Progreso en dificultad alto (cuántos números van) ── */
  .game__guess-progress {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .guess-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e0e0e0;
  }

  .guess-dot--done {
    background: #27ae60;
  }

  .guess-dot--current {
    background: var(--color-primary, #004481);
  }
`;

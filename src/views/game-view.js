import { LitElement, html } from 'lit';
import { gameViewStyles } from './game-view.styles.js';
import { getUsername, getScore, saveScore } from '../services/user-service.js';
import { generateBoard, getNumbersToGuess, checkAnswer } from '../services/game-service.js';
import { vibrateOnWrongAnswer } from '../services/vibration-service.js';
import { BOARD_SIZE, CARD_STATE, CORRECT_FEEDBACK_DELAY_MS, COUNTDOWN_URGENT_THRESHOLD, DIFFICULTY_CONFIG, NEXT_ROUND_DELAY_MS } from '../constants/game-config.js';
import '../components/app-button.js';
import '../components/memory-card.js';
import '../components/difficulty-selector.js';

/**
 * Vista GAME — pantalla principal del juego.
 *
 */
class GameView extends LitElement {
  static properties = {
    _difficulty: { type: String, state: true },
    _gameState: { type: String, state: true },
    _board: { type: Array, state: true },
    _cardStates: { type: Array, state: true },
    _numbersToGuess: { type: Array, state: true },
    _currentGuessIndex: { type: Number, state: true },
    _score: { type: Number, state: true },
    _countdown: { type: Number, state: true },
    _playerName: { type: String, state: true },
    _bestScore: { type: Number, state: true },
  };

  static styles = gameViewStyles;

  constructor() {
    super();
    this._difficulty = 'medio';
    this._gameState = 'idle'; // idle | showing | guessing | correct | wrong
    this._board = [];
    this._cardStates = Array(BOARD_SIZE).fill(CARD_STATE.HIDDEN);
    this._numbersToGuess = [];
    this._currentGuessIndex = 0;
    this._score = 0;
    this._countdown = 0;
    this._countdownInterval = null;
    this._playerName = getUsername() || '';
    this._bestScore = getScore(this._playerName);
  }

  // ── Ciclo de vida del componente ──────────────────────────────────────────

  disconnectedCallback() {
    super.disconnectedCallback();
    // Limpia el temporizador si el componente se desmonta
    this._clearCountdown();
  }

  // ── Lógica del juego ──────────────────────────────────────────────────────

  /** Inicia una nueva partida completa */
  _startGame() {
    this._score = 0;
    this._startRound();
  }

  /** Inicia una nueva ronda (nuevo tablero de números) */
  _startRound() {
    const board = generateBoard();
    const numbersToGuess = getNumbersToGuess(board, this._difficulty);

    this._board = board;
    this._numbersToGuess = numbersToGuess;
    this._currentGuessIndex = 0;
    this._cardStates = Array(BOARD_SIZE).fill(CARD_STATE.HIDDEN);
    this._gameState = 'showing';

    // Inicia el countdown: muestra los números durante N segundos
    const { time } = DIFFICULTY_CONFIG[this._difficulty];
    this._countdown = time;
    this._countdownInterval = setInterval(() => {
      this._countdown -= 1;
      if (this._countdown <= 0) {
        // Tiempo agotado → hora de adivinar
        this._clearCountdown();
        this._gameState = 'guessing';
      }
    }, 1000);
  }

  /** Para y limpia el intervalo del countdown */
  _clearCountdown() {
    if (this._countdownInterval) {
      clearInterval(this._countdownInterval);
      this._countdownInterval = null;
    }
  }

  /** Handler cuando el jugador hace click en una carta */
  _onCardClicked(e) {
    if (this._gameState !== 'guessing') return;

    const { index } = e.detail;
    const currentTarget = this._numbersToGuess[this._currentGuessIndex];
    const isCorrect = checkAnswer(this._board, index, currentTarget);

    if (isCorrect) {
      this._handleCorrectAnswer(index);
    } else {
      this._handleWrongAnswer(index);
    }
  }

  /** Respuesta correcta: puntos, verde y siguiente número o ronda */
  _handleCorrectAnswer(index) {
    const { points } = DIFFICULTY_CONFIG[this._difficulty];

    // Marca la carta como correcta
    this._cardStates = this._cardStates.map((state, i) =>
      i === index ? CARD_STATE.CORRECT : state
    );
    this._score += points;
    this._bestScore = Math.max(this._bestScore, this._score);
    saveScore(this._playerName, this._score);

    // ¿Quedan más números por adivinar en esta ronda?
    const nextGuessIndex = this._currentGuessIndex + 1;
    if (nextGuessIndex < this._numbersToGuess.length) {
      // Aún quedan números en la misma ronda → continúa adivinando
      this._currentGuessIndex = nextGuessIndex;
      this._gameState = 'correct'; // Feedback breve
      setTimeout(() => {
        this._gameState = 'guessing';
      }, CORRECT_FEEDBACK_DELAY_MS);
    } else {
      // Ronda completada → hay un pequeño delay y empieza la siguiente
      this._gameState = 'correct';
      setTimeout(() => {
        this._startRound();
      }, NEXT_ROUND_DELAY_MS);
    }
  }

  /** Respuesta incorrecta: rojo, vibración, game over */
  _handleWrongAnswer(index) {
    // Marca la carta como incorrecta (mostrará el número en rojo)
    this._cardStates = this._cardStates.map((state, i) =>
      i === index ? CARD_STATE.WRONG : state
    );

    // Vibración háptica: debe ejecutarse en el mismo tick que el gesto del usuario
    vibrateOnWrongAnswer();

    this._gameState = 'wrong';
  }

  /** Handler cuando el usuario cambia la dificultad */
  _onDifficultyChanged(e) {
    // Solo en idle o en game over (wrong) se puede cambiar
    if (this._gameState !== 'idle' && this._gameState !== 'wrong') return;
    this._difficulty = e.detail.value;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  /** Cabecera: nombre del jugador y puntuaciones */
  _renderHeader() {
    return html`
      <header class="game__header">
        <span class="game__player">👤 ${this._playerName}</span>
        <div class="game__scores">
          <span class="game__score">⭐ ${this._score} pts</span>
          <span class="game__best-score">Récord: ${this._bestScore} pts</span>
        </div>
      </header>
    `;
  }

  /** Panel de configuración: selector de dificultad, mensaje de game over y botón de inicio */
  _renderConfigPanel() {
    const isWrong = this._gameState === 'wrong';

    return html`
      <div class="game__config">
        <h2>Nivel de dificultad</h2>
        <difficulty-selector
          value=${this._difficulty}
          @difficulty-changed=${this._onDifficultyChanged}
        ></difficulty-selector>
      </div>

      ${isWrong
        ? html`
            <div class="game__gameover">
              <h2>¡Partida terminada!</h2>
              <p>Puntuación final:</p>
              <div class="final-score">${this._score} pts</div>
            </div>
          `
        : ''}

      <app-button
        label=${isWrong ? 'Volver a jugar' : 'Comenzar'}
        @app-button-click=${this._startGame}
      ></app-button>
    `;
  }

  /** Fase "showing": countdown y tablero con los números visibles */
  _renderShowingPhase() {
    return html`
      <div
        class="game__countdown ${this._countdown <= COUNTDOWN_URGENT_THRESHOLD
          ? 'game__countdown--urgent'
          : ''}"
        aria-live="polite"
        aria-label="Tiempo restante: ${this._countdown} segundos"
      >
        ⏱ ${this._countdown}s
      </div>
      <p style="text-align:center; color:#555; margin:0 0 8px">
        ¡Memoriza los números!
      </p>
      ${this._renderBoard()}
    `;
  }

  /** Fase "guessing / correct": instrucción de qué número buscar y tablero */
  _renderGuessingPhase() {
    return html`
      ${this._renderInstruction()}
      ${this._renderBoard()}
    `;
  }

  /** Instrucción del turno actual (qué número buscar) */
  _renderInstruction() {
    const currentTarget = this._numbersToGuess[this._currentGuessIndex];

    // En dificultad 'alto' mostramos los puntos de progreso
    const progressDots =
      this._numbersToGuess.length > 1
        ? html`
            <div class="game__guess-progress">
              ${this._numbersToGuess.map(
                (_, i) => html`
                  <div
                    class="guess-dot
                      ${i < this._currentGuessIndex ? 'guess-dot--done' : ''}
                      ${i === this._currentGuessIndex ? 'guess-dot--current' : ''}"
                  ></div>
                `
              )}
            </div>
          `
        : '';

    return html`
      <section class="game__instruction" aria-live="polite">
        <h2>¿Dónde está el número...?</h2>
        ${progressDots}
        <div class="game__target-number">${currentTarget}</div>
      </section>
    `;
  }

  /** Renderiza el tablero de 9 cartas */
  _renderBoard() {
    const isShowing = this._gameState === 'showing';

    return html`
      <div class="game__board" aria-label="Tablero de juego">
        ${this._board.map(
          (number, index) => html`
            <memory-card
              number=${number}
              ?visible=${isShowing}
              state=${this._cardStates[index]}
              index=${index}
              @card-clicked=${this._onCardClicked}
            ></memory-card>
          `
        )}
      </div>
    `;
  }

  render() {
    const { _gameState: state } = this;
    const isIdle = state === 'idle';
    const isWrong = state === 'wrong';

    return html`
      <section class="game">
        ${this._renderHeader()}

        ${isIdle || isWrong ? this._renderConfigPanel() : ''}

        ${state === 'showing' ? this._renderShowingPhase() : ''}

        ${state === 'guessing' || state === 'correct' ? this._renderGuessingPhase() : ''}

        ${state === 'wrong' ? this._renderBoard() : ''}
      </section>
    `;
  }
}

customElements.define('game-view', GameView);

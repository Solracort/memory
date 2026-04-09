import { LitElement, html, css } from 'lit';
import { CARD_STATE } from '../constants/game-config.js';

/**
 * Componente carta individual del tablero Memory.
 *
 * Uso:
 *   <memory-card number=${n} ?visible=${true} state="hidden"></memory-card>
 *
 * Eventos que emite:
 *   - 'card-clicked': cuando el jugador hace click (solo si state === HIDDEN)
 *     detail: { index: number } → el índice (0-8) de esta carta en el tablero
 *
 * Props:
 *   - number  {number} El número que contiene la carta (1-9)
 *   - visible {boolean} Si true, el número se muestra; si false, se oculta
 *   - state   {string} 'hidden' | 'correct' | 'wrong'  (ver CARD_STATE)
 *   - index   {number} Posición de la carta en el tablero (0-8)
 */
class MemoryCard extends LitElement {
  static properties = {
    number: { type: Number },
    visible: { type: Boolean },
    state: { type: String },
    index: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
    }

    /* La carta es un cuadrado que ocupa todo el espacio disponible en el grid */
    .card {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 700;
      cursor: pointer;
      border: 2px solid #e0e0e0;
      background-color: var(--color-card-bg, #ffffff);
      transition: transform 0.15s ease, background-color 0.3s ease;
      min-height: 80px;
      user-select: none;
    }

    /* Al hacer hover solo si está en estado oculto (jugando) */
    .card--hidden:hover {
      transform: scale(1.05);
      border-color: var(--color-primary, #004481);
    }

    /* Acierto → fondo verde */
    .card--correct {
      background-color: #27ae60;
      color: #ffffff;
      border-color: #1e8449;
      cursor: default;
    }

    /* Fallo → fondo rojo, muestra el número correcto */
    .card--wrong {
      background-color: #e74c3c;
      color: #ffffff;
      border-color: #c0392b;
      cursor: default;
    }

    /* Número oculto: muestra un '?' para indicar que hay algo debajo */
    .card__value--hidden {
      color: #cccccc;
      font-size: 1.2rem;
    }
  `;

  constructor() {
    super();
    this.number = 0;
    this.visible = false;
    this.state = CARD_STATE.HIDDEN;
    this.index = 0;
  }

  _handleClick() {
    // Solo se puede hacer click cuando la carta está en estado "hidden" (esperando respuesta)
    if (this.state === CARD_STATE.HIDDEN) {
      this.dispatchEvent(
        new CustomEvent('card-clicked', {
          detail: { index: this.index },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /** Determina el contenido visual de la carta */
  _renderValue() {
    // Si el número es visible (fase de memorización) → muestra el número
    if (this.visible) return this.number;
    // Si es un acierto o un fallo → muestra el número (con el fondo de color)
    if (this.state === CARD_STATE.CORRECT || this.state === CARD_STATE.WRONG) return this.number;
    // Si está oculta esperando click → muestra '?'
    return html`<span class="card__value--hidden">?</span>`;
  }

  render() {
    return html`
      <article
        class="card card--${this.state}"
        @click=${this._handleClick}
        role="button"
        aria-label="Carta ${this.index + 1}"
        tabindex=${this.state === CARD_STATE.HIDDEN ? '0' : '-1'}
        @keydown=${(e) => e.key === 'Enter' && this._handleClick()}
      >
        ${this._renderValue()}
      </article>
    `;
  }
}

customElements.define('memory-card', MemoryCard);

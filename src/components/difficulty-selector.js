import { LitElement, html, css } from 'lit';
import { DIFFICULTY_CONFIG } from '../constants/game-config.js';

/**
 * Componente selector de dificultad.
 *
 * Renderiza un grupo de 3 botones (Bajo / Medio / Alto).
 * El botón activo se resalta visualmente.
 *
 * Uso:
 *   <difficulty-selector value="medio"></difficulty-selector>
 *
 * Eventos que emite:
 *   - 'difficulty-changed': cuando el usuario selecciona otra dificultad
 *     detail: { value: 'bajo' | 'medio' | 'alto' }
 *
 * Props:
 *   - value {string} Dificultad actualmente seleccionada
 */
class DifficultySelector extends LitElement {
  static properties = {
    value: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .difficulty-selector {
      display: flex;
      gap: 8px;
    }

    /* Cada opción ocupa el mismo espacio horizontal */
    .difficulty-selector__option {
      flex: 1;
      padding: 10px 4px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background-color: #ffffff;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 48px;
    }

    .difficulty-selector__option:hover {
      border-color: var(--color-primary, #004481);
    }

    /* Opción activa */
    .difficulty-selector__option--active {
      background-color: var(--color-primary, #004481);
      border-color: var(--color-primary, #004481);
      color: #ffffff;
    }

    .difficulty-selector__option:focus-visible {
      outline: 3px solid var(--color-primary, #004481);
      outline-offset: 2px;
    }
  `;

  constructor() {
    super();
    this.value = 'medio';
  }

  _selectDifficulty(key) {
    if (key === this.value) return; // No emite si ya está seleccionado
    this.value = key;
    this.dispatchEvent(
      new CustomEvent('difficulty-changed', {
        detail: { value: key },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="difficulty-selector" role="group" aria-label="Selecciona dificultad">
        ${Object.entries(DIFFICULTY_CONFIG).map(
          ([key, config]) => html`
            <button
              class="difficulty-selector__option ${this.value === key
                ? 'difficulty-selector__option--active'
                : ''}"
              @click=${() => this._selectDifficulty(key)}
              aria-pressed=${this.value === key}
            >
              ${config.label}
            </button>
          `
        )}
      </div>
    `;
  }
}

customElements.define('difficulty-selector', DifficultySelector);

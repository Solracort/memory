import { LitElement, html, css } from 'lit';

/**
 * Componente botón reutilizable.
 *
 * Uso:
 *   <app-button label="Empezar" ?disabled=${!isValid}></app-button>
 *
 * Eventos que emite:
 *   - 'app-button-click': cuando el usuario hace click y el botón no está deshabilitado
 *
 * Props:
 *   - label    {string}  Texto del botón
 *   - disabled {boolean} Si true, el botón no se puede pulsar
 */
class AppButton extends LitElement {
  static properties = {
    label: { type: String },
    disabled: { type: Boolean },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      /* Colores y tamaño base para mobile */
      background-color: var(--color-primary, #004481);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 14px 28px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      min-height: 48px; /* Mínimo accesible para toque táctil */
      transition: background-color 0.2s ease;
    }

    button:hover:not(:disabled) {
      background-color: var(--color-primary-dark, #002663);
    }

    button:focus-visible {
      outline: 3px solid var(--color-primary, #004481);
      outline-offset: 3px;
    }

    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
      opacity: 0.7;
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.disabled = false;
  }

  /** Emite el evento personalizado hacia el componente padre */
  _handleClick() {
    this.dispatchEvent(new CustomEvent('app-button-click', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <button
        ?disabled=${this.disabled}
        @click=${this._handleClick}
        aria-label=${this.label}
      >
        ${this.label}
      </button>
    `;
  }
}

customElements.define('app-button', AppButton);

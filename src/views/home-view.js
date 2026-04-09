import { LitElement, html } from 'lit';
import { homeViewStyles } from './home-view.styles.js';
import { saveUsername } from '../services/user-service.js';
import { navigate, ROUTES } from '../router.js';
import '../components/app-button.js';

/**
 * Vista HOME — primera pantalla de la app.
 *
 * Responsabilidades:
 *  1. Mostrar un campo de texto para que el jugador introduzca su nombre
 *  2. Validar que el nombre no esté vacío antes de continuar
 *  3. Guardar el nombre en localStorage con user-service
 *  4. Navegar a la ruta '#/game'
 *
 * Esta vista no recibe props: se monta siempre desde cero al ir a #/home.
 */
class HomeView extends LitElement {
  static properties = {
    // Nombre que está escribiendo el usuario (ligado al input)
    _inputValue: { type: String, state: true },
    // Mensaje de error de validación ('' = sin error)
    _errorMessage: { type: String, state: true },
  };

  static styles = homeViewStyles;

  constructor() {
    super();
    this._inputValue = '';
    this._errorMessage = '';
  }

  /** Actualiza el valor del input en tiempo real */
  _onInputChange(e) {
    this._inputValue = e.target.value;
    // Limpia el error mientras el usuario escribe
    if (this._errorMessage) this._errorMessage = '';
  }

  /** Valida e inicia el juego */
  _startGame() {
    const name = this._inputValue.trim();

    if (!name) {
      this._errorMessage = 'Por favor, introduce tu nombre para jugar';
      return;
    }

    saveUsername(name);
    navigate(ROUTES.GAME);
  }

  /** Permite iniciar el juego pulsando Enter en el input */
  _onKeyDown(e) {
    if (e.key === 'Enter') this._startGame();
  }

  render() {
    return html`
      <main class="home">
        <div class="home__logo" aria-hidden="true">🧠</div>
        <h1 class="home__title">Memory Cards</h1>
        <p class="home__subtitle">Pon a prueba tu memoria</p>

        <div class="form-group">
          <label for="player-name">Tu nombre</label>
          <input
            id="player-name"
            type="text"
            placeholder="Escribe tu nombre..."
            .value=${this._inputValue}
            class=${this._errorMessage ? 'input--error' : ''}
            @input=${this._onInputChange}
            @keydown=${this._onKeyDown}
            aria-describedby=${this._errorMessage ? 'name-error' : ''}
            autocomplete="given-name"
            maxlength="30"
          />
          ${this._errorMessage
            ? html`<span id="name-error" class="error-message" role="alert"
                >${this._errorMessage}</span
              >`
            : ''}
        </div>

        <app-button
          label="Empezar a jugar"
          @app-button-click=${this._startGame}
        ></app-button>
      </main>
    `;
  }
}

customElements.define('home-view', HomeView);

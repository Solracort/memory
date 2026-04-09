import { LitElement, html, css } from 'lit';
import { getCurrentRoute, ROUTES } from './router.js';
import './views/home-view.js';
import './views/game-view.js';

/**
 * Componente raíz de la aplicación.
 *
 * Responsabilidades:
 *  1. Escuchar los cambios de ruta (evento 'hashchange')
 *  2. Renderizar la vista correspondiente: <home-view> o <game-view>
 *  3. Aplicar los estilos globales (CSS custom properties, reset)
 *
 * El enrutado funciona así:
 *   - URL: http://localhost/#/home → muestra HomeView
 *   - URL: http://localhost/#/game → muestra GameView (si hay usuario)
 *   - URL: cualquier otra          → redirige a #/home
 */
class MemoryApp extends LitElement {
  static properties = {
    // Ruta activa: 'home' | 'game'
    _currentRoute: { type: String, state: true },
  };

  static styles = css`
    :host {
      /* Variables CSS globales — fácilmente personalizables */
      --color-primary: #004481;
      --color-primary-dark: #002663;
      --color-card-bg: #ffffff;
      --color-bg: #f0f4f8;

      display: block;
      min-height: 100vh;
      background-color: var(--color-bg);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  `;

  constructor() {
    super();
    // Lee la ruta inicial desde el hash de la URL
    this._currentRoute = getCurrentRoute();

    // Cada vez que el usuario navega (back/forward o navigate()), actualiza la vista
    this._onHashChange = () => {
      this._currentRoute = getCurrentRoute();
    };
    window.addEventListener('hashchange', this._onHashChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._onHashChange);
  }

  render() {
    // Renderiza la vista según la ruta activa
    if (this._currentRoute === ROUTES.GAME) {
      return html`<game-view></game-view>`;
    }
    return html`<home-view></home-view>`;
  }
}

customElements.define('memory-app', MemoryApp);

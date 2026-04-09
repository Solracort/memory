import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mockeamos user-service y router para controlar sus efectos en los tests
vi.mock('../../src/services/user-service.js', () => ({
  saveUsername: vi.fn(),
}));

vi.mock('../../src/router.js', () => ({
  navigate: vi.fn(),
  ROUTES: { HOME: 'home', GAME: 'game' },
}));

// Importamos los mocks DESPUÉS de definirlos para poder espiarlos
import { saveUsername } from '../../src/services/user-service.js';
import { navigate, ROUTES } from '../../src/router.js';
import '../../src/views/home-view.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const createHomeView = async () => {
  const el = document.createElement('home-view');
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
};

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('HomeView', () => {
  let element;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    element?.remove();
  });

  it('renderiza el título "Memory Cards"', async () => {
    element = await createHomeView();
    const title = element.shadowRoot.querySelector('.home__title');
    expect(title.textContent).toContain('Memory Cards');
  });

  it('renderiza un input para el nombre del jugador', async () => {
    element = await createHomeView();
    expect(element.shadowRoot.querySelector('input')).not.toBeNull();
  });

  it('renderiza el componente <app-button>', async () => {
    element = await createHomeView();
    expect(element.shadowRoot.querySelector('app-button')).not.toBeNull();
  });

  it('muestra un mensaje de error si se pulsa el botón con el nombre vacío', async () => {
    element = await createHomeView();
    // Disparamos el evento del botón con el input vacío
    element.shadowRoot.querySelector('app-button').dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true, composed: true })
    );
    await element.updateComplete;

    const error = element.shadowRoot.querySelector('.error-message');
    expect(error).not.toBeNull();
    expect(error.textContent.length).toBeGreaterThan(0);
  });

  it('guarda el nombre y navega a /game cuando el nombre es válido', async () => {
    element = await createHomeView();

    // Escribimos un nombre en el input
    const input = element.shadowRoot.querySelector('input');
    input.value = 'Ana';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    // Pulsamos el botón
    element.shadowRoot.querySelector('app-button').dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true, composed: true })
    );

    expect(saveUsername).toHaveBeenCalledWith('Ana');
    expect(navigate).toHaveBeenCalledWith(ROUTES.GAME);
  });

  it('NO navega si el nombre contiene solo espacios en blanco', async () => {
    element = await createHomeView();

    const input = element.shadowRoot.querySelector('input');
    input.value = '   ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    element.shadowRoot.querySelector('app-button').dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true, composed: true })
    );

    expect(navigate).not.toHaveBeenCalled();
  });

  it('limpia el error al empezar a escribir', async () => {
    element = await createHomeView();

    // Provocamos el error
    element.shadowRoot.querySelector('app-button').dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true, composed: true })
    );
    await element.updateComplete;

    // Empezamos a escribir → el error debe desaparecer
    const input = element.shadowRoot.querySelector('input');
    input.value = 'L';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    expect(element.shadowRoot.querySelector('.error-message')).toBeNull();
  });
});

import { describe, it, expect, afterEach, vi } from 'vitest';
import { CARD_STATE } from '../../src/constants/game-config.js';
import '../../src/components/memory-card.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const createCard = async (props = {}) => {
  const el = document.createElement('memory-card');
  // Valores por defecto razonables
  Object.assign(el, { number: 5, visible: false, state: CARD_STATE.HIDDEN, index: 0, ...props });
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
};

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('MemoryCard', () => {
  let element;

  afterEach(() => {
    element?.remove();
  });

  it('renderiza un elemento article en el shadow DOM', async () => {
    element = await createCard();
    expect(element.shadowRoot.querySelector('article')).not.toBeNull();
  });

  it('muestra el número cuando visible es true', async () => {
    element = await createCard({ number: 7, visible: true });
    const article = element.shadowRoot.querySelector('article');
    expect(article.textContent.trim()).toBe('7');
  });

  it('muestra "?" cuando visible es false y state es hidden', async () => {
    element = await createCard({ number: 7, visible: false, state: CARD_STATE.HIDDEN });
    const article = element.shadowRoot.querySelector('article');
    expect(article.textContent.trim()).toBe('?');
  });

  it('muestra el número cuando state es correct (independientemente de visible)', async () => {
    element = await createCard({ number: 3, visible: false, state: CARD_STATE.CORRECT });
    const article = element.shadowRoot.querySelector('article');
    expect(article.textContent.trim()).toBe('3');
  });

  it('muestra el número cuando state es wrong', async () => {
    element = await createCard({ number: 3, visible: false, state: CARD_STATE.WRONG });
    const article = element.shadowRoot.querySelector('article');
    expect(article.textContent.trim()).toBe('3');
  });

  it('aplica la clase CSS correcta según el estado', async () => {
    element = await createCard({ state: CARD_STATE.CORRECT });
    expect(element.shadowRoot.querySelector('.card--correct')).not.toBeNull();
  });

  it('emite "card-clicked" con el índice correcto al hacer click', async () => {
    element = await createCard({ index: 4, state: CARD_STATE.HIDDEN });
    const handler = vi.fn();
    element.addEventListener('card-clicked', handler);

    element.shadowRoot.querySelector('article').click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail.index).toBe(4);
  });

  it('NO emite "card-clicked" cuando state es correct', async () => {
    element = await createCard({ state: CARD_STATE.CORRECT });
    const handler = vi.fn();
    element.addEventListener('card-clicked', handler);

    element.shadowRoot.querySelector('article').click();

    expect(handler).not.toHaveBeenCalled();
  });

  it('NO emite "card-clicked" cuando state es wrong', async () => {
    element = await createCard({ state: CARD_STATE.WRONG });
    const handler = vi.fn();
    element.addEventListener('card-clicked', handler);

    element.shadowRoot.querySelector('article').click();

    expect(handler).not.toHaveBeenCalled();
  });
});

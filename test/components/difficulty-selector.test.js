import { describe, it, expect, afterEach } from 'vitest';
import { DIFFICULTY_CONFIG } from '../../src/constants/game-config.js';
import '../../src/components/difficulty-selector.js';

const createSelector = async (value = 'medio') => {
  const el = document.createElement('difficulty-selector');
  el.value = value;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
};

describe('DifficultySelector', () => {
  let element;

  afterEach(() => {
    element?.remove();
  });

  it('renderiza un botón por cada nivel de dificultad', async () => {
    element = await createSelector();
    const buttons = element.shadowRoot.querySelectorAll('button');
    expect(buttons.length).toBe(Object.keys(DIFFICULTY_CONFIG).length);
  });

  it('marca como activo el botón del nivel seleccionado', async () => {
    element = await createSelector('bajo');
    const activeButton = element.shadowRoot.querySelector(
      '.difficulty-selector__option--active'
    );
    expect(activeButton.textContent.trim()).toBe(DIFFICULTY_CONFIG.bajo.label);
  });

  it('emite "difficulty-changed" con el valor correcto al cambiar de nivel', async () => {
    element = await createSelector('medio');
    let receivedValue = null;
    element.addEventListener('difficulty-changed', (e) => {
      receivedValue = e.detail.value;
    });

    // Hacemos click en el botón "alto"
    const buttons = element.shadowRoot.querySelectorAll('button');
    const altoButton = [...buttons].find((b) => b.textContent.trim() === 'Alto');
    altoButton.click();

    expect(receivedValue).toBe('alto');
  });

  it('NO emite evento si se hace click en el nivel que ya está activo', async () => {
    element = await createSelector('medio');
    let eventCount = 0;
    element.addEventListener('difficulty-changed', () => { eventCount++; });

    const buttons = element.shadowRoot.querySelectorAll('button');
    const medioButton = [...buttons].find((b) => b.textContent.trim() === 'Medio');
    medioButton.click();

    expect(eventCount).toBe(0);
  });

  it('actualiza el botón activo tras el cambio de nivel', async () => {
    element = await createSelector('bajo');
    element.addEventListener('difficulty-changed', () => {});

    const buttons = element.shadowRoot.querySelectorAll('button');
    const altoButton = [...buttons].find((b) => b.textContent.trim() === 'Alto');
    altoButton.click();
    await element.updateComplete;

    const activeButton = element.shadowRoot.querySelector(
      '.difficulty-selector__option--active'
    );
    expect(activeButton.textContent.trim()).toBe('Alto');
  });
});

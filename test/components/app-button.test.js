import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/components/app-button.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Crea un <app-button>, lo monta en el DOM y espera a que LitElement renderice */
const createButton = async (props = {}) => {
  const el = document.createElement('app-button');
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete; // LitElement termina su primer render
  return el;
};

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('AppButton', () => {
  let element;

  afterEach(() => {
    element?.remove();
  });

  it('renderiza un elemento <button> en el shadow DOM', async () => {
    element = await createButton({ label: 'Test' });
    const button = element.shadowRoot.querySelector('button');
    expect(button).not.toBeNull();
  });

  it('muestra el texto del atributo label en el botón', async () => {
    element = await createButton({ label: 'Empezar' });
    const button = element.shadowRoot.querySelector('button');
    expect(button.textContent.trim()).toBe('Empezar');
  });

  it('el botón no está deshabilitado por defecto', async () => {
    element = await createButton({ label: 'Test' });
    const button = element.shadowRoot.querySelector('button');
    expect(button.disabled).toBe(false);
  });

  it('deshabilita el botón cuando la propiedad disabled es true', async () => {
    element = await createButton({ label: 'Test', disabled: true });
    const button = element.shadowRoot.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('emite el evento "app-button-click" al hacer click', async () => {
    element = await createButton({ label: 'Test' });
    const handler = vi.fn();
    element.addEventListener('app-button-click', handler);

    element.shadowRoot.querySelector('button').click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('NO emite el evento si el botón está deshabilitado', async () => {
    element = await createButton({ label: 'Test', disabled: true });
    const handler = vi.fn();
    element.addEventListener('app-button-click', handler);

    element.shadowRoot.querySelector('button').click();

    expect(handler).not.toHaveBeenCalled();
  });

  it('actualiza el texto del botón cuando cambia la propiedad label', async () => {
    element = await createButton({ label: 'Antes' });
    element.label = 'Después';
    await element.updateComplete;

    const button = element.shadowRoot.querySelector('button');
    expect(button.textContent.trim()).toBe('Después');
  });
});

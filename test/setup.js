/**
 * Setup global para los tests con Vitest + jsdom + LitElement.
 *
 * jsdom no implementa de forma completa la API de CSS que usa LitElement
 * para inyectar estilos en el Shadow DOM (adoptedStyleSheets).
 * Este archivo añade el polyfill mínimo necesario para que los componentes
 * se monten sin errores durante los tests.
 *
 * ¿Por qué es necesario? LitElement llama a:
 *   shadowRoot.adoptedStyleSheets = [sheet]
 * jsdom soporta esto en versiones recientes, pero el getter puede fallar
 * si ShadowRoot no expone la propiedad como configurable.
 */

// Polyfill de adoptedStyleSheets en ShadowRoot para jsdom
const ShadowRootProto = Object.getPrototypeOf(
  document.createElement('div').attachShadow({ mode: 'open' })
);

if (!('adoptedStyleSheets' in ShadowRootProto)) {
  Object.defineProperty(ShadowRootProto, 'adoptedStyleSheets', {
    get() {
      return this._adoptedStyleSheets ?? [];
    },
    set(sheets) {
      this._adoptedStyleSheets = sheets;
    },
    configurable: true,
  });
}

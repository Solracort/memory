import { css } from 'lit';

/**
 * Estilos de la vista Home.
 * Se importan en home-view.js y se asignan a `static styles`.
 */
export const homeViewStyles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
    box-sizing: border-box;
  }

  /* Tarjeta central con el formulario */
  .home {
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 16px;
    padding: 40px 32px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .home__logo {
    font-size: 3rem;
    margin-bottom: 8px;
  }

  .home__title {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-primary, #004481);
    margin: 0 0 8px;
  }

  .home__subtitle {
    color: #666666;
    margin: 0 0 32px;
  }

  /* Grupo de campo de formulario */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
    text-align: left;
  }

  label {
    font-weight: 600;
    color: #333333;
  }

  input {
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
    outline: none;
  }

  input:focus {
    border-color: var(--color-primary, #004481);
  }

  /* Borde rojo cuando hay error */
  input.input--error {
    border-color: #e74c3c;
  }

  .error-message {
    color: #e74c3c;
    font-size: 0.875rem;
  }
`;

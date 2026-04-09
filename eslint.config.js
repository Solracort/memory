import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Prefiere const/let sobre var
      'no-var': 'error',
      // Prefiere const cuando la variable no se reasigna
      'prefer-const': 'error',
      // Prefiere template literals sobre concatenación
      'prefer-template': 'error',
      // Prefiere destructuring
      'prefer-destructuring': ['warn', { object: true, array: false }],
      // No usar console.log en producción (warn para no bloquear desarrollo)
      'no-console': 'warn',
    },
  },
  {
    // Los archivos de test pueden usar variables globales de vitest
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
  },
];

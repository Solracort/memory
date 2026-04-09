import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveUsername,
  getUsername,
  saveScore,
  getScore,
} from '../../src/services/user-service.js';

// Limpiamos localStorage antes de cada test para que sean independientes
beforeEach(() => {
  localStorage.clear();
});

// ─────────────────────────────────────────────────────────────────────────────
// saveUsername / getUsername
// ─────────────────────────────────────────────────────────────────────────────
describe('saveUsername / getUsername', () => {
  it('guarda y recupera el nombre del jugador', () => {
    saveUsername('Ana');
    expect(getUsername()).toBe('Ana');
  });

  it('devuelve null si no hay ningún usuario guardado', () => {
    expect(getUsername()).toBeNull();
  });

  it('sobreescribe el nombre si se llama de nuevo', () => {
    saveUsername('Ana');
    saveUsername('Luis');
    expect(getUsername()).toBe('Luis');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// saveScore / getScore
// ─────────────────────────────────────────────────────────────────────────────
describe('saveScore / getScore', () => {
  it('devuelve 0 si el jugador no tiene puntuación guardada', () => {
    expect(getScore('Ana')).toBe(0);
  });

  it('guarda y recupera la puntuación de un jugador', () => {
    saveScore('Ana', 100);
    expect(getScore('Ana')).toBe(100);
  });

  it('sobreescribe la puntuación si la nueva es mayor (high score)', () => {
    saveScore('Ana', 100);
    saveScore('Ana', 250);
    expect(getScore('Ana')).toBe(250);
  });

  it('NO sobreescribe la puntuación si la nueva es menor', () => {
    saveScore('Ana', 250);
    saveScore('Ana', 100);
    // La mejor puntuación debe seguir siendo 250
    expect(getScore('Ana')).toBe(250);
  });

  it('mantiene puntuaciones independientes por jugador', () => {
    saveScore('Ana', 200);
    saveScore('Luis', 50);
    expect(getScore('Ana')).toBe(200);
    expect(getScore('Luis')).toBe(50);
  });
});

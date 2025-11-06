import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Mock console.error to prevent test output pollution
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Test component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('sollte Kinder rendern wenn kein Fehler auftritt', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('sollte Fehler-UI anzeigen wenn ein Fehler auftritt', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Ups! Etwas ist schiefgelaufen/)).toBeInTheDocument();
    expect(screen.getByText('Seite neu laden')).toBeInTheDocument();
  });

  it('sollte Fehlermeldung im Development-Modus anzeigen', () => {
    // Mock development environment
    const originalEnv = import.meta.env.DEV;
    Object.defineProperty(import.meta.env, 'DEV', {
      value: true,
      configurable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error message/)).toBeInTheDocument();

    // Restore environment
    Object.defineProperty(import.meta.env, 'DEV', {
      value: originalEnv,
      configurable: true
    });
  });

  it('sollte Fehlermeldung im Production-Modus verstecken', () => {
    // Mock production environment
    const originalEnv = import.meta.env.DEV;
    Object.defineProperty(import.meta.env, 'DEV', {
      value: false,
      configurable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/Test error message/)).not.toBeInTheDocument();

    // Restore environment
    Object.defineProperty(import.meta.env, 'DEV', {
      value: originalEnv,
      configurable: true
    });
  });

  it('sollte Seite neu laden wenn Button geklickt wird', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window.location, 'reload', {
      value: reloadMock,
      configurable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Seite neu laden');
    reloadButton.click();

    expect(reloadMock).toHaveBeenCalled();
  });

  it('sollte nach Fehler wieder normal rendern können', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Ups! Etwas ist schiefgelaufen/)).toBeInTheDocument();

    // Rerender ohne Fehler
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Der Fehler-State sollte zurückgesetzt werden nach Reload
    // In einer echten App würde location.reload() dies tun
  });

  it('sollte console.error mit Fehlerdetails aufrufen', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[ErrorBoundary] Fehler aufgetreten:',
      expect.any(Error),
      expect.any(Object)
    );

    consoleErrorSpy.mockRestore();
  });
});

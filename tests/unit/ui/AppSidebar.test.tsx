import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mocks for hooks used inside AppSidebar
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ company: null, user: { email: 'tester@example.com' } }),
}));

vi.mock('@/hooks/use-account-type', () => ({
  useAccountType: () => ({ accountType: 'test' }),
}));

vi.mock('@/hooks/useContent', () => ({
  useContent: () => ({
    nav: {
      dashboard: 'Dashboard',
      auftraege: 'Aufträge',
      angebote: 'Angebote',
      kunden: 'Kunden',
      fahrer: 'Fahrer',
      fahrzeuge: 'Fahrzeuge',
      schichtzettel: 'Schichtzettel',
      rechnungen: 'Rechnungen',
      kostenstellen: 'Kostenstellen',
      dokumente: 'Dokumente',
      partner: 'Partner',
      statistiken: 'Statistiken',
      landingpage: 'Landingpage',
      kommunikation: 'Kommunikation',
      einstellungen: 'Einstellungen',
    },
  }),
}));

// Use MemoryRouter to provide routing context for NavLink
import { AppSidebar } from '../../../src/components/layout/AppSidebar';

describe('AppSidebar open state and accessibility', () => {
  it('renders collapsed with correct aria and alignment', () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppSidebar expanded={false} setExpanded={() => {}} />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' });
    expect(nav).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: /Sidebar ausklappen/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle.className).toMatch(/justify-center/);

    const menu = screen.getByRole('region', { hidden: true }) || document.getElementById('app-sidebar-menu');
    expect(menu).toBeTruthy();
    // Check that we do not scroll the sidebar (single scroll container principle)
    if (menu) {
      expect(menu.className).toMatch(/overflow-y-hidden/);
    }
  });

  it('renders expanded with correct aria and alignment', () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppSidebar expanded={true} setExpanded={() => {}} />
      </MemoryRouter>
    );

    const toggle = screen.getByRole('button', { name: /Sidebar einklappen/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle.className).toMatch(/justify-start/);
  });
});


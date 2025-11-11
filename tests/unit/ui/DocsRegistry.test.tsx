import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { DocsRegistry } from '@/components/docs/DocsRegistry';

describe('DocsRegistry', () => {
  it('renders items from local docs-sync-report and supports client-side search', async () => {
    const mockData = {
      filesProcessed: 3,
      docs: [
        { path: 'docs/README.md', title: '📚 MyDispatch Dokumentation & Wiki' },
        { path: 'docs/DOCUMENTATION_MAINTENANCE_POLICY_V1.1.md', title: '📑 Dokumentationspflege-Policy (Ohne Jira)' },
        { path: 'docs/SECRETS_REGISTRY.md', title: '🔑 Secrets Registry' },
      ],
    };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('/docs-sync-report.json')) {
        return { ok: true, json: async () => mockData } as any;
      }
      return { ok: false, json: async () => ({}) } as any;
    }));

    render(<DocsRegistry />);

    await waitFor(() => {
      expect(screen.getByText('🔑 Secrets Registry')).toBeDefined();
    });

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'policy' } });

    await waitFor(() => {
      // Should filter to the policy title
      expect(screen.getByText('📑 Dokumentationspflege-Policy (Ohne Jira)')).toBeDefined();
    });
  });
});


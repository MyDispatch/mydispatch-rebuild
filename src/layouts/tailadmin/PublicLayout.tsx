import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Users, Settings } from 'lucide-react';

type PublicLayoutProps = {
  children: React.ReactNode;
};

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="font-semibold">TailAdmin Public</span>
          </div>
          {/* CI-konforme Navigation: 8px-Grid, hoher Kontrast, Fokus sichtbar */}
          <nav aria-label="Hauptnavigation" className="ml-auto">
            <ul className="flex items-center gap-4">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `inline-flex items-center rounded px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pricing"
                  className={({ isActive }) =>
                    `inline-flex items-center rounded px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  Preise
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/features"
                  className={({ isActive }) =>
                    `inline-flex items-center rounded px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  Features
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6">
        {/* Sidebar entfernt – Inhalte in Main integriert */}

        {/* Main content */}
        <main className="col-span-12">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} TailAdmin Public Layout. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

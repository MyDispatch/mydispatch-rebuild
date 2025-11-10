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
          <div className="ml-auto flex items-center gap-3">
            <NavLink to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</NavLink>
            <NavLink to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Preise</NavLink>
            <NavLink to="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</NavLink>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="rounded-lg border border-border bg-card shadow-sm">
            <ul className="p-2">
              <li>
                <NavLink
                  to="/tailadmin"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded px-3 py-2 text-sm ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                    }`
                  }
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tailadmin/analytics"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded px-3 py-2 text-sm ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                    }`
                  }
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tailadmin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded px-3 py-2 text-sm ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                    }`
                  }
                >
                  <Users className="h-4 w-4" />
                  Nutzer
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tailadmin/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded px-3 py-2 text-sm ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                    }`
                  }
                >
                  <Settings className="h-4 w-4" />
                  Einstellungen
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
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


import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AuditPage = lazy(() => import("./pages/AuditPage"));
const PluginsPage = lazy(() => import("./pages/PluginsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AppShell = lazy(() => import("./components/layout/AppShell"));

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />
          },
          {
            path: "/settings",
            element: <SettingsPage />
          },
          {
            path: "/audit",
            element: <AuditPage />
          },
          {
            path: "/plugins",
            element: <PluginsPage />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
];

import { lazy } from "react";

// Lazy load driver app pages
const DriverSplash = lazy(() => import("@/pages/driver-app/DriverSplash"));
const DriverWelcome = lazy(() => import("@/pages/driver-app/DriverWelcome"));
const DriverLogin = lazy(() => import("@/pages/driver-app/DriverLogin"));
const DriverRegister = lazy(() => import("@/pages/driver-app/DriverRegister"));
const DriverDashboard = lazy(() => import("@/pages/driver-app/DriverDashboard"));

export const driverRoutes = [
  {
    path: "/driver",
    element: <DriverSplash />,
  },
  {
    path: "/driver/welcome",
    element: <DriverWelcome />,
  },
  {
    path: "/driver/login",
    element: <DriverLogin />,
  },
  {
    path: "/driver/register",
    element: <DriverRegister />,
  },
  {
    path: "/driver/dashboard",
    element: <DriverDashboard />,
  },
];

export default driverRoutes;

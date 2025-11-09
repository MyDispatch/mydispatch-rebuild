import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

import { appRoutes } from "./routes";
import { FullScreenLoader } from "./components/common/FullScreenLoader";
import { Toaster } from "./components/common/Toaster";
import { SWUpdater } from "./components/pwa/SWUpdater";
import { useBootstrapSession } from "./hooks/useBootstrapSession";

function App() {
  useBootstrapSession();
  const element = useRoutes(appRoutes);

  return (
    <Suspense fallback={<FullScreenLoader message="Lade NeXifyAI MASTER" />}> 
      {element}
      <SWUpdater />
      <Toaster />
    </Suspense>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import { Projects } from "./pages/Projects";
import { Admin } from "./pages/Admin";
import { useForgetProof } from "./hooks/useForgetProof";
import { useSelfExtension } from "./hooks/useSelfExtension";

const queryClient = new QueryClient();

function App() {
  // Load Forget-Proof Context on App Start
  useForgetProof();

  // Run Self-Extension System
  useSelfExtension();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

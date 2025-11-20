import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Minimale Test-App
function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#323D5E" }}>MyDispatch</h1>
      <p style={{ fontSize: "24px", color: "#666" }}>✅ App läuft erfolgreich!</p>
      <p style={{ fontSize: "16px", color: "#999" }}>React + Vite + TypeScript funktioniert</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

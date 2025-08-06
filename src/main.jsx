import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Tes from "./Tes.jsx";
import "./libs/i18n.js";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {/* <Tes /> */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

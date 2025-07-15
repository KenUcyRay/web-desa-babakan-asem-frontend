import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home.jsx";
import Contact from "./components/Contact.jsx";
import Layout from "./components/Layout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          
          <Route path="/contact" element={<Contact />} />

          <Route path="/*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

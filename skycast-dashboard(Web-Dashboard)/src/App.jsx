import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./styles/base/base.css";
import "./styles/components/layout/layout.css";
import "./styles/sky/environment.css";
import "./styles/themes/themes.css";
import "./styles/components/header.css";
import "./styles/components/buttons.css";
import "./styles/components/banners.css";
import "./styles/components/dashboard.css";
import "./styles/components/footer.css";
import "./styles/components/layout/breakpoints.css";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
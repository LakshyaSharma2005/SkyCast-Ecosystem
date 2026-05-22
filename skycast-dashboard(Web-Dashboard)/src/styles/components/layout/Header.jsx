import React from "react";
import { NavLink } from "react-router-dom"; // ⚡ We import the router links here

const Header = ({ ip, time, themeOverride, onExportCSV, onSheets, onExportPDF, onClear, onThemeToggle }) => (
  // We add a column flex layout so the nav sits cleanly under your existing header
  <header className="header" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    
    {/* =========================================
        TOP ROW: Your Original Brand & Buttons
        ========================================= */}
    <div className="header-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "16px" }}>
      
      <div className="brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="brand-text">
          <h1>SkyCast: Environment Monitoring &amp; Analysis</h1>
          <div className="sub">
            <div className="live-dot" />
            <span>{ip}</span>&nbsp;·&nbsp;<span>{time}</span>
          </div>
        </div>
      </div>

      <div className="header-controls">
        <button id="btnExport"      className="btn csv"       onClick={onExportCSV}>↓ Export CSV</button>
        <button id="btnSheets"      className="btn sheets"    onClick={onSheets}>📊 Live Sheet Sync</button>
        <button id="btnExportPDF"   className="btn pdf"       onClick={onExportPDF}>📄 PDF Report</button>
        <button id="btnClearData"   className="btn danger"    onClick={onClear}>⊗ Clear Data</button>
        <button id="btnThemeToggle" className="btn theme-btn" onClick={onThemeToggle}>
          {themeOverride === null ? "🌓 Auto Time" : themeOverride === "theme-day" ? "☀️ Day View" : "🌙 Night View"}
        </button>
      </div>
    </div>

    {/* =========================================
        BOTTOM ROW: The New Navigation Menu
        ========================================= */}
    <nav className="header-nav" style={{ 
      display: "flex", 
      gap: "24px", 
      borderTop: "1px solid rgba(255, 255, 255, 0.15)", 
      paddingTop: "16px",
      paddingLeft: "4px"
    }}>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        style={({ isActive }) => ({
          color: "white",
          textDecoration: "none",
          fontWeight: "600",
          opacity: isActive ? 1 : 0.6,
          borderBottom: isActive ? "2px solid white" : "none",
          paddingBottom: "4px"
        })}
      >
        🏠 Project Overview
      </NavLink>
      
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        style={({ isActive }) => ({
          color: "white",
          textDecoration: "none",
          fontWeight: "600",
          opacity: isActive ? 1 : 0.6,
          borderBottom: isActive ? "2px solid white" : "none",
          paddingBottom: "4px"
        })}
      >
        ⚡ Live Dashboard
      </NavLink>
      
      <NavLink 
        to="/analytics" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        style={({ isActive }) => ({
          color: "white",
          textDecoration: "none",
          fontWeight: "600",
          opacity: isActive ? 1 : 0.6,
          borderBottom: isActive ? "2px solid white" : "none",
          paddingBottom: "4px"
        })}
      >
        📊 Historical Analytics
      </NavLink>

      <NavLink 
        to="/settings" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        style={({ isActive }) => ({
          color: "white",
          textDecoration: "none",
          fontWeight: "600",
          opacity: isActive ? 1 : 0.6,
          borderBottom: isActive ? "2px solid white" : "none",
          paddingBottom: "4px"
        })}
      >
        ⚙️ Admin Settings
      </NavLink>
    </nav>
    
  </header>
);

export default Header;
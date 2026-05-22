import React from "react";

const Header = ({ ip, time, themeOverride, onExportCSV, onSheets, onExportPDF, onClear, onThemeToggle }) => {
  
  // 1. The new helper function mapping the 4 exact states
  const getThemeLabel = () => {
    if (themeOverride === "theme-day") return "☀️ Day View";
    if (themeOverride === "theme-evening") return "🌇 Evening View";
    if (themeOverride === "theme-night") return "🌙 Night View";
    return "✨ Auto Time";
  };

  return (
    <header className="header">
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
        
        {/* 2. The updated button calling the helper function */}
        <button id="btnThemeToggle" className="btn theme-btn" onClick={onThemeToggle}>
          {getThemeLabel()}
        </button>
      </div>
    </header>
  );
};

export default Header;
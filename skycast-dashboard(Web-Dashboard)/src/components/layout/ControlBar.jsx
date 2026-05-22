import React from "react";
import Header          from "./Header";
import AlertBanner     from "../alerts/AlertBanner";
import PredictiveAlert from "../alerts/PredictiveAlert";

const ControlBar = ({
  ip, time, themeOverride,
  onExportCSV, onSheets, onExportPDF, onClear, onThemeToggle,
  aqiAlert, isRaining, isConnected, rainPrediction,
}) => (
  <div className="sticky-control-bar">
    <Header
      ip={ip} time={time} themeOverride={themeOverride}
      onExportCSV={onExportCSV} onSheets={onSheets}
      onExportPDF={onExportPDF} onClear={onClear}
      onThemeToggle={onThemeToggle}
    />
    <AlertBanner
      show={aqiAlert || isRaining}
      icon="⚠"
      message="ENVIRONMENTAL ALERT — Critical threshold exceeded or Rain detected."
    />
    <AlertBanner
      show={!isConnected}
      icon="⚡"
      message="CONNECTION LOST — Attempting to reconnect to Firebase..."
      style={{ background: "rgba(251,191,36,0.12)", borderColor: "var(--amber)" }}
    />
    <PredictiveAlert prediction={rainPrediction} isRaining={isRaining} />
  </div>
);

export default ControlBar;
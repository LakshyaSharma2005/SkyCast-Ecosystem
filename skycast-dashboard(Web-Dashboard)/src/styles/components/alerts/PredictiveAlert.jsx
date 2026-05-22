import React from "react";

const PredictiveAlert = ({ prediction, isRaining }) => {
  if (!prediction || isRaining) return null;
  return (
    <div className="predictive-banner">
      <div className="predictive-icon">🔮</div>
      <div className="predictive-content">
        <div className="predictive-title">AI Forecast Warning</div>
        <div className="predictive-text">{prediction}</div>
      </div>
    </div>
  );
};

export default PredictiveAlert;
import React from "react";

const ChartCard = ({ title, currentValue, valueColor, canvasRef }) => (
  <div className="card chart-card">
    <div className="chart-header">
      <div className="chart-title">{title}</div>
      <div className="chart-current" style={{ color: valueColor }}>{currentValue ?? "--"}</div>
    </div>
    <div className="chart-wrap">
      <canvas ref={canvasRef} />
    </div>
  </div>
);

export default ChartCard;
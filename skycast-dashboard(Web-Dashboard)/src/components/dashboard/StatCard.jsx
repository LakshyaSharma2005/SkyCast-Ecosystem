import React from "react";

const StatCard = ({ title, icon, value, unit, badgeLabel, badgeStyle = {}, subLabel, cardClass = "" }) => (
  <div className={`card stat-card ${cardClass}`}>
    <div className="stat-top">
      <div className="stat-label">{title}</div>
      {icon && <div className="stat-icon">{icon}</div>}
    </div>
    <div className="stat-val" aria-live="polite" aria-atomic="true">
      {value ?? "--"}<span className="stat-unit">{unit}</span>
    </div>
    <div className="stat-sub">
      <span className="stat-badge" style={badgeStyle}>{badgeLabel}</span>
      <span>{subLabel}</span>
    </div>
  </div>
);

export default StatCard;
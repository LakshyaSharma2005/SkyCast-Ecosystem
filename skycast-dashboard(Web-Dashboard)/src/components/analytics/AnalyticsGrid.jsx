import React from "react";

const METRICS = [
  { title: "Temperature History", key: "t", c: "cyan",  unit: "°C" },
  { title: "Humidity History",    key: "h", c: "pink",  unit: "%"  },
  { title: "Rain History",        key: "r", c: "blue",  unit: "%"  },
  { title: "AQI History",         key: "a", c: "amber", unit: ""   },
];

const AnalyticsGrid = ({ stats }) => (
  <div className="grid-2">
    {METRICS.map(({ title, key, c, unit }) => (
      <div key={key} className="card analytics-card">
        <div className="analytics-header">
          <div className="analytics-dot" style={{ background: `var(--${c})`, boxShadow: `0 0 6px var(--${c})` }} />
          <div className="analytics-title">{title}</div>
        </div>
        {[["Maximum","max"],["Average","avg"],["Minimum","min"]].map(([label, valKey]) => (
          <div key={label} className="stat-row">
            <span className="stat-row-label">{label}</span>
            <span className="stat-row-val" style={{ color: `var(--${c})` }}>
              {stats[key][valKey]} {unit}
            </span>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default AnalyticsGrid;
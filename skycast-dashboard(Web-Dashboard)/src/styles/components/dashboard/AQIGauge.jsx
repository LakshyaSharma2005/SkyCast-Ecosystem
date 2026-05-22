import React from "react";
import { getAQILevel, getGaugeProps } from "../../utils/aqiUtils";

const AQIGauge = ({ aqi, threshold, onThreshold, onSetAlert }) => {
  const { label, color }           = getAQILevel(aqi ?? 0);
  const { gaugeOffset, gNx, gNy } = getGaugeProps(aqi ?? 0);

  return (
    <div className="card stat-card card-aqi">
      <div className="stat-top">
        <div className="stat-label">Air Quality Index</div>
      </div>
      <div className="aqi-gauge-wrap">
        <div className="gauge-svg-wrap">
          <svg viewBox="0 0 120 68" width="100%" height="100%">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#34d399" />
                <stop offset="40%"  stopColor="#fbbf24" />
                <stop offset="75%"  stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M10,60 A50,50 0 0,1 110,60" fill="none"
              stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray="157" strokeDashoffset={gaugeOffset}
              style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
            />
            <circle cx={gNx} cy={gNy} r="5" fill="var(--amber)"
              style={{ filter: "drop-shadow(0 0 4px #fbbf24)", transition: "all 1s cubic-bezier(.4,0,.2,1)" }}
            />
          </svg>
          <div id="gauge-val-overlay">{aqi ?? "--"}</div>
        </div>
        <div className="aqi-details">
          <div className="aqi-level" style={{ color }}>{label}</div>
          <div className="aqi-threshold">Alert at <span>{threshold}</span></div>
          <div className="threshold-row">
            <input type="range" min="0" max="500" value={threshold}
              onChange={(e) => onThreshold(Number(e.target.value))} />
            <button className="btn threshold-save" id="btnSet" onClick={onSetAlert}>Set</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQIGauge;
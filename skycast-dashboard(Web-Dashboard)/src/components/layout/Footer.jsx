import React from "react";
import { getLatencyStatus } from "../../utils/formatUtils";

const Footer = ({ isConnected, latency, lastUpdate }) => {
  const ls = getLatencyStatus(latency);
  return (
    <footer className="footer">
      <div className="footer-left">
        <span>SkyCast v2</span><span className="separator">·</span><span>ESP32 Monitor</span>
      </div>
      <div className="footer-center">
        Designed &amp; Developed by <span className="highlight">Lakshya</span>
      </div>
      <div className="footer-right">
        <span className="logs-status">
          ⚡ Logs: <span className={`logs-badge ${isConnected ? "live" : "offline"}`}>
            {isConnected ? "Live Stream" : "Offline"}
          </span>
        </span>
        <span className="separator">·</span>
        <span>⚡ {latency !== null
          ? <span style={{ color: ls.color }}>{latency} ms ({ls.label})</span>
          : <span style={{ color: "#ef4444" }}>Offline</span>}
        </span>
        <span className="separator">·</span>
        <span>Update: {lastUpdate}</span>
      </div>
    </footer>
  );
};

export default Footer;
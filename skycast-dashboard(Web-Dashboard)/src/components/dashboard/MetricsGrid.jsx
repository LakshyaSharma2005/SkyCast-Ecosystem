import React from "react";
import StatCard from "./StatCard";
import AQIGauge from "./AQIGauge";

const MetricsGrid = ({ sensor, threshold, onThreshold, onSetAlert }) => (
  <div className="grid">
    <StatCard title="Temperature" icon="🌡" value={sensor.temperature?.toFixed(1)}
      unit="°C" badgeLabel="LIVE" cardClass="card-temp"
      badgeStyle={{ background: "var(--cyan-dim)", color: "var(--cyan)" }}
      subLabel="Ambient reading" />
    <StatCard title="Humidity" icon="💧" value={sensor.humidity?.toFixed(1)}
      unit="%" badgeLabel="LIVE" cardClass="card-hum"
      badgeStyle={{ background: "var(--pink-dim)", color: "var(--pink)" }}
      subLabel="Relative humidity" />
    <StatCard title="Rain Intensity" icon="🌧" value={sensor.rainPct} unit="%"
      badgeLabel={sensor.isRaining ? "RAINING" : "DRY"} cardClass="card-rain"
      badgeStyle={{ background: sensor.isRaining ? "var(--blue)" : "var(--blue-dim)", color: sensor.isRaining ? "#fff" : "var(--blue)" }}
      subLabel="Water detection" />
    <AQIGauge aqi={sensor.aqi} threshold={threshold} onThreshold={onThreshold} onSetAlert={onSetAlert} />
  </div>
);

export default MetricsGrid;
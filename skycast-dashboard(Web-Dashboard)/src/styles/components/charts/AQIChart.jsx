import React from "react";
import ChartCard from "./ChartCard";
const AQIChart = ({ canvasRef, currentValue }) => (
  <ChartCard title="AQI Trend" currentValue={currentValue ?? "--"} valueColor="var(--amber)" canvasRef={canvasRef} />
);
export default AQIChart;
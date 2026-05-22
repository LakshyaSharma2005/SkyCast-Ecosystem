import React from "react";
import ChartCard from "./ChartCard";
const TemperatureChart = ({ canvasRef, currentValue }) => (
  <ChartCard title="Temperature" currentValue={`${currentValue ?? "--"} °C`} valueColor="var(--cyan)" canvasRef={canvasRef} />
);
export default TemperatureChart;
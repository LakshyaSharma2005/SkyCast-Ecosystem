import React from "react";
import ChartCard from "./ChartCard";
const HumidityChart = ({ canvasRef, currentValue }) => (
  <ChartCard title="Humidity" currentValue={`${currentValue ?? "--"} %`} valueColor="var(--pink)" canvasRef={canvasRef} />
);
export default HumidityChart;
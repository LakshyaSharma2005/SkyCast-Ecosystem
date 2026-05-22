import React from "react";
import ChartCard from "./ChartCard";
const RainChart = ({ canvasRef, currentValue }) => (
  <ChartCard title="Rain Intensity" currentValue={`${currentValue ?? "--"} %`} valueColor="var(--blue)" canvasRef={canvasRef} />
);
export default RainChart;
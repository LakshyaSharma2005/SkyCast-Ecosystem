export const getAQILevel = (v) => {
  if (v <= 50)  return { label: "Good",                           color: "#34d399" };
  if (v <= 100) return { label: "Moderate",                       color: "#fbbf24" };
  if (v <= 150) return { label: "Unhealthy for Sensitive Groups", color: "#f97316" };
  if (v <= 200) return { label: "Unhealthy",                      color: "#f87171" };
  if (v <= 300) return { label: "Very Unhealthy",                 color: "#a855f7" };
  return        { label: "Hazardous",                             color: "#ef4444" };
};

export const getGaugeProps = (aqi = 0) => {
  const pct   = Math.min(Math.max(aqi / 500, 0), 1);
  const angle = Math.PI * pct;
  return {
    gaugeOffset: 157 - 157 * pct,
    gNx: 60 - 50 * Math.cos(angle),
    gNy: 60 - 50 * Math.sin(angle),
  };
};
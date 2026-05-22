import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const useCharts = (refs, histData, lastUpdate) => {
  const chartsInstance = useRef({ temp: null, hum: null, rain: null, aqi: null });

  // 1. INITIALIZATION: Only run ONCE on mount (Empty dependency array)
  useEffect(() => {
    const makeGrad = (ctx, hex) => {
      const g = ctx.createLinearGradient(0, 0, 0, 140);
      g.addColorStop(0, hex + "33");
      g.addColorStop(1, hex + "00");
      return g;
    };

    const mkChart = (ref, color, label) => {
      if (!ref.current) return null; // Safety check
      const ctx = ref.current.getContext("2d");
      return new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [{
            label, data: [],
            borderColor: color, backgroundColor: makeGrad(ctx, color),
            borderWidth: 3, fill: true, tension: 0.4,
            pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: color,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          animation: { duration: 400 }, // Smooth slide-in animation
          layout: { padding: { right: 15, left: 5 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0d1525", titleColor: "#94a3b8", bodyColor: "#e8edf5",
              borderColor: "rgba(99,179,237,0.2)", borderWidth: 1, padding: 10, cornerRadius: 8
            },
          },
          scales: {
            x: {
              display: true, grid: { display: false },
              ticks: { color: "rgba(255,255,255,0.7)", font: { size: 9, family: "'JetBrains Mono'" }, maxTicksLimit: 6 },
              border: { display: false },
            },
            y: {
              grid: { color: "rgba(255,255,255,0.08)" },
              ticks: { color: "rgba(255,255,255,0.9)", font: { size: 10, family: "'JetBrains Mono'" } },
              border: { display: false },
            },
          },
        },
      });
    };

    chartsInstance.current.temp = mkChart(refs.tempRef, "#38bdf8", "Temp");
    chartsInstance.current.hum  = mkChart(refs.humRef,  "#f472b6", "Hum");
    chartsInstance.current.rain = mkChart(refs.rainRef, "#3b82f6", "Rain");
    chartsInstance.current.aqi  = mkChart(refs.aqiRef,  "#fbbf24", "AQI");

    const currentCharts = chartsInstance.current;

    // Cleanup exactly once when the component unmounts
    return () => {
      Object.values(currentCharts).forEach(c => c?.destroy());
    };
  }, [refs.aqiRef, refs.humRef, refs.rainRef, refs.tempRef]); // <-- THIS EMPTY ARRAY IS THE MAGIC FIX

  // 2. DATA SYNCING: Update the charts smoothly when new data arrives
  useEffect(() => {
    const ci = chartsInstance.current;
    const h  = histData.current;

    // Wait until the charts are built and data actually exists
    if (!ci.temp || !h.ts || h.ts.length === 0) return;

    const sync = (chart, dataArray) => {
      if (!chart || !dataArray) return;
      
      chart.data.labels = h.ts;
      // Brute-force conversion to pure numbers (handles strings, zeros, and prevents NaN crashes)
      chart.data.datasets[0].data = Array.from(dataArray).map(v => parseFloat(v) || 0);
      
      chart.update();
    };

    sync(ci.temp, h.t);
    sync(ci.hum,  h.h);
    sync(ci.rain, h.r);
    sync(ci.aqi,  h.aqi);

  }, [lastUpdate, histData]);

  return { chartsInstance };
};
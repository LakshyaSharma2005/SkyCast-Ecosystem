import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DeepInsights = ({ historyData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Wait until we actually have data from Firebase
    if (!historyData || !historyData.h || historyData.h.length === 0) return;

    // Combine Humidity and AQI arrays into {x, y} coordinate pairs for the scatter plot
    const scatterPoints = historyData.h.map((humidityVal, index) => ({
      x: humidityVal,
      y: historyData.a[index]
    }));

    const ctx = chartRef.current.getContext("2d");

    // Destroy old chart if it exists so we don't overlap
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [{
          label: "Humidity vs AQI",
          data: scatterPoints,
          backgroundColor: "rgba(52, 211, 153, 0.6)", // Your Excel Emerald Green!
          borderColor: "#34d399",
          pointRadius: 4,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0d1525",
            titleColor: "#94a3b8",
            bodyColor: "#e8edf5",
            callbacks: {
              label: (ctx) => `Humidity: ${ctx.parsed.x}% | AQI: ${ctx.parsed.y}`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: "Humidity (%)", color: "#94a3b8" },
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "rgba(255,255,255,0.8)" }
          },
          y: {
            title: { display: true, text: "Air Quality Index (AQI)", color: "#94a3b8" },
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "rgba(255,255,255,0.8)" }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [historyData]);

  return (
    <div className="card chart-card" style={{ width: '100%', minHeight: '350px' }}>
      <div className="chart-header">
        <div className="chart-title">Correlation Insight: Humidity vs. AQI</div>
        <div className="chart-current" style={{ color: "var(--muted)", fontSize: "11px" }}>
          Full Dataset Analysis
        </div>
      </div>
      <div className="chart-wrap" style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default DeepInsights;
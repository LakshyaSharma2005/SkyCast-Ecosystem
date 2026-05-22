import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import './AQIHistoryChart.css'; // See CSS below

// 1. ANALYST CONFIG: Define color thresholds
const AQI_COLORS = {
  good: "#4ade80",      // Emerald green
  moderate: "#fbbf24",  // Amber yellow
  unhealthy: "#f87171", // Soft red
};

// 2. ANALYST CONFIG: Main threshold values
const THRESHOLDS = {
  good: 50,
  unhealthy: 100,
};

const AQIHistoryChart = ({ data }) => {
  const [selectedView, setSelectedView] = useState("AQI History");

  // 3. EXTRACT SERIES: Create the array of AQI values for the chart
  const seriesData = data.map((point) => point.aqi);

  // 4. MAP COLORS: Dynamically determine the color for each bar
  const barColors = data.map((point) => {
    if (point.aqi >= THRESHOLDS.unhealthy) return AQI_COLORS.unhealthy;
    if (point.aqi >= THRESHOLDS.good) return AQI_COLORS.moderate;
    return AQI_COLORS.good;
  });

  // 5. APEXCHARTS MAIN OPTIONS CONFIGURATION
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }, // Hides download options for a clean look
      animations: {
        enabled: true,
        easing: 'easeinout', // Smooth animations
        speed: 800,
        animateOnLoad: true,
      },
      fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    plotOptions: {
      bar: {
        borderRadius: 4, // Professional rounded corners
        columnWidth: '65%', // Spacing between bars
        distributed: true, // IMPORTANT: Allows each bar to have its own color
      },
    },
    colors: barColors, // Apply the dynamically mapped colors
    grid: {
      borderColor: '#374151', // Dark grey lines matching the mockup
      strokeDashArray: 2, // Dashed grid lines
    },
    legend: { show: false }, // Hides dynamic colors from the legend
    dataLabels: { enabled: false }, // Hides numbers on top of each bar
    
    // Y-AXIS CONFIG
    yaxis: {
      min: 0,
      max: 110, // Adjust based on your expected maximum AQI
      tickAmount: 11, // Standard ticks every 10 units
      labels: {
        style: { colors: '#9ca3af', fontSize: '11px' },
      },
      title: {
        text: '↑ AQI Index',
        style: { color: '#9ca3af', fontSize: '12px', fontWeight: 500 },
      },
    },

    // X-AXIS CONFIG (Time labels)
    xaxis: {
      categories: data.map((point) => point.time),
      labels: {
        rotate: -45, // Rotates labels for space, matching the mockup
        style: { colors: '#9ca3af', fontSize: '11px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    // 6. PROFESSIONAL TOUCH: Annotations for thresholds
    annotations: {
      yaxis: [
        {
          y: THRESHOLDS.unhealthy,
          borderColor: '#ffffff', // Clean white line
          strokeDashArray: 0,
          label: {
            borderColor: '#f87171',
            style: { color: '#fff', background: '#f87171' },
            text: 'Unhealthy Threshold (100)',
          },
        },
        {
          y: THRESHOLDS.good,
          borderColor: '#ffffff', // Clean white line
          strokeDashArray: 0,
          label: {
            borderColor: '#fbbf24',
            style: { color: '#fff', background: '#fbbf24' },
            text: 'Good Threshold (50)',
          },
        },
      ],
    },

    // TOOLTIP CONFIG
    tooltip: {
      theme: 'dark', // Perfectly matches your aesthetic
      x: { show: true },
      y: {
        formatter: (val, { dataPointIndex }) => {
          // Add the 'Good/Unhealthy' label to the tooltip
          return `${val} - ${data[dataPointIndex].level}`;
        },
      },
    },
  };

  return (
    <div className="analytics-dashboard-container">
      {/* 7. DASHBOARD HEADER: Replicates the top stats bar */}
      <div className="analytics-header">
        <h2 className="dashboard-title">SkyCast Analytics Engine</h2>
        <div className="stats-strip">
          <div className="stat-item">
            <span>CURRENT AQI</span>
            <div className="value-label unhealthy">
              104 <span>(Unhealthy)</span>
            </div>
          </div>
          <div className="stat-item">
            <span>TEMPERATURE</span>
            <div>104 °C</div> {/* Wait, is this temp correct? 104C is boiling! Assuming it's Fahrenheit or a bug */}
          </div>
          <div className="stat-item">
            <span>HUMIDITY</span>
            <div>57.9%</div>
          </div>
          <div className="stat-item">
            <span>SYSTEM STATUS</span>
            <div className="value-label good">Online</div>
          </div>
        </div>
      </div>

      {/* 8. MAIN CHART AREA */}
      <div className="chart-wrapper">
        <Chart
          options={chartOptions}
          series={[{ name: "AQI Index", data: seriesData }]}
          type="bar"
          height="100%"
        />
      </div>

      {/* 9. DASHBOARD FOOTER: Controls */}
      <div className="analytics-controls">
        <div className="control-group">
          <span>Dashboard View</span>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="view-selector"
          >
            <option>AQI History</option>
            <option>Temp/Humidity Trend</option>
            <option>Peak Analysis</option>
          </select>
        </div>
        <button className="refresh-btn">Refresh Data</button>
      </div>
    </div>
  );
};

export default AQIHistoryChart;
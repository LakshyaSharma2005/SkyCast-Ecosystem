import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./RegionalAnalytics.css";

const RegionalAnalytics = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Default coordinates for Kota, Rajasthan
    const fallbackLat = 25.18;
    const fallbackLon = 75.83;

    const fetchHourlyData = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index&timezone=auto&forecast_days=1`
        );
        const data = await response.json();
        
        // Format times from "2026-03-25T14:00" to "14:00"
        const formattedTimes = data.hourly.time.map(t => t.slice(11, 16));
        
        setChartData({
          times: formattedTimes,
          temp: data.hourly.temperature_2m,
          humidity: data.hourly.relative_humidity_2m,
          wind: data.hourly.wind_speed_10m,
          uv: data.hourly.uv_index,
        });
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchHourlyData(pos.coords.latitude, pos.coords.longitude),
        () => fetchHourlyData(fallbackLat, fallbackLon)
      );
    } else {
      fetchHourlyData(fallbackLat, fallbackLon);
    }
  }, []);

  if (!chartData) return <div className="loading-analytics">Loading Analytics Engine...</div>;

// --- COMMON CHART SETTINGS ---
  const baseOptions = {
    chart: { toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout', speed: 800 } },
    
    // Made the grid lines slightly more visible too
    grid: { borderColor: 'rgba(255,255,255,0.1)', strokeDashArray: 3 }, 
    
    dataLabels: { enabled: false },
    xaxis: { 
      categories: chartData.times, 
      labels: { 
        // ⚡ FIX: Changed from '#9ca3af' to bright white
        style: { colors: 'rgba(255, 255, 255, 0.9)' }, 
        rotate: -45 
      }, 
      axisBorder: {show: false}, 
      axisTicks: {show: false} 
    },
    yaxis: { 
      labels: { 
        // ⚡ FIX: Changed from '#9ca3af' to bright white
        style: { colors: 'rgba(255, 255, 255, 0.9)' } 
      } 
    },
    tooltip: { theme: 'dark' },
    legend: { show: false }
  };

  return (
    <div className="analytics-grid-container">
      {/* 1. TEMPERATURE: Area Chart */}
      <div className="analytics-box">
        <div className="box-header">
          <span>🌡️ 24h Temperature Trend</span>
        </div>
        <Chart
          type="area"
          width="100%"
          height={250}
          series={[{ name: "Temp (°C)", data: chartData.temp }]}
          options={{
            ...baseOptions,
            colors: ['#38bdf8'],
            stroke: { curve: 'smooth', width: 2 },
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } }
          }}
        />
      </div>

      {/* 2. HUMIDITY: Column Chart */}
      <div className="analytics-box">
        <div className="box-header">
          <span>💧 Hourly Humidity</span>
        </div>
        <Chart
          type="bar"
          height={250}
          series={[{ name: "Humidity (%)", data: chartData.humidity }]}
          options={{
            ...baseOptions,
            colors: ['#f472b6'],
            plotOptions: { bar: { borderRadius: 3, columnWidth: '50%' } }
          }}
        />
      </div>

      {/* 3. WIND SPEED: Line Chart */}
      <div className="analytics-box">
        <div className="box-header">
          <span>💨 Wind Speed Forecast</span>
        </div>
        <Chart
          type="line"
          height={250}
          series={[{ name: "Wind (km/h)", data: chartData.wind }]}
          options={{
            ...baseOptions,
            colors: ['#818cf8'],
            stroke: { curve: 'straight', width: 2, dashArray: 4 },
            markers: { size: 4, colors: ['#1e1b4b'], strokeColors: '#818cf8', strokeWidth: 2 }
          }}
        />
      </div>

      {/* 4. UV INDEX: Stepline Chart */}
      <div className="analytics-box">
        <div className="box-header">
          <span>☀️ UV Index Exposure</span>
        </div>
        <Chart
          type="area" // ⚡ Changed to 'area' so it gets the glowing gradient fill
          height={250}
          series={[{ name: "UV Index", data: chartData.uv }]}
          options={{
            ...baseOptions,
            colors: ['#fbbf24'], // ⚡ The exact bright yellow/amber from AQI
            stroke: { curve: 'stepline', width: 3 }, // ⚡ Thicker line to match
            fill: { 
              type: 'gradient', 
              gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } 
            }
          }}
        />
      </div>
        </div>
  );
};

export default RegionalAnalytics;
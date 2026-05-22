import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Suspense,
  lazy,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ref as dbRef, get, child } from "firebase/database";
import { db } from "../services/firebaseService";

import { useSensorData } from "../hooks/useSensorData";
import { useCharts } from "../hooks/useCharts";
import { useTheme } from "../hooks/useTheme";
import { usePrediction } from "../hooks/usePrediction";

import {
  exportCSV,
  exportPDF,
  pushToSheets,
  clearFirebaseHistory,
} from "../services/exportService";
import { calcStats } from "../utils/formatUtils";
import { getAQILevel } from "../utils/aqiUtils";
import { getWeatherEffect } from "../utils/weatherUtils";

import ControlBar from "../components/layout/ControlBar";
import Footer from "../components/layout/Footer";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import AIAssistant from "../components/dashboard/AIAssistant";
import AnalyticsGrid from "../components/analytics/AnalyticsGrid";
import SystemLogs from "../components/logs/SystemLogs";
import TemperatureChart from "../components/charts/TemperatureChart";
import HumidityChart from "../components/charts/HumidityChart";
import RainChart from "../components/charts/RainChart";
import AQIChart from "../components/charts/AQIChart";
import DeepInsights from "../components/DeepInsights";

const RegionalWeather = lazy(
  () => import("../components/regional/RegionalWeather"),
);
const RegionalAnalytics = lazy(
  () => import("../components/regional/RegionalAnalytics"),
);

gsap.registerPlugin(ScrollTrigger);

const Fallback = ({ msg }) => (
  <div className="card" style={{ padding: "2rem", opacity: 0.5 }}>
    {msg}
  </div>
);

const Home = () => {
  const [latency, setLatency] = useState(null);
  const [apiWeather, setApiWeather] = useState({
    isRaining: false,
    isFoggy: false,
  });
  const [ip] = useState("Cloud Connected");
  const [time, setTime] = useState("--:--:--");
  const [threshold, setThreshold] = useState(150);
  const [sysLogs, setSysLogs] = useState([
    {
      time: new Date().toLocaleTimeString(),
      msg: "SkyCast Interface Ready...",
      isAlert: false,
    },
  ]);
  const [stats, setStats] = useState({
    t: { max: "--", avg: "--", min: "--" },
    h: { max: "--", avg: "--", min: "--" },
    r: { max: "--", avg: "--", min: "--" },
    a: { max: "--", avg: "--", min: "--" },
  });
  const [rawHistory, setRawHistory] = useState({
    ts: [],
    t: [],
    h: [],
    r: [],
    a: [],
  });

  const logBoxRef = useRef(null);
  const tempRef = useRef(null);
  const humRef = useRef(null);
  const rainRef = useRef(null);
  const aqiRef = useRef(null);
  const chartRefs = { tempRef, humRef, rainRef, aqiRef };

  const addLog = useCallback((msg, isAlert = false) => {
    setSysLogs((prev) =>
      [...prev, { time: new Date().toLocaleTimeString(), msg, isAlert }].slice(
        -50,
      ),
    );
  }, []);

  const { sensor, lastUpdate, isConnected, histData, subscribe, clearHistory } =
    useSensorData(addLog);
  const { activeTheme, themeOverride, handleThemeToggle } = useTheme(addLog);
  const rainPrediction = usePrediction(sensor, histData);
  const aqiLevel = getAQILevel(sensor.aqi ?? 0);
  const weatherEffect = getWeatherEffect(sensor, apiWeather);

  useCharts(chartRefs, histData, lastUpdate);

  // Scroll restore
  useEffect(() => {
    if ("scrollRestoration" in window.history)
      window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Clock
  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  // Celestial engine
  useEffect(() => {
    const updateSky = () => {
      const now = new Date();
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      const isDay = now.getHours() >= 6 && now.getHours() < 18;
      const progress = isDay
        ? (totalMinutes - 360) / 720
        : now.getHours() >= 18
          ? (totalMinutes - 1080) / 720
          : (totalMinutes + 360) / 720;
      document.documentElement.style.setProperty(
        "--c-x",
        `${10 + progress * 80}vw`,
      );
      document.documentElement.style.setProperty(
        "--c-y",
        `${80 - Math.sin(progress * Math.PI) * 65}vh`,
      );
    };
    updateSky();
    const id = setInterval(updateSky, 60_000);
    return () => clearInterval(id);
  }, []);

  // Lenis + GSAP scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, syncTouch: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    gsap.to(".scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // GSAP entrance
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".header", {
        duration: 0.7,
        y: -20,
        opacity: 0,
        ease: "power2.out",
        clearProps: "all",
      });
      gsap.from(".section-title", {
        duration: 0.6,
        y: 15,
        opacity: 0,
        stagger: 0.15,
        delay: 0.1,
        ease: "power2.out",
        clearProps: "all",
      });
      gsap.from(".stat-card", {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.12,
        delay: 0.2,
        ease: "power2.out",
        clearProps: "all",
      });
      gsap.from(".analytics-card", {
        duration: 0.6,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
        clearProps: "all",
      });
      gsap.from(".chart-card", {
        duration: 0.6,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        delay: 0.7,
        ease: "power2.out",
        clearProps: "all",
      });
      gsap.from(".log-card", {
        duration: 0.6,
        y: 20,
        opacity: 0,
        delay: 0.9,
        ease: "power2.out",
        clearProps: "all",
      });
    });
    return () => ctx.revert();
  }, []);

  // Subscribe sensor
  useEffect(() => {
    const u = subscribe();
    return u;
  }, [subscribe]);

  // Auto-scroll logs
  useEffect(() => {
    if (logBoxRef.current)
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
  }, [sysLogs]);

  // Latency probe
  useEffect(() => {
    const probe = async () => {
      try {
        const start = performance.now();
        await get(dbRef(db, "system/ping"));
        setLatency(Math.round(performance.now() - start));
      } catch {
        setLatency(null);
      }
    };
    probe();
    const id = setInterval(probe, 5_000);
    return () => clearInterval(id);
  }, []);

  // Load historical stats
  const loadStats = useCallback(async () => {
    try {
      const snapshot = await get(child(dbRef(db), "skycast/history"));
      if (!snapshot.exists()) {
        setStats({
          t: { max: "--", avg: "--", min: "--" },
          h: { max: "--", avg: "--", min: "--" },
          r: { max: "--", avg: "--", min: "--" },
          a: { max: "--", avg: "--", min: "--" },
        });
        return;
      }
      const data = snapshot.val();
      let tA = [],
        hA = [],
        aA = [],
        rA = [],
        tsA = [];
      Object.values(data).forEach((row) => {
        if (row.timestamp !== undefined) tsA.push(row.timestamp);
        if (row.temperature !== undefined) tA.push(Number(row.temperature));
        if (row.humidity !== undefined) hA.push(Number(row.humidity));
        if (row.rainPct !== undefined) rA.push(Number(row.rainPct));
        if (row.aqi !== undefined) aA.push(Number(row.aqi));
      });
      setStats({
        t: calcStats(tA),
        h: calcStats(hA),
        r: calcStats(rA),
        a: calcStats(aA),
      });
      setRawHistory({ ts: tsA, t: tA, h: hA, r: rA, a: aA });
      gsap.fromTo(
        ".stat-row-val",
        { y: 8, opacity: 0 },
        { duration: 0.5, y: 0, opacity: 1, stagger: 0.05, ease: "power2.out" },
      );
    } catch (e) {
      addLog(`Error loading cloud stats: ${e.message}`, true);
    }
  }, [addLog]);

  useEffect(() => {
    const fetchInitialData = async () => await loadStats();
    fetchInitialData();
  }, [loadStats]);

  // Button animation
  const animBtn = useCallback((sel) => {
    gsap
      .timeline({ defaults: { ease: "power2.inOut" } })
      .to(sel, { scale: 0.95, y: 3, duration: 0.1 })
      .to(sel, { scale: 1.05, y: -8, duration: 0.25, ease: "power2.out" })
      .to(sel, { scale: 1, y: 0, duration: 0.2, ease: "back.out(2)" });
  }, []);

  const handleSetThreshold = async () => {
    try {
      await fetch("/setthreshold?value=" + threshold);
      addLog(`AQI threshold set to ${threshold}`);
      gsap.fromTo(
        "#btnSet",
        { scale: 0.85 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" },
      );
    } catch (e) {
      addLog(`Failed to set threshold: ${e.message}`, true);
    }
  };

  return (
    <>
      <div className="scroll-progress" />
      <div id="report-target" className={`app ${activeTheme} ${weatherEffect}`}>
        <div className="animated-sky-bg">
          <div className="stars" />
          <div className="sun-moon" />
          <div className="clouds">
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
            <div className="cloud cloud-3" />
            <div className="cloud cloud-4" />
          </div>
        </div>

        <ControlBar
          ip={ip}
          time={time}
          themeOverride={themeOverride}
          onExportCSV={() => {
            animBtn("#btnExport");
            exportCSV(addLog);
          }}
          onSheets={() => {
            animBtn("#btnSheets");
            pushToSheets(addLog);
          }}
          onExportPDF={() => {
            animBtn("#btnExportPDF");
            exportPDF({
              addLog,
              sensor,
              stats,
              rawHistory,
              lastUpdate,
              ip,
              aqiLevel,
              chartRefs,
            });
          }}
          onClear={() => {
            animBtn("#btnClearData");
            clearFirebaseHistory({ addLog, clearHistory });
          }}
          onThemeToggle={handleThemeToggle}
          aqiAlert={sensor.aqiAlert}
          isRaining={sensor.isRaining}
          isConnected={isConnected}
          rainPrediction={rainPrediction}
        />

        <div className="section-title">
          <span className="section-icon">⚡</span> Real-Time Metrics
        </div>
        <MetricsGrid
          sensor={sensor}
          threshold={threshold}
          onThreshold={setThreshold}
          onSetAlert={handleSetThreshold}
        />

        {/* 👇 PASTE THE AI ASSISTANT RIGHT HERE 👇 */}
        <AIAssistant 
          temperature={sensor.temperature || 0} 
          humidity={sensor.humidity || 0} 
          aqi={sensor.aqi || 0} 
        />
        {/* 👆 ================================ 👆 */}

        <Suspense fallback={<Fallback msg="Loading regional data..." />}>
          <RegionalWeather onWeatherUpdate={setApiWeather} />
        </Suspense>

        <div className="section-title">
          <span className="section-icon">📊</span> Historical Analytics
          <button
            id="btnRefreshStats"
            className="btn"
            onClick={() => {
              animBtn("#btnRefreshStats");
              addLog("Refreshing historical stats...");
              loadStats();
            }}
          >
            ↻ Refresh
          </button>
        </div>
        <AnalyticsGrid stats={stats} />

        <div className="section-title" style={{ marginTop: "2rem" }}>
          <span className="section-icon">🧠</span> Deep Data Insights
        </div>
        <DeepInsights historyData={rawHistory} />

        <div className="section-title" style={{ marginTop: "2rem" }}>
          <span className="section-icon">✨</span> Advanced Regional Forecast
        </div>
        <Suspense fallback={<Fallback msg="Loading forecast..." />}>
          <RegionalAnalytics />
        </Suspense>

        <div className="section-title">
          <span className="section-icon">📈</span> Live Trend Analysis
        </div>
        <div className="grid-charts">
          <TemperatureChart
            canvasRef={tempRef}
            currentValue={sensor.temperature}
          />
          <HumidityChart canvasRef={humRef} currentValue={sensor.humidity} />
          <RainChart canvasRef={rainRef} currentValue={sensor.rainPct} />
          <AQIChart canvasRef={aqiRef} currentValue={sensor.aqi} />
        </div>

        <div className="section-title">
          <span className="section-icon">⚙️</span> System Diagnostics
        </div>
        <SystemLogs logs={sysLogs} logBoxRef={logBoxRef} />

        <Footer
          isConnected={isConnected}
          latency={latency}
          lastUpdate={lastUpdate}
        />
      </div>
    </>
  );
};

export default Home;

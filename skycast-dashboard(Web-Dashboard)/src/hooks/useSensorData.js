import { useState, useCallback, useRef, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebaseService";

const MAX_PTS = 60;

// ==========================================
// 1. INDEXED-DB CACHE MANAGER
// ==========================================
const initDB = () => {
  return new Promise((resolve, reject) => {
    // Opens a local database called "SkyCastDB"
    const request = indexedDB.open("SkyCastDB", 1);
    request.onupgradeneeded = (e) => e.target.result.createObjectStore("cache");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveCache = async (data) => {
  try {
    const db = await initDB();
    // Silently overwrites the old chart data with the new array
    db.transaction("cache", "readwrite")
      .objectStore("cache")
      .put(data, "histData");
  } catch (e) {
    console.error("Local cache save failed", e);
  }
};

const loadCache = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const request = db
        .transaction("cache", "readonly")
        .objectStore("cache")
        .get("histData");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    console.error("Cache load error:", e);
    return null;
  }
};

// ==========================================
// 2. THE CUSTOM HOOK
// ==========================================
export function useSensorData(onLog) {
  const [sensor, setSensor] = useState({
    temperature: null,
    humidity: null,
    rainPct: null,
    aqi: null,
    isRaining: false,
    aqiAlert: false,
  });
  const [lastUpdate, setLastUpdate] = useState("--");
  const [isConnected, setIsConnected] = useState(true);
  const histData = useRef({ ts: [], t: [], h: [], r: [], aqi: [] });

  // ⚡ THE MAGIC: Load cached data the millisecond the app opens
  useEffect(() => {
    loadCache().then((cachedData) => {
      if (cachedData && cachedData.ts.length > 0) {
        histData.current = cachedData;
        // Trigger a fake "update" so App.jsx immediately draws the charts
        setLastUpdate(cachedData.ts[cachedData.ts.length - 1] + " (Cached)");
        onLog("Restored historical chart data from local cache.", false);
      }
    });
  }, [onLog]);

  const subscribe = useCallback(() => {
    // Connection monitor
    const connRef = ref(db, ".info/connected");
    const unsubConn = onValue(connRef, (snap) => {
      const ok = snap.val() === true;
      setIsConnected(ok);
      onLog(ok ? "Firebase connected" : "Firebase disconnected", !ok);
    });

    // Sensor data
    const sensorRef = ref(db, "skycast/live");
    const unsubSensor = onValue(
      sensorRef,
      (snapshot) => {
        const d = snapshot.val();
        if (!d) {
          onLog("Awaiting initial data from Firebase...");
          return;
        }

        const now = new Date().toLocaleTimeString();
        setSensor({
          temperature: Number(d.temperature ?? 0),
          humidity: Number(d.humidity ?? 0),
          rainPct: Number(d.rainPct ?? 0),
          aqi: Number(d.aqi ?? 0),
          isRaining: d.isRaining ?? false,
          aqiAlert: d.aqiAlert ?? false,
        });
        setLastUpdate(now);

        onLog(
          `T:${d.temperature}°C | H:${d.humidity}% | R:${d.rainPct}% | AQI:${d.aqi}`,
          d.aqiAlert || d.isRaining,
        );

        const h = histData.current;
        if (h.ts.length >= MAX_PTS) {
          ["ts", "t", "h", "r", "aqi"].forEach((k) => h[k].shift());
        }
        h.ts.push(now);
        h.t.push(d.temperature);
        h.h.push(d.humidity);
        h.r.push(d.rainPct);
        h.aqi.push(d.aqi);

        // ⚡ SILENT SAVE: Back up the arrays to IndexedDB without blocking the UI
        saveCache(h);
      },
      (err) => onLog(`Firebase error: ${err.message}`, true),
    );

    return () => {
      unsubConn();
      unsubSensor();
    };
  }, [onLog]);

  return { sensor, lastUpdate, isConnected, histData, subscribe };
}

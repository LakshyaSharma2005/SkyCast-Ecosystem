import { useMemo } from "react";

export const usePrediction = (sensor, histData) =>
  useMemo(() => {
    const liveHumidityArray = histData?.current?.h;
    if (!liveHumidityArray || liveHumidityArray.length < 10) return null;
    const recentHum  = liveHumidityArray.slice(-10);
    const slope      = (recentHum[recentHum.length - 1] - recentHum[0]) / 10;
    const currentHum = recentHum[recentHum.length - 1];
    if (slope > 1.5 && currentHum > 75 && !sensor.isRaining) {
      return "Rain likely in ~15-30 mins (Rapid humidity spike detected)";
    }
    return null;
  }, [sensor.isRaining, histData]);
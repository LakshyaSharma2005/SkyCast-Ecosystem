export const calcStats = (arr) => {
  if (!arr.length) return { max: "--", min: "--", avg: "--" };
  const sum = arr.reduce((a, b) => a + b, 0);
  return {
    max: Math.max(...arr).toFixed(1),
    min: Math.min(...arr).toFixed(1),
    avg: (sum / arr.length).toFixed(1),
  };
};

export const getLatencyStatus = (ms) => {
  if (ms === null) return { label: "Offline",  color: "#ef4444" };
  if (ms < 100)   return { label: "Excellent", color: "#34d399" };
  if (ms < 200)   return { label: "Good",      color: "#fbbf24" };
  return               { label: "Slow",        color: "#f97316" };
};

export const parseTimestamp = (rawTimestamp = "Unknown") => {
  if (rawTimestamp === "Unknown") return { dateVal: "Unknown", timeVal: "Unknown" };
  if (rawTimestamp.includes(" ")) {
    const parts = rawTimestamp.split(" ");
    return { dateVal: parts[0], timeVal: parts.slice(1).join(" ") };
  }
  return { dateVal: rawTimestamp, timeVal: "" };
};
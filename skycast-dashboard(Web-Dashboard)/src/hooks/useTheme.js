import { useState, useEffect, useCallback } from "react";
import { calculateTimeTheme } from "../utils/weatherUtils";
import gsap from "gsap";

export const useTheme = (addLog) => {
  const [timeTheme,     setTimeTheme]     = useState(calculateTimeTheme);
  const [themeOverride, setThemeOverride] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setTimeTheme(calculateTimeTheme()), 60_000);
    return () => clearInterval(id);
  }, []);

  const handleThemeToggle = useCallback(() => {
    // Button Animation
    gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .to("#btnThemeToggle", { scale: 0.95, y: 3,  duration: 0.1 })
      .to("#btnThemeToggle", { scale: 1.05, y: -8, duration: 0.25, ease: "power2.out" })
      .to("#btnThemeToggle", { scale: 1,    y: 0,  duration: 0.2,  ease: "back.out(2)" });

    let nextTheme = null;
    let logMsg = "";

    // The predictable theme sequence loop
    if (themeOverride === null) {
      nextTheme = "theme-day";
      logMsg = "Theme Override: Forced Day Mode";
    } 
    else if (themeOverride === "theme-day") {
      nextTheme = "theme-evening";
      logMsg = "Theme Override: Forced Evening Mode";
    } 
    else if (themeOverride === "theme-evening") {
      nextTheme = "theme-night";
      logMsg = "Theme Override: Forced Night Mode";
    } 
    else {
      // If it is currently Night (or any other state), reset back to Auto
      nextTheme = null;
      logMsg = "Theme Override Released: Real-time Auto Mode";
    }

    addLog?.(logMsg);
    setThemeOverride(nextTheme);

  }, [themeOverride, addLog]);

  return {
    activeTheme: themeOverride ?? timeTheme,
    themeOverride,
    handleThemeToggle,
  };
};
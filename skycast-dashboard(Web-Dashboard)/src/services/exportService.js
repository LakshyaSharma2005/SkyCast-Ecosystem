import { get, child, ref, remove } from "firebase/database";
import { db }       from "./firebaseService";
import html2canvas  from "html2canvas";
import jsPDF        from "jspdf";
import autoTable    from "jspdf-autotable";
import { parseTimestamp } from "../utils/formatUtils";

const SHEETS_WRITE_URL =
  "https://script.google.com/macros/s/AKfycbxRFeSjADNw2byzZ_sVif8aKqFpilzOJyDzxAJxLYGVYwGzGwA1Wrz_SMqinO7303vj/exec";
const SHEETS_DOC_URL =
  "https://docs.google.com/spreadsheets/d/1jr3LYadYiorvY1pRIv0s_3nUK8tCzxuhf1SFEme86EE/edit?usp=sharing";

// ─── CSV ─────────────────────────────────────────────────────────────────────
export const exportCSV = async (addLog) => {
  addLog("Fetching ML dataset from Firebase...");
  try {
    const snapshot = await get(child(ref(db), "skycast/history"));
    if (!snapshot.exists()) { addLog("Export failed: No data found in Cloud.", true); return; }
    addLog("Generating CSV for ML Training...");
    const data = snapshot.val();
    let csv = "Date,Time,Temperature,Humidity,RainPct,AQI\n";
    Object.values(data).forEach((row) => {
      const { dateVal, timeVal } = parseTimestamp(row.timestamp);
      csv += `${dateVal},${timeVal},${row.temperature ?? 0},${row.humidity ?? 0},${row.rainPct ?? 0},${row.aqi ?? 0}\n`;
    });
    const url  = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: `skycast_ML_dataset_${Date.now()}.csv`,
    });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("ML Dataset download complete. ✅");
  } catch (e) {
    addLog(`Firebase export error: ${e.message}`, true);
  }
};

// ─── Google Sheets ────────────────────────────────────────────────────────────
export const pushToSheets = async (addLog) => {
  addLog("Preparing database mirror for Google Sheets...");
  try {
    const snapshot = await get(child(ref(db), "skycast/history"));
    if (!snapshot.exists()) { addLog("Sync failed: No data found in Cloud.", true); return; }
    const payload = Object.values(snapshot.val()).map((row) => {
      const { dateVal, timeVal } = parseTimestamp(row.timestamp);
      return { date: dateVal, time: timeVal, temp: row.temperature ?? 0, hum: row.humidity ?? 0, rain: row.rainPct ?? 0, aqi: row.aqi ?? 0 };
    });
    addLog("Transmitting payload securely to Google Cloud...");
    fetch(SHEETS_WRITE_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).then(() => addLog("✅ Live Google Sheet updated successfully!"))
      .catch((e) => addLog(`Sheets sync failed: ${e.message}`, true));
    window.open(SHEETS_DOC_URL, "_blank");
  } catch (e) {
    addLog(`Sheets sync failed: ${e.message}`, true);
  }
};

// ─── PDF ──────────────────────────────────────────────────────────────────────
export const exportPDF = async ({ addLog, sensor, stats, rawHistory, lastUpdate, ip, aqiLevel, chartRefs }) => {
  addLog("Generating professional multi-section PDF report...");
  try {
    const doc        = new jsPDF("p", "mm", "a4");
    const pageWidth  = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let   y          = 20;

    const darkBg = () => { doc.setFillColor(15, 23, 42); doc.rect(0, 0, pageWidth, pageHeight, "F"); };
    const _addPage = doc.addPage.bind(doc);
    doc.addPage = (...args) => { _addPage(...args); darkBg(); return doc; };
    darkBg();

    // Header
    doc.setFontSize(24); doc.setTextColor(56, 189, 248); doc.text("SkyCast", 20, y);
    doc.setFontSize(18); doc.setTextColor(255, 255, 255); doc.text("Environment Monitoring & Analysis Report", 20, y + 12);
    y += 35;
    doc.setFontSize(11); doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
    doc.text(`Connection: ${ip} | Last Update: ${lastUpdate}`, 20, y + 8);
    doc.setDrawColor(56, 189, 248); doc.line(20, y + 18, pageWidth - 20, y + 18);
    y += 40;

    const checkPage = (need) => { if (y + need > pageHeight) { doc.addPage(); y = 20; } };

    // Current Readings
    checkPage(110);
    doc.setFontSize(16); doc.setTextColor(255, 255, 255); doc.text("Current Sensor Readings", 20, y); y += 10;
    autoTable(doc, {
      startY: y,
      head: [["Parameter", "Value", "Status"]],
      body: [
        ["Temperature",             `${sensor.temperature?.toFixed(1) ?? "--"} °C`, ""],
        ["Humidity",                `${sensor.humidity?.toFixed(1)    ?? "--"} %`,  ""],
        ["Rain Intensity",          `${sensor.rainPct                 ?? "--"} %`,  sensor.isRaining ? "RAINING" : "DRY"],
        ["Air Quality Index (AQI)", sensor.aqi                        ?? "--",      aqiLevel.label],
      ],
      theme: "striped", pageBreak: "avoid",
      headStyles: { fillColor: [56, 189, 248], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 11, cellPadding: 6, textColor: [232, 237, 245] },
      margin: { left: 20, right: 20 },
      alternateRowStyles: { fillColor: [17, 29, 48] },
      bodyStyles: { fillColor: [15, 23, 42] },
    });
    y = doc.lastAutoTable.finalY + 22;

    // Historical Stats
    checkPage(110);
    doc.setFontSize(16); doc.setTextColor(255, 255, 255); doc.text("Historical Statistics", 20, y); y += 10;
    autoTable(doc, {
      startY: y,
      head: [["Metric", "Maximum", "Average", "Minimum"]],
      body: [
        ["Temperature (°C)",   stats.t.max, stats.t.avg, stats.t.min],
        ["Humidity (%)",        stats.h.max, stats.h.avg, stats.h.min],
        ["Rain Intensity (%)", stats.r.max, stats.r.avg, stats.r.min],
        ["AQI",                stats.a.max, stats.a.avg, stats.a.min],
      ],
      theme: "grid", pageBreak: "avoid",
      headStyles: { fillColor: [251, 191, 36], textColor: [0, 0, 0], fontStyle: "bold" },
      styles: { fontSize: 11, cellPadding: 6, textColor: [232, 237, 245], lineColor: [40, 55, 75] },
      margin: { left: 20, right: 20 },
      bodyStyles: { fillColor: [15, 23, 42] },
    });
    y = doc.lastAutoTable.finalY + 25;

    // Charts
    checkPage(35);
    doc.setFontSize(16); doc.setTextColor(255, 255, 255); doc.text("Live Trend Analysis", 20, y); y += 18;
    const M = 20, H = 58, TITLE_GAP = 5, SPACING = 12, BOTTOM = 25;
    const charts = [
      { ref: chartRefs.tempRef, title: "Temperature History (°C)" },
      { ref: chartRefs.humRef,  title: "Humidity History (%)" },
      { ref: chartRefs.rainRef, title: "Rain Intensity History (%)" },
      { ref: chartRefs.aqiRef,  title: "AQI Trend" },
    ];
    for (const chart of charts) {
      if (!chart.ref?.current) continue;
      const canvas = await html2canvas(chart.ref.current, { scale: 3, useCORS: true, backgroundColor: "#0f172a" });
      const aspect = canvas.width / canvas.height;
      let imgW = H * aspect, imgH = H;
      if (imgW > pageWidth - M * 2) { imgW = pageWidth - M * 2; imgH = imgW / aspect; }
      if (y + 12 + TITLE_GAP + imgH + SPACING > pageHeight - BOTTOM) { doc.addPage(); y = 20; }
      doc.setFontSize(12); doc.setTextColor(148, 163, 184); doc.text(chart.title, M, y); y += TITLE_GAP;
      doc.addImage(canvas.toDataURL("image/png"), "PNG", M + (pageWidth - M * 2 - imgW) / 2, y, imgW, imgH);
      y += imgH + SPACING;
    }

    // Summary
    checkPage(70);
    doc.setFontSize(16); doc.setTextColor(255, 255, 255); doc.text("Report Summary", 20, y); y += 16;
    doc.setFontSize(11); doc.setTextColor(148, 163, 184);
    doc.text(`• Total data points captured: ${rawHistory.ts.length}`, 20, y); y += 9;
    doc.text(`• Latest reading: ${lastUpdate}`, 20, y); y += 9;
    if (sensor.aqi) doc.text(`• Current AQI Status: ${aqiLevel.label}`, 20, y);

    // Page numbers
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
      doc.text(`Page ${i} of ${total} | SkyCast Environment Monitor`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    const d = new Date();
    doc.save(`SkyCast_Report_${d.toLocaleDateString().replace(/\//g, "-")}_${d.getHours()}-${d.getMinutes()}.pdf`);
    addLog("✅ Professional PDF report generated successfully!");
  } catch (e) {
    console.error("PDF Error:", e);
    addLog(`PDF generation failed: ${e.message}`, true);
  }
};

// ─── Clear Firebase ───────────────────────────────────────────────────────────
export const clearFirebaseHistory = async ({ addLog, clearHistory }) => {
  if (!window.confirm("WARNING: This will permanently delete the current ML dataset from the Cloud. Continue?")) return;
  addLog("Sending nuke command to Firebase...", true);
  try {
    await remove(ref(db, "skycast/history"));
    clearHistory();
    addLog("Firebase dataset completely wiped. 🗑️", true);
  } catch (e) {
    addLog(`Failed to clear Firebase: ${e.message}`, true);
  }
};
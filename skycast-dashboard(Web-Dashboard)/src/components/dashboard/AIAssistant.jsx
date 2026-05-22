import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIAssistant = ({ temperature, humidity, aqi }) => {
  const [insight, setInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInsight = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      console.log("Checking API Key setup...");
      console.log("Raw Key Value:", rawKey);

      if (!rawKey) {
        throw new Error("API Key is missing! Vite cannot see your .env file.");
      }

      const API_KEY = rawKey.trim(); 
      
      console.log("Initializing Gemini SDK...");
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `You are an expert environmental analyst. The current local weather is: Temperature ${temperature}°C, Humidity ${humidity}%, and Air Quality Index (AQI) ${aqi}. Based on these metrics, provide a short, 2-sentence actionable recommendation for a human going outside or managing their home environment. Keep it professional but conversational.`;

      console.log("Sending prompt to Gemini...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();
      
      console.log("Success! Received response.");
      setInsight(aiText);

    } catch (err) {
      console.error("AI Feature Error Captured:", err.message);
      setError(err.message || "Unable to connect to the AI engine.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "20px", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, color: "white", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>✨</span> AI Environmental Analysis
        </h3>
        
        <button 
          className="generate-btn"
          onClick={generateInsight} 
          disabled={isLoading}
          style={{
            background: isLoading ? "#475569" : "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "50px",
            fontWeight: "600",
            cursor: isLoading ? "wait" : "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {isLoading ? "Analyzing..." : "Generate Insight"}
        </button>
      </div>

      <div style={{ minHeight: "60px", color: "#cbd5e1", fontSize: "15px", lineHeight: "1.6" }}>
        {error && <span style={{ color: "#f87171" }}>{error}</span>}
        {!insight && !error && !isLoading && <span>Click the button to get real-time AI recommendations based on your current sensor readings.</span>}
        {isLoading && <span style={{ opacity: 0.7, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Querying global climate models...</span>}
        {insight && <span style={{ color: "white" }}>"{insight}"</span>}
      </div>
    </div>
  );
};

export default AIAssistant;
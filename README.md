# 🌦️ Full Stack Predictive IoT Environmental Ecosystem (Web & Android)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Android Studio](https://img.shields.io/badge/Android%20Studio-3DDC84.svg?style=for-the-badge&logo=android-studio&logoColor=white)
![ESP32](https://img.shields.io/badge/ESP32-000000?style=for-the-badge&logo=espressif&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

A complete, full-stack predictive Internet of Things (IoT) ecosystem designed to capture, analyze, and visualize real-time environmental data. This monorepo contains the hardware firmware, a responsive web dashboard, and a cross-platform mobile application that all communicate seamlessly via the cloud.

---

## 🌟 Ecosystem Overview

The system actively monitors localized weather conditions and indoor/outdoor air quality. Data flows from physical sensors through an ESP32 microcontroller into a Firebase Realtime Database, which acts as the central hub. The data is then instantly distributed to user-facing applications and processed by AI to provide actionable, predictive environmental insights.

### ✨ Core Features
* **Real-Time Telemetry:** Instantaneous syncing of Temperature, Humidity, Rain Intensity, and Air Quality Index (AQI).
* **Predictive AI Insights:** Integration with Google Gemini API to analyze raw sensor trends and generate natural language forecasts and safety recommendations.
* **Automated Data Logging:** One-click synchronization to push historical sensor data directly into Google Sheets.
* **Dynamic Glassmorphism UI:** A custom web interface featuring a 4-state time-based theme engine (Auto, Day, Evening, Night) driven by celestial math.
* **Multi-Platform Access:** Monitor the environment from a browser or via a dedicated Android application.

---

## 🧰 Hardware & Architecture

### Physical Components
| Component | Function |
| :--- | :--- |
| **ESP32** | Main microcontroller processing sensor reads and maintaining Wi-Fi/Cloud connectivity. |
| **DHT11** | Captures ambient temperature and relative humidity. |
| **MQ2** | Detects combustible gases and smoke to calculate the Air Quality Index. |
| **MH-RD** | Raindrop module to detect the presence and intensity of precipitation. |

### Data Flow
`Sensors` ➔ `ESP32` ➔ `Firebase Realtime DB` ➔ `React Web / Android App` ➔ `Gemini AI / Google Sheets`

---

## 📁 Monorepo Structure

This repository follows a monorepo architecture, containing the hardware firmware, web dashboard, and mobile application in their respective directories:

```text
SKYCAST-ECOSYSTEM/
 ├── .github/                           # GitHub Actions / Workflows
 ├── esp32-firmware/                    # C++ source code for the microcontroller
 │    ├── main.cpp                      # Primary sensor logic and Firebase loops
 │    └── secrets.h                     # (Ignored) Wi-Fi and Firebase credentials
 │
 ├── skycast-dashboard(Web-Dashboard)/  # React.js frontend powered by Vite
 │    ├── public/                       # Static assets
 │    ├── src/                          # React components, hooks, and services
 │    ├── .env                          # (Ignored) Gemini API and Firebase keys
 │    ├── firebase.json                 # Firebase hosting configuration
 │    ├── package.json                  # Node dependencies
 │    └── vite.config.js                # Vite configuration
 │
 └── SkyCast(Android-App)/              # Native mobile application
      ├── app/                          # Android source code and layouts
      ├── gradle/                       # Gradle wrapper files
      ├── build.gradle.kts              # Project build configuration
      ├── local.properties              # (Ignored) SDK path and local config
      └── settings.gradle.kts           # Gradle settings

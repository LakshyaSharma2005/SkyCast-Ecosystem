# 🌦️ SkyCast Ecosystem

## Full Stack Predictive IoT Environmental Ecosystem Web & Android

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20IoT-blue?style=for-the-badge" alt="Platform" />
  <img src="https://img.shields.io/badge/Microcontroller-ESP32-orange?style=for-the-badge" alt="ESP32" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge" alt="React Vite" />
  <img src="https://img.shields.io/badge/Database-Firebase%20Realtime%20Database-yellow?style=for-the-badge" alt="Firebase" />
  <img src="https://img.shields.io/badge/Mobile-Native%20Android-green?style=for-the-badge" alt="Android" />
  <img src="https://img.shields.io/badge/AI-Gemini%20API-purple?style=for-the-badge" alt="Gemini API" />
</p>

---

## 📌 Project Overview

**SkyCast Ecosystem** is a complete full-stack, multi-platform IoT environmental monitoring system designed to collect, process, visualize, and analyze real-time localized weather and air-quality data.

The system uses an **ESP32 Development Board** connected with environmental sensors to capture temperature, humidity, gas/smoke level, rain intensity, and air-quality related readings. These values are pushed to **Firebase Realtime Database**, where both the **React Web Dashboard** and the **Native Android App** listen for live updates.

The project also integrates **AI-powered predictive insights** using the **Google Gemini API**, historical data logging using the **Google Sheets API**, and regional baseline comparison using the **Open-Meteo Weather API**.

---

## 🚀 Project Title

**Full Stack Predictive IoT Environmental Ecosystem Web & Android**

---

## 🧠 Key Idea

SkyCast is not just a weather dashboard.

It is a complete environmental intelligence ecosystem that combines:

- IoT-based sensor monitoring
- Cloud-based realtime data synchronization
- Web dashboard visualization
- Native Android mobile access
- AI-based environmental prediction
- Historical data logging
- Weather baseline comparison

---

## 🏗️ System Architecture

    ┌────────────────────────────┐
    │        IoT Hardware         │
    │ ESP32 + DHT11 + MQ2 + MH-RD │
    └──────────────┬─────────────┘
                   │
                   │ Wi-Fi JSON Payload
                   ▼
    ┌────────────────────────────┐
    │ Firebase Realtime Database │
    │ Central Cloud Data Hub     │
    └──────────────┬─────────────┘
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
    ┌───────────────┐   ┌────────────────┐
    │ React Web App │   │ Android App     │
    │ Vite Dashboard│   │ Native Mobile   │
    └───────┬───────┘   └────────────────┘
            │
            ├──────────────► Gemini API
            │                AI Insights
            │
            ├──────────────► Google Sheets API
            │                Historical Logging
            │
            └──────────────► Open-Meteo API
                             Regional Comparison

---

## 🧩 Main Features

### 🌡️ Real-Time Environmental Monitoring

SkyCast captures and displays live environmental data including:

- Temperature
- Humidity
- Gas / smoke level
- Rain intensity
- Air Quality Index estimation
- Timestamped sensor readings

---

### 📡 ESP32-Based IoT Data Collection

The ESP32 reads sensor data from:

| Sensor | Purpose |
|---|---|
| **DHT11** | Temperature and humidity monitoring |
| **MQ2** | Gas, smoke, and air quality estimation |
| **MH-RD Rain Module** | Rain detection and rain intensity monitoring |

The processed sensor data is sent to Firebase as a structured JSON payload.

---

### 🔥 Firebase Realtime Database Integration

Firebase Realtime Database acts as the central state manager of the project.

It stores:

- Latest sensor values
- Historical telemetry
- Device status
- Dashboard-readable data
- Android app-readable data

Both the web dashboard and Android app listen to Firebase updates in real time.

---

### 🖥️ React Web Dashboard

The web dashboard is built using:

- React.js
- Vite
- CSS3 variables
- Custom glassmorphism UI
- GSAP animations
- Lenis smooth scrolling
- Chart.js or similar charting library

The dashboard provides a modern, interactive interface for visualizing environmental conditions.

---

### 🎨 Dynamic Theme Engine

SkyCast includes a custom 4-state dynamic theme system:

| Theme Mode | Description |
|---|---|
| **Day** | Bright daytime interface |
| **Evening** | Warm sunset-inspired interface |
| **Night** | Dark night mode interface |
| **Auto** | Automatically changes theme based on celestial math and system time |

---

### 📊 Live Data Visualization

The dashboard visualizes live sensor arrays using charts for:

- Temperature trends
- Humidity trends
- Rain intensity trends
- AQI / gas level trends

These charts help users understand environmental changes over time.

---

### 📱 Native Android App

SkyCast also includes a native Android application built in Android Studio using Kotlin/Java.

The Android app connects directly to Firebase using `google-services.json`.

It displays real-time environmental readings from the same Firebase Realtime Database used by the web dashboard.

---

### 🤖 Gemini AI Predictive Insights

The dashboard can trigger the Gemini API to analyze current environmental readings and generate natural language insights such as:

- Weather safety warnings
- Air quality alerts
- Rain probability interpretation
- Environmental risk summaries
- Predictive condition analysis

Example use case:

    If gas level rises and humidity drops, Gemini can generate a safety warning for possible smoke or poor air quality conditions.

---

### 📄 Google Sheets Data Logging

SkyCast can export or append historical Firebase telemetry data to Google Sheets.

This allows:

- Long-term record keeping
- CSV-style data analysis
- Report generation
- Academic project documentation
- Environmental trend tracking

---

### 🌍 Open-Meteo Weather Comparison

SkyCast can compare local sensor data with regional weather data from Open-Meteo.

This helps identify differences between:

- Local microclimate readings
- Regional forecast data
- Actual sensor-based environmental conditions

---

## 🗂️ Monorepo Structure

    SkyCast-Ecosystem/
    │
    ├── SkyCast(Android-App)/
    │   ├── app/
    │   ├── gradle/
    │   ├── build.gradle
    │   ├── settings.gradle
    │   └── google-services.json
    │
    ├── esp32-firmware/
    │   ├── main.cpp
    │   ├── secrets.h
    │   └── README.md
    │
    ├── skycast-dashboard(Web-Dashboard)/
    │   ├── public/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   │   ├── useTheme.js
    │   │   │   ├── useCharts.js
    │   │   │   └── useSensorData.js
    │   │   ├── firebase/
    │   │   ├── styles/
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── package.json
    │   ├── vite.config.js
    │   └── .env
    │
    ├── README.md
    └── .gitignore

---

## 🛠️ Tech Stack

### Hardware

| Component | Technology |
|---|---|
| Microcontroller | ESP32 Development Board |
| Programming | C++ / Arduino Framework |
| Temperature & Humidity | DHT11 |
| Gas / Smoke Detection | MQ2 |
| Rain Detection | MH-RD Raindrop Module |

---

### Cloud & Backend

| Feature | Technology |
|---|---|
| Realtime Database | Firebase Realtime Database |
| Hosting | Firebase Hosting |
| Cloud Data Sync | Firebase SDK |
| Historical Logging | Google Sheets API |

---

### Web Frontend

| Feature | Technology |
|---|---|
| Framework | React.js |
| Build Tool | Vite |
| Styling | CSS3 Variables |
| UI Style | Glassmorphism |
| Animation | GSAP |
| Smooth Scrolling | Lenis |
| Charts | Chart.js or similar |
| Theme Engine | Custom Day / Evening / Night / Auto system |

---

### Android App

| Feature | Technology |
|---|---|
| Platform | Native Android |
| IDE | Android Studio |
| Language | Kotlin / Java |
| Database Integration | Firebase Realtime Database |
| Config File | google-services.json |

---

### External APIs

| API | Purpose |
|---|---|
| Google Gemini API | AI predictive environmental insights |
| Google Sheets API | Exporting and appending historical data |
| Open-Meteo API | Regional weather baseline comparison |

---

## 🔄 Data Flow Explanation

### Step 1: Sensor Reading

The ESP32 reads values from:

    DHT11  -> Temperature and Humidity
    MQ2    -> Gas / Smoke Level
    MH-RD  -> Rain Intensity

### Step 2: Data Processing

The ESP32 processes raw sensor values and prepares a JSON payload.

Example structure:

    {
      "temperature": 31.5,
      "humidity": 64,
      "gasLevel": 420,
      "rainValue": 280,
      "aqi": 78,
      "deviceStatus": "online",
      "timestamp": "2026-05-22T10:30:00"
    }

### Step 3: Firebase Upload

The ESP32 sends the processed JSON data to Firebase Realtime Database over Wi-Fi.

### Step 4: Realtime UI Update

Both the React dashboard and Android app listen to Firebase references.

Whenever Firebase data changes:

    Firebase Update -> Web Dashboard Updates Instantly
    Firebase Update -> Android App Updates Instantly

### Step 5: AI Insight Generation

The user can trigger Gemini AI from the dashboard.

The dashboard sends the latest Firebase sensor state to Gemini and receives an AI-generated predictive insight.

### Step 6: Historical Logging

The dashboard can sync Firebase history data to Google Sheets for long-term storage and analysis.

---

## 🖥️ Web Dashboard Highlights

The web dashboard includes:

- Realtime Firebase sensor cards
- Glassmorphism UI layout
- Live environmental charts
- Dynamic theme switching
- AI insight panel
- Google Sheets export action
- Open-Meteo comparison section
- Smooth animations and transitions
- Responsive layout for desktop and mobile screens

---

## 📱 Android App Highlights

The Android application includes:

- Native Android interface
- Firebase Realtime Database listener
- Live temperature, humidity, rain, and AQI display
- Device status monitoring
- Mobile-friendly environmental overview
- Shared data source with the web dashboard

---

## 🔐 Security Notes

This project uses sensitive credentials such as:

- Firebase API keys
- Wi-Fi SSID and password
- Gemini API key
- Google Sheets API credentials

These values should never be committed directly to GitHub.

Use ignored files such as:

- `secrets.h`
- `.env`
- `google-services.json`

Recommended placeholder format for ESP32 secrets:

    #define WIFI_SSID "YOUR_WIFI_SSID"
    #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
    #define FIREBASE_HOST "YOUR_FIREBASE_DATABASE_URL"
    #define FIREBASE_AUTH "YOUR_FIREBASE_DATABASE_SECRET"

For Vite environment variables:

    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_DATABASE_URL=your_database_url
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_OPEN_METEO_BASE_URL=https://api.open-meteo.com

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

    git clone https://github.com/LakshyaSharma2005/SkyCast-Ecosystem.git
    cd SkyCast-Ecosystem

### 2. ESP32 Firmware Setup

Navigate to the firmware folder:

    cd esp32-firmware

Create a `secrets.h` file:

    #ifndef SECRETS_H
    #define SECRETS_H

    #define WIFI_SSID "YOUR_WIFI_SSID"
    #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

    #define FIREBASE_HOST "YOUR_FIREBASE_DATABASE_URL"
    #define FIREBASE_AUTH "YOUR_FIREBASE_DATABASE_SECRET"

    #endif

Upload the firmware to the ESP32 using Arduino IDE or PlatformIO.

### 3. Web Dashboard Setup

Navigate to the dashboard folder:

    cd "skycast-dashboard(Web-Dashboard)"

Install dependencies:

    npm install

Create a `.env` file:

    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_OPEN_METEO_BASE_URL=https://api.open-meteo.com

Run the development server:

    npm run dev

Build for production:

    npm run build

Deploy to Firebase Hosting:

    firebase deploy

### 4. Android App Setup

Open the following folder in Android Studio:

    SkyCast(Android-App)

Then:

1. Add your Firebase `google-services.json` file inside the Android app module.
2. Sync Gradle.
3. Build the project.
4. Run the app on an emulator or physical Android device.

---

## 🔥 Firebase Database Suggested Structure

    {
      "skycast": {
        "latest": {
          "temperature": 31.5,
          "humidity": 64,
          "gasLevel": 420,
          "rainValue": 280,
          "aqi": 78,
          "deviceStatus": "online",
          "timestamp": "2026-05-22T10:30:00"
        },
        "history": {
          "reading_001": {
            "temperature": 31.5,
            "humidity": 64,
            "gasLevel": 420,
            "rainValue": 280,
            "aqi": 78,
            "timestamp": "2026-05-22T10:30:00"
          }
        },
        "aiInsights": {
          "latestInsight": "Air quality is moderate. Rain intensity is low. Conditions are currently safe."
        }
      }
    }

---

## 🧪 Example Sensor Payload

    {
      "temperature": 29.8,
      "humidity": 71,
      "gasLevel": 350,
      "rainValue": 120,
      "aqi": 65,
      "rainStatus": "Light Rain",
      "deviceStatus": "online",
      "timestamp": "2026-05-22T12:15:00"
    }

---

## 🧠 AI Insight Example

    Current conditions show moderate humidity and low gas concentration.
    Rain intensity is increasing slightly, which may indicate light rainfall.
    Air quality is currently acceptable, but continued monitoring is recommended.

---

## 📈 Use Cases

SkyCast can be used for:

- Academic IoT projects
- Smart city environmental monitoring
- Localized weather stations
- Air quality observation
- Rain detection systems
- AI-based environmental warning systems
- College major project demonstrations
- Full-stack IoT portfolio project

---

## 🎯 Project Goals

The main goals of this project are:

- Build a complete IoT-to-cloud ecosystem
- Display live environmental data on web and mobile platforms
- Use Firebase as a realtime data hub
- Apply AI for predictive safety insights
- Store historical data for analysis
- Create a beautiful and modern dashboard UI
- Demonstrate full-stack development, IoT, cloud, mobile, and AI integration

---

## 🧑‍💻 Development Principles

This project follows these development principles:

- Modular folder structure
- Clean separation of concerns
- Secure credential handling
- Reusable React hooks
- Dumb UI components where possible
- Realtime-first architecture
- Mobile and web platform consistency
- Cloud-based data synchronization
- AI-assisted environmental analysis

---

## 🚧 Current Development Status

| Module | Status |
|---|---|
| ESP32 Firmware | In Progress |
| Firebase Realtime Database | In Progress |
| React Web Dashboard | In Progress |
| Android App | In Progress |
| Gemini AI Integration | Planned / In Progress |
| Google Sheets Export | Planned / In Progress |
| Open-Meteo Comparison | Planned / In Progress |

---

## 🔮 Future Enhancements

Possible future improvements include:

- User authentication
- Admin dashboard
- Push notifications
- Offline Android caching
- Advanced AQI calculation
- Multi-device support
- Location-based sensor mapping
- Additional sensors such as BMP280, LDR, or PM2.5
- Historical analytics dashboard
- Automated AI warning system
- Progressive Web App support

---

## 📸 Screenshots

Add screenshots of your project here:

- Web Dashboard Screenshot
- Android App Screenshot
- ESP32 Hardware Setup Screenshot
- Firebase Database Screenshot
- Google Sheets Logging Screenshot

Example image paths:

    ![Web Dashboard](assets/web-dashboard.png)
    ![Android App](assets/android-app.png)
    ![Hardware Setup](assets/hardware-setup.png)

---

## 📚 Learning Outcomes

Through this project, the following concepts are demonstrated:

- IoT hardware integration
- ESP32 firmware development
- Sensor data acquisition
- Firebase Realtime Database usage
- React.js frontend development
- Native Android development
- API integration
- AI-based prediction
- Data visualization
- Cloud hosting
- Full-stack monorepo project management

---

## 🧾 Repository Modules

### `/esp32-firmware`

Contains the ESP32 firmware code responsible for:

- Reading DHT11 data
- Reading MQ2 analog data
- Reading MH-RD rain sensor data
- Calculating environmental values
- Connecting to Wi-Fi
- Sending JSON data to Firebase

### `/skycast-dashboard(Web-Dashboard)`

Contains the React + Vite web dashboard responsible for:

- Displaying live sensor values
- Listening to Firebase changes
- Rendering charts
- Managing themes
- Triggering Gemini AI insights
- Exporting data to Google Sheets
- Comparing data with Open-Meteo

### `/SkyCast(Android-App)`

Contains the native Android application responsible for:

- Connecting to Firebase
- Displaying live environmental data
- Providing mobile access to SkyCast readings
- Showing device and sensor status

---

## 🧑‍🎓 Academic Relevance

SkyCast is suitable as a major academic project because it combines multiple important computer science and engineering domains:

- Internet of Things
- Cloud Computing
- Web Development
- Android Development
- Artificial Intelligence
- Data Analytics
- API Integration
- Realtime Systems
- Environmental Monitoring

---

## 👨‍💻 Author

**Lakshya Sharma**

GitHub: `LakshyaSharma2005`

Repository: `SkyCast-Ecosystem`

---

## 📜 License

This project is intended for academic and learning purposes.

You may add a license such as:

- MIT License
- Apache License 2.0

depending on your project requirements.

---

## ⭐ Support

If you like this project, consider giving the repository a star on GitHub.

---

## 🌐 Final Summary

**SkyCast Ecosystem** is a complete full-stack IoT environmental monitoring platform that connects ESP32-based hardware, Firebase cloud infrastructure, a React web dashboard, a native Android app, AI-powered prediction, spreadsheet logging, and weather API comparison into one unified ecosystem.

It demonstrates how modern IoT systems can combine embedded hardware, realtime cloud databases, beautiful user interfaces, mobile access, and artificial intelligence to create practical environmental intelligence solutions.

#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#include <time.h>
#include <SPIFFS.h>
#include <Firebase_ESP_Client.h>

// --- FIREBASE CONFIG ---
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL" 

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// --- SENSOR PINS ---
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define MQ2_PIN 34
#define LED_PIN 2

#define RAIN_AO_PIN 35
#define RAIN_DO_PIN 26

// --- WIFI CONFIG ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// --- TIME CONFIG ---
const long  gmtOffset_sec = 19800; // IST Offset
const int   daylightOffset_sec = 0;
const char* ntpServer1 = "pool.ntp.org";
const char* ntpServer2 = "time.google.com";

WebServer server(80);
int aqiThreshold = 150;   

// --- TIMERS ---
unsigned long lastSensorMillis = 0;
const unsigned long sensorInterval = 2000; // Firebase update interval
unsigned long lastLogMillis = 0;
const unsigned long logInterval = 60000; // Local CSV log interval

float lastTemp = NAN;
float lastHum  = NAN;
int   lastMq2  = 0;
int   lastAqi  = 0;
int   lastRainPct = 0;
bool  lastIsRaining = false;
const char* csvPath = "/data.csv";

// --- Helpers ---
String getCurrentDate() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "No-Sync";
  char buf[16];
  strftime(buf, sizeof(buf), "%Y-%m-%d", &timeinfo);
  return String(buf);
}
String getCurrentTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return String(millis());
  char buf[16];
  strftime(buf, sizeof(buf), "%H:%M:%S", &timeinfo);
  return String(buf);
}

// --- CSV Logic ---
void ensureCsvHeader() {
  if (SPIFFS.exists(csvPath)) return; 
  File f = SPIFFS.open(csvPath, FILE_WRITE);
  if (f) {
    f.println("Date,Time,Temperature,Humidity,AQI,RainPct,AQI_Alert,Rain_Alert");
    f.close();
    Serial.println("-> CSV Header created.");
  }
}

void saveReadingToCSV(float t, float h, int m, int r, bool aqiAlert, bool rainAlert) {
  File f = SPIFFS.open(csvPath, FILE_APPEND);
  if (!f) return;
  String line = getCurrentDate() + "," + getCurrentTime() + "," + 
                (isnan(t)?"0":String(t,1)) + "," + 
                (isnan(h)?"0":String(h,1)) + "," + 
                String(m) + "," + String(r) + "," + 
                (aqiAlert?"1":"0") + "," + (rainAlert?"1":"0");
  f.println(line);
  f.close();
}

// --- Local API Handlers (Kept for local CSV downloads) ---
void handleRoot(){ 
  server.send(200, "application/json", "{\"status\":\"SkyCast IoT Node Active\", \"dashboard\":\"Hosted on React\"}"); 
}
void handleMeta(){ server.send(200, "text/plain", WiFi.localIP().toString()); }
void handleSetThreshold(){ 
  if(server.hasArg("value")) aqiThreshold = server.arg("value").toInt(); 
  server.send(200, "text/plain", "OK"); 
}

void handleExport(){
  if(!SPIFFS.exists(csvPath)){ server.send(404, "text/plain", "No Data"); return; }
  File f=SPIFFS.open(csvPath, "r"); 
  server.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  server.sendHeader("Pragma", "no-cache");
  server.sendHeader("Expires", "-1");
  server.sendHeader("Content-Disposition", "attachment; filename=\"skycast_data.csv\"");
  server.streamFile(f, "text/csv"); 
  f.close();
}

void handleClear(){ SPIFFS.remove(csvPath); ensureCsvHeader(); server.send(200, "text/plain", "OK"); }

int calculateAQI(int mqValue) {
  int aqi = map(mqValue, 0, 4095, 0, 500);
  if(aqi < 0) aqi = 0;
  if(aqi > 500) aqi = 500;
  return aqi;
}

void setup(){
  Serial.begin(115200);
  delay(1000); 
  Serial.println("\n\n--- BOOTING SKYCAST ---");

  // --- SENSOR INITIALIZATION ---
  Serial.println("Initializing Sensors...");
  dht.begin();
  pinMode(MQ2_PIN, INPUT);
  pinMode(RAIN_DO_PIN, INPUT);
  pinMode(RAIN_AO_PIN, INPUT);   
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);
  Serial.println("Sensors OK");

  Serial.println("Step 1: Mounting Storage...");
  if(!SPIFFS.begin(true)){ 
    Serial.println("! SPIFFS Mount Failed. Formatting...");
  } else {
    Serial.println("-> Storage Mounted.");
    ensureCsvHeader();
  }

  Serial.println("Step 2: Connecting to WiFi...");
  WiFi.begin(ssid, password);
  int retry = 0;
  while(WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if(WiFi.status() == WL_CONNECTED) {
    Serial.print("\n-> WiFi Connected! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n! WiFi Failed. Restarting...");
    ESP.restart();
  }

  Serial.println("Step 3: Syncing Time for SSL...");
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer1, ntpServer2);
  
  // Force the ESP32 to wait until it actually gets the time from the internet
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.print(".");
    delay(250);
  }
  Serial.println("\nTime Synced!");

  // --- FIREBASE INIT ---
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.signer.test_mode = true; 

  // Allocate a slightly larger memory buffer for the heavy SSL handshake
  fbdo.setBSSLBufferSize(2048, 1024);

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase Initialized ✅");
}

void loop(){
  server.handleClient();

  // Auto-reconnect WiFi
  static unsigned long lastReconnectAttempt = 0;
  if (WiFi.status() != WL_CONNECTED && millis() - lastReconnectAttempt > 10000) {
    lastReconnectAttempt = millis();
    WiFi.reconnect();
  }
  
  // 1. Read sensors and push to Firebase
  if (millis() - lastSensorMillis >= sensorInterval) {
    lastSensorMillis = millis();

    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if(!isnan(h) && !isnan(t)) {
      lastHum = h;
      lastTemp = t;
    }

    int sum = 0;
    for(int i = 0; i < 5; i++){
      sum += analogRead(MQ2_PIN);
    }
    lastMq2 = sum / 5;
    lastAqi = calculateAQI(lastMq2);

    int rainRaw = analogRead(RAIN_AO_PIN);
    lastRainPct = map(rainRaw, 3500, 1000, 0, 100);
    lastRainPct = constrain(lastRainPct, 0, 100);
    
    static int rainCounter = 0;
    if(!digitalRead(RAIN_DO_PIN)) {  
      rainCounter++;
    } else {
      rainCounter = 0;
    }
    lastIsRaining = (rainCounter > 2);
    bool aqiAlert = (lastAqi > aqiThreshold);

    // Build JSON payload matching the React app expectations
    FirebaseJson json;
    json.set("temperature", isnan(lastTemp) ? 0 : lastTemp);
    json.set("humidity", isnan(lastHum) ? 0 : lastHum);
    json.set("aqi", lastAqi);
    json.set("rainPct", lastRainPct);
    json.set("isRaining", lastIsRaining);
    json.set("aqiAlert", aqiAlert);

    // Push to Firebase
    if (Firebase.ready()) {
      // 1. Update the Live Dashboard (Overwrites)
      if (Firebase.RTDB.setJSON(&fbdo, "/skycast/live", &json)) {
        Serial.print("Live Update ✅ | ");
      } else {
        Serial.print("Live Fail ❌ | ");
      }
      
      // 2. Append to the ML Training Dataset (Creates a new row)
      json.set("timestamp", getCurrentDate() + " " + getCurrentTime());
      
      if (Firebase.RTDB.pushJSON(&fbdo, "/skycast/history", &json)) {
        Serial.println("ML History Appended ✅");
      } else {
        Serial.println("History Push Failed ❌");
      }
    }

    if(aqiAlert || lastIsRaining)
      digitalWrite(LED_PIN, HIGH);
    else
      digitalWrite(LED_PIN, LOW);
  }

  // 2. Log to local CSV backup (Kept running in background just in case)
  if (millis() - lastLogMillis >= logInterval) {
    lastLogMillis = millis();
    bool aqiAlert = (lastAqi > aqiThreshold);
    saveReadingToCSV(lastTemp, lastHum, lastAqi, lastRainPct, aqiAlert, lastIsRaining);
  }
}
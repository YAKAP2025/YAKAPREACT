#include <WiFi.h>
#include <HTTPClient.h>

// --- Wi-Fi Configuration ---
const char* ssid = "HERNZULTIMATUM2G";
const char* password = "321HernzUltimate@557";
// Replace with your Node.js backend URL (use your PC's IP address if testing on a local network)
const char* serverUrl = "http://192.168.0.197:5001/api/submitData";

// --- Pin Definitions ---
#define AD8232_OUTPUT 35  // AD8232 sensor output to ESP32 ADC pin
#define LO_PLUS 33        // LO+ pin (lead-off detection)
#define LO_MINUS 32       // LO– pin (lead-off detection)

// --- Filtering and BPM Calculation ---
const int filterWindow = 20;  // Increased window size for better smoothing
int ecgBuffer[filterWindow];    // Array to store recent ECG values
int ecgIndex = 0;
long ecgSum = 0;

int bpmArray[10];              // Array to store the most recent 10 BPM values
int bpmIndex = 0;
long previousTime = 0;
bool pulseDetected = false;

void setup() {
  Serial.begin(115200);
  Serial.println("Starting ESP32...");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  unsigned long startAttemptTime = millis();
  const unsigned long wifiTimeout = 30000; // 30 seconds timeout

  // Wait for connection with a timeout
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < wifiTimeout) {
    delay(500);
    Serial.print(".");
  }
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nFailed to connect to Wi-Fi!");
  } else {
    Serial.println("\nConnected to Wi-Fi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  }

  // Setup sensor pins
  pinMode(AD8232_OUTPUT, INPUT);
  pinMode(LO_PLUS, INPUT);
  pinMode(LO_MINUS, INPUT);

  // Initialize buffers
  for (int i = 0; i < filterWindow; i++) {
    ecgBuffer[i] = 0;
  }
  for (int i = 0; i < 10; i++) {
    bpmArray[i] = -1;
  }

  Serial.println("Waiting for heartbeat...");
}

void loop() {
  // Read raw ECG value and normalize around 0
  int ecgValue = analogRead(AD8232_OUTPUT);
  int normalizedEcg = ecgValue - 512;

  // Apply moving average filter
  ecgSum -= ecgBuffer[ecgIndex];
  ecgBuffer[ecgIndex] = normalizedEcg;
  ecgSum += normalizedEcg;
  ecgIndex = (ecgIndex + 1) % filterWindow;
  int smoothedEcg = ecgSum / filterWindow;

  // Adaptive baseline and threshold calculation
  static int baseline = 0;
  baseline = (baseline * 9 + smoothedEcg) / 10;
  int peakThreshold = baseline + 30;

  // Debug log for raw and smoothed ECG data
  Serial.print("Raw ECG: ");
  Serial.print(ecgValue);
  Serial.print(" | Smoothed ECG: ");
  Serial.println(smoothedEcg);

  // Check for lead-off detection
  if (digitalRead(LO_PLUS) == 1 || digitalRead(LO_MINUS) == 1) {
    resetBPMArray();
    Serial.println("Lead-off detected");
    delay(500);
    return;
  }

  // Heartbeat detection and BPM calculation
  long currentTime = millis();
  if (smoothedEcg > peakThreshold && !pulseDetected) {
    pulseDetected = true;
    long timeBetweenBeats = currentTime - previousTime;
    previousTime = currentTime;

    // Consider valid heartbeats between 600 and 1200 ms (approx. 60–100 BPM)
    if (timeBetweenBeats > 600 && timeBetweenBeats < 1200) {
      int bpm = 60000 / timeBetweenBeats;
      addBpmToArray(bpm);
      int averageBPM = getAverageBPM();
      if (averageBPM >= 60 && averageBPM <= 100) {
        Serial.print("BPM: ");
        Serial.println(averageBPM);
        Serial.print("ECG: ");
        Serial.print(smoothedEcg);
        Serial.print(" | Time Between Beats: ");
        Serial.println(timeBetweenBeats);

        // Send the data if Wi-Fi is connected
        if (WiFi.status() == WL_CONNECTED) {
          HTTPClient http;
          http.begin(serverUrl);
          http.addHeader("Content-Type", "application/json");

          String payload = "{\"deviceId\": \"YAKAP-ECG\", \"bpm\": " + String(averageBPM) + "}";
          int httpResponseCode = http.POST(payload);
          if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.print("Server Response: ");
            Serial.println(response);
          } else {
            Serial.print("Error sending data, HTTP code: ");
            Serial.println(httpResponseCode);
          }
          http.end();
        }
      }
    }
  }

  if (smoothedEcg < peakThreshold) {
    pulseDetected = false;
  }

  delay(10);
}

void addBpmToArray(int bpm) {
  bpmArray[bpmIndex] = bpm;
  bpmIndex = (bpmIndex + 1) % 10;
}

int getAverageBPM() {
  int sum = 0, count = 0;
  for (int i = 0; i < 10; i++) {
    if (bpmArray[i] != -1) {
      sum += bpmArray[i];
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

void resetBPMArray() {
  for (int i = 0; i < 10; i++) {
    bpmArray[i] = -1;
  }
  bpmIndex = 0;
}
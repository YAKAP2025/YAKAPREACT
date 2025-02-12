# YAKAPREACT

**YAKAP: A Scalable Cross‑Platform Healthcare Platform**  
Integration of the SpringBud FD 400B Fetal Heart Doppler with the ESP32-S3 (N16R8 Version) & Node.js Backend (with Firebase Integration)

---

## Project Team & Agency Information

**Group Number:** BIOE 24-003

**Project Leader:**  
- **Name:** Elaiza L. Abarentos  
- **Email:** [21-07489@g.batstate-u.edu.ph](mailto:21-07489@g.batstate-u.edu.ph)  
- **Contact Number:** 

**Project Staff:**  
- **Name:** Cate Destiny C. Espeleta  
  - **Email:** [21-04215@g.batstate-u.edu.ph](mailto:21-04215@g.batstate-u.edu.ph)  
  - **Contact Number:** 

- **Name:** Sarah M. Palaypayon  
  - **Email:** [21-02727@g.batstate-u.edu.ph](mailto:21-02727@g.batstate-u.edu.ph)  
  - **Contact Number:**

**Project Adviser:**  
- **Name:** Mirasol C. Dilay  
- **Email:** [dilay.mirasol@g.batstate-u.edu.ph](mailto:dilay.mirasol@g.batstate-u.edu.ph)  
- **Contact Number:**

**Proponent Agency:**  
- **Department:** Department of Electronics Engineering  
- **College:** College of Engineering  
- **Campus:** Alangilan

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

YAKAP is a comprehensive ERP-style medical management system designed to improve remote antenatal care. This project integrates:

- **Hardware:** A modified SpringBud FD 400B fetal heart Doppler and an ESP32-S3 microcontroller for real-time fetal heart rate monitoring.
- **Backend:** A Node.js API that integrates with Firebase for real‑time data storage and synchronization.
- **Frontend:** A modern ReactJS admin template featuring an ERP-style dashboard, patient profile records, and interactive monitoring charts, along with a cross‑platform mobile app built using React Native.

This system provides healthcare professionals with real-time patient monitoring and management tools, ultimately improving maternal and infant health outcomes in underserved communities.

---

## Features

- **ERP-Style Dashboard:** Modern UI with a sidebar and top bar for seamless navigation.
- **Patient Profiles:** Manage and view detailed patient records including historical data.
- **Monitoring Charts:** Interactive charts display real-time trends in fetal heart rate.
- **Real-Time Data:** Firebase integration ensures that data is updated instantly across the platform.
- **Cross-Platform Compatibility:** Designed for web browsers, iOS, and Android devices (via React Native).

---

## Architecture

The system is built on a multi-layered architecture:

1. **Hardware/Device Layer:**
   - **Sensor:** Modified SpringBud FD 400B fetal heart Doppler (tapped for analog output).
   - **Microcontroller:** ESP32-S3 (N16R8) reads the analog signal, processes it (peak detection and BPM calculation), and transmits data over WiFi.

2. **Backend/Cloud Layer:**
   - **API Server:** Node.js server using Express receives sensor data.
   - **Data Storage:** Firebase (Cloud Firestore or Realtime Database) for real-time data synchronization.

3. **Frontend/Application Layer:**
   - **Web Dashboard:** Developed with ReactJS featuring an ERP-style UI.
   - **Mobile App:** Developed with React Native for cross‑platform access.


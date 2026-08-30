# 🌿 MOMENTUM

> **A serene, dark workspace with GitHub-style contribution tracking, real-time focus timers, and atmospheric intelligence.**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://momentum-webapp.vercel.app)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![IndexedDB Engine](https://img.shields.io/badge/Storage-IndexedDB_Database-39D353?style=for-the-badge&logo=sqlite&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

---

🌐 **Live Application**: **[https://momentum-webapp.vercel.app](https://momentum-webapp.vercel.app)**  
📦 **GitHub Repository**: **[https://github.com/Arceaus/Momentum-Web-App](https://github.com/Arceaus/Momentum-Web-App)**

---

## ✨ Features at a Glance

### 🟩 1. Momentum Activity Tracker (Hybrid Effort Heatmap)
- **52-Week Contribution Grid**: Visualizes your daily work intensity over the last 365 days.
- **Fair Hybrid Effort Scoring**: Evaluates productivity using both **Task Count (10 pts base)** and **Focus Minutes (+1 pt/min)**. A 120-minute deep focus session earns a **Peak Neon Green Dot (`Level 4`)**, fairly rewarding deep work alongside high task output.
- **Day Inspector Modal**: Click any square on the graph to inspect exact tasks done, focus minutes, and total effort score points earned.

### 🌿 2. Daily Atmosphere (Time-of-Day Personality Engine)
- **Automatic Ambient Background Glow**: Dynamically shifts radial backdrop glow gradients based on your local hour.
- **4 Time-of-Day Atmospheres**:
  - ☀️ **Morning Clarity (5 AM - 11:59 AM)**: Warm golden sunbeam glow (`Good morning, {name}. A fresh start awaits.`)
  - ◐ **Afternoon Flow (12 PM - 4:59 PM)**: Crisp electric azure glow (`Good afternoon, {name}. Keep your momentum going.`)
  - 🌆 **Evening Unwind (5 PM - 8:59 PM)**: Sunset violet twilight glow (`Good evening, {name}. Reflect on today's progress.`)
  - ☾ **Night Sanctuary (9 PM - 4:59 AM)**: Deep nocturnal indigo & star mint glow (`Late hours, {name}. Quiet focus in the dark.`)

### ⏰ 3. Real-Time Focus Clock & Early Completion Guard
- **Flexible Duration Selector**: Choose standard duration quick pills (`15m`, `25m Pomodoro`, `45m`, `60m`, `90m`, `120m`) or enter custom flexible minutes/hours.
- **Real-Time Ticking Focus Clock**: Click **Focus** (`Play` icon) on any task to launch a live ticking `MM:SS` countdown timer with `Play`, `Pause`, `Reset`, and `Complete` controls.
- **Early Completion Guard Confirmation Modal**: Clicking a task's checkbox (`✓`) while target time is remaining intercepts early completion and prompts:
  > *"You still have 14 minutes remaining on your focus target! Are you sure your task is fully finished?"*

### 🗄️ 4. High-Performance IndexedDB Browser Database
- **Gigabyte-Scale Storage Capacity**: Upgrades browser storage from standard 5 MB LocalStorage to a native **IndexedDB Browser Database** (`MomentumDB`), expanding storage limit up to 50% of free disk space (virtually unlimited).
- **Live Storage Monitor Gauge**: View live database health and storage metrics in **Settings** (e.g., `142 KB used of 50.0 GB quota available`).

### 🔊 5. Built-in Sound Presets & Custom System Audio Upload
- **5 Built-in Web Audio Presets**:
  - 🔔 **Zen Chime**: Serene dual-frequency chime.
  - 🔮 **Crystal Bell**: High resonant crystal bell.
  - 🫧 **Bubble Pop**: Playful crisp pop.
  - 🎉 **Level Up Triad**: Vibrant achievement chord.
  - 🪵 **Wooden Marimba**: Deep organic wood block chime.
- **Custom Audio File Upload**: Upload any `.mp3`, `.wav`, or `.ogg` sound file from your computer.

### 📜 6. Expandable History Log & Synchronized Deletion
- **Expandable Date Cards**: View past daily accomplishments in a clean accordion layout:
  ```text
  AUGUST 30
  ✦ 3 tasks completed   ⏱ 1h 24m focused
  ───────────────────────────────────────
  ✓ Finish FastAPI authentication • Focus · 42 min
  ✓ Study MLOps                  • Work  · 30 min
  ✓ Work on Momentum             • Focus · 12 min
  ```
- **3-Way Synchronized History Deletion**: Deleting a date history entry removes the record, resets that date's heatmap square, and deducts the earned XP (`-20 XP` per task).

### 🎲 7. Randomized All-Tasks Completion Banner
- When all created tasks for today are completed, Momentum displays a warm, randomized glass completion banner:
  > *"Everything completed 🎉 — You're done for today. Nice work. Go enjoy the rest of your day."*

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 8, JavaScript (ESNext)
- **Styling**: Vanilla CSS3, Glassmorphism (`backdrop-filter`), Responsive Flexbox/Grid
- **Icons**: Lucide React
- **Database**: Native Browser IndexedDB API + LocalStorage Fallback
- **Audio Engine**: Web Audio API Synthesizers + HTML5 Audio Player
- **Animations**: Canvas Confetti, Keyframe Transitions
- **Deployment**: Vercel Cloud Edge

---

## ⚙️ Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Arceaus/Momentum-Web-App.git
cd Momentum-Web-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🚀 Deployment to Vercel

### Option 1: Vercel CLI (1-Click)
```bash
npx vercel --prod
```

### Option 2: GitHub Integration
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```
2. Import repository on **[vercel.com/new](https://vercel.com/new)** and click **Deploy**.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p center="true">
  Made with quiet focus & momentum. 🌿
</p>

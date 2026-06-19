<div align="center">

# 🚀 Sukumar Gope — Interactive 3D Developer Portfolio

**A premium, immersive portfolio experience built with Three.js, GSAP & Vanilla JS**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-00f0ff?style=for-the-badge&logoColor=white)](https://sg-portfolio-dev.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Source_Code-ff2a75?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Sg-2003/PORTFOLIO)
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=black)

</div>

---

## ✨ Overview

A fully handcrafted, single-page developer portfolio for **Sukumar Gope** — a Final Year B.Tech IT Student and Creative Developer from Jamshedpur. Built with zero frameworks on the front end, it features a real-time **3D WebGL scene**, an **interactive AI chat agent**, a **typewriter hero animation**, and buttery-smooth GSAP-driven micro-animations throughout.

---

## 🎯 Live Features

### 🐾 Interactive AI Shiba Agent (Craftz Dog)
- A fully interactive **AI chatbot assistant** overlaid on the 3D Shiba Inu hero model
- Floating glassmorphism chat panel with local NLP keyword matching
- Answers questions about **skills, experience, projects, education & contact info**
- Navigates page sections automatically on user intent (scrolls + opens tabs)
- Triggers programmatic **CV download** directly from chat
- Responds to 3D animation commands:
  | Command | Action |
  |---------|--------|
  | `/spin` | 360° smooth horizontal spin |
  | `/jump` | Bouncy hop animation |
  | `/dance` | Spinning hop combo |
  | `/shake` | Excited side-to-side waggle |
  | `/color` | Randomizes ambient scene lighting |

### 🔠 Typewriter Hero Title
- Tag-safe character-by-character typewriter cycling through:
  - **Sukumar Gope** → **a Web Developer** → **a Creative Coder** → **an IT Student**
- Each keyword glows in theme accent colors (cyan / magenta)
- Smooth blinking cursor with CSS animation

### 🌌 WebGL Galaxy Background
- Three.js particle starfield with **1,200+ stars**, custom shaders, and fog depth
- Mouse parallax: starfield shifts subtly as you move the cursor
- GSAP ScrollTrigger: camera drifts forward as you scroll through sections
- **Graceful 2D Canvas fallback** for devices without WebGL support

### 💬 Google Sheets Contact Form
- Submissions land directly in a Google Sheets database via Apps Script
- Fully async `fetch` call with instant UI feedback and starfield contraction animation
- CORS-secured deployment endpoint

### 🎨 UI / UX Highlights
- **Glassmorphism panels** across About, Services, Portfolio & Contact
- **Custom liquid cursor** — dot-and-ring system with spring `lerp` interpolation
- **3D card tilt** on hover (Services & Portfolio cards) via GSAP
- Scroll-triggered **fade + slide-up** reveal animations for every section
- Cyber accent highlights (cyan `#00f0ff` / magenta `#ff2a75`) for key phrases
- Responsive layout optimised for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core** | HTML5, Vanilla CSS3, ES6+ JavaScript |
| **3D & Animation** | Three.js, GSAP, ScrollTrigger |
| **Typography** | Google Fonts — Outfit, Space Grotesk |
| **Icons** | FontAwesome 6 |
| **Backend** | Google Apps Script + Google Sheets |
| **Hosting** | Vercel |

---

## 📁 Project Structure

```
PORTFOLIO/
├── img/
│   ├── SUKUMAR.jpg          # Profile photo
│   ├── cv.pdf               # CV / Resume PDF
│   ├── favicon.svg          # Browser tab icon
│   ├── shiba.glb            # 3D Shiba Inu model (GLB)
│   └── shiba-fallback.png   # Static fallback illustration
├── index.html               # Main page markup
├── script.js                # Three.js scenes, GSAP animations, chat agent
├── style.css                # Full design system & component styles
└── README.md                # Documentation
```

---

## 🚀 Running Locally

The project uses ES6 modules and loads local `.glb` 3D assets, so it **must** be served via a local HTTP server (not opened directly as a file).

**Option 1 — Python (recommended, no install needed):**
```bash
python -m http.server 8000
```

**Option 2 — Node.js:**
```bash
npx http-server -p 8000
```

Then open → **[http://localhost:8000](http://localhost:8000)**

---

## 🔗 Deploying to Vercel

This is a static site — no build step required.

1. Push your code to GitHub (this repo)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import the GitHub repo
3. Framework preset: **Other** (no framework)
4. Leave build command blank, output directory as `./`
5. Click **Deploy** ✅

---

## ⚙️ Google Sheets Contact Form Setup

To connect the form to your own spreadsheet:

1. Open your Google Sheet → **Extensions** → **Apps Script**
2. Paste the `doPost(e)` handler script
3. **Deploy** → **New deployment** → **Web app**
   - Execute as: `Me`
   - Who has access: `Anyone`
4. Copy the deployed Web App URL (`/exec`)
5. In `script.js`, paste it into the `scriptURL` constant (around line 779)

---

## 👤 About the Developer

**Sukumar Gope**
- 🎓 Final Year B.Tech IT Student — *University College of Engineering & Technology, Hazaribagh*
- 💼 Ex-Intern @ Emertxe Pvt. Ltd. (Full Stack) & Bluestock Fintech (SDE)
- 🌐 [GitHub](https://github.com/Sg-2003) · [LinkedIn](https://www.linkedin.com/in/sukumar-gope-9b20a81b4/) · [LeetCode](https://leetcode.com/u/SUKUMAR_GOPE/)
- 📧 sgsukumar321@gmail.com

---

<div align="center">

Made with ❤️ and a lot of ☕ by **Sukumar Gope**

⭐ Star this repo if you found it helpful!

</div>

<p align="center">
  <img src="public/logo-dark.png" alt="Flynk Logo" width="220" />
</p>

<h1 align="center">Flynk - Internet Speed Test</h1>

<p align="center">
  <strong>A premium, modern, open-source internet speed test application built with Next.js, Framer Motion, and Tailwind CSS.</strong>
</p>

<p align="center">
  <a href="https://github.com/sam-eer31/internet_speed_test/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/sam-eer31/internet_speed_test?style=flat-square&color=blue" alt="License" />
  </a>
  <a href="https://github.com/sam-eer31/internet_speed_test/stargazers">
    <img src="https://img.shields.io/github/stars/sam-eer31/internet_speed_test?style=flat-square&color=blue" alt="Stars" />
  </a>
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/deployed_on-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/sam-eer31/internet_speed_test" target="_blank" rel="noopener noreferrer">
    <img src="public/btn-run-test.svg" alt="Run Speed Test" width="220" />
  </a>
</p>

---

Flynk is a beautifully designed, highly interactive, and privacy-first internet speed test client. Leveraging edge testing nodes and modern web technologies, Flynk provides accurate real-time metrics with a state-of-the-art interface that feels responsive, interactive, and premium.

### 🌐 Live Demo
Run your speed test instantly: **[flynk-speedtest.vercel.app](https://github.com/sam-eer31/internet_speed_test)** *(You can customize this to link directly to your deployed production URL)*

---

## 📸 Screenshots

<p align="center">
  <img src="public/screenshot-dark.png" alt="Flynk Speed Test Interface" width="100%" />
</p>

---

## ✨ Key Features

| Feature | Capabilities & Description | Technology / Method |
| :--- | :--- | :--- |
| **⚡ High-Precision Metrics** | Real-time measurement of download throughput, upload throughput, ping, and jitter. | Leverages Tier-1 high-performance Cloudflare edge nodes and Google GGC endpoints for maximum precision. |
| **🎨 Glassmorphic Dashboard** | Responsive dark/light theme options, customized indigo/cyan brand gradients, and micro-interactions. | Fluid animations powered by `framer-motion` and a customized SVG real-time Speed Gauge. |
| **📊 Live Performance Charts** | Dynamic, real-time tracking graphs charting throughput changes throughout the diagnostics phase. | Powered by `recharts` for responsive, animated, and lightweight canvas rendering. |
| **🎮 Intelligent Use-Case Grading** | Real-world rating of network quality for specific tasks:<br>• **Online Gaming:** Latency & jitter sensitivity analysis<br>• **Video Calling:** Buffer-free Zoom/Teams assessment<br>• **Browsing Quality:** Social media & script load responsiveness<br>• **4K UHD Streaming:** High-bandwidth connection rating | Dynamic scoring engine translating raw metrics into descriptive performance grades. |
| **🔒 Privacy-First Device Info** | Extracts and displays verified OS, browser engine, and ISP details. | Zero trackers or intrusive client-side hardware scraping; utilizes verified `ua-parser-js` matching. |
| **📸 Custom PNG Export** | Instantly generates a clean, shareable scorecard card containing final test metrics. | Client-side export using `html-to-image` for high-quality PNG rendering and immediate downloads. |
| **🎛️ Multi-Unit Options** | Single-tap controls to toggle metrics between **Bits (Mbps)** and **Bytes (MB/s)**. | Contextual conversion logic built directly into the gauge and metric cards. |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://motion.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Analytics:** [UA-Parser-JS](https://github.com/faisalman/ua-parser-js)

---

## 🚀 Getting Started

To run Flynk locally on your machine, follow these simple setup steps.

### Prerequisites

Ensure you have **Node.js** (v18.x or later) and **npm** installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sam-eer31/internet_speed_test.git
   cd internet_speed_test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see Flynk running locally.

### Production Build

To build the project for production deployment:
```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with 💙 by Flynk Contributors
</p>

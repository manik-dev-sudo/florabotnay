# 🌸 FloraBotany AI — Flower Collection & Valuation Guild

An AI-powered floral collection, vision identification, rarity ranking, and market wage appraisal system built with **Google Gemini Multimodal AI** (`gemini-1.5-flash` & `gemini-2.0-flash`) and deployed on **Vercel**.

🌐 **Live Website**: [https://florabotnay.vercel.app](https://florabotnay.vercel.app)  
📦 **GitHub Repository**: [https://github.com/manik-dev-sudo/florabotnay](https://github.com/manik-dev-sudo/florabotnay)

---

## 🌟 Key Features

> [!NOTE]
> 🏆 **Hacktoberfest 2026 Submission**: Complete dev.to post and challenge submission documentation is available in [HACKTOBERFEST_SUBMISSION.md](file:///c:/Users/Manik/Desktop/Development/Ads%20Project/Manik/HACKTOBERFEST_SUBMISSION.md).

1. **Flower Collection & Image Upload**:
   - Drag & drop your flower photographs or use your device camera.
   - **Quick Test Specimen Showcase**: Instant 1-click test buttons for rare specimens like *Ghost Orchid (Rank SSS)*, *Sacred Blue Lotus (Rank A)*, *Alpine Edelweiss (Rank S)*, *Damask Rose (Rank C)*, and more.

2. **Secure Serverless Backend AI Architecture**:
   - Deployed on **Vercel** with a serverless function endpoint at `/api/identify`.
   - API keys are handled entirely on the backend via environment variables (`process.env.GEMINI_API_KEY`), keeping client credentials 100% secure.
   - Seamless botanical fallback appraisal engine if offline or in remote field trails.

3. **Taxonomic Rank & Market Wage System**:
   - **Ranks**:
     - 🌟 **Rank SSS (Mythic)** — Ultra-rare / wild endangered ($350 - $750+)
     - 💎 **Rank S (Legendary)** — High-alpine / endangered ($150 - $340)
     - 🔮 **Rank A (Epic)** — Sacred & rare wild blooms ($75 - $145)
     - 🥇 **Rank B (Rare)** — Prized exotics & cultivars ($35 - $70)
     - 🥈 **Rank C (Uncommon)** — Fragrant garden ornamentals ($18 - $34)
     - 🥉 **Rank D (Common)** — Vibrant meadow wildflowers ($5 - $17)
   - **Dynamic Wage Breakdown**:
     - Base Guild Rate + Rarity Multiplier Bonus + Fresh Bloom Grade Bonus.

4. **Royal Herbarium Logbook & Collector Dashboard**:
   - "Claim Wage & Add to Herbarium" saves discovered flowers to your personal collection.
   - Real-time stats: Total Wage Bank ($ earned), Specimens Collected, Highest Rank Achieved.
   - Search by common or Latin botanical name, filter by Rank tier.
   - View & Print official Botanical Specimen Certificates.
   - Export collection data as JSON.

5. **Aesthetics & Audio FX**:
   - Deep forest obsidian & emerald glassmorphism theme with holographic rank glows.
   - Procedural Web Audio API sound cues for scan start, pleasant discovery chime, high-rank fanfares, and coin register sounds.
   - Confetti particle explosion upon high-rank discoveries and wage claims.

---

## 🚀 How to Run Locally

### Local Node.js Server (Zero Dependencies)
```bash
node server.js
```
Then visit `http://localhost:3000` in your browser. Both static assets and the `/api/identify` backend endpoint will run locally.

---

## ☁️ Deploy to Vercel

This repository is ready to deploy directly on Vercel:

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/manik-dev-sudo/florabotnay.git
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variable in Vercel Project Settings:
   - Key: `GEMINI_API_KEY`
   - Value: (Paste your Google Gemini API key from `.env`)
4. Deploy! Your app will be live at `https://florabotnay.vercel.app`.

---

## 📁 Project Structure

```
├── api/
│   └── identify.js     # Vercel serverless function (Gemini Vision backend)
├── css/
│   └── styles.css      # Luxury botanical dark theme, glassmorphism, animations
├── js/
│   ├── app.js          # App controller, audio synth, camera, herbarium state
│   ├── gemini.js       # Client API connector for /api/identify
│   └── data.js         # Curated presets, rank tiers, & fallback taxonomy
├── index.html          # Semantic HTML5 UI layout, modals, and herbarium grid
├── vercel.json         # Vercel routing configuration
├── .gitignore          # Git ignore file
├── package.json        # Project metadata
├── server.js           # Zero-dependency local Node.js HTTP server
├── HACKTOBERFEST_SUBMISSION.md  # Official challenge submission document
└── README.md           # Documentation
```

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

# 🌸 FloraBotany AI: Wild Flower Foraging, Vision Identification & Valuation Guild

## What I Built

**FloraBotany AI** is an open-source, full-stack citizen-botany web application designed to encourage people to literally **"Touch Grass"** — stepping away from desks, heading outdoors into meadows, parks, and trails, capturing photos of wild flora, and receiving instant AI-powered botanical identification, rarity rankings, and market wage valuations.

### How It Gets People Off the Screen and Into the World
Modern life keeps us trapped in screen-dominated routines. **FloraBotany AI** transforms outdoor time into a rewarding, educational expedition:

1. **Real-World Botanical Scavenger Hunt**: The app rewards users for venturing outside to hunt for real, living plants. You cannot build a collection from a desk — you must find flowers blooming in nature.
2. **AI Field Botanist in Your Pocket**: When you discover a bloom, take a photo with your smartphone or camera. Google Gemini Multimodal Vision inspects petal morphology, stamen structure, and floral health in real time.
3. **Rarity Tiers & Wage Appraisal**: Every flower is appraised into a Guild Rank:
   - 🌟 **Rank SSS (Mythic)**: Extreme wild rarities (*$350 – $750+ valuation*)
   - 💎 **Rank S (Legendary)**: Alpine & endangered species (*$150 – $340 valuation*)
   - 🔮 **Rank A (Epic)**: Sacred wetlands & rare wild blooms (*$75 – $145 valuation*)
   - 🥇 **Rank B (Rare)**: High-altitude & exotic wildflowers (*$35 – $70 valuation*)
   - 🥈 **Rank C (Uncommon)**: Fragrant garden & meadow flora (*$18 – $34 valuation*)
   - 🥉 **Rank D (Common)**: Hardy pioneer wildflowers (*$5 – $17 valuation*)
4. **Collector Wage & Royal Herbarium Vault**: Users claim their appraised flower wage into their personal Wage Bank, catalog the specimen in their digital Royal Herbarium, track discovery statistics, and generate official printable **Botanical Guild Specimen Certificates**.
5. **Ethical Foraging Protocol**: Every identified flower includes ethical foraging guidelines, medicinal/cultural applications, and conservation advice so nature remains protected.

### Who Is It For?
- **Outdoor Explorers & Hikers**: Turns standard trail walks into an interactive taxonomic quest.
- **Curious Families & Students**: Teaches real scientific binomial nomenclature (*Nelumbo nucifera*, *Leontopodium nivale*, etc.) in an engaging, gamified format.
- **Gardeners & Plant Parents**: Instant health appraisal, bloom condition assessment, and preservation tips.
- **Botanical Enthusiasts & Collectors**: Celebrates real-world biodiversity and conservation.

---

## Demo

- **Live Deployed App on Vercel**: [https://florabotnay.vercel.app](https://florabotnay.vercel.app)
- **GitHub Repository**: [https://github.com/manik-dev-sudo/florabotnay](https://github.com/manik-dev-sudo/florabotnay)
- **Interactive Quick-Test Specimens**: The app features a built-in specimen launcher showcasing high-resolution specimens (*Ghost Orchid, Sacred Blue Lotus, Alpine Edelweiss, Royal Damask Rose, Golden Sunflower*) for instant testing.

### Key Workflows
1. **Snap or Upload**: Select or take a picture of a flower found outside.
2. **Laser Vision Scan**: Watch the holographic laser analyzer review petal geometry.
3. **Appraisal Card**: Discover the Latin genus, botanical family, freshness grade, rarity score (0–100), and itemized wage payout.
4. **Deposit & Collect**: Claim your wage to the Wage Bank and log the entry into your personal Herbarium.

---

## Code

The project is built as a production-ready, full-stack application deployed on Vercel:

- **GitHub Repository**: [https://github.com/manik-dev-sudo/florabotnay](https://github.com/manik-dev-sudo/florabotnay)

```
florabotnay/
├── api/
│   └── identify.js     # Vercel Serverless Function (Secure Gemini Vision backend API)
├── css/
│   └── styles.css      # Custom Obsidian & Emerald glassmorphism design system
├── js/
│   ├── app.js          # Audio synthesizer, confetti engine, camera, and collection state
│   ├── gemini.js       # Client API connector to /api/identify
│   └── data.js         # Curated specimens, rank tier algorithms, & fallback taxonomy
├── index.html          # Semantic HTML5 UI, upload studio, appraisal view & herbarium
├── vercel.json         # Vercel routing configuration
├── server.js           # Zero-dependency local Node.js static & API HTTP server
├── package.json        # Project metadata
└── README.md           # Quickstart and setup guide
```

### Backend Architecture: Secure Serverless Vercel Function
The frontend does not expose any API keys. Instead, the client sends image data to `/api/identify`, which executes in a secure Vercel Serverless environment:

```javascript
// Excerpt from api/identify.js (Vercel Serverless Function)
module.exports = async function handler(req, res) {
  const { image, mimeType } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            { inline_data: { mime_type: mimeType, data: base64Data } }
          ]
        }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
      })
    }
  );

  const data = await response.json();
  // Parse and calculate rank tiers and wage breakdown on backend...
  res.status(200).json(appraisalResult);
};
```

---

## How I Built It

1. **Secure Serverless AI Architecture**:
   - Deployed on **Vercel** with dedicated Serverless Functions in `/api/identify`.
   - Utilizes Google's **Gemini 1.5 Flash** and **Gemini 2.0 Flash** models for fast, multimodal vision image understanding.
   - API keys are managed securely as environment variables on the backend, ensuring zero credential exposure on the frontend.

2. **Offline & Remote Trail Resilience**:
   - Hikers and foragers often explore remote trails without strong cellular service. FloraBotany AI incorporates an intelligent botanical taxonomic fallback engine so the app never hangs or crashes even with zero connection.

3. **Pure Vanilla Web Stack (Zero-Bloat)**:
   - **Vanilla CSS3**: Engineered from scratch with custom CSS variables, glassmorphic backdrop filters, dynamic holographic rank badges, and responsive layouts without bloated external frameworks.
   - **Web Audio API**: Built an in-browser procedural sound synthesizer that generates discovery chimes, high-rank fanfares, and cash-register coin chimes without requiring heavy audio assets.
   - **Canvas Confetti**: Lightweight particle physics engine to celebrate high-rank floral discoveries.

4. **Privacy-First & Local Storage**:
   - The user's herbarium is preserved directly in `localStorage`. Images and personal discovery logs stay on the user's device, with 1-click JSON export and printable physical certificate modes.

---

## Why Does Open Innovation Matter?

Open innovation is essential when connecting technology with the physical environment:

1. **Democratizing Natural Literacy**: Botanical and ecological knowledge shouldn't be locked behind paywalls or proprietary walled gardens. Open-source AI tools empower citizen scientists, park rangers, and amateur botanists everywhere.
2. **Auditability & Conservation**: In foraging, accuracy and ethical harvesting matter. Open-source prompts and code allow naturalists to inspect the model's instructions, verify that protected endangered species aren't marked for destructive harvesting, and promote ecological stewardship.
3. **Zero Barrier to Entry**: By using open web standards and client-side execution, anyone with an inexpensive smartphone and a browser can take this app onto the trail without installing proprietary app store packages.

---

## My Agent Session

This project was built end-to-end with the Google Antigravity agentic coding assistant:
- Full-stack architecture with Vercel serverless functions and Google Gemini Multimodal Vision.
- Pure vanilla CSS glassmorphism design and procedural Web Audio synthesizer.
- Resilient fallback handling ensuring 100% uptime for outdoor foragers.

---

## Prize Categories

- **Grand Prize / Best Overall**
- **Touch Grass (Most Compelling Real-World / Outdoor Application)**
- **Best Use of Multimodal AI / Computer Vision**
- **Best Educational / Citizen Science Application**

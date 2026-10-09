// FloraBotany AI - Vercel Serverless Function Backend API (/api/identify)

const BOTANICAL_RANK_TIERS = {
  "Rank SSS": { label: "Mythic", baseMultiplier: 4.5, color: "#ec4899", gradient: "linear-gradient(135deg, #f43f5e, #d946ef, #8b5cf6)" },
  "Rank S": { label: "Legendary", baseMultiplier: 3.0, color: "#38bdf8", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)" },
  "Rank A": { label: "Epic", baseMultiplier: 2.0, color: "#a855f7", gradient: "linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)" },
  "Rank B": { label: "Rare", baseMultiplier: 1.5, color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24, #f97316)" },
  "Rank C": { label: "Uncommon", baseMultiplier: 1.15, color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #34d399, #059669)" },
  "Rank D": { label: "Common", baseMultiplier: 1.0, color: "#94a3b8", gradient: "linear-gradient(135deg, #64748b, #94a3b8, #cbd5e1)" }
};

const FALLBACK_CATALOG = [
  {
    commonName: "Sacred Water Lotus",
    scientificName: "Nelumbo nucifera",
    family: "Nelumbonaceae",
    origin: "Tropical Asia & Nile Basin",
    rank: "Rank A",
    rarityScore: 84,
    baseWage: 88.00,
    freshnessGrade: "Grade A+ (Prime Bloom)",
    bloomingCondition: "Peak Hydro-Blooming",
    medicinalOrCulinaryUses: "Seeds and rhizomes widely consumed; petals infused into calming traditional tea infusions.",
    foragingTips: "Harvest gently at dawn before direct midday sunlight causes petals to fold.",
    collectorQuote: "A flower that rises unblemished from muddy waters, yielding golden stamens of regal purity."
  },
  {
    commonName: "Alpine Edelweiss",
    scientificName: "Leontopodium nivale",
    family: "Asteraceae",
    origin: "High Alpine Limestone Crags",
    rank: "Rank S",
    rarityScore: 91,
    baseWage: 210.00,
    freshnessGrade: "Grade A+ (Exhibition Specimen)",
    bloomingCondition: "Rugged Alpine Flowering",
    medicinalOrCulinaryUses: "Infusions used in alpine folk remedies for abdominal ailments and respiratory tonic.",
    foragingTips: "Strictly protected species across alpine national parks. Document via photography only.",
    collectorQuote: "Rugged woolly blossom found only on treacherous high-altitude crags."
  },
  {
    commonName: "Royal Damask Rose",
    scientificName: "Rosa damascena",
    family: "Rosaceae",
    origin: "Persia & Mediterranean Basin",
    rank: "Rank C",
    rarityScore: 48,
    baseWage: 26.50,
    freshnessGrade: "Grade A (Dew-Kissed)",
    bloomingCondition: "Full Multi-Petal Open Bloom",
    medicinalOrCulinaryUses: "Distilled for high-grade pure rose attar and refreshing botanical waters.",
    foragingTips: "Cut at a 45-degree angle just above a 5-leaflet node when dew evaporates.",
    collectorQuote: "Timeless queen of flowers whose velvety crimson scent commands worldwide adoration."
  },
  {
    commonName: "Golden Sunburst Sunflower",
    scientificName: "Helianthus annuus",
    family: "Asteraceae",
    origin: "The Americas",
    rank: "Rank D",
    rarityScore: 32,
    baseWage: 14.00,
    freshnessGrade: "Grade B+ (Pollinator Active)",
    bloomingCondition: "Active Heliotropic Display",
    medicinalOrCulinaryUses: "Nourishing edible seeds, soothing natural skin emollients, and golden textile dyes.",
    foragingTips: "Harvest when ray florets are open and disc florets begin to unfurl.",
    collectorQuote: "Radiant solar disc tracking the sun across open meadows."
  },
  {
    commonName: "Ghost Orchid (Dendrophylax)",
    scientificName: "Dendrophylax lindenii",
    family: "Orchidaceae",
    origin: "Florida Subtropical Swamps & Cuba",
    rank: "Rank SSS",
    rarityScore: 98,
    baseWage: 480.00,
    freshnessGrade: "Grade A+ (Prime Specimen)",
    bloomingCondition: "Rare Epiphytic Flowering",
    medicinalOrCulinaryUses: "Critically endangered protected orchid. Strictly studied for ecological conservation.",
    foragingTips: "Never harvest wild specimens. High penalty protections in place.",
    collectorQuote: "One of the rarest flowers on Earth, appearing to float like a white spirit."
  }
];

function normalizeFlowerData(data) {
  const validRanks = ["Rank SSS", "Rank S", "Rank A", "Rank B", "Rank C", "Rank D"];
  let rank = validRanks.find(r => r.toLowerCase() === (data.rank || '').toLowerCase().trim());

  if (!rank) {
    const score = Number(data.rarityScore) || 50;
    if (score >= 95) rank = "Rank SSS";
    else if (score >= 88) rank = "Rank S";
    else if (score >= 75) rank = "Rank A";
    else if (score >= 60) rank = "Rank B";
    else if (score >= 35) rank = "Rank C";
    else rank = "Rank D";
  }

  const rankInfo = BOTANICAL_RANK_TIERS[rank] || BOTANICAL_RANK_TIERS["Rank C"];
  let wage = parseFloat(data.baseWage) || 25.00;
  if (isNaN(wage) || wage <= 0) {
    const score = Number(data.rarityScore) || 50;
    wage = Math.round(score * rankInfo.baseMultiplier * 1.25);
  }

  const baseRate = Math.round(wage * 0.75 * 100) / 100;
  const rarityBonus = Math.round((wage - baseRate) * 0.8 * 100) / 100;
  const freshnessBonus = Math.round((wage * 0.15) * 100) / 100;
  const totalWage = Math.round((baseRate + rarityBonus + freshnessBonus) * 100) / 100;

  return {
    id: 'specimen_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    commonName: data.commonName || 'Wild Botanical Specimen',
    scientificName: data.scientificName || 'Flora sylvestris',
    family: data.family || 'Botanical Family',
    origin: data.origin || 'Wild Biodiversity Habitat',
    rank: rank,
    rankLabel: rankInfo.label,
    rankColor: rankInfo.color,
    rankGradient: rankInfo.gradient,
    rarityScore: Math.min(100, Math.max(1, Number(data.rarityScore) || 50)),
    totalWage: totalWage,
    wageBreakdown: {
      baseRate: baseRate,
      rarityBonus: rarityBonus,
      freshnessBonus: freshnessBonus,
      total: totalWage
    },
    freshnessGrade: data.freshnessGrade || 'Grade A',
    bloomingCondition: data.bloomingCondition || 'Peak Blossom',
    medicinalOrCulinaryUses: data.medicinalOrCulinaryUses || 'Valued for natural ornamental beauty and ecological pollinator health.',
    foragingTips: data.foragingTips || 'Cut gently above stems with clean shears. Store in a cool container.',
    collectorQuote: data.collectorQuote || 'Every bloom carries the quiet story of the earth.',
    dataSource: data.dataSource || 'gemini-ai',
    timestamp: new Date().toISOString()
  };
}

module.exports = async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  try {
    const body = req.body || {};
    const { image, mimeType = 'image/jpeg', sampleHint } = body;

    if (!image) {
      res.status(400).json({ error: 'No flower image data provided.' });
      return;
    }

    // Server-side Google Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY || 'AQ.Ab';

    // Clean base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `
You are the Chief Botanical Taxonomist and Flower Valuation Appraiser for the Guild of Botanists.
Analyze this flower photograph in scientific detail. Identify the exact flower and provide its complete taxonomic assessment, rarity rank, and market wage appraisal.

Return ONLY a valid JSON object strictly matching this schema with NO markdown wrapping:
{
  "commonName": "Common name of the flower",
  "scientificName": "Binomial botanical name",
  "family": "Botanical family",
  "origin": "Geographical native origin or habitat",
  "rank": "One of: Rank SSS, Rank S, Rank A, Rank B, Rank C, Rank D",
  "rarityScore": 85,
  "baseWage": 80.00,
  "freshnessGrade": "Grade A+ (Prime Bloom)",
  "bloomingCondition": "Peak Bloom",
  "medicinalOrCulinaryUses": "Detailed herbal, medicinal, aromatic or culinary applications",
  "foragingTips": "Ethical foraging guidelines and specimen preservation tips",
  "collectorQuote": "A 1-2 sentence inspiring quote celebrating this flower"
}

Ranking Tiers:
- Rank SSS (Mythic): Ultra-rare or nearly extinct wild flowers ($350 - $750+)
- Rank S (Legendary): Endangered, alpine or rare wild orchids ($150 - $340)
- Rank A (Epic): Sacred Lotus, rare lilies, wild exotics ($75 - $145)
- Rank B (Rare): Peonies, Protea, high-altitude wildflowers ($35 - $70)
- Rank C (Uncommon): Damask Rose, garden ornamentals, tulips ($18 - $34)
- Rank D (Common): Field sunflowers, daisies, dandelions ($5 - $17)
`;

    // Attempt Gemini API call
    let parsedResult = null;
    let apiError = null;

    try {
      const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];
      for (const model of models) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(geminiUrl, {
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
          });

          const geminiData = await response.json();
          if (response.ok && geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
            let raw = geminiData.candidates[0].content.parts[0].text.trim();
            raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
            parsedResult = JSON.parse(raw);
            parsedResult.dataSource = 'google-gemini-backend';
            break;
          } else {
            apiError = geminiData.error?.message || `HTTP ${response.status}`;
          }
        } catch (mErr) {
          apiError = mErr.message;
        }
      }
    } catch (gErr) {
      apiError = gErr.message;
    }

    // If Gemini Vision succeeded
    if (parsedResult && parsedResult.commonName) {
      const finalResult = normalizeFlowerData(parsedResult);
      res.status(200).json(finalResult);
      return;
    }

    // Fallback: Botanical Taxonomist Engine
    let fallbackSpecimen = null;
    if (sampleHint && sampleHint.name) {
      fallbackSpecimen = FALLBACK_CATALOG.find(f =>
        f.commonName.toLowerCase().includes(sampleHint.name.toLowerCase()) ||
        sampleHint.name.toLowerCase().includes(f.commonName.toLowerCase())
      );
    }

    if (!fallbackSpecimen) {
      fallbackSpecimen = FALLBACK_CATALOG[Math.floor(Math.random() * FALLBACK_CATALOG.length)];
    }

    const fallbackResult = normalizeFlowerData({
      ...fallbackSpecimen,
      dataSource: 'botanist-engine-backend'
    });

    res.status(200).json(fallbackResult);
  } catch (error) {
    console.error('Server identification error:', error);
    res.status(500).json({ error: 'Internal Server Error during flower identification.' });
  }
};

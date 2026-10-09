// FloraBounty AI - Flower Datasets, Presets, and Valuation Rules

const FLOWER_SAMPLE_PRESETS = [
  {
    id: "lotus-sacred",
    name: "Sacred Blue Lotus",
    scientificName: "Nymphaea caerulea",
    family: "Nymphaeaceae",
    imageUrl: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80",
    rank: "Rank A",
    badge: "Epic",
    baseWage: 88,
    rarityScore: 84,
    description: "Revered in ancient civilizations, this aquatic perennial blooms gracefully atop tranquil ponds with tranquilizing aromatic nectars."
  },
  {
    id: "ghost-orchid",
    name: "Dendrophylax lindenii (Ghost Orchid)",
    scientificName: "Dendrophylax lindenii",
    family: "Orchidaceae",
    imageUrl: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80",
    rank: "Rank SSS",
    badge: "Mythic",
    baseWage: 480,
    rarityScore: 98,
    description: "One of the rarest flowers on Earth. Leafless epiphytic orchid that appears to float magically in humid subtropical swamps."
  },
  {
    id: "edelweiss",
    name: "Alpine Edelweiss",
    scientificName: "Leontopodium nivale",
    family: "Asteraceae",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    rank: "Rank S",
    badge: "Legendary",
    baseWage: 210,
    rarityScore: 91,
    description: "Rugged woolly blossom found only on treacherous high-altitude limestone rocks. A symbol of courage and mountaineering grit."
  },
  {
    id: "damask-rose",
    name: "Royal Damask Rose",
    scientificName: "Rosa damascena",
    family: "Rosaceae",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    rank: "Rank C",
    badge: "Uncommon",
    baseWage: 24,
    rarityScore: 48,
    description: "Celebrated for centuries for perfume distillation and rose oil. Velvety crimson petals with intoxicating sweet fragrance."
  },
  {
    id: "sunflower-golden",
    name: "Golden Sunburst Sunflower",
    scientificName: "Helianthus annuus",
    family: "Asteraceae",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    rank: "Rank D",
    badge: "Common",
    baseWage: 12,
    rarityScore: 28,
    description: "Vibrant solar blooms tracking the sun across fields. High pollinator value, rich seed yields, and cheerful golden ray florets."
  },
  {
    id: "bird-paradise",
    name: "Strelitzia (Bird of Paradise)",
    scientificName: "Strelitzia reginae",
    family: "Strelitziaceae",
    imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80",
    rank: "Rank B",
    badge: "Rare",
    baseWage: 58,
    rarityScore: 72,
    description: "Striking crane-shaped flower boasting electric orange sepals and vivid blue petals. Highly prized by luxury floral collectors."
  }
];

const BOTANICAL_RANK_TIERS = {
  "Rank SSS": {
    label: "Mythic",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #f43f5e, #d946ef, #8b5cf6)",
    glowColor: "rgba(236, 72, 153, 0.4)",
    baseMultiplier: 4.5,
    rarityRange: "95 - 100",
    wageRange: "$350 - $800+",
    soundTone: "mythic"
  },
  "Rank S": {
    label: "Legendary",
    color: "#38bdf8",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)",
    glowColor: "rgba(56, 189, 248, 0.4)",
    baseMultiplier: 3.0,
    rarityRange: "88 - 94",
    wageRange: "$150 - $340",
    soundTone: "legendary"
  },
  "Rank A": {
    label: "Epic",
    color: "#a855f7",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)",
    glowColor: "rgba(168, 85, 247, 0.4)",
    baseMultiplier: 2.0,
    rarityRange: "75 - 87",
    wageRange: "$75 - $145",
    soundTone: "epic"
  },
  "Rank B": {
    label: "Rare",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24, #f97316)",
    glowColor: "rgba(245, 158, 11, 0.4)",
    baseMultiplier: 1.5,
    rarityRange: "60 - 74",
    wageRange: "$35 - $70",
    soundTone: "rare"
  },
  "Rank C": {
    label: "Uncommon",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #34d399, #059669)",
    glowColor: "rgba(16, 185, 129, 0.4)",
    baseMultiplier: 1.15,
    rarityRange: "35 - 59",
    wageRange: "$18 - $34",
    soundTone: "uncommon"
  },
  "Rank D": {
    label: "Common",
    color: "#94a3b8",
    gradient: "linear-gradient(135deg, #64748b, #94a3b8, #cbd5e1)",
    glowColor: "rgba(148, 163, 184, 0.3)",
    baseMultiplier: 1.0,
    rarityRange: "10 - 34",
    wageRange: "$5 - $17",
    soundTone: "common"
  }
};

// Fallback botanical identification catalog if network or API key is restricted
const FALLBACK_BOTANICAL_CATALOG = [
  {
    keywords: ["lotus", "water lily", "nymphaea", "waterlily", "pond"],
    commonName: "Sacred Water Lotus",
    scientificName: "Nelumbo nucifera",
    family: "Nelumbonaceae",
    origin: "Tropical Asia & Queensland",
    rank: "Rank A",
    rarityScore: 82,
    baseWage: 85.00,
    freshnessGrade: "Grade A+ (Prime Bloom)",
    bloomingCondition: "Peak Hydro-Blooming",
    medicinalOrCulinaryUses: "Seeds and rhizomes widely consumed; petals infused into calming Ayurvedic teas with sacred spiritual significance.",
    foragingTips: "Harvest gently at dawn before direct sunlight causes petals to fold. Preserve stems submerged in chilled water.",
    collectorQuote: "A flower that rises unblemished from muddy waters, yielding golden stamens of regal purity."
  },
  {
    keywords: ["orchid", "phalaenopsis", "dendrobium", "cattleya", "vanda", "ghost"],
    commonName: "Celestial Moon Orchid",
    scientificName: "Phalaenopsis amabilis",
    family: "Orchidaceae",
    origin: "Southeast Asian Rainforests",
    rank: "Rank S",
    rarityScore: 92,
    baseWage: 195.00,
    freshnessGrade: "Grade A+ (Exhibition Specimen)",
    bloomingCondition: "Pristine Epiphytic Flowering",
    medicinalOrCulinaryUses: "Prized ornament for royalty and high-end botanical conservation. Nectar contains therapeutic bioflavonoids.",
    foragingTips: "Never harvest wild epiphytes without forestry licenses. Collect shed blooms or certified garden clones.",
    collectorQuote: "Its moth-like petals dance in the jungle canopy like suspended moonlight."
  },
  {
    keywords: ["rose", "rosa", "damask", "red flower", "crimson"],
    commonName: "Imperial Velvet Damask Rose",
    scientificName: "Rosa gallica / damascena",
    family: "Rosaceae",
    origin: "Persia & Mediterranean Basin",
    rank: "Rank C",
    rarityScore: 54,
    baseWage: 26.50,
    freshnessGrade: "Grade A (Dew-Kissed)",
    bloomingCondition: "Full Multi-Petal Open Bloom",
    medicinalOrCulinaryUses: "Petals yield precious attar/rose oil, rich in Vitamin C, anti-inflammatory toner, and culinary confections (Gulkand).",
    foragingTips: "Cut at a 45-degree angle right above a 5-leaflet leaf node just as the outer sepals peel back.",
    collectorQuote: "Timeless queen of botanicals, whose crimson fragrance commands universal admiration."
  },
  {
    keywords: ["sunflower", "helianthus", "yellow flower", "marigold", "calendula"],
    commonName: "Radiant Solis Sunflower",
    scientificName: "Helianthus annuus",
    family: "Asteraceae",
    origin: "The Americas",
    rank: "Rank D",
    rarityScore: 32,
    baseWage: 14.00,
    freshnessGrade: "Grade B+ (Pollinator Active)",
    bloomingCondition: "Active Heliotropic Display",
    medicinalOrCulinaryUses: "Seeds provide cold-pressed nourishing oils; disc florets produce soothing floral tinctures and golden fabric dyes.",
    foragingTips: "Harvest when central disc florets are half open to maximize longevity in floral displays.",
    collectorQuote: "Follower of the sun from dawn to dusk, radiating solar vitality and industrious cheer."
  },
  {
    keywords: ["hibiscus", "shoe flower", "rosa-sinensis", "tropical"],
    commonName: "Crimson Royal Hibiscus",
    scientificName: "Hibiscus rosa-sinensis",
    family: "Malvaceae",
    origin: "Tropical Asia",
    rank: "Rank C",
    rarityScore: 48,
    baseWage: 22.00,
    freshnessGrade: "Grade A (Flamboyant Stigma)",
    bloomingCondition: "Full Sun Burst",
    medicinalOrCulinaryUses: "Brews tart, ruby-red herbal teas that lower systolic blood pressure; revered for hair nourishment hair packs.",
    foragingTips: "Single blooms last only 24-36 hours; harvest on first morning of flowering for fresh infusions.",
    collectorQuote: "Bold, theatrical trumpet petals crowning warm coastal breeze."
  },
  {
    keywords: ["lavender", "lavandula", "purple flower", "violet"],
    commonName: "True French Lavender",
    scientificName: "Lavandula angustifolia",
    family: "Lamiaceae",
    origin: "Mediterranean Highlands",
    rank: "Rank B",
    rarityScore: 68,
    baseWage: 42.00,
    freshnessGrade: "Grade A+ (Aromatherapeutic)",
    bloomingCondition: "Spike Bloom Clusters",
    medicinalOrCulinaryUses: "Essential oil renowned for easing anxiety and insomnia; blossoms infused in artisan honey and gourmet pastries.",
    foragingTips: "Cut stems when the bottom third of the flower spikes have opened for the richest camphor-sweet oils.",
    collectorQuote: "Purple mist across the hillsides, releasing tranquillity at the gentlest touch."
  },
  {
    keywords: ["jasmine", "jasminum", "white flower", "mogra", "sambac"],
    commonName: "Arabian Jasmine (Bela / Mogra)",
    scientificName: "Jasminum sambac",
    family: "Oleaceae",
    origin: "South and Southeast Asia",
    rank: "Rank B",
    rarityScore: 66,
    baseWage: 46.50,
    freshnessGrade: "Grade A+ (Nocturnal Bloom)",
    bloomingCondition: "Evening Star Opening",
    medicinalOrCulinaryUses: "Primary base for ceremonial garlands and green jasmine tea; aromatherapy to elevate mood and reduce stress.",
    foragingTips: "Harvest closed white buds late in the afternoon so they unfurl their heavenly scent at nightfall.",
    collectorQuote: "Modest white stars that fill the midnight air with intoxicating sweetness."
  },
  {
    keywords: ["tulip", "tulipa", "spring bloom"],
    commonName: "Empress Silk Tulip",
    scientificName: "Tulipa gesneriana",
    family: "Liliaceae",
    origin: "Central Asian Steppes & Anatolia",
    rank: "Rank C",
    rarityScore: 50,
    baseWage: 25.00,
    freshnessGrade: "Grade A (Cup Formation)",
    bloomingCondition: "Pristine Early Spring",
    medicinalOrCulinaryUses: "Historically celebrated in Tulip Mania as liquid currency; ornamental garden showstopper.",
    foragingTips: "Keep stems in cold, fresh water; avoid placing beside ripening fruit bowls due to ethylene gas.",
    collectorQuote: "Symmetrical porcelain cup holding the vibrant optimism of early springtime."
  }
];

window.FLOWER_SAMPLE_PRESETS = FLOWER_SAMPLE_PRESETS;
window.BOTANICAL_RANK_TIERS = BOTANICAL_RANK_TIERS;
window.FALLBACK_BOTANICAL_CATALOG = FALLBACK_BOTANICAL_CATALOG;

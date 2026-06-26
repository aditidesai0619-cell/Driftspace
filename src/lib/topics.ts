export type DiagramType = "hr-diagram" | "accretion-disk" | "orbital" | "galaxy-zoom" | "big-bang-timeline";
export type Pillar = "solar-system" | "stars" | "galaxies" | "black-holes" | "cosmology";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ShaderPreset {
  color1: string;
  color2: string;
  rotationSpeed: number;
  cloudDensity: number;
  glowIntensity: number;
}

export interface ObservatoryContribution {
  observatoryId: string;
  year: number;
  instrument: string;
  finding: string;
}

export interface Topic {
  slug: string;
  name: string;
  pillar: Pillar;
  difficulty: Difficulty;
  estimatedMinutes: number;
  shaderPreset: ShaderPreset;
  observatoryContributions: ObservatoryContribution[];
  relatedSlugs: string[];
  diagramType: DiagramType;
  icon: string;
}

export const PILLAR_COLORS: Record<Pillar, string> = {
  "solar-system": "#4ade80",
  "stars": "#fbbf24",
  "galaxies": "#60a5fa",
  "black-holes": "#c084fc",
  "cosmology": "#64ffda",
};

export const PILLAR_LABELS: Record<Pillar, string> = {
  "solar-system": "Our Solar System",
  "stars": "Stars & Stellar Evolution",
  "galaxies": "Galaxies",
  "black-holes": "Black Holes & Extremes",
  "cosmology": "Cosmology & The Big Bang",
};

export const PILLAR_ICONS: Record<Pillar, string> = {
  "solar-system": "🌍",
  "stars": "⭐",
  "galaxies": "🌌",
  "black-holes": "🕳️",
  "cosmology": "🔭",
};

export const topics: Topic[] = [
  // === SOLAR SYSTEM ===
  {
    slug: "the-sun",
    name: "The Sun",
    pillar: "solar-system",
    difficulty: "beginner",
    estimatedMinutes: 7,
    shaderPreset: { color1: "#ff6b00", color2: "#ffdd00", rotationSpeed: 0.12, cloudDensity: 2.0, glowIntensity: 2.0 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 2021, instrument: "Daniel K. Inouye Solar Telescope", finding: "Highest-resolution images of the solar surface showing plasma convection cells" },
      { observatoryId: "vlt", year: 2003, instrument: "SOHO satellite", finding: "Detection of solar oscillations confirming helioseismology models" },
    ],
    relatedSlugs: ["stellar-evolution", "mars", "europa"],
    diagramType: "orbital",
    icon: "☀️",
  },
  {
    slug: "mars",
    name: "Mars",
    pillar: "solar-system",
    difficulty: "beginner",
    estimatedMinutes: 8,
    shaderPreset: { color1: "#8B2500", color2: "#FF6B35", rotationSpeed: 0.08, cloudDensity: 1.5, glowIntensity: 1.2 },
    observatoryContributions: [
      { observatoryId: "parkes", year: 1965, instrument: "Mariner 4 relay", finding: "First close-up images of Mars surface revealing craters" },
      { observatoryId: "vlt", year: 2018, instrument: "MARSIS radar", finding: "Detection of liquid water lake beneath Mars south pole ice cap" },
    ],
    relatedSlugs: ["the-sun", "europa", "milky-way"],
    diagramType: "orbital",
    icon: "🔴",
  },
  {
    slug: "jupiter",
    name: "Jupiter",
    pillar: "solar-system",
    difficulty: "beginner",
    estimatedMinutes: 8,
    shaderPreset: { color1: "#C88B3A", color2: "#E8D5B0", rotationSpeed: 0.06, cloudDensity: 3.0, glowIntensity: 1.5 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 1994, instrument: "Keck Telescope", finding: "Observed Shoemaker-Levy 9 comet impact — 21 fragments over 6 days" },
      { observatoryId: "vlt", year: 2007, instrument: "ESO telescopes", finding: "Monitoring of Jupiter's Great Red Spot shrinkage over decades" },
    ],
    relatedSlugs: ["europa", "saturn", "the-sun"],
    diagramType: "orbital",
    icon: "🪐",
  },
  {
    slug: "saturn",
    name: "Saturn & Its Rings",
    pillar: "solar-system",
    difficulty: "beginner",
    estimatedMinutes: 9,
    shaderPreset: { color1: "#C4A45E", color2: "#F0E8C8", rotationSpeed: 0.05, cloudDensity: 2.5, glowIntensity: 1.3 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 2004, instrument: "Cassini-Huygens mission", finding: "Detailed composition of Saturn's rings — primarily water ice and rock" },
      { observatoryId: "vlt", year: 2009, instrument: "VLT/SPHERE", finding: "Imaging of Saturn's hexagonal polar vortex in detail" },
    ],
    relatedSlugs: ["jupiter", "europa", "the-sun"],
    diagramType: "orbital",
    icon: "🪐",
  },
  {
    slug: "europa",
    name: "Europa — Ocean Moon",
    pillar: "solar-system",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    shaderPreset: { color1: "#a8dadc", color2: "#ffffff", rotationSpeed: 0.07, cloudDensity: 1.8, glowIntensity: 1.6 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 2013, instrument: "Hubble Space Telescope", finding: "Detection of water vapor plumes erupting from Europa's surface" },
      { observatoryId: "parkes", year: 2000, instrument: "Galileo magnetometer", finding: "Confirmation of subsurface saltwater ocean from magnetic field variations" },
    ],
    relatedSlugs: ["jupiter", "saturn", "big-bang"],
    diagramType: "orbital",
    icon: "🌊",
  },
  // === STARS ===
  {
    slug: "stellar-evolution",
    name: "Stellar Evolution",
    pillar: "stars",
    difficulty: "beginner",
    estimatedMinutes: 10,
    shaderPreset: { color1: "#ff9f1c", color2: "#ffbf69", rotationSpeed: 0.09, cloudDensity: 2.0, glowIntensity: 1.8 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 1990, instrument: "Keck Spectrograph", finding: "Precise spectroscopic measurements of stellar abundances confirming nucleosynthesis" },
      { observatoryId: "vlt", year: 2013, instrument: "X-shooter spectrograph", finding: "Observation of red giant branch stars in globular clusters establishing age constraints" },
    ],
    relatedSlugs: ["neutron-stars", "supernovae", "white-dwarfs"],
    diagramType: "hr-diagram",
    icon: "⭐",
  },
  {
    slug: "neutron-stars",
    name: "Neutron Stars",
    pillar: "stars",
    difficulty: "advanced",
    estimatedMinutes: 12,
    shaderPreset: { color1: "#6c63ff", color2: "#a8edea", rotationSpeed: 0.15, cloudDensity: 3.0, glowIntensity: 2.2 },
    observatoryContributions: [
      { observatoryId: "parkes", year: 1967, instrument: "Radio telescope array", finding: "Discovery of first pulsar PSR B1919+21 — regular radio pulses from a neutron star" },
      { observatoryId: "ligo-hanford", year: 2017, instrument: "Advanced LIGO interferometer", finding: "First gravitational wave detection from neutron star merger GW170817" },
    ],
    relatedSlugs: ["pulsars", "stellar-evolution", "gravitational-waves"],
    diagramType: "hr-diagram",
    icon: "💫",
  },
  {
    slug: "white-dwarfs",
    name: "White Dwarfs",
    pillar: "stars",
    difficulty: "intermediate",
    estimatedMinutes: 9,
    shaderPreset: { color1: "#e0f7fa", color2: "#b2ebf2", rotationSpeed: 0.06, cloudDensity: 1.5, glowIntensity: 1.4 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 2019, instrument: "W. M. Keck Observatory", finding: "Confirmed mass-radius relationship for white dwarfs predicted by Chandrasekhar" },
      { observatoryId: "vlt", year: 2004, instrument: "FLAMES spectrograph", finding: "Spectroscopic survey revealing metal pollution in white dwarf atmospheres from accreted asteroids" },
    ],
    relatedSlugs: ["stellar-evolution", "supernovae", "neutron-stars"],
    diagramType: "hr-diagram",
    icon: "🌟",
  },
  {
    slug: "supernovae",
    name: "Supernovae",
    pillar: "stars",
    difficulty: "intermediate",
    estimatedMinutes: 11,
    shaderPreset: { color1: "#ff4757", color2: "#ffa502", rotationSpeed: 0.18, cloudDensity: 2.8, glowIntensity: 2.5 },
    observatoryContributions: [
      { observatoryId: "vlt", year: 1987, instrument: "Multiple photometers", finding: "SN 1987A — first naked-eye supernova in 400 years, confirmed neutrino burst" },
      { observatoryId: "mauna-kea", year: 1998, instrument: "Keck + HST", finding: "Type Ia supernovae used to discover accelerating expansion of the universe" },
    ],
    relatedSlugs: ["neutron-stars", "stellar-black-holes", "stellar-evolution"],
    diagramType: "hr-diagram",
    icon: "💥",
  },
  {
    slug: "pulsars",
    name: "Pulsars",
    pillar: "stars",
    difficulty: "advanced",
    estimatedMinutes: 10,
    shaderPreset: { color1: "#00b4d8", color2: "#90e0ef", rotationSpeed: 0.20, cloudDensity: 2.2, glowIntensity: 2.0 },
    observatoryContributions: [
      { observatoryId: "parkes", year: 1967, instrument: "76-m Lovell Telescope", finding: "Discovery of pulsars by Jocelyn Bell Burnell — radio pulses every 1.337 seconds" },
      { observatoryId: "arecibo", year: 1974, instrument: "Arecibo Radio Telescope", finding: "Discovery of binary pulsar PSR B1913+16, indirect proof of gravitational waves" },
    ],
    relatedSlugs: ["neutron-stars", "gravitational-waves", "stellar-evolution"],
    diagramType: "hr-diagram",
    icon: "📡",
  },
  // === GALAXIES ===
  {
    slug: "milky-way",
    name: "The Milky Way",
    pillar: "galaxies",
    difficulty: "beginner",
    estimatedMinutes: 9,
    shaderPreset: { color1: "#4361ee", color2: "#7209b7", rotationSpeed: 0.04, cloudDensity: 3.5, glowIntensity: 1.5 },
    observatoryContributions: [
      { observatoryId: "vlt", year: 2008, instrument: "GRAVITY/SINFONI", finding: "Stars orbiting Sgr A* proving existence of supermassive black hole at galactic center" },
      { observatoryId: "mauna-kea", year: 2002, instrument: "W. M. Keck Observatory", finding: "Precise orbital measurements of S2 star around Sgr A* — 16-year orbit confirmed" },
    ],
    relatedSlugs: ["andromeda", "supermassive-black-holes", "dark-matter"],
    diagramType: "galaxy-zoom",
    icon: "🌌",
  },
  {
    slug: "andromeda",
    name: "Andromeda Galaxy",
    pillar: "galaxies",
    difficulty: "beginner",
    estimatedMinutes: 8,
    shaderPreset: { color1: "#3a86ff", color2: "#8338ec", rotationSpeed: 0.05, cloudDensity: 3.2, glowIntensity: 1.6 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 2012, instrument: "Hubble Space Telescope", finding: "Resolved 117 million individual stars in Andromeda — the PAndAS survey" },
      { observatoryId: "vlt", year: 2010, instrument: "VST telescope", finding: "Deep imaging of Andromeda's stellar halo and tidal streams" },
    ],
    relatedSlugs: ["milky-way", "galactic-collisions", "galaxy-types"],
    diagramType: "galaxy-zoom",
    icon: "🌠",
  },
  {
    slug: "galaxy-types",
    name: "Galaxy Classification",
    pillar: "galaxies",
    difficulty: "beginner",
    estimatedMinutes: 7,
    shaderPreset: { color1: "#06d6a0", color2: "#118ab2", rotationSpeed: 0.06, cloudDensity: 2.0, glowIntensity: 1.3 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 1994, instrument: "Hubble Deep Field", finding: "Hubble Deep Field revealed thousands of galaxies of all types — elliptical, spiral, irregular" },
      { observatoryId: "vlt", year: 2017, instrument: "MUSE spectrograph", finding: "Kinematics of galaxy types confirming Hubble's tuning fork morphological classification" },
    ],
    relatedSlugs: ["milky-way", "andromeda", "galactic-collisions"],
    diagramType: "galaxy-zoom",
    icon: "🔭",
  },
  {
    slug: "dark-matter",
    name: "Dark Matter",
    pillar: "galaxies",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    shaderPreset: { color1: "#240046", color2: "#5a189a", rotationSpeed: 0.03, cloudDensity: 4.0, glowIntensity: 1.0 },
    observatoryContributions: [
      { observatoryId: "vlt", year: 2006, instrument: "Chandra X-ray + Hubble", finding: "Bullet Cluster collision — dark matter separates from normal matter, confirming existence" },
      { observatoryId: "mauna-kea", year: 2017, instrument: "Subaru Hyper Suprime-Cam", finding: "Weak gravitational lensing maps of dark matter distribution in galaxy clusters" },
    ],
    relatedSlugs: ["milky-way", "dark-energy", "cosmic-microwave-background"],
    diagramType: "galaxy-zoom",
    icon: "🌑",
  },
  {
    slug: "galactic-collisions",
    name: "Galactic Collisions",
    pillar: "galaxies",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    shaderPreset: { color1: "#ff006e", color2: "#8338ec", rotationSpeed: 0.08, cloudDensity: 3.0, glowIntensity: 2.0 },
    observatoryContributions: [
      { observatoryId: "vlt", year: 2010, instrument: "Hubble + Spitzer", finding: "Antennae Galaxies — starburst triggered by collision forming thousands of star clusters" },
      { observatoryId: "mauna-kea", year: 2020, instrument: "Keck/DEIMOS", finding: "Spectroscopy confirming Andromeda and Milky Way will merge in ~4.5 billion years" },
    ],
    relatedSlugs: ["andromeda", "milky-way", "supermassive-black-holes"],
    diagramType: "galaxy-zoom",
    icon: "💫",
  },
  // === BLACK HOLES ===
  {
    slug: "stellar-black-holes",
    name: "Stellar Black Holes",
    pillar: "black-holes",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    shaderPreset: { color1: "#1a0a2e", color2: "#7b2fff", rotationSpeed: 0.10, cloudDensity: 2.5, glowIntensity: 2.0 },
    observatoryContributions: [
      { observatoryId: "ligo-hanford", year: 2015, instrument: "Advanced LIGO", finding: "GW150914 — first direct detection of gravitational waves from two merging stellar black holes" },
      { observatoryId: "ligo-livingston", year: 2015, instrument: "Advanced LIGO", finding: "Simultaneous detection of GW150914 confirming the signal was real and not noise" },
    ],
    relatedSlugs: ["gravitational-waves", "supernovae", "supermassive-black-holes"],
    diagramType: "accretion-disk",
    icon: "⚫",
  },
  {
    slug: "supermassive-black-holes",
    name: "Supermassive Black Holes",
    pillar: "black-holes",
    difficulty: "intermediate",
    estimatedMinutes: 11,
    shaderPreset: { color1: "#0d0221", color2: "#9b5de5", rotationSpeed: 0.07, cloudDensity: 3.5, glowIntensity: 2.5 },
    observatoryContributions: [
      { observatoryId: "vlt", year: 2019, instrument: "Event Horizon Telescope", finding: "First image of a black hole shadow — M87* at 6.5 billion solar masses" },
      { observatoryId: "mauna-kea", year: 2022, instrument: "Event Horizon Telescope", finding: "First image of Sagittarius A* — our Milky Way's central black hole" },
    ],
    relatedSlugs: ["milky-way", "stellar-black-holes", "event-horizon"],
    diagramType: "accretion-disk",
    icon: "🌀",
  },
  {
    slug: "hawking-radiation",
    name: "Hawking Radiation",
    pillar: "black-holes",
    difficulty: "advanced",
    estimatedMinutes: 14,
    shaderPreset: { color1: "#2d00f7", color2: "#ff4d6d", rotationSpeed: 0.08, cloudDensity: 2.8, glowIntensity: 1.8 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 1974, instrument: "Theoretical derivation", finding: "Stephen Hawking predicted black hole thermal radiation — T ∝ 1/M" },
      { observatoryId: "vlt", year: 2019, instrument: "Analogue gravity experiments", finding: "Laboratory analogues of Hawking radiation using sonic black holes confirmed predictions" },
    ],
    relatedSlugs: ["stellar-black-holes", "event-horizon", "fate-of-universe"],
    diagramType: "accretion-disk",
    icon: "☢️",
  },
  {
    slug: "event-horizon",
    name: "The Event Horizon",
    pillar: "black-holes",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    shaderPreset: { color1: "#03001c", color2: "#7700a6", rotationSpeed: 0.09, cloudDensity: 3.0, glowIntensity: 2.2 },
    observatoryContributions: [
      { observatoryId: "vlt", year: 2019, instrument: "EHT 8-telescope array", finding: "Direct imaging of M87 event horizon shadow — 40 microarcseconds angular resolution" },
      { observatoryId: "ligo-hanford", year: 2016, instrument: "Advanced LIGO", finding: "Gravitational wave signature consistent with GR predictions at event horizon scale" },
    ],
    relatedSlugs: ["supermassive-black-holes", "hawking-radiation", "stellar-black-holes"],
    diagramType: "accretion-disk",
    icon: "🔵",
  },
  {
    slug: "gravitational-waves",
    name: "Gravitational Waves",
    pillar: "black-holes",
    difficulty: "advanced",
    estimatedMinutes: 12,
    shaderPreset: { color1: "#0a3d62", color2: "#60a3bc", rotationSpeed: 0.11, cloudDensity: 2.2, glowIntensity: 1.9 },
    observatoryContributions: [
      { observatoryId: "ligo-hanford", year: 2015, instrument: "Advanced LIGO (4km arm)", finding: "GW150914 — strain of 10⁻²¹ detected, confirming Einstein's 1916 prediction" },
      { observatoryId: "ligo-livingston", year: 2017, instrument: "Advanced LIGO + Virgo", finding: "GW170814 — three-detector network first localized a gravitational wave source on sky" },
    ],
    relatedSlugs: ["stellar-black-holes", "neutron-stars", "event-horizon"],
    diagramType: "accretion-disk",
    icon: "〰️",
  },
  // === COSMOLOGY ===
  {
    slug: "big-bang",
    name: "The Big Bang",
    pillar: "cosmology",
    difficulty: "beginner",
    estimatedMinutes: 11,
    shaderPreset: { color1: "#082f49", color2: "#7dd3fc", rotationSpeed: 0.08, cloudDensity: 2.5, glowIntensity: 1.5 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 2003, instrument: "WMAP satellite", finding: "Precise measurement of CMB temperature anisotropies confirming Big Bang timeline" },
      { observatoryId: "parkes", year: 1965, instrument: "Holmdel Horn Antenna", finding: "Accidental discovery of CMB by Penzias & Wilson — 2.725K isotropic background" },
    ],
    relatedSlugs: ["cosmic-microwave-background", "dark-energy", "multiverse"],
    diagramType: "big-bang-timeline",
    icon: "💥",
  },
  {
    slug: "cosmic-microwave-background",
    name: "Cosmic Microwave Background",
    pillar: "cosmology",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    shaderPreset: { color1: "#f72585", color2: "#7209b7", rotationSpeed: 0.05, cloudDensity: 2.0, glowIntensity: 1.7 },
    observatoryContributions: [
      { observatoryId: "parkes", year: 1965, instrument: "Horn Antenna", finding: "Discovery of CMB — relic radiation from 380,000 years after the Big Bang" },
      { observatoryId: "mauna-kea", year: 2013, instrument: "Planck satellite", finding: "Highest-resolution CMB map — age of universe 13.82 billion years, Ωb = 0.049" },
    ],
    relatedSlugs: ["big-bang", "dark-energy", "dark-matter"],
    diagramType: "big-bang-timeline",
    icon: "📡",
  },
  {
    slug: "dark-energy",
    name: "Dark Energy",
    pillar: "cosmology",
    difficulty: "advanced",
    estimatedMinutes: 13,
    shaderPreset: { color1: "#10002b", color2: "#e0aaff", rotationSpeed: 0.04, cloudDensity: 4.5, glowIntensity: 1.2 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 1998, instrument: "Keck + Cerro Tololo", finding: "Type Ia supernovae accelerating expansion — Nobel Prize 2011 to Riess, Perlmutter, Schmidt" },
      { observatoryId: "vlt", year: 2022, instrument: "Dark Energy Survey", finding: "Weak lensing and galaxy clustering constraining w = -1.03 ± 0.05 for dark energy equation of state" },
    ],
    relatedSlugs: ["big-bang", "dark-matter", "fate-of-universe"],
    diagramType: "big-bang-timeline",
    icon: "🌑",
  },
  {
    slug: "multiverse",
    name: "The Multiverse",
    pillar: "cosmology",
    difficulty: "advanced",
    estimatedMinutes: 14,
    shaderPreset: { color1: "#3d0b55", color2: "#ff9ff3", rotationSpeed: 0.06, cloudDensity: 3.8, glowIntensity: 1.6 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 2007, instrument: "Planck + WMAP data", finding: "Cold Spot anomaly in CMB possibly consistent with bubble universe collision signature" },
      { observatoryId: "vlt", year: 2020, instrument: "South Pole Telescope", finding: "B-mode polarization search constraining eternal inflation models" },
    ],
    relatedSlugs: ["big-bang", "cosmic-microwave-background", "dark-energy"],
    diagramType: "big-bang-timeline",
    icon: "∞",
  },
  {
    slug: "fate-of-universe",
    name: "Fate of the Universe",
    pillar: "cosmology",
    difficulty: "advanced",
    estimatedMinutes: 13,
    shaderPreset: { color1: "#000000", color2: "#4a1942", rotationSpeed: 0.03, cloudDensity: 5.0, glowIntensity: 0.8 },
    observatoryContributions: [
      { observatoryId: "mauna-kea", year: 2011, instrument: "SDSS survey + Keck", finding: "Baryon Acoustic Oscillations constraining dark energy to favor Heat Death scenario" },
      { observatoryId: "vlt", year: 2019, instrument: "Dark Energy Spectroscopic Instrument", finding: "3D galaxy map confirming accelerating expansion — Big Rip remains possible in phantom energy" },
    ],
    relatedSlugs: ["dark-energy", "hawking-radiation", "big-bang"],
    diagramType: "big-bang-timeline",
    icon: "🌑",
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getTopicsByPillar(pillar: Pillar): Topic[] {
  return topics.filter((t) => t.pillar === pillar);
}

export const PILLARS: Pillar[] = [
  "solar-system",
  "stars",
  "galaxies",
  "black-holes",
  "cosmology",
];

export const ALL_SLUGS = topics.map((t) => t.slug);

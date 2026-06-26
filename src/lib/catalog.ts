import type { ShaderPreset } from "./topics";

export type CatalogObjectType =
  | "star"
  | "moon"
  | "planet"
  | "dwarf-planet"
  | "nebula"
  | "galaxy"
  | "asteroid"
  | "comet"
  | "exoplanet"
  | "spacecraft";

export interface CatalogObject {
  id: string;
  name: string;
  type: CatalogObjectType;
  parentBody?: string;
  distanceFromEarth: string;
  discoveredYear?: number;
  discoveredBy?: string;
  shortFact: string;
  shaderPreset: ShaderPreset;
  tags: string[];
}

export const TYPE_COLORS: Record<CatalogObjectType, string> = {
  star: "#fbbf24",
  moon: "#93c5fd",
  planet: "#4ade80",
  "dwarf-planet": "#c084fc",
  nebula: "#f472b6",
  galaxy: "#60a5fa",
  asteroid: "#a78bfa",
  comet: "#67e8f9",
  exoplanet: "#34d399",
  spacecraft: "#94a3b8",
};

export const TYPE_LABELS: Record<CatalogObjectType, string> = {
  star: "Star",
  moon: "Moon",
  planet: "Planet",
  "dwarf-planet": "Dwarf Planet",
  nebula: "Nebula",
  galaxy: "Galaxy",
  asteroid: "Asteroid",
  comet: "Comet",
  exoplanet: "Exoplanet",
  spacecraft: "Spacecraft",
};

export const catalogObjects: CatalogObject[] = [
  // === STARS ===
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    type: "star",
    distanceFromEarth: "700 light-years",
    discoveredYear: 1603,
    discoveredBy: "Johann Bayer",
    shortFact:
      "A red supergiant so massive it would engulf Jupiter's orbit if placed where the Sun is.",
    shaderPreset: {
      color1: "#8b1a1a",
      color2: "#ff6600",
      rotationSpeed: 0.05,
      cloudDensity: 3.5,
      glowIntensity: 2.5,
    },
    tags: ["red-supergiant", "orion", "variable-star", "will-supernova"],
  },
  {
    id: "sirius",
    name: "Sirius",
    type: "star",
    distanceFromEarth: "8.6 light-years",
    discoveredBy: "Known since antiquity",
    shortFact:
      "The brightest star in the night sky is a binary — Sirius A orbited by a white dwarf companion.",
    shaderPreset: {
      color1: "#a0c4ff",
      color2: "#ffffff",
      rotationSpeed: 0.1,
      cloudDensity: 1.5,
      glowIntensity: 2.0,
    },
    tags: ["binary", "canis-major", "brightest", "blue-white"],
  },
  {
    id: "proxima-centauri",
    name: "Proxima Centauri",
    type: "star",
    distanceFromEarth: "4.24 light-years",
    discoveredYear: 1915,
    discoveredBy: "Robert Innes",
    shortFact:
      "Our nearest stellar neighbor — a red dwarf hosting the nearest known exoplanet, Proxima b.",
    shaderPreset: {
      color1: "#8b0000",
      color2: "#ff4500",
      rotationSpeed: 0.08,
      cloudDensity: 2.0,
      glowIntensity: 1.5,
    },
    tags: ["red-dwarf", "nearest-star", "habitable-zone", "centaurus"],
  },
  {
    id: "vy-canis-majoris",
    name: "VY Canis Majoris",
    type: "star",
    distanceFromEarth: "3,900 light-years",
    discoveredYear: 1801,
    shortFact:
      "One of the largest known stars — light takes 8 hours to travel around its equator.",
    shaderPreset: {
      color1: "#6b0000",
      color2: "#cc2200",
      rotationSpeed: 0.03,
      cloudDensity: 4.0,
      glowIntensity: 2.8,
    },
    tags: ["hypergiant", "red-supergiant", "canis-major", "extreme"],
  },
  {
    id: "polaris",
    name: "Polaris",
    type: "star",
    distanceFromEarth: "433 light-years",
    shortFact:
      "The North Star is actually a triple star system, and will remain our pole star for another 26,000 years.",
    shaderPreset: {
      color1: "#fffde7",
      color2: "#fff9c4",
      rotationSpeed: 0.07,
      cloudDensity: 1.8,
      glowIntensity: 1.6,
    },
    tags: ["north-star", "triple-star", "ursa-minor", "navigation"],
  },
  {
    id: "alpha-centauri-a",
    name: "Alpha Centauri A",
    type: "star",
    distanceFromEarth: "4.37 light-years",
    shortFact:
      "Nearly identical to our Sun and our closest Sun-like neighbor — the most likely destination for humanity's first interstellar voyage.",
    shaderPreset: {
      color1: "#ff9900",
      color2: "#ffdd44",
      rotationSpeed: 0.09,
      cloudDensity: 2.0,
      glowIntensity: 1.8,
    },
    tags: ["binary", "centaurus", "sun-like", "nearest"],
  },
  {
    id: "rigel",
    name: "Rigel",
    type: "star",
    distanceFromEarth: "860 light-years",
    shortFact:
      "Orion's blue supergiant shines 120,000× brighter than the Sun — a future supernova visible in daylight.",
    shaderPreset: {
      color1: "#4488ff",
      color2: "#88ccff",
      rotationSpeed: 0.08,
      cloudDensity: 2.0,
      glowIntensity: 2.2,
    },
    tags: ["blue-supergiant", "orion", "will-supernova", "luminous"],
  },
  {
    id: "vega",
    name: "Vega",
    type: "star",
    distanceFromEarth: "25 light-years",
    shortFact:
      "Vega defined the magnitude scale for stellar brightness — and in 12,000 years it will become Earth's new North Star.",
    shaderPreset: {
      color1: "#ccddff",
      color2: "#ffffff",
      rotationSpeed: 0.12,
      cloudDensity: 1.5,
      glowIntensity: 1.8,
    },
    tags: ["lyra", "blue-white", "future-pole-star", "standard-candle"],
  },
  {
    id: "antares",
    name: "Antares",
    type: "star",
    distanceFromEarth: "550 light-years",
    shortFact:
      "The 'rival of Mars' is a red supergiant 700× the Sun's diameter — its outer envelope would extend past Mars' orbit.",
    shaderPreset: {
      color1: "#9b1a1a",
      color2: "#ee3300",
      rotationSpeed: 0.05,
      cloudDensity: 3.2,
      glowIntensity: 2.3,
    },
    tags: ["red-supergiant", "scorpius", "variable-star", "will-supernova"],
  },
  {
    id: "deneb",
    name: "Deneb",
    type: "star",
    distanceFromEarth: "2,600 light-years",
    shortFact:
      "Deneb may be 200,000× brighter than the Sun — its exact distance remains uncertain, making it the most luminous star in the Northern Cross.",
    shaderPreset: {
      color1: "#ddeeFF",
      color2: "#ffffff",
      rotationSpeed: 0.07,
      cloudDensity: 1.6,
      glowIntensity: 2.0,
    },
    tags: ["blue-white-supergiant", "cygnus", "luminous", "northern-cross"],
  },

  // === MOONS ===
  {
    id: "europa",
    name: "Europa",
    type: "moon",
    parentBody: "Jupiter",
    distanceFromEarth: "628 million km (avg)",
    discoveredYear: 1610,
    discoveredBy: "Galileo Galilei",
    shortFact:
      "A global subsurface ocean beneath its icy shell may hold more water than all Earth's oceans — and possibly life.",
    shaderPreset: {
      color1: "#a8dadc",
      color2: "#ffffff",
      rotationSpeed: 0.07,
      cloudDensity: 1.8,
      glowIntensity: 1.6,
    },
    tags: ["ocean-world", "habitable", "galilean-moon", "icy"],
  },
  {
    id: "ganymede",
    name: "Ganymede",
    type: "moon",
    parentBody: "Jupiter",
    distanceFromEarth: "628 million km (avg)",
    discoveredYear: 1610,
    discoveredBy: "Galileo Galilei",
    shortFact:
      "The largest moon in the Solar System — bigger than Mercury and the only moon with its own magnetic field.",
    shaderPreset: {
      color1: "#8b8878",
      color2: "#c4b9a0",
      rotationSpeed: 0.06,
      cloudDensity: 2.0,
      glowIntensity: 1.3,
    },
    tags: ["galilean-moon", "largest-moon", "magnetic-field", "subsurface-ocean"],
  },
  {
    id: "callisto",
    name: "Callisto",
    type: "moon",
    parentBody: "Jupiter",
    distanceFromEarth: "628 million km (avg)",
    discoveredYear: 1610,
    discoveredBy: "Galileo Galilei",
    shortFact:
      "The most heavily cratered body in the Solar System — its ancient surface has been unchanged for 4 billion years.",
    shaderPreset: {
      color1: "#4a4a5c",
      color2: "#8a8899",
      rotationSpeed: 0.05,
      cloudDensity: 1.5,
      glowIntensity: 1.0,
    },
    tags: ["galilean-moon", "cratered", "ancient", "dead-world"],
  },
  {
    id: "io",
    name: "Io",
    type: "moon",
    parentBody: "Jupiter",
    distanceFromEarth: "628 million km (avg)",
    discoveredYear: 1610,
    discoveredBy: "Galileo Galilei",
    shortFact:
      "The most volcanically active body in the Solar System — over 400 active volcanoes constantly resurface it.",
    shaderPreset: {
      color1: "#cc8800",
      color2: "#ffee00",
      rotationSpeed: 0.1,
      cloudDensity: 2.5,
      glowIntensity: 1.8,
    },
    tags: ["galilean-moon", "volcanic", "sulfur", "extreme"],
  },
  {
    id: "titan",
    name: "Titan",
    type: "moon",
    parentBody: "Saturn",
    distanceFromEarth: "1.2 billion km (avg)",
    discoveredYear: 1655,
    discoveredBy: "Christiaan Huygens",
    shortFact:
      "The only moon with a dense atmosphere — methane rains down, pools into lakes, and flows through river channels.",
    shaderPreset: {
      color1: "#cc8833",
      color2: "#ffcc66",
      rotationSpeed: 0.07,
      cloudDensity: 3.0,
      glowIntensity: 1.5,
    },
    tags: ["atmosphere", "methane-rain", "saturn", "habitable"],
  },
  {
    id: "enceladus",
    name: "Enceladus",
    type: "moon",
    parentBody: "Saturn",
    distanceFromEarth: "1.2 billion km (avg)",
    discoveredYear: 1789,
    discoveredBy: "William Herschel",
    shortFact:
      "Geysers of liquid water erupt from its south pole — Cassini flew through them and detected organic compounds.",
    shaderPreset: {
      color1: "#ccf0ff",
      color2: "#ffffff",
      rotationSpeed: 0.06,
      cloudDensity: 1.8,
      glowIntensity: 2.0,
    },
    tags: ["water-plumes", "ocean-world", "saturn", "life-candidate"],
  },
  {
    id: "triton",
    name: "Triton",
    type: "moon",
    parentBody: "Neptune",
    distanceFromEarth: "4.3 billion km (avg)",
    discoveredYear: 1846,
    discoveredBy: "William Lassell",
    shortFact:
      "Triton orbits Neptune backwards and is spiraling inward — in 3.6 billion years it will be torn apart into rings.",
    shaderPreset: {
      color1: "#ccddee",
      color2: "#99bbcc",
      rotationSpeed: 0.06,
      cloudDensity: 1.5,
      glowIntensity: 1.4,
    },
    tags: ["retrograde-orbit", "captured-moon", "neptune", "doomed"],
  },
  {
    id: "charon",
    name: "Charon",
    type: "moon",
    parentBody: "Pluto",
    distanceFromEarth: "5.9 billion km (avg)",
    discoveredYear: 1978,
    discoveredBy: "James Christy",
    shortFact:
      "So large relative to Pluto that both bodies orbit a point in space between them — a true binary dwarf system.",
    shaderPreset: {
      color1: "#886677",
      color2: "#aa9988",
      rotationSpeed: 0.05,
      cloudDensity: 1.8,
      glowIntensity: 1.1,
    },
    tags: ["binary", "pluto", "kuiper-belt", "new-horizons"],
  },
  {
    id: "phobos",
    name: "Phobos",
    type: "moon",
    parentBody: "Mars",
    distanceFromEarth: "225 million km (avg)",
    discoveredYear: 1877,
    discoveredBy: "Asaph Hall",
    shortFact:
      "Mars' inner moon orbits so fast (7.7 hours) it rises in the west and sets in the east — and is slowly falling.",
    shaderPreset: {
      color1: "#665544",
      color2: "#998877",
      rotationSpeed: 0.15,
      cloudDensity: 1.2,
      glowIntensity: 0.9,
    },
    tags: ["mars", "captured-asteroid", "fast-orbit", "stickney-crater"],
  },
  {
    id: "deimos",
    name: "Deimos",
    type: "moon",
    parentBody: "Mars",
    distanceFromEarth: "225 million km (avg)",
    discoveredYear: 1877,
    discoveredBy: "Asaph Hall",
    shortFact:
      "Mars' tiny outer moon is barely 12 km wide — from the Martian surface it looks like a faint bright star.",
    shaderPreset: {
      color1: "#776655",
      color2: "#998877",
      rotationSpeed: 0.06,
      cloudDensity: 1.0,
      glowIntensity: 0.8,
    },
    tags: ["mars", "smallest-moon", "captured-asteroid"],
  },
  {
    id: "miranda",
    name: "Miranda",
    type: "moon",
    parentBody: "Uranus",
    distanceFromEarth: "2.7 billion km (avg)",
    discoveredYear: 1948,
    discoveredBy: "Gerard Kuiper",
    shortFact:
      "Miranda has the tallest known cliffs in the Solar System — Verona Rupes rises 20 km from the valley floor.",
    shaderPreset: {
      color1: "#aabbcc",
      color2: "#ddeeff",
      rotationSpeed: 0.07,
      cloudDensity: 1.5,
      glowIntensity: 1.2,
    },
    tags: ["uranus", "cliffs", "extreme-terrain", "voyager-2"],
  },
  {
    id: "titania",
    name: "Titania",
    type: "moon",
    parentBody: "Uranus",
    distanceFromEarth: "2.7 billion km (avg)",
    discoveredYear: 1787,
    discoveredBy: "William Herschel",
    shortFact:
      "Uranus' largest moon has giant rift canyons hundreds of kilometers long — scars from ancient internal stretching.",
    shaderPreset: {
      color1: "#99aacc",
      color2: "#ccddf0",
      rotationSpeed: 0.06,
      cloudDensity: 1.6,
      glowIntensity: 1.1,
    },
    tags: ["uranus", "largest-uranian-moon", "rifts", "voyager-2"],
  },

  // === PLANETS ===
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    distanceFromEarth: "77–222 million km",
    shortFact:
      "A day on Mercury lasts longer than its year — 59 Earth days to rotate but only 88 days to orbit the Sun.",
    shaderPreset: {
      color1: "#888888",
      color2: "#ccbbaa",
      rotationSpeed: 0.04,
      cloudDensity: 1.2,
      glowIntensity: 1.0,
    },
    tags: ["inner-planet", "no-atmosphere", "extreme-temperatures", "smallest-planet"],
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    distanceFromEarth: "38–261 million km",
    shortFact:
      "The hottest planet despite not being closest to the Sun — its runaway CO₂ greenhouse locks in 465°C heat.",
    shaderPreset: {
      color1: "#cc9900",
      color2: "#ffee88",
      rotationSpeed: 0.03,
      cloudDensity: 3.5,
      glowIntensity: 1.8,
    },
    tags: ["inner-planet", "greenhouse-effect", "hottest", "retrograde-rotation"],
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    distanceFromEarth: "0 km",
    shortFact:
      "The only known harbor of life in the cosmos — a pale blue dot adrift in the indifferent vastness of space.",
    shaderPreset: {
      color1: "#0044aa",
      color2: "#22cc66",
      rotationSpeed: 0.08,
      cloudDensity: 2.2,
      glowIntensity: 1.5,
    },
    tags: ["life", "ocean-world", "blue-marble", "inner-planet"],
  },
  {
    id: "jupiter-planet",
    name: "Jupiter",
    type: "planet",
    distanceFromEarth: "588–968 million km",
    shortFact:
      "Jupiter's Great Red Spot is a storm that has raged for 350+ years and is wider than Earth.",
    shaderPreset: {
      color1: "#C88B3A",
      color2: "#E8D5B0",
      rotationSpeed: 0.06,
      cloudDensity: 3.0,
      glowIntensity: 1.5,
    },
    tags: ["gas-giant", "great-red-spot", "galilean-moons", "largest-planet"],
  },
  {
    id: "saturn-planet",
    name: "Saturn",
    type: "planet",
    distanceFromEarth: "1.2–1.67 billion km",
    shortFact:
      "Saturn's rings span 282,000 km yet are only 10–100 metres thick — a razor's edge of ice and rock.",
    shaderPreset: {
      color1: "#C4A45E",
      color2: "#F0E8C8",
      rotationSpeed: 0.05,
      cloudDensity: 2.5,
      glowIntensity: 1.3,
    },
    tags: ["rings", "gas-giant", "titan", "cassini"],
  },
  {
    id: "uranus-planet",
    name: "Uranus",
    type: "planet",
    distanceFromEarth: "2.57–3.15 billion km",
    discoveredYear: 1781,
    discoveredBy: "William Herschel",
    shortFact:
      "Uranus rolls on its side — its axis tilted 98° means its poles get more sunlight than its equator.",
    shaderPreset: {
      color1: "#66cccc",
      color2: "#aaeeff",
      rotationSpeed: 0.05,
      cloudDensity: 2.0,
      glowIntensity: 1.4,
    },
    tags: ["ice-giant", "tilted-axis", "methane-atmosphere", "voyager-2"],
  },
  {
    id: "neptune-planet",
    name: "Neptune",
    type: "planet",
    distanceFromEarth: "4.3–4.7 billion km",
    discoveredYear: 1846,
    discoveredBy: "Adams & Le Verrier",
    shortFact:
      "Neptune hosts the fastest winds in the Solar System — 2,100 km/h, despite being the farthest planet.",
    shaderPreset: {
      color1: "#003380",
      color2: "#3366cc",
      rotationSpeed: 0.06,
      cloudDensity: 2.5,
      glowIntensity: 1.6,
    },
    tags: ["ice-giant", "great-dark-spot", "triton", "predicted-discovery"],
  },
  {
    id: "pluto",
    name: "Pluto",
    type: "dwarf-planet",
    distanceFromEarth: "5.9 billion km (avg)",
    discoveredYear: 1930,
    discoveredBy: "Clyde Tombaugh",
    shortFact:
      "Once the ninth planet, Pluto hides water-ice mountains and Tombaugh Regio — a heart-shaped nitrogen glacier.",
    shaderPreset: {
      color1: "#aa8866",
      color2: "#ddccaa",
      rotationSpeed: 0.04,
      cloudDensity: 1.8,
      glowIntensity: 1.0,
    },
    tags: ["dwarf-planet", "kuiper-belt", "new-horizons", "demoted"],
  },

  // === DWARF PLANETS ===
  {
    id: "eris",
    name: "Eris",
    type: "dwarf-planet",
    distanceFromEarth: "14.6 billion km (avg)",
    discoveredYear: 2005,
    discoveredBy: "Mike Brown",
    shortFact:
      "Discovery of this Pluto-sized world in 2005 triggered the great planet debate that demoted Pluto.",
    shaderPreset: {
      color1: "#ccddee",
      color2: "#eef0ff",
      rotationSpeed: 0.03,
      cloudDensity: 1.5,
      glowIntensity: 1.0,
    },
    tags: ["dwarf-planet", "scattered-disk", "pluto-rival", "dysnomia"],
  },
  {
    id: "makemake",
    name: "Makemake",
    type: "dwarf-planet",
    distanceFromEarth: "6.8 billion km (avg)",
    discoveredYear: 2005,
    discoveredBy: "Mike Brown",
    shortFact:
      "Named after the Rapa Nui god of humanity — one of the brightest Kuiper Belt objects with no detectable atmosphere.",
    shaderPreset: {
      color1: "#cc8833",
      color2: "#ffaa55",
      rotationSpeed: 0.04,
      cloudDensity: 1.6,
      glowIntensity: 0.9,
    },
    tags: ["dwarf-planet", "kuiper-belt", "rapa-nui", "bright"],
  },
  {
    id: "haumea",
    name: "Haumea",
    type: "dwarf-planet",
    distanceFromEarth: "6.4 billion km (avg)",
    discoveredYear: 2004,
    discoveredBy: "Mike Brown",
    shortFact:
      "Haumea spins so fast (one rotation every 4 hours) that centrifugal force has squashed it into a rugby-ball shape.",
    shaderPreset: {
      color1: "#eeeebb",
      color2: "#ffffff",
      rotationSpeed: 0.2,
      cloudDensity: 1.4,
      glowIntensity: 0.9,
    },
    tags: ["dwarf-planet", "fast-rotation", "elongated", "rings"],
  },
  {
    id: "ceres",
    name: "Ceres",
    type: "dwarf-planet",
    distanceFromEarth: "263–413 million km",
    discoveredYear: 1801,
    discoveredBy: "Giuseppe Piazzi",
    shortFact:
      "The largest object in the asteroid belt may contain more fresh water than all of Earth's oceans.",
    shaderPreset: {
      color1: "#8899aa",
      color2: "#bbccdd",
      rotationSpeed: 0.09,
      cloudDensity: 1.5,
      glowIntensity: 1.1,
    },
    tags: ["dwarf-planet", "asteroid-belt", "dawn-mission", "ice-water"],
  },

  // === NEBULAE ===
  {
    id: "orion-nebula",
    name: "Orion Nebula",
    type: "nebula",
    distanceFromEarth: "1,344 light-years",
    shortFact:
      "A stellar nursery visible to the naked eye — over 3,000 stars are forming inside it right now.",
    shaderPreset: {
      color1: "#ff7744",
      color2: "#ffcc55",
      rotationSpeed: 0.04,
      cloudDensity: 4.0,
      glowIntensity: 2.0,
    },
    tags: ["stellar-nursery", "emission-nebula", "orion", "naked-eye"],
  },
  {
    id: "crab-nebula",
    name: "Crab Nebula",
    type: "nebula",
    distanceFromEarth: "6,500 light-years",
    discoveredYear: 1054,
    shortFact:
      "Remnant of a supernova witnessed by Chinese astronomers in 1054 AD — its pulsar still spins 30 times per second.",
    shaderPreset: {
      color1: "#cc4444",
      color2: "#ff9955",
      rotationSpeed: 0.06,
      cloudDensity: 3.5,
      glowIntensity: 2.2,
    },
    tags: ["supernova-remnant", "pulsar", "taurus", "1054-ad"],
  },
  {
    id: "eagle-nebula",
    name: "Eagle Nebula",
    type: "nebula",
    distanceFromEarth: "7,000 light-years",
    discoveredYear: 1745,
    discoveredBy: "Philippe Loys de Chéseaux",
    shortFact:
      "Home to the Pillars of Creation — towering columns of dust sculpted by radiation from newborn stars.",
    shaderPreset: {
      color1: "#448844",
      color2: "#88cc66",
      rotationSpeed: 0.04,
      cloudDensity: 4.5,
      glowIntensity: 1.8,
    },
    tags: ["pillars-of-creation", "stellar-nursery", "serpens", "emission"],
  },
  {
    id: "helix-nebula",
    name: "Helix Nebula",
    type: "nebula",
    distanceFromEarth: "650 light-years",
    discoveredYear: 1824,
    discoveredBy: "Karl Ludwig Harding",
    shortFact:
      "The closest planetary nebula to Earth — nicknamed the 'Eye of God', it's a dying Sun-like star's last gasp.",
    shaderPreset: {
      color1: "#0088bb",
      color2: "#00ddff",
      rotationSpeed: 0.05,
      cloudDensity: 2.8,
      glowIntensity: 2.0,
    },
    tags: ["planetary-nebula", "aquarius", "eye-of-god", "dying-star"],
  },
  {
    id: "pillars-of-creation",
    name: "Pillars of Creation",
    type: "nebula",
    distanceFromEarth: "6,500 light-years",
    discoveredYear: 1995,
    discoveredBy: "Hubble Space Telescope",
    shortFact:
      "These iconic 5-light-year-tall dust columns are stellar nurseries — and are slowly being eroded by radiation.",
    shaderPreset: {
      color1: "#664422",
      color2: "#aa7755",
      rotationSpeed: 0.03,
      cloudDensity: 5.0,
      glowIntensity: 1.5,
    },
    tags: ["eagle-nebula", "stellar-nursery", "iconic", "hubble"],
  },
  {
    id: "carina-nebula",
    name: "Carina Nebula",
    type: "nebula",
    distanceFromEarth: "7,500 light-years",
    discoveredYear: 1752,
    discoveredBy: "Nicolas-Louis de Lacaille",
    shortFact:
      "One of the largest nebulae — 300× bigger than Orion, home to Eta Carinae which may explode at any time.",
    shaderPreset: {
      color1: "#ff5533",
      color2: "#ffaa44",
      rotationSpeed: 0.04,
      cloudDensity: 4.5,
      glowIntensity: 2.2,
    },
    tags: ["emission-nebula", "eta-carinae", "jwst", "massive"],
  },
  {
    id: "butterfly-nebula",
    name: "Butterfly Nebula",
    type: "nebula",
    distanceFromEarth: "3,800 light-years",
    discoveredYear: 1917,
    discoveredBy: "Williamina Fleming",
    shortFact:
      "Gas expelled by a dying star at 950,000 km/h forms two-light-year wings — as hot as the Sun's core.",
    shaderPreset: {
      color1: "#6644cc",
      color2: "#aa88ff",
      rotationSpeed: 0.06,
      cloudDensity: 3.5,
      glowIntensity: 2.0,
    },
    tags: ["planetary-nebula", "scorpius", "bipolar", "dying-star"],
  },

  // === GALAXIES ===
  {
    id: "andromeda-galaxy",
    name: "Andromeda Galaxy",
    type: "galaxy",
    distanceFromEarth: "2.537 million light-years",
    discoveredYear: 964,
    discoveredBy: "Abd al-Rahman al-Sufi",
    shortFact:
      "Our nearest large galactic neighbor is on a collision course with the Milky Way — the merger begins in 4.5 billion years.",
    shaderPreset: {
      color1: "#3a86ff",
      color2: "#8338ec",
      rotationSpeed: 0.03,
      cloudDensity: 3.5,
      glowIntensity: 1.5,
    },
    tags: ["local-group", "spiral", "collision-course", "naked-eye"],
  },
  {
    id: "triangulum-galaxy",
    name: "Triangulum Galaxy",
    type: "galaxy",
    distanceFromEarth: "2.73 million light-years",
    discoveredYear: 1654,
    discoveredBy: "Giovanni Battista Hodierna",
    shortFact:
      "The third-largest member of the Local Group — barely visible to the naked eye under perfectly dark skies.",
    shaderPreset: {
      color1: "#4466ff",
      color2: "#6699ff",
      rotationSpeed: 0.04,
      cloudDensity: 3.0,
      glowIntensity: 1.4,
    },
    tags: ["local-group", "spiral", "m33", "faint"],
  },
  {
    id: "whirlpool-galaxy",
    name: "Whirlpool Galaxy",
    type: "galaxy",
    distanceFromEarth: "23 million light-years",
    discoveredYear: 1773,
    discoveredBy: "Charles Messier",
    shortFact:
      "The first galaxy identified as a spiral — it's currently in the process of absorbing a smaller companion galaxy.",
    shaderPreset: {
      color1: "#0066aa",
      color2: "#4499cc",
      rotationSpeed: 0.04,
      cloudDensity: 3.5,
      glowIntensity: 1.6,
    },
    tags: ["spiral", "interaction", "canes-venatici", "m51"],
  },
  {
    id: "sombrero-galaxy",
    name: "Sombrero Galaxy",
    type: "galaxy",
    distanceFromEarth: "29.35 million light-years",
    discoveredYear: 1781,
    discoveredBy: "Pierre Méchain",
    shortFact:
      "Its dark dust lane and bulging nucleus give it a perfect sombrero profile — the central black hole is 1 billion solar masses.",
    shaderPreset: {
      color1: "#cc9933",
      color2: "#ffcc66",
      rotationSpeed: 0.03,
      cloudDensity: 2.5,
      glowIntensity: 1.5,
    },
    tags: ["lenticular", "virgo", "m104", "massive-black-hole"],
  },
  {
    id: "centaurus-a",
    name: "Centaurus A",
    type: "galaxy",
    distanceFromEarth: "13.7 million light-years",
    discoveredYear: 1826,
    discoveredBy: "James Dunlop",
    shortFact:
      "The closest radio galaxy to Earth — its central black hole fires relativistic jets visible across the full electromagnetic spectrum.",
    shaderPreset: {
      color1: "#664400",
      color2: "#cc8833",
      rotationSpeed: 0.04,
      cloudDensity: 3.0,
      glowIntensity: 1.8,
    },
    tags: ["radio-galaxy", "active-nucleus", "centaurus", "jets"],
  },
  {
    id: "cigar-galaxy",
    name: "Cigar Galaxy",
    type: "galaxy",
    distanceFromEarth: "11.7 million light-years",
    discoveredYear: 1774,
    discoveredBy: "Johann Elert Bode",
    shortFact:
      "A starburst galaxy forming stars 10× faster than the Milky Way — superwind blows glowing gas thousands of light-years out.",
    shaderPreset: {
      color1: "#cc4400",
      color2: "#ff8833",
      rotationSpeed: 0.05,
      cloudDensity: 3.5,
      glowIntensity: 2.0,
    },
    tags: ["starburst", "irregular", "m82", "ursa-major"],
  },

  // === ASTEROIDS & COMETS ===
  {
    id: "vesta",
    name: "Vesta",
    type: "asteroid",
    distanceFromEarth: "177–550 million km",
    discoveredYear: 1807,
    discoveredBy: "Heinrich Wilhelm Olbers",
    shortFact:
      "Dawn's exploration revealed Vesta has a canyon three times the depth of the Grand Canyon circling its equator.",
    shaderPreset: {
      color1: "#886655",
      color2: "#bbaa88",
      rotationSpeed: 0.12,
      cloudDensity: 1.5,
      glowIntensity: 1.0,
    },
    tags: ["asteroid-belt", "dawn-mission", "protoplanet", "rheasilvia"],
  },
  {
    id: "psyche",
    name: "16 Psyche",
    type: "asteroid",
    distanceFromEarth: "186–557 million km",
    discoveredYear: 1852,
    discoveredBy: "Annibale de Gasparis",
    shortFact:
      "Psyche may be the exposed metallic core of an ancient protoplanet — NASA's Psyche spacecraft launched toward it in 2023.",
    shaderPreset: {
      color1: "#556677",
      color2: "#8899aa",
      rotationSpeed: 0.1,
      cloudDensity: 1.3,
      glowIntensity: 1.1,
    },
    tags: ["metallic-asteroid", "nasa-mission", "core-world", "asteroid-belt"],
  },
  {
    id: "halleys-comet",
    name: "Halley's Comet",
    type: "comet",
    distanceFromEarth: "0.6–35 AU (varies)",
    shortFact:
      "The most famous comet returns every 75–76 years — records of its appearance stretch back to 240 BC.",
    shaderPreset: {
      color1: "#aabbcc",
      color2: "#eef8ff",
      rotationSpeed: 0.08,
      cloudDensity: 2.5,
      glowIntensity: 1.8,
    },
    tags: ["periodic-comet", "short-period", "giotto-mission", "1p-halley"],
  },
  {
    id: "oumuamua",
    name: "'Oumuamua",
    type: "comet",
    distanceFromEarth: "Departed Solar System",
    discoveredYear: 2017,
    discoveredBy: "Robert Weryk",
    shortFact:
      "The first interstellar object detected passing through our Solar System — its cigar shape and odd acceleration remain a mystery.",
    shaderPreset: {
      color1: "#cc6644",
      color2: "#ff9966",
      rotationSpeed: 0.18,
      cloudDensity: 1.5,
      glowIntensity: 1.5,
    },
    tags: ["interstellar", "mystery", "elongated", "alien-hypothesis"],
  },
  {
    id: "bennu",
    name: "Bennu",
    type: "asteroid",
    distanceFromEarth: "100–321 million km",
    discoveredYear: 1999,
    discoveredBy: "LINEAR survey",
    shortFact:
      "A 500 m rubble-pile asteroid with a 1-in-2,700 chance of impacting Earth in 2182 — OSIRIS-REx returned samples in 2023.",
    shaderPreset: {
      color1: "#443322",
      color2: "#776655",
      rotationSpeed: 0.11,
      cloudDensity: 1.5,
      glowIntensity: 1.0,
    },
    tags: ["near-earth", "osiris-rex", "sample-return", "impact-risk"],
  },

  // === EXOPLANETS ===
  {
    id: "kepler-22b",
    name: "Kepler-22b",
    type: "exoplanet",
    parentBody: "Kepler-22",
    distanceFromEarth: "620 light-years",
    discoveredYear: 2011,
    discoveredBy: "NASA Kepler Mission",
    shortFact:
      "The first confirmed exoplanet in a Sun-like star's habitable zone — 2.4× Earth's radius, possibly an ocean world.",
    shaderPreset: {
      color1: "#2266aa",
      color2: "#55aadd",
      rotationSpeed: 0.07,
      cloudDensity: 2.5,
      glowIntensity: 1.5,
    },
    tags: ["habitable-zone", "kepler", "super-earth", "ocean-world"],
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1e",
    type: "exoplanet",
    parentBody: "TRAPPIST-1",
    distanceFromEarth: "39 light-years",
    discoveredYear: 2017,
    discoveredBy: "Michaël Gillon",
    shortFact:
      "One of seven Earth-sized planets around an ultracool red dwarf — sits squarely in the habitable zone and is a prime JWST target.",
    shaderPreset: {
      color1: "#aa3311",
      color2: "#cc6644",
      rotationSpeed: 0.08,
      cloudDensity: 2.0,
      glowIntensity: 1.6,
    },
    tags: ["habitable-zone", "red-dwarf", "earth-sized", "jwst-target"],
  },
  {
    id: "51-pegasi-b",
    name: "51 Pegasi b",
    type: "exoplanet",
    parentBody: "51 Pegasi",
    distanceFromEarth: "50.9 light-years",
    discoveredYear: 1995,
    discoveredBy: "Mayor & Queloz",
    shortFact:
      "The first exoplanet found around a Sun-like star — a 'hot Jupiter' that rewrote planetary formation theory and won the 2019 Nobel Prize.",
    shaderPreset: {
      color1: "#dd8833",
      color2: "#ff9911",
      rotationSpeed: 0.12,
      cloudDensity: 3.0,
      glowIntensity: 2.0,
    },
    tags: ["hot-jupiter", "first-detection", "pegasus", "nobel-prize-2019"],
  },
  {
    id: "hd-209458b",
    name: "HD 209458 b",
    type: "exoplanet",
    parentBody: "HD 209458",
    distanceFromEarth: "159 light-years",
    discoveredYear: 1999,
    shortFact:
      "The first exoplanet with a detected atmosphere — nicknamed 'Osiris' for its evaporating hydrogen tail streaming into space.",
    shaderPreset: {
      color1: "#ee6622",
      color2: "#ff8844",
      rotationSpeed: 0.1,
      cloudDensity: 2.5,
      glowIntensity: 2.0,
    },
    tags: ["hot-jupiter", "osiris", "atmosphere", "transiting"],
  },
  {
    id: "proxima-b",
    name: "Proxima b",
    type: "exoplanet",
    parentBody: "Proxima Centauri",
    distanceFromEarth: "4.24 light-years",
    discoveredYear: 2016,
    discoveredBy: "Guillem Anglada-Escudé",
    shortFact:
      "The nearest exoplanet to Earth — in the habitable zone of our closest stellar neighbor, 4.24 light-years away.",
    shaderPreset: {
      color1: "#993333",
      color2: "#cc5544",
      rotationSpeed: 0.07,
      cloudDensity: 2.2,
      glowIntensity: 1.5,
    },
    tags: ["habitable-zone", "nearest-exoplanet", "red-dwarf", "tidal-locking"],
  },

  // === SPACECRAFT ===
  {
    id: "voyager-1",
    name: "Voyager 1",
    type: "spacecraft",
    distanceFromEarth: "23.9 billion km (and counting)",
    discoveredYear: 1977,
    discoveredBy: "NASA",
    shortFact:
      "The most distant human-made object — now in interstellar space, transmitting data on a power supply losing 4W per year.",
    shaderPreset: {
      color1: "#223344",
      color2: "#4466aa",
      rotationSpeed: 0.06,
      cloudDensity: 1.5,
      glowIntensity: 1.2,
    },
    tags: ["interstellar", "most-distant", "nasa", "golden-record"],
  },
  {
    id: "voyager-2",
    name: "Voyager 2",
    type: "spacecraft",
    distanceFromEarth: "19.9 billion km (and counting)",
    discoveredYear: 1977,
    discoveredBy: "NASA",
    shortFact:
      "The only spacecraft to visit all four outer planets — its 1989 Neptune flyby revealed Triton's geysers.",
    shaderPreset: {
      color1: "#334455",
      color2: "#5577aa",
      rotationSpeed: 0.06,
      cloudDensity: 1.5,
      glowIntensity: 1.2,
    },
    tags: ["interstellar", "grand-tour", "ice-giants", "golden-record"],
  },
  {
    id: "james-webb",
    name: "James Webb Space Telescope",
    type: "spacecraft",
    distanceFromEarth: "1.5 million km (L2 orbit)",
    discoveredYear: 2021,
    discoveredBy: "NASA/ESA/CSA",
    shortFact:
      "The most powerful space telescope ever built — its infrared eyes see the first galaxies formed 13.6 billion years ago.",
    shaderPreset: {
      color1: "#cc9900",
      color2: "#ffee44",
      rotationSpeed: 0.05,
      cloudDensity: 1.8,
      glowIntensity: 1.8,
    },
    tags: ["infrared", "deep-field", "exoplanet-atmospheres", "first-light"],
  },
  {
    id: "hubble",
    name: "Hubble Space Telescope",
    type: "spacecraft",
    distanceFromEarth: "547 km (low Earth orbit)",
    discoveredYear: 1990,
    discoveredBy: "NASA/ESA",
    shortFact:
      "30+ years of discoveries: the universe's expansion rate, dark energy evidence, deep field views of the earliest galaxies.",
    shaderPreset: {
      color1: "#334466",
      color2: "#5588bb",
      rotationSpeed: 0.08,
      cloudDensity: 1.5,
      glowIntensity: 1.4,
    },
    tags: ["optical", "deep-field", "dark-energy", "servicing-missions"],
  },
  {
    id: "perseverance",
    name: "Perseverance",
    type: "spacecraft",
    distanceFromEarth: "225 million km (Mars)",
    discoveredYear: 2020,
    discoveredBy: "NASA",
    shortFact:
      "Searching Jezero Crater for ancient microbial biosignatures and caching rocks for humanity's first Mars sample return.",
    shaderPreset: {
      color1: "#aa5533",
      color2: "#cc7755",
      rotationSpeed: 0.05,
      cloudDensity: 1.5,
      glowIntensity: 1.1,
    },
    tags: ["mars-rover", "astrobiology", "sample-return", "ingenuity-helicopter"],
  },
  {
    id: "new-horizons",
    name: "New Horizons",
    type: "spacecraft",
    distanceFromEarth: "7.6 billion km",
    discoveredYear: 2006,
    discoveredBy: "NASA",
    shortFact:
      "The first spacecraft to visit Pluto — its 2015 flyby revealed an unexpectedly complex world with nitrogen glaciers.",
    shaderPreset: {
      color1: "#556677",
      color2: "#8899bb",
      rotationSpeed: 0.07,
      cloudDensity: 1.5,
      glowIntensity: 1.2,
    },
    tags: ["kuiper-belt", "pluto-flyby", "arrokoth", "fastest-spacecraft"],
  },
  {
    id: "cassini",
    name: "Cassini",
    type: "spacecraft",
    distanceFromEarth: "Retired (Saturn, 2017)",
    discoveredYear: 1997,
    discoveredBy: "NASA/ESA/ASI",
    shortFact:
      "Spent 13 years orbiting Saturn — discovered Enceladus' geysers, Titan's methane seas, and Saturn's hexagonal polar storm.",
    shaderPreset: {
      color1: "#998866",
      color2: "#ccbb88",
      rotationSpeed: 0.05,
      cloudDensity: 2.0,
      glowIntensity: 1.3,
    },
    tags: ["saturn-orbiter", "enceladus", "titan", "grand-finale"],
  },
];

export function getCatalogObjectById(id: string): CatalogObject | undefined {
  return catalogObjects.find((o) => o.id === id);
}

export function getCatalogObjectsByType(type: CatalogObjectType): CatalogObject[] {
  return catalogObjects.filter((o) => o.type === type);
}

export function getCatalogObjectsByParent(parentBody: string): CatalogObject[] {
  return catalogObjects.filter(
    (o) => o.parentBody?.toLowerCase() === parentBody.toLowerCase()
  );
}

export const ALL_CATALOG_IDS = catalogObjects.map((o) => o.id);
export const ALL_CATALOG_NAMES = catalogObjects.map((o) => ({
  id: o.id,
  name: o.name,
  type: o.type,
  parentBody: o.parentBody,
}));

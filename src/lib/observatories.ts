export interface Observatory {
  id: string;
  name: string;
  shortName: string;
  longitude: number;
  latitude: number;
  altitude: number;
  agency: string;
  country: string;
  founded: number;
  status: "active" | "decommissioned" | "space";
  description: string;
  color: string;
}

export const observatories: Observatory[] = [
  {
    id: "mauna-kea",
    name: "Mauna Kea Observatory",
    shortName: "Mauna Kea",
    longitude: -155.4681,
    latitude: 19.8207,
    altitude: 4205,
    agency: "Multiple (UH, NASA, ESA)",
    country: "Hawaii, USA",
    founded: 1970,
    status: "active",
    description: "World's premier observatory site — 13 telescopes including Keck, Subaru, and IRTF at 4,205m elevation.",
    color: "#64ffda",
  },
  {
    id: "alma",
    name: "Atacama Large Millimeter Array",
    shortName: "ALMA",
    longitude: -67.7558,
    latitude: -23.0193,
    altitude: 5058,
    agency: "ESO / NRAO / NAOJ",
    country: "Chile",
    founded: 2011,
    status: "active",
    description: "Array of 66 high-precision antennas at 5,000m in the Atacama Desert — studies cold universe, star formation, galaxy evolution.",
    color: "#64ffda",
  },
  {
    id: "ligo-hanford",
    name: "LIGO Hanford Observatory",
    shortName: "LIGO Hanford",
    longitude: -119.4079,
    latitude: 46.4551,
    altitude: 142,
    agency: "NSF / Caltech / MIT",
    country: "Washington, USA",
    founded: 2002,
    status: "active",
    description: "4km L-shaped interferometer detecting gravitational wave strain as small as 10⁻²¹. First detected GW150914 in 2015.",
    color: "#7b2fff",
  },
  {
    id: "ligo-livingston",
    name: "LIGO Livingston Observatory",
    shortName: "LIGO Livingston",
    longitude: -90.7742,
    latitude: 30.5631,
    altitude: 7,
    agency: "NSF / Caltech / MIT",
    country: "Louisiana, USA",
    founded: 2002,
    status: "active",
    description: "Twin to LIGO Hanford — simultaneous detection in both allows ruling out local noise and triangulating source location.",
    color: "#7b2fff",
  },
  {
    id: "parkes",
    name: "Parkes Observatory",
    shortName: "Parkes",
    longitude: 148.2635,
    latitude: -32.9988,
    altitude: 414,
    agency: "CSIRO",
    country: "Australia",
    founded: 1961,
    status: "active",
    description: "64m radio dish — played key role in Apollo 11 Moon landing relay, discovered first pulsar population, hunts Fast Radio Bursts.",
    color: "#fbbf24",
  },
  {
    id: "vlt",
    name: "Very Large Telescope",
    shortName: "VLT",
    longitude: -70.4045,
    latitude: -24.6272,
    altitude: 2635,
    agency: "ESO",
    country: "Chile",
    founded: 1998,
    status: "active",
    description: "Four 8.2m Unit Telescopes on Cerro Paranal — can combine as one 16m interferometer. Pioneered direct exoplanet imaging.",
    color: "#60a5fa",
  },
  {
    id: "arecibo",
    name: "Arecibo Observatory",
    shortName: "Arecibo",
    longitude: -66.7527,
    latitude: 18.3444,
    altitude: 497,
    agency: "NSF / University of Central Florida",
    country: "Puerto Rico",
    founded: 1963,
    status: "decommissioned",
    description: "305m spherical dish — once the world's largest. Discovered binary pulsars (Nobel 1993), sent Arecibo Message (1974). Collapsed 2020.",
    color: "#f87171",
  },
  {
    id: "jwst",
    name: "James Webb Space Telescope",
    shortName: "JWST",
    longitude: 0,
    latitude: 0,
    altitude: 1500000,
    agency: "NASA / ESA / CSA",
    country: "L2 Lagrange Point",
    founded: 2022,
    status: "space",
    description: "6.5m gold-segmented mirror at L2 orbit — images first galaxies, exoplanet atmospheres, stellar nurseries in infrared with unprecedented clarity.",
    color: "#c084fc",
  },
];

export function getObservatoryById(id: string): Observatory | undefined {
  return observatories.find((o) => o.id === id);
}

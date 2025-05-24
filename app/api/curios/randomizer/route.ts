import { NextResponse } from "next/server"

const factTemplates = [
  {
    category: "biology",
    templates: [
      "The {animal} has {number} {body_part}s, which {function}.",
      "{animal}s can {ability} for up to {number} {time_unit}s.",
      "A {animal}'s {body_part} is {comparison} than a {comparison_object}.",
      "Scientists discovered that {animal}s {behavior} when {condition}.",
    ],
  },
  {
    category: "physics",
    templates: [
      "At the quantum level, {particle}s can {quantum_behavior} simultaneously.",
      "The speed of {phenomenon} is {number} times {comparison}.",
      "{material} exhibits {property} when exposed to {condition}.",
      "Einstein's theory predicts that {phenomenon} would {effect} under {condition}.",
    ],
  },
  {
    category: "space",
    templates: [
      "A {celestial_body} in {location} is {number} times {comparison} than Earth.",
      "Scientists have detected {phenomenon} coming from {location}.",
      "The {celestial_body} {behavior} every {number} {time_unit}s.",
      "If you could {action} on {celestial_body}, you would {experience}.",
    ],
  },
  {
    category: "technology",
    templates: [
      "Modern {device}s contain more {component}s than {comparison}.",
      "The first {technology} was invented in {year} and could {capability}.",
      "{technology} works by {mechanism} at {scale} level.",
      "Future {technology} could {capability} within the next {number} years.",
    ],
  },
]

const wordLists = {
  animal: [
    "octopus",
    "dolphin",
    "elephant",
    "hummingbird",
    "shark",
    "butterfly",
    "spider",
    "whale",
    "penguin",
    "chameleon",
  ],
  body_part: ["heart", "brain", "eye", "tentacle", "wing", "fin", "leg", "antenna", "tail", "tongue"],
  function: [
    "pumps blood to different organs",
    "processes information faster than computers",
    "can see ultraviolet light",
    "changes color for camouflage",
    "generates electricity",
  ],
  ability: [
    "hold their breath",
    "navigate using magnetic fields",
    "communicate across vast distances",
    "regenerate lost limbs",
    "see in complete darkness",
  ],
  time_unit: ["minute", "hour", "day", "week", "month", "year"],
  comparison_object: ["human brain", "supercomputer", "city block", "football field", "mountain"],
  particle: ["electron", "photon", "neutrino", "quark", "boson"],
  quantum_behavior: [
    "exist in multiple states",
    "tunnel through barriers",
    "become entangled",
    "exhibit wave-particle duality",
  ],
  phenomenon: ["light", "sound", "gravity", "magnetism", "electricity"],
  material: ["graphene", "diamond", "superconductor", "metamaterial", "liquid crystal"],
  property: [
    "becomes invisible",
    "conducts electricity perfectly",
    "changes shape",
    "levitates",
    "becomes superstrong",
  ],
  condition: ["extreme cold", "intense pressure", "magnetic fields", "laser light", "zero gravity"],
  celestial_body: ["neutron star", "black hole", "exoplanet", "asteroid", "comet", "galaxy"],
  location: [
    "the Andromeda galaxy",
    "the Orion nebula",
    "a distant solar system",
    "the edge of the observable universe",
  ],
  behavior: ["rotates", "orbits", "emits radiation", "collapses", "explodes"],
  device: ["smartphone", "computer", "satellite", "robot", "sensor"],
  component: ["transistor", "circuit", "processor", "memory chip", "sensor"],
  technology: ["artificial intelligence", "quantum computer", "3D printer", "neural implant", "fusion reactor"],
  mechanism: [
    "manipulating quantum states",
    "processing neural signals",
    "assembling molecules",
    "harnessing fusion reactions",
  ],
  scale: ["atomic", "molecular", "cellular", "quantum", "nanoscale"],
  capability: [
    "think like humans",
    "teleport information",
    "create any object",
    "read thoughts",
    "provide unlimited energy",
  ],
  year: ["1947", "1969", "1981", "1995", "2003", "2012"],
  action: ["walk", "jump", "breathe", "swim", "fly"],
  experience: [
    "weigh 10 times less",
    "see colors that don't exist on Earth",
    "experience time differently",
    "float effortlessly",
  ],
}

function getRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomNumber(): string {
  const ranges = [
    () => Math.floor(Math.random() * 10) + 1, // 1-10
    () => Math.floor(Math.random() * 90) + 10, // 10-99
    () => Math.floor(Math.random() * 900) + 100, // 100-999
    () => (Math.random() * 10).toFixed(1), // 0.1-9.9
  ]

  const generator = getRandomFromArray(ranges)
  return generator().toString()
}

function fillTemplate(template: string): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (key === "number") {
      return generateRandomNumber()
    }

    if (wordLists[key as keyof typeof wordLists]) {
      return getRandomFromArray(wordLists[key as keyof typeof wordLists])
    }

    return match // Return original if no replacement found
  })
}

function generateRandomFact() {
  const category = getRandomFromArray(factTemplates)
  const template = getRandomFromArray(category.templates)
  const title = fillTemplate(template)

  // Generate a more detailed summary
  const summaryTemplates = [
    "This fascinating discovery was made through years of careful observation and scientific research.",
    "Recent studies have confirmed this remarkable phenomenon using advanced scientific instruments.",
    "Scientists continue to study this incredible aspect of nature to better understand its implications.",
    "This discovery has opened up new avenues for research and potential practical applications.",
    "The mechanisms behind this phenomenon are still being investigated by researchers worldwide.",
    "This finding challenges our previous understanding and suggests new possibilities for science.",
    "Advanced technology has allowed scientists to observe and measure this phenomenon with unprecedented precision.",
    "This discovery represents a significant breakthrough in our understanding of the natural world.",
  ]

  const tags = {
    biology: ["biology", "life sciences", "evolution", "anatomy", "zoology"],
    physics: ["physics", "quantum mechanics", "relativity", "particle physics", "energy"],
    space: ["astronomy", "space", "cosmology", "astrophysics", "planetary science"],
    technology: ["technology", "innovation", "engineering", "computer science", "future tech"],
  }

  return {
    id: `random_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    summary: getRandomFromArray(summaryTemplates),
    source: getRandomFromArray(["Wikipedia", "Nature", "Science", "Scientific American", "National Geographic"]),
    tags: getRandomFromArray(Object.values(tags)),
    type: "wikipedia" as const,
    readingTime: Math.floor(Math.random() * 8) + 2, // 2-9 minutes
    difficulty: getRandomFromArray(["beginner", "intermediate", "advanced"] as const),
    publishedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last year
  }
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200))

    const curio = generateRandomFact()

    return NextResponse.json({
      curio,
      generated: true,
    })
  } catch (error) {
    console.error("Error generating random curio:", error)
    return NextResponse.json({ error: "Failed to generate random curio" }, { status: 500 })
  }
}

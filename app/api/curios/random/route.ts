import { NextResponse } from "next/server"

// Random data generators
const topics = [
  "Quantum Entanglement",
  "Neural Plasticity",
  "Dark Matter",
  "CRISPR Gene Editing",
  "Blockchain Technology",
  "Artificial Consciousness",
  "Biomimicry",
  "Nanotechnology",
  "Epigenetics",
  "Fusion Energy",
  "Mycorrhizal Networks",
  "Quantum Computing",
  "Synthetic Biology",
  "Space Elevators",
  "Brain-Computer Interfaces",
  "Metamaterials",
  "Photosynthesis Efficiency",
  "Gravitational Waves",
  "Cellular Reprogramming",
  "Swarm Intelligence",
  "Neuromorphic Computing",
  "Optogenetics",
  "Quantum Cryptography",
  "Bioprinting",
  "Atmospheric Processors",
  "Magnetic Levitation",
  "Holographic Data Storage",
  "Synthetic Spider Silk",
  "Molecular Machines",
  "Plasma Physics",
  "Cognitive Enhancement",
  "Robotic Surgery",
  "Smart Materials",
  "Biofuels",
  "Quantum Sensors",
  "Regenerative Medicine",
  "Artificial Photosynthesis",
  "Space Mining",
  "Neural Networks",
  "Gene Therapy",
]

const sources = ["Wikipedia", "arXiv", "Nature", "Science", "MIT Technology Review", "New Scientist"]
const types = ["wikipedia", "arxiv", "news", "reddit"] as const
const difficulties = ["beginner", "intermediate", "advanced"] as const

const scienceFields = [
  "physics",
  "biology",
  "chemistry",
  "neuroscience",
  "astronomy",
  "genetics",
  "ecology",
  "psychology",
  "computer science",
  "mathematics",
  "engineering",
  "medicine",
  "biotechnology",
  "nanotechnology",
]

const adjectives = [
  "Revolutionary",
  "Groundbreaking",
  "Mysterious",
  "Fascinating",
  "Cutting-edge",
  "Innovative",
  "Remarkable",
  "Extraordinary",
  "Breakthrough",
  "Advanced",
  "Novel",
  "Pioneering",
  "Emerging",
  "Transformative",
]

const phenomena = [
  "Effect",
  "Principle",
  "Theory",
  "Mechanism",
  "Process",
  "Discovery",
  "Innovation",
  "Breakthrough",
  "Phenomenon",
  "Technology",
  "Method",
  "System",
  "Approach",
  "Technique",
]

function generateRandomTitle(): string {
  const patterns = [
    () =>
      `${topics[Math.floor(Math.random() * topics.length)]} in ${scienceFields[Math.floor(Math.random() * scienceFields.length)]}`,
    () =>
      `The ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${phenomena[Math.floor(Math.random() * phenomena.length)]} of ${topics[Math.floor(Math.random() * topics.length)]}`,
    () =>
      `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${topics[Math.floor(Math.random() * topics.length)]}: ${phenomena[Math.floor(Math.random() * phenomena.length)]}`,
    () => topics[Math.floor(Math.random() * topics.length)],
  ]

  const pattern = patterns[Math.floor(Math.random() * patterns.length)]
  return pattern()
}

function generateRandomSummary(title: string): string {
  const summaryTemplates = [
    `Recent research in ${title.toLowerCase()} has revealed fascinating insights into how this phenomenon could revolutionize our understanding of the natural world.`,
    `Scientists have discovered that ${title.toLowerCase()} plays a crucial role in biological systems, opening new possibilities for medical applications.`,
    `The study of ${title.toLowerCase()} combines cutting-edge technology with fundamental scientific principles to unlock new frontiers in research.`,
    `Breakthrough developments in ${title.toLowerCase()} are paving the way for innovative solutions to some of humanity's greatest challenges.`,
    `New findings about ${title.toLowerCase()} challenge conventional wisdom and suggest exciting possibilities for future technological advancement.`,
    `Researchers are exploring how ${title.toLowerCase()} could transform industries and improve quality of life through practical applications.`,
    `The intersection of ${title.toLowerCase()} and modern technology is creating unprecedented opportunities for scientific discovery.`,
    `Understanding ${title.toLowerCase()} better could lead to revolutionary changes in how we approach complex scientific problems.`,
  ]

  return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)]
}

function generateRandomTags(): string[] {
  const allTags = [
    "physics",
    "biology",
    "chemistry",
    "technology",
    "innovation",
    "research",
    "science",
    "discovery",
    "breakthrough",
    "quantum",
    "neural",
    "genetic",
    "molecular",
    "cellular",
    "computational",
    "artificial intelligence",
    "machine learning",
    "biotechnology",
    "nanotechnology",
    "space",
    "energy",
    "environment",
    "medicine",
    "psychology",
  ]

  const numTags = Math.floor(Math.random() * 4) + 2 // 2-5 tags
  const selectedTags = []
  const shuffled = [...allTags].sort(() => 0.5 - Math.random())

  for (let i = 0; i < numTags && i < shuffled.length; i++) {
    selectedTags.push(shuffled[i])
  }

  return selectedTags
}

function generateRandomDate(): string {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(randomTime).toISOString()
}

function generateRandomCuriosity(id: string) {
  const title = generateRandomTitle()
  const type = types[Math.floor(Math.random() * types.length)]
  const source = sources[Math.floor(Math.random() * sources.length)]

  return {
    id,
    title,
    summary: generateRandomSummary(title),
    source,
    tags: generateRandomTags(),
    type,
    url: `https://example.com/${id}`,
    readingTime: Math.floor(Math.random() * 15) + 3, // 3-17 minutes
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    publishedAt: generateRandomDate(),
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sort = url.searchParams.get("sort") || "recent"
    const filter = url.searchParams.get("filter") || "all"

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 800 + 200))

    // Generate random curiosities
    const numCuriosities = Math.floor(Math.random() * 4) + 6 // 6-9 curiosities
    const curiosities = []

    for (let i = 0; i < numCuriosities; i++) {
      curiosities.push(generateRandomCuriosity(`curio_${Date.now()}_${i}`))
    }

    // Apply filtering
    let filteredCuriosities = curiosities
    if (filter !== "all") {
      filteredCuriosities = curiosities.filter((curio) =>
        curio.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())),
      )
    }

    // Apply sorting
    switch (sort) {
      case "popular":
        filteredCuriosities.sort(() => Math.random() - 0.5) // Random for demo
        break
      case "reading-time":
        filteredCuriosities.sort((a, b) => a.readingTime - b.readingTime)
        break
      case "difficulty":
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
        filteredCuriosities.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        break
      case "recent":
      default:
        filteredCuriosities.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
    }

    return NextResponse.json({
      curiosities: filteredCuriosities,
      total: filteredCuriosities.length,
      generated: true,
    })
  } catch (error) {
    console.error("Error generating random curiosities:", error)
    return NextResponse.json({ error: "Failed to generate curiosities" }, { status: 500 })
  }
}

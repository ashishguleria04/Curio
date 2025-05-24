import { type NextRequest, NextResponse } from "next/server"

// Enhanced content generation based on search terms
function generateTopicContent(topic: string) {
  const topicLower = topic.toLowerCase()

  // Generate related subtopics
  const subtopicGenerators = {
    quantum: [
      "Quantum Entanglement",
      "Quantum Computing",
      "Quantum Tunneling",
      "Wave-Particle Duality",
      "Quantum Superposition",
    ],
    ai: ["Machine Learning", "Neural Networks", "Deep Learning", "Natural Language Processing", "Computer Vision"],
    space: ["Black Holes", "Exoplanets", "Dark Matter", "Gravitational Waves", "Cosmic Microwave Background"],
    biology: ["DNA Sequencing", "CRISPR", "Evolution", "Cellular Biology", "Genetics"],
    physics: ["Relativity", "Thermodynamics", "Electromagnetism", "Particle Physics", "String Theory"],
    chemistry: ["Molecular Chemistry", "Organic Chemistry", "Biochemistry", "Catalysis", "Chemical Bonds"],
    neuroscience: ["Brain Plasticity", "Consciousness", "Memory Formation", "Neural Networks", "Cognitive Science"],
    climate: ["Global Warming", "Carbon Cycle", "Renewable Energy", "Atmospheric Science", "Ocean Currents"],
  }

  // Find matching category
  let relatedTopics: string[] = []
  for (const [key, topics] of Object.entries(subtopicGenerators)) {
    if (topicLower.includes(key) || key.includes(topicLower)) {
      relatedTopics = topics
      break
    }
  }

  // If no specific match, generate general science topics
  if (relatedTopics.length === 0) {
    relatedTopics = [
      `Advanced ${topic}`,
      `${topic} Research`,
      `${topic} Applications`,
      `Future of ${topic}`,
      `${topic} Theory`,
    ]
  }

  // Generate curiosities for each related topic
  const curiosities = relatedTopics.map((relatedTopic, index) => {
    const summaries = [
      `Cutting-edge research in ${relatedTopic.toLowerCase()} is revealing new insights that could transform our understanding of ${topic.toLowerCase()}.`,
      `Scientists have made breakthrough discoveries in ${relatedTopic.toLowerCase()}, opening new possibilities for practical applications.`,
      `The study of ${relatedTopic.toLowerCase()} combines theoretical knowledge with experimental evidence to advance the field of ${topic.toLowerCase()}.`,
      `Recent developments in ${relatedTopic.toLowerCase()} are challenging conventional theories and suggesting innovative approaches to ${topic.toLowerCase()}.`,
      `Researchers are exploring how ${relatedTopic.toLowerCase()} can be applied to solve real-world problems related to ${topic.toLowerCase()}.`,
    ]

    const sources = ["Wikipedia", "arXiv", "Nature", "Science", "MIT Technology Review"]
    const types = ["wikipedia", "arxiv", "news"] as const
    const difficulties = ["beginner", "intermediate", "advanced"] as const

    // Generate relevant tags
    const baseTags = [topic.toLowerCase()]
    const additionalTags = [
      "research",
      "science",
      "discovery",
      "innovation",
      "breakthrough",
      "technology",
      "theory",
      "experimental",
      "applied science",
    ]

    const tags = [
      ...baseTags,
      relatedTopic.toLowerCase().replace(/\s+/g, " "),
      ...additionalTags.sort(() => 0.5 - Math.random()).slice(0, 3),
    ]

    return {
      id: `explore_${topic}_${index}_${Date.now()}`,
      title: relatedTopic,
      summary: summaries[Math.floor(Math.random() * summaries.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      tags: tags.slice(0, 5),
      type: types[Math.floor(Math.random() * types.length)],
      url: `https://example.com/explore/${encodeURIComponent(relatedTopic)}`,
      readingTime: Math.floor(Math.random() * 12) + 4, // 4-15 minutes
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      publishedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 6 months
    }
  })

  return curiosities
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic")?.toLowerCase() || ""

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 300))

    // Generate content based on the search topic
    const curiosities = generateTopicContent(topic)

    return NextResponse.json({
      curiosities,
      topic,
      total: curiosities.length,
      generated: true,
    })
  } catch (error) {
    console.error("Error exploring topic:", error)
    return NextResponse.json({ error: "Failed to explore topic" }, { status: 500 })
  }
}

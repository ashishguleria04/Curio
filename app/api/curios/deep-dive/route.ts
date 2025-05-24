import { type NextRequest, NextResponse } from "next/server"

function generateRandomAuthors(): string[] {
  const firstNames = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Edward",
    "Fiona",
    "George",
    "Helen",
    "Ivan",
    "Julia",
    "Kevin",
    "Luna",
    "Marcus",
    "Nina",
    "Oliver",
    "Petra",
  ]
  const lastNames = [
    "Anderson",
    "Brown",
    "Chen",
    "Davis",
    "Evans",
    "Foster",
    "Garcia",
    "Harris",
    "Johnson",
    "Kim",
    "Lee",
    "Martinez",
    "Nielsen",
    "O'Connor",
    "Patel",
    "Rodriguez",
  ]

  const numAuthors = Math.floor(Math.random() * 4) + 1 // 1-4 authors
  const authors = []

  for (let i = 0; i < numAuthors; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    authors.push(`${firstName} ${lastName}`)
  }

  return authors
}

function generateDeepDiveContent(topic: string) {
  const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1)

  // Generate Wikipedia content
  const wikipediaContent = {
    title: topicTitle,
    summary: `${topicTitle} represents a fascinating area of study that combines theoretical knowledge with practical applications. This field has seen remarkable advances in recent years, driven by technological innovations and interdisciplinary collaboration.`,
    fullText: `${topicTitle} is a complex and multifaceted subject that encompasses various aspects of modern science and technology. Researchers in this field work to understand the fundamental principles that govern ${topic.toLowerCase()}, while also exploring practical applications that could benefit society. The study of ${topic.toLowerCase()} involves sophisticated experimental techniques, advanced computational models, and collaborative efforts across multiple disciplines. Recent breakthroughs have opened new avenues for research and development, suggesting that we are only beginning to scratch the surface of what is possible in this exciting field. As our understanding deepens, we can expect to see even more innovative applications and discoveries that will shape the future of science and technology.`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topicTitle)}`,
    readingTime: Math.floor(Math.random() * 20) + 10, // 10-29 minutes
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Within last 30 days
  }

  // Generate research papers
  const paperTitles = [
    `Novel Approaches to ${topicTitle}: A Comprehensive Review`,
    `Advances in ${topicTitle} Research: Recent Developments and Future Directions`,
    `Theoretical Foundations of ${topicTitle}: Mathematical Models and Experimental Validation`,
    `Applications of ${topicTitle} in Modern Technology: Challenges and Opportunities`,
    `Interdisciplinary Perspectives on ${topicTitle}: Bridging Theory and Practice`,
    `Computational Methods for ${topicTitle} Analysis: State of the Art`,
    `Experimental Techniques in ${topicTitle} Research: Methodological Innovations`,
  ]

  const papers = paperTitles.slice(0, Math.floor(Math.random() * 5) + 3).map((title, index) => ({
    title,
    authors: generateRandomAuthors(),
    abstract: `This paper presents groundbreaking research in ${topic.toLowerCase()}, introducing novel methodologies and theoretical frameworks that advance our understanding of this complex field. Our findings demonstrate significant improvements over existing approaches and open new possibilities for practical applications. The research combines rigorous theoretical analysis with comprehensive experimental validation, providing robust evidence for the proposed concepts. These results have important implications for both academic research and industrial applications, suggesting new directions for future investigation and development.`,
    url: `https://arxiv.org/abs/${Math.floor(Math.random() * 9000) + 1000}.${Math.floor(Math.random() * 9000) + 1000}`,
    published: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    citations: Math.floor(Math.random() * 500) + 10,
    difficulty: ["beginner", "intermediate", "advanced"][Math.floor(Math.random() * 3)],
  }))

  // Generate news articles
  const newsHeadlines = [
    `Breakthrough Discovery in ${topicTitle} Could Transform Industry`,
    `Scientists Achieve Major Milestone in ${topicTitle} Research`,
    `New ${topicTitle} Technology Shows Promise for Real-World Applications`,
    `Revolutionary ${topicTitle} Method Developed by International Team`,
    `${topicTitle} Research Receives Major Funding for Next Phase`,
    `Industry Leaders Invest Heavily in ${topicTitle} Development`,
  ]

  const newsSources = [
    "Science Daily",
    "MIT Technology Review",
    "Nature News",
    "Scientific American",
    "New Scientist",
    "IEEE Spectrum",
  ]

  const news = newsHeadlines.slice(0, Math.floor(Math.random() * 4) + 2).map((title, index) => ({
    title,
    description: `Recent developments in ${topic.toLowerCase()} have captured the attention of both researchers and industry professionals. This latest advancement represents a significant step forward in the field, with potential applications spanning multiple sectors. Experts believe this breakthrough could lead to practical solutions for long-standing challenges and open new opportunities for innovation and economic growth.`,
    url: `https://example.com/news/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))}`,
    source: newsSources[Math.floor(Math.random() * newsSources.length)],
    publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: Math.floor(Math.random() * 8) + 3, // 3-10 minutes
  }))

  // Generate discussions
  const discussionTitles = [
    `ELI5: What exactly is ${topic.toLowerCase()} and why should I care?`,
    `${topicTitle} breakthrough - what does this mean for the future?`,
    `Can someone explain the recent ${topic.toLowerCase()} research in simple terms?`,
    `How will ${topic.toLowerCase()} impact our daily lives?`,
    `${topicTitle} vs traditional methods - which is better?`,
    `What are the ethical implications of ${topic.toLowerCase()}?`,
  ]

  const subreddits = ["science", "technology", "askscience", "explainlikeimfive", "futurology", "askreddit"]

  const discussions = discussionTitles.slice(0, Math.floor(Math.random() * 4) + 2).map((title, index) => ({
    title,
    subreddit: subreddits[Math.floor(Math.random() * subreddits.length)],
    score: Math.floor(Math.random() * 5000) + 100,
    comments: Math.floor(Math.random() * 500) + 20,
    url: `https://reddit.com/r/${subreddits[index % subreddits.length]}/comments/${Math.random().toString(36).substr(2, 8)}`,
    snippet: `This is a really interesting question about ${topic.toLowerCase()}. From what I understand, the recent research has shown some promising results that could have significant implications. The community seems excited about the potential applications, though there are still some technical challenges to overcome.`,
  }))

  // Generate related topics
  const relatedTopics = [
    `Advanced ${topicTitle}`,
    `${topicTitle} Applications`,
    `${topicTitle} Theory`,
    `Computational ${topicTitle}`,
    `${topicTitle} Engineering`,
    `Future of ${topicTitle}`,
  ].slice(0, Math.floor(Math.random() * 4) + 3)

  // Generate stats
  const stats = {
    totalViews: Math.floor(Math.random() * 100000) + 10000,
    averageRating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
    bookmarkCount: Math.floor(Math.random() * 1000) + 50,
  }

  return {
    wikipedia: wikipediaContent,
    papers,
    news,
    discussions,
    relatedTopics,
    stats,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic")?.toLowerCase() || ""

    // Simulate API delay for deep dive content
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1500 + 500))

    const content = generateDeepDiveContent(topic)

    return NextResponse.json(content)
  } catch (error) {
    console.error("Error generating deep dive content:", error)
    return NextResponse.json({ error: "Failed to generate deep dive content" }, { status: 500 })
  }
}

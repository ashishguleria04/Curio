"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Heart, Bookmark, Share2, Clock, Users, TrendingUp, BookOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DeepDiveContent {
  wikipedia?: {
    title: string
    summary: string
    fullText: string
    url: string
    readingTime: number
    lastUpdated: string
  }
  papers?: Array<{
    title: string
    authors: string[]
    abstract: string
    url: string
    published: string
    citations: number
    difficulty: string
  }>
  news?: Array<{
    title: string
    description: string
    url: string
    source: string
    publishedAt: string
    readingTime: number
  }>
  discussions?: Array<{
    title: string
    subreddit: string
    score: number
    comments: number
    url: string
    snippet: string
  }>
  relatedTopics?: string[]
  stats?: {
    totalViews: number
    averageRating: number
    bookmarkCount: number
  }
}

function DeepDiveContent() {
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic")
  const [content, setContent] = useState<DeepDiveContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (topic) {
      fetchDeepDiveContent(topic)
      checkBookmarkStatus(topic)
    }
  }, [topic])

  const checkBookmarkStatus = (searchTopic: string) => {
    const bookmarks = JSON.parse(localStorage.getItem("curio-bookmarks") || "[]")
    setIsBookmarked(bookmarks.includes(searchTopic))
  }

  const toggleBookmark = () => {
    if (!topic) return

    const bookmarks = JSON.parse(localStorage.getItem("curio-bookmarks") || "[]")
    const newBookmarks = isBookmarked ? bookmarks.filter((b: string) => b !== topic) : [...bookmarks, topic]

    localStorage.setItem("curio-bookmarks", JSON.stringify(newBookmarks))
    setIsBookmarked(!isBookmarked)
  }

  const fetchDeepDiveContent = async (searchTopic: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/curios/deep-dive?topic=${encodeURIComponent(searchTopic)}`)
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error("Error fetching deep dive content:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-start">
              <div className="flex items-center space-x-4">
                <div className="animate-pulse h-8 bg-blue-900/30 rounded w-24"></div>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-blue-900/30 rounded w-1/3"></div>
            <div className="h-64 bg-blue-900/30 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-blue-900/30 rounded"></div>
              <div className="h-48 bg-blue-900/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black">
        <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-start">
              <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Feed</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-blue-100 mb-4">Content not found</h2>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">Return to Feed</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Feed</span>
              </Link>
              <span className="text-gray-600">/</span>
              <div>
                <h1 className="text-xl font-bold text-white">{topic}</h1>
                {content.stats && (
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {content.stats.totalViews.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {content.stats.averageRating}/5 rating
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400 hover:bg-gray-800">
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleBookmark}
                className={`hover:bg-gray-800 ${
                  isBookmarked ? "text-cyan-400 hover:text-cyan-300" : "text-gray-400 hover:text-cyan-400"
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-800">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700">
            <TabsTrigger
              value="overview"
              className={cn(
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-400 hover:text-gray-200 transition-all",
              )}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className={cn(
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-400 hover:text-gray-200 transition-all",
              )}
            >
              Research ({content.papers?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className={cn(
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-400 hover:text-gray-200 transition-all",
              )}
            >
              News ({content.news?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="discussions"
              className={cn(
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-400 hover:text-gray-200 transition-all",
              )}
            >
              Discussions ({content.discussions?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {content.wikipedia && (
              <Card className="bg-gray-900 border-gray-700 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <div className="p-2 bg-blue-500/20 rounded-lg">📚</div>
                      Wikipedia Overview
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        {content.wikipedia.readingTime} min read
                      </div>
                      <a href={content.wikipedia.url} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Full Article
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">{content.wikipedia.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{content.wikipedia.summary}</p>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-400 leading-relaxed">{content.wikipedia.fullText}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(content.wikipedia.lastUpdated).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )}

            {content.relatedTopics && content.relatedTopics.length > 0 && (
              <Card className="bg-gray-900 border-gray-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">🔗</div>
                    Related Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {content.relatedTopics.map((relatedTopic) => (
                      <Link key={relatedTopic} href={`/deep-dive?topic=${encodeURIComponent(relatedTopic)}`}>
                        <Badge className="cursor-pointer hover:bg-gray-700 bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500 hover:text-cyan-400 transition-all px-3 py-1.5 text-sm">
                          {relatedTopic}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Update other tab contents with similar styling... */}
          <TabsContent value="research" className="space-y-6">
            {content.papers && content.papers.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">🔬</div>
                  Research Papers
                </h2>
                {content.papers.map((paper, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-700 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg text-white leading-tight">{paper.title}</CardTitle>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-400">
                          By {paper.authors.join(", ")} • {new Date(paper.published).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium">
                            {paper.citations} citations
                          </Badge>
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 font-medium">
                            {paper.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">{paper.abstract}</p>
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Read Paper
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-700 shadow-xl">
                <CardContent className="text-center py-16">
                  <div className="p-4 bg-gray-800 rounded-full w-fit mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400">No research papers found for this topic.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {content.news && content.news.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">📰</div>
                  Recent News
                </h2>
                {content.news.map((article, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-700 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">{article.title}</CardTitle>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                          {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {article.readingTime} min read
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">{article.description}</p>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Read Article
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-700 shadow-xl">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-gray-800 rounded-full w-fit mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400">No recent news found for this topic.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            {content.discussions && content.discussions.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">💬</div>
                  Community Discussions
                </h2>
                {content.discussions.map((discussion, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-700 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">{discussion.title}</CardTitle>
                      <p className="text-sm text-gray-400">
                        r/{discussion.subreddit} • {discussion.score} upvotes • {discussion.comments} comments
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">{discussion.snippet}</p>
                      <a href={discussion.url} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Discussion
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-700 shadow-xl">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-gray-800 rounded-full w-fit mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400">No discussions found for this topic.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function DeepDivePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeepDiveContent />
    </Suspense>
  )
}

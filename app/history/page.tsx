"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, ArrowLeft, BookOpen, Clock, Trash2, Calendar, TrendingUp, Eye, RotateCcw } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface HistoryItem {
  id: string
  title: string
  summary: string
  source: string
  tags: string[]
  type: "wikipedia" | "arxiv" | "news" | "reddit"
  readingTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
  viewedAt: string
  category: string
  timeSpent?: number
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [loading, setLoading] = useState(true)
  const historyListRef = useRef<HTMLDivElement>(null)

  const periods = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ]

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "alphabetical", label: "Alphabetical" },
    { value: "time-spent", label: "Time Spent" },
    { value: "reading-time", label: "Reading Time" },
  ]

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    filterAndSortHistory()
  }, [history, searchTerm, selectedPeriod, sortBy])

  const loadHistory = () => {
    setLoading(true)

    const searchHistory = JSON.parse(localStorage.getItem("curio-history") || "[]")

    const mockHistory: HistoryItem[] = []

    searchHistory.forEach((searchTerm: string, index: number) => {
      const categories = ["science", "technology", "history", "psychology", "mathematics", "biology"]
      const sources = ["Wikipedia", "arXiv", "Nature", "Science", "MIT Technology Review"]
      const types = ["wikipedia", "arxiv", "news", "reddit"] as const
      const difficulties = ["beginner", "intermediate", "advanced"] as const

      const category = categories[index % categories.length]

      mockHistory.push({
        id: `search_${index}`,
        title: `${searchTerm} - Comprehensive Overview`,
        summary: `An in-depth exploration of ${searchTerm.toLowerCase()}, covering the latest research, historical context, and practical applications in the field.`,
        source: sources[index % sources.length],
        tags: [category, "research", "exploration", searchTerm.toLowerCase()].slice(0, 3),
        type: types[index % types.length],
        readingTime: Math.floor(Math.random() * 15) + 5,
        difficulty: difficulties[index % difficulties.length],
        viewedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        category,
        timeSpent: Math.floor(Math.random() * 20) + 5,
      })
    })

    // Add some additional mock history items
    const additionalTopics = [
      "Quantum Computing Breakthroughs",
      "Ancient Mesopotamian Mathematics",
      "Neural Network Architecture",
      "Climate Change Solutions",
      "Space Exploration Technologies",
      "Genetic Engineering Ethics",
      "Artificial Intelligence Philosophy",
      "Renewable Energy Innovations",
    ]

    additionalTopics.forEach((topic, index) => {
      const categories = ["science", "technology", "history", "psychology", "mathematics", "biology"]
      const sources = ["Wikipedia", "arXiv", "Nature", "Science", "MIT Technology Review"]
      const types = ["wikipedia", "arxiv", "news", "reddit"] as const
      const difficulties = ["beginner", "intermediate", "advanced"] as const

      const category = categories[index % categories.length]

      mockHistory.push({
        id: `topic_${index}`,
        title: topic,
        summary: `A detailed examination of ${topic.toLowerCase()}, exploring current developments, challenges, and future prospects in this fascinating field.`,
        source: sources[index % sources.length],
        tags: [category, "innovation", "research"].slice(0, 3),
        type: types[index % types.length],
        readingTime: Math.floor(Math.random() * 20) + 8,
        difficulty: difficulties[index % difficulties.length],
        viewedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        category,
        timeSpent: Math.floor(Math.random() * 25) + 10,
      })
    })

    setHistory(mockHistory)
    setLoading(false)
  }

  const filterAndSortHistory = () => {
    let filtered = [...history]

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedPeriod !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (selectedPeriod) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
      }

      filtered = filtered.filter((item) => new Date(item.viewedAt) >= filterDate)
    }

    switch (sortBy) {
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "time-spent":
        filtered.sort((a, b) => (b.timeSpent || 0) - (a.timeSpent || 0))
        break
      case "reading-time":
        filtered.sort((a, b) => a.readingTime - b.readingTime)
        break
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
        break
    }

    setFilteredHistory(filtered)
  }

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your reading history?")) {
      localStorage.setItem("curio-history", "[]")
      setHistory([])
      setFilteredHistory([])
    }
  }

  const removeHistoryItem = (itemId: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== itemId))
  }

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "wikipedia":
        return "📚"
      case "arxiv":
        return "🔬"
      case "news":
        return "📰"
      case "reddit":
        return "💬"
      default:
        return "🌐"
    }
  }

  const getSourceColor = (type: string) => {
    switch (type) {
      case "wikipedia":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "arxiv":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "news":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "reddit":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "advanced":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const periodLabels = {
    all: "All Time",
    today: "Today",
    week: "This Week",
    month: "This Month",
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Feed
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="h-5 w-5 text-cyan-400" />
                  Reading History
                </h1>
                <p className="text-sm text-gray-400">{history.length} articles viewed</p>
              </div>
            </div>
            {history.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        {history.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
              <div className="flex gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-gray-200 hover:border-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue>{periodLabels[selectedPeriod as keyof typeof periodLabels] || "All Time"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value} className="text-gray-200 hover:bg-gray-800">
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-gray-200 hover:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-gray-200 hover:bg-gray-800">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {filteredHistory.length} of {history.length} items
              </span>
              {searchTerm && <span>• Searching for "{searchTerm}"</span>}
              {selectedPeriod !== "all" && (
                <span>• Period: {periods.find((p) => p.value === selectedPeriod)?.label}</span>
              )}
            </div>
          </div>
        )}

        {/* History List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-gray-900 border-gray-700">
                <CardHeader>
                  <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-900 rounded-full w-fit mx-auto mb-6">
              <History className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">No reading history yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start exploring articles and your reading history will appear here.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg">
                <Search className="h-4 w-4 mr-2" />
                Start Exploring
              </Button>
            </Link>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-900 rounded-full w-fit mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">No history matches your search</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search terms or time period.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedPeriod("all")
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>
            <div className="space-y-6" ref={historyListRef}>
              <AnimatePresence>
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="relative pl-12 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer group bg-gray-900 border-gray-700 hover:border-gray-600 hover:bg-gray-800/50">
                      <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full z-10"></div>
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors text-white leading-tight mb-2">
                              {item.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                Viewed {formatTimeAgo(item.viewedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.readingTime} min read
                              </span>
                              {item.timeSpent && (
                                <span className="flex items-center gap-1">
                                  <RotateCcw className="h-3 w-3" />
                                  {item.timeSpent} min spent
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeHistoryItem(item.id)
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-4 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">{item.summary}</p>

                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${getSourceColor(item.type)} font-medium`}>
                              {getSourceIcon(item.source)} {item.source}
                            </Badge>
                            <Badge className={`${getDifficultyColor(item.difficulty)} font-medium`}>
                              {item.difficulty}
                            </Badge>
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} className="text-xs bg-gray-800 text-gray-300 border-gray-600">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Link href={`/deep-dive?topic=${encodeURIComponent(item.title)}`}>
                            <Button
                              size="sm"
                              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 transition-all"
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              Read Again
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Load More */}
        {filteredHistory.length > 0 && filteredHistory.length >= 20 && (
          <div className="text-center mt-12">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 px-8 py-3 transition-all">
              Load More History
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Shuffle, BookOpen, Zap, Heart, Bookmark, Clock, TrendingUp, Filter, Sparkles } from "lucide-react"
import Link from "next/link"

interface CuriosityCard {
  id: string
  title: string
  summary: string
  source: string
  tags: string[]
  url?: string
  type: "wikipedia" | "arxiv" | "news" | "reddit"
  readingTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
  publishedAt: string
  isBookmarked?: boolean
}

export default function HomePage() {
  const [curiosities, setCuriosities] = useState<CuriosityCard[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [randomCurio, setRandomCurio] = useState<CuriosityCard | null>(null)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [readingHistory, setReadingHistory] = useState<string[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const filters = ["all", "science", "technology", "history", "philosophy", "psychology", "mathematics", "biology"]
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "reading-time", label: "Reading Time" },
    { value: "difficulty", label: "Difficulty" },
  ]

  useEffect(() => {
    setMounted(true)
    fetchCuriosities()
    loadUserData()
  }, [])

  useEffect(() => {
    if (searchTerm.length > 2) {
      generateSearchSuggestions(searchTerm)
    } else {
      setSearchSuggestions([])
    }
  }, [searchTerm])

  const loadUserData = () => {
    const savedBookmarks = localStorage.getItem("curio-bookmarks")
    const savedHistory = localStorage.getItem("curio-history")

    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
    if (savedHistory) setReadingHistory(JSON.parse(savedHistory))
  }

  const saveUserData = (bookmarksList: string[], historyList: string[]) => {
    localStorage.setItem("curio-bookmarks", JSON.stringify(bookmarksList))
    localStorage.setItem("curio-history", JSON.stringify(historyList))
  }

  const generateSearchSuggestions = (term: string) => {
    const suggestions = [
      "quantum computing",
      "neural networks",
      "ancient civilizations",
      "space exploration",
      "genetic engineering",
      "artificial consciousness",
      "climate science",
      "cryptography",
      "behavioral psychology",
      "renewable energy",
      "nanotechnology",
      "evolutionary biology",
    ].filter((suggestion) => suggestion.toLowerCase().includes(term.toLowerCase()))

    setSearchSuggestions(suggestions.slice(0, 5))
  }

  const fetchCuriosities = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/curios/random?sort=${sortBy}&filter=${selectedFilter}`)
      const data = await response.json()
      const curiositiesWithBookmarks = data.curiosities.map((curio: CuriosityCard) => ({
        ...curio,
        isBookmarked: bookmarks.includes(curio.id),
      }))
      setCuriosities(curiositiesWithBookmarks)
    } catch (error) {
      console.error("Error fetching curiosities:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRandomCurio = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/curios/randomizer")
      const data = await response.json()
      setRandomCurio(data.curio)
    } catch (error) {
      console.error("Error fetching random curio:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchTopic = async (topic?: string) => {
    const searchQuery = topic || searchTerm
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/curios/explore?topic=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setCuriosities(data.curiosities || [])
      setSearchSuggestions([])

      const newHistory = [searchQuery, ...readingHistory.filter((h) => h !== searchQuery)].slice(0, 10)
      setReadingHistory(newHistory)
      saveUserData(bookmarks, newHistory)
    } catch (error) {
      console.error("Error searching topic:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = (curioId: string) => {
    const newBookmarks = bookmarks.includes(curioId)
      ? bookmarks.filter((id) => id !== curioId)
      : [...bookmarks, curioId]

    setBookmarks(newBookmarks)
    saveUserData(newBookmarks, readingHistory)

    setCuriosities((prev) =>
      prev.map((curio) => (curio.id === curioId ? { ...curio, isBookmarked: !curio.isBookmarked } : curio)),
    )
  }

  const filteredCuriosities = curiosities.filter(
    (curio) =>
      selectedFilter === "all" || curio.tags.some((tag) => tag.toLowerCase().includes(selectedFilter.toLowerCase())),
  )

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
        return "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
      case "arxiv":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
      case "news":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30"
      case "reddit":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30"
      case "advanced":
        return "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30"
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-cyan-400 animate-pulse" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Loading Curio...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-950/95 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <Zap className="h-10 w-10 text-cyan-400 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 h-10 w-10 text-cyan-400 animate-pulse opacity-30" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-blue-400 animate-bounce" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Curio
                </h1>
                <span className="text-sm text-gray-400 font-medium">Fuel Your Curiosity</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/landing"
                className="text-gray-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105 font-medium"
              >
                Home
              </Link>
              <Link
                href="/"
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 font-semibold relative"
              >
                Feed
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
              </Link>
              <Link
                href="/bookmarks"
                className="text-gray-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105 font-medium"
              >
                Bookmarks ({bookmarks.length})
              </Link>
              <Link
                href="/history"
                className="text-gray-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105 font-medium"
              >
                History
              </Link>
              <Link
                href="/profile"
                className="text-gray-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105 font-medium"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Search and Controls */}
        <div className="mb-12 space-y-8 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative group">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Input
                    placeholder="Explore a topic... (e.g., quantum physics, ancient rome)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchTopic()}
                    className="relative bg-gray-900/80 backdrop-blur-sm border-gray-700/50 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 h-14 text-lg px-6 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-cyan-500/10"
                  />
                  {searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-20 overflow-hidden">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion}
                          onClick={() => searchTopic(suggestion)}
                          className="w-full text-left px-6 py-4 text-gray-200 hover:bg-gray-800/50 hover:text-cyan-400 transition-all duration-200 border-b border-gray-800/50 last:border-b-0"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Search className="inline h-4 w-4 mr-3 opacity-60" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => searchTopic()}
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 h-14 px-8 font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 rounded-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Search className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <Button
              onClick={fetchRandomCurio}
              disabled={loading}
              className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white border border-gray-600/50 hover:border-gray-500/50 h-14 px-8 font-semibold transition-all duration-300 rounded-xl hover:scale-105 shadow-xl hover:shadow-purple-500/10 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Shuffle className="h-5 w-5" />
              Surprise Me!
            </Button>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {filters.map((filter, index) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={`capitalize transition-all duration-300 hover:scale-105 ${
                    selectedFilter === filter
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-cyan-500/25"
                      : "bg-gray-900/50 backdrop-blur-sm border-gray-600/50 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500/50 hover:text-white shadow-lg"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {filter}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-gray-900/50 backdrop-blur-sm border-gray-700/50 text-gray-200 hover:border-gray-600/50 rounded-lg shadow-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 rounded-lg shadow-2xl">
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-gray-200 hover:bg-gray-800/50 focus:bg-gray-800/50"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recent Search History */}
          {readingHistory.length > 0 && (
            <div className="flex items-center gap-4 flex-wrap animate-in slide-in-from-bottom duration-500 delay-200">
              <span className="text-sm text-gray-400 font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent:
              </span>
              {readingHistory.slice(0, 5).map((term, index) => (
                <button
                  key={term}
                  onClick={() => searchTopic(term)}
                  className="text-sm px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-gray-300 rounded-full hover:bg-gray-700/50 hover:text-cyan-400 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105 shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Random Curio Display */}
        {randomCurio && (
          <Card className="mb-12 border border-gray-700/50 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/80 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            <CardHeader className="pb-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl backdrop-blur-sm border border-cyan-500/20">
                  <Shuffle className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white text-xl font-bold">Random Discovery</CardTitle>
                <div className="ml-auto">
                  <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <h3 className="text-2xl font-bold mb-4 text-white leading-tight">{randomCurio.title}</h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">{randomCurio.summary}</p>
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge
                    className={`${getSourceColor(randomCurio.type)} font-semibold transition-all duration-300 hover:scale-105`}
                  >
                    {getSourceIcon(randomCurio.source)} {randomCurio.source}
                  </Badge>
                  <Badge
                    className={`${getDifficultyColor(randomCurio.difficulty)} font-semibold transition-all duration-300 hover:scale-105`}
                  >
                    {randomCurio.difficulty}
                  </Badge>
                  <div className="flex items-center gap-2 text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{randomCurio.readingTime} min</span>
                  </div>
                  {randomCurio.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={tag}
                      className="bg-gray-800/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/deep-dive?topic=${encodeURIComponent(randomCurio.title)}`}>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl font-semibold">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Deep Dive
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Curiosity Feed */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-left duration-500">
            <h2 className="text-4xl font-bold text-white">
              {searchTerm ? (
                <>
                  Exploring:{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {searchTerm}
                  </span>
                </>
              ) : (
                "Curiosity Feed"
              )}
            </h2>
            <div className="flex items-center gap-3 text-gray-400 bg-gray-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-700/50">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">{filteredCuriosities.length} articles</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="animate-pulse bg-gray-900/50 backdrop-blur-sm border-gray-700/50 rounded-xl overflow-hidden"
                >
                  <CardHeader>
                    <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-3/4 shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-1/2 shimmer"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded shimmer"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-5/6 shimmer"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-4/6 shimmer"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCuriosities.map((curio, index) => (
                <Card
                  key={curio.id}
                  className="hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 cursor-pointer group bg-gray-900/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50 rounded-xl overflow-hidden hover:scale-105 animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <CardHeader className="pb-4 relative">
                    <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors duration-300 text-white leading-tight font-bold">
                      {curio.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{curio.readingTime} min read</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(curio.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">{curio.summary}</p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${getSourceColor(curio.type)} font-medium transition-all duration-300 hover:scale-105`}
                        >
                          {getSourceIcon(curio.source)} {curio.source}
                        </Badge>
                        <Badge
                          className={`${getDifficultyColor(curio.difficulty)} font-medium transition-all duration-300 hover:scale-105`}
                        >
                          {curio.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {curio.tags.slice(0, 4).map((tag, tagIndex) => (
                        <Badge
                          key={tag}
                          className="text-xs bg-gray-800/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
                          style={{ animationDelay: `${tagIndex * 50}ms` }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-110 rounded-lg"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleBookmark(curio.id)}
                          className={`hover:bg-cyan-500/10 transition-all duration-300 hover:scale-110 rounded-lg ${
                            curio.isBookmarked
                              ? "text-cyan-400 hover:text-cyan-300"
                              : "text-gray-400 hover:text-cyan-400"
                          }`}
                        >
                          <Bookmark className={`h-4 w-4 ${curio.isBookmarked ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                      <Link href={`/deep-dive?topic=${encodeURIComponent(curio.title)}`}>
                        <Button
                          size="sm"
                          className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 rounded-lg shadow-lg"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Deep Dive
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredCuriosities.length === 0 && (
            <div className="text-center py-20 animate-in fade-in duration-700">
              <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-full w-fit mx-auto mb-8 border border-gray-700/50">
                <BookOpen className="h-16 w-16 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No curiosities found</h3>
              <p className="text-gray-400 mb-8 text-lg">Try adjusting your search or filters</p>
              <Button
                onClick={fetchCuriosities}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 px-8 py-3 rounded-xl font-semibold"
              >
                Refresh Feed
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        {!loading && filteredCuriosities.length > 0 && (
          <div className="text-center animate-in fade-in duration-500 delay-300">
            <Button
              onClick={fetchCuriosities}
              className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-gray-500/50 px-10 py-4 transition-all duration-300 hover:scale-105 rounded-xl shadow-xl font-semibold"
            >
              Load More Curiosities
            </Button>
          </div>
        )}
      </main>

      <style jsx>{`
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

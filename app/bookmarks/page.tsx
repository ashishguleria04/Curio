"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bookmark,
  Search,
  Filter,
  ArrowLeft,
  BookOpen,
  Clock,
  Trash2,
  Heart,
  Calendar,
  Tag,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface BookmarkedCurio {
  id: string
  title: string
  summary: string
  source: string
  tags: string[]
  type: "wikipedia" | "arxiv" | "news" | "reddit"
  readingTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
  bookmarkedAt: string
  category: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedCurio[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkedCurio[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [loading, setLoading] = useState(true)

  const categories = ["all", "science", "technology", "history", "philosophy", "psychology", "mathematics", "biology"]
  const sortOptions = [
    { value: "recent", label: "Recently Added" },
    { value: "alphabetical", label: "Alphabetical" },
    { value: "reading-time", label: "Reading Time" },
    { value: "difficulty", label: "Difficulty" },
  ]

  useEffect(() => {
    loadBookmarks()
  }, [])

  useEffect(() => {
    filterAndSortBookmarks()
  }, [bookmarks, searchTerm, selectedCategory, sortBy])

  const loadBookmarks = () => {
    setLoading(true)

    const bookmarkedIds = JSON.parse(localStorage.getItem("curio-bookmarks") || "[]")

    const mockBookmarks: BookmarkedCurio[] = bookmarkedIds.map((id: string, index: number) => {
      const topics = [
        "Quantum Entanglement and Bell's Theorem",
        "The Mycorrhizal Network: How Trees Communicate",
        "CRISPR Gene Editing: Revolutionizing Medicine",
        "Dark Matter: The Universe's Missing Mass",
        "Neural Plasticity and Learning",
        "Ancient Roman Engineering Marvels",
        "The Psychology of Decision Making",
        "Blockchain Technology Explained",
        "Photosynthesis: Nature's Solar Panels",
        "The Mathematics of Infinity",
      ]

      const sources = ["Wikipedia", "arXiv", "Nature", "Science", "MIT Technology Review"]
      const types = ["wikipedia", "arxiv", "news", "reddit"] as const
      const difficulties = ["beginner", "intermediate", "advanced"] as const
      const categories = ["science", "technology", "history", "psychology", "mathematics", "biology"]

      const title = topics[index % topics.length] || `Fascinating Topic ${index + 1}`
      const category = categories[index % categories.length]

      return {
        id,
        title,
        summary: `This fascinating article explores the depths of ${title.toLowerCase()}, providing insights that challenge our understanding and open new avenues for exploration.`,
        source: sources[index % sources.length],
        tags: [category, "research", "discovery", "innovation"].slice(0, Math.floor(Math.random() * 3) + 2),
        type: types[index % types.length],
        readingTime: Math.floor(Math.random() * 15) + 5,
        difficulty: difficulties[index % difficulties.length],
        bookmarkedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        category,
      }
    })

    setBookmarks(mockBookmarks)
    setLoading(false)
  }

  const filterAndSortBookmarks = () => {
    let filtered = [...bookmarks]

    if (searchTerm) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.category === selectedCategory ||
          bookmark.tags.some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase())),
      )
    }

    switch (sortBy) {
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "reading-time":
        filtered.sort((a, b) => a.readingTime - b.readingTime)
        break
      case "difficulty":
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        break
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime())
        break
    }

    setFilteredBookmarks(filtered)
  }

  const removeBookmark = (bookmarkId: string) => {
    const currentBookmarks = JSON.parse(localStorage.getItem("curio-bookmarks") || "[]")
    const updatedBookmarks = currentBookmarks.filter((id: string) => id !== bookmarkId)
    localStorage.setItem("curio-bookmarks", JSON.stringify(updatedBookmarks))

    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId))
  }

  const clearAllBookmarks = () => {
    if (confirm("Are you sure you want to remove all bookmarks?")) {
      localStorage.setItem("curio-bookmarks", "[]")
      setBookmarks([])
    }
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
                  <Bookmark className="h-5 w-5 text-cyan-400" />
                  My Bookmarks
                </h1>
                <p className="text-sm text-gray-400">{bookmarks.length} saved articles</p>
              </div>
            </div>
            {bookmarks.length > 0 && (
              <Button
                onClick={clearAllBookmarks}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        {bookmarks.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-gray-200 hover:border-gray-600">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-gray-200 hover:bg-gray-800 capitalize"
                      >
                        {category}
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
                {filteredBookmarks.length} of {bookmarks.length} bookmarks
              </span>
              {searchTerm && <span>• Searching for "{searchTerm}"</span>}
              {selectedCategory !== "all" && <span>• Category: {selectedCategory}</span>}
            </div>
          </div>
        )}

        {/* Bookmarks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-gray-900 border-gray-700">
                <CardHeader>
                  <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-900 rounded-full w-fit mx-auto mb-6">
              <Bookmark className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">No bookmarks yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start bookmarking interesting articles to build your personal collection of curiosities.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg">
                <Search className="h-4 w-4 mr-2" />
                Explore Articles
              </Button>
            </Link>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-900 rounded-full w-fit mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">No bookmarks match your search</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search terms or filters.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer group bg-gray-900 border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors text-white leading-tight flex-1">
                      {bookmark.title}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBookmark(bookmark.id)
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    {bookmark.readingTime} min read
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">{bookmark.summary}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSourceColor(bookmark.type)} font-medium`}>
                        {getSourceIcon(bookmark.source)} {bookmark.source}
                      </Badge>
                      <Badge className={`${getDifficultyColor(bookmark.difficulty)} font-medium`}>
                        {bookmark.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookmark.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} className="text-xs bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-gray-800 transition-colors"
                      >
                        <Bookmark className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    <Link href={`/deep-dive?topic=${encodeURIComponent(bookmark.title)}`}>
                      <Button
                        size="sm"
                        className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 transition-all"
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Read
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

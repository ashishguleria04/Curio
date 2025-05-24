"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Zap, BookOpen, TrendingUp, ArrowRight, Sparkles, Brain, Globe, Clock, Star, Users, Target } from "lucide-react"
import Link from "next/link"

interface FeatureCurio {
  id: string
  title: string
  summary: string
  category: string
  readingTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
}

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [featuredCurios, setFeaturedCurios] = useState<FeatureCurio[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    generateFeaturedContent()
  }, [])

  const generateFeaturedContent = () => {
    const featured: FeatureCurio[] = [
      {
        id: "1",
        title: "Quantum Entanglement: The Spooky Action at a Distance",
        summary:
          "Discover how particles can be mysteriously connected across vast distances, defying our understanding of reality.",
        category: "Physics",
        readingTime: 8,
        difficulty: "intermediate",
      },
      {
        id: "2",
        title: "The Hidden Language of Trees",
        summary: "Explore the fascinating underground network that allows forests to communicate and share resources.",
        category: "Biology",
        readingTime: 6,
        difficulty: "beginner",
      },
      {
        id: "3",
        title: "Ancient Algorithms: How Babylonians Invented Modern Math",
        summary: "Uncover the mathematical innovations from 4000 years ago that still power our digital world today.",
        category: "History",
        readingTime: 12,
        difficulty: "advanced",
      },
    ]
    setFeaturedCurios(featured)
    setLoading(false)
  }

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
    alert("Thanks for signing up! We'll keep you updated with the latest curiosities.")
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
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Logo */}
            <div className="flex items-center justify-center mb-12 animate-in fade-in duration-1000">
              <div className="relative group">
                <Zap className="h-20 w-20 text-cyan-400 transition-transform group-hover:scale-110 duration-300" />
                <div className="absolute inset-0 h-20 w-20 text-cyan-400 animate-pulse opacity-30" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-blue-400 animate-bounce" />
                <Star className="absolute -bottom-1 -left-1 h-4 w-4 text-purple-400 animate-pulse delay-300" />
              </div>
              <div className="ml-6">
                <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Curio
                </h1>
                <p className="text-gray-400 text-xl font-medium">Fuel Your Curiosity</p>
              </div>
            </div>

            {/* Enhanced Hero Text */}
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              Discover the{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Extraordinary
              </span>{" "}
              in Everything
            </h2>

            <p className="text-xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
              Dive deep into fascinating topics from across the web. From quantum physics to ancient history, from
              cutting-edge AI to the mysteries of consciousness — satisfy your curiosity with curated, high-quality
              content that makes learning addictive.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-in fade-in slide-in-from-bottom duration-1000 delay-600">
              <Link href="/">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-10 py-5 text-xl font-bold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 rounded-2xl">
                  <Sparkles className="h-6 w-6 mr-3" />
                  Start Exploring
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-10 py-5 text-xl transition-all duration-300 hover:scale-105 rounded-2xl backdrop-blur-sm bg-gray-900/20"
              >
                <BookOpen className="h-6 w-6 mr-3" />
                See How It Works
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-800">
              {[
                { number: "10K+", label: "Curiosities Explored", color: "text-cyan-400", icon: BookOpen },
                { number: "50+", label: "Topics Covered", color: "text-blue-400", icon: Target },
                { number: "5K+", label: "Active Learners", color: "text-purple-400", icon: Users },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center group" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="p-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                    <div className="text-gray-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-32 bg-gray-950/50 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20 animate-in fade-in duration-1000">
            <h3 className="text-5xl font-bold text-white mb-8">Why Choose Curio?</h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We've reimagined how you discover and consume knowledge, making learning effortless and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: Brain,
                title: "AI-Curated Content",
                description:
                  "Our intelligent system finds the most fascinating and reliable content from across the web, saving you hours of searching and ensuring quality.",
                color: "cyan",
              },
              {
                icon: Globe,
                title: "Deep Dive Experience",
                description:
                  "Go beyond surface-level content. Each topic includes research papers, news articles, discussions, and related topics for comprehensive understanding.",
                color: "blue",
              },
              {
                icon: TrendingUp,
                title: "Personalized Learning",
                description:
                  "Track your interests, bookmark favorites, and get personalized recommendations based on your reading history and preferences.",
                color: "purple",
              },
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 group hover:scale-105 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative">
                  <div
                    className={`p-4 bg-${feature.color}-500/20 rounded-2xl w-fit mb-6 group-hover:bg-${feature.color}-500/30 transition-all duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className={`h-10 w-10 text-${feature.color}-400`} />
                  </div>
                  <CardTitle className="text-white text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Content */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-in fade-in duration-1000">
            <h3 className="text-5xl font-bold text-white mb-8">Featured Curiosities</h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Get a taste of the fascinating content waiting for you. These are just a few examples of the thousands of
              curiosities you can explore.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="animate-pulse bg-gray-900/50 backdrop-blur-sm border-gray-700/50 rounded-2xl overflow-hidden"
                >
                  <CardHeader>
                    <div className="h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-3/4 mb-3 shimmer"></div>
                    <div className="h-5 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-1/2 shimmer"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded shimmer"></div>
                      <div className="h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-5/6 shimmer"></div>
                      <div className="h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-4/6 shimmer"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featuredCurios.map((curio, index) => (
                <Card
                  key={curio.id}
                  className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-500 group cursor-pointer hover:scale-105 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30 transition-all duration-300 font-semibold">
                        {curio.category}
                      </Badge>
                      <Badge
                        className={`${getDifficultyColor(curio.difficulty)} transition-all duration-300 font-semibold`}
                      >
                        {curio.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl leading-tight group-hover:text-cyan-400 transition-colors duration-300 font-bold">
                      {curio.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                      <Clock className="h-4 w-4" />
                      <span>{curio.readingTime} min read</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-400 leading-relaxed mb-6 text-lg">{curio.summary}</p>
                    <Button
                      size="sm"
                      className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:border-0 hover:scale-105 rounded-lg font-semibold"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-16 animate-in fade-in duration-1000 delay-600">
            <Link href="/">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 rounded-2xl">
                Explore All Curiosities
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-32 bg-gray-950/50 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center animate-in fade-in duration-1000">
            <h3 className="text-5xl font-bold text-white mb-8">Stay Curious</h3>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Get the most fascinating discoveries delivered to your inbox weekly. No spam, just pure curiosity fuel.
            </p>

            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 flex-1 h-14 text-lg px-6 rounded-xl"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-8 font-bold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 h-14 rounded-xl"
              >
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-gray-500 mt-6">Join 5,000+ curious minds. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-gray-800/50 py-16 bg-gray-950/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 md:mb-0 group">
              <Zap className="h-8 w-8 text-cyan-400 transition-transform group-hover:scale-110 duration-300" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Curio
              </span>
            </div>

            <nav className="flex space-x-8 mb-6 md:mb-0">
              {[
                { href: "/", label: "Feed" },
                { href: "/bookmarks", label: "Bookmarks" },
                { href: "/history", label: "History" },
                { href: "/profile", label: "Profile" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-105 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="text-gray-500 text-sm">© 2024 Curio. Fuel your curiosity.</p>
          </div>
        </div>
      </footer>

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
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

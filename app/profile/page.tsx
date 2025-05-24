"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Settings,
  BookOpen,
  Clock,
  TrendingUp,
  Heart,
  Calendar,
  Target,
  Award,
  ArrowLeft,
  Edit3,
  Save,
  Sparkles,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface UserStats {
  totalRead: number
  totalTime: number
  streak: number
  bookmarks: number
  favoriteTopics: string[]
  readingGoal: number
  currentProgress: number
}

interface ReadingActivity {
  date: string
  articlesRead: number
  timeSpent: number
}

export default function ProfilePage() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalRead: 0,
    totalTime: 0,
    streak: 0,
    bookmarks: 0,
    favoriteTopics: [],
    readingGoal: 50,
    currentProgress: 0,
  })
  const [recentActivity, setRecentActivity] = useState<ReadingActivity[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [userName, setUserName] = useState("Curious Explorer")
  const [userEmail, setUserEmail] = useState("explorer@curio.com")
  const [readingGoal, setReadingGoal] = useState(50)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadUserData()
    generateRecentActivity()
  }, [])

  const loadUserData = () => {
    const bookmarks = JSON.parse(localStorage.getItem("curio-bookmarks") || "[]")
    const history = JSON.parse(localStorage.getItem("curio-history") || "[]")

    const stats: UserStats = {
      totalRead: Math.floor(Math.random() * 200) + 50,
      totalTime: Math.floor(Math.random() * 5000) + 1000,
      streak: Math.floor(Math.random() * 30) + 1,
      bookmarks: bookmarks.length,
      favoriteTopics: ["Physics", "Biology", "Technology", "History", "Psychology"],
      readingGoal: 50,
      currentProgress: Math.floor(Math.random() * 40) + 10,
    }

    setUserStats(stats)
  }

  const generateRecentActivity = () => {
    const activity: ReadingActivity[] = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      activity.push({
        date: date.toISOString().split("T")[0],
        articlesRead: Math.floor(Math.random() * 8) + 1,
        timeSpent: Math.floor(Math.random() * 120) + 30,
      })
    }

    setRecentActivity(activity.reverse())
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    setUserStats((prev) => ({ ...prev, readingGoal }))
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥"
    if (streak >= 14) return "⚡"
    if (streak >= 7) return "✨"
    return "🌟"
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-cyan-400 animate-pulse" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Loading Profile...
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
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Feed
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Profile</h1>
                <p className="text-sm text-gray-400 font-medium">Manage your curiosity journey</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 rounded-lg shadow-lg"
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
              <CardHeader className="text-center relative pb-8">
                <div className="w-28 h-28 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300 group">
                  <User className="h-14 w-14 text-white group-hover:scale-110 transition-transform duration-300" />
                  <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-gray-800/50 backdrop-blur-sm border-gray-600/50 text-white text-center rounded-lg"
                    />
                    <Input
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="bg-gray-800/50 backdrop-blur-sm border-gray-600/50 text-white text-center rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-white text-2xl font-bold">{userName}</CardTitle>
                    <p className="text-gray-400 text-lg">{userEmail}</p>
                  </>
                )}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30 transition-all duration-300 font-semibold px-3 py-1">
                    Level {Math.floor(userStats.totalRead / 10) + 1}
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300 font-semibold px-3 py-1">
                    {getStreakEmoji(userStats.streak)} {userStats.streak} day streak
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in duration-700 delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                {[
                  { label: "Articles Read", value: userStats.totalRead, icon: BookOpen, color: "text-cyan-400" },
                  { label: "Time Spent", value: formatTime(userStats.totalTime), icon: Clock, color: "text-blue-400" },
                  { label: "Bookmarks", value: userStats.bookmarks, icon: Heart, color: "text-red-400" },
                  { label: "Current Streak", value: `${userStats.streak} days`, icon: Zap, color: "text-yellow-400" },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon
                        className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                      <span className="text-gray-400 font-medium">{stat.label}</span>
                    </div>
                    <span className="text-white font-bold text-lg">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2 shadow-xl">
                {[
                  { value: "overview", label: "Overview" },
                  { value: "activity", label: "Activity" },
                  { value: "goals", label: "Goals" },
                  { value: "settings", label: "Settings" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-400 hover:text-gray-200 transition-all duration-300 rounded-xl font-semibold"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
                {/* Reading Progress */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
                  <CardHeader className="relative">
                    <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
                      <Target className="h-6 w-6 text-cyan-400" />
                      Reading Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-medium">Monthly Goal</span>
                        <span className="text-white font-bold text-lg">
                          {userStats.currentProgress} / {userStats.readingGoal} articles
                        </span>
                      </div>
                      <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{
                            width: `${Math.min((userStats.currentProgress / userStats.readingGoal) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-gray-400 leading-relaxed">
                        {userStats.readingGoal - userStats.currentProgress > 0
                          ? `🎯 ${userStats.readingGoal - userStats.currentProgress} more articles to reach your goal!`
                          : "🎉 Goal achieved! Keep up the great work!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Favorite Topics */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5 pointer-events-none" />
                  <CardHeader className="relative">
                    <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
                      <Heart className="h-6 w-6 text-red-400" />
                      Favorite Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex flex-wrap gap-3">
                      {userStats.favoriteTopics.map((topic, index) => (
                        <Badge
                          key={topic}
                          className="bg-gray-800/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/50 cursor-pointer transition-all duration-300 hover:scale-105 px-4 py-2 text-sm font-medium"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none" />
                  <CardHeader className="relative">
                    <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
                      <Award className="h-6 w-6 text-yellow-400" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { emoji: "📚", title: "Bookworm", description: "Read 50+ articles", unlocked: true },
                        { emoji: "🔥", title: "Streak Master", description: "7+ day reading streak", unlocked: true },
                        { emoji: "🎯", title: "Goal Crusher", description: "Achieved monthly goal", unlocked: true },
                        { emoji: "🌟", title: "Explorer", description: "Explored 10+ topics", unlocked: true },
                      ].map((achievement, index) => (
                        <div
                          key={achievement.title}
                          className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group hover:scale-105"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                            {achievement.emoji}
                          </div>
                          <div>
                            <div className="text-white font-bold">{achievement.title}</div>
                            <div className="text-sm text-gray-400">{achievement.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-8 animate-in fade-in duration-500">
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
                  <CardHeader className="relative">
                    <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
                      <Calendar className="h-6 w-6 text-cyan-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div>
                            <div className="text-white font-bold">
                              {new Date(activity.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-gray-400">
                              {activity.articlesRead} articles • {formatTime(activity.timeSpent)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                            <Clock className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals" className="space-y-8 animate-in fade-in duration-500">
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5 pointer-events-none" />
                  <CardHeader className="relative">
                    <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
                      <Target className="h-6 w-6 text-cyan-400" />
                      Reading Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 relative">
                    <div>
                      <label className="text-white font-bold mb-3 block text-lg">Monthly Reading Goal</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={readingGoal}
                          onChange={(e) => setReadingGoal(Number(e.target.value))}
                          className="bg-gray-800/50 backdrop-blur-sm border-gray-600/50 text-white rounded-lg"
                          min="1"
                          max="200"
                        />
                      ) : (
                        <div className="text-gray-400 text-lg">{userStats.readingGoal} articles per month</div>
                      )}
                    </div>

                    <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
                      <h4 className="text-white font-bold mb-4 text-lg">Goal Suggestions</h4>
                      <div className="space-y-3 text-gray-400">
                        <div className="flex items-center gap-3">
                          <span className="text-green-400">•</span>
                          <span>Beginner: 10-20 articles per month</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400">•</span>
                          <span>Intermediate: 30-50 articles per month</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-red-400">•</span>
                          <span>Advanced: 60+ articles per month</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-8 animate-in fade-in duration-500">
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-transparent to-slate-500/5 pointer-events-none" />
                  <CardHeader className="relative">
                    <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
                      <Settings className="h-6 w-6 text-cyan-400" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 relative">
                    <div>
                      <label className="text-white font-bold mb-3 block">Display Name</label>
                      <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="bg-gray-800/50 backdrop-blur-sm border-gray-600/50 text-white rounded-lg"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <label className="text-white font-bold mb-3 block">Email</label>
                      <Input
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="bg-gray-800/50 backdrop-blur-sm border-gray-600/50 text-white rounded-lg"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="pt-6 border-t border-gray-700/50">
                      <h4 className="text-white font-bold mb-6 text-lg">Preferences</h4>
                      <div className="space-y-4">
                        {[
                          { label: "Email notifications", value: "Enabled" },
                          { label: "Dark mode", value: "Enabled" },
                          { label: "Reading reminders", value: "Daily" },
                        ].map((pref, index) => (
                          <div
                            key={pref.label}
                            className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <span className="text-gray-400 font-medium">{pref.label}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 rounded-lg"
                            >
                              {pref.value}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-6">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 rounded-lg font-semibold"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <style jsx>{`
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

'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search, 
  Clock, 
  Heart, 
  MapPin,
  LogOut,
  Menu,
  X,
  Star,
  TrendingUp,
  Bookmark
} from 'lucide-react'

interface RecentSearch {
  id: string
  query: string
  location: string
  timestamp: string
  results: number
}

interface FavoritePlace {
  id: string
  name: string
  category: string
  rating: number
  location: string
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [favorites, setFavorites] = useState<FavoritePlace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    fetchUserData()
  }, [session, status, router])

  const fetchUserData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      const mockSearches: RecentSearch[] = [
        {
          id: '1',
          query: 'coffee shops',
          location: 'Cebu City',
          timestamp: '2024-01-15T10:30:00Z',
          results: 25
        },
        {
          id: '2',
          query: 'hotels',
          location: 'Mactan Island',
          timestamp: '2024-01-14T15:45:00Z',
          results: 18
        },
        {
          id: '3',
          query: 'restaurants',
          location: 'Lahug',
          timestamp: '2024-01-13T19:20:00Z',
          results: 32
        }
      ]

      const mockFavorites: FavoritePlace[] = [
        {
          id: '1',
          name: 'The Coffee Bean & Tea Leaf',
          category: 'Coffee Shop',
          rating: 4.5,
          location: 'Ayala Center Cebu'
        },
        {
          id: '2',
          name: 'Shangri-La Mactan',
          category: 'Hotel',
          rating: 4.8,
          location: 'Mactan Island'
        },
        {
          id: '3',
          name: 'Casa Verde',
          category: 'Restaurant',
          rating: 4.2,
          location: 'Lahug'
        }
      ]

      setRecentSearches(mockSearches)
      setFavorites(mockFavorites)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <a href="#" className="bg-blue-100 text-blue-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                <Search className="mr-4 h-6 w-6" />
                Recent Searches
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                <Heart className="mr-4 h-6 w-6" />
                Favorites
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                <Clock className="mr-4 h-6 w-6" />
                History
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <div className="flex w-full h-1/4">
          <div className="flex w-64 flex-col flex-shrink-0 border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <a href="#" className="bg-blue-100 text-blue-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <Search className="mr-3 h-5 w-5" />
                  Recent Searches
                </a>
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <Heart className="mr-3 h-5 w-5" />
                  Favorites
                </a>
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <Clock className="mr-3 h-5 w-5" />
                  History
                </a>
              </nav>
            </div>
          </div>
          <div className="from-gray-300 via-gray-200 to-gray-50 bg-gradient-to-b w-full h-64"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Welcome back, {session.user.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Discover amazing places in Cebu and manage your preferences.
                  </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Searches</dt>
                            <dd className="text-lg font-medium text-gray-900">{recentSearches.length}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Heart className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Favorites</dt>
                            <dd className="text-lg font-medium text-gray-900">{favorites.length}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <TrendingUp className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
                            <dd className="text-lg font-medium text-gray-900">12</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Bookmark className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Saved Places</dt>
                            <dd className="text-lg font-medium text-gray-900">8</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Recent Searches */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Searches</h3>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {recentSearches.map((search, index) => (
                      <motion.li
                        key={search.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <Search className="h-8 w-8 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900">{search.query}</p>
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {search.results} results
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                  {search.location}
                                  <span className="mx-2">•</span>
                                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                  {formatTimeAgo(search.timestamp)}
                                </div>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Search className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Favorites */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Favorites</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((favorite, index) => (
                    <motion.div
                      key={favorite.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">{favorite.name}</h4>
                        <button className="text-red-400 hover:text-red-600">
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{favorite.category}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(favorite.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{favorite.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {favorite.location}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

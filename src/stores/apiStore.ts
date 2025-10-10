import { create } from 'zustand'

interface APICache {
  [key: string]: {
    data: string
    timestamp: number
  }
}

interface APIState {
  cache: APICache
  loading: boolean
  error: string | null
  cacheExpiration: number
  fetchFromOpenAI: (prompt: string, location: string) => Promise<string>
  isCacheValid: (key: string) => boolean
  clearCache: () => void
  setCacheExpiration: (duration: number) => void
}

export const useAPIStore = create<APIState>((set, get) => ({
  cache: {},
  loading: false,
  error: null,
  cacheExpiration: 30 * 60 * 1000, // 30 minutes

  fetchFromOpenAI: async (prompt: string, location: string) => {
    const cacheKey = `${location}-${prompt}`
    
    // Check cache first
    if (get().isCacheValid(cacheKey)) {
      return get().cache[cacheKey].data
    }

    set({ loading: true, error: null })

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data from OpenAI')
      }

      const data = await response.json()
      const result = data.choices[0].message.content

      // Cache the result
      set((state) => ({
        cache: {
          ...state.cache,
          [cacheKey]: {
            data: result,
            timestamp: Date.now()
          }
        }
      }))

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  isCacheValid: (key: string) => {
    const cache = get().cache
    if (!cache[key]) return false
    
    const timestamp = cache[key].timestamp
    return Date.now() - timestamp < get().cacheExpiration
  },

  clearCache: () => {
    set({ cache: {} })
  },

  setCacheExpiration: (duration: number) => {
    set({ cacheExpiration: duration })
  }
}))

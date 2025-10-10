import { create } from 'zustand'

interface Region {
  id: string
  name: string
  selected: boolean
}

interface TouristSpot {
  name: string
  description: string
  address: string
  category: string
}

interface MapState {
  selectedRegion: string | null
  regions: Region[]
  touristSpots: TouristSpot[]
  loading: boolean
  error: string | null
  zoomLevel: number
  setSelectedRegion: (regionId: string) => void
  setZoomLevel: (level: number) => void
  setTouristSpots: (spots: TouristSpot[]) => void
  setLoading: (status: boolean) => void
  setError: (error: string | null) => void
  resetState: () => void
  isRegionSelected: (regionId: string) => boolean
}

export const useMapStore = create<MapState>((set, get) => ({
  selectedRegion: null,
  regions: [],
  touristSpots: [],
  loading: false,
  error: null,
  zoomLevel: 1,

  setSelectedRegion: (regionId: string) => {
    set((state) => ({
      selectedRegion: regionId,
      regions: state.regions.map(region => ({
        ...region,
        selected: region.id === regionId
      }))
    }))
  },

  setZoomLevel: (level: number) => {
    set({ zoomLevel: level })
  },

  setTouristSpots: (spots: TouristSpot[]) => {
    set({ touristSpots: spots })
  },

  setLoading: (status: boolean) => {
    set({ loading: status })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  resetState: () => {
    set({
      selectedRegion: null,
      touristSpots: [],
      loading: false,
      error: null,
      zoomLevel: 1
    })
  },

  isRegionSelected: (regionId: string) => {
    return get().selectedRegion === regionId
  }
}))

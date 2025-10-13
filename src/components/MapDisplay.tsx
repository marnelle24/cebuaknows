'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useMapStore } from '@/stores/mapStore'
import { motion } from 'framer-motion'
import SkeletonLoader from './SkeletonLoader'
import RegionModal from './RegionModal'
import { cebuMapPaths } from '@/data/cebuMapData'

const MapDisplay: React.FC = () => {
  const tooltip = useRef<HTMLDivElement | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [scale, setScale] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { loading, setSelectedRegion } = useMapStore()

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRegionName, setSelectedRegionName] = useState('')

  // Detect screen size for responsive scale
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const resetZoom = useCallback(() => {
    // Set scale based on screen size: 1.65 for desktop, 1.0 for mobile
    const defaultScale = isMobile ? 1.0 : 1.65
    setScale(defaultScale)
    setTranslateX(0)
    setTranslateY(0)

    // Remove selected class from all regions
    const svgMap = document.getElementById('cebuProvinceMap')
    if (svgMap) {
      const allRegions = svgMap.querySelectorAll('.region')
      allRegions.forEach(region => region.classList.remove('selected'))
    }
  }, [isMobile])

  useEffect(() => {
    // Reset scale and position when navigating away from a region
    const pathSegments = pathname.split('/')
    const hasLocationParam = pathSegments.length > 1 && pathSegments[1] !== ''
    const hasPlaceParam = pathSegments.includes('place')
    
    if (!hasLocationParam && !hasPlaceParam) {
      resetZoom()
    }
  }, [pathname, resetZoom])

  // Update scale when screen size changes
  useEffect(() => {
    if (isClient) {
      const pathSegments = pathname.split('/')
      const hasLocationParam = pathSegments.length > 1 && pathSegments[1] !== ''
      const hasPlaceParam = pathSegments.includes('place')
      
      // Only reset zoom if we're on the homepage (not on a specific region page)
      if (!hasLocationParam && !hasPlaceParam) {
        const defaultScale = isMobile ? 1.0 : 1.65
        setScale(defaultScale)
      }
    }
  }, [isMobile, isClient, pathname])

  // Function to reset all regions to a specific color
  const resetMap = useCallback((color: string) => {
    const svgMap = document.getElementById('cebuProvinceMap')
    if (svgMap) {
      const regions = svgMap.querySelectorAll('.region')
      regions.forEach(region => {
        region.setAttribute('fill', color)
      })
    }
  }, [])

  // Function to change fill color of a specific region
  const changeFillColor = useCallback((regionId: string, color: string) => {
    const svgMap = document.getElementById('cebuProvinceMap')
    if (svgMap) {
      const region = svgMap.querySelector(`#${regionId}`)
      if (region) {
        region.setAttribute('fill', color)
      }
    }
  }, [])

  // Function to handle click
  const regionClicked = useCallback((region: Element) => {
    const regionId = (region as HTMLElement).id

    // Navigate to the region route
    router.push(`/${regionId}`)

    // Show the modal with region information
    setSelectedRegionName(regionId)

    const svgMap = document.getElementById('cebuProvinceMap') as SVGSVGElement | null
    if (!svgMap) return

    const bbox = (region as SVGGraphicsElement).getBBox() // Get bounding box of clicked region

    const svgWidth = svgMap.viewBox.baseVal.width
    const svgHeight = svgMap.viewBox.baseVal.height

    // Calculate the true center of the region's bounding box
    const centerX = bbox.x + bbox.width / 2
    const centerY = bbox.y + bbox.height / 2

    // Define the zoom level (25% zoom in for better visual effect)
    const zoomScale = 1.5

    // Animate zoom and pan simultaneously
    setScale(zoomScale)

    // Calculate new translation for the SVG to center the region
    const newTranslateX = (svgWidth / 2 / zoomScale) - centerX
    const newTranslateY = (svgHeight / 2 / zoomScale) - centerY
    
    setTranslateX(newTranslateX)
    setTranslateY(newTranslateY)

    // Show modal after zoom animation completes
    setTimeout(() => {
      setModalVisible(true)
    }, 900) // Slightly before animation completes for smoother UX
  }, [router])

  // Function to highlight selected region
  const selectedRegion = useCallback((regionId: string) => {
    resetMap('#F7AE1D') // Reset all regions to default color
    changeFillColor(regionId, '#7BEA05') // Highlight selected region

    const svgMap = document.getElementById('cebuProvinceMap')
    if (svgMap) {
      // Remove selected class from all regions
      const allRegions = svgMap.querySelectorAll('.region')
      allRegions.forEach(region => region.classList.remove('selected'))

      const selectedReg = svgMap.querySelector(`#${regionId}`)
      if (selectedReg) {
        // Add selected class for animation
        selectedReg.classList.add('selected')
        regionClicked(selectedReg)
      }
    }
  }, [resetMap, changeFillColor, regionClicked])

  // Function to set tooltip element
  const setTooltipElement = useCallback(() => {
    const regions = document.querySelectorAll('.region')
    if (tooltip.current) {
      regions.forEach(region => {
        const handleMouseOver = () => {
          const name = region.id.includes('-city') 
            ? region.id.replace(/-/g, ' ').replace('city', 'City') 
            : region.id
          if (tooltip.current) {
            tooltip.current.textContent = name
            setTooltipVisible(true)
            // Get the region's bounding box
            const rect = region.getBoundingClientRect()

            // Calculate position
            const x = rect.left + (rect.width / 2)
            const y = rect.top

            // Position the tooltip
            tooltip.current.style.left = `${x}px`
            tooltip.current.style.top = `${y}px`
          }
        }

        const handleMouseMove = (event: Event) => {
          if (tooltip.current && tooltipVisible) {
            // Get the region's bounding box
            const rect = (event.target as Element).getBoundingClientRect()

            // Calculate position
            const x = rect.left + (rect.width / 2)
            const y = rect.top

            // Position the tooltip
            tooltip.current.style.left = `${x}px`
            tooltip.current.style.top = `${y}px`
          }
        }

        const handleMouseOut = () => {
          setTooltipVisible(false)
        }

        region.addEventListener('mouseover', handleMouseOver)
        region.addEventListener('mousemove', handleMouseMove)
        region.addEventListener('mouseout', handleMouseOut)

        // Cleanup function
        return () => {
          region.removeEventListener('mouseover', handleMouseOver)
          region.removeEventListener('mousemove', handleMouseMove)
          region.removeEventListener('mouseout', handleMouseOut)
        }
      })
    }
  }, [tooltipVisible])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      resetMap('#F7AE1D') // Reset all regions to default color
      setTooltipElement() // Set up tooltip event listeners
    }
  }, [isClient, resetMap, setTooltipElement])

  useEffect(() => {
    if (isClient) {
      // Watch for route changes and update selected region
      const pathSegments = pathname.split('/')
      const locationParam = pathSegments[1]
      const placeParam = pathSegments[2] === 'place' ? pathSegments[3] : null
      
      const regionParam = placeParam || locationParam
      
      if (regionParam && regionParam.trim() !== '') {
        selectedRegion(regionParam.trim())
        setSelectedRegion(regionParam.trim())
      } else {
        // Reset map when returning to homepage
        resetMap('#F7AE1D')
        setSelectedRegion('')
      }
    }
  }, [isClient, pathname, selectedRegion, resetMap, setSelectedRegion])

  // Modal event handlers
  const closeModal = useCallback(() => {
    setModalVisible(false)
    // Reset zoom when modal is closed
    setTimeout(() => {
      resetZoom()
    }, 300) // Small delay to let modal close animation complete
  }, [resetZoom])

  const exploreRegion = useCallback((regionName: string) => {
    setModalVisible(false)
    router.push(`/${regionName}`)
  }, [router])

  const handleRegionClick = useCallback((regionId: string) => {
    selectedRegion(regionId)
  }, [selectedRegion])

  return (
    <div className="relative w-full aspect-[213/466] max-w-xl mx-auto">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SkeletonLoader variant="rectangle" className="w-full h-full" />
        </div>
      )}
      
      <div
        id="tooltip"
        className={`map-tooltip fixed text-white capitalize bg-black/40 backdrop-blur border border-white/10 p-2 font-bold rounded-md text-xs ${
          tooltipVisible ? 'visible' : ''
        }`}
        ref={tooltip}
      />
      
      <motion.div 
        className="map-container w-full h-full relative"
        animate={{ scale }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.svg
          className="w-full h-full"
          id="cebuProvinceMap"
          viewBox="0 0 213 466"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ x: translateX, y: translateY }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Render all regions dynamically from data */}
          {cebuMapPaths.map((region) => (
            <motion.path
              key={region.id}
              id={region.id}
              d={region.path}
              fill="#F7AE1D"
              stroke="black"
              strokeWidth="0.4"
              strokeMiterlimit="10"
              className="region cursor-pointer transition-all duration-300 ease-in-out hover:fill-[#7BEA05] hover:brightness-110"
              onClick={() => handleRegionClick(region.id)}
              whileHover={{ scale: 1.02 }}
              style={{ transformOrigin: 'center' }}
            />
          ))}
        </motion.svg>
      </motion.div>




      

      {/* Region Modal */}
      <RegionModal 
        isVisible={modalVisible} 
        regionName={selectedRegionName} 
        onClose={closeModal}
        onExplore={exploreRegion} 
      />

      <style jsx>{`
        .map-tooltip {
          transition: all 0.2s ease-in-out;
          opacity: 0;
          transform: translate(-50%, -100%);
          pointer-events: none;
          display: block !important;
          position: fixed;
          z-index: 9999;
          min-width: 80px;
          text-align: center;
          left: 0;
          top: 0;
        }

        .map-tooltip.visible {
          opacity: 1;
        }

        .region.selected {
          fill: #7BEA05 !important;
          filter: brightness(1.2) drop-shadow(0 0 8px rgba(123, 234, 5, 0.6));
          animation: pulse-selected 2s ease-in-out infinite;
        }

        @keyframes pulse-selected {
          0%, 100% {
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(123, 234, 5, 0.6));
          }
          50% {
            filter: brightness(1.4) drop-shadow(0 0 12px rgba(123, 234, 5, 0.8));
          }
        }
      `}</style>
    </div>
  )
}

export default MapDisplay

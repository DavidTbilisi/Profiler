import { ref } from 'vue'
import cytoscape from 'cytoscape'

export function useMinimap() {
  const minimapCy = ref<any>(null)
  const minimapContainer = ref<HTMLElement>()
  const viewportIndicator = ref<HTMLElement>()
  const showMinimap = ref(true)

  function initializeMinimap(mainCy: any) {
    console.log('🗺️ === INITIALIZING MINIMAP ===')
    
    if (!minimapContainer.value) {
      console.error('❌ Cannot initialize minimap: container element not found')
      return false
    }
    
    if (!mainCy) {
      console.error('❌ Cannot initialize minimap: main Cytoscape instance not available')
      return false
    }

    // Clean up existing minimap if it exists
    if (minimapCy.value) {
      console.log('🧹 Cleaning up existing minimap instance...')
      try {
        minimapCy.value.removeAllListeners()
        minimapCy.value.destroy()
      } catch (error) {
        console.warn('⚠️ Error cleaning up existing minimap:', error)
      }
      minimapCy.value = null
    }

    try {
      console.log('🔧 Creating minimap configuration...')
      const elements = mainCy.elements().jsons()
      console.log('📊 Elements for minimap:', elements.length)
      
      if (elements.length === 0) {
        console.warn('⚠️ No elements to display in minimap')
        return false
      }
      
      const minimapConfig = {
        container: minimapContainer.value,
        elements: elements,
        style: mainCy.style(),
        layout: { name: 'preset' },
        userZoomingEnabled: false,
        userPanningEnabled: false,
        boxSelectionEnabled: false,
        autoungrabify: true,
        minZoom: 0.1,
        maxZoom: 1,
        wheelSensitivity: 0
      }
      
      console.log('⚙️ Creating minimap Cytoscape instance...')
      minimapCy.value = cytoscape(minimapConfig)
      console.log('✅ Minimap instance created successfully')
      
      // Always keep minimap fitted to show entire graph
      minimapCy.value.fit()
      console.log('🎯 Minimap fitted to show full graph')
      
      // Setup click-to-navigate functionality
      minimapCy.value.on('tap', (event: any) => {
        if (event.target === minimapCy.value && mainCy) {
          try {
            console.log('🖱️ Minimap clicked - centering main view')
            const clickPos = event.position
            
            // Calculate scale difference between minimap and main view
            const minimapBB = minimapCy.value.elements().boundingBox()
            const mainBB = mainCy.elements().boundingBox()
            
            // Calculate relative position clicked (0-1 scale)
            const relativeX = (clickPos.x - minimapBB.x1) / (minimapBB.x2 - minimapBB.x1)
            const relativeY = (clickPos.y - minimapBB.y1) / (minimapBB.y2 - minimapBB.y1)
            
            // Convert to main view coordinates
            const targetX = mainBB.x1 + relativeX * (mainBB.x2 - mainBB.x1)
            const targetY = mainBB.y1 + relativeY * (mainBB.y2 - mainBB.y1)
            
            // Center main view on this position
            mainCy.center({ x: targetX, y: targetY })
            console.log('✅ Main view centered on clicked position')
            
          } catch (error) {
            console.error('❌ Error centering main view:', error)
          }
        }
      })
      
      // Add hover effects
      minimapCy.value.on('mouseover', () => {
        if (minimapContainer.value) {
          minimapContainer.value.style.cursor = 'pointer'
        }
      })
      
      minimapCy.value.on('mouseout', () => {
        if (minimapContainer.value) {
          minimapContainer.value.style.cursor = 'default'
        }
      })

      console.log('🎉 Minimap initialization completed successfully')
      return true
      
    } catch (error) {
      console.error('❌ Failed to initialize minimap:', error)
      return false
    }
  }

  function updateMinimap(mainCy: any) {
    if (!minimapCy.value || !mainCy) return false

    try {
      console.log('🔄 Updating minimap with new data')
      minimapCy.value.elements().remove()
      minimapCy.value.add(mainCy.elements().jsons())
      minimapCy.value.layout({ name: 'preset' }).run()
      minimapCy.value.fit()
      return true
    } catch (error) {
      console.error('❌ Error updating minimap:', error)
      return false
    }
  }

  function setupViewportIndicator() {
    if (!minimapCy.value || !viewportIndicator.value) return false
    
    console.log('🎯 Setting up HTML viewport indicator...')
    
    try {
      viewportIndicator.value.style.display = 'block'
      console.log('✅ HTML viewport indicator enabled')
      return true
    } catch (error) {
      console.warn('⚠️ Error setting up HTML viewport indicator:', error)
      return false
    }
  }

  function syncMinimapViewport(mainCy: any) {
    if (!mainCy || !minimapCy.value || !viewportIndicator.value || !minimapContainer.value) return false
    
    try {
      // Get dimensions
      const minimapWidth = minimapContainer.value.clientWidth
      const minimapHeight = minimapContainer.value.clientHeight
      const mainContainer = mainCy.container()
      const mainWidth = mainContainer.clientWidth
      const mainHeight = mainContainer.clientHeight
      
      // Get current viewport info
      const mainPan = mainCy.pan()
      const mainZoom = mainCy.zoom()
      
      // Validate values
      if (!mainZoom || mainZoom <= 0 || isNaN(mainZoom)) return false
      if (!mainPan || isNaN(mainPan.x) || isNaN(mainPan.y)) return false
      
      // Get extents
      const mainExtent = mainCy.elements().boundingBox()
      const minimapExtent = minimapCy.value.elements().boundingBox()
      
      if (!mainExtent || !minimapExtent || mainExtent.w === 0 || mainExtent.h === 0) return false
      
      // Calculate visible area
      const visibleMainWidth = mainWidth / mainZoom
      const visibleMainHeight = mainHeight / mainZoom
      
      // Calculate viewport center
      const viewportCenterX = -mainPan.x / mainZoom + mainWidth / (2 * mainZoom)
      const viewportCenterY = -mainPan.y / mainZoom + mainHeight / (2 * mainZoom)
      
      // Convert to minimap coordinates
      const minimapScaleX = minimapWidth / minimapExtent.w
      const minimapScaleY = minimapHeight / minimapExtent.h
      const minimapCenterX = (viewportCenterX - minimapExtent.x1) * minimapScaleX
      const minimapCenterY = (viewportCenterY - minimapExtent.y1) * minimapScaleY
      
      // Calculate indicator size
      const indicatorWidth = Math.min(minimapWidth, Math.max(8, visibleMainWidth * minimapScaleX))
      const indicatorHeight = Math.min(minimapHeight, Math.max(8, visibleMainHeight * minimapScaleY))
      
      // Position the indicator
      const left = Math.max(0, Math.min(minimapWidth - indicatorWidth, minimapCenterX - indicatorWidth / 2))
      const top = Math.max(0, Math.min(minimapHeight - indicatorHeight, minimapCenterY - indicatorHeight / 2))
      
      // Update if valid
      if (!isNaN(left) && !isNaN(top) && !isNaN(indicatorWidth) && !isNaN(indicatorHeight)) {
        viewportIndicator.value.style.left = `${left}px`
        viewportIndicator.value.style.top = `${top}px`
        viewportIndicator.value.style.width = `${indicatorWidth}px`
        viewportIndicator.value.style.height = `${indicatorHeight}px`
        viewportIndicator.value.style.display = 'block'
        viewportIndicator.value.style.visibility = 'visible'
        
        // Force repaint
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        viewportIndicator.value.offsetHeight
        
        return true
      } else {
        viewportIndicator.value.style.display = 'none'
        return false
      }
      
    } catch (error) {
      console.warn('⚠️ Error syncing viewport indicator:', error)
      return false
    }
  }

  function setupViewportSync(mainCy: any) {
    if (!mainCy || !minimapCy.value) return false

    try {
      // Remove old listeners
      mainCy.off('viewport pan zoom')
      
      // Add new listeners
      mainCy.on('viewport', () => syncMinimapViewport(mainCy))
      mainCy.on('pan', () => syncMinimapViewport(mainCy))
      mainCy.on('zoom', () => {
        setTimeout(() => {
          setupViewportIndicator()
          syncMinimapViewport(mainCy)
        }, 50)
      })

      // Initial sync
      setTimeout(() => {
        setupViewportIndicator()
        syncMinimapViewport(mainCy)
      }, 100)

      return true
    } catch (error) {
      console.error('❌ Error setting up viewport sync:', error)
      return false
    }
  }

  function toggleMinimap() {
    showMinimap.value = !showMinimap.value
    
    if (!showMinimap.value) {
      destroyMinimap()
    }
  }

  function destroyMinimap() {
    if (minimapCy.value) {
      try {
        minimapCy.value.removeAllListeners()
        minimapCy.value.destroy()
        console.log('✅ Minimap instance destroyed')
      } catch (error) {
        console.warn('⚠️ Error destroying minimap instance:', error)
      } finally {
        minimapCy.value = null
      }
    }
  }

  return {
    minimapCy,
    minimapContainer,
    viewportIndicator,
    showMinimap,
    initializeMinimap,
    updateMinimap,
    setupViewportIndicator,
    syncMinimapViewport,
    setupViewportSync,
    toggleMinimap,
    destroyMinimap
  }
}

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { toggleRasterLayer, removeAllLayersForYear, debugLayerPresence } from '../utils/layerManager';
import Legend from './Legend';
import './MapView.css';

const MapView = ({ isVisible, onBarangaySelect, selectedBarangay, selectedYear, activeLayers = [], mapRef }) => {
  const mapContainer = useRef(null);
  const map = mapRef || useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [barangayLSTData, setBarangayLSTData] = useState({});
  const hoveredBarangayId = useRef(null);
  const previousSelectedBarangay = useRef(null);
  const previousYear = useRef(selectedYear);
  const activeLayersRef = useRef(activeLayers);
  const selectedYearRef = useRef(selectedYear);

  // Keep refs in sync
  useEffect(() => {
    activeLayersRef.current = activeLayers;
    selectedYearRef.current = selectedYear;
  }, [activeLayers, selectedYear]);

  useEffect(() => {
    if (!isVisible || map.current) return;

    const VALENZUELA_CENTER = [120.9833, 14.7000];

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: VALENZUELA_CENTER,
      zoom: 13,
      attributionControl: false,
      // Aggressive WebGL context preservation
      preserveDrawingBuffer: true,
      failIfMajorPerformanceCaveat: false,
      antialias: false,
      maxTileCacheSize: 30,
      refreshExpiredTiles: false,
      fadeDuration: 0,
      crossSourceCollisions: false
    });

    // Handle WebGL context loss and restoration
    const handleContextLost = (e) => {
      console.warn('⚠️ WebGL context lost, attempting to restore...');
      e.preventDefault();
    };

    const handleContextRestored = () => {
      console.log('✅ WebGL context restored, attempting to restore layers...');
      if (!map.current) return;

      // Wait for map to be ready after context restore
      setTimeout(() => {
        if (!map.current || !map.current.isStyleLoaded()) {
          console.log('⚠️ Map style not loaded yet after context restore');
          return;
        }

        const currentActiveLayers = activeLayersRef.current;
        const currentYear = selectedYearRef.current;

        console.log(`🔄 Restoring ${currentActiveLayers.length} active layers for year ${currentYear}`);

        if (currentActiveLayers.length > 0) {
          const layerTypeMap = {
            'lst': 'lst',
            'ndvi': 'ndvi',
            'ndbi': 'ndbi',
            'dbscan': 'dbscan',
            'lst_5km': 'lst_5km',
            'ndvi_5km': 'ndvi_5km',
            'ndbi_5km': 'ndbi_5km'
          };

          currentActiveLayers.forEach(layerId => {
            const layerType = layerTypeMap[layerId];
            if (layerType) {
              console.log(`🔧 Restoring layer: ${layerId}`);
              try {
                toggleRasterLayer(map.current, layerType, currentYear, true, 0.7);
              } catch (error) {
                console.error(`Failed to restore layer ${layerId}:`, error);
              }
            }
          });
        }
      }, 2000); // Wait 2 seconds for everything to stabilize
    };

    const canvas = mapContainer.current.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Handle map loading errors
    map.current.on('error', (e) => {
      console.error('🗺️ Map error:', e);
      // Retry loading after a delay
      setTimeout(() => {
        if (map.current) {
          console.log('🔄 Retrying map load...');
          map.current.resize();
        }
      }, 2000);
    });

    // Load GeoJSON data after map loads
    map.current.on('load', async () => {
      console.log('✅ Map loaded successfully');
      setMapLoaded(true);

      // Load Valenzuela barangays
      try {
        const boundaryResponse = await fetch('/finalBorder.geojson');
        const boundaryData = await boundaryResponse.json();

        map.current.addSource('barangays', {
          type: 'geojson',
          data: boundaryData
        });

        // Barangay layers with highlighting
        map.current.addLayer({
          id: 'barangay-outline',
          type: 'line',
          source: 'barangays',
          paint: {
            'line-color': '#2c3e50',
            'line-width': 1.5,
            'line-opacity': 0.8
          }
        });

        // Hover highlight layer
        map.current.addLayer({
          id: 'barangay-hover',
          type: 'fill',
          source: 'barangays',
          filter: ['==', 'NAME', ''],
          paint: {
            'fill-color': '#667eea',
            'fill-opacity': 0.3
          }
        });

        // Selection highlight layer
        map.current.addLayer({
          id: 'barangay-selected',
          type: 'fill',
          source: 'barangays',
          filter: ['==', 'NAME', ''],
          paint: {
            'fill-color': '#764ba2',
            'fill-opacity': 0.4
          }
        });

        // Interaction layer
        map.current.addLayer({
          id: 'barangay-fill',
          type: 'fill',
          source: 'barangays',
          paint: {
            'fill-color': 'transparent',
            'fill-opacity': 0
          }
        });

        // Hover highlighting
        map.current.on('mousemove', 'barangay-fill', (e) => {
          if (e.features && e.features.length > 0) {
            const name = e.features[0].properties.NAME;
            if (hoveredBarangayId.current !== name) {
              hoveredBarangayId.current = name;
              map.current.setFilter('barangay-hover', ['==', 'NAME', name]);
            }
          }
        });

        map.current.on('mouseleave', 'barangay-fill', () => {
          hoveredBarangayId.current = null;
          map.current.setFilter('barangay-hover', ['==', 'NAME', '']);
        });

        // Cursor changes
        map.current.on('mouseenter', 'barangay-fill', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'barangay-fill', () => {
          map.current.getCanvas().style.cursor = '';
        });

        // Click handler - updates selection highlight and React state
        map.current.on('click', 'barangay-fill', (e) => {
          if (e.features && e.features.length > 0) {
            const name = e.features[0].properties.NAME;
            map.current.setFilter('barangay-selected', ['==', 'NAME', name]);
            onBarangaySelect(name);
          }
        });
      } catch (error) {
        console.error('Error loading barangays:', error);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isVisible, onBarangaySelect]);

  // Restore layers after barangay selection (if WebGL context was lost)
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedBarangay) return;

    // Wait a bit, then check if layers need restoration
    const timer = setTimeout(() => {
      if (!map.current || activeLayersRef.current.length === 0) return;

      const currentYear = selectedYearRef.current;
      const layersNeedRestoration = activeLayersRef.current.some(layerId => {
        const layerTypeMap = {
          'lst': 'lst', 'ndvi': 'ndvi', 'ndbi': 'ndbi',
          'dbscan': 'dbscan', 'lst_5km': 'lst_5km',
          'ndvi_5km': 'ndvi_5km', 'ndbi_5km': 'ndbi_5km'
        };
        const layerType = layerTypeMap[layerId];
        return layerType && !map.current.getLayer(`${layerType}-${currentYear}`);
      });

      if (layersNeedRestoration) {
        console.log('🔄 Restoring layers after barangay selection...');
        activeLayersRef.current.forEach(layerId => {
          const layerTypeMap = {
            'lst': 'lst', 'ndvi': 'ndvi', 'ndbi': 'ndbi',
            'dbscan': 'dbscan', 'lst_5km': 'lst_5km',
            'ndvi_5km': 'ndvi_5km', 'ndbi_5km': 'ndbi_5km'
          };
          const layerType = layerTypeMap[layerId];
          if (layerType && !map.current.getLayer(`${layerType}-${currentYear}`)) {
            toggleRasterLayer(map.current, layerType, currentYear, true, 0.7);
          }
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedBarangay, mapLoaded]);

  // Handle layer visibility changes with year transition cleanup
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Function to attempt layer updates with retries
    const attemptLayerUpdate = (retryCount = 0) => {
      // Check if map exists and is available
      if (!map.current) {
        console.log(`Map not available yet, waiting for layer updates... (attempt ${retryCount + 1})`);
        if (retryCount < 5) {
          setTimeout(() => attemptLayerUpdate(retryCount + 1), 1000);
        } else {
          console.error('❌ Failed to get map reference after 5 attempts');
        }
        return;
      }

      // Wait for style to be fully loaded
      if (!map.current.isStyleLoaded()) {
        console.log(`Style not loaded yet, waiting for layer updates... (attempt ${retryCount + 1})`);

        if (retryCount < 5) {
          setTimeout(() => attemptLayerUpdate(retryCount + 1), 1000);
        } else {
          console.error('❌ Failed to load map style after 5 attempts');
        }
        return;
      }

      // Smart layer management: only update what changed
      const layerTypeMap = {
        'lst': 'lst',
        'ndvi': 'ndvi',
        'ndbi': 'ndbi',
        'dbscan': 'dbscan',
        'lst_5km': 'lst_5km',
        'ndvi_5km': 'ndvi_5km',
        'ndbi_5km': 'ndbi_5km'
      };

      // Handle year change - remove old year layers only
      if (previousYear.current !== selectedYear) {
        removeAllLayersForYear(map.current, previousYear.current);
        previousYear.current = selectedYear;
      }

      // For each layer type, only toggle if needed
      Object.entries(layerTypeMap).forEach(([layerId, layerType]) => {
        const shouldBeActive = activeLayers.includes(layerId);
        const layerExists = map.current.getLayer(`${layerType}-${selectedYear}`);

        // Only act if current state doesn't match desired state
        if (shouldBeActive && !layerExists) {
          // Need to add layer
          toggleRasterLayer(map.current, layerType, selectedYear, true, 0.7);
        } else if (!shouldBeActive && layerExists) {
          // Need to remove layer
          toggleRasterLayer(map.current, layerType, selectedYear, false, 0.7);
        }
        // If shouldBeActive && layerExists OR !shouldBeActive && !layerExists: do nothing
      });
    };

    // Start the retry mechanism
    attemptLayerUpdate();
  }, [activeLayers, selectedYear, mapLoaded]);

  return (
    <div className={`map-container ${isVisible ? 'visible' : ''}`}>
      <div ref={mapContainer} className="map" />
      {!mapLoaded && isVisible && (
        <div className="map-loading">
          <div className="spinner"></div>
          <p>Loading map...</p>
        </div>
      )}
      {isVisible && <Legend activeLayers={activeLayers} />}
    </div>
  );
};

export default MapView;

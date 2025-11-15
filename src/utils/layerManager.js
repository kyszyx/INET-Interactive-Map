// Layer metadata with bounds calculated from geotransform
// GeoTransform format: (x_min, pixel_width, 0, y_max, 0, -pixel_height)

const LAYER_METADATA = {
  lst: {
    years: [2020, 2021, 2022, 2024, 2025],
    bounds: {
      // Cropped bounds (removed black borders) - 367x333 pixels
      west: 120.92572382,
      east: 121.02462834,
      north: 14.75833197,
      south: 14.66942872}
  },
  ndvi: {
    years: [2020, 2021, 2022, 2024, 2025],
    bounds: {
      // Cropped bounds (removed black borders)
      west: 120.92572382,
      east: 121.02462834,
      north: 14.75842180,
      south: 14.66868011}
  },
  ndbi: {
    years: [2020, 2021, 2022, 2024, 2025],
    bounds: {
      // Cropped bounds (removed black borders)
      west: 120.92572382,
      east: 121.02462834,
      north: 14.75842180,
      south: 14.66868011}
  },
  dbscan: {
    years: [2020, 2021, 2022, 2024, 2025],
    bounds: {
      // Full bounds from original DBSCAN TIF files (no cropping)
      // Preserves clusters in Lawang Bato, Punturin, and Bignay areas
      west: 120.92572382,
      east: 121.02462834,
      north: 14.75860147,
      south: 14.66859027
    }
  },
  lst_5km: {
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    bounds: {
      // Extended 5km-wide area for SUHI visualization - 713x667 pixels
      west: 120.87910126,
      east: 121.07123284,
      north: 14.80333757,
      south: 14.62358480
    }
  },
  ndvi_5km: {
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    bounds: {
      // Extended 5km-wide area - same as LST
      west: 120.87910126,
      east: 121.07123284,
      north: 14.80333757,
      south: 14.62358480
    }
  },
  ndbi_5km: {
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    bounds: {
      // Extended 5km-wide area - same as LST
      west: 120.87910126,
      east: 121.07123284,
      north: 14.80333757,
      south: 14.62358480
    }
  }
};

/**
 * Add a raster layer to the map
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {string} layerType - Type of layer (lst, ndvi, ndbi, suhi, dbscan)
 * @param {number} year - Year of data
 * @param {number} opacity - Layer opacity (0-1)
 */
export const addRasterLayer = (map, layerType, year, opacity = 0.7) => {
  const layerId = `${layerType}-${year}`;
  const sourceId = `${layerType}-source-${year}`;

  console.log(`🔍 Adding raster layer: ${layerId}`);

  // Check if layer metadata exists
  if (!LAYER_METADATA[layerType]) {
    console.error(`Unknown layer type: ${layerType}`);
    return;
  }

  // Check if year is available
  if (!LAYER_METADATA[layerType].years.includes(year)) {
    console.warn(`Year ${year} not available for ${layerType}`);
    return;
  }

  // Remove layer if it already exists
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }

  const bounds = LAYER_METADATA[layerType].bounds;
  const imageUrl = `/tiles/${layerType}_${year}.png`;

  console.log(`📷 Image URL: ${imageUrl}`);
  console.log(`📍 Bounds:`, bounds);

  // Add image source
  try {
    map.addSource(sourceId, {
      type: 'image',
      url: imageUrl,
      coordinates: [
        [bounds.west, bounds.north],  // top-left
        [bounds.east, bounds.north],  // top-right
        [bounds.east, bounds.south],  // bottom-right
        [bounds.west, bounds.south]   // bottom-left
      ]
    });

    console.log(`✅ Source added: ${sourceId}`);

    // Add raster layer
    map.addLayer({
      id: layerId,
      type: 'raster',
      source: sourceId,
      paint: {
        'raster-opacity': opacity,
        'raster-fade-duration': 300
      }
    }, 'barangay-fill'); // Insert below barangay polygons

    console.log(`✅ Layer added: ${layerId}`);
  } catch (error) {
    console.error(`❌ Error adding layer ${layerId}:`, error);
  }
};

/**
 * Remove a raster layer from the map
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {string} layerType - Type of layer
 * @param {number} year - Year of data
 */
export const removeRasterLayer = (map, layerType, year) => {
  const layerId = `${layerType}-${year}`;
  const sourceId = `${layerType}-source-${year}`;

  console.log(`🗑️ Attempting to remove layer ${layerId}`);
  if (map.getLayer(layerId)) {
    console.log(`✅ Layer ${layerId} found and removed`);
    map.removeLayer(layerId);
  } else {
    console.log(`⚠️ Layer ${layerId} not found, cannot remove`);
  }
  if (map.getSource(sourceId)) {
    console.log(`✅ Source ${sourceId} found and removed`);
    map.removeSource(sourceId);
  } else {
    console.log(`⚠️ Source ${sourceId} not found, cannot remove`);
  }
};

/**
 * Toggle layer visibility
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {string} layerType - Type of layer
 * @param {number} year - Year of data
 * @param {boolean} visible - Whether to show or hide the layer
 * @param {number} opacity - Layer opacity when visible
 */
export const toggleRasterLayer = (map, layerType, year, visible, opacity = 0.7) => {
  console.log(`🔄 Toggle layer ${layerType}-${year}: visible=${visible}`);
  if (visible) {
    addRasterLayer(map, layerType, year, opacity);
  } else {
    removeRasterLayer(map, layerType, year);
  }
};

/**
 * Update layer opacity
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {string} layerType - Type of layer
 * @param {number} year - Year of data
 * @param {number} opacity - New opacity value (0-1)
 */
export const updateLayerOpacity = (map, layerType, year, opacity) => {
  const layerId = `${layerType}-${year}`;
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity);
  }
};

/**
 * Remove all raster layers for a specific year
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {number} year - Year of data
 */
export const removeAllLayersForYear = (map, year) => {
  Object.keys(LAYER_METADATA).forEach(layerType => {
    removeRasterLayer(map, layerType, year);
  });
};

/**
 * Get available years for a layer type
 * @param {string} layerType - Type of layer
 * @returns {number[]} Array of available years
 */
export const getAvailableYears = (layerType) => {
  return LAYER_METADATA[layerType]?.years || [];
};

/**
 * Debug function to check if layers exist on the map
 * @param {maplibregl.Map} map - MapLibre map instance
 * @param {string[]} layerTypes - Array of layer types to check
 * @param {number} year - Year to check
 */
export const debugLayerPresence = (map, layerTypes, year) => {
  console.log(`🔍 Debugging layer presence for year ${year}:`);
  layerTypes.forEach(layerType => {
    const layerId = `${layerType}-${year}`;
    const sourceId = `${layerType}-source-${year}`;
    const hasLayer = map.getLayer(layerId);
    const hasSource = map.getSource(sourceId);
    console.log(`  ${layerId}: layer=${!!hasLayer}, source=${!!hasSource}`);
  });
};

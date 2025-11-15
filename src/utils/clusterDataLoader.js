/**
 * DBSCAN Cluster Data Loader
 * Extracts cluster information for specific barangays and years
 */

// Cluster color mapping (matches the palette in convert_tif_to_tiles.py)
const CLUSTER_COLORS = [
  { id: 0, color: 'rgb(255, 100, 50)', name: 'Orange' },
  { id: 1, color: 'rgb(50, 150, 255)', name: 'Blue' },
  { id: 2, color: 'rgb(255, 200, 50)', name: 'Yellow' },
  { id: 3, color: 'rgb(255, 50, 150)', name: 'Pink' },
  { id: 4, color: 'rgb(100, 255, 100)', name: 'Light Green' },
  { id: 5, color: 'rgb(200, 100, 255)', name: 'Purple' },
  { id: 6, color: 'rgb(255, 255, 100)', name: 'Light Yellow' },
  { id: 7, color: 'rgb(100, 255, 255)', name: 'Cyan' },
  { id: 8, color: 'rgb(255, 150, 100)', name: 'Light Orange' },
  { id: 9, color: 'rgb(180, 180, 180)', name: 'Light Gray' },
  { id: 10, color: 'rgb(150, 50, 50)', name: 'Dark Red' },
  { id: 11, color: 'rgb(50, 150, 50)', name: 'Dark Green' },
  { id: 12, color: 'rgb(50, 50, 150)', name: 'Dark Blue' },
  { id: 13, color: 'rgb(150, 150, 50)', name: 'Dark Yellow' },
  { id: 14, color: 'rgb(150, 50, 150)', name: 'Magenta' },
  { id: 15, color: 'rgb(255, 165, 0)', name: 'Orange Red' },
  { id: 16, color: 'rgb(0, 128, 128)', name: 'Teal' },
  { id: 17, color: 'rgb(128, 0, 128)', name: 'Deep Purple' },
  { id: 18, color: 'rgb(128, 128, 0)', name: 'Olive' },
  { id: 19, color: 'rgb(255, 20, 147)', name: 'Deep Pink' },
  { id: 20, color: 'rgb(0, 191, 255)', name: 'Deep Sky Blue' },
  { id: 21, color: 'rgb(50, 205, 50)', name: 'Lime Green' },
  { id: 22, color: 'rgb(255, 140, 0)', name: 'Dark Orange' },
  { id: 23, color: 'rgb(139, 69, 19)', name: 'Saddle Brown' },
  { id: 24, color: 'rgb(75, 0, 130)', name: 'Indigo' }
];

/**
 * Get cluster color by ID
 * @param {number} clusterId - Cluster ID
 * @returns {Object} Cluster color info
 */
export const getClusterColor = (clusterId) => {
  return CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
};

/**
 * Get all cluster information for a specific year (static city-wide data)
 * This shows ALL clusters across Valenzuela City for the selected year
 * @param {number} year - Year
 * @returns {Promise<Object>} Year-wide cluster information
 */
export const getYearClusterData = async (year) => {
  // Load real cluster data extracted from actual LST temperature analysis
  // DBSCAN clusters represent the HOTTEST 15% (85th percentile+) of pixels
  // Therefore cluster temperatures are significantly higher than city average
  try {
    // Fetch clean cluster data from public directory (no incorrect barangay assignments)
    const response = await fetch('/cluster_data_clean.json');
    const allClusterData = await response.json();

    const yearClusterData = allClusterData[year] || [];

    // Add color information to each cluster
    const clusterDataWithColors = yearClusterData.map(cluster => ({
      ...cluster,
      color: getClusterColor(cluster.id)
    }));

    // Calculate summary statistics
    const totalPixels = clusterDataWithColors.reduce((sum, cluster) => sum + cluster.pixelCount, 0);
    const totalArea = clusterDataWithColors.reduce((sum, cluster) => sum + cluster.area, 0);
    const avgTemp = clusterDataWithColors.length > 0
      ? clusterDataWithColors.reduce((sum, cluster) => sum + (cluster.avgTemp * cluster.pixelCount), 0) / totalPixels
      : null;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      clusters: clusterDataWithColors,
      totalPixels,
      totalArea,
      avgTemp,
      clusterCount: clusterDataWithColors.length
    };

  } catch (error) {
    console.error('Error loading cluster data:', error);
    // Fallback to empty data if file loading fails
    return {
      clusters: [],
      totalPixels: 0,
      totalArea: 0,
      avgTemp: null,
      clusterCount: 0
    };
  }
};

/**
 * Get cluster statistics for a year
 * @param {number} year - Year
 * @returns {Promise<Object>} Year cluster statistics
 */
export const getYearClusterStats = async (year) => {
  try {
    // Load clean cluster data (no incorrect barangay assignments)
    const response = await fetch('/cluster_data_clean.json');
    const allClusterData = await response.json();

    const yearClusterData = allClusterData[year] || [];

    // Calculate statistics from real data
    const totalClusters = yearClusterData.length;
    const totalPixels = yearClusterData.reduce((sum, cluster) => sum + cluster.pixelCount, 0);
    const avgTemp = totalPixels > 0
      ? yearClusterData.reduce((sum, cluster) => sum + (cluster.avgTemp * cluster.pixelCount), 0) / totalPixels
      : null;

    await new Promise(resolve => setTimeout(resolve, 50));

    return { totalClusters, totalPixels, avgTemp };

  } catch (error) {
    console.error('Error loading cluster statistics:', error);
    return { totalClusters: 0, totalPixels: 0, avgTemp: null };
  }
};
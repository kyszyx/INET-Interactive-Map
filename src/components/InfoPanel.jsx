import './InfoPanel.css';
import { getClusterColor } from '../utils/clusterDataLoader';

const InfoPanel = ({ barangay, data, year, activeLayers, clusterData }) => {
  // Total pixels in Valenzuela City
  const VALENZUELA_TOTAL_PIXELS = 122578;

  // Show DBSCAN clusters when active, regardless of barangay selection
  const showDBSCANClusters = activeLayers?.includes('dbscan') && clusterData && clusterData.clusters && clusterData.clusters.length > 0;

  if (!barangay && !showDBSCANClusters) {
    return (
      <div className="info-panel">
        <div className="info-content">
          <h3>Select a Barangay</h3>
          <p className="info-hint">Click on any barangay to view its data</p>
        </div>
      </div>
    );
  }

  // Safely format temperature values
  const formatTemp = (temp) => {
    if (temp === null || temp === undefined || isNaN(temp)) return 'N/A';
    return Number(temp).toFixed(2);
  };

  const formatTempRange = (temp) => {
    if (temp === null || temp === undefined || isNaN(temp)) return 'N/A';
    return Number(temp).toFixed(1);
  };

  // Calculate percentage of Valenzuela City area
  const calculateAreaPercentage = (pixelCount) => {
    if (!pixelCount || pixelCount === 0) return '0.00';
    return ((pixelCount / VALENZUELA_TOTAL_PIXELS) * 100).toFixed(2);
  };

  return (
    <div className="info-panel active">
      <div className="info-content">
        <div className="info-header">
          <h3>{barangay || (showDBSCANClusters ? `DBSCAN Clusters ${year}` : 'Select a Barangay')}</h3>
          {barangay && <span className="info-year">{year}</span>}
        </div>

        {/* Show message if barangay selected but no data for this year */}
        {barangay && !data && (
          <div className="info-stats">
            <p className="info-hint" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
              No data available for {barangay} in {year}
            </p>
          </div>
        )}

        {/* Show barangay stats only if a barangay is selected AND data exists */}
        {barangay && data && (
          <div className="info-stats">
            <div className="stat-item">
              <div className="stat-icon temperature-icon">🌡️</div>
              <div className="stat-details">
                <span className="stat-label">Average LST</span>
                <span className="stat-value">{formatTemp(data.temperature)}°C</span>
              </div>
            </div>

            {(data.minTemperature !== undefined && data.maxTemperature !== undefined) && (
              <div className="stat-item">
                <div className="stat-icon temp-range-icon">📊</div>
                <div className="stat-details">
                  <span className="stat-label">LST Range</span>
                  <span className="stat-value">
                    {formatTempRange(data.minTemperature)}° - {formatTempRange(data.maxTemperature)}°C
                  </span>
                </div>
              </div>
            )}

            <div className="stat-item">
              <div className="stat-icon population-icon">👥</div>
              <div className="stat-details">
                <span className="stat-label">Population</span>
                <span className="stat-value">
                  {typeof data.population === 'number'
                    ? data.population.toLocaleString()
                    : data.population || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DBSCAN Cluster Information - Static city-wide data, only show when DBSCAN layer is active */}
        {activeLayers?.includes('dbscan') && clusterData && clusterData.clusters && clusterData.clusters.length > 0 && (
          <div className="cluster-info">
            <div className="cluster-header">
              <div className="stat-icon cluster-icon">🎯</div>
              <h4>DBSCAN Clusters {year}</h4>
            </div>

            <div className="cluster-summary">
              <div className="cluster-stat">
                <span className="cluster-stat-label">Total Area</span>
                <span className="cluster-stat-value">{clusterData.totalArea.toFixed(1)} ha</span>
              </div>
              <div className="cluster-stat">
                <span className="cluster-stat-label">Coverage</span>
                <span className="cluster-stat-value">{calculateAreaPercentage(clusterData.totalPixels)}%</span>
              </div>
              {clusterData.avgTemp && (
                <div className="cluster-stat">
                  <span className="cluster-stat-label">City Avg</span>
                  <span className="cluster-stat-value">{formatTemp(clusterData.avgTemp)}°C</span>
                </div>
              )}
            </div>

            <div className="cluster-list">
              {clusterData.clusters.filter(cluster => cluster.avgTemp <= 60).map((cluster, index) => (
                <div key={cluster.id} className="cluster-item">
                  <div
                    className="cluster-color-box"
                    style={{ backgroundColor: cluster.color.color }}
                    title={`Rank ${index} - ${cluster.color.name} (${formatTemp(cluster.avgTemp)}°C)`}
                  ></div>
                  <div className="cluster-details">
                    <div className="cluster-header-info">
                      <span className="cluster-id">Cluster {index}</span>
                      <span className="cluster-area">{cluster.area.toFixed(1)} ha</span>
                    </div>
                    <div className="cluster-stats">
                      <span className="cluster-pixels">{calculateAreaPercentage(cluster.pixelCount)}% of city</span>
                      <span className="cluster-temp">{formatTemp(cluster.avgTemp)}°C</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;

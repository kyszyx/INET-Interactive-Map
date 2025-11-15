import { useState } from 'react';
import './Legend.css';

const Legend = ({ activeLayers }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const legends = {
    lst: {
      name: 'LST',
      fullName: 'Land Surface Temperature',
      gradient: 'linear-gradient(to right, #0000ff, #ffff00, #ff0000)',
      labels: ['Cool', 'Warm', 'Hot'],
      unit: '°C'
    },
    ndvi: {
      name: 'NDVI',
      fullName: 'Vegetation Index',
      gradient: 'linear-gradient(to right, #440154, #31688e, #35b779, #fde724)',
      labels: ['Urban/Bare', 'Low Vegetation', 'Moderate', 'Dense Vegetation'],
      unit: ''
    },
    ndbi: {
      name: 'NDBI',
      fullName: 'Built-up Index',
      gradient: 'linear-gradient(to right, #00ffff, #80ff80, #ffff00, #ff8000, #ff0000)',
      labels: ['Non-Built-up', 'Low Density', 'Moderate', 'High Density', 'Dense Built-up'],
      unit: ''
    },
    lst_5km: {
      name: 'LST (5km-wide area)',
      fullName: 'LST - Urban + 5km-wide area',
      gradient: 'linear-gradient(to right, #0000ff, #ffff00, #ff0000)',
      labels: ['Cool', 'Warm', 'Hot'],
      unit: '°C'
    },
    ndvi_5km: {
      name: 'NDVI (5km-wide area)',
      fullName: 'Vegetation Index - 5km-wide area',
      gradient: 'linear-gradient(to right, #440154, #31688e, #35b779, #fde724)',
      labels: ['Urban/Bare', 'Low Vegetation', 'Moderate', 'Dense Vegetation'],
      unit: ''
    },
    ndbi_5km: {
      name: 'NDBI (5km-wide area)',
      fullName: 'Built-up Index - 5km-wide area',
      gradient: 'linear-gradient(to right, #00ffff, #80ff80, #ffff00, #ff8000, #ff0000)',
      labels: ['Non-Built-up', 'Low Density', 'Moderate', 'High Density', 'Dense Built-up'],
      unit: ''
    }
  };

  const activeLegends = activeLayers.filter(layer => legends[layer]);

  if (activeLegends.length === 0) {
    return null;
  }

  return (
    <div className={`legend-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="legend-header">
        <h3>Legend</h3>
        <button
          className="legend-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '▲' : '▼'}
        </button>
      </div>

      <div className="legend-content">
        {activeLegends.map(layerId => {
          const legend = legends[layerId];
          return (
            <div key={layerId} className="legend-item">
              <div className="legend-title">
                <span className="legend-name">{legend.name}</span>
                <span className="legend-full-name">{legend.fullName}</span>
              </div>
              <div className="legend-gradient-wrapper">
                <div
                  className="legend-gradient"
                  style={{ background: legend.gradient }}
                ></div>
                <div className="legend-labels">
                  {legend.labels.map((label, index) => (
                    <span key={index} className="legend-label">{label}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Legend;

import { useState } from 'react';
import './LayerControl.css';

const LayerControl = ({ onLayerToggle, activeLayers }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const togglePanel = () => {
    setIsCollapsed(!isCollapsed);
  };

  const layers = [
    {
      id: 'lst',
      name: 'LST',
      fullName: 'Land Surface Temperature',
      icon: '🌡️',
      color: '#ff6b6b'
    },
    {
      id: 'ndvi',
      name: 'NDVI',
      fullName: 'Normalized Difference Vegetation Index',
      icon: '🌿',
      color: '#51cf66'
    },
    {
      id: 'ndbi',
      name: 'NDBI',
      fullName: 'Normalized Difference Built-up Index',
      icon: '🏢',
      color: '#868e96'
    },
    {
      id: 'dbscan',
      name: 'DBSCAN',
      fullName: 'Density-Based Spatial Clustering',
      icon: '🎯',
      color: '#4c6ef5'
    }
  ];

  const buffer5kmLayers = [
    {
      id: 'lst_5km',
      name: 'LST (5km-wide area)',
      fullName: 'LST - Urban + 5km-wide area for SUHI Analysis',
      icon: '🌡️',
      color: '#ff6b6b'
    },
    {
      id: 'ndvi_5km',
      name: 'NDVI (5km-wide area)',
      fullName: 'NDVI - Urban + 5km-wide area',
      icon: '🌿',
      color: '#51cf66'
    },
    {
      id: 'ndbi_5km',
      name: 'NDBI (5km-wide area)',
      fullName: 'NDBI - Urban + 5km-wide area',
      icon: '🏢',
      color: '#868e96'
    }
  ];

  const handleToggle = (layerId) => {
    onLayerToggle(layerId);
  };

  return (
    <>
      <button
        className={`layer-toggle-btn ${!isCollapsed ? 'panel-open' : ''}`}
        onClick={togglePanel}
        title={isCollapsed ? 'Show Layers' : 'Hide Layers'}
      >
        {isCollapsed ? '☰' : '✕'}
      </button>

      <div className={`layer-control ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="layer-control-header">
          <h3>Data Layers</h3>
        </div>

      <div className="layer-control-content">
        <div className="layer-section">
          <div className="layer-section-title">Primary Layers</div>
          {layers.map((layer) => {
            const isActive = activeLayers.includes(layer.id);
            return (
              <div
                key={layer.id}
                className={`layer-item ${isActive ? 'active' : ''}`}
                onClick={() => handleToggle(layer.id)}
              >
                <div className="layer-item-header">
                  <div className="layer-icon" style={{ color: layer.color }}>
                    {layer.icon}
                  </div>
                  <div className="layer-info">
                    <span className="layer-name">{layer.name}</span>
                    <span className="layer-full-name">{layer.fullName}</span>
                  </div>
                </div>
                <div className="layer-toggle">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => handleToggle(layer.id)}
                    className="layer-checkbox"
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="layer-section">
          <div className="layer-section-title">Extended Area Layers (SUHI Analysis)</div>
          {buffer5kmLayers.map((layer) => {
            const isActive = activeLayers.includes(layer.id);
            return (
              <div
                key={layer.id}
                className={`layer-item ${isActive ? 'active' : ''}`}
                onClick={() => handleToggle(layer.id)}
              >
                <div className="layer-item-header">
                  <div className="layer-icon" style={{ color: layer.color }}>
                    {layer.icon}
                  </div>
                  <div className="layer-info">
                    <span className="layer-name">{layer.name}</span>
                    <span className="layer-full-name">{layer.fullName}</span>
                  </div>
                </div>
                <div className="layer-toggle">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => handleToggle(layer.id)}
                    className="layer-checkbox"
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="layer-control-footer">
        <button
          className="clear-all-btn"
          onClick={() => onLayerToggle('clear-all')}
        >
          Clear All Layers
        </button>
      </div>
      </div>
    </>
  );
};

export default LayerControl;

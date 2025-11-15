import { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import YearSelector from './components/YearSelector';
import LayerControl from './components/LayerControl';
import Navigation from './components/Navigation';
import AboutPage from './components/AboutPage';
import InfoFAQPage from './components/InfoFAQPage';
import FindingsPage from './components/FindingsPage';
import ExportButton from './components/ExportButton';
import { loadBarangayLSTData, getPopulationData } from './utils/dataLoader';
import { getYearClusterData } from './utils/clusterDataLoader';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'map', 'about', 'info', 'findings'
  const [showMap, setShowMap] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [activeLayers, setActiveLayers] = useState([]);
  const [barangayLSTData, setBarangayLSTData] = useState({});
  const [clusterData, setClusterData] = useState(null);
  const mapRef = useRef(null);
  const exportClickRef = useRef(null);

  // Load LST data when year changes
  useEffect(() => {
    if (showMap) {
      loadBarangayLSTData(selectedYear).then(setBarangayLSTData);
    }
  }, [selectedYear, showMap]);

  // Load cluster data when year changes (only if DBSCAN is active) - Static city-wide data
  useEffect(() => {
    if (activeLayers.includes('dbscan') && showMap) {
      getYearClusterData(selectedYear)
        .then(setClusterData)
        .catch(error => {
          console.error('Error loading cluster data:', error);
          setClusterData(null);
        });
    } else {
      // Clear cluster data if DBSCAN is not active
      setClusterData(null);
    }
  }, [selectedYear, activeLayers, showMap]);

  const handleDragComplete = () => {
    setShowMap(true);
    setCurrentPage('map');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBarangaySelect = (barangayName) => {
    setSelectedBarangay(barangayName);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleLayerToggle = (layerId) => {
    if (layerId === 'clear-all') {
      setActiveLayers([]);
    } else {
      setActiveLayers((prev) =>
        prev.includes(layerId)
          ? prev.filter((id) => id !== layerId)
          : [...prev, layerId]
      );
    }
  };

  // Combine LST data with population data
  const currentBarangayData = selectedBarangay && barangayLSTData[selectedBarangay]
    ? {
        temperature: barangayLSTData[selectedBarangay].avgLST,
        minTemperature: barangayLSTData[selectedBarangay].minLST,
        maxTemperature: barangayLSTData[selectedBarangay].maxLST,
        population: getPopulationData(selectedYear)[selectedBarangay] || 'N/A'
      }
    : null;

  // Removed debug logging to prevent render overhead

  const handleExportClick = () => {
    if (exportClickRef.current) {
      exportClickRef.current();
    }
  };

  return (
    <div className={`app-container ${currentPage === 'about' || currentPage === 'info' || currentPage === 'findings' ? 'scrollable' : ''}`}>
      {currentPage !== 'landing' && (
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          showExportButton={currentPage === 'map'}
          onExportClick={handleExportClick}
        />
      )}

      {currentPage === 'landing' && (
        <LandingPage
          onDragComplete={handleDragComplete}
          dragOffset={dragOffset}
          setDragOffset={setDragOffset}
          isHidden={showMap}
        />
      )}

      {currentPage === 'map' && (
        <>
          <MapView
            isVisible={true}
            onBarangaySelect={handleBarangaySelect}
            selectedBarangay={selectedBarangay}
            selectedYear={selectedYear}
            activeLayers={activeLayers}
            mapRef={mapRef}
          />
          <LayerControl
            onLayerToggle={handleLayerToggle}
            activeLayers={activeLayers}
          />
          <InfoPanel
            barangay={selectedBarangay}
            data={currentBarangayData}
            year={selectedYear}
            activeLayers={activeLayers}
            clusterData={clusterData}
          />
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
          <ExportButton mapRef={mapRef} onExportClick={exportClickRef} />
        </>
      )}

      {currentPage === 'about' && <AboutPage />}

      {currentPage === 'info' && <InfoFAQPage />}

      {currentPage === 'findings' && <FindingsPage />}
    </div>
  );
}

export default App;

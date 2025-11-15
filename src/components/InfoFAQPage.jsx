import { useState } from 'react';
import './InfoFAQPage.css';

const InfoFAQPage = () => {
  const [openSection, setOpenSection] = useState('lst');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="info-faq-page">
      <div className="info-faq-container">
        <h1>Information & FAQ</h1>
        <p className="subtitle">Understanding the Data Layers</p>

        <div className="faq-sections">
          {/* LST Section */}
          <div className="faq-item">
            <div
              className={`faq-header ${openSection === 'lst' ? 'active' : ''}`}
              onClick={() => toggleSection('lst')}
            >
              <h2>What is LST (Land Surface Temperature)?</h2>
              <span className="toggle-icon">{openSection === 'lst' ? '−' : '+'}</span>
            </div>
            {openSection === 'lst' && (
              <div className="faq-content">
                <p>
                  <strong>Land Surface Temperature (LST)</strong> is the temperature of the Earth's surface
                  as measured by satellite sensors. Unlike air temperature, LST represents how hot the
                  ground, buildings, and other surfaces actually are.
                </p>
                <h3>Why is LST Important?</h3>
                <ul>
                  <li>Identifies urban heat islands where temperatures are significantly higher</li>
                  <li>Helps assess thermal comfort and heat stress risks</li>
                  <li>Guides urban planning decisions for heat mitigation strategies</li>
                  <li>Tracks long-term climate trends and urbanization impacts</li>
                </ul>
                <h3>How is LST Measured?</h3>
                <p>
                  LST is derived from Landsat 8/9 satellite imagery using thermal infrared bands.
                  The data is processed to convert digital numbers into temperature values in degrees Celsius.
                </p>
                <h3>Temperature Range</h3>
                <p>
                  In Valenzuela City, LST typically ranges from 29°C to 55°C, with higher values
                  indicating heat stress areas that may require intervention. It has been limited to 55°C since data from satellite imagery temperature peaks up to 70-80°C which is considered as noise or unrealistic.
                </p>
              </div>
            )}
          </div>

          {/* NDVI Section */}
          <div className="faq-item">
            <div
              className={`faq-header ${openSection === 'ndvi' ? 'active' : ''}`}
              onClick={() => toggleSection('ndvi')}
            >
              <h2>What is NDVI (Normalized Difference Vegetation Index)?</h2>
              <span className="toggle-icon">{openSection === 'ndvi' ? '−' : '+'}</span>
            </div>
            {openSection === 'ndvi' && (
              <div className="faq-content">
                <p>
                  <strong>NDVI</strong> is a numerical indicator that measures the presence and health
                  of vegetation using satellite imagery derived from Sentinel-2 Copernicus Satellite. It ranges from -1 to +1.
                </p>
                <h3>NDVI Value Interpretation</h3>
                <ul>
                  <li><strong>-1 to 0:</strong> Water bodies, bare soil, or urban areas</li>
                  <li><strong>0 to 0.2:</strong> Bare soil, rock, sand, or sparse vegetation</li>
                  <li><strong>0.2 to 0.5:</strong> Shrubs, grassland, or unhealthy vegetation</li>
                  <li><strong>0.5 to 1.0:</strong> Dense, healthy vegetation (forests, parks)</li>
                </ul>
                <h3>Why Monitor NDVI?</h3>
                <ul>
                  <li>Vegetation provides natural cooling through evapotranspiration</li>
                  <li>Green spaces reduce urban heat island effects</li>
                  <li>Tracks deforestation and urban expansion</li>
                  <li>Identifies areas that need greening interventions</li>
                </ul>
                <h3>Calculation</h3>
                <p>
                  NDVI = (NIR - Red) / (NIR + Red), where NIR is Near-Infrared reflectance
                  and Red is visible red reflectance from Landsat bands.
                </p>
              </div>
            )}
          </div>

          {/* NDBI Section */}
          <div className="faq-item">
            <div
              className={`faq-header ${openSection === 'ndbi' ? 'active' : ''}`}
              onClick={() => toggleSection('ndbi')}
            >
              <h2>What is NDBI (Normalized Difference Built-up Index)?</h2>
              <span className="toggle-icon">{openSection === 'ndbi' ? '−' : '+'}</span>
            </div>
            {openSection === 'ndbi' && (
              <div className="faq-content">
                <p>
                  <strong>NDBI</strong> is an index that highlights built-up areas (buildings, roads,
                  concrete) by using the spectral differences between built surfaces and natural areas.
                  Values range from -1 to +1. Derived from Sentinel-2 Copernicus Satellite
                </p>
                <h3>NDBI Value Interpretation</h3>
                <ul>
                  <li><strong>-1 to 0:</strong> Water bodies, vegetation, natural areas</li>
                  <li><strong>0 to 0.3:</strong> Mixed areas with low built-up density</li>
                  <li><strong>0.3 to 0.6:</strong> Moderate built-up areas (residential)</li>
                  <li><strong>0.6 to 1.0:</strong> Dense urban areas (commercial, industrial)</li>
                </ul>
                <h3>Why is NDBI Important?</h3>
                <ul>
                  <li>Built-up surfaces absorb and retain more heat than natural surfaces</li>
                  <li>Identifies rapidly urbanizing areas</li>
                  <li>Helps plan green infrastructure interventions</li>
                  <li>Correlates strongly with surface temperature increases</li>
                </ul>
                <h3>Calculation</h3>
                <p>
                  NDBI = (SWIR - NIR) / (SWIR + NIR), where SWIR is Shortwave Infrared
                  and NIR is Near-Infrared reflectance from Landsat bands.
                </p>
              </div>
            )}
          </div>

          {/* SUHI Section */}
          <div className="faq-item">
            <div
              className={`faq-header ${openSection === 'suhi' ? 'active' : ''}`}
              onClick={() => toggleSection('suhi')}
            >
              <h2>How is SUHI (Surface Urban Heat Island) Calculated?</h2>
              <span className="toggle-icon">{openSection === 'suhi' ? '−' : '+'}</span>
            </div>
            {openSection === 'suhi' && (
              <div className="faq-content">
                <p>
                  <strong>Surface Urban Heat Island (SUHI) intensity</strong> measures how much hotter
                  urban areas are compared to surrounding rural or natural areas.
                </p>
                <h3>Calculation Method</h3>
                <p>
                  SUHI is calculated by subtracting the mean LST of rural reference areas from the
                  LST of each pixel:
                </p>
                <p className="formula">
                  SUHI = LST<sub>urban</sub> - LST<sub>rural_mean</sub>
                </p>
                <h3>Data Processing Steps</h3>
                <ol>
                  <li>
                    <strong>Rural Reference Selection:</strong> Areas with NDVI &gt; 0.5 and NDBI &lt; 0
                    are identified as rural/natural reference zones
                  </li>
                  <li>
                    <strong>Mean Rural Temperature:</strong> Calculate the average LST of all rural pixels
                  </li>
                  <li>
                    <strong>SUHI Calculation:</strong> Subtract rural mean from each pixel's LST
                  </li>
                  <li>
                    <strong>Visualization:</strong> Positive values show urban heat island effect
                  </li>
                </ol>
                <h3>Interpretation</h3>
                <ul>
                  <li><strong>Negative values:</strong> Cooler than rural areas (parks, water)</li>
                  <li><strong>0:</strong> Same as rural temperature</li>
                  <li><strong>Positive values:</strong> Urban heat island effect (buildings, roads)</li>
                  <li><strong>High positive values (&gt;5°C):</strong> Severe heat island requiring intervention</li>
                </ul>
                <h3>Data Source</h3>
                <p>
                  SUHI data was processed using Google Earth Engine with Landsat 8/9 imagery,
                  applying atmospheric correction and cloud masking before calculation.
                </p>
              </div>
            )}
          </div>

          {/* DBSCAN Section */}
          <div className="faq-item">
            <div
              className={`faq-header ${openSection === 'dbscan' ? 'active' : ''}`}
              onClick={() => toggleSection('dbscan')}
            >
              <h2>What is DBSCAN Clustering?</h2>
              <span className="toggle-icon">{openSection === 'dbscan' ? '−' : '+'}</span>
            </div>
            {openSection === 'dbscan' && (
              <div className="faq-content">
                <p>
                  <strong>DBSCAN (Density-Based Spatial Clustering of Applications with Noise)</strong>
                  is a machine learning algorithm used to identify hotspot clusters in the LST data.
                </p>
                <h3>How it Works</h3>
                <p>
                  The algorithm groups together pixels with high LST values that are spatially close
                  to each other, forming distinct clusters that represent concentrated heat zones.
                </p>
                <h3>Cluster Identification</h3>
                <ul>
                  <li>Each cluster represents a continuous area of elevated temperature</li>
                  <li>Clusters are color-coded for easy identification</li>
                  <li>Noise points (isolated hot pixels) are excluded</li>
                  <li>Cluster size and intensity vary by year and location</li>
                </ul>
                <h3>Practical Applications</h3>
                <ul>
                  <li>Prioritize areas for urban greening interventions</li>
                  <li>Target heat mitigation strategies to specific neighborhoods</li>
                  <li>Track how heat clusters evolve over time</li>
                  <li>Support evidence-based urban planning decisions</li>
                </ul>
              </div>
            )}
          </div>

          {/* General FAQ */}
          <div className="faq-item">
            <div
              className={`faq-header ${openSection === 'general' ? 'active' : ''}`}
              onClick={() => toggleSection('general')}
            >
              <h2>General Questions</h2>
              <span className="toggle-icon">{openSection === 'general' ? '−' : '+'}</span>
            </div>
            {openSection === 'general' && (
              <div className="faq-content">
                <h3>Why is 2023 data missing?</h3>
                <p>
                  The source satellite imagery for 2023 was not available or did not meet quality
                  standards (cloud-free, complete coverage) at the time of data collection. 2023 example and image could be seen in our paper. (Link to the paper if meron na)
                </p>

                <h3>How accurate is the data?</h3>
                <p>
                  The data is derived from Landsat 8/9 satellites with 30-meter spatial resolution.
                  LST accuracy is typically ±2°C when compared to ground measurements.
                </p>

                <h3>When was the data collected?</h3>
                <p>
                  Each year's data represents cloud-free imagery from the dry season (typically
                  January-May) when surface temperatures are highest and most consistent.
                </p>

                <h3>Can I download the data?</h3>
                <p>
                  The visualization displays processed data. Data layers shown on screen can be exported with the camera icon on the top right. For access to raw or processed datasets,
                  please contact us at imcytherea@gmail.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoFAQPage;

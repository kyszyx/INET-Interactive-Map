import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About INET Dashboard</h1>
        <p className="subtitle">Identifying Networks of Elevated Temperature</p>

        <section className="about-section">
          <h2>Project Overview</h2>
          <p>
            The INET Dashboard is a comprehensive geospatial visualization platform designed to monitor
            and analyze Land Surface Temperature (LST), vegetation indices, built-up areas, and surface  urrban
            heat island patterns across Valenzuela City, Philippines.
          </p>
          <p>
            This thesis project leverages satellite imagery and advanced spatial analysis techniques
            to provide actionable insights into urban heat distribution, supporting climate adaptation
            and urban planning efforts.
          </p>
        </section>

        <section className="about-section">
          <h2>Data Coverage</h2>
          <ul>
            <li><strong>Geographic Area:</strong> Valenzuela City, Metro Manila, Philippines</li>
            <li><strong>Temporal Coverage:</strong> 2020-2025 (excluding 2023)</li>
            <li><strong>Spatial Resolution:</strong> 30m for Landsat-based indices & 10m for Sentinel-2 NDVI and NDBI</li>
            <li><strong>Administrative Units:</strong> All barangays in Valenzuela City</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <ul>
            <li><strong>Frontend:</strong> React + MapLibre GL JS</li>
            <li><strong>Geospatial Processing:</strong> GDAL, Python, Google Earth Engine</li>
            <li><strong>Data Analysis:</strong> DBSCAN clustering for hotspot detection</li>
            <li><strong>Data Sources:</strong> Landsat 8/9 & Sentinel-2 Satellite ImagerCoy</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Project Goals</h2>
          <p>
            <strong>The primary objectives of this project are to:</strong>
          </p>
          <ul>
            <li>Satellite based tempo-spatial analysis of Valenzuela City</li>
            <li>Visualize temporal and spatial patterns of urban heat in Valenzuela City</li>
            <li>Identify hotspot clusters that require targeted intervention</li>
            <li>Analyze the relationship between built-up areas, vegetation, and surface temperature</li>
            <li>Provide an accessible tool for researchers, urban planners, and policymakers</li>
            <li>Support evidence-based climate adaptation and urban greening strategies</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Author</h2>
          <p>
            This dashboard was developed as part of a thesis project at FEU Institute of Technology.
          </p>
          <p>
            For questions or inquiries, please contact us at imcytherea@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;

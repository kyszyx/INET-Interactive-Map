# INET Dashboard

**Identifying Networks of Elevated Temperature**

A geospatial visualization dashboard for analyzing heat data in Valenzuela City, Philippines. Built with React and MapLibre GL JS.

## Overview

INET Dashboard visualizes Land Surface Temperature (LST), vegetation indices (NDVI), built-up indices (NDBI), Surface Urban Heat Island (SUHI) intensity, and DBSCAN hotspot clusters across multiple years (2020-2025).

## Features

- **Interactive Map**: Click barangays to view temperature statistics
- **Multiple Data Layers**: Toggle between LST, NDVI, NDBI, SUHI, and DBSCAN cluster layers
- **Year Selector**: View historical data from 2020-2025
- **Predictions**: Temperature forecasting using Facebook Prophet algorithm
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- React + Vite
- MapLibre GL JS
- GDAL (Python for GIS data processing)
- Prophet (Facebook's forecasting algorithm)

## Development

```bash
npm install
npm run dev
```

Server runs on `http://localhost:5173`

## Data Sources

- GeoTIFF raster data (LST, NDVI, NDBI, SUHI)
- Barangay boundary polygons (GeoJSON)
- Statistical data from Google Earth Engine
- DBSCAN cluster analysis
import { useState } from 'react';
import './YearSelector.css';
import { availableYears } from '../data/barangayData';

const YearSelector = ({ selectedYear, onYearChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleYearClick = (year) => {
    onYearChange(year);
  };

  return (
    <div className={`year-selector ${isExpanded ? 'expanded' : ''}`}>
      <div className="year-selector-content">
        <div className="year-selector-header">
          <h4>Select Year</h4>
          <button
            className="toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▲'}
          </button>
        </div>

        <div className="year-timeline">
          {availableYears.map((year) => (
            <button
              key={year}
              className={`year-button ${selectedYear === year ? 'active' : ''}`}
              onClick={() => handleYearClick(year)}
            >
              <span className="year-label">{year}</span>
            </button>
          ))}
        </div>

        <div className="year-slider-container">
          <input
            type="range"
            min={0}
            max={availableYears.length - 1}
            value={availableYears.indexOf(selectedYear)}
            onChange={(e) => handleYearClick(availableYears[parseInt(e.target.value)])}
            className="year-slider"
          />
          <div className="slider-labels">
            <span>{availableYears[0]}</span>
            <span>{availableYears[availableYears.length - 1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearSelector;

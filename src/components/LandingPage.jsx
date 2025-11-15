import { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onDragComplete, dragOffset, setDragOffset, isHidden }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const delta = startX - e.clientX;
        if (delta > 0) {
          setDragOffset(Math.min(delta, window.innerWidth));

          if (delta >= window.innerWidth * 0.7) {
            setIsDragging(false);
            onDragComplete();
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        if (dragOffset < window.innerWidth * 0.3) {
          setDragOffset(0);
        } else if (dragOffset < window.innerWidth * 0.7) {
          setDragOffset(0);
        }
        setIsDragging(false);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length > 0) {
        const delta = startX - e.touches[0].clientX;
        if (delta > 0) {
          setDragOffset(Math.min(delta, window.innerWidth));

          if (delta >= window.innerWidth * 0.7) {
            setIsDragging(false);
            onDragComplete();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        if (dragOffset < window.innerWidth * 0.3) {
          setDragOffset(0);
        } else if (dragOffset < window.innerWidth * 0.7) {
          setDragOffset(0);
        }
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX, dragOffset, onDragComplete, setDragOffset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
    }
  };

  if (isHidden) return null;

  // Calculate thermometer fill percentage (0-100%)
  const fillPercentage = Math.min((dragOffset / (window.innerWidth * 0.7)) * 100, 100);
  // Simulate temperature rising from 20°C to 45°C
  const temperature = 20 + (fillPercentage / 100) * 25;

  return (
    <div
      className="landing-page"
      style={{
        transform: `translateX(-${dragOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="landing-content">
        <h1 className="inet-title">INET</h1>
        <p className="inet-subtitle">Identifying Networks of Elevated Temperature</p>
        <div className="drag-hint">
          <span className="drag-arrow">←</span>
          <span className="drag-text">Slide to the left</span>
        </div>
      </div>

      {/* Thermometer Visual */}
      <div className="thermometer-container">
        <div className="thermometer">
          <div
            className="thermometer-mercury"
            style={{ height: `${fillPercentage}%` }}
          />
          <div className="thermometer-bulb" />
          <div
            className="thermometer-bulb-fill"
            style={{ opacity: fillPercentage > 0 ? 1 : 0 }}
          />
        </div>
        <div className="thermometer-label">Heat Level</div>
        <div className="temperature-display">{temperature.toFixed(1)}°C</div>
      </div>
    </div>
  );
};

export default LandingPage;

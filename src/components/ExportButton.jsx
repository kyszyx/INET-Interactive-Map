import { useState } from 'react';
import './ExportButton.css';

const ExportButton = ({ mapRef, onExportClick }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

  const handleExportClick = () => {
    setIsSelecting(true);
    setSelectionStart(null);
    setSelectionEnd(null);
    if (onExportClick && typeof onExportClick === 'function') {
      onExportClick();
    }
  };

  const handleCancel = () => {
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const handleMapMouseDown = (e) => {
    if (!isSelecting) return;

    const rect = e.target.getBoundingClientRect();
    setSelectionStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setSelectionEnd(null);
  };

  const handleMapMouseMove = (e) => {
    if (!isSelecting || !selectionStart) return;

    const rect = e.target.getBoundingClientRect();
    setSelectionEnd({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMapMouseUp = async (e) => {
    if (!isSelecting || !selectionStart) return;

    const rect = e.target.getBoundingClientRect();
    const endPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // Calculate selection rectangle
    const x = Math.min(selectionStart.x, endPoint.x);
    const y = Math.min(selectionStart.y, endPoint.y);
    const width = Math.abs(endPoint.x - selectionStart.x);
    const height = Math.abs(endPoint.y - selectionStart.y);

    // Only export if selection is large enough
    if (width > 20 && height > 20) {
      await exportMapArea(x, y, width, height);
    }

    // Reset selection
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const exportMapArea = async (x, y, width, height) => {
    if (!mapRef.current) return;

    try {
      const map = mapRef.current;

      console.log('Starting export...');

      // Wait a moment for any rendering to finish
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create an image from the current canvas state
      const canvas = map.getCanvas();

      // Get the full canvas as a data URL immediately
      let dataURL;
      try {
        dataURL = canvas.toDataURL('image/png');
        console.log('Got canvas data URL, length:', dataURL.length);
      } catch (e) {
        console.error('Failed to get canvas data:', e);
        alert('Cannot export: WebGL canvas is not readable. Try refreshing the page.');
        return;
      }

      // Create an image element to load the full canvas
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataURL;
      });

      console.log('Image loaded, size:', img.width, 'x', img.height);

      // Now create the cropped canvas
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = width;
      exportCanvas.height = height;

      const ctx = exportCanvas.getContext('2d');

      // Draw the selected portion
      ctx.drawImage(
        img,
        x, y, width, height,  // source rectangle
        0, 0, width, height   // destination rectangle
      );

      console.log('Created export canvas:', exportCanvas.width, 'x', exportCanvas.height);

      // Convert to blob and download
      exportCanvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          alert('Failed to create image file');
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `inet-map-export-${timestamp}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        console.log('✅ Map exported successfully!');
      }, 'image/png');

    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export map: ' + error.message);
    }
  };

  // Calculate selection rectangle for display
  const getSelectionStyle = () => {
    if (!selectionStart || !selectionEnd) return null;

    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    return {
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`
    };
  };

  // Expose the handleExportClick function to parent
  if (onExportClick) {
    onExportClick.current = handleExportClick;
  }

  return (
    <>
      {isSelecting && (
        <>
          <div
            className="export-overlay"
            onMouseDown={handleMapMouseDown}
            onMouseMove={handleMapMouseMove}
            onMouseUp={handleMapMouseUp}
          >
            {selectionStart && selectionEnd && (
              <div className="export-selection" style={getSelectionStyle()}></div>
            )}
          </div>

          {!selectionStart && (
            <div className="export-instructions">
              <p>Draw a rectangle to select the area to export</p>
              <button className="export-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ExportButton;

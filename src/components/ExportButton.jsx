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
    if (onExportClick) onExportClick();
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
      const canvas = map.getCanvas();

      // Create a temporary canvas for the selected area
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = width;
      exportCanvas.height = height;
      const ctx = exportCanvas.getContext('2d');

      // Draw the selected portion of the map
      ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

      // Convert to blob and download
      exportCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `inet-map-export-${timestamp}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');

      console.log('✅ Map area exported successfully');
    } catch (error) {
      console.error('❌ Error exporting map:', error);
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

            <div className="export-instructions">
              <p>
                {!selectionStart
                  ? 'Draw a rectangle to select the area to export'
                  : 'Release to capture the selected area'}
              </p>
              <button className="export-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ExportButton;

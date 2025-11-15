import './Navigation.css';

const Navigation = ({ currentPage, onPageChange, showExportButton, onExportClick }) => {
  return (
    <nav className="navigation">
      <div className="nav-brand" onClick={() => onPageChange('map')} style={{ cursor: 'pointer' }}>
        <span className="nav-logo">INET</span>
        <span className="nav-subtitle">Dashboard</span>
      </div>
      <div className="nav-links">
        <button
          className={`nav-link ${currentPage === 'map' ? 'active' : ''}`}
          onClick={() => onPageChange('map')}
        >
          Map
        </button>
        <button
          className={`nav-link ${currentPage === 'info' ? 'active' : ''}`}
          onClick={() => onPageChange('info')}
        >
          Info & FAQ
        </button>
        <button
          className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
          onClick={() => onPageChange('about')}
        >
          About Us
        </button>
      </div>
      {showExportButton && (
        <button className="nav-export-btn" onClick={onExportClick} title="Export Map as Image">
          📷
        </button>
      )}
    </nav>
  );
};

export default Navigation;

import './PredictionsPage.css';

const PredictionsPage = () => {
  return (
    <div className="predictions-page">
      <div className="predictions-container">
        <header className="predictions-header">
          <h1>Temperature Predictions</h1>
          <p className="predictions-subtitle">
            Forecasting Land Surface Temperature trends using Facebook Prophet Algorithm
          </p>
        </header>

        <div className="predictions-content">
          <section className="prediction-section">
            <h2>City-Wide Temperature Forecast</h2>
            <div className="chart-placeholder">
              <p>Prophet Algorithm Graph - City-Wide Predictions</p>
              <p className="placeholder-note">Chart will be added here</p>
            </div>
          </section>

          <section className="prediction-section">
            <h2>Per-Barangay Temperature Forecast</h2>
            <div className="chart-placeholder">
              <p>Prophet Algorithm Graph - Barangay-Level Predictions</p>
              <p className="placeholder-note">Chart will be added here</p>
            </div>
          </section>

          <section className="prediction-section">
            <h2>Model Performance Metrics</h2>
            <div className="chart-placeholder">
              <p>Model Accuracy and Performance Statistics</p>
              <p className="placeholder-note">Metrics will be added here</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PredictionsPage;

import { useState, useEffect } from 'react';
import './PredictionsPage.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PredictionsPage = () => {
  const [predictionData, setPredictionData] = useState([]);

  useEffect(() => {
    fetch('/conservative_predictions_complete.csv')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split('\n').slice(1);
        const data = lines.map(line => {
          const values = line.split(',');

          // Parse CI values (format: "±2.44" or "�2.44")
          const parseCIValue = (ciStr) => {
            if (!ciStr || ciStr === '') return 0;
            // Remove all non-numeric characters except decimal point
            const cleaned = ciStr.replace(/[^\d.]/g, '');
            const value = parseFloat(cleaned);
            console.log('Parsing CI:', ciStr, '→', cleaned, '→', value);
            return value || 0;
          };

          const cityLST = parseFloat(values[2]);
          const cityCI = parseCIValue(values[3]);
          const ruralLST = parseFloat(values[4]);
          const ruralCI = parseCIValue(values[5]);
          const suhi = parseFloat(values[6]);
          const suhiCI = parseCIValue(values[7]);

          return {
            year: values[0],
            status: values[1],
            cityLST,
            cityCI,
            cityUpperBound: cityLST + cityCI,
            cityLowerBound: cityLST - cityCI,
            ruralLST,
            ruralCI,
            ruralUpperBound: ruralLST + ruralCI,
            ruralLowerBound: ruralLST - ruralCI,
            suhi,
            suhiCI,
            suhiUpperBound: suhi + suhiCI,
            suhiLowerBound: suhi - suhiCI
          };
        });
        setPredictionData(data);
      })
      .catch(err => console.error('Error loading prediction data:', err));
  }, []);

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
            <h2>Valenzuela City Temperature Forecast</h2>
            {predictionData.length > 0 && (
              <div className="chart-container">
                <Line
                  data={{
                    labels: predictionData.map(d => d.year),
                    datasets: [
                      // City LST Main Line
                      {
                        label: 'City LST (°C)',
                        data: predictionData.map(d => d.cityLST),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: predictionData.map(d =>
                          d.status === 'Historical' ? 'rgb(255, 99, 132)' : 'rgb(255, 159, 64)'
                        ),
                        pointBorderColor: predictionData.map(d =>
                          d.status === 'Historical' ? 'rgb(255, 99, 132)' : 'rgb(255, 159, 64)'
                        ),
                        pointRadius: 5,
                        tension: 0.4
                      },
                      // Rural LST Main Line
                      {
                        label: 'Rural LST (°C)',
                        data: predictionData.map(d => d.ruralLST),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: predictionData.map(d =>
                          d.status === 'Historical' ? 'rgb(75, 192, 192)' : 'rgb(102, 187, 106)'
                        ),
                        pointBorderColor: predictionData.map(d =>
                          d.status === 'Historical' ? 'rgb(75, 192, 192)' : 'rgb(102, 187, 106)'
                        ),
                        pointRadius: 5,
                        tension: 0.4
                      },
                      // City Upper Bound (hidden)
                      {
                        label: 'City Upper',
                        data: predictionData.map((d, i) => {
                          if (d.status === 'Predicted') return d.cityUpperBound;
                          if (i === predictionData.findIndex(x => x.status === 'Predicted') - 1) return d.cityLST;
                          return null;
                        }),
                        borderColor: 'rgba(255, 99, 132, 0)',
                        backgroundColor: 'rgba(255, 99, 132, 0)',
                        borderWidth: 0,
                        pointRadius: 0,
                        fill: false,
                        tension: 0,
                        spanGaps: false
                      },
                      // City Lower Bound with fill
                      {
                        label: 'City 95% CI',
                        data: predictionData.map((d, i) => {
                          if (d.status === 'Predicted') return d.cityLowerBound;
                          if (i === predictionData.findIndex(x => x.status === 'Predicted') - 1) return d.cityLST;
                          return null;
                        }),
                        borderColor: 'rgba(255, 99, 132, 0)',
                        backgroundColor: 'rgba(255, 182, 193, 0.5)',
                        borderWidth: 0,
                        pointRadius: 0,
                        fill: 2,
                        tension: 0,
                        spanGaps: false
                      },
                      // Rural Upper Bound (hidden)
                      {
                        label: 'Rural Upper',
                        data: predictionData.map((d, i) => {
                          if (d.status === 'Predicted') return d.ruralUpperBound;
                          if (i === predictionData.findIndex(x => x.status === 'Predicted') - 1) return d.ruralLST;
                          return null;
                        }),
                        borderColor: 'rgba(75, 192, 192, 0)',
                        backgroundColor: 'rgba(75, 192, 192, 0)',
                        borderWidth: 0,
                        pointRadius: 0,
                        fill: false,
                        tension: 0,
                        spanGaps: false
                      },
                      // Rural Lower Bound with fill
                      {
                        label: 'Rural 95% CI',
                        data: predictionData.map((d, i) => {
                          if (d.status === 'Predicted') return d.ruralLowerBound;
                          if (i === predictionData.findIndex(x => x.status === 'Predicted') - 1) return d.ruralLST;
                          return null;
                        }),
                        borderColor: 'rgba(75, 192, 192, 0)',
                        backgroundColor: 'rgba(175, 238, 238, 0.5)',
                        borderWidth: 0,
                        pointRadius: 0,
                        fill: 4,
                        tension: 0,
                        spanGaps: false
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          font: { size: 14 },
                          filter: (item) => !item.text.includes('Upper')
                        }
                      },
                      title: {
                        display: true,
                        text: 'Historical Data (2020-2025) & Predictions (2026-2030) with 95% CI',
                        font: { size: 16, weight: 'bold' }
                      },
                      tooltip: {
                        callbacks: {
                          afterLabel: function(context) {
                            const index = context.dataIndex;
                            const item = predictionData[index];
                            if (item.status === 'Predicted') {
                              if (context.dataset.label === 'City LST (°C)') {
                                return `CI: ±${item.cityCI.toFixed(2)}°C`;
                              } else if (context.dataset.label === 'Rural LST (°C)') {
                                return `CI: ±${item.ruralCI.toFixed(2)}°C`;
                              }
                            }
                            return '';
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Temperature (°C)', font: { size: 14 } }
                      },
                      x: {
                        title: { display: true, text: 'Year', font: { size: 14 } }
                      }
                    }
                  }}
                  height={400}
                />
              </div>
            )}
          </section>

          <section className="prediction-section">
            <h2>SUHI Forecast</h2>
            {predictionData.length > 0 && (
              <div className="chart-container">
                <Line
                  data={{
                    labels: predictionData.map(d => d.year),
                    datasets: [
                      // SUHI Main Line
                      {
                        label: 'SUHI Intensity (°C)',
                        data: predictionData.map(d => d.suhi),
                        borderColor: 'rgb(255, 159, 64)',
                        backgroundColor: 'rgba(255, 159, 64, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: predictionData.map(d =>
                          d.status === 'Historical' ? 'rgb(255, 159, 64)' : 'rgb(255, 99, 132)'
                        ),
                        pointBorderColor: predictionData.map(d =>
                          d.status === 'Historical' ? 'rgb(255, 159, 64)' : 'rgb(255, 99, 132)'
                        ),
                        pointRadius: 5,
                        tension: 0.4
                      },
                      // SUHI Upper Bound (hidden)
                      {
                        label: 'SUHI Upper',
                        data: predictionData.map((d, i) => {
                          if (d.status === 'Predicted') return d.suhiUpperBound;
                          if (i === predictionData.findIndex(x => x.status === 'Predicted') - 1) return d.suhi;
                          return null;
                        }),
                        borderColor: 'rgba(255, 159, 64, 0)',
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderWidth: 0,
                        pointRadius: 0,
                        fill: false,
                        tension: 0,
                        spanGaps: false
                      },
                      // SUHI Lower Bound with fill
                      {
                        label: 'SUHI 95% CI',
                        data: predictionData.map((d, i) => {
                          if (d.status === 'Predicted') return d.suhiLowerBound;
                          if (i === predictionData.findIndex(x => x.status === 'Predicted') - 1) return d.suhi;
                          return null;
                        }),
                        borderColor: 'rgba(255, 159, 64, 0)',
                        backgroundColor: 'rgba(255, 224, 178, 0.5)',
                        borderWidth: 0,
                        pointRadius: 0,
                        fill: 1,
                        tension: 0,
                        spanGaps: false
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          font: { size: 14 },
                          filter: (item) => !item.text.includes('Upper')
                        }
                      },
                      title: {
                        display: true,
                        text: 'Surface Urban Heat Island Intensity - Historical & Predicted with 95% CI',
                        font: { size: 16, weight: 'bold' }
                      },
                      tooltip: {
                        filter: (item) => !item.dataset.label.includes('Upper Bound'),
                        callbacks: {
                          afterLabel: function(context) {
                            const index = context.dataIndex;
                            const item = predictionData[index];
                            if (item.status === 'Predicted' && item.suhiCI) {
                              return `CI: ±${item.suhiCI.toFixed(2)}°C`;
                            }
                            return '';
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        title: { display: true, text: 'SUHI Intensity (°C)', font: { size: 14 } }
                      },
                      x: {
                        title: { display: true, text: 'Year', font: { size: 14 } }
                      }
                    }
                  }}
                  height={400}
                />
              </div>
            )}
          </section>

          <section className="prediction-section">
            <h2>Prediction Algorithm: Prophet</h2>
            <div className="algorithm-description">
              <p className="algorithm-intro">
                <strong>Prophet from Meta</strong> is an open-source forecasting tool designed for time series data with strong seasonal patterns and multiple years of historical data. It works particularly well with data that has missing values and outliers, making it ideal for temperature prediction.
              </p>

              <div className="algorithm-details">
                <h3>Conservative Forecasting Approach</h3>
                <p>
                  This study implements a <strong>conservative forecasting strategy</strong> to ensure reliable predictions with minimal overfitting:
                </p>

                <div className="code-example">
                  <pre><code>model = Prophet(changepoint_prior_scale=0.05, interval_width=0.95)</code></pre>
                </div>

                <div className="parameter-explanation">
                  <div className="parameter-item">
                    <strong>changepoint_prior_scale=0.05:</strong>
                    <p>This low value makes the model less sensitive to trend changes, producing smoother and more stable long-term forecasts. It prevents the model from overfitting to short-term fluctuations in historical data.</p>
                  </div>

                  <div className="parameter-item">
                    <strong>interval_width=0.95:</strong>
                    <p>Generates 95% confidence intervals (CI) around predictions. A confidence interval is a statistical range that indicates where the true value is likely to fall. The 95% CI means we can be 95% confident that actual future temperatures will fall within the shaded areas shown in the charts.</p>
                    <p className="why-note">Why 95% instead of default 50%? While Prophet's default is 50%, using 95% provides a wider, more realistic uncertainty range. This is crucial for climate forecasting where many unpredictable factors can affect outcomes. A 95% CI gives stakeholders and policymakers a more complete picture of potential temperature scenarios rather than an overly optimistic narrow range.</p>
                  </div>
                </div>

                <div className="methodology-note">
                  <strong>Why Conservative?</strong> Multiple forecasting methods were compared to determine the optimal approach. Method 3 (Conservative Trend with changepoint_prior_scale=0.05) was selected because it produced the most realistic predictions with narrower confidence intervals (±2.4°C) compared to other methods that showed unrealistic temperature spikes and extremely wide uncertainty ranges (±20-33°C). The conservative approach prevents the model from overfitting to the sharp 2024-2025 temperature increase, providing stable and scientifically plausible long-term forecasts. This is crucial given the limited 5-year historical data and the complexity of urban climate systems.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PredictionsPage;

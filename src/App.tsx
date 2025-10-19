import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { GenerateReportResponse, ReportData } from './types';

const API_BASE_URL = 'http://localhost:3000/api';

function App(): JSX.Element {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string>('');
  const [filename, setFilename] = useState<string>('');

  // Set default dates (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  const handleQuickSelect = (days: number): void => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  };

  const handleGenerateReport = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReportData(null);

    try {
      const response = await axios.post<GenerateReportResponse>(`${API_BASE_URL}/generate-report`, {
        startDate,
        endDate
      });

      if (response.data.success && response.data.data) {
        setReportData(response.data.data);
        setFilename(response.data.file || '');
        setError('');
      } else {
        setError(response.data.message || 'Failed to Generate SpreadSheet');
        setReportData(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to Generate SpreadSheet');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (): Promise<void> => {
    if (!filename) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/download/${filename}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download file');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📊 Whop Sales Report Generator</h1>
        <p>Generate comprehensive sales SpreadSheet from your Whop checkout links</p>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>Generate SpreadSheet</h2>
          
          <form onSubmit={handleGenerateReport} className="report-form">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="quick-select">
              <h3>Quick Select:</h3>
              <div className="quick-buttons">
                <button type="button" onClick={() => handleQuickSelect(7)}>Last 7 Days</button>
                <button type="button" onClick={() => handleQuickSelect(30)}>Last 30 Days</button>
                <button type="button" onClick={() => handleQuickSelect(90)}>Last 90 Days</button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate SpreadSheet'}
            </button>
          </form>

          {error && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {reportData && (
            <div className="results">
              <div className="alert alert-success">
                <strong>Success!</strong> Report generated successfully
              </div>

              <div className="summary-stats">
                <h3>Summary Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Sales</div>
                    <div className="stat-value">{reportData.summary.totalSales}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Paid Sales</div>
                    <div className="stat-value">{reportData.summary.totalPaidSales}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Total Cash</div>
                    <div className="stat-value">${reportData.summary.totalCash.toFixed(2)}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Average Sale</div>
                    <div className="stat-value">${reportData.summary.averageSaleAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <button onClick={handleDownload} className="btn-download">
                📥 Download Excel Report
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Whop Sales SpreadSheet Generator</p>
      </footer>
    </div>
  );
}

export default App;

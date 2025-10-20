import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { 
  GenerateReportResponse, 
  ReportData, 
  ApiResponse, 
  TrackedReceipt, 
  CompleteWorkflowData 
} from './types';

const API_BASE_URL = 'http://localhost:3000/api';

type TabType = 'workflow' | 'reports' | 'tracking';

function App(): JSX.Element {
  // Report states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string>('');
  const [filename, setFilename] = useState<string>('');

  // Workflow states
  const [activeTab, setActiveTab] = useState<TabType>('workflow');
  const [productTitle, setProductTitle] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [checkoutCount, setCheckoutCount] = useState<number>(10);
  const [workflowData, setWorkflowData] = useState<CompleteWorkflowData | null>(null);
  const [workflowLoading, setWorkflowLoading] = useState<boolean>(false);

  // Tracking states
  const [trackingInternalName, setTrackingInternalName] = useState<string>('');
  const [trackingStartDate, setTrackingStartDate] = useState<string>('');
  const [trackingEndDate, setTrackingEndDate] = useState<string>('');
  const [trackedReceipts, setTrackedReceipts] = useState<TrackedReceipt[]>([]);
  const [trackingLoading, setTrackingLoading] = useState<boolean>(false);

  // Set default dates (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    const dateStr = end.toISOString().split('T')[0];
    const startStr = start.toISOString().split('T')[0];
    
    setEndDate(dateStr);
    setStartDate(startStr);
    setTrackingEndDate(dateStr);
    setTrackingStartDate(startStr);
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

  // Workflow functions
  const handleCompleteWorkflow = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setWorkflowLoading(true);
    setError('');

    try {
      const response = await axios.post<ApiResponse<CompleteWorkflowData>>(`${API_BASE_URL}/complete-workflow`, {
        productTitle,
        productDescription,
        checkoutCount
      });

      if (response.data.success && response.data.data) {
        setWorkflowData(response.data.data);
        setError('');
      } else {
        setError(response.data.message || 'Failed to execute workflow');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to execute workflow');
    } finally {
      setWorkflowLoading(false);
    }
  };

  // Tracking functions
  const handleTrackCheckoutLinks = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setTrackingLoading(true);
    setError('');

    try {
      const response = await axios.post<ApiResponse<TrackedReceipt[]>>(`${API_BASE_URL}/track-checkout-links`, {
        internalName: trackingInternalName,
        startDate: trackingStartDate,
        endDate: trackingEndDate
      });

      if (response.data.success && response.data.data) {
        setTrackedReceipts(response.data.data);
        setError('');
      } else {
        setError(response.data.message || 'Failed to track checkout links');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to track checkout links');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Whop Complete Workflow Manager</h1>
        <p>Create products, generate checkout links, and track sales analytics</p>
      </header>

      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflow')}
        >
          🛠️ Workflow
        </button>
        <button 
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📊 Reports
        </button>
        <button 
          className={`tab ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          🔍 Tracking
        </button>
      </nav>

      <main className="main-content">
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Workflow Tab */}
        {activeTab === 'workflow' && (
          <div className="card">
            <h2>🛠️ Complete Workflow</h2>
            <p>Create a product and generate multiple checkout links with tracking</p>
            
            <form onSubmit={handleCompleteWorkflow} className="workflow-form">
              <div className="form-group">
                <label htmlFor="productTitle">Product Title</label>
                <input
                  type="text"
                  id="productTitle"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">Product Description (Optional)</label>
                <textarea
                  id="productDescription"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkoutCount">Number of Checkout Links</label>
                <input
                  type="number"
                  id="checkoutCount"
                  value={checkoutCount}
                  onChange={(e) => setCheckoutCount(parseInt(e.target.value) || 10)}
                  min="1"
                  max="50"
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={workflowLoading}>
                {workflowLoading ? 'Creating...' : '🚀 Execute Complete Workflow'}
              </button>
            </form>

            {workflowData && (
              <div className="workflow-results">
                <div className="alert alert-success">
                  <strong>Success!</strong> Workflow completed successfully
                </div>

                <div className="workflow-summary">
                  <h3>📦 Product Created</h3>
                  <div className="product-info">
                    <p><strong>ID:</strong> {workflowData.product.id}</p>
                    <p><strong>Title:</strong> {workflowData.product.title}</p>
                    <p><strong>Description:</strong> {workflowData.product.description || 'No description'}</p>
                  </div>

                  <h3>🔗 Checkout Links Created ({workflowData.checkoutLinks.length})</h3>
                  <div className="checkout-links-list">
                    {workflowData.checkoutLinks.map((link, index) => (
                      <div key={link.id} className="checkout-link-item">
                        <div className="link-header">
                          <span className="link-number">#{index + 1}</span>
                          <span className="link-title">{link.title}</span>
                          <span className="link-price">${link.price}</span>
                        </div>
                        <div className="link-details">
                          <p><strong>Internal Name:</strong> {link.internalName}</p>
                          <p><strong>Link ID:</strong> {link.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="internal-names">
                    <h4>📝 Internal Names for Tracking:</h4>
                    <div className="names-list">
                      {workflowData.internalNames.map((name, index) => (
                        <span key={index} className="name-tag">{name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="card">
            <h2>📊 Generate Sales Report</h2>
            
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
                {loading ? 'Generating...' : '📊 Generate Report'}
              </button>
            </form>

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
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="card">
            <h2>🔍 Track Checkout Links</h2>
            <p>Track receipts by internal name to analyze performance</p>
            
            <form onSubmit={handleTrackCheckoutLinks} className="tracking-form">
              <div className="form-group">
                <label htmlFor="trackingInternalName">Internal Name</label>
                <input
                  type="text"
                  id="trackingInternalName"
                  value={trackingInternalName}
                  onChange={(e) => setTrackingInternalName(e.target.value)}
                  placeholder="Enter internal name (e.g., premium_plan_123)"
                  required
                />
                {workflowData && (
                  <div className="suggestions">
                    <p>Available internal names:</p>
                    <div className="suggestion-tags">
                      {workflowData.internalNames.slice(0, 5).map((name, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-tag"
                          onClick={() => setTrackingInternalName(name)}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="trackingStartDate">Start Date</label>
                <input
                  type="date"
                  id="trackingStartDate"
                  value={trackingStartDate}
                  onChange={(e) => setTrackingStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="trackingEndDate">End Date</label>
                <input
                  type="date"
                  id="trackingEndDate"
                  value={trackingEndDate}
                  onChange={(e) => setTrackingEndDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={trackingLoading}>
                {trackingLoading ? 'Tracking...' : '🔍 Track Receipts'}
              </button>
            </form>

            {trackedReceipts.length > 0 && (
              <div className="tracking-results">
                <div className="alert alert-success">
                  <strong>Found {trackedReceipts.length} receipts</strong> for "{trackingInternalName}"
                </div>

                <div className="receipts-list">
                  {trackedReceipts.map((receipt) => (
                    <div key={receipt.id} className="receipt-item">
                      <div className="receipt-header">
                        <span className="receipt-id">{receipt.id}</span>
                        <span className={`receipt-status ${receipt.friendlyStatus}`}>
                          {receipt.friendlyStatus}
                        </span>
                      </div>
                      <div className="receipt-details">
                        <p><strong>Amount:</strong> ${receipt.finalAmount.toFixed(2)} {receipt.currency.toUpperCase()}</p>
                        <p><strong>Plan:</strong> {receipt.plan.title}</p>
                        <p><strong>Customer:</strong> {receipt.member.user.name} ({receipt.member.user.email})</p>
                        <p><strong>Date:</strong> {new Date(receipt.createdAt * 1000).toLocaleDateString()}</p>
                        {receipt.paidAt && (
                          <p><strong>Paid:</strong> {new Date(receipt.paidAt * 1000).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Whop Complete Workflow Manager</p>
      </footer>
    </div>
  );
}

export default App;

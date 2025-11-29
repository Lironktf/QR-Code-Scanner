import { useState } from 'react';
import './QRGallery.css';

const QRGallery = ({ qrCodes, onProcess, onExport, processing, unprocessedCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['all', ...new Set(qrCodes.filter(qr => qr.category).map((qr) => qr.category))];

  const filteredQRCodes = qrCodes.filter((qr) => {
    const matchesSearch = qr.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (qr.summary && qr.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || qr.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Business Contact': '#3b82f6',
      'Product Info': '#10b981',
      'Website': '#8b5cf6',
      'Social Media': '#ec4899',
      'Event Info': '#f59e0b',
      'Payment': '#14b8a6',
      'WiFi': '#06b6d4',
      'Location': '#84cc16',
      'Document': '#6366f1',
      'Other': '#6b7280',
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="qr-gallery">
      <div className="gallery-header">
        <div className="container">
          {unprocessedCount > 0 && (
            <button
              onClick={onProcess}
              className="btn btn-primary w-full mb-2"
              disabled={processing}
            >
              {processing ? 'Processing...' : `Process ${unprocessedCount} QR Codes with AI`}
            </button>
          )}

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="export-buttons">
            <button onClick={() => onExport('json')} className="btn btn-secondary">
              Export JSON
            </button>
            <button onClick={() => onExport('csv')} className="btn btn-secondary">
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {filteredQRCodes.length === 0 ? (
          <div className="empty-gallery">
            <p>No QR codes found</p>
            <p className="text-secondary">
              {qrCodes.length === 0
                ? 'Switch to the Scan tab to start scanning'
                : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          <div className="qr-list">
            {filteredQRCodes.map((qr) => (
              <div
                key={qr.id}
                className="qr-item card"
                onClick={() => setExpandedId(expandedId === qr.id ? null : qr.id)}
              >
                <div className="qr-item-header">
                  {qr.category && (
                    <span
                      className="qr-category"
                      style={{ backgroundColor: getCategoryColor(qr.category) }}
                    >
                      {qr.category}
                    </span>
                  )}
                  <span className="qr-time text-secondary">{formatDate(qr.scanned_at)}</span>
                </div>

                <div className="qr-item-content">
                  {qr.summary ? (
                    <p className="qr-summary">{qr.summary}</p>
                  ) : (
                    <p className="qr-content-preview">{qr.content.substring(0, 100)}...</p>
                  )}
                </div>

                {expandedId === qr.id && (
                  <div className="qr-item-expanded">
                    <div className="qr-detail">
                      <strong>Full Content:</strong>
                      <p className="qr-content-full">{qr.content}</p>
                    </div>
                    {qr.content.startsWith('http') && (
                      <a
                        href={qr.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open Link
                      </a>
                    )}
                  </div>
                )}

                {!qr.processed && (
                  <div className="qr-unprocessed-badge">Unprocessed</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGallery;

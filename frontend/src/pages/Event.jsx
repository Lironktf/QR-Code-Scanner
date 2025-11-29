import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { qrCodeAPI, eventAPI } from '../utils/api';
import { dbQRCodes } from '../utils/db';
import { toast } from '../utils/toast';
import QRScanner from '../components/QRScanner';
import QRGallery from '../components/QRGallery';
import './Event.css';

const Event = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scan');
  const [qrCodes, setQRCodes] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    loadQRCodes();
  }, [eventId]);

  const loadQRCodes = async () => {
    try {
      const response = await qrCodeAPI.getQRCodes(eventId);
      const codes = response.data.qr_codes;
      setQRCodes(codes);

      // Sync with IndexedDB
      for (const code of codes) {
        await dbQRCodes.update(code);
      }
    } catch (error) {
      // Load from IndexedDB if offline
      const localCodes = await dbQRCodes.getAll(eventId);
      setQRCodes(localCodes);
    }
  };

  const handleQRCodeScanned = async (content) => {
    try {
      const response = await qrCodeAPI.addQRCode(eventId, content);
      const newQRCode = response.data.qr_code;

      setQRCodes([newQRCode, ...qrCodes]);
      await dbQRCodes.add(newQRCode);

      toast.success('QR code saved');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('QR code already scanned');
      } else {
        toast.error('Failed to save QR code');
      }
    }
  };

  const processUnprocessedQRCodes = async () => {
    const unprocessed = qrCodes.filter((qr) => !qr.processed);
    if (unprocessed.length === 0) {
      toast.info('All QR codes already processed');
      return;
    }

    setProcessing(true);
    try {
      await qrCodeAPI.processQRCodes(eventId);
      toast.success('QR codes processed with AI');
      await loadQRCodes(); // Reload to get updated data
    } catch (error) {
      toast.error('Failed to process QR codes');
    } finally {
      setProcessing(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await eventAPI.exportEvent(eventId, format);

      if (format === 'csv') {
        // For CSV, create a download link
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_${eventId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // For JSON
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_${eventId}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const unprocessedCount = qrCodes.filter((qr) => !qr.processed).length;

  return (
    <div className="event-page">
      {/* Header */}
      <div className="event-header">
        <div className="container">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back
          </button>
          <h2 className="mt-1">Event Details</h2>
          <p className="text-secondary">Scanned: {qrCodes.length} codes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan')}
          >
            Scan
          </button>
          <button
            className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
            {unprocessedCount > 0 && <span className="badge">{unprocessedCount}</span>}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'scan' ? (
          <QRScanner onScan={handleQRCodeScanned} scannedCount={qrCodes.length} />
        ) : (
          <QRGallery
            qrCodes={qrCodes}
            onProcess={processUnprocessedQRCodes}
            onExport={handleExport}
            processing={processing}
            unprocessedCount={unprocessedCount}
          />
        )}
      </div>
    </div>
  );
};

export default Event;

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScanner.css';

const QRScanner = ({ onScan, scannedCount }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [lastScanned, setLastScanned] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const html5QrcodeRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrcodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        onScanError
      );

      setScanning(true);
      setError(null);
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Unable to access camera. Please grant camera permissions.');
    }
  };

  const stopScanner = async () => {
    if (html5QrcodeRef.current && scanning) {
      try {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    // Prevent duplicate scans within 3 seconds
    const now = Date.now();
    if (lastScanned && lastScanned.text === decodedText && (now - lastScanned.time) < 3000) {
      return;
    }

    // Record this scan
    setLastScanned({ text: decodedText, time: now });

    // Call parent's onScan handler
    onScan(decodedText);

    // Show green border feedback
    setScanSuccess(true);

    // Clear any existing timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    // Reset success state and lastScanned after 5 seconds
    scanTimeoutRef.current = setTimeout(() => {
      setScanSuccess(false);
      setLastScanned(null);
    }, 5000);
  };

  const onScanError = (errorMessage) => {
    // Ignore scan errors (they happen continuously when no QR code is detected)
  };

  return (
    <div className="qr-scanner">
      <div className="scanner-container">
        {error ? (
          <div className="scanner-error">
            <p>{error}</p>
            <button onClick={startScanner} className="btn btn-primary">
              Retry
            </button>
          </div>
        ) : (
          <>
            <div id="qr-reader" ref={scannerRef}></div>
            <div className="scanner-overlay">
              <div className={`scan-frame ${scanSuccess ? 'scan-success' : ''}`}></div>
            </div>
          </>
        )}
      </div>

      <div className="scanner-info">
        <div className="info-card">
          <p className="info-label">Scanned QR Codes</p>
          <p className="info-value">{scannedCount}</p>
        </div>
        <p className="text-secondary text-center">
          Point your camera at a QR code to scan
        </p>
        {!permissionGranted && (
          <p className="text-secondary text-center" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            💡 Tip: Allow camera access in your browser settings for the best experience
          </p>
        )}
      </div>
    </div>
  );
};

export default QRScanner;

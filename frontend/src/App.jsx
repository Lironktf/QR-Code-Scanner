import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Event from './pages/Event';
import { initDB } from './utils/db';
import { useEffect } from 'react';

function App() {
  const { isAuthenticated, user, loading, login, logout } = useAuth();

  useEffect(() => {
    // Initialize IndexedDB on app load
    initDB();

    // Register service worker for PWA - Temporarily disabled for debugging
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker
    //     .register('/sw.js')
    //     .then((registration) => {
    //       console.log('Service Worker registered:', registration);
    //     })
    //     .catch((error) => {
    //       console.log('Service Worker registration failed:', error);
    //     });
    // }
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard user={user} onLogout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/event/:eventId"
          element={
            isAuthenticated ? <Event /> : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

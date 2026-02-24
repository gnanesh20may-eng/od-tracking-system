import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrackDuty from './pages/TrackDuty';
import ViewHistoricalDuties from './pages/ViewHistoricalDuties';
import './App.css';

/**
 * Main App Component
 * Sets up routing and providers for the entire application
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <Navigation />
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/track/:token" element={<TrackDuty />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'hod']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'hod', 'staff']}>
                    <ViewHistoricalDuties />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

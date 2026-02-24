import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

/**
 * Navigation Header Component
 * Provides navigation across main pages
 */
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated() || !user) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation-header">
      <div className="nav-container">
        <div className="nav-brand">
          <h2 className="brand-title">OD Tracking System</h2>
        </div>

        <div className="nav-links">
          {['admin', 'hod'].includes(user?.role) && (
            <>
              <button
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`nav-link ${isActive('/history') ? 'active' : ''}`}
                onClick={() => navigate('/history')}
              >
                Location History
              </button>
            </>
          )}

          {user?.role === 'staff' && (
            <button
              className={`nav-link ${isActive('/history') ? 'active' : ''}`}
              onClick={() => navigate('/history')}
            >
              My History
            </button>
          )}
        </div>

        <div className="nav-user">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">({user?.role})</span>
          <button className="nav-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

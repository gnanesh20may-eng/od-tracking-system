import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dutyAPI } from '../services/api';
import HistoricalLocationViewer from '../components/HistoricalLocationViewer';
import '../styles/LocationHistory.css';

/**
 * View Historical Duties Page
 * Allows viewing and analyzing location data from previous days
 */
const ViewHistoricalDuties = () => {
  const { user, hasRole } = useAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(user?.id || null);
  const [staffDuties, setStaffDuties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedStaffId) {
      fetchStaffDuties();
    }
  }, [selectedStaffId]);

  const fetchStaffDuties = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dutyAPI.getStaffDuties(selectedStaffId);
      setStaffDuties(response.data.duties || []);
    } catch (err) {
      setError('Failed to fetch duties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="historical-duties-page">
      <div className="page-header">
        <h1>Location History</h1>
        <p>View and analyze location tracking data from previous days</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="staff-selector">
        <label htmlFor="staff-select">Select Staff Member:</label>
        <select
          id="staff-select"
          value={selectedStaffId || ''}
          onChange={(e) => setSelectedStaffId(Number(e.target.value))}
        >
          {hasRole(['admin', 'hod']) && (
            <option value="">-- All Staff --</option>
          )}
          <option value={user?.id}>{user?.name} (My Data)</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="historical-content">
          {selectedStaffId && (
            <HistoricalLocationViewer
              staffId={selectedStaffId}
            />
          )}

          {/* Past Duties Summary */}
          {staffDuties.length > 0 && (
            <div className="past-duties-summary">
              <h3>Recent Duties ({staffDuties.length})</h3>
              <div className="duties-list">
                {staffDuties.slice(0, 10).map((duty) => (
                  <div key={duty.id} className="duty-card">
                    <div className="duty-date">
                      {new Date(duty.duty_date).toLocaleDateString()}
                    </div>
                    <div className="duty-time">
                      {duty.start_time} - {duty.end_time}
                    </div>
                    <div className="duty-status">
                      <span className={`status-badge status-${duty.status.toLowerCase()}`}>
                        {duty.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewHistoricalDuties;

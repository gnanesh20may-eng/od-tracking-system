import React, { useState, useEffect } from 'react';
import { locationAPI } from '../services/api';
import '../styles/LocationHistory.css';

/**
 * Historical Location Viewer Component
 * Allows viewing location history from previous days/duties
 */
const HistoricalLocationViewer = ({ dutyId, staffId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [duties, setDuties] = useState([]);
  const [selectedDutyId, setSelectedDutyId] = useState(dutyId || null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState(null);

  // Fetch duties for selected date
  useEffect(() => {
    if (selectedDate && staffId) {
      fetchDutiesForDate();
    }
  }, [selectedDate, staffId]);

  // Fetch locations when duty is selected
  useEffect(() => {
    if (selectedDutyId) {
      fetchLocationHistory();
    }
  }, [selectedDutyId]);

  const fetchDutiesForDate = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch staff duties and filter by selected date
      const response = await locationAPI.getLiveLocationData(selectedDate);
      
      if (response.data.liveData && response.data.liveData.length > 0) {
        setDuties(response.data.liveData);
        if (!selectedDutyId && response.data.liveData[0]) {
          setSelectedDutyId(response.data.liveData[0].dutyId);
        }
      } else {
        setDuties([]);
        setSelectedDutyId(null);
        setLocations([]);
      }
    } catch (err) {
      setError('Failed to fetch duties for selected date');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [locationsResponse, statsResponse] = await Promise.all([
        locationAPI.getLocationLogs(selectedDutyId, 1000, 0),
        locationAPI.getLocationStatistics(selectedDutyId),
      ]);
      
      setLocations(locationsResponse.data.logs || []);
      setStatistics(statsResponse.data.statistics);
    } catch (err) {
      setError('Failed to fetch location history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    const today = new Date().toISOString().split('T')[0];
    if (current.toISOString().split('T')[0] <= today) {
      setSelectedDate(current.toISOString().split('T')[0]);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="historical-viewer">
      <h2>Previous Day Location History</h2>

      {/* Date Navigation */}
      <div className="date-navigation">
        <button onClick={goToPreviousDay} className="btn btn-small">
          ← Previous Day
        </button>
        
        <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <span className="selected-date">{new Date(selectedDate).toLocaleDateString()}</span>
        </div>

        <button onClick={goToNextDay} className="btn btn-small">
          Next Day →
        </button>

        <button onClick={goToToday} className="btn btn-small btn-primary">
          Today
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Duty Selection */}
      {duties.length > 0 ? (
        <div className="duty-selection">
          <label>Select Duty:</label>
          <select
            value={selectedDutyId || ''}
            onChange={(e) => setSelectedDutyId(Number(e.target.value))}
          >
            <option value="">-- Choose a duty --</option>
            {duties.map((duty) => (
              <option key={duty.dutyId} value={duty.dutyId}>
                {duty.staffName} ({duty.startTime} - {duty.endTime}) -{' '}
                {duty.status}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="no-data">No duties found for {new Date(selectedDate).toLocaleDateString()}</p>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="location-stats">
          <div className="stat-box">
            <h4>Total Locations</h4>
            <p className="stat-number">{statistics.total_logs}</p>
          </div>
          <div className="stat-box">
            <h4>Valid</h4>
            <p className="stat-number valid">{statistics.valid_locations}</p>
          </div>
          <div className="stat-box">
            <h4>Violations</h4>
            <p className="stat-number violation">{statistics.violation_locations}</p>
          </div>
          <div className="stat-box">
            <h4>Violation %</h4>
            <p className="stat-number">{statistics.violationPercentage || 0}%</p>
          </div>
        </div>
      )}

      {/* Location History */}
      {loading ? (
        <div className="loading">Loading location data...</div>
      ) : locations.length > 0 ? (
        <div className="location-history">
          <h3>
            Location History ({locations.length} records)
          </h3>
          <div className="history-list scrollable">
            {locations.map((loc, index) => (
              <div key={loc.id} className="history-item">
                <div className="history-header">
                  <span className="history-time">
                    {new Date(loc.logged_at).toLocaleTimeString()}
                  </span>
                  <span
                    className={`status-badge ${
                      loc.status === 'VALID' ? 'status-valid' : 'status-violation'
                    }`}
                  >
                    {loc.status}
                  </span>
                </div>
                <div className="history-details">
                  <small>
                    Lat: {loc.latitude} | Lon: {loc.longitude}
                  </small>
                  <small>
                    Accuracy: {loc.accuracy ? loc.accuracy.toFixed(2) : 'N/A'}m | Distance: {loc.distance_from_location ? loc.distance_from_location.toFixed(2) : 'N/A'}m
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        selectedDutyId && <p className="no-data">No location data available for this duty</p>
      )}
    </div>
  );
};

export default HistoricalLocationViewer;

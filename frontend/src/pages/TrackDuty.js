import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dutyAPI, locationAPI } from '../services/api';
import MapComponent from '../components/MapComponent';
import '../styles/TrackDuty.css';

/**
 * Track Duty Component
 * Staff uses this to track their duty location
 */
const TrackDuty = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [duty, setDuty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingConsent, setTrackingConsent] = useState(false);
  const [dutyEmail, setDutyEmail] = useState('');
  const [dutyPassword, setDutyPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trackingData, setTrackingData] = useState({
    locations: [],
    status: 'ACTIVE',
  });
  const [historyLocations, setHistoryLocations] = useState([]);

  const isViewerRole = user && (user.role === 'hod' || user.role === 'admin');
  const [viewMode, setViewMode] = useState(false);

  // detect URL query parameter for view mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'true') {
      setViewMode(true);
    }
  }, []);

  const isViewer = isViewerRole || viewMode;

  // Fetch duty when component mounts
  useEffect(() => {
    fetchDuty();
  }, [token]);

  // Start tracking if authenticated and consent given
  useEffect(() => {
    if (isAuthenticated) {
      if (!isViewer && trackingConsent && !isTracking) {
        startTracking();
      }
      if (isViewer) {
        // viewer: start polling history & latest location
        fetchViewerData();
        const iv = setInterval(fetchViewerData, 30000);
        return () => clearInterval(iv);
      }
    }
  }, [isAuthenticated, trackingConsent, isViewer]);

  const fetchDuty = async () => {
    try {
      const response = await dutyAPI.getDutyByToken(token);
      setDuty(response.data.duty);
      setLoading(false);
    } catch (err) {
      setError('Invalid or expired tracking link');
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(dutyEmail, dutyPassword);
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Authentication failed');
    }
  };

  const startTracking = () => {
    // mark duty active on backend
    dutyAPI.startDutyTracking(duty.id).catch((e) => console.warn('Failed to start duty', e));

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsTracking(true);
    let locationInterval;

    const startLocationWatch = () => {
      // Initial location
      navigator.geolocation.getCurrentPosition(
        (position) => logLocationData(position),
        (error) => setError(`Location error: ${error.message}`)
      );

      // Set up interval to log location every 30 seconds
      locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => logLocationData(position),
          (error) => console.error('Location error:', error)
        );
      }, parseInt(process.env.REACT_APP_LOCATION_TRACKING_INTERVAL) || 30000);
    };

    startLocationWatch();

    // Stop tracking after duty end time
    const endTime = new Date(`${duty.duty_date}T${duty.end_time}`);
    const now = new Date();
    const timeUntilEnd = endTime.getTime() - now.getTime();

    if (timeUntilEnd > 0) {
      setTimeout(() => {
        stopTracking(locationInterval);
      }, timeUntilEnd);
    }
  };

  const fetchViewerData = async () => {
    if (!duty) return;
    try {
      const logsResp = await locationAPI.getLocationLogs(duty.id, 1000, 0);
      const latestResp = await locationAPI.getLatestLocation(duty.id);
      const logs = logsResp.data.logs || [];
      setHistoryLocations(logs.map(l => ({ latitude: l.latitude, longitude: l.longitude })));
      if (latestResp.data.location) {
        setCurrentLocation({
          latitude: latestResp.data.location.latitude,
          longitude: latestResp.data.location.longitude,
          accuracy: latestResp.data.location.accuracy,
          timestamp: new Date(latestResp.data.location.logged_at),
          withinGeofence: latestResp.data.location.location_status === 'VALID',
          distance: latestResp.data.location.distance,
        });
      }
      setTrackingData(prev => ({ ...prev, locations: logs, status: duty.status }));
    } catch (err) {
      console.error('Viewer data fetch failed', err);
    }
  };

  const logLocationData = async (position) => {
    // append to history for map drawing
    setHistoryLocations((prev) => [
      ...prev,
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    ]);
    try {
      const response = await locationAPI.logLocation(
        duty.id,
        position.coords.latitude,
        position.coords.longitude,
        position.coords.accuracy
      );

      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
        withinGeofence: response.data.withinGeofence,
        distance: response.data.distanceInMeters,
      });

      setTrackingData((prev) => ({
        ...prev,
        locations: [
          ...prev.locations,
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
            withinGeofence: response.data.withinGeofence,
          },
        ],
        status: response.data.withinGeofence ? 'VALID' : 'VIOLATION',
      }));
    } catch (err) {
      console.error('Failed to log location:', err);
    }
  };

  const stopTracking = (interval) => {
    clearInterval(interval);
    setIsTracking(false);
  };

  const handleStopTracking = async () => {
    stopTracking();
    try {
      await dutyAPI.completeDuty(duty.id);
      setError('Tracking completed');
      setHistoryLocations([]);
    } catch (err) {
      setError('Failed to complete duty');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error && !duty) {
    return (
      <div className="track-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="track-container">
        <div className="track-card">
          <h1>Duty Tracking Authentication</h1>
          <div className="duty-info">
            <p>
              <strong>Staff:</strong> {duty.name || 'N/A'}
            </p>
            <p>
              <strong>Duty Date:</strong> {duty.duty_date || 'N/A'}
            </p>
            <p>
              <strong>Time:</strong> {duty.start_time || '--:--'} - {duty.end_time || '--:--'}
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={dutyEmail}
                onChange={(e) => setDutyEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={dutyPassword}
                onChange={(e) => setDutyPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="track-container">
      <div className="track-card">
        <h1>Live Duty Tracking</h1>

        {error && <div className="error-message">{error}</div>}

        {/* show map for both staff and viewers */}
        {duty && (
          <MapComponent
            dutyLocation={{ latitude: duty.latitude, longitude: duty.longitude }}
            staffLocation={currentLocation}
            radius={duty.radius}
            history={isViewer ? historyLocations : trackingData.locations}
          />
        )}

        <div className="duty-details">
          <div className="detail-row">
            <span className="detail-label">Staff:</span>
            <span className="detail-value">{duty.name || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Duty Date:</span>
            <span className="detail-value">{duty.duty_date || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">
              {duty.start_time || '--:--'} - {duty.end_time || '--:--'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location Radius:</span>
            <span className="detail-value">{duty.radius || 0} meters</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`detail-value status-${trackingData.status.toLowerCase()}`}>
              {trackingData.status}
            </span>
          </div>
        </div>
        {isViewer && (
          <div className="viewer-section">
            <h3>Location History</h3>
            <p>Records logged: {historyLocations.length}</p>
            {historyLocations.length > 0 && (
              <div className="history-list">
                <h4>Coordinates</h4>
                <ul>
                  {historyLocations.map((l, idx) => (
                    <li key={idx}>{l.latitude.toFixed(6)}, {l.longitude.toFixed(6)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!isViewer && !isTracking && !trackingConsent && (
          <div className="consent-section">
            <h3>Location Tracking Consent</h3>
            <p>
              We need your explicit consent to track your location during duty hours. Your location
              will be recorded to verify your presence at the designated location.
            </p>
            <div className="consent-checkbox">
              <input
                type="checkbox"
                id="consent"
                checked={trackingConsent}
                onChange={(e) => setTrackingConsent(e.target.checked)}
              />
              <label htmlFor="consent">
                I consent to location tracking during my duty period
              </label>
            </div>
          </div>
        )}

        {isTracking && !isViewer && (
          <div className="tracking-active">
            <h3>Tracking Active</h3>
            {currentLocation && (
              <div className="current-location">
                <p>
                  <strong>Current Location:</strong>
                </p>
                <p>Latitude: {currentLocation.latitude.toFixed(6)}</p>
                <p>Longitude: {currentLocation.longitude.toFixed(6)}</p>
                <p>Accuracy: {currentLocation.accuracy.toFixed(2)}m</p>
                <p>Distance from duty location: {currentLocation.distance.toFixed(2)}m</p>
                <p>
                  Status:
                  <span
                    className={
                      currentLocation.withinGeofence
                        ? 'location-valid'
                        : 'location-violation'
                    }
                  >
                    {currentLocation.withinGeofence ? 'Within Geofence' : 'Outside Geofence'}
                  </span>
                </p>
              </div>
            )}

            <div className="tracking-stats">
              <p>Locations Logged: {trackingData.locations.length}</p>
            </div>

            <button
              onClick={handleStopTracking}
              className="btn btn-danger"
            >
              Complete Tracking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackDuty;

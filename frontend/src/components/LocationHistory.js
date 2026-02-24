import React from 'react';
import '../styles/LocationHistory.css';

/**
 * Location History Component
 * Displays the history of captured locations
 */
const LocationHistory = ({ locations, maxDisplay = 10 }) => {
  const displayedLocations = locations.slice(-maxDisplay).reverse();

  return (
    <div className="location-history">
      <h3>Location History</h3>
      {displayedLocations.length === 0 ? (
        <p className="no-data">No location data available</p>
      ) : (
        <div className="history-list">
          {displayedLocations.map((loc, index) => (
            <div key={index} className="history-item">
              <div className="history-header">
                <span className="history-time">
                  {new Date(loc.timestamp).toLocaleTimeString()}
                </span>
                <span
                  className={`status-badge ${
                    loc.withinGeofence ? 'status-valid' : 'status-violation'
                  }`}
                >
                  {loc.withinGeofence ? 'Valid' : 'Violation'}
                </span>
              </div>
              <div className="history-coords">
                <small>
                  Lat: {loc.latitude.toFixed(6)} | Lon: {loc.longitude.toFixed(6)}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationHistory;

import React from 'react';
import '../styles/DutyDetails.css';

/**
 * Duty Details Component
 * Displays detailed information about a duty
 */
const DutyDetails = ({ duty, statistics }) => {
  if (!duty) {
    return <div className="no-data">No duty data available</div>;
  }

  return (
    <div className="duty-details-container">
      <div className="duty-card">
        <h2>Duty Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <label>Staff Name</label>
            <p>{duty.name}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{duty.email}</p>
          </div>
          <div className="detail-item">
            <label>Department</label>
            <p>{duty.department}</p>
          </div>
          <div className="detail-item">
            <label>Duty Date</label>
            <p>{duty.duty_date}</p>
          </div>
          <div className="detail-item">
            <label>start Time</label>
            <p>{duty.start_time}</p>
          </div>
          <div className="detail-item">
            <label>End Time</label>
            <p>{duty.end_time}</p>
          </div>
          <div className="detail-item">
            <label>Location (Lat/Lon)</label>
            <p>
              {duty.latitude.toFixed(6)}, {duty.longitude.toFixed(6)}
            </p>
          </div>
          <div className="detail-item">
            <label>Geofence Radius</label>
            <p>{duty.radius} meters</p>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <p>
              <span className={`status-badge status-${duty.status.toLowerCase()}`}>
                {duty.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {statistics && (
        <div className="statistics-card">
          <h2>Location Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <label>Total Locations</label>
              <p className="stat-value">{statistics.total_logs}</p>
            </div>
            <div className="stat-item">
              <label>Valid Locations</label>
              <p className="stat-value valid">{statistics.valid_locations}</p>
            </div>
            <div className="stat-item">
              <label>Violations</label>
              <p className="stat-value violation">{statistics.violation_locations}</p>
            </div>
            <div className="stat-item">
              <label>Violation Percentage</label>
              <p className="stat-value">{statistics.violationPercentage || 0}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyDetails;

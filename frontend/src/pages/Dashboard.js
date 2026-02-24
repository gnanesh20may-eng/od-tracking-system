import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dutyAPI } from '../services/api';
import '../styles/Dashboard.css';

/**
 * Dashboard Component
 * HOD and Admin dashboard for managing duties
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkMessage, setLinkMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    staffId: '',
    dutyDate: '',
    startTime: '',
    endTime: '',
    latitude: '',
    longitude: '',
    radius: 500,
  });

  useEffect(() => {
    if (!hasRole(['admin', 'hod'])) {
      navigate('/');
    } else {
      fetchDuties();
    }
  }, []);

  const fetchDuties = async () => {
    try {
      setLoading(true);
      const response = await dutyAPI.getAllDuties(50, 0);
      setDuties(response.data.duties);
    } catch (err) {
      setError('Failed to fetch duties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDuty = async (e) => {
    e.preventDefault();
    console.log('handleCreateDuty called with', formData);
    try {
      // additional front-end validation for business hours
      if (formData.startTime < '09:00' || formData.endTime > '18:00') {
        setError('Duty times must be between 09:00 and 18:00');
        return;
      }
      const response = await dutyAPI.createDuty(
        formData.staffId,
        formData.dutyDate,
        formData.startTime,
        formData.endTime,
        parseFloat(formData.latitude),
        parseFloat(formData.longitude),
        formData.radius
      );
      console.log('createDuty response', response);
      alert(`createDuty success: ${JSON.stringify(response.data)}`);

      setDuties([response.data.duty, ...duties]);
      setShowCreateForm(false);
      setFormData({
        staffId: '',
        dutyDate: '',
        startTime: '',
        endTime: '',
        latitude: '',
        longitude: '',
        radius: 500,
      });

      // Display the returned links on the page instead of only alert
      // sometimes the backend may return undefined values if envs aren't set
      const staffLink = response.data.trackingLink || '(no link received)';
      const viewLink = response.data.viewLink || '(no link received)';
      setError('');
      // use a custom message area to show links
      setLinkMessage(
        `Duty created!\nStaff tracking link: ${staffLink}\nView-only link: ${viewLink}`
      );
    } catch (err) {
      console.error('createDuty error', err);
      const msg = err.response?.data?.error || 'Failed to create duty';
      setError(msg);
      setLinkMessage('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteDuty = async (dutyId) => {
    if (window.confirm('Are you sure you want to delete this duty?')) {
      try {
        await dutyAPI.deleteDuty(dutyId);
        setDuties(duties.filter((d) => d.id !== dutyId));
      } catch (err) {
        setError('Failed to delete duty');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>OD Verification Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user?.name} ({user?.role})</span>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {linkMessage && (
        <div className="link-message">
          <pre>{linkMessage}</pre>
        </div>
      )}

      {hasRole(['hod', 'admin']) && (
        <div className="dashboard-controls">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New Duty'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/history')}
          >
            View Location History
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="create-duty-form">
          <h2>Create New Duty Request</h2>
          <form onSubmit={handleCreateDuty}>
            <div className="form-row">
              <div className="form-group">
                <label>Staff ID</label>
                <input
                  type="number"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duty Date</label>
                <input
                  type="date"
                  value={formData.dutyDate}
                  onChange={(e) => setFormData({ ...formData, dutyDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  min="09:00"
                  max="18:00"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  min="09:00"
                  max="18:00"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="0.00001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="e.g., 28.5355"
                  required
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="0.00001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="e.g., 77.3910"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Geofence Radius (meters)</label>
                <input
                  type="number"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                  min="100"
                  max="2000"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Duty
            </button>
          </form>
        </div>
      )}

      <div className="duties-list">
        <h2>Duty Requests ({duties.length})</h2>
        {duties.length === 0 ? (
          <p className="no-data">No duties found</p>
        ) : (
          <table className="duties-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Duty Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Radius</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {duties.map((duty) => (
                <tr key={duty.id}>
                  <td>{duty.name}</td>
                  <td>{duty.duty_date}</td>
                  <td>
                    {duty.start_time} - {duty.end_time}
                  </td>
                  <td>
                    <span className={`status-badge status-${duty.status.toLowerCase()}`}>
                      {duty.status}
                    </span>
                  </td>
                  <td>{duty.radius}m</td>
                  <td>
                    <button
                      className="btn btn-small btn-info"
                      onClick={() => navigate(`/duty/${duty.id}`)}
                    >
                      View
                    </button>
                    {duty.status === 'PENDING' && (
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteDuty(duty.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

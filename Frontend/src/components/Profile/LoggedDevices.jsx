import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoggedDevices.css';

const LoggedDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/account/logged-devices`, { withCredentials: true });
      setDevices(response.data.devices);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching logged devices:', err);
      setError('Error fetching logged devices');
      setLoading(false);
    }
  };

  if (loading) return <div className="loggeddevices-loading">Loading...</div>;
  if (error) return <div className="loggeddevices-error">{error}</div>;

  return (
    <div className="loggeddevices-container">
      <h2 className="loggeddevices-title">Logged In Devices</h2>
      <ul className="loggeddevices-list">
        {devices.map((device, index) => (
          <li key={device._id} className={`loggeddevices-item ${device.isCurrent ? 'loggeddevices-current' : ''}`}>
            <div className="loggeddevices-info">
              <span className="loggeddevices-device">{device.deviceInfo}</span>
              <span className="loggeddevices-ip">{device.ipAddress}</span>
              <span className="loggeddevices-location">{device.location}</span>
              <span className="loggeddevices-lastactive">Last active: {new Date(device.lastActive).toLocaleString()}</span>
            </div>
            {device.isCurrent && <span className="loggeddevices-current-tag">Current Device</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoggedDevices;

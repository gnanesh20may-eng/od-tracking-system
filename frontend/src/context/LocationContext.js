import React, { createContext, useState } from 'react';

/**
 * Location Context
 * Manages location tracking state
 */

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingError, setTrackingError] = useState(null);
  const [locations, setLocations] = useState([]);

  /**
   * Start location tracking
   */
  const startTracking = (callback) => {
    setIsTracking(true);
    setTrackingError(null);

    if (!navigator.geolocation) {
      setTrackingError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };

        setCurrentLocation(location);
        setLocations((prev) => [...prev, location]);

        if (callback) {
          callback(location);
        }
      },
      (error) => {
        setTrackingError(error.message);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /**
   * Stop location tracking
   */
  const stopTracking = () => {
    setIsTracking(false);
  };

  /**
   * Clear location history
   */
  const clearLocations = () => {
    setLocations([]);
    setCurrentLocation(null);
  };

  const value = {
    isTracking,
    currentLocation,
    trackingError,
    locations,
    startTracking,
    stopTracking,
    clearLocations,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

// Custom hook to use location context
export const useLocation = () => {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

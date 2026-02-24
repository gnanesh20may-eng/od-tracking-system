/**
 * Calculate distance between two geographical points using Haversine formula
 * Distance is calculated in meters
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  
  const toRad = (value) => (value * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
};

/**
 * Validate if location is within geofence radius
 * @param {number} staffLat - Staff's current latitude
 * @param {number} staffLon - Staff's current longitude
 * @param {number} dutyLat - Duty location latitude
 * @param {number} dutyLon - Duty location longitude
 * @param {number} radius - Geofence radius in meters (default: 500m)
 * @returns {boolean} True if within geofence
 */
const isWithinGeofence = (staffLat, staffLon, dutyLat, dutyLon, radius = 500) => {
  const distance = calculateHaversineDistance(staffLat, staffLon, dutyLat, dutyLon);
  return distance <= radius;
};

module.exports = {
  calculateHaversineDistance,
  isWithinGeofence,
};

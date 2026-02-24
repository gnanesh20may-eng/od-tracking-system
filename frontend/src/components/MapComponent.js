import React from 'react';
import '../styles/MapComponent.css';

/**
 * Map Component
 * Displays duty location and staff location on a map using Leaflet
 * (Using Leaflet for map functionality)
 */
const MapComponent = ({ dutyLocation, staffLocation, radius, history }) => {
  const [map, setMap] = React.useState(null);
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    // Dynamic import of Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = await import('leaflet');

      if (mapRef.current && !map) {
        const mapInstance = L.map(mapRef.current).setView(
          [dutyLocation.latitude, dutyLocation.longitude],
          15
        );

        L.tileLayer(process.env.REACT_APP_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstance);

        // Add duty location marker
        L.circleMarker([dutyLocation.latitude, dutyLocation.longitude], {
          radius: 8,
          fillColor: '#4285F4',
          color: '#2E5BF8',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .bindPopup('<strong>Duty Location</strong>')
          .addTo(mapInstance);

        // Add geofence circle
        L.circle([dutyLocation.latitude, dutyLocation.longitude], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.2,
          weight: 2,
          radius: radius || 500,
        })
          .bindPopup(`<strong>Geofence</strong><br/>Radius: ${radius || 500}m`)
          .addTo(mapInstance);

        // Add staff current location if available
        if (staffLocation) {
          L.circleMarker([staffLocation.latitude, staffLocation.longitude], {
            radius: 6,
            fillColor: staffLocation.withinGeofence ? '#00C851' : '#FF4444',
            color: staffLocation.withinGeofence ? '#00AA00' : '#CC0000',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          })
            .bindPopup(
              `<strong>Staff Location</strong><br/>` +
              `Accuracy: ${staffLocation.accuracy?.toFixed(2) || 'N/A'}m<br/>` +
              `Status: ${staffLocation.withinGeofence ? 'Within Geofence' : 'Outside Geofence'}`
            )
            .addTo(mapInstance);
        }

        // draw history polyline if provided
        if (history && history.length > 1) {
          const latlngs = history.map((h) => [h.latitude, h.longitude]);
          L.polyline(latlngs, { color: 'blue' }).addTo(mapInstance);
        }

        setMap(mapInstance);
      }
    };

    initMap().catch((err) => console.error('Map initialization error:', err));

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [dutyLocation, staffLocation, radius, history, map]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default MapComponent;

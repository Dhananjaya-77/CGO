import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// api import කරගන්න
import api from '../api'; 

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LiveMap = () => {
  const defaultPosition = [6.9497, 79.8433]; // කොළඹ වරාය (Center)
  const [activeContainers, setActiveContainers] = useState([]);
  const [traveledPath, setTraveledPath] = useState([]);
  
  // 1. අලුතින් හැදූ State එක - Backend එකෙන් එන නියම පාර මෙතනටයි එන්නේ
  const [plannedRoute, setPlannedRoute] = useState([]);

  // 2. අර අපි හදපු GET API එකෙන් පාර අරගන්න Function එක
  useEffect(() => {
    const fetchPlannedRoute = async () => {
      try {
        // දැනට අපි ටෙස්ට් කරපු කන්ටේනර් ID 1 ට අදාළ පාර ගමු
        const response = await api.get('/api/trips/container/1');
        const tripData = response.data;

        if (tripData && tripData.routeCoordinatesJson) {
          // JSON String එක Object එකක් බවට පත් කිරීම
          const osrmData = JSON.parse(tripData.routeCoordinatesJson);
          
          if (osrmData.routes && osrmData.routes.length > 0) {
            // OSRM එකෙන් එන Coordinates ටික ගන්නවා
            const geojsonCoords = osrmData.routes[0].geometry.coordinates;
            
            // OSRM එවන්නේ [Lon, Lat]. Leaflet Map එකට ඕනේ [Lat, Lon]. ඒක මාරු කරනවා.
            const leafletCoords = geojsonCoords.map(coord => [coord[1], coord[0]]);
            
            setPlannedRoute(leafletCoords); // සිතියමට අලුත් පාර දානවා!
          }
        }
      } catch (error) {
        console.error("Failed to fetch planned route:", error);
      }
    };

    fetchPlannedRoute();
  }, []);

  // 3. Live Locations ගන්න Function එක (කලින් විදිහටමයි)
  useEffect(() => {
    const fetchLiveLocations = async () => {
      try {
        const response = await api.get('/api/monitoring/live-locations');
        const data = response.data;
        setActiveContainers(data);

        if (data.length > 0) {
          const newLocation = [data[0].latitude, data[0].longitude];
          setTraveledPath((prevPath) => [...prevPath, newLocation]);
        }
      } catch (error) {
        console.error("Failed to fetch live locations", error);
      }
    };

    fetchLiveLocations();
    const interval = setInterval(fetchLiveLocations, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200" style={{ height: '500px', zIndex: 0 }}>
      <MapContainer center={defaultPosition} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* ඇත්තම පාර සිතියමේ ඇඳෙනවා (නිල් පාට තිත් ඉර) */}
        {plannedRoute.length > 0 && (
          <Polyline positions={plannedRoute} color="#3B82F6" dashArray="5, 10" weight={4} />
        )}

        {/* දැනටමත් ගියපු පාර (රතු පාට තද ඉර) */}
        {traveledPath.length > 0 && (
          <Polyline positions={traveledPath} color="#EF4444" weight={5} />
        )}

        {/* Containers ටික Marker විදිහට පෙන්වීම */}
        {activeContainers.map((container) => (
          <Marker key={container.containerId} position={[container.latitude, container.longitude]}>
            <Popup>
              <div className="text-sm min-w-[150px]">
                <strong className="text-[#0B3A5A] text-base">{container.containerId}</strong>
                <div className="mt-2 space-y-1">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Status:</span> 
                    <span className="font-medium text-green-600">{container.status}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Speed:</span> 
                    <span className="font-medium">{container.speed} km/h</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Device ID:</span> 
                    <span className="font-medium">{container.deviceId}</span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
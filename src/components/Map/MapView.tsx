
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapMarker from './MapMarker';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Location {
  lat: number;
  lng: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: Location;
  hobby: string;
  hobbyType: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
  date: string;
  attendees: number;
}

// Component to update map view when location changes
const SetViewOnChange = ({ coords }: { coords: Location }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], map.getZoom());
    }
  }, [coords, map]);
  
  return null;
};

interface MapViewProps {
  events?: Event[];
  onMarkerClick?: (event: Event) => void;
  height?: string;
  showControls?: boolean;
}

const MapView = ({ 
  events = [], 
  onMarkerClick, 
  height = "h-[calc(100vh-4rem)]",
  showControls = true 
}: MapViewProps) => {
  const { location, error } = useGeolocation();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Default location (New York City) until geolocation is available
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 40.7128,
    lng: -74.006
  });

  useEffect(() => {
    if (location) {
      setMapCenter(location);
    }
  }, [location]);

  const handleMarkerClick = (event: Event) => {
    setSelectedEvent(event);
    if (onMarkerClick) {
      onMarkerClick(event);
    }
  };

  // Create a stable map center key to avoid unnecessary remounts
  const mapKey = `${mapCenter.lat.toFixed(4)}-${mapCenter.lng.toFixed(4)}`;

  // Define map content components separately to avoid context issues
  const MapContent = () => (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {location && (
        <Marker 
          position={[location.lat, location.lng]}
          icon={defaultIcon}
        >
          <Popup>
            <div>
              <p className="font-medium">Your current location</p>
              <p className="text-xs text-gray-500">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      )}
      
      {events.map((event) => (
        <MapMarker 
          key={event.id}
          event={event}
          onClick={() => handleMarkerClick(event)}
          isSelected={selectedEvent?.id === event.id}
        />
      ))}
      
      <SetViewOnChange coords={mapCenter} />
    </>
  );

  return (
    <div className={`w-full ${height} relative`}>
      {error && (
        <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-md shadow-md text-sm text-red-600">
          {error}
        </div>
      )}
      
      <MapContainer 
        key={mapKey}
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapContent />
      </MapContainer>
    </div>
  );
};

export default MapView;


import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import L from 'leaflet';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapMarker, { Event, Place, MapMarkerItem } from './MapMarker';
import { useIsMobile } from '@/hooks/use-mobile';

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

export interface Location {
  lat: number;
  lng: number;
  floor?: number;
  unit?: string;
  buildingName?: string;
}

// Component for current location marker
const CurrentLocationMarker = ({ location }: { location: Location | null }) => {
  if (!location) return null;
  
  return (
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
  );
};

export interface MapViewProps {
  events?: Event[];
  places?: Place[];
  onMarkerClick?: (item: MapMarkerItem) => void;
  height?: string;
  showControls?: boolean;
  filterHobby?: string;
  filterType?: string;
  filterDistance?: number;
}

const MapView = ({ 
  events = [], 
  places = [],
  onMarkerClick, 
  height = "h-[calc(100vh-4rem)]",
  showControls = true,
  filterHobby,
  filterType,
  filterDistance
}: MapViewProps) => {
  const { location, error } = useGeolocation();
  const [selectedItem, setSelectedItem] = useState<MapMarkerItem | null>(null);
  const isMobile = useIsMobile();
  
  // Default location (New York City) until geolocation is available
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 40.7128,
    lng: -74.006
  });

  // Apply filters to events and places
  const filteredEvents = events.filter(event => {
    // Filter by hobby if specified
    if (filterHobby && filterHobby !== 'All' && event.hobby !== filterHobby) {
      return false;
    }
    
    // Filter by type (only show events if type is 'All' or 'Event')
    if (filterType && filterType !== 'All' && filterType !== 'event') {
      return false;
    }
    
    // Filter by distance if location is available and distance is specified
    if (location && filterDistance && calculateDistance(location, event.location) > filterDistance) {
      return false;
    }
    
    return true;
  });
  
  const filteredPlaces = places.filter(place => {
    // Filter by type if specified
    if (filterType && filterType !== 'All' && place.type !== filterType) {
      return false;
    }
    
    // Filter by distance if location is available and distance is specified
    if (location && filterDistance && calculateDistance(location, place.location) > filterDistance) {
      return false;
    }
    
    return true;
  });
  
  // Helper to calculate distance in kilometers
  const calculateDistance = (point1: Location, point2: Location): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(point2.lat - point1.lat);
    const dLon = toRad(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  useEffect(() => {
    if (location) {
      setMapCenter(location);
    }
  }, [location]);

  const handleMarkerClick = (item: MapMarkerItem) => {
    setSelectedItem(item);
    if (onMarkerClick) {
      onMarkerClick(item);
    }
  };

  // This component is now defined separately to avoid using react-leaflet hooks outside of MapContainer
  const MapContent = () => {
    const map = L.useMap();
    
    // Update map view when center changes
    useEffect(() => {
      map.setView([mapCenter.lat, mapCenter.lng], map.getZoom());
    }, [mapCenter, map]);
    
    return (
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CurrentLocationMarker location={location} />
        
        {/* Render Event Markers */}
        {filteredEvents.map((event) => (
          <MapMarker 
            key={`event-${event.id}`}
            item={event}
            onClick={() => handleMarkerClick(event)}
            isSelected={selectedItem && 'hobby' in selectedItem && selectedItem.id === event.id}
          />
        ))}
        
        {/* Render Place Markers */}
        {filteredPlaces.map((place) => (
          <MapMarker 
            key={`place-${place.id}`}
            item={place}
            onClick={() => handleMarkerClick(place)}
            isSelected={selectedItem && !('hobby' in selectedItem) && selectedItem.id === place.id}
          />
        ))}
      </>
    );
  };

  return (
    <div className={`w-full ${height} relative`}>
      {error && (
        <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-md shadow-md text-sm text-red-600">
          {error}
        </div>
      )}
      
      <MapContainer 
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


import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin, Home, Store, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define marker types
export type MarkerType = 'event' | 'myPlace' | 'publicPlace' | 'property' | 'donation';

// Create custom icons for different marker types
const createMarkerIcon = (type: MarkerType | string, hobbyType: string = 'other', isSelected: boolean = false, isEnhanced: boolean = false) => {
  // Color mapping for different marker types
  const typeColorMap: Record<string, string> = {
    event: '#EF4444',      // Bright red for events
    myPlace: '#3B82F6',    // Blue for your places
    publicPlace: '#F59E0B', // Yellow for public places
    property: '#10B981',   // Green for properties
    donation: '#8B5CF6',   // Purple for donations
  };
  
  // Color mapping for different hobby types (used for event markers)
  const hobbyColorMap: Record<string, string> = {
    sports: '#3B82F6',   // blue
    arts: '#8B5CF6',     // purple
    music: '#EC4899',    // pink
    tech: '#10B981',     // green
    outdoors: '#F59E0B', // amber
    food: '#EF4444',     // red
    other: '#6B7280'     // gray
  };
  
  // Determine base color
  let color;
  if (type === 'event') {
    color = hobbyColorMap[hobbyType] || hobbyColorMap.other;
  } else {
    color = typeColorMap[type] || typeColorMap.event;
  }
  
  // Enhanced marker gets a glow effect
  const enhancedEffect = isEnhanced ? 
    ' filter="drop-shadow(0 0 6px ' + color + ')" stroke-width="2" stroke="white"' : '';
  
  // SVG for marker - different shapes based on type
  let svgPath;
  if (type === 'event') {
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${enhancedEffect}/>`;
  } else if (type === 'myPlace') {
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${enhancedEffect}/><circle cx="16" cy="10" r="4" fill="white"/>`;
  } else if (type === 'property') {
    svgPath = `<path fill="${color}" d="M3 32h26v10H3z"/><path fill="${color}" d="M16 0L1 15h5v17h20V15h5L16 0z"${enhancedEffect}/>`;
  } else if (type === 'donation') {
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${enhancedEffect}/><path fill="white" d="M21 10h-4V6h-2v4h-4v2h4v4h2v-4h4z"/>`;
  } else {
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${enhancedEffect}/>`;
  }
  
  return new Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44">${svgPath}</svg>`,
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -44],
    className: isSelected ? 'marker-bounce' : ''
  });
};

export interface Location {
  lat: number;
  lng: number;
  floor?: number;
  unit?: string;
  buildingName?: string;
}

export interface Place {
  id: string;
  title: string;
  description: string;
  location: Location;
  type: MarkerType;
  isOwner: boolean;
  price?: number;
  photos?: string[];
  isEnhanced?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: Location;
  hobby: string;
  hobbyType: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
  date: string;
  attendees: number;
  placeId?: string;
  isEnhanced?: boolean;
}

export type MapMarkerItem = Event | Place;

interface MapMarkerProps {
  item: MapMarkerItem;
  onClick: () => void;
  isSelected?: boolean;
}

// Helper to determine if the item is an Event
const isEvent = (item: MapMarkerItem): item is Event => {
  return 'hobby' in item && 'date' in item;
};

const MapMarker = ({ item, onClick, isSelected = false }: MapMarkerProps) => {
  // Determine marker type and properties
  let markerType: MarkerType = 'event';
  let hobbyType = 'other';
  const isEnhanced = 'isEnhanced' in item ? item.isEnhanced : false;
  
  if (isEvent(item)) {
    markerType = 'event';
    hobbyType = item.hobbyType;
  } else {
    markerType = item.type;
  }
  
  const icon = createMarkerIcon(markerType, hobbyType, isSelected, isEnhanced);
  
  return (
    <Marker 
      position={[item.location.lat, item.location.lng]} 
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="min-w-[200px] p-1">
          {/* Marker Type Badge */}
          <div className="flex justify-between items-center mb-2">
            {isEvent(item) ? (
              <Badge variant="outline" className={`bg-hobby-${item.hobbyType} text-white`}>
                {item.hobby}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-primary text-white">
                {markerType === 'myPlace' ? 'My Place' : 
                 markerType === 'publicPlace' ? 'Public Place' :
                 markerType === 'property' ? 'Property' : 
                 markerType === 'donation' ? 'Donation' : markerType}
              </Badge>
            )}
            
            {isEnhanced && (
              <Badge variant="secondary">Enhanced</Badge>
            )}
          </div>
          
          <h3 className="text-sm font-bold mb-1">{item.title}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          
          {/* Specific details based on type */}
          {isEvent(item) ? (
            <div className="flex flex-col space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(item.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {item.location.buildingName && `${item.location.buildingName}, `}
                  {item.location.floor && `Floor ${item.location.floor}, `}
                  {item.location.unit && `Unit ${item.location.unit}`}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{item.attendees} attending</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center">
                {markerType === 'property' ? (
                  <Store className="h-3 w-3 mr-1" />
                ) : (
                  <Home className="h-3 w-3 mr-1" />
                )}
                <span>
                  {item.location.buildingName && `${item.location.buildingName}, `}
                  {item.location.floor && `Floor ${item.location.floor}, `}
                  {item.location.unit && `Unit ${item.location.unit}`}
                </span>
              </div>
              {item.type === 'property' && item.price && (
                <div className="flex items-center">
                  <span className="font-medium">${item.price.toLocaleString()}</span>
                </div>
              )}
              {item.type === 'donation' && (
                <div className="flex items-center">
                  <Gift className="h-3 w-3 mr-1" />
                  <span>Free to collect</span>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-3 flex justify-between">
            <Link to={isEvent(item) ? `/events/${item.id}` : `/places/${item.id}`}>
              <Button size="sm" variant="outline">View Details</Button>
            </Link>
            <Button size="sm">
              {isEvent(item) ? 'Join' : item.type === 'property' ? 'Inquire' : item.type === 'donation' ? 'Claim' : 'Visit'}
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;

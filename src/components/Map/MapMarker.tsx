
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin, Home, Store, Gift, Map, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define marker types
export type MarkerType = 'event' | 'myPlace' | 'publicPlace' | 'property' | 'donation';

// Define event types that will have special icons
export type EventType = 'football' | 'swimming' | 'rent' | 'other';

// Create custom icons for different marker types
const createMarkerIcon = (type: MarkerType | string, hobbyType: string = 'other', isSelected: boolean = false, isEnhanced: boolean = false, eventType?: EventType) => {
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

  // Color mapping for specific event types
  const eventTypeColorMap: Record<string, string> = {
    football: '#33C3F0',   // sky blue
    swimming: '#F2FCE2',   // soft green
    rent: '#FEC6A1',       // soft orange
    other: '#9b87f5'       // purple
  };
  
  // Determine base color
  let color;
  if (type === 'event' && eventType) {
    color = eventTypeColorMap[eventType] || eventTypeColorMap.other;
  } else if (type === 'event') {
    color = hobbyColorMap[hobbyType] || hobbyColorMap.other;
  } else {
    color = typeColorMap[type] || typeColorMap.event;
  }
  
  // Enhanced marker gets a glow effect
  const enhancedEffect = isEnhanced ? 
    ' filter="drop-shadow(0 0 6px ' + color + ')" stroke-width="2" stroke="white"' : '';
  
  // SVG for marker - different shapes based on type
  let svgPath;
  
  // Custom event type icons
  if (type === 'event' && eventType) {
    if (eventType === 'football') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${enhancedEffect}/>
                 <path fill="white" d="M16 3c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3 5.5l-1.5 2.6-3 .4-2.2-1.9.4-3 2.8-1.1 2.8 1.1.7 1.9z"/>`;
    } else if (eventType === 'swimming') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${enhancedEffect}/>
                 <path fill="white" d="M20 12c-1.4 0-2.2-.8-2.8-1.3-.5-.4-.7-.7-1.2-.7s-.7.3-1.2.7c-.6.5-1.4 1.3-2.8 1.3s-2.2-.8-2.8-1.3c-.1-.1-.2-.2-.3-.3.1.4.3.8.5 1.3.7.5 1.5 1.3 2.6 1.3s2.2-.8 2.8-1.3c.5-.4.7-.7 1.2-.7s.7.3 1.2.7c.6.5 1.4 1.3 2.8 1.3 1.1 0 1.9-.5 2.4-1-1.1-.7-1.7-1-2.4-1z"/>
                 <path fill="white" d="M20 9c-.5 0-.9-.2-1-.5-.2-.3-.5-.5-1-.5s-.8.2-1 .5c-.1.3-.5.5-1 .5s-.9-.2-1-.5c-.2-.3-.5-.5-1-.5s-.8.2-1 .5c-.1.3-.5.5-1 .5-.8 0-1.5-.7-1.5-1.5S11.2 6 12 6s1.5.7 1.5 1.5c0 .3.1.5.4.6.3.1.5.1.7-.1.1-.1.3-.2.4-.4.1-.1.1-.2.2-.4.2-.3.5-.5.9-.5.6 0 1.1.4 1.3 1 .1.2.3.3.6.3.3 0 .5-.1.6-.3.2-.6.7-1 1.3-1 .8 0 1.5.7 1.5 1.5S20.8 9 20 9z"/>`;
    } else if (eventType === 'rent') {
      svgPath = `<path fill="${color}" d="M16 0 L2 10 L2 30 L30 30 L30 10 Z"${enhancedEffect}/>
                 <path fill="white" d="M16 5 L8 10 L8 25 L24 25 L24 10 Z"/>
                 <path fill="${color}" d="M12 13 L20 13 L20 25 L12 25 Z"/>`;
    } else {
      // Default event icon
      svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${enhancedEffect}/>`;
    }
  } else if (type === 'event') {
    // Standard event icon
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
  eventType?: EventType;
  photos?: string[];
  videos?: string[];
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

// Helper to determine the event type based on hobby or title
const getEventType = (event: Event): EventType => {
  const title = event.title.toLowerCase();
  const hobby = event.hobby.toLowerCase();
  
  if (hobby === 'football' || title.includes('football') || title.includes('soccer')) {
    return 'football';
  } else if (hobby === 'swimming' || title.includes('swim') || title.includes('pool')) {
    return 'swimming';
  } else if (title.includes('rent') || title.includes('lease') || hobby === 'property') {
    return 'rent';
  }
  
  return 'other';
};

const MapMarker = ({ item, onClick, isSelected = false }: MapMarkerProps) => {
  // Determine marker type and properties
  let markerType: MarkerType = 'event';
  let hobbyType = 'other';
  const isEnhanced = 'isEnhanced' in item ? item.isEnhanced : false;
  let eventType: EventType | undefined;
  
  if (isEvent(item)) {
    markerType = 'event';
    hobbyType = item.hobbyType;
    eventType = item.eventType || getEventType(item);
  } else {
    markerType = item.type;
  }
  
  const icon = createMarkerIcon(markerType, hobbyType, isSelected, isEnhanced, eventType);
  
  // Get appropriate icon based on event type for popup
  const getEventIcon = (eventType?: EventType) => {
    if (eventType === 'football') return <Activity className="h-4 w-4 mr-2" />;
    if (eventType === 'swimming') return <Activity className="h-4 w-4 mr-2" />;
    if (eventType === 'rent') return <Store className="h-4 w-4 mr-2" />;
    return <Calendar className="h-4 w-4 mr-2" />;
  };
  
  return (
    <Marker 
      position={[item.location.lat, item.location.lng]} 
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="min-w-[250px] p-2">
          {/* Marker Type Badge */}
          <div className="flex justify-between items-center mb-2">
            {isEvent(item) ? (
              <Badge variant="outline" className={`bg-primary text-white`}>
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
                {getEventIcon(eventType)}
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
              
              {/* Preview of photos if available */}
              {item.photos && item.photos.length > 0 && (
                <div className="mt-1">
                  <div className="flex space-x-1">
                    {item.photos.slice(0, 2).map((photo, index) => (
                      <img 
                        key={index}
                        src={photo} 
                        alt={`Event photo ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {item.photos.length > 2 && (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                        +{item.photos.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
              
              {/* Preview of photos if available */}
              {item.photos && item.photos.length > 0 && (
                <div className="mt-1">
                  <div className="flex space-x-1">
                    {item.photos.slice(0, 2).map((photo, index) => (
                      <img 
                        key={index}
                        src={photo} 
                        alt={`Place photo ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {item.photos.length > 2 && (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                        +{item.photos.length - 2}
                      </div>
                    )}
                  </div>
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

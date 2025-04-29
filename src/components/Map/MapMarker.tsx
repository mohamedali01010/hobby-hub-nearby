import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin, Home, Store, Gift, Map, Building, Restaurant, Shop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define marker types
export type MarkerType = 'event' | 'myPlace' | 'publicPlace' | 'property' | 'donation' | 'flat' | 'restaurant' | 'shop';

// Define event types that will have special icons
export type EventType = 'football' | 'swimming' | 'rent' | 'other';

// Define place categories
export type PlaceCategory = 'flat' | 'restaurant' | 'shop' | 'villa';

// Define place actions
export type PlaceAction = 'rent' | 'sell' | 'buy';

// Create custom icons for different marker types
const createMarkerIcon = (type: MarkerType | string, hobbyType: string = 'other', isSelected: boolean = false, isEnhanced: boolean = false, eventType?: EventType, category?: PlaceCategory) => {
  // Color mapping for different marker types
  const typeColorMap: Record<string, string> = {
    event: '#EF4444',      // Bright red for events
    myPlace: '#3B82F6',    // Blue for your places
    publicPlace: '#F59E0B', // Yellow for public places
    property: '#10B981',   // Green for properties
    donation: '#8B5CF6',   // Purple for donations
    flat: '#EC4899',       // Pink for flats
    villa: '#8B5CF6',      // Purple for villas
    restaurant: '#F59E0B', // Yellow for restaurants
    shop: '#10B981',       // Green for shops
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

  // Category-specific colors
  const categoryColorMap: Record<string, string> = {
    flat: '#EC4899',       // Pink for flats
    villa: '#8B5CF6',      // Purple for villas
    restaurant: '#F59E0B', // Yellow for restaurants
    shop: '#10B981',       // Green for shops
  };
  
  // Determine base color
  let color;
  if (type === 'event' && eventType) {
    color = eventTypeColorMap[eventType] || eventTypeColorMap.other;
  } else if (type === 'event') {
    color = hobbyColorMap[hobbyType] || hobbyColorMap.other;
  } else if (category) {
    color = categoryColorMap[category] || typeColorMap[type];
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
  } else if (category === 'flat' || type === 'flat') {
    // Flat icon
    svgPath = `<path fill="${color}" d="M3 32h26v10H3z"/><path fill="${color}" d="M16 0L1 15h5v17h20V15h5L16 0z"${enhancedEffect}/>`;
  } else if (category === 'villa' || type === 'villa') {
    // Villa icon
    svgPath = `<path fill="${color}" d="M3 32h26v10H3z"/><path fill="${color}" d="M16 0L1 15h5v17h20V15h5L16 0z"${enhancedEffect}/>
               <path fill="white" d="M10 20h12v12H10z"/>`;
  } else if (category === 'restaurant' || type === 'restaurant') {
    // Restaurant icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${enhancedEffect}/>
               <path fill="white" d="M13 5v10c0 .6.4 1 1 1h1v-5h1v5h1v-5h1v5h1c.6 0 1-.4 1-1V5h-7z"/>
               <path fill="white" d="M13 16v1c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-1h-6z"/>`;
  } else if (category === 'shop' || type === 'shop') {
    // Shop icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${enhancedEffect}/>
               <path fill="white" d="M12 7v2h8V7h-8z"/>
               <path fill="white" d="M20 9H12l-1 5h10l-1-5z"/>
               <path fill="white" d="M19 14H13v3h6v-3z"/>`;
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
  category?: PlaceCategory;  // Added property
  action?: PlaceAction;      // Added property
  area?: number;             // Added property (in square meters/feet)
  broker?: BrokerInfo;       // Added property for broker information
  deliverer?: DelivererInfo; // Added property for deliverer information
}

export interface BrokerInfo {
  id: string;
  name: string;
  rating: number;
  commissionsRate: number;
  photoUrl?: string;
}

export interface DelivererInfo {
  id: string;
  name: string;
  rating: number;
  deliveryFee: number;
  photoUrl?: string;
  deliveryArea?: string;
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
  let category: PlaceCategory | undefined;
  
  if (isEvent(item)) {
    markerType = 'event';
    hobbyType = item.hobbyType;
    eventType = item.eventType || getEventType(item);
  } else {
    markerType = item.type;
    category = item.category;
  }
  
  const icon = createMarkerIcon(markerType, hobbyType, isSelected, isEnhanced, eventType, category);
  
  // Get appropriate icon based on event type or place category for popup
  const getIcon = () => {
    if (isEvent(item)) {
      if (item.eventType === 'football') return <Calendar className="h-4 w-4 mr-2" />;
      if (item.eventType === 'swimming') return <Calendar className="h-4 w-4 mr-2" />;
      if (item.eventType === 'rent') return <Calendar className="h-4 w-4 mr-2" />;
      return <Calendar className="h-4 w-4 mr-2" />;
    } else {
      if (item.category === 'flat') return <Building className="h-4 w-4 mr-2" />;
      if (item.category === 'villa') return <Home className="h-4 w-4 mr-2" />;
      if (item.category === 'restaurant') return <Restaurant className="h-4 w-4 mr-2" />;
      if (item.category === 'shop') return <Shop className="h-4 w-4 mr-2" />;
      
      if (item.type === 'myPlace') return <Home className="h-4 w-4 mr-2" />;
      if (item.type === 'property') return <Building className="h-4 w-4 mr-2" />;
      if (item.type === 'donation') return <Gift className="h-4 w-4 mr-2" />;
      
      return <MapPin className="h-4 w-4 mr-2" />;
    }
  };
  
  // Get badge label for place action
  const getActionLabel = (action?: PlaceAction) => {
    switch(action) {
      case 'rent': return 'For Rent';
      case 'sell': return 'For Sale';
      case 'buy': return 'Wanted to Buy';
      default: return '';
    }
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
                {item.category || 
                  (item.type === 'myPlace' ? 'My Place' : 
                  item.type === 'publicPlace' ? 'Public Place' :
                  item.type === 'property' ? 'Property' : 
                  item.type === 'donation' ? 'Donation' : item.type)}
              </Badge>
            )}
            
            {!isEvent(item) && item.action && (
              <Badge variant="secondary">
                {getActionLabel(item.action)}
              </Badge>
            )}
            
            {isEnhanced && (
              <Badge variant="outline" className="bg-amber-500 text-white ml-1">
                Featured
              </Badge>
            )}
          </div>
          
          <h3 className="text-sm font-bold mb-1">{item.title}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          
          {/* Specific details based on type */}
          {isEvent(item) ? (
            <div className="flex flex-col space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center">
                {getIcon()}
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
                {getIcon()}
                <span>
                  {item.location.buildingName && `${item.location.buildingName}, `}
                  {item.location.floor && `Floor ${item.location.floor}, `}
                  {item.location.unit && `Unit ${item.location.unit}`}
                </span>
              </div>
              
              {item.price && (
                <div className="flex items-center font-medium text-sm">
                  ${item.price.toLocaleString()}
                  {item.action === 'rent' && <span className="text-xs ml-1">/month</span>}
                </div>
              )}
              
              {item.area && (
                <div className="flex items-center">
                  <span>{item.area} m²</span>
                </div>
              )}
              
              {/* Broker information if available */}
              {item.broker && (
                <div className="flex items-center mt-1 bg-gray-50 p-1 rounded">
                  <div className="flex items-center text-xs">
                    <span className="font-medium">Broker: </span>
                    <span className="ml-1">{item.broker.name}</span>
                    <span className="ml-1">({item.broker.rating}★)</span>
                  </div>
                </div>
              )}
              
              {/* Deliverer information if available */}
              {item.deliverer && (
                <div className="flex items-center mt-1 bg-gray-50 p-1 rounded">
                  <div className="flex items-center text-xs">
                    <span className="font-medium">Deliverer: </span>
                    <span className="ml-1">{item.deliverer.name}</span>
                    <span className="ml-1">({item.deliverer.rating}★)</span>
                  </div>
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
              {isEvent(item) ? 'Join' : 
               item.action === 'rent' ? 'Rent' :
               item.action === 'sell' ? 'Buy' : 
               item.action === 'buy' ? 'Offer' :
               item.category === 'restaurant' ? 'Book' :
               item.category === 'shop' ? 'Shop' :
               'View'}
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;

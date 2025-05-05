
import { Marker, Popup } from 'react-leaflet';
import { Icon, PointTuple } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign, Square, Briefcase, Truck } from 'lucide-react';

export interface Location {
  lat: number;
  lng: number;
  buildingName?: string;
  floor?: number;
  unit?: string;
}

export interface BrokerInfo {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  rating?: number;
  id?: string;
  photoUrl?: string;
  commissionsRate?: number;
}

export interface DelivererInfo {
  name: string;
  phone?: string;
  vehicle?: string;
  deliveryTime?: string;
  rating?: number;
  id?: string;
  photoUrl?: string;
  deliveryFee?: number;
  deliveryArea?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  hobbies?: string[];
  friends?: string[];
  location?: Location;
}

export type EventType = 'sports' | 'music' | 'food' | 'tech' | 'arts' | 'other';
export type HobbyType = 'sports' | 'music' | 'food' | 'tech' | 'arts' | 'outdoors' | 'other';
export type PlaceCategory = 'flat' | 'villa' | 'restaurant' | 'shop' | 'cafe' | 'bar' | 'hotel' | 'school' | 'park';
export type PlaceAction = 'rent' | 'sell' | 'buy';

export interface Event {
  id: string;
  title: string;
  description?: string;
  location: Location;
  hobby: string;
  hobbyType: HobbyType;
  eventType: EventType | string;
  date: string;
  attendees: number;
  isLive?: boolean;
  liveViewers?: number;
  isEnhanced?: boolean;
  placeId?: string;
  photos?: string[];
  liveQueue?: number;
  createdBy?: string; // User ID of event creator
  attendeesList?: string[]; // List of user IDs who are attending
}

export interface Place {
  id: string;
  title: string;
  description?: string;
  location: Location;
  type: 'property' | 'restaurant' | 'cafe' | 'publicPlace';
  isOwner: boolean;
  category?: PlaceCategory;
  action?: PlaceAction;
  price?: number;
  area?: number;
  broker?: BrokerInfo;
  deliverer?: DelivererInfo;
  isEnhanced?: boolean;
  photos?: string[];
  liveQueue?: {
    count: number;
    estimatedWaitTime: number;
    lastUpdated: string;
    status: 'very-busy' | 'busy' | 'moderate';
  };
  hostedEvents?: Array<Partial<Event>>;
}

export type MapMarkerItem = Event | Place;

// Helper function to determine marker icon based on item type
const getMarkerIcon = (item: MapMarkerItem, isSelected: boolean = false): Icon => {
  // Default icon properties
  const iconOptions = {
    iconUrl: '',
    iconSize: [25, 25] as PointTuple,
    iconAnchor: [12, 12] as PointTuple,
    popupAnchor: [1, -10] as PointTuple,
    className: isSelected ? 'selected-marker' : ''
  };
  
  // Set icon URL based on item type
  if ('hobby' in item) {
    // Event icon
    iconOptions.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
  } else {
    // Place icon based on type
    switch (item.type) {
      case 'property':
        iconOptions.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
        break;
      case 'restaurant':
        iconOptions.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png';
        break;
      case 'cafe':
        iconOptions.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png';
        break;
      case 'publicPlace':
        iconOptions.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
        break;
      default:
        iconOptions.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
    }
  }
  
  return new Icon(iconOptions);
};

interface MapMarkerProps {
  item: MapMarkerItem;
  onClick?: () => void;
  isSelected?: boolean;
}

const MapMarker = ({ item, onClick, isSelected = false }: MapMarkerProps) => {
  const icon = getMarkerIcon(item, isSelected);
  const position = [item.location.lat, item.location.lng];
  
  return (
    <Marker 
      position={position as [number, number]}
      icon={icon}
      eventHandlers={{
        click: () => {
          if (onClick) onClick();
        }
      }}
    >
      <Popup className="marker-popup">
        {'hobby' in item ? (
          // Event popup content
          <div className="min-w-[200px]">
            <h3 className="font-bold mb-1">{item.title}</h3>
            <Badge className="mb-2">{item.hobby}</Badge>
            
            <p className="text-sm line-clamp-2 mb-2">{item.description}</p>
            
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {item.location.buildingName || "Unknown location"}
                  {item.location.floor && `, Floor ${item.location.floor}`}
                  {item.location.unit && `, Unit ${item.location.unit}`}
                </span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{item.attendees} attending</span>
              </div>
            </div>
            
            {onClick && (
              <Button size="sm" className="w-full mt-2">
                View Details
              </Button>
            )}
          </div>
        ) : (
          // Place popup content
          <div className="min-w-[200px]">
            <h3 className="font-bold mb-1">{item.title}</h3>
            <Badge className="mb-2">{item.category || item.type}</Badge>
            
            <p className="text-sm line-clamp-2 mb-2">{item.description}</p>
            
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {item.location.buildingName || "Unknown location"}
                  {item.location.floor && `, Floor ${item.location.floor}`}
                  {item.location.unit && `, Unit ${item.location.unit}`}
                </span>
              </div>
              
              {item.price && (
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  <span>${item.price.toLocaleString()}</span>
                </div>
              )}
              
              {item.area && (
                <div className="flex items-center">
                  <Square className="h-3 w-3 mr-1" />
                  <span>{item.area} m²</span>
                </div>
              )}
              
              {item.broker && (
                <div className="flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" />
                  <span>{item.broker.name}</span>
                </div>
              )}
              
              {item.deliverer && (
                <div className="flex items-center">
                  <Truck className="h-3 w-3 mr-1" />
                  <span>{item.deliverer.name}</span>
                </div>
              )}
            </div>
            
            {onClick && (
              <Button size="sm" className="w-full mt-2">
                View Details
              </Button>
            )}
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default MapMarker;

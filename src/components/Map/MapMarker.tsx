
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Create custom icons for different hobby types
const createHobbyIcon = (type: string, isSelected: boolean = false) => {
  // Default colors for different hobby types
  const colorMap: Record<string, string> = {
    sports: '#3B82F6',   // blue
    arts: '#8B5CF6',     // purple
    music: '#EC4899',    // pink
    tech: '#10B981',     // green
    outdoors: '#F59E0B', // amber
    food: '#EF4444',     // red
    other: '#6B7280'     // gray
  };
  
  const color = colorMap[type] || colorMap.other;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44"><path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z${isSelected ? ' stroke="white" stroke-width="2"' : ''}" opacity="${isSelected ? '1' : '0.9'}"/></svg>`,
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -44]
  });
};

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

interface MapMarkerProps {
  event: Event;
  onClick: () => void;
  isSelected?: boolean;
}

const MapMarker = ({ event, onClick, isSelected = false }: MapMarkerProps) => {
  const icon = createHobbyIcon(event.hobbyType, isSelected);
  const popupId = `popup-${event.id}`;
  
  return (
    <Marker 
      position={[event.location.lat, event.location.lng]} 
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="min-w-[200px] p-1">
          <div className={`mb-1 text-xs font-semibold uppercase text-${event.hobbyType}`}>
            {event.hobby}
          </div>
          <h3 className="text-sm font-bold mb-1">{event.title}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.description}</p>
          
          <div className="flex flex-col space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(event.date).toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>
                {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{event.attendees} attending</span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between">
            <Link to={`/events/${event.id}`}>
              <Button size="sm" variant="outline">View Details</Button>
            </Link>
            <Button size="sm">Join</Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;

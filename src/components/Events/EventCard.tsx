
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HobbyTag from '@/components/UI/HobbyTag';
import { formatDistanceToNow } from 'date-fns';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  hobby: string;
  hobbyType: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
  date: string;
  attendees: number;
  location: string;
  distance?: number;
  creator?: {
    id: string;
    name: string;
    avatar: string;
  };
}

const EventCard = ({
  id,
  title,
  description,
  hobby,
  hobbyType,
  date,
  attendees,
  location,
  distance,
  creator
}: EventCardProps) => {
  const eventDate = new Date(date);
  const timeFromNow = formatDistanceToNow(eventDate, { addSuffix: true });
  const isUpcoming = eventDate > new Date();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 card-hover">
      <div className="flex items-start justify-between mb-3">
        <HobbyTag name={hobby} type={hobbyType} />
        {distance !== undefined && (
          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
            {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`} away
          </span>
        )}
      </div>
      
      <Link to={`/events/${id}`}>
        <h3 className="text-lg font-bold hover:text-primary transition-colors line-clamp-1">{title}</h3>
      </Link>
      
      <p className="text-sm text-gray-600 mt-1 mb-3 line-clamp-2">{description}</p>
      
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{timeFromNow} ({eventDate.toLocaleDateString()})</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          <span>{attendees} attending</span>
        </div>
      </div>
      
      {creator && (
        <div className="flex items-center mt-3 pt-3 border-t">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="h-6 w-6 rounded-full mr-2"
          />
          <span className="text-xs text-gray-500">Created by <Link to={`/profile/${creator.id}`} className="font-medium hover:text-primary">{creator.name}</Link></span>
        </div>
      )}
      
      <div className="mt-4 flex justify-between">
        <Link to={`/events/${id}`}>
          <Button variant="outline" size="sm">Details</Button>
        </Link>
        <Button size="sm">{isUpcoming ? 'Join Event' : 'View Recap'}</Button>
      </div>
    </div>
  );
};

export default EventCard;


import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HobbyTag from '@/components/UI/HobbyTag';

interface Hobby {
  name: string;
  type: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
}

interface UserCardProps {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  hobbies: Hobby[];
  distance?: number;
  commonHobbies?: number;
}

const UserCard = ({
  id,
  name,
  avatar,
  bio,
  location,
  hobbies,
  distance,
  commonHobbies
}: UserCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 card-hover">
      <div className="flex items-start">
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full object-cover border-2 border-primary"
        />
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <Link to={`/profile/${id}`}>
              <h3 className="font-bold hover:text-primary transition-colors">{name}</h3>
            </Link>
            {distance !== undefined && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
              </span>
            )}
          </div>

          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{location}</span>
          </div>
          
          {commonHobbies !== undefined && commonHobbies > 0 && (
            <div className="mt-1 text-xs text-primary font-medium">
              {commonHobbies} {commonHobbies === 1 ? 'hobby' : 'hobbies'} in common
            </div>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{bio}</p>
      
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-1.5">Interests:</p>
        <div className="flex flex-wrap gap-1.5">
          {hobbies.slice(0, 4).map((hobby, index) => (
            <HobbyTag key={index} name={hobby.name} type={hobby.type} />
          ))}
          {hobbies.length > 4 && (
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
              +{hobbies.length - 4} more
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <Link to={`/profile/${id}`}>
          <Button variant="outline" size="sm">View Profile</Button>
        </Link>
        <Button size="sm">Connect</Button>
      </div>
    </div>
  );
};

export default UserCard;

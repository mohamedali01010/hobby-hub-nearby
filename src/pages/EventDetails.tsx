
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, MessageCircle, Share, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import MapView from '@/components/Map/MapView';
import HobbyTag from '@/components/UI/HobbyTag';

// Sample Event Data (in a real app, this would be fetched from an API)
const eventData = {
  id: '1',
  title: 'Sunday Football Match',
  description: 'Join us for a casual 5v5 football match at the local park. All skill levels are welcome! We\'ll play for about 2 hours and maybe grab some drinks afterwards. Don\'t forget to bring water and appropriate footwear. In case of rain, we\'ll reschedule through the group chat.',
  hobby: 'Football',
  hobbyType: 'sports' as const,
  date: '2025-04-20T14:00:00Z',
  location: {
    lat: 51.505,
    lng: -0.09,
    address: 'Victoria Park, London'
  },
  creator: {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/300?img=1'
  },
  attendees: [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/300?img=1',
      hobbies: ['Football', 'Photography']
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/300?img=2',
      hobbies: ['Football', 'Hiking']
    },
    {
      id: '3',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/300?img=3',
      hobbies: ['Football', 'Gaming']
    },
    {
      id: '4',
      name: 'Sarah Williams',
      avatar: 'https://i.pravatar.cc/300?img=4',
      hobbies: ['Football', 'Yoga']
    }
  ],
  comments: [
    {
      id: '1',
      user: {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/300?img=2'
      },
      text: 'Looking forward to this! Do we need to bring our own ball?',
      timestamp: '2025-04-18T10:30:00Z'
    },
    {
      id: '2',
      user: {
        id: '1',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/300?img=1'
      },
      text: 'I\'ll bring a ball, but feel free to bring one as backup!',
      timestamp: '2025-04-18T11:15:00Z'
    }
  ],
  images: [
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=735&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=870&auto=format&fit=crop'
  ]
};

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState('');
  const [isAttending, setIsAttending] = useState(false);
  const [liked, setLiked] = useState(false);
  
  // In a real app, you would fetch the event by ID
  const event = eventData;
  
  // Format date and time
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const handleAttend = () => {
    setIsAttending(!isAttending);
    // In a real app, this would make an API call to join/leave the event
  };
  
  const handleLike = () => {
    setLiked(!liked);
    // In a real app, this would make an API call to like/unlike the event
  };
  
  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // In a real app, this would make an API call to submit the comment
      alert('Comment submitted: ' + comment);
      setComment('');
    }
  };

  // Map data (for the single event marker)
  const mapEvent = {
    id: event.id,
    title: event.title,
    description: event.description,
    location: { lat: event.location.lat, lng: event.location.lng },
    hobby: event.hobby,
    hobbyType: event.hobbyType,
    date: event.date,
    attendees: event.attendees.length
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-16 pb-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content */}
          <div className="md:w-2/3 space-y-6">
            {/* Back Button */}
            <div>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="pl-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Map
                </Button>
              </Link>
            </div>
            
            {/* Event Title & Hobby Tag */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <HobbyTag name={event.hobby} type={event.hobbyType} />
                  <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLike}
                    className={liked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Creator Info */}
              <div className="flex items-center mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={event.creator.avatar} alt={event.creator.name} />
                  <AvatarFallback>{event.creator.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <span className="text-sm text-gray-500">Created by </span>
                  <Link to={`/profile/${event.creator.id}`} className="text-sm font-medium hover:underline">
                    {event.creator.name}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Event Images (if any) */}
            {event.images && event.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg overflow-hidden">
                {event.images.map((image, index) => (
                  <div key={index} className={`h-48 ${index === 0 && event.images.length === 1 ? 'md:col-span-2' : ''}`}>
                    <img
                      src={image}
                      alt={`${event.title} image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Event Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Date</div>
                    <div className="text-gray-500">{formattedDate}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Time</div>
                    <div className="text-gray-500">{formattedTime}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-gray-500">{event.location.address}</div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-lg font-medium mb-2">About this event</h2>
              <p className="text-gray-700 mb-6">{event.description}</p>
              
              <div className="flex justify-center">
                <Button
                  onClick={handleAttend}
                  variant={isAttending ? "outline" : "default"}
                  className="w-full sm:w-auto"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {isAttending ? "Leave Event" : "Join Event"}
                </Button>
              </div>
            </div>
            
            {/* Attendees */}
            <div>
              <h2 className="text-xl font-medium mb-4">
                Attendees ({event.attendees.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.attendees.map((attendee) => (
                  <Link to={`/profile/${attendee.id}`} key={attendee.id}>
                    <div className="bg-white p-4 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
                      <Avatar className="h-16 w-16 mx-auto">
                        <AvatarImage src={attendee.avatar} alt={attendee.name} />
                        <AvatarFallback>{attendee.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <p className="mt-2 font-medium">{attendee.name}</p>
                      <p className="text-xs text-gray-500">
                        {attendee.hobbies.slice(0, 2).join(', ')}
                        {attendee.hobbies.length > 2 && '...'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Comments */}
            <div>
              <h2 className="text-xl font-medium mb-4">
                Comments ({event.comments.length})
              </h2>
              
              <div className="mb-6 space-y-4">
                {event.comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <div className="font-medium text-sm">
                          <Link to={`/profile/${comment.user.id}`} className="hover:underline">
                            {comment.user.name}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
                <h3 className="text-sm font-medium">Add a comment</h3>
                <Textarea
                  placeholder="Write your comment here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button onClick={handleCommentSubmit}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3 space-y-6">
            {/* Map Preview */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h2 className="text-lg font-medium mb-3">Location</h2>
              <div className="h-64">
                <MapView
                  events={[mapEvent]}
                  height="h-full"
                  showControls={false}
                />
              </div>
              <p className="mt-3 text-sm text-gray-700">{event.location.address}</p>
            </div>
            
            {/* Similar Events (placeholder) */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h2 className="text-lg font-medium mb-3">Similar Events</h2>
              <p className="text-gray-500 text-sm">
                Discover more {event.hobby} events in your area
              </p>
              <Button variant="link" className="p-0">
                Browse more events
              </Button>
            </div>
            
            {/* Share Event (placeholder) */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h2 className="text-lg font-medium mb-3">Share This Event</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">Copy Link</Button>
                <Button variant="outline" size="sm" className="flex-1">Share</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default EventDetails;

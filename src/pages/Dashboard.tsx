import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, MapPin, Map, Plus, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import MapView from '@/components/Map/MapView';
import EventCard from '@/components/Events/EventCard';
import UserCard from '@/components/Users/UserCard';
import HobbyTag from '@/components/UI/HobbyTag';
import { useAuth } from '@/context/AuthContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

// Sample event data with specialized event types
const sampleEvents = [
  {
    id: '1',
    title: 'Sunday Football Match',
    description: 'Casual 5v5 football match. All skill levels welcome!',
    location: { lat: 51.505, lng: -0.09 },
    hobby: 'Football',
    hobbyType: 'sports' as const,
    date: '2025-04-20T14:00:00Z',
    attendees: 8,
    eventType: 'football' as const,
    photos: [
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2533',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2576'
    ],
    videos: ['https://example.com/football-video.mp4']
  },
  {
    id: '2',
    title: 'Photography Walk',
    description: 'Explore the city and capture its beauty with fellow photography enthusiasts.',
    location: { lat: 51.507, lng: -0.1 },
    hobby: 'Photography',
    hobbyType: 'arts' as const,
    date: '2025-04-19T10:00:00Z',
    attendees: 5,
    photos: [
      'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=2187',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2370'
    ]
  },
  {
    id: '3',
    title: 'Swimming Class for Beginners',
    description: 'Learn swimming basics in a friendly environment. All equipment provided.',
    location: { lat: 51.503, lng: -0.11 },
    hobby: 'Swimming',
    hobbyType: 'sports' as const,
    date: '2025-04-21T18:00:00Z',
    attendees: 6,
    eventType: 'swimming' as const,
    photos: [
      'https://images.unsplash.com/photo-1560090995-01632a28895b?q=80&w=2594',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2940'
    ],
    videos: ['https://example.com/swimming-tips.mp4']
  },
  {
    id: '4',
    title: 'Coding Workshop',
    description: 'Learn the basics of web development in this beginner-friendly workshop.',
    location: { lat: 51.51, lng: -0.08 },
    hobby: 'Programming',
    hobbyType: 'tech' as const,
    date: '2025-04-22T17:00:00Z',
    attendees: 12,
    photos: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2944',
      'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2940'
    ]
  },
  {
    id: '5',
    title: 'Apartment Viewing - Central London',
    description: 'Open house for a modern 2-bedroom apartment in central London.',
    location: { lat: 51.515, lng: -0.09 },
    hobby: 'Property',
    hobbyType: 'other' as const,
    date: '2025-04-25T14:00:00Z',
    attendees: 3,
    eventType: 'rent' as const,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2940',
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2787'
    ],
    videos: ['https://example.com/apartment-tour.mp4']
  },
];

// Sample places data
const samplePlaces = [
  {
    id: 'p1',
    title: 'Local Sports Center',
    description: 'Multi-purpose sports facility with football fields, swimming pool, and gym.',
    location: { lat: 51.508, lng: -0.11 },
    type: 'publicPlace' as const,
    isOwner: false
  },
  {
    id: 'p2',
    title: 'City Photography Studio',
    description: 'Professional studio with equipment rental and workshop space.',
    location: { lat: 51.502, lng: -0.09 },
    type: 'publicPlace' as const,
    isOwner: false
  },
  {
    id: 'p3',
    title: 'Central Apartment',
    description: 'Modern 2-bedroom apartment near city center with great amenities.',
    location: { lat: 51.515, lng: -0.09 },
    type: 'property' as const,
    isOwner: true,
    price: 1500,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2940',
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2787'
    ]
  }
];

// Sample user data
const sampleUsers = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/300?img=1',
    bio: 'Football enthusiast and weekend photographer. Always up for a game or a photo walk!',
    location: 'London, UK',
    hobbies: [
      { name: 'Football', type: 'sports' as const },
      { name: 'Photography', type: 'arts' as const },
    ],
    distance: 0.5,
    commonHobbies: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/300?img=2',
    bio: 'Guitar player and hiker. Love to explore new trails and jam with fellow musicians.',
    location: 'London, UK',
    hobbies: [
      { name: 'Guitar', type: 'music' as const },
      { name: 'Hiking', type: 'outdoors' as const },
    ],
    distance: 1.2,
    commonHobbies: 1,
  },
  {
    id: '3',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/300?img=3',
    bio: 'Tech enthusiast and amateur chef. Always coding something new or experimenting in the kitchen.',
    location: 'London, UK',
    hobbies: [
      { name: 'Programming', type: 'tech' as const },
      { name: 'Cooking', type: 'food' as const },
    ],
    distance: 2.5,
    commonHobbies: 1,
  },
];

// Available hobby filters
const hobbyFilters = [
  { name: 'All', type: 'all' as const },
  { name: 'Football', type: 'sports' as const },
  { name: 'Basketball', type: 'sports' as const },
  { name: 'Swimming', type: 'sports' as const },
  { name: 'Photography', type: 'arts' as const },
  { name: 'Painting', type: 'arts' as const },
  { name: 'Guitar', type: 'music' as const },
  { name: 'Programming', type: 'tech' as const },
  { name: 'Hiking', type: 'outdoors' as const },
  { name: 'Cooking', type: 'food' as const },
  { name: 'Property', type: 'other' as const },
];

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('events');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHobby, setSelectedHobby] = useState<string>('All');
  const [placeType, setPlaceType] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState([10]); // km
  const [dateFilter, setDateFilter] = useState('all'); // all, today, tomorrow, this-week
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Apply filters to events
  const filteredEvents = sampleEvents.filter(event => {
    // Apply hobby filter
    if (selectedHobby !== 'All' && event.hobby !== selectedHobby) return false;
    
    // Apply search filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.hobby.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Apply date filter
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (!(eventDate >= today && eventDate < tomorrow)) return false;
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      if (!(eventDate >= tomorrow && eventDate < dayAfterTomorrow)) return false;
    } else if (dateFilter === 'this-week') {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
      if (!(eventDate >= today && eventDate < endOfWeek)) return false;
    }
    
    return true;
  });
  
  // Apply filters to users
  const filteredUsers = sampleUsers.filter(user => {
    // Apply hobby filter
    if (selectedHobby !== 'All' && !user.hobbies.some(h => h.name === selectedHobby)) return false;
    
    // Apply search filter
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.bio.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.hobbies.some(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    
    // Apply distance filter
    if (user.distance > maxDistance[0]) return false;
    
    return true;
  });

  const handleMarkerClick = (item: any) => {
    // When a marker is clicked on the map
    setSelectedEvent(item.id);
    
    if ('hobby' in item) {
      toast({
        title: item.title,
        description: `${item.hobby} event on ${new Date(item.date).toLocaleDateString()}`,
        action: (
          <Button size="sm" variant="outline" onClick={() => navigate(`/events/${item.id}`)}>
            View Details
          </Button>
        ),
      });
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar Toggle Button (Mobile) */}
        {isMobile && (
          <button
            className={`${
              sidebarOpen ? "hidden" : "flex"
            } fixed top-20 left-4 z-40 items-center justify-center p-2 rounded-full bg-white shadow-md`}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open filters"
          >
            <Filter className="h-5 w-5" />
          </button>
        )}
        
        {/* Sidebar */}
        <div
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            fixed md:relative z-30 h-[calc(100vh-4rem)] w-80 bg-white border-r shadow-md transition-transform duration-300 ease-in-out
            flex flex-col
          `}
        >
          {/* Sidebar Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg">Filters</h2>
            {isMobile && (
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Search and Filters */}
          <div className="p-4 space-y-6 overflow-y-auto flex-grow">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Tabs: Events/People */}
            <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
                <TabsTrigger value="people" className="flex-1">People</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Hobby Filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {hobbyFilters.map((hobby) => (
                  <button
                    key={hobby.name}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      selectedHobby === hobby.name 
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedHobby(hobby.name)}
                  >
                    {hobby.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Type Filter (only for places) */}
            {activeTab === 'events' && (
              <div>
                <h3 className="text-sm font-medium mb-2">Place Type</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      placeType === 'All' 
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPlaceType('All')}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      placeType === 'event' 
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPlaceType('event')}
                  >
                    Events
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      placeType === 'property' 
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPlaceType('property')}
                  >
                    Properties
                  </button>
                </div>
              </div>
            )}
            
            {/* Distance Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Distance</h3>
                <span className="text-xs text-gray-500">{maxDistance[0]} km</span>
              </div>
              <Slider 
                defaultValue={[10]} 
                max={50} 
                step={1} 
                value={maxDistance}
                onValueChange={setMaxDistance}
              />
            </div>
            
            {/* Date Filter (only for events tab) */}
            {activeTab === 'events' && (
              <div>
                <h3 className="text-sm font-medium mb-2">Date</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={dateFilter === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={dateFilter === 'today' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter('today')}
                  >
                    Today
                  </Button>
                  <Button
                    variant={dateFilter === 'tomorrow' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter('tomorrow')}
                  >
                    Tomorrow
                  </Button>
                  <Button
                    variant={dateFilter === 'this-week' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter('this-week')}
                  >
                    This Week
                  </Button>
                </div>
              </div>
            )}
            
            {/* Create New Event/Place Button */}
            <Button className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create New {activeTab === 'events' ? 'Event' : 'Place'}
            </Button>
          </div>
          
          {/* Results Count */}
          <div className="px-4 py-3 border-t text-sm text-gray-500">
            {activeTab === 'events' ? (
              <p>{filteredEvents.length} events found</p>
            ) : (
              <p>{filteredUsers.length} people found</p>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative flex-grow flex">
          {/* Map Container - Now wrapped in a div with relative positioning */}
          <div className="relative flex-grow overflow-hidden">
            <MapView 
              events={filteredEvents}
              places={samplePlaces} 
              onMarkerClick={handleMarkerClick}
              filterHobby={selectedHobby}
              filterType={placeType}
              filterDistance={maxDistance[0]} 
            />
          </div>
          
          {/* Results Panel (Right Side) - Absolute positioning removed */}
          <div className="z-10 w-80 bg-white shadow-md h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {activeTab === 'events' ? 'Events' : 'People'}
              </h2>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Results List */}
            <div className="p-4 overflow-y-auto flex-grow">
              {activeTab === 'events' ? (
                filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      hobby={event.hobby}
                      hobbyType={event.hobbyType}
                      date={event.date}
                      attendees={event.attendees}
                      location={`${event.location.lat.toFixed(4)}, ${event.location.lng.toFixed(4)}`}
                      distance={1.2} // This would be calculated from the user's location
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-10 w-10 mb-2 opacity-50" />
                    <p>No events found matching your filters</p>
                    <Button variant="link" onClick={() => {
                      setSearchQuery('');
                      setSelectedHobby('All');
                      setDateFilter('all');
                    }}>
                      Reset filters
                    </Button>
                  </div>
                )
              ) : (
                filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <UserCard
                      key={user.id}
                      id={user.id}
                      name={user.name}
                      avatar={user.avatar}
                      bio={user.bio}
                      location={user.location}
                      hobbies={user.hobbies}
                      distance={user.distance}
                      commonHobbies={user.commonHobbies}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto h-10 w-10 mb-2 opacity-50" />
                    <p>No people found matching your filters</p>
                    <Button variant="link" onClick={() => {
                      setSearchQuery('');
                      setSelectedHobby('All');
                    }}>
                      Reset filters
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


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

// Sample event data
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
  },
  {
    id: '3',
    title: 'Guitar Jam Session',
    description: 'Bring your guitar and join us for an evening of music and fun!',
    location: { lat: 51.503, lng: -0.11 },
    hobby: 'Guitar',
    hobbyType: 'music' as const,
    date: '2025-04-21T18:00:00Z',
    attendees: 4,
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
  },
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
  { name: 'Photography', type: 'arts' as const },
  { name: 'Painting', type: 'arts' as const },
  { name: 'Guitar', type: 'music' as const },
  { name: 'Programming', type: 'tech' as const },
  { name: 'Hiking', type: 'outdoors' as const },
  { name: 'Cooking', type: 'food' as const },
];

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const isMobile = useIsMobile();
  
  const [activeTab, setActiveTab] = useState('events');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHobby, setSelectedHobby] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState([10]); // km
  const [dateFilter, setDateFilter] = useState('all'); // all, today, tomorrow, this-week
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Mock data manipulation based on filters
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
      
      <div className="flex-grow flex relative">
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
          {/* Map Container */}
          <div className="absolute inset-0">
            <MapView 
              events={sampleEvents} 
              onMarkerClick={(event) => setSelectedEvent(event.id)} 
            />
          </div>
          
          {/* Results Panel (Right Side) */}
          <div className="relative z-10 w-80 bg-white shadow-md ml-auto h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
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
            <div className="p-4 overflow-y-auto flex-grow space-y-4">
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

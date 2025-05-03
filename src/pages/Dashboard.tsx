import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, MapPin, Map, Plus, Users, X, Radio, Flame, Wifi } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/UI/Navbar';
import MapView from '@/components/Map/MapView';
import EventCard from '@/components/Events/EventCard';
import UserCard from '@/components/Users/UserCard';
import HobbyTag from '@/components/UI/HobbyTag';
import { useAuth } from '@/context/AuthContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { generateSampleEvents, generateSamplePlaces } from '@/utils/sampleData';
import { Badge } from '@/components/ui/badge';
import { EventProvider } from '@/context/EventContext';
import { useEvents } from '@/context/EventContext';
import EventHistory from '@/components/Events/EventHistory';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarClock } from 'lucide-react';

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

// Place type filters
const placeTypeFilters = [
  { name: 'All', type: 'all' },
  { name: 'My Places', type: 'myPlace' },
  { name: 'Public Places', type: 'publicPlace' },
  { name: 'Properties', type: 'property' },
  { name: 'Donations', type: 'donation' },
];

// Place category filters
const placeCategoryFilters = [
  { name: 'All', type: 'all' },
  { name: 'Flats', type: 'flat' },
  { name: 'Villas', type: 'villa' },
  { name: 'Restaurants', type: 'restaurant' },
  { name: 'Shops', type: 'shop' },
  { name: 'Cafes', type: 'cafe' },
  { name: 'Bars', type: 'bar' },
  { name: 'Hotels', type: 'hotel' },
  { name: 'Schools', type: 'school' },
  { name: 'Parks', type: 'park' },
  { name: 'Landmarks', type: 'landmark' },
  { name: 'Theaters', type: 'theater' },
  { name: 'Beaches', type: 'beach' },
  { name: 'Camping', type: 'camping' },
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

// Extract the DashboardContent component to use the EventContext
const DashboardContent = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { displayedEvents, friendEvents, suggestedEvents, pastEvents, filterEvents, markEventComplete } = useEvents();
  
  const [activeTab, setActiveTab] = useState('events');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHobby, setSelectedHobby] = useState<string>('All');
  const [placeType, setPlaceType] = useState<string>('All');
  const [placeCategory, setPlaceCategory] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState([10]); // km
  const [dateFilter, setDateFilter] = useState('all'); // all, today, tomorrow, this-week
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'friends' | 'suggested'>('all');
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  
  // Generate the sample data when component loads
  const [places, setPlaces] = useState(() => {
    const defaultLocation = { lat: 51.505, lng: -0.09 };
    const center = location || defaultLocation;
    return generateSamplePlaces(20, center);
  });
  
  // Update sample data if location changes
  useEffect(() => {
    if (location) {
      setPlaces(generateSamplePlaces(20, location));
    }
  }, [location]);
  
  // Apply filters when filter state changes
  useEffect(() => {
    filterEvents({
      showAll: filterMode === 'all',
      showFriendsOnly: filterMode === 'friends',
      showSuggestedOnly: filterMode === 'suggested',
      hobby: selectedHobby !== 'All' ? selectedHobby : undefined,
      dateRange: dateFilter !== 'all' ? dateFilter as ('today' | 'tomorrow' | 'this-week') : undefined,
      distance: maxDistance[0],
      liveOnly: showLiveOnly
    });
  }, [filterMode, selectedHobby, dateFilter, maxDistance, showLiveOnly, filterEvents]);
  
  // Apply filters to places
  const filteredPlaces = places.filter(place => {
    // Apply type filter
    if (placeType !== 'All' && place.type !== placeType) return false;
    
    // Apply category filter
    if (placeCategory !== 'All' && place.category !== placeCategory) return false;
    
    // Apply search filter
    if (searchQuery && !place.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !place.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Apply distance filter (pending implementation)
    
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
  
  // New function to handle event completion
  const handleMarkEventComplete = (eventId: string) => {
    markEventComplete(eventId);
    toast({
      title: "Event Completed",
      description: "The event has been moved to your history.",
    });
  };
  
  // Calculate stats
  const liveEventsCount = displayedEvents.filter(e => e.isLive).length;
  const placesWithLiveQueueCount = places.filter(p => p.liveQueue).length;
  const todayEventsCount = displayedEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return eventDate >= today && eventDate < tomorrow;
  }).length;

  return (
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
        
        {/* Stats Summary */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex items-center">
              <Radio className="h-3 w-3 mr-1 text-red-500" />
              <span>{liveEventsCount} live events</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-blue-500" />
              <span>{todayEventsCount} today</span>
            </div>
            <div className="flex items-center">
              <Wifi className="h-3 w-3 mr-1 text-purple-500" />
              <span>{placesWithLiveQueueCount} live updates</span>
            </div>
          </div>
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
          
          {/* View Buttons for Event Tab */}
          {activeTab === 'events' && (
            <div>
              <h3 className="text-sm font-medium mb-2">View</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={filterMode === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode('all')}
                >
                  All Events
                </Button>
                <Button
                  variant={filterMode === 'friends' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode('friends')}
                >
                  Friends
                </Button>
                <Button
                  variant={filterMode === 'suggested' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode('suggested')}
                >
                  Suggested
                </Button>
              </div>
              <Button 
                variant="outline"
                className="w-full mt-2"
                onClick={() => setHistoryDialogOpen(true)}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Event History
              </Button>
            </div>
          )}
          
          {/* Tabs: Events/People */}
          <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
              <TabsTrigger value="places" className="flex-1">Places</TabsTrigger>
              <TabsTrigger value="people" className="flex-1">People</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Live only toggle (for events) */}
          {activeTab === 'events' && (
            <div className="flex items-center justify-between">
              <label htmlFor="live-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    id="live-toggle" 
                    type="checkbox" 
                    className="sr-only" 
                    checked={showLiveOnly}
                    onChange={() => setShowLiveOnly(!showLiveOnly)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${showLiveOnly ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showLiveOnly ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-medium flex items-center">
                  <Flame className={`mr-1 h-4 w-4 ${showLiveOnly ? 'text-red-500' : 'text-gray-500'}`} />
                  Show Live Events Only
                </div>
              </label>
            </div>
          )}
          
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
          
          {/* Place Type Filter (only for places tab) */}
          {activeTab === 'places' && (
            <div>
              <h3 className="text-sm font-medium mb-2">Place Type</h3>
              <div className="flex flex-wrap gap-2">
                {placeTypeFilters.map((filter) => (
                  <button
                    key={filter.type}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      placeType === filter.type 
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPlaceType(filter.type)}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Place Category Filter (only for places tab) */}
          {activeTab === 'places' && (
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {placeCategoryFilters.map((filter) => (
                  <button
                    key={filter.type}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      placeCategory === filter.type 
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPlaceCategory(filter.type)}
                  >
                    {filter.name}
                  </button>
                ))}
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
            Create New {activeTab === 'events' ? 'Event' : activeTab === 'places' ? 'Place' : 'Connection'}
          </Button>
        </div>
        
        {/* Results Count */}
        <div className="px-4 py-3 border-t text-sm text-gray-500">
          {activeTab === 'events' ? (
            <p>{displayedEvents.length} events found</p>
          ) : activeTab === 'places' ? (
            <p>{filteredPlaces.length} places found</p>
          ) : (
            <p>{filteredUsers.length} people found</p>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative flex-grow flex">
        {/* Map Container - Now wrapped in a div with relative positioning */}
        <div className="relative flex-grow">
          <MapView 
            events={displayedEvents}
            places={filteredPlaces} 
            onMarkerClick={handleMarkerClick}
            filterHobby={selectedHobby !== 'All' ? selectedHobby : undefined}
            filterType={placeType !== 'All' ? placeType : undefined}
            filterCategory={placeCategory !== 'All' ? placeCategory : undefined}
            filterDistance={maxDistance[0]} 
            height="h-full"
            showControls={true}
          />
        </div>
        
        {/* Results Panel (Right Side) */}
        <div className="w-80 results-sidebar">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              {activeTab === 'events' ? 'Events' : activeTab === 'places' ? 'Places' : 'People'}
            </h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Results List */}
          <div className="p-4 results-content">
            {activeTab === 'events' ? (
              displayedEvents.length > 0 ? (
                <div className="space-y-4">
                  {/* Live Events Section */}
                  {displayedEvents.some(event => event.isLive) && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium flex items-center mb-3">
                        <Radio className="h-4 w-4 mr-1 text-red-500" />
                        Live Events
                      </h3>
                      <div className="space-y-3">
                        {displayedEvents
                          .filter(event => event.isLive)
                          .map(event => (
                            <div 
                              key={event.id} 
                              className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary relative ${
                                selectedEvent === event.id ? 'border-primary bg-primary/5' : ''
                              }`}
                              onClick={() => setSelectedEvent(event.id)}
                            >
                              <div className="absolute -top-2 -right-2">
                                <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
                              </div>
                              {filterMode === 'friends' && (
                                <div className="absolute -top-2 -left-2">
                                  <Badge className="bg-blue-500 text-white">FRIEND</Badge>
                                </div>
                              )}
                              {filterMode === 'suggested' && (
                                <div className="absolute -top-2 -left-2">
                                  <Badge className="bg-purple-500 text-white">FOR YOU</Badge>
                                </div>
                              )}
                              <div className="flex items-start justify-between">
                                <h3 className="font-medium">{event.title}</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                                  {event.hobby}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{event.liveViewers} watching now</span>
                              </div>
                              <div className="mt-2 flex justify-between">
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkEventComplete(event.id);
                                  }}
                                >
                                  Mark Complete
                                </Button>
                                <Button 
                                  size="sm"
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/events/${event.id}`);
                                  }}
                                >
                                  Join Live
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Upcoming Events Section */}
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-3">
                      <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                      {showLiveOnly ? 'No Other Events' : 'Upcoming Events'}
                    </h3>
                    <div className="space-y-3">
                      {displayedEvents
                        .filter(event => !event.isLive)
                        .map(event => (
                          <div
                            key={event.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary relative ${
                              selectedEvent === event.id ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setSelectedEvent(event.id)}
                          >
                            {filterMode === 'friends' && (
                              <div className="absolute -top-2 -left-2">
                                <Badge className="bg-blue-500 text-white">FRIEND</Badge>
                              </div>
                            )}
                            {filterMode === 'suggested' && (
                              <div className="absolute -top-2 -left-2">
                                <Badge className="bg-purple-500 text-white">FOR YOU</Badge>
                              </div>
                            )}
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium">{event.title}</h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                {event.hobby}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{event.attendees} attending</span>
                              </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkEventComplete(event.id);
                                }}
                              >
                                Mark Complete
                              </Button>
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/events/${event.id}`);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No events found matching your filters</p>
                  <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setSelectedHobby('All');
                    setDateFilter('all');
                    setShowLiveOnly(false);
                    setFilterMode('all');
                  }}>
                    Reset filters
                  </Button>
                </div>
              )
            ) : activeTab === 'places' ? (
              filteredPlaces.length > 0 ? (
                <div className="space-y-4">
                  {/* Places with Live Queues Section */}
                  {filteredPlaces.some(place => place.liveQueue) && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium flex items-center mb-3">
                        <Wifi className="h-4 w-4 mr-1 text-purple-500" />
                        Places with Live Updates
                      </h3>
                      <div className="space-y-3">
                        {filteredPlaces
                          .filter(place => place.liveQueue)
                          .map(place => (
                            <div 
                              key={place.id} 
                              className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary relative ${
                                selectedEvent === place.id ? 'border-primary bg-primary/5' : ''
                              }`}
                              onClick={() => setSelectedEvent(place.id)}
                            >
                              <div className="absolute -top-2 -right-2">
                                <Badge 
                                  className={`
                                    ${place.liveQueue?.status === 'low' ? 'bg-green-500' : 
                                      place.liveQueue?.status === 'moderate' ? 'bg-amber-500' : 
                                      place.liveQueue?.status === 'busy' ? 'bg-orange-500' : 'bg-red-500'} 
                                    text-white
                                  `}
                                >
                                  {place.liveQueue?.status.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="flex items-start justify-between">
                                <h3 className="font-medium">{place.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  place.category === 'restaurant' ? 'bg-amber-100 text-amber-700' :
                                  place.category === 'cafe' ? 'bg-orange-100 text-orange-700' :
                                  place.category === 'shop' ? 'bg-green-100 text-green-700' :
                                  place.category === 'bar' ? 'bg-purple-100 text-purple-700' :
                                  place.category === 'hotel' ? 'bg-blue-100 text-blue-700' :
                                  place.category === 'school' ? 'bg-pink-100 text-pink-700' :
                                  place.category === 'park' ? 'bg-yellow-100 text-yellow-700' :
                                  place.category === 'landmark' ? 'bg-gray-100 text-gray-700' :
                                  place.category === 'theater' ? 'bg-indigo-100 text-indigo-700' :
                                  place.category === 'beach' ? 'bg-pink-100 text-pink-700' :
                                  place.category === 'camping' ? 'bg-green-100 text-green-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {place.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{place.description}</p>
                              <div className="mt-2 flex justify-between items-center text-xs">
                                <span className="text-gray-500">
                                  {place.liveQueue?.count} in queue • {place.liveQueue?.estimatedWaitTime} min wait
                                </span>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/places/${place.id}`);
                                  }}
                                >
                                  Details
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Other Places Section */}
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                      All Places
                    </h3>
                    <div className="space-y-3">
                      {filteredPlaces
                        .filter(place => !place.liveQueue)
                        .map(place => (
                          <div 
                            key={place.id} 
                            className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                              selectedEvent === place.id ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setSelectedEvent(place.id)}
                          >
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium">{place.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                place.type === 'myPlace' ? 'bg-blue-100 text-blue-700' : 
                                place.type === 'publicPlace' ? 'bg-amber-100 text-amber-700' :
                                place.type === 'property' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {place.category || place.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{place.description}</p>
                            
                            {place.location.buildingName && (
                              <div className="mt-1 text-xs text-gray-500">
                                {place.location.buildingName}
                              </div>
                            )}
                            
                            {place.price && (
                              <div className="mt-1 font-bold">${place.price.toLocaleString()}</div>
                            )}
                            
                            <div className="mt-2 flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/places/${place.id}`);
                                }}
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No places found matching your filters</p>
                  <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setPlaceType('All');
                    setPlaceCategory('All');
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

      {/* Event History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event History</DialogTitle>
          </DialogHeader>
          <EventHistory 
            userEvents={pastEvents} 
            placeEvents={[]} // In a real app, you would filter by selected place
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { location } = useGeolocation();
  
  // Generate the sample data when component loads
  const [events, setEvents] = useState(() => {
    const defaultLocation = { lat: 51.505, lng: -0.09 };
    const center = location || defaultLocation;
    return generateSampleEvents(40, center);
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
      <EventProvider initialEvents={events}>
        <DashboardContent />
      </EventProvider>
    </div>
  );
};

export default Dashboard;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Filter, Plus, Users, Clock, UserCircle2, Heart, Sparkles, MapIcon, Target } from 'lucide-react';
import Navbar from '@/components/UI/Navbar';
import MapView from '@/components/Map/MapView';
import { Event, MapMarkerItem, Place, User } from '@/components/Map/MapMarker';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';

// Sample events data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Football Match',
    description: 'Weekly football match in the park. All skill levels welcome!',
    location: { lat: 51.505, lng: -0.09, buildingName: 'Central Park' },
    hobby: 'Football',
    hobbyType: 'sports',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    attendees: 12,
    eventType: 'sports',
    isEnhanced: true,
  },
  {
    id: '2',
    title: 'Swimming Club',
    description: 'Join our swimming club for a refreshing workout.',
    location: { lat: 51.505, lng: -0.09, buildingName: 'Central Park Pool' },
    hobby: 'Swimming',
    hobbyType: 'sports',
    date: new Date(Date.now() + 2 * 86400000).toISOString(), // Day after tomorrow
    attendees: 8,
    eventType: 'sports',
  },
  {
    id: '3',
    title: 'Art Exhibition',
    description: 'Local artists showcase their latest works.',
    location: { lat: 51.508, lng: -0.11, buildingName: 'City Gallery' },
    hobby: 'Art',
    hobbyType: 'arts',
    date: new Date(Date.now() + 3 * 86400000).toISOString(),
    attendees: 25,
    eventType: 'arts',
  },
  {
    id: '4',
    title: 'Tech Meetup',
    description: 'Discuss the latest in web development and AI.',
    location: { lat: 51.51, lng: -0.1, buildingName: 'Innovation Hub', floor: 3 },
    hobby: 'Technology',
    hobbyType: 'tech',
    date: new Date(Date.now() + 7 * 86400000).toISOString(),
    attendees: 40,
    eventType: 'tech',
  },
  {
    id: '5',
    title: 'Italian Cooking Class',
    description: 'Learn to make authentic Italian pasta from scratch.',
    location: { lat: 51.497, lng: -0.07, buildingName: 'Corner Bistro' },
    hobby: 'Cooking',
    hobbyType: 'food',
    date: new Date(Date.now() + 5 * 86400000).toISOString(),
    attendees: 15,
    eventType: 'food',
  },
  // Add more events at the same location to test clustering
  {
    id: '6',
    title: 'Yoga in the Park',
    description: 'Morning yoga session for all levels.',
    location: { lat: 51.505, lng: -0.09, buildingName: 'Central Park' },
    hobby: 'Yoga',
    hobbyType: 'sports',
    date: new Date(Date.now() + 1 * 86400000).toISOString(),
    attendees: 20,
    eventType: 'sports',
  },
  {
    id: '7',
    title: 'Book Club Meeting',
    description: 'Discussion on this month\'s book selection.',
    location: { lat: 51.505, lng: -0.09, buildingName: 'Central Park Library' },
    hobby: 'Reading',
    hobbyType: 'arts',
    date: new Date(Date.now() + 4 * 86400000).toISOString(),
    attendees: 12,
    eventType: 'arts',
  },
  {
    id: '8',
    title: 'Chess Tournament',
    description: 'Annual chess competition for all skill levels.',
    location: { lat: 51.505, lng: -0.09, buildingName: 'Central Park Pavilion' },
    hobby: 'Chess',
    hobbyType: 'other',
    date: new Date(Date.now() + 10 * 86400000).toISOString(),
    attendees: 32,
    eventType: 'other',
  },
];

// Sample places with live queue events
const sampleQueuePlaces: Place[] = [
  {
    id: 'q1',
    title: 'City Hospital',
    description: 'Main emergency room waiting area.',
    location: { lat: 51.52, lng: -0.12, buildingName: 'City Hospital' },
    type: 'publicPlace',
    isOwner: false,
    liveQueue: {
      count: 23,
      estimatedWaitTime: 45, // minutes
      lastUpdated: new Date().toISOString(),
      status: 'busy'
    }
  },
  {
    id: 'q2',
    title: 'DMV Office',
    description: 'Department of Motor Vehicles license processing.',
    location: { lat: 51.515, lng: -0.08, buildingName: 'Government Center', floor: 2 },
    type: 'publicPlace',
    isOwner: false,
    liveQueue: {
      count: 41,
      estimatedWaitTime: 90, // minutes
      lastUpdated: new Date().toISOString(),
      status: 'very-busy'
    }
  },
  {
    id: 'q3',
    title: 'Popular Café',
    description: 'Trendy café known for its specialty coffee.',
    location: { lat: 51.505, lng: -0.11, buildingName: 'Main Street Corner' },
    type: 'cafe',
    category: 'cafe',
    isOwner: false,
    liveQueue: {
      count: 8,
      estimatedWaitTime: 15, // minutes
      lastUpdated: new Date().toISOString(),
      status: 'moderate'
    }
  }
];

// Sample places that have multiple events
const sampleMultiEventPlaces: Place[] = [
  {
    id: 'mp1',
    title: 'City Sports Center',
    description: 'Multi-purpose sports facility with swimming pool, gym, and sports fields.',
    location: { lat: 51.51, lng: -0.085, buildingName: 'City Sports Center' },
    type: 'publicPlace',
    isOwner: false,
    hostedEvents: [
      { 
        id: 'e1', 
        title: 'Swimming Lessons',
        hobby: 'Swimming',
        hobbyType: 'sports',
        eventType: 'sports',
        date: new Date(Date.now() + 1 * 86400000).toISOString(),
        attendees: 15
      },
      { 
        id: 'e2', 
        title: 'Basketball Tournament',
        hobby: 'Basketball',
        hobbyType: 'sports',
        eventType: 'sports',
        date: new Date(Date.now() + 3 * 86400000).toISOString(),
        attendees: 30
      },
      { 
        id: 'e3', 
        title: 'Yoga Class',
        hobby: 'Yoga',
        hobbyType: 'sports',
        eventType: 'sports',
        date: new Date(Date.now() + 2 * 86400000).toISOString(),
        attendees: 20
      },
      { 
        id: 'e4', 
        title: 'Fitness Workshop',
        hobby: 'Fitness',
        hobbyType: 'sports',
        eventType: 'sports',
        date: new Date(Date.now() + 5 * 86400000).toISOString(),
        attendees: 25
      },
      { 
        id: 'e5', 
        title: 'Dance Competition',
        hobby: 'Dance',
        hobbyType: 'arts',
        eventType: 'arts',
        date: new Date(Date.now() + 7 * 86400000).toISOString(),
        attendees: 40
      }
    ]
  },
  {
    id: 'mp2',
    title: 'Community Center',
    description: 'Local community center hosting various events and activities.',
    location: { lat: 51.508, lng: -0.105, buildingName: 'Community Center' },
    type: 'publicPlace',
    isOwner: false,
    hostedEvents: [
      { 
        id: 'e6', 
        title: 'Art Workshop',
        hobby: 'Art',
        hobbyType: 'arts',
        eventType: 'arts',
        date: new Date(Date.now() + 2 * 86400000).toISOString(),
        attendees: 18
      },
      { 
        id: 'e7', 
        title: 'Chess Club',
        hobby: 'Chess',
        hobbyType: 'other',
        eventType: 'other',
        date: new Date(Date.now() + 4 * 86400000).toISOString(),
        attendees: 12
      },
      { 
        id: 'e8', 
        title: 'Computer Skills Class',
        hobby: 'Technology',
        hobbyType: 'tech',
        eventType: 'tech',
        date: new Date(Date.now() + 1 * 86400000).toISOString(),
        attendees: 15
      }
    ]
  }
];

const Events = () => {
  const { user } = useAuth();
  const eventsContext = useEvents();
  const [events, setEvents] = useState<Event[]>(eventsContext?.allEvents || sampleEvents);
  const [places, setPlaces] = useState<Place[]>([...sampleQueuePlaces, ...sampleMultiEventPlaces]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<string>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlaceEvents, setSelectedPlaceEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'upcoming' | 'live' | 'friends' | 'recommended'>('all');
  const [isAreaFilterActive, setIsAreaFilterActive] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{lat: number, lng: number, radius: number} | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update events from context when available
  useEffect(() => {
    if (eventsContext?.allEvents.length) {
      setEvents(eventsContext.allEvents);
    }
  }, [eventsContext?.allEvents]);

  const handleMarkerClick = (item: MapMarkerItem) => {
    if ('hobby' in item) {
      setSelectedEvent(item.id);
    } else {
      setSelectedPlace(item.id);
      
      // Check if this place has hosted events
      if (item.hostedEvents) {
        // Convert hosted events to full events with the place's location
        const hostedEventsWithLocation: Event[] = item.hostedEvents.map(event => ({
          ...event,
          location: item.location,
          description: `Event at ${item.title}`
        }) as Event); // Type assertion since we're adding all required fields
        setSelectedPlaceEvents(hostedEventsWithLocation);
        setDialogOpen(true);
      }
    }
  };

  const handleCreateEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
    toast({
      title: "Event Created",
      description: `${event.title} has been created successfully.`,
    });
  };

  const handleCreatePlace = (place: Place) => {
    setPlaces(prev => [...prev, place]);
    toast({
      title: "Place Created",
      description: `${place.title} has been created successfully.`,
    });
  };

  // Handle area selection on the map
  const handleAreaSelect = (lat: number, lng: number, radius: number) => {
    setSelectedArea({ lat, lng, radius });
    setIsAreaFilterActive(true);
    
    // Filter events in the selected area
    if (eventsContext) {
      eventsContext.selectAreaEvents(lat, lng, radius);
    } else {
      // Fallback if context is not available
      const filteredEvents = events.filter(event => {
        const distance = calculateDistance(lat, lng, event.location.lat, event.location.lng);
        return distance <= radius / 1000; // Convert meters to km
      });
      setEvents(filteredEvents);
    }
    
    toast({
      title: "Area Selected",
      description: `Showing events within ${Math.round(radius/1000)}km of selected point`,
    });
  };

  // Clear area filter
  const handleClearAreaFilter = () => {
    setSelectedArea(null);
    setIsAreaFilterActive(false);
    
    if (eventsContext) {
      eventsContext.clearAreaFilter();
    } else {
      // Fallback if context is not available
      setEvents(sampleEvents);
    }
  };

  // Calculate distance between two points for filtering
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter events based on selected hobby, view mode, and area filter
  const getFilteredEvents = () => {
    // Start with the correct set of events based on view mode
    let filtered: Event[] = [];
    
    if (eventsContext) {
      switch (viewMode) {
        case 'friends':
          filtered = eventsContext.friendEvents;
          break;
        case 'recommended':
          filtered = eventsContext.getPersonalizedEvents();
          break;
        case 'live':
          filtered = eventsContext.allEvents.filter(e => e.isLive);
          break;
        case 'upcoming':
          const now = new Date();
          filtered = eventsContext.allEvents.filter(e => new Date(e.date) > now);
          break;
        default:
          filtered = isAreaFilterActive && selectedArea 
            ? eventsContext.getEventsInArea(selectedArea.lat, selectedArea.lng, selectedArea.radius) 
            : eventsContext.allEvents;
      }
    } else {
      // Fallback without context
      filtered = events;
    }
    
    // Apply hobby filter
    if (selectedHobby !== 'All') {
      filtered = filtered.filter(event => event.hobby === selectedHobby);
    }
    
    return filtered;
  };

  // Get the filtered events to display
  const filteredEvents = getFilteredEvents();

  // Get unique hobbies for the filter
  const uniqueHobbies = Array.from(new Set(events.map(event => event.hobby)));

  // Get the selected event details
  const getSelectedEvent = () => {
    return events.find(event => event.id === selectedEvent);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Events</h1>
            
            <Button 
              size="sm"
              onClick={() => {
                toast({
                  title: "Create Event",
                  description: "Click on the map to create a new event.",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>

          {/* View Mode Tabs */}
          <Tabs 
            defaultValue={viewMode} 
            onValueChange={(value) => setViewMode(value as 'all' | 'upcoming' | 'live' | 'friends' | 'recommended')}
            className="mb-4"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="friends">
                <UserCircle2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Friends</span>
              </TabsTrigger>
              <TabsTrigger value="recommended">
                <Sparkles className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">For You</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Area filter indicator */}
          {isAreaFilterActive && selectedArea && (
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">Area Filter Active</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2" 
                  onClick={handleClearAreaFilter}
                >
                  Clear
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Showing events within {Math.round(selectedArea.radius/1000)}km radius
              </p>
            </div>
          )}
          
          {viewMode !== 'live' ? (
            <>
              {/* Hobby filter */}
              <div className="mb-4">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Filter by Hobby</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    variant={selectedHobby === 'All' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedHobby('All')}
                  >
                    All
                  </Button>
                  {uniqueHobbies.map(hobby => (
                    <Button
                      key={hobby}
                      variant={selectedHobby === hobby ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedHobby(hobby)}
                    >
                      {hobby}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Events List */}
              <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-14rem)]">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No events found</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSelectedHobby('All');
                        setViewMode('all');
                        handleClearAreaFilter();
                      }}
                    >
                      View all events
                    </Button>
                  </div>
                ) : (
                  filteredEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary ${selectedEvent === event.id ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setSelectedEvent(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge variant="outline" className="bg-primary text-white">
                          {event.hobby}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                      
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(event.date).toLocaleString()}</span>
                      </div>
                      
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>
                          {event.location.buildingName || "Unknown location"}
                          {event.location.floor && `, Floor ${event.location.floor}`}
                        </span>
                      </div>
                      
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{event.attendees} attending</span>
                      </div>
                      
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/${event.id}`);
                          }}
                        >
                          Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Join event",
                              description: `You have joined ${event.title}`,
                            });
                          }}
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            // Live Queue View
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-14rem)]">
              {sampleQueuePlaces.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">No live queues available</p>
                </div>
              ) : (
                sampleQueuePlaces.map(place => (
                  <div 
                    key={place.id} 
                    className="p-3 border rounded-lg cursor-pointer transition-all hover:border-primary"
                    onClick={() => setSelectedPlace(place.id)}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{place.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${place.liveQueue?.status === 'very-busy' ? 'bg-red-500' : 
                            place.liveQueue?.status === 'busy' ? 'bg-orange-500' : 
                            'bg-yellow-500'} text-white
                        `}
                      >
                        {place.liveQueue?.status === 'very-busy' ? 'Very Busy' : 
                         place.liveQueue?.status === 'busy' ? 'Busy' : 
                         'Moderate'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">{place.description}</p>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Current Queue:</span>
                        <span className="font-bold">{place.liveQueue?.count} people</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Estimated Wait:</span>
                        <span>{place.liveQueue?.estimatedWaitTime} minutes</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Last updated:</span>
                        <span>{new Date(place.liveQueue?.lastUpdated || '').toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-end">
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({
                            title: "Joined Queue",
                            description: `You have joined the queue at ${place.title}`,
                          });
                        }}
                      >
                        Join Queue
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <div className="flex-grow relative">
          <MapView 
            events={events} 
            places={places}
            onMarkerClick={handleMarkerClick}
            height="h-[calc(100vh-4rem)]"
            filterHobby={selectedHobby !== 'All' ? selectedHobby : undefined}
            onEventCreate={handleCreateEvent}
            onPlaceCreate={handleCreatePlace}
            onAreaSelect={handleAreaSelect}
          />
          
          {/* Selected Event Card - Overlay on map */}
          {selectedEvent && getSelectedEvent() && (
            <Card className="absolute bottom-4 right-4 w-72 p-4 shadow-lg bg-white z-10">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{getSelectedEvent()?.title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(getSelectedEvent()?.date || '').toLocaleString()}</span>
              </div>
              
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {getSelectedEvent()?.location.buildingName || "Unknown location"}
                  {getSelectedEvent()?.location.floor && `, Floor ${getSelectedEvent()?.location.floor}`}
                </span>
              </div>
              
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <Users className="h-3 w-3 mr-1" />
                <span>{getSelectedEvent()?.attendees} attending</span>
              </div>
              
              <div className="mt-2 flex justify-end">
                <Button 
                  size="sm"
                  onClick={() => navigate(`/events/${selectedEvent}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog for displaying events at a place */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Events at {places.find(p => p.id === selectedPlace)?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-3">
            {selectedPlaceEvents.length > 0 ? (
              selectedPlaceEvents.map(event => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge variant="outline" className="bg-primary text-white">
                      {event.hobby}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(event.date).toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{event.attendees} attending</span>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
                    <Button 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Join event",
                          description: `You have joined ${event.title}`,
                        });
                      }}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No events at this location</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;

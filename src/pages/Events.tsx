
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Filter, Plus, Users, Clock } from 'lucide-react';
import Navbar from '@/components/UI/Navbar';
import MapView from '@/components/Map/MapView';
import { Event, MapMarkerItem, Place } from '@/components/Map/MapMarker';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    eventType: 'football',
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
    eventType: 'swimming',
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
    type: 'restaurant',
    category: 'restaurant',
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
        eventType: 'swimming',
        date: new Date(Date.now() + 1 * 86400000).toISOString(),
        attendees: 15
      },
      { 
        id: 'e2', 
        title: 'Basketball Tournament',
        hobby: 'Basketball',
        hobbyType: 'sports',
        date: new Date(Date.now() + 3 * 86400000).toISOString(),
        attendees: 30
      },
      { 
        id: 'e3', 
        title: 'Yoga Class',
        hobby: 'Yoga',
        hobbyType: 'sports',
        date: new Date(Date.now() + 2 * 86400000).toISOString(),
        attendees: 20
      },
      { 
        id: 'e4', 
        title: 'Fitness Workshop',
        hobby: 'Fitness',
        hobbyType: 'sports',
        date: new Date(Date.now() + 5 * 86400000).toISOString(),
        attendees: 25
      },
      { 
        id: 'e5', 
        title: 'Dance Competition',
        hobby: 'Dance',
        hobbyType: 'arts',
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
        date: new Date(Date.now() + 2 * 86400000).toISOString(),
        attendees: 18
      },
      { 
        id: 'e7', 
        title: 'Chess Club',
        hobby: 'Chess',
        hobbyType: 'other',
        date: new Date(Date.now() + 4 * 86400000).toISOString(),
        attendees: 12
      },
      { 
        id: 'e8', 
        title: 'Computer Skills Class',
        hobby: 'Technology',
        hobbyType: 'tech',
        date: new Date(Date.now() + 1 * 86400000).toISOString(),
        attendees: 15
      }
    ]
  }
];

const Events = () => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [places, setPlaces] = useState<Place[]>([...sampleQueuePlaces, ...sampleMultiEventPlaces]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<string>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlaceEvents, setSelectedPlaceEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'upcoming' | 'live'>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

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
        }));
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

  // Filter events based on selected hobby and view mode
  const filteredEvents = events.filter(event => {
    // Filter by hobby
    if (selectedHobby !== 'All' && event.hobby !== selectedHobby) {
      return false;
    }

    // Filter by view mode
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (viewMode === 'upcoming') {
      // Only show events in the future
      return eventDate > now;
    }
    
    // For 'all' mode, show all events
    return true;
  });

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
                // In a real app, you might navigate to an event creation page
                // or open a creation dialog
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
            onValueChange={(value) => setViewMode(value as 'all' | 'upcoming' | 'live')}
            className="mb-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live Queues</TabsTrigger>
            </TabsList>
          </Tabs>
          
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
                        // In a real app, this would navigate to the event details
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

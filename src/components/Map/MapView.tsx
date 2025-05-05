import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapMarker, { Event, Place, MapMarkerItem } from './MapMarker';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlaceForm from '@/components/Places/PlaceForm';
import { PlusCircle, Map as MapIcon, Locate } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper functions
// Calculate distance in kilometers between two points
const calculateDistance = (point1: Location, point2: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value: number): number => {
  return value * Math.PI / 180;
};

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export interface Location {
  lat: number;
  lng: number;
  floor?: number;
  unit?: string;
  buildingName?: string;
}

// Component for current location marker
const CurrentLocationMarker = ({ location }: { location: Location | null }) => {
  if (!location) return null;
  
  return (
    <Marker 
      position={[location.lat, location.lng]}
      icon={defaultIcon}
    >
      <Popup>
        <div>
          <p className="font-medium">Your current location</p>
          <p className="text-xs text-gray-500">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
        </div>
      </Popup>
    </Marker>
  );
};

// Component for area selection
const AreaSelector = ({ 
  enabled, 
  position, 
  radius, 
  onSelectComplete 
}: { 
  enabled: boolean; 
  position: [number, number] | null; 
  radius: number;
  onSelectComplete: () => void;
}) => {
  const map = useMapEvents({
    click: (e) => {
      if (enabled && position === null) {
        onSelectComplete();
      }
    }
  });

  if (!enabled || !position) return null;

  return (
    <Circle 
      center={position}
      radius={radius} 
      pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }} 
    />
  );
};

// Component to handle map clicks and events
const MapClickHandler = ({ 
  onMapClick, 
  areaSelectMode,
  onAreaSelect
}: { 
  onMapClick: (lat: number, lng: number) => void;
  areaSelectMode: boolean;
  onAreaSelect: (center: [number, number], radius: number) => void;
}) => {
  const [areaPosition, setAreaPosition] = useState<[number, number] | null>(null);
  const [areaRadius, setAreaRadius] = useState(500); // Default radius in meters
  
  const map = useMapEvents({
    click: (e) => {
      if (areaSelectMode) {
        if (!areaPosition) {
          setAreaPosition([e.latlng.lat, e.latlng.lng]);
        } else {
          // Calculate distance from center to clicked point
          const center = L.latLng(areaPosition[0], areaPosition[1]);
          const clickedPoint = e.latlng;
          const newRadius = center.distanceTo(clickedPoint);
          
          setAreaRadius(newRadius);
          onAreaSelect(areaPosition, newRadius);
          setAreaPosition(null); // Reset for next selection
        }
      } else {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });

  return (
    <AreaSelector 
      enabled={areaSelectMode} 
      position={areaPosition} 
      radius={areaRadius}
      onSelectComplete={() => {
        if (areaPosition) {
          onAreaSelect(areaPosition, areaRadius);
          setAreaPosition(null);
        }
      }}
    />
  );
};

// Component to handle map centering and zoom
const MapManager = ({ location, zoomToLocation }: { location: Location | null, zoomToLocation: boolean }) => {
  const map = useMap();
  
  useEffect(() => {
    if (location && zoomToLocation) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map, zoomToLocation]);
  
  return null;
};

export interface MapViewProps {
  events?: Event[];
  places?: Place[];
  onMarkerClick?: (item: MapMarkerItem) => void;
  height?: string;
  showControls?: boolean;
  filterHobby?: string;
  filterType?: string;
  filterDistance?: number;
  filterCategory?: string;  
  filterAction?: string;
  filterBrokerRating?: number;
  filterDelivererRating?: number;
  onPlaceCreate?: (place: Place) => void;
  onEventCreate?: (event: Event) => void;
}

interface EventFormData {
  title: string;
  description: string;
  date: string; 
  hobby: string;
  hobbyType: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
  attendees: number;
}

interface NewLocationData {
  lat: number;
  lng: number;
  floor?: number;
  unit?: string;
  buildingName?: string;
}

const MapView = ({ 
  events = [], 
  places = [],
  onMarkerClick, 
  height = "h-full",
  showControls = true,
  filterHobby,
  filterType,
  filterDistance,
  filterCategory,
  filterAction,
  filterBrokerRating,
  filterDelivererRating,
  onPlaceCreate,
  onEventCreate
}: MapViewProps) => {
  const { location, error } = useGeolocation();
  const [selectedItem, setSelectedItem] = useState<MapMarkerItem | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Default location (New York City) until geolocation is available
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 40.7128,
    lng: -74.006
  });
  
  // State for zooming to user location
  const [zoomToLocation, setZoomToLocation] = useState(false);

  // State for area selection mode
  const [areaSelectMode, setAreaSelectMode] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{center: [number, number], radius: number} | null>(null);

  // State for creating new markers
  const [newMarkerLocation, setNewMarkerLocation] = useState<NewLocationData | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogTab, setCreateDialogTab] = useState('place');
  
  // State for location details dialog
  const [locationDetailsOpen, setLocationDetailsOpen] = useState(false);

  // Helper functions to filter places
  const filterPlacesByBrokerRating = (places: Place[], minRating: number | undefined): Place[] => {
    if (!minRating) return places;
    
    return places.filter(place => 
      place.broker !== undefined && place.broker.rating >= minRating
    );
  };

  const filterPlacesByDelivererRating = (places: Place[], minRating: number | undefined): Place[] => {
    if (!minRating) return places;
    
    return places.filter(place => 
      place.deliverer !== undefined && place.deliverer.rating >= minRating
    );
  };

  // Apply filters to events and places
  const filteredEvents = events.filter((event) => {
    // Filter by hobby if specified
    if (filterHobby && filterHobby !== 'All' && event.hobby !== filterHobby) {
      return false;
    }
    
    // Filter by type (only show events if type is 'All' or 'Event')
    if (filterType && filterType !== 'All' && filterType !== 'event') {
      return false;
    }
    
    // Filter by distance if location is available and distance is specified
    if (location && filterDistance && calculateDistance(location, event.location) > filterDistance) {
      return false;
    }

    // Filter by area if selected
    if (selectedArea) {
      const eventLatLng = L.latLng(event.location.lat, event.location.lng);
      const areaCenter = L.latLng(selectedArea.center[0], selectedArea.center[1]);
      const distance = eventLatLng.distanceTo(areaCenter);
      if (distance > selectedArea.radius) {
        return false;
      }
    }
    
    return true;
  });
  
  let filteredPlaces = places.filter((place) => {
    // Filter by type if specified
    if (filterType && filterType !== 'All' && place.type !== filterType) {
      return false;
    }
    
    // Filter by category if specified (flat, restaurant, shop)
    if (filterCategory && filterCategory !== 'All' && place.category !== filterCategory) {
      return false;
    }
    
    // Filter by action if specified (rent, sell, buy)
    if (filterAction && filterAction !== 'All' && place.action !== filterAction) {
      return false;
    }
    
    // Filter by distance if location is available and distance is specified
    if (location && filterDistance && calculateDistance(location, place.location) > filterDistance) {
      return false;
    }
    
    // Filter by area if selected
    if (selectedArea) {
      const placeLatLng = L.latLng(place.location.lat, place.location.lng);
      const areaCenter = L.latLng(selectedArea.center[0], selectedArea.center[1]);
      const distance = placeLatLng.distanceTo(areaCenter);
      if (distance > selectedArea.radius) {
        return false;
      }
    }
    
    return true;
  });

  // Apply broker and deliverer rating filters
  filteredPlaces = filterPlacesByBrokerRating(filteredPlaces, filterBrokerRating);
  filteredPlaces = filterPlacesByDelivererRating(filteredPlaces, filterDelivererRating);

  useEffect(() => {
    if (location) {
      setMapCenter(location);
    }
  }, [location]);

  const handleMarkerClick = (item: MapMarkerItem) => {
    setSelectedItem(item);
    
    // If it's a place, navigate to place details
    if ('type' in item && item.type === 'property') {
      toast({
        title: item.title,
        description: item.description,
        action: (
          <Button size="sm" variant="outline" onClick={() => navigate(`/places/${item.id}`)}>
            View Details
          </Button>
        ),
      });
    } else if ('hobby' in item) {
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
    
    if (onMarkerClick) {
      onMarkerClick(item);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setNewMarkerLocation({ lat, lng });
    setCreateDialogOpen(true);
  };

  const handleAreaSelect = (center: [number, number], radius: number) => {
    setSelectedArea({ center, radius });
    setAreaSelectMode(false);
    
    toast({
      title: "Area Selected",
      description: `Selected area with radius of ${Math.round(radius)}m`,
    });
  };

  const handleCreatePlace = (placeData: Place) => {
    if (newMarkerLocation && onPlaceCreate) {
      const newPlace: Place = {
        ...placeData,
        id: `place-${Date.now()}`,
        location: newMarkerLocation,
      };
      onPlaceCreate(newPlace);
      setCreateDialogOpen(false);
      setNewMarkerLocation(null);
      
      toast({
        title: "Place Created",
        description: `Successfully created "${placeData.title}"`,
      });
    }
  };

  const handleCreateEvent = (eventData: any) => {
    if (newMarkerLocation && onEventCreate) {
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        location: newMarkerLocation,
      };
      onEventCreate(newEvent);
      setCreateDialogOpen(false);
      setNewMarkerLocation(null);
      
      toast({
        title: "Event Created",
        description: `Successfully created "${eventData.title}"`,
      });
    }
  };

  const handleLocateMe = () => {
    if (location) {
      setZoomToLocation(true);
      // Reset after a short delay
      setTimeout(() => setZoomToLocation(false), 1000);
    } else {
      toast({
        title: "Location Error",
        description: "Unable to access your location. Please check your browser permissions.",
        variant: "destructive"
      });
    }
  };

  // Group events by place
  const eventsPerPlace = events.reduce((acc, event) => {
    // Create a key based on the location coordinates
    const key = `${event.location.lat.toFixed(5)},${event.location.lng.toFixed(5)}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {} as { [key: string]: Event[] });

  // This component is defined separately to avoid using react-leaflet hooks outside of MapContainer
  const MapContent = () => {
    const map = useMap();
    
    useEffect(() => {
      map.setView([mapCenter.lat, mapCenter.lng], map.getZoom());
    }, [mapCenter, map]);
    
    return (
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CurrentLocationMarker location={location} />
        <MapManager location={location} zoomToLocation={zoomToLocation} />
        
        {/* Handle map clicks and area selection */}
        <MapClickHandler 
          onMapClick={handleMapClick} 
          areaSelectMode={areaSelectMode}
          onAreaSelect={handleAreaSelect}
        />

        {/* Selected area visualization */}
        {selectedArea && (
          <Circle 
            center={selectedArea.center}
            radius={selectedArea.radius} 
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} 
          />
        )}
        
        {/* Render Event Markers or Event Groups */}
        {filteredEvents.map((event) => {
          // Check if this event is part of a group with more than 5 events
          const locationKey = `${event.location.lat.toFixed(5)},${event.location.lng.toFixed(5)}`;
          const eventsAtThisLocation = eventsPerPlace[locationKey] || [];
          
          // Only render individual markers for events that aren't part of large groups
          // or for the first event in a group (which will be represented as a cluster)
          if (eventsAtThisLocation.length < 5 || eventsAtThisLocation[0].id === event.id) {
            if (eventsAtThisLocation.length >= 5) {
              // Render a cluster marker for locations with 5+ events
              return (
                <Marker 
                  key={`event-group-${locationKey}`}
                  position={[event.location.lat, event.location.lng]}
                  icon={createEventClusterIcon(eventsAtThisLocation.length)}
                >
                  <Popup>
                    <div className="min-w-[250px]">
                      <h3 className="font-bold mb-2">Events at this location ({eventsAtThisLocation.length})</h3>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {eventsAtThisLocation.map((e) => (
                          <div key={e.id} className="border-b pb-1">
                            <div className="font-semibold">{e.title}</div>
                            <div className="text-xs text-gray-500">{e.hobby} · {new Date(e.date).toLocaleDateString()}</div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="mt-2 w-full" 
                        size="sm"
                        onClick={() => {
                          navigate("/events");
                        }}
                      >
                        View All Events
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              );
            } else {
              // Render normal event marker
              return (
                <MapMarker 
                  key={`event-${event.id}`}
                  item={event}
                  onClick={() => handleMarkerClick(event)}
                  isSelected={selectedItem && 'hobby' in selectedItem && selectedItem.id === event.id}
                />
              );
            }
          }
          return null; // Skip rendering this event as it's part of a group and not the first one
        })}
        
        {/* Render Place Markers */}
        {filteredPlaces.map((place) => (
          <MapMarker 
            key={`place-${place.id}`}
            item={place}
            onClick={() => handleMarkerClick(place)}
            isSelected={selectedItem && !('hobby' in selectedItem) && selectedItem.id === place.id}
          />
        ))}
      </>
    );
  };

  // Helper function to create cluster icon
  const createEventClusterIcon = (count: number) => {
    return L.divIcon({
      html: `<div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">${count}</div>`,
      className: 'event-cluster-icon',
      iconSize: L.point(32, 32),
      iconAnchor: L.point(16, 16)
    });
  };

  return (
    <div className={`w-full ${height} relative`}>
      {error && (
        <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-md shadow-md text-sm text-red-600">
          {error}
        </div>
      )}
      
      {showControls && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-md shadow-md">
          <div className="p-2 space-y-2">
            <Button 
              variant={areaSelectMode ? "default" : "outline"} 
              size="sm" 
              className="w-full flex items-center gap-2"
              onClick={() => setAreaSelectMode(!areaSelectMode)}
            >
              <MapIcon className="h-4 w-4" />
              {areaSelectMode ? "Cancel Selection" : "Select Area"}
            </Button>
            
            {selectedArea && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedArea(null)}
              >
                Clear Area Filter
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center gap-2"
              onClick={() => {
                if (location) {
                  setNewMarkerLocation({
                    lat: location.lat,
                    lng: location.lng
                  });
                  setCreateDialogOpen(true);
                }
              }}
            >
              <PlusCircle className="h-4 w-4" />
              Create Here
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center gap-2"
              onClick={handleLocateMe}
            >
              <Locate className="h-4 w-4" />
              Locate Me
            </Button>
            
            {location && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center gap-2"
                onClick={() => setLocationDetailsOpen(true)}
              >
                <MapIcon className="h-4 w-4" />
                Location Info
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="absolute inset-0">
        <MapContainer 
          center={[mapCenter.lat, mapCenter.lng]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <MapContent />
        </MapContainer>
      </div>

      {/* Dialog for creating new places or events */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Create at {newMarkerLocation ? `${newMarkerLocation.lat.toFixed(5)}, ${newMarkerLocation.lng.toFixed(5)}` : ''}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue={createDialogTab} onValueChange={setCreateDialogTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="place">Place</TabsTrigger>
              <TabsTrigger value="event">Event</TabsTrigger>
            </TabsList>
            
            <TabsContent value="place" className="pt-4">
              <PlaceForm onSubmit={handleCreatePlace} />
            </TabsContent>
            
            <TabsContent value="event" className="pt-4">
              {/* Here you'd have an event form component similar to PlaceForm */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Event form would go here. For now, we'll use placeholder data.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      handleCreateEvent({
                        title: "New Event",
                        description: "This is a placeholder event",
                        date: new Date().toISOString(),
                        hobby: "sports",
                        hobbyType: "sports",
                        attendees: 0,
                      });
                    }}
                  >
                    Create Sample Event
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for location details */}
      <Dialog open={locationDetailsOpen} onOpenChange={setLocationDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Your Location Details</DialogTitle>
          </DialogHeader>
          
          {location ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Latitude</p>
                  <p className="text-base">{location.lat.toFixed(6)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Longitude</p>
                  <p className="text-base">{location.lng.toFixed(6)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Nearby Places</p>
                {filteredPlaces.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {filteredPlaces
                      .sort((a, b) => {
                        const distA = calculateDistance(location, a.location);
                        const distB = calculateDistance(location, b.location);
                        return distA - distB;
                      })
                      .slice(0, 3)
                      .map(place => (
                        <div key={place.id} className="border rounded p-2">
                          <p className="font-medium">{place.title}</p>
                          <p className="text-xs text-gray-500">
                            {calculateDistance(location, place.location).toFixed(2)} km away
                          </p>
                          <Button 
                            size="sm" 
                            className="mt-1"
                            onClick={() => {
                              navigate(`/places/${place.id}`);
                              setLocationDetailsOpen(false);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No nearby places found</p>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Upcoming Events</p>
                {filteredEvents.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {filteredEvents
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 3)
                      .map(event => (
                        <div key={event.id} className="border rounded p-2">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {event.hobby} · {new Date(event.date).toLocaleDateString()}
                          </p>
                          <Button 
                            size="sm" 
                            className="mt-1"
                            onClick={() => {
                              navigate(`/events/${event.id}`);
                              setLocationDetailsOpen(false);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming events found</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Unable to access your location.</p>
              <p className="text-gray-500">Please check your browser permissions.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapView;

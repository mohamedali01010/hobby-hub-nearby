
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, Map, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/UI/Navbar';
import MapView from '@/components/Map/MapView';
import PlaceForm from '@/components/Places/PlaceForm';
import { Place, MapMarkerItem } from '@/components/Map/MapMarker';
import { useToast } from '@/components/ui/use-toast';
import { generateSamplePlaces } from '@/utils/sampleData';
import { useGeolocation } from '@/hooks/useGeolocation';

const Places = () => {
  const { location } = useGeolocation();
  const [places, setPlaces] = useState<Place[]>(() => {
    const defaultLocation = { lat: 51.505, lng: -0.09 };
    const center = location || defaultLocation;
    return generateSamplePlaces(20, center);
  });
  
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Update sample data if location changes
  useEffect(() => {
    if (location) {
      setPlaces(generateSamplePlaces(20, location));
    }
  }, [location]);

  const handleMarkerClick = (item: MapMarkerItem) => {
    if ('type' in item) {
      setSelectedPlace(item.id);
    }
  };

  const handlePlaceSubmit = (data: Place) => {
    // In a real app, you would save this to a database
    // Here we're just updating the local state
    setPlaces(prev => {
      // Check if we're updating an existing place
      const existingIndex = prev.findIndex(p => p.id === data.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = data;
        return updated;
      }
      // Otherwise add a new place
      return [...prev, data];
    });
    
    setDialogOpen(false);
    
    toast({
      title: "Place created",
      description: `Successfully created "${data.title}"`,
    });
  };

  // Filter places based on active tab
  const filteredPlaces = places.filter(place => {
    if (activeTab === 'all') return true;
    if (activeTab === 'myPlaces') return place.isOwner;
    if (activeTab === 'properties') return place.type === 'property';
    if (activeTab === 'donations') return place.type === 'donation';
    if (activeTab === 'withLiveQueue') return !!place.liveQueue;
    return true;
  });

  // Function to navigate to place details
  const goToPlaceDetails = (placeId: string) => {
    navigate(`/places/${placeId}`);
  };

  // Helper to get status badge color
  const getStatusBadgeClass = (status: 'low' | 'moderate' | 'busy' | 'very-busy' | undefined) => {
    if (!status) return '';
    
    switch(status) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-amber-500';
      case 'busy': return 'bg-orange-500';
      case 'very-busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Places</h1>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Place
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add a New Place</DialogTitle>
                </DialogHeader>
                <PlaceForm onSubmit={handlePlaceSubmit} />
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="myPlaces" className="flex-1">My Places</TabsTrigger>
              <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
              <TabsTrigger value="withLiveQueue" className="flex-1 flex items-center">
                <Wifi className="h-3 w-3 mr-1" />Live
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No places found</p>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('all')}
                >
                  View all places
                </Button>
              </div>
            ) : (
              filteredPlaces.map(place => (
                <div 
                  key={place.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary relative ${selectedPlace === place.id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedPlace(place.id)}
                >
                  {place.liveQueue && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className={`${getStatusBadgeClass(place.liveQueue.status)} text-white`}>
                        {place.liveQueue.status.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{place.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      place.type === 'myPlace' ? 'bg-blue-100 text-blue-700' : 
                      place.type === 'publicPlace' ? 'bg-amber-100 text-amber-700' :
                      place.type === 'property' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {place.category || 
                      (place.type === 'myPlace' ? 'My Place' : 
                      place.type === 'publicPlace' ? 'Public' :
                      place.type === 'property' ? 'Property' : 
                      'Donation')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{place.description}</p>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {place.location.buildingName && (
                      <div className="mb-1">{place.location.buildingName}</div>
                    )}
                    <div className="flex">
                      {place.location.floor && <span>Floor {place.location.floor}</span>}
                      {place.location.unit && <span className="ml-1">{place.location.floor ? ', ' : ''}Unit {place.location.unit}</span>}
                    </div>
                  </div>
                  
                  {/* Live queue information */}
                  {place.liveQueue && (
                    <div className="mt-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Current Queue:</span>
                        <span className="font-medium">{place.liveQueue.count} people</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Estimated Wait:</span>
                        <span className="font-medium">{place.liveQueue.estimatedWaitTime} min</span>
                      </div>
                    </div>
                  )}
                  
                  {place.type === 'property' && place.price && (
                    <div className="mt-2 font-bold">${place.price.toLocaleString()}</div>
                  )}
                  
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event from bubbling up
                        goToPlaceDetails(place.id);
                      }}
                    >
                      Details
                    </Button>
                    {place.isOwner && (
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // In a real app, you would open an edit form
                          toast({
                            title: "Edit place",
                            description: `Editing ${place.title}`,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="flex-grow relative">
          <MapView 
            places={places} 
            onMarkerClick={handleMarkerClick}
            height="h-full"
            filterType={activeTab === 'all' ? undefined : 
                         activeTab === 'myPlaces' ? 'myPlace' :
                         activeTab === 'properties' ? 'property' :
                         activeTab === 'donations' ? 'donation' : undefined}
            showControls={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Places;

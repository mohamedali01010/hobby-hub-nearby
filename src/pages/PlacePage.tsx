import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Plus, Filter, Building, UtensilsCrossed, Store } from 'lucide-react';
import Navbar from '@/components/UI/Navbar';
import MapView from '@/components/Map/MapView';
import { useToast } from '@/components/ui/use-toast';
import { Place, MapMarkerItem, PlaceCategory, PlaceAction } from '@/components/Map/MapMarker';
import PlaceForm from '@/components/Places/PlaceForm';
import { Card } from '@/components/ui/card';

// Sample place data
const samplePlaces: Place[] = [
  {
    id: '1',
    title: 'Modern Studio Apartment',
    description: 'Cozy studio apartment in downtown, perfect for professionals. Recently renovated with modern amenities.',
    location: { lat: 51.505, lng: -0.09, floor: 3, unit: 'B4', buildingName: 'Riverside Apartments' },
    type: 'property',
    isOwner: true,
    isEnhanced: true,
    category: 'flat',
    action: 'rent',
    price: 1200,
    area: 45,
    photos: ['/placeholder.svg', '/placeholder.svg'],
    broker: {
      id: 'b1',
      name: 'John Smith',
      rating: 4.8,
      commissionsRate: 5,
      photoUrl: '/placeholder.svg'
    }
  },
  {
    id: '2',
    title: 'Family Villa with Garden',
    description: 'Spacious family villa with beautiful garden and swimming pool. Located in a quiet neighborhood.',
    location: { lat: 51.51, lng: -0.1, buildingName: 'Palm Estate' },
    type: 'property',
    isOwner: true,
    category: 'villa',
    action: 'sell',
    price: 450000,
    area: 180,
    photos: ['/placeholder.svg']
  },
  {
    id: '3',
    title: 'Italian Restaurant',
    description: 'Authentic Italian cuisine in the heart of the city. Great for family dinners and business meetings.',
    location: { lat: 51.497, lng: -0.07, unit: '101', buildingName: 'Corner Plaza' },
    type: 'property',
    isOwner: false,
    category: 'restaurant',
    action: 'rent',
    price: 3500,
    area: 120,
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
  },
  {
    id: '4',
    title: 'Electronics Shop',
    description: 'Established electronics shop with steady customer base. Great opportunity for entrepreneurs.',
    location: { lat: 51.515, lng: -0.11, unit: '15', buildingName: 'Market Street' },
    type: 'property',
    isOwner: false,
    category: 'shop',
    action: 'sell',
    price: 120000,
    area: 85,
    deliverer: {
      id: 'd1',
      name: 'Fast Delivery Inc.',
      rating: 4.5,
      deliveryFee: 15,
      deliveryArea: 'Downtown area'
    }
  },
  {
    id: '5',
    title: 'Looking for 2-Bedroom Flat',
    description: 'Professional couple looking to rent a 2-bedroom flat in the downtown area. Budget up to $1500/month.',
    location: { lat: 51.505, lng: -0.12 },
    type: 'property',
    isOwner: true,
    category: 'flat',
    action: 'buy',
    price: 1500,
  }
];

const PlacePage = () => {
  const [places, setPlaces] = useState<Place[]>(samplePlaces);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterAction, setFilterAction] = useState<string>('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      title: "Place added",
      description: "Your place has been added successfully.",
    });
  };

  const getSelectedPlace = () => {
    return places.find(place => place.id === selectedPlace);
  };

  const handleViewDetails = (placeId: string) => {
    navigate(`/places/${placeId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Places</h1>
            
            <div className="flex space-x-2">
              <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Filter Places</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Category</h3>
                      <Tabs defaultValue={filterCategory} onValueChange={setFilterCategory}>
                        <TabsList className="w-full grid grid-cols-4">
                          <TabsTrigger value="All">All</TabsTrigger>
                          <TabsTrigger value="flat"><Building className="h-4 w-4" /></TabsTrigger>
                          <TabsTrigger value="restaurant"><UtensilsCrossed className="h-4 w-4" /></TabsTrigger>
                          <TabsTrigger value="shop"><Store className="h-4 w-4" /></TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Action</h3>
                      <Tabs defaultValue={filterAction} onValueChange={setFilterAction}>
                        <TabsList className="w-full grid grid-cols-4">
                          <TabsTrigger value="All">All</TabsTrigger>
                          <TabsTrigger value="rent">Rent</TabsTrigger>
                          <TabsTrigger value="sell">Sell</TabsTrigger>
                          <TabsTrigger value="buy">Buy</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
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
          </div>
          
          <div className="flex overflow-x-auto pb-2 mb-4">
            <Button 
              variant={filterCategory === 'All' ? 'default' : 'outline'}
              className="flex-shrink-0 mr-2"
              onClick={() => setFilterCategory('All')}
            >
              All
            </Button>
            <Button 
              variant={filterCategory === 'flat' ? 'default' : 'outline'}
              className="flex-shrink-0 mr-2"
              onClick={() => setFilterCategory('flat')}
            >
              <Building className="h-4 w-4 mr-2" /> Flats
            </Button>
            <Button 
              variant={filterCategory === 'villa' ? 'default' : 'outline'}
              className="flex-shrink-0 mr-2"
              onClick={() => setFilterCategory('villa')}
            >
              <Building className="h-4 w-4 mr-2" /> Villas
            </Button>
            <Button 
              variant={filterCategory === 'restaurant' ? 'default' : 'outline'}
              className="flex-shrink-0 mr-2"
              onClick={() => setFilterCategory('restaurant')}
            >
              <UtensilsCrossed className="h-4 w-4 mr-2" /> Restaurants
            </Button>
            <Button 
              variant={filterCategory === 'shop' ? 'default' : 'outline'}
              className="flex-shrink-0"
              onClick={() => setFilterCategory('shop')}
            >
              <Store className="h-4 w-4 mr-2" /> Shops
            </Button>
          </div>
          
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {places
              .filter(place => 
                (filterCategory === 'All' || place.category === filterCategory) && 
                (filterAction === 'All' || place.action === filterAction)
              )
              .map(place => (
                <div 
                  key={place.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary ${selectedPlace === place.id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedPlace(place.id)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{place.title}</h3>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        place.category === 'flat' || place.category === 'villa' ? 'bg-blue-100 text-blue-700' : 
                        place.category === 'restaurant' ? 'bg-amber-100 text-amber-700' :
                        place.category === 'shop' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {place.category === 'flat' ? 'Flat' : 
                         place.category === 'villa' ? 'Villa' :
                         place.category === 'restaurant' ? 'Restaurant' : 
                         place.category === 'shop' ? 'Shop' : 'Place'}
                      </span>
                      
                      {place.action && (
                        <span className="text-xs mt-1 text-gray-500">
                          {place.action === 'rent' ? 'For Rent' : 
                           place.action === 'sell' ? 'For Sale' : 
                           'Wanted to Buy'}
                        </span>
                      )}
                    </div>
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
                  
                  <div className="mt-2 flex items-center space-x-2">
                    {place.price && (
                      <div className="font-bold">${place.price.toLocaleString()}{place.action === 'rent' && <span className="text-xs font-normal">/month</span>}</div>
                    )}
                    {place.area && (
                      <div className="text-xs text-gray-500">{place.area} m²</div>
                    )}
                  </div>
                  
                  {/* Broker or Deliverer info if available */}
                  {(place.broker || place.deliverer) && (
                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                      {place.broker && (
                        <div className="flex items-center">
                          <span className="font-medium">Broker:</span>
                          <span className="ml-1">{place.broker.name}</span>
                          <span className="ml-1 text-amber-500">★{place.broker.rating}</span>
                        </div>
                      )}
                      {place.deliverer && (
                        <div className="flex items-center">
                          <span className="font-medium">Deliverer:</span>
                          <span className="ml-1">{place.deliverer.name}</span>
                          <span className="ml-1 text-amber-500">★{place.deliverer.rating}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(place.id);
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
              ))}
            
            {places.filter(place => 
                (filterCategory === 'All' || place.category === filterCategory) && 
                (filterAction === 'All' || place.action === filterAction)
              ).length === 0 && (
              <div className="text-center py-8">
                <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No places found</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setFilterCategory('All');
                    setFilterAction('All');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side - Map */}
        <div className="flex-grow relative">
          <MapView 
            places={places} 
            onMarkerClick={handleMarkerClick}
            height="h-[calc(100vh-4rem)]"
            filterCategory={filterCategory !== 'All' ? filterCategory : undefined}
            filterAction={filterAction !== 'All' ? filterAction : undefined}
          />
          
          {/* Selected Place Card - Overlay on map */}
          {selectedPlace && getSelectedPlace() && (
            <Card className="absolute bottom-4 right-4 w-72 p-4 shadow-lg bg-white z-10">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{getSelectedPlace()?.title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => setSelectedPlace(null)}
                >
                  ×
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {getSelectedPlace()?.description}
              </p>
              <div className="mt-2 flex justify-between items-center">
                {getSelectedPlace()?.price && (
                  <div className="font-bold text-sm">
                    ${getSelectedPlace()?.price.toLocaleString()}
                    {getSelectedPlace()?.action === 'rent' && <span className="text-xs font-normal">/month</span>}
                  </div>
                )}
                <Button 
                  size="sm" 
                  onClick={() => handleViewDetails(selectedPlace)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;

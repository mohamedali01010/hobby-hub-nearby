import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building, Home, UtensilsCrossed, Store, MapPin, User, Star,
  Phone, Mail, Info, Briefcase, Truck, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/UI/Navbar';
import MapView from '@/components/Map/MapView';
import { Place, BrokerInfo, DelivererInfo } from '@/components/Map/MapMarker';

// Sample places data
const samplePlaces: Place[] = [
  {
    id: '1',
    title: 'Modern Studio Apartment',
    description: 'Cozy studio apartment in downtown, perfect for professionals. Recently renovated with modern amenities including fast WiFi, a fully equipped kitchen, and a comfortable workspace. The apartment is within walking distance to public transportation, restaurants, and shopping areas. Ideal for individuals looking for a convenient urban lifestyle.',
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
    description: 'Spacious family villa with beautiful garden and swimming pool. Located in a quiet neighborhood with easy access to schools, parks, and shopping centers. The villa features 4 bedrooms, 3 bathrooms, a large kitchen, and an open living area. The backyard includes a well-maintained garden, a swimming pool, and a patio perfect for entertaining guests.',
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
    description: 'Authentic Italian cuisine in the heart of the city. Great for family dinners and business meetings. Our menu features homemade pasta, wood-fired pizzas, and a selection of fine Italian wines. The restaurant has a warm, inviting ambiance with both indoor and outdoor seating options. Our experienced chef brings traditional recipes from various regions of Italy.',
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
    description: 'Established electronics shop with steady customer base. Great opportunity for entrepreneurs. The business comes with existing inventory, display fixtures, and a point-of-sale system. Located on a busy street with high foot traffic, this shop has built a reputation for quality products and excellent customer service over the last 10 years.',
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
      deliveryArea: 'Downtown area',
      photoUrl: '/placeholder.svg'
    }
  }
];

const PlaceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find place by id
  const place = samplePlaces.find(p => p.id === id);
  
  // State for interactions
  const [activeTab, setActiveTab] = useState('details');
  const [selectedBroker, setSelectedBroker] = useState<BrokerInfo | null>(place?.broker || null);
  const [selectedDeliverer, setSelectedDeliverer] = useState<DelivererInfo | null>(place?.deliverer || null);
  
  // Handle not found
  if (!place) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Place Not Found</h1>
            <p className="mb-6">The place you are looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/places')}>
              Back to Places
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get category icon
  const getCategoryIcon = () => {
    switch(place.category) {
      case 'flat': return <Building className="h-5 w-5" />;
      case 'villa': return <Home className="h-5 w-5" />;
      case 'restaurant': return <UtensilsCrossed className="h-5 w-5" />;
      case 'shop': return <Store className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };
  
  // Helper function to get action text
  const getActionText = () => {
    switch(place.action) {
      case 'rent': return 'For Rent';
      case 'sell': return 'For Sale';
      case 'buy': return 'Wanted to Buy';
      default: return '';
    }
  };
  
  // Handle contact action
  const handleContactAction = () => {
    toast({
      title: "Contact initiated",
      description: `Your request to contact about "${place.title}" has been sent.`,
    });
  };
  
  // Handle booking action
  const handleBookingAction = () => {
    if (place.category === 'restaurant') {
      toast({
        title: "Reservation requested",
        description: "Your table reservation request has been sent. You will receive confirmation shortly.",
      });
    } else if (place.category === 'flat' || place.category === 'villa') {
      toast({
        title: "Viewing scheduled",
        description: "Your request to view this property has been sent. A representative will contact you to confirm.",
      });
    }
  };
  
  // Handle transaction action
  const handleTransactionAction = () => {
    switch(place.action) {
      case 'rent':
        toast({
          title: "Rental application submitted",
          description: "Your rental application has been submitted. We will review it and get back to you soon.",
        });
        break;
      case 'sell':
        toast({
          title: "Purchase offer submitted",
          description: "Your purchase offer has been submitted. The seller will review it and respond.",
        });
        break;
      case 'buy':
        toast({
          title: "Offer submitted",
          description: "Your offer has been submitted to the buyer.",
        });
        break;
    }
  };
  
  // Handle broker selection
  const handleSelectBroker = (broker: BrokerInfo) => {
    setSelectedBroker(broker);
    toast({
      title: "Broker selected",
      description: `${broker.name} will assist you with this transaction.`,
    });
  };
  
  // Handle deliverer selection
  const handleSelectDeliverer = (deliverer: DelivererInfo) => {
    setSelectedDeliverer(deliverer);
    toast({
      title: "Deliverer selected",
      description: `${deliverer.name} will help with delivery services.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/places')} className="mr-2">
              Back
            </Button>
            <div className="flex items-center">
              {getCategoryIcon()}
              <span className="ml-2 text-sm text-gray-500">
                {place.category === 'flat' ? 'Flat' :
                place.category === 'villa' ? 'Villa' :
                place.category === 'restaurant' ? 'Restaurant' :
                place.category === 'shop' ? 'Shop' : 'Place'}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">{getActionText()}</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold">{place.title}</h1>
          <div className="flex items-center mt-2">
            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
            <address className="text-gray-500 not-italic">
              {place.location.buildingName && `${place.location.buildingName}, `}
              {place.location.floor && `Floor ${place.location.floor}, `}
              {place.location.unit && `Unit ${place.location.unit}`}
            </address>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photos */}
            <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
              {place.photos && place.photos.length > 0 ? (
                <img 
                  src={place.photos[0]} 
                  alt={place.title} 
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <MapPin className="h-12 w-12 mb-2" />
                  <span>No photos available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail photos if available */}
            {place.photos && place.photos.length > 1 && (
              <div className="flex overflow-x-auto space-x-2 py-2">
                {place.photos.map((photo, index) => (
                  <div key={index} className="flex-shrink-0 w-24 h-24">
                    <img 
                      src={photo} 
                      alt={`Photo ${index + 1}`} 
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Tabs for details, map, etc */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="broker">
                  {place.category === 'restaurant' || place.category === 'shop' ? 'Services' : 'Broker'}
                </TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <h3 className="text-lg font-medium mb-2">About this {place.category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-sm">
                    <span className="block text-gray-500">Price</span>
                    <span className="font-medium">${place.price.toLocaleString()}{place.action === 'rent' ? '/month' : ''}</span>
                  </div>
                  {place.area && (
                    <div className="text-sm">
                      <span className="block text-gray-500">Area</span>
                      <span className="font-medium">{place.area} m²</span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="block text-gray-500">Category</span>
                    <span className="font-medium capitalize">{place.category}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 whitespace-pre-line">{place.description}</p>
                
                {/* Additional details based on category */}
                {place.category === 'restaurant' && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-2">Restaurant Features</h4>
                    <ul className="list-disc ml-5 text-gray-700">
                      <li>Cuisine: Italian</li>
                      <li>Seating capacity: 45</li>
                      <li>Outdoor seating available</li>
                      <li>Private dining room</li>
                      <li>Full bar</li>
                    </ul>
                  </div>
                )}
                
                {place.category === 'shop' && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-2">Shop Details</h4>
                    <ul className="list-disc ml-5 text-gray-700">
                      <li>Business established: 2015</li>
                      <li>Monthly revenue: ~$15,000</li>
                      <li>Inventory included in sale</li>
                      <li>Customer database included</li>
                      <li>Staff willing to stay on</li>
                    </ul>
                  </div>
                )}
                
                {(place.category === 'flat' || place.category === 'villa') && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-2">Property Features</h4>
                    <ul className="list-disc ml-5 text-gray-700">
                      <li>{place.category === 'flat' ? '1 bedroom, 1 bathroom' : '4 bedrooms, 3 bathrooms'}</li>
                      <li>Fully furnished</li>
                      <li>{place.category === 'flat' ? 'Open kitchen' : 'Separate kitchen and dining area'}</li>
                      <li>High-speed internet</li>
                      <li>{place.category === 'flat' ? 'Shared garden' : 'Private garden and pool'}</li>
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="location" className="mt-6">
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <MapView 
                    places={[place]} 
                    height="h-full" 
                    showControls={true}
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Location Details</h3>
                  <address className="text-gray-700 not-italic">
                    {place.location.buildingName && <div>{place.location.buildingName}</div>}
                    <div>
                      {place.location.floor && `Floor ${place.location.floor}, `}
                      {place.location.unit && `Unit ${place.location.unit}`}
                    </div>
                    <div className="mt-2">
                      Coordinates: {place.location.lat.toFixed(6)}, {place.location.lng.toFixed(6)}
                    </div>
                  </address>
                  
                  <h4 className="text-md font-medium mt-4 mb-2">Nearby Amenities</h4>
                  <ul className="list-disc ml-5 text-gray-700">
                    <li>Public transportation (0.2 mi)</li>
                    <li>Grocery store (0.3 mi)</li>
                    <li>Restaurants (0.1 mi)</li>
                    <li>Park (0.5 mi)</li>
                    <li>Schools (0.7 mi)</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="broker" className="mt-6">
                {place.category === 'flat' || place.category === 'villa' ? (
                  <>
                    <h3 className="text-lg font-medium mb-4">Available Brokers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className={`cursor-pointer ${selectedBroker?.id === 'b1' ? 'border-primary' : ''}`} onClick={() => handleSelectBroker({
                        id: 'b1',
                        name: 'John Smith',
                        rating: 4.8,
                        commissionsRate: 5,
                        photoUrl: '/placeholder.svg'
                      })}>
                        <CardContent className="p-4 flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                            <img src="/placeholder.svg" alt="John Smith" className="w-full h-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">John Smith</h4>
                            <div className="flex items-center text-sm">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>4.8 (120 deals)</span>
                            </div>
                            <div className="text-sm text-gray-500">5% commission</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className={`cursor-pointer ${selectedBroker?.id === 'b2' ? 'border-primary' : ''}`} onClick={() => handleSelectBroker({
                        id: 'b2',
                        name: 'Sarah Johnson',
                        rating: 4.6,
                        commissionsRate: 4.5,
                        photoUrl: '/placeholder.svg'
                      })}>
                        <CardContent className="p-4 flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                            <img src="/placeholder.svg" alt="Sarah Johnson" className="w-full h-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Sarah Johnson</h4>
                            <div className="flex items-center text-sm">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>4.6 (85 deals)</span>
                            </div>
                            <div className="text-sm text-gray-500">4.5% commission</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {selectedBroker && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium mb-2">About {selectedBroker.name}</h4>
                        <p className="text-gray-700">
                          {selectedBroker.name} is an experienced real estate broker with a track record of successful deals. 
                          They will help facilitate the {place.action === 'rent' ? 'rental' : place.action === 'sell' ? 'sale' : 'purchase'} 
                          process and ensure all paperwork is handled correctly.
                        </p>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" className="mr-2" onClick={() => setSelectedBroker(null)}>Change Broker</Button>
                          <Button onClick={() => {
                            toast({
                              title: "Broker contacted",
                              description: `${selectedBroker.name} has been notified and will contact you soon.`,
                            });
                          }}>
                            Contact Broker
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-4">Available Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className={`cursor-pointer ${selectedDeliverer?.id === 'd1' ? 'border-primary' : ''}`} onClick={() => handleSelectDeliverer({
                        id: 'd1',
                        name: 'Fast Delivery Inc.',
                        rating: 4.5,
                        deliveryFee: 15,
                        deliveryArea: 'Downtown area',
                        photoUrl: '/placeholder.svg'
                      })}>
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                              <img src="/placeholder.svg" alt="Fast Delivery" className="w-full h-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium">Fast Delivery Inc.</h4>
                              <div className="flex items-center text-sm">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span>4.5 (230 deliveries)</span>
                              </div>
                              <div className="text-sm text-gray-500">$15 delivery fee</div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <p>Area: Downtown area</p>
                            <p>Avg. delivery time: 30min</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className={`cursor-pointer ${selectedDeliverer?.id === 'd2' ? 'border-primary' : ''}`} onClick={() => handleSelectDeliverer({
                        id: 'd2',
                        name: 'Express Couriers',
                        rating: 4.7,
                        deliveryFee: 18,
                        deliveryArea: 'City-wide',
                        photoUrl: '/placeholder.svg'
                      })}>
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                              <img src="/placeholder.svg" alt="Express Couriers" className="w-full h-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium">Express Couriers</h4>
                              <div className="flex items-center text-sm">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span>4.7 (190 deliveries)</span>
                              </div>
                              <div className="text-sm text-gray-500">$18 delivery fee</div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <p>Area: City-wide</p>
                            <p>Avg. delivery time: 45min</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {selectedDeliverer && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium mb-2">About {selectedDeliverer.name}</h4>
                        <p className="text-gray-700">
                          {selectedDeliverer.name} offers reliable delivery services for this {place.category}. 
                          They can deliver products directly to your location within their service area.
                        </p>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" className="mr-2" onClick={() => setSelectedDeliverer(null)}>Change Deliverer</Button>
                          <Button onClick={() => {
                            toast({
                              title: "Deliverer selected",
                              description: `${selectedDeliverer.name} has been selected for delivery services.`,
                            });
                          }}>
                            Use This Deliverer
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="contact" className="mt-6">
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="font-medium">{place.isOwner ? 'Owner' : 'Agent'}</div>
                      <div className="text-gray-500">{place.isOwner ? 'You' : 'Jane Doe'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-gray-500">{place.isOwner ? 'Your phone number' : '+1 (555) 123-4567'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-500">{place.isOwner ? 'Your email address' : 'contact@example.com'}</div>
                    </div>
                  </div>
                  
                  {!place.isOwner && (
                    <div className="mt-6">
                      <Button onClick={handleContactAction} className="w-full">
                        Send Message
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold mb-1">
                  ${place.price.toLocaleString()}
                  {place.action === 'rent' && <span className="text-sm font-normal ml-1">/month</span>}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  {place.area && (
                    <>
                      <span>{place.area} m²</span>
                      <span className="mx-2">•</span>
                    </>
                  )}
                  <span className="capitalize">{getActionText()}</span>
                </div>
                
                {/* Action buttons based on place category and action */}
                {place.category === 'restaurant' && (
                  <Button className="w-full mb-2" onClick={handleBookingAction}>
                    Book a Table
                  </Button>
                )}
                
                {(place.category === 'flat' || place.category === 'villa') && (
                  <>
                    <Button className="w-full mb-2" onClick={handleBookingAction}>
                      Schedule a Viewing
                    </Button>
                    
                    {place.action === 'rent' && (
                      <Button className="w-full" variant="outline" onClick={handleTransactionAction}>
                        Apply to Rent
                      </Button>
                    )}
                    
                    {place.action === 'sell' && (
                      <Button className="w-full" variant="outline" onClick={handleTransactionAction}>
                        Make an Offer
                      </Button>
                    )}
                  </>
                )}
                
                {place.category === 'shop' && (
                  <Button className="w-full" onClick={handleContactAction}>
                    Contact {place.action === 'sell' ? 'Seller' : 'Owner'}
                  </Button>
                )}
                
                {/* If this is a listing user created */}
                {place.isOwner && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-2">Listing Actions:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">Edit Listing</Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Broker card */}
            {place.broker && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="font-medium">Broker</h3>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                      <img src={place.broker.photoUrl || '/placeholder.svg'} alt={place.broker.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{place.broker.name}</div>
                      <div className="flex items-center text-sm">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{place.broker.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    Commission: {place.broker.commissionsRate}%
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline" onClick={() => {
                    toast({
                      title: "Broker contacted",
                      description: `${place.broker?.name} has been notified and will contact you soon.`,
                    });
                  }}>
                    Contact Broker
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Deliverer card */}
            {place.deliverer && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Truck className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="font-medium">Delivery Service</h3>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                      <img src={place.deliverer.photoUrl || '/placeholder.svg'} alt={place.deliverer.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{place.deliverer.name}</div>
                      <div className="flex items-center text-sm">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{place.deliverer.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <div>Delivery Fee: ${place.deliverer.deliveryFee}</div>
                    {place.deliverer.deliveryArea && <div>Area: {place.deliverer.deliveryArea}</div>}
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline" onClick={() => {
                    toast({
                      title: "Delivery requested",
                      description: `Your delivery request has been sent to ${place.deliverer?.name}.`,
                    });
                  }}>
                    Request Delivery
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Related listings */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Info className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="font-medium">Similar Places</h3>
                </div>
                
                <div className="space-y-4">
                  {samplePlaces
                    .filter(p => p.id !== place.id && p.category === place.category)
                    .slice(0, 2)
                    .map(relatedPlace => (
                      <div key={relatedPlace.id} className="flex border-b pb-3 last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                          {relatedPlace.photos && relatedPlace.photos.length > 0 ? (
                            <img 
                              src={relatedPlace.photos[0]} 
                              alt={relatedPlace.title} 
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-sm">{relatedPlace.title}</h4>
                          <div className="text-sm text-gray-500">${relatedPlace.price.toLocaleString()}</div>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-sm" 
                            onClick={() => navigate(`/places/${relatedPlace.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;

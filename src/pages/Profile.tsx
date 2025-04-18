
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, MapPin, Edit, Settings, Plus, Grid, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import EventCard from '@/components/Events/EventCard';
import HobbyTag from '@/components/UI/HobbyTag';
import MapView from '@/components/Map/MapView';
import { useAuth } from '@/context/AuthContext';

// Sample user data (in a real app, this would be fetched from an API)
const userData = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  bio: 'Sports enthusiast and amateur photographer. Always looking for new adventures and people to share them with!',
  avatar: 'https://i.pravatar.cc/300?img=1',
  coverPhoto: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2070&auto=format&fit=crop',
  location: {
    address: 'London, UK',
    lat: 51.505,
    lng: -0.09
  },
  joinDate: '2024-01-15T12:00:00Z',
  hobbies: [
    { name: 'Football', type: 'sports' as const },
    { name: 'Photography', type: 'arts' as const },
    { name: 'Hiking', type: 'outdoors' as const },
    { name: 'Chess', type: 'other' as const }
  ],
  events: {
    upcoming: [
      {
        id: '1',
        title: 'Sunday Football Match',
        description: 'Casual 5v5 football match. All skill levels welcome!',
        hobby: 'Football',
        hobbyType: 'sports' as const,
        date: '2025-04-20T14:00:00Z',
        attendees: 8,
        location: 'Victoria Park, London'
      }
    ],
    past: [
      {
        id: '2',
        title: 'Photography Walk',
        description: 'Explore the city and capture its beauty with fellow photography enthusiasts.',
        hobby: 'Photography',
        hobbyType: 'arts' as const,
        date: '2023-12-19T10:00:00Z',
        attendees: 5,
        location: 'Hyde Park, London'
      }
    ],
    created: [
      {
        id: '1',
        title: 'Sunday Football Match',
        description: 'Casual 5v5 football match. All skill levels welcome!',
        hobby: 'Football',
        hobbyType: 'sports' as const,
        date: '2025-04-20T14:00:00Z',
        attendees: 8,
        location: 'Victoria Park, London'
      }
    ]
  },
  places: [
    {
      id: '1',
      name: 'Victoria Park Football Field',
      description: 'Great public football field with well-maintained grass.',
      hobby: 'Football',
      hobbyType: 'sports' as const,
      location: {
        lat: 51.535,
        lng: -0.04,
        address: 'Victoria Park, London'
      },
      photos: [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1470&auto=format&fit=crop'
      ]
    },
    {
      id: '2',
      name: 'Hyde Park View Point',
      description: 'Perfect spot for landscape photography, especially during sunset.',
      hobby: 'Photography',
      hobbyType: 'arts' as const,
      location: {
        lat: 51.507,
        lng: -0.165,
        address: 'Hyde Park, London'
      },
      photos: [
        'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?q=80&w=1470&auto=format&fit=crop'
      ]
    }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521731299294-0d53a31dd652?q=80&w=1469&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1064&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1349&auto=format&fit=crop'
  ]
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  const [eventsView, setEventsView] = useState('upcoming');
  const [galleryView, setGalleryView] = useState<'grid' | 'list'>('grid');
  
  // In a real app, you would fetch the user by ID
  // and check if it's the current user's profile
  const profileData = userData;
  const isOwnProfile = !id || id === profileData.id;
  
  // Format join date
  const joinDate = new Date(profileData.joinDate);
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
  
  // Places for map
  const mapEvents = profileData.places.map(place => ({
    id: place.id,
    title: place.name,
    description: place.description,
    location: { lat: place.location.lat, lng: place.location.lng },
    hobby: place.hobby,
    hobbyType: place.hobbyType,
    date: new Date().toISOString(), // Not relevant for places
    attendees: 0 // Not relevant for places
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Cover Photo & Profile Section */}
      <div className="relative pt-16">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 w-full bg-gray-200 overflow-hidden">
          {profileData.coverPhoto ? (
            <img 
              src={profileData.coverPhoto} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20" />
          )}
        </div>
        
        {/* Profile Info */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              <div className="flex justify-center sm:justify-start">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback>{profileData.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 sm:mt-0 text-center sm:text-left flex-grow">
                <h1 className="text-2xl sm:text-3xl font-bold">{profileData.name}</h1>
                <p className="text-gray-600">@{profileData.username}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  {profileData.hobbies.map((hobby, index) => (
                    <HobbyTag key={index} name={hobby.name} type={hobby.type} />
                  ))}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex justify-center sm:justify-end space-x-2">
                {isOwnProfile ? (
                  <>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm">Connect</Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full max-w-md mx-auto sm:mx-0 mb-6">
              <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
              <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
              <TabsTrigger value="places" className="flex-1">Places</TabsTrigger>
              <TabsTrigger value="gallery" className="flex-1">Gallery</TabsTrigger>
            </TabsList>
            
            {/* About Tab */}
            <TabsContent value="about" className="space-y-8">
              {/* Bio Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-medium mb-4">About</h2>
                <p className="text-gray-700">{profileData.bio}</p>
                
                <div className="mt-6 flex flex-col space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span>{profileData.location.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3" />
                    <span>Joined {formattedJoinDate}</span>
                  </div>
                </div>
              </div>
              
              {/* Hobbies Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-medium mb-4">Hobbies & Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.hobbies.map((hobby, index) => (
                    <HobbyTag key={index} name={hobby.name} type={hobby.type} />
                  ))}
                </div>
              </div>
              
              {/* Upcoming Events Section */}
              {profileData.events.upcoming.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Upcoming Events</h2>
                    <Link to={`/profile/${profileData.id}/events`}>
                      <Button variant="link" size="sm" className="p-0">
                        View all
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {profileData.events.upcoming.slice(0, 2).map(event => (
                      <EventCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        description={event.description}
                        hobby={event.hobby}
                        hobbyType={event.hobbyType}
                        date={event.date}
                        attendees={event.attendees}
                        location={event.location}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Featured Places */}
              {profileData.places.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Favorite Places</h2>
                    <Button variant="link" size="sm" className="p-0" onClick={() => setActiveTab('places')}>
                      View all
                    </Button>
                  </div>
                  <div className="h-64 mb-4">
                    <MapView
                      events={mapEvents}
                      height="h-full"
                      showControls={false}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {profileData.places.length} places added
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant={eventsView === 'upcoming' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEventsView('upcoming')}
                  >
                    Upcoming
                  </Button>
                  <Button
                    variant={eventsView === 'past' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEventsView('past')}
                  >
                    Past
                  </Button>
                  <Button
                    variant={eventsView === 'created' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEventsView('created')}
                  >
                    Created
                  </Button>
                </div>
                
                {isOwnProfile && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.events[eventsView as keyof typeof profileData.events].length > 0 ? (
                  profileData.events[eventsView as keyof typeof profileData.events].map(event => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      hobby={event.hobby}
                      hobbyType={event.hobbyType}
                      date={event.date}
                      attendees={event.attendees}
                      location={event.location}
                    />
                  ))
                ) : (
                  <div className="col-span-2 py-10 text-center text-gray-500">
                    <Calendar className="mx-auto h-10 w-10 mb-2 opacity-50" />
                    <p>No {eventsView} events found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Places Tab */}
            <TabsContent value="places" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Favorite Places ({profileData.places.length})</h2>
                
                {isOwnProfile && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Place
                  </Button>
                )}
              </div>
              
              {/* Map with all places */}
              <div className="h-80 rounded-lg overflow-hidden border">
                <MapView
                  events={mapEvents}
                  height="h-full"
                />
              </div>
              
              {/* Places List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData.places.length > 0 ? (
                  profileData.places.map(place => (
                    <div key={place.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                      {place.photos && place.photos.length > 0 && (
                        <div className="h-40 w-full">
                          <img 
                            src={place.photos[0]} 
                            alt={place.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="mb-2">
                          <HobbyTag name={place.hobby} type={place.hobbyType} />
                        </div>
                        <h3 className="font-bold">{place.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{place.description}</p>
                        
                        <div className="flex items-center mt-3 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{place.location.address}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-10 text-center text-gray-500">
                    <MapPin className="mx-auto h-10 w-10 mb-2 opacity-50" />
                    <p>No places added yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Photo Gallery ({profileData.gallery.length})</h2>
                
                <div className="flex space-x-2">
                  <Button 
                    size="icon" 
                    variant={galleryView === 'grid' ? "default" : "outline"}
                    onClick={() => setGalleryView('grid')}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button 
                    size="icon" 
                    variant={galleryView === 'list' ? "default" : "outline"}
                    onClick={() => setGalleryView('list')}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>
              
              {profileData.gallery.length > 0 ? (
                <div className={`grid ${
                  galleryView === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' 
                    : 'grid-cols-1'
                } gap-4`}>
                  {profileData.gallery.map((photo, index) => (
                    <div 
                      key={index} 
                      className={`
                        bg-white rounded-lg shadow-sm border overflow-hidden
                        ${galleryView === 'list' ? 'flex' : ''}
                      `}
                    >
                      <div className={`
                        ${galleryView === 'grid' ? 'h-40' : 'h-24 w-24 flex-shrink-0'}
                      `}>
                        <img 
                          src={photo} 
                          alt={`Gallery photo ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {galleryView === 'list' && (
                        <div className="p-3 flex-grow">
                          <h3 className="font-medium">Photo {index + 1}</h3>
                          <p className="text-xs text-gray-500 mt-1">Added on {new Date().toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500">
                  <p>No photos added yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;

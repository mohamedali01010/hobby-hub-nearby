
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, MapPin, Clock, Star, Heart, 
  ChevronRight, Filter, Plus, Bell, Settings, 
  User, LogOut, Search, Menu, X, Home, Map as MapIcon,
  MessageSquare, CalendarDays, UserPlus, Briefcase, Building,
  UtensilsCrossed, Store, DollarSign, ArrowDown, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Event, Place } from '@/components/Map/MapMarker';
import MapView from '@/components/Map/MapView';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Sample data for dashboard
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Football Match',
    description: 'Weekly football match at the local park. All skill levels welcome!',
    location: { lat: 51.505, lng: -0.09, buildingName: 'Central Park' },
    hobby: 'sports',
    hobbyType: 'sports',
    eventType: 'football',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    attendees: 12,
    isLive: true,
    liveViewers: 24
  },
  {
    id: '2',
    title: 'Art Exhibition',
    description: 'Local artists showcase their latest works. Free entry.',
    location: { lat: 51.51, lng: -0.1, buildingName: 'City Gallery', floor: 2 },
    hobby: 'arts',
    hobbyType: 'arts',
    eventType: 'exhibition',
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    attendees: 45,
    isEnhanced: true
  },
  {
    id: '3',
    title: 'Tech Meetup',
    description: 'Monthly gathering of tech enthusiasts. This month: AI and Machine Learning.',
    location: { lat: 51.515, lng: -0.09, buildingName: 'Innovation Hub', floor: 1 },
    hobby: 'tech',
    hobbyType: 'tech',
    eventType: 'meetup',
    date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    attendees: 32
  },
  {
    id: '4',
    title: 'Jazz Night',
    description: 'Live jazz performance featuring local musicians.',
    location: { lat: 51.52, lng: -0.1, buildingName: 'Blue Note Club' },
    hobby: 'music',
    hobbyType: 'music',
    eventType: 'concert',
    date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    attendees: 78,
    isLive: true,
    liveViewers: 156
  },
  {
    id: '5',
    title: 'Cooking Workshop',
    description: 'Learn to cook authentic Italian pasta from a professional chef.',
    location: { lat: 51.51, lng: -0.08, buildingName: 'Culinary Institute', floor: 3 },
    hobby: 'food',
    hobbyType: 'food',
    eventType: 'workshop',
    date: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
    attendees: 15
  }
];

const samplePlaces: Place[] = [
  {
    id: '1',
    title: 'Modern Studio Apartment',
    description: 'Cozy studio apartment in downtown, perfect for professionals.',
    location: { lat: 51.505, lng: -0.09, floor: 3, unit: 'B4', buildingName: 'Riverside Apartments' },
    type: 'property',
    isOwner: true,
    category: 'flat',
    action: 'rent',
    price: 1200,
    area: 45
  },
  {
    id: '2',
    title: 'Family Villa with Garden',
    description: 'Spacious family villa with beautiful garden and swimming pool.',
    location: { lat: 51.51, lng: -0.1, buildingName: 'Palm Estate' },
    type: 'property',
    isOwner: true,
    category: 'villa',
    action: 'sell',
    price: 450000,
    area: 180
  },
  {
    id: '3',
    title: 'Italian Restaurant',
    description: 'Authentic Italian cuisine in the heart of the city.',
    location: { lat: 51.497, lng: -0.07, unit: '101', buildingName: 'Corner Plaza' },
    type: 'property',
    isOwner: false,
    category: 'restaurant',
    action: 'rent',
    price: 3500,
    area: 120
  }
];

const sampleMessages = [
  {
    id: '1',
    sender: 'John Doe',
    avatar: '/placeholder.svg',
    message: 'Hey, are you coming to the football match tomorrow?',
    time: '10:30 AM',
    unread: true
  },
  {
    id: '2',
    sender: 'Jane Smith',
    avatar: '/placeholder.svg',
    message: 'I listed my apartment for rent. Can you check it out?',
    time: 'Yesterday',
    unread: false
  },
  {
    id: '3',
    sender: 'Mike Johnson',
    avatar: '/placeholder.svg',
    message: 'Thanks for organizing the tech meetup. It was great!',
    time: '2 days ago',
    unread: false
  }
];

const sampleNotifications = [
  {
    id: '1',
    title: 'New Event Nearby',
    description: 'Football match tomorrow at Central Park',
    time: '1 hour ago',
    unread: true
  },
  {
    id: '2',
    title: 'Friend Request',
    description: 'Jane Smith wants to connect',
    time: 'Yesterday',
    unread: true
  },
  {
    id: '3',
    title: 'Event Reminder',
    description: 'Tech Meetup starts in 2 hours',
    time: '2 days ago',
    unread: false
  }
];

const sampleFriends = [
  { id: '1', name: 'John Doe', avatar: '/placeholder.svg', status: 'online' },
  { id: '2', name: 'Jane Smith', avatar: '/placeholder.svg', status: 'offline' },
  { id: '3', name: 'Mike Johnson', avatar: '/placeholder.svg', status: 'online' },
  { id: '4', name: 'Sarah Williams', avatar: '/placeholder.svg', status: 'offline' },
  { id: '5', name: 'David Brown', avatar: '/placeholder.svg', status: 'online' }
];

const sampleHobbies = [
  { id: 'sports', name: 'Sports', count: 24 },
  { id: 'arts', name: 'Arts', count: 18 },
  { id: 'music', name: 'Music', count: 32 },
  { id: 'tech', name: 'Technology', count: 15 },
  { id: 'food', name: 'Food', count: 27 },
  { id: 'outdoors', name: 'Outdoors', count: 21 }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(2);
  const [messageCount, setMessageCount] = useState(1);
  const [showMap, setShowMap] = useState(false);
  
  // Use the events context
  const { 
    displayedEvents, 
    filterEvents, 
    pastEvents, 
    friendEvents, 
    suggestedEvents 
  } = useEvents();
  
  // Filter events based on search query
  const filteredEvents = displayedEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.hobby.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter places based on search query
  const filteredPlaces = samplePlaces.filter(place => 
    place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle hobby filter
  const handleHobbyFilter = (hobby: string) => {
    if (selectedHobby === hobby) {
      setSelectedHobby(null);
      filterEvents({ showAll: true });
    } else {
      setSelectedHobby(hobby);
      filterEvents({ hobby });
    }
  };
  
  // Handle notification click
  const handleNotificationClick = (id: string) => {
    // Mark notification as read
    setNotificationCount(prev => Math.max(0, prev - 1));
    toast({
      title: "Notification marked as read",
      description: "You've read this notification.",
    });
  };
  
  // Handle message click
  const handleMessageClick = (id: string) => {
    // Mark message as read
    setMessageCount(prev => Math.max(0, prev - 1));
    navigate(`/messages/${id}`);
  };
  
  // Handle event click
  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`);
  };
  
  // Handle place click
  const handlePlaceClick = (place: Place) => {
    navigate(`/places/${place.id}`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="py-4">
                <div className="flex items-center mb-6">
                  <Avatar className="h-10 w-10 mr-2">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user?.name ?? 'User'}</div>
                    <div className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Button 
                    variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab('overview');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Overview
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'events' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab('events');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Events
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'places' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab('places');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Building className="mr-2 h-4 w-4" />
                    Places
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'messages' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab('messages');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                    {messageCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {messageCount}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab('notifications');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    {notificationCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'friends' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab('friends');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Friends
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab('settings');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
                
                <div className="mt-6 pt-6 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                {notificationCount}
              </span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare className="h-5 w-5" />
            {messageCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                {messageCount}
              </span>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="flex h-screen lg:h-[calc(100vh-0px)]">
        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:flex lg:w-64 flex-col border-r p-4">
          <div className="flex items-center mb-6">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.name ?? 'User'}</div>
              <div className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <Home className="mr-2 h-4 w-4" />
              Overview
            </Button>
            
            <Button 
              variant={activeTab === 'events' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('events')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </Button>
            
            <Button 
              variant={activeTab === 'places' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('places')}
            >
              <Building className="mr-2 h-4 w-4" />
              Places
            </Button>
            
            <Button 
              variant={activeTab === 'messages' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
              {messageCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {messageCount}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              {notificationCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {notificationCount}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant={activeTab === 'friends' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('friends')}
            >
              <Users className="mr-2 h-4 w-4" />
              Friends
            </Button>
            
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
          
          <div className="mt-auto pt-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Welcome back, {user?.name ?? 'User'}!</h1>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? (
                    <>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Hide Map</span>
                    </>
                  ) : (
                    <>
                      <MapIcon className="mr-2 h-4 w-4" />
                      <span>Show Map</span>
                    </>
                  )}
                </Button>
              </div>
              
              {showMap ? (
                <div className="h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden border">
                  <MapView 
                    events={displayedEvents} 
                    places={samplePlaces}
                    height="h-full"
                    showControls={true}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 flex flex-col">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Upcoming Events</div>
                      <div className="text-2xl font-bold">{displayedEvents.length}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {displayedEvents.filter(e => new Date(e.date) < new Date(Date.now() + 86400000)).length} events today
                      </div>
                      <Button 
                        variant="link" 
                        className="mt-2 p-0 h-auto self-start"
                        onClick={() => setActiveTab('events')}
                      >
                        View all events
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex flex-col">
                      <div className="text-sm font-medium text-muted-foreground mb-1">My Places</div>
                      <div className="text-2xl font-bold">{samplePlaces.filter(p => p.isOwner).length}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {samplePlaces.filter(p => p.isOwner && p.action === 'rent').length} for rent, {samplePlaces.filter(p => p.isOwner && p.action === 'sell').length} for sale
                      </div>
                      <Button 
                        variant="link" 
                        className="mt-2 p-0 h-auto self-start"
                        onClick={() => setActiveTab('places')}
                      >
                        View all places
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex flex-col">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Messages</div>
                      <div className="text-2xl font-bold">{sampleMessages.length}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {sampleMessages.filter(m => m.unread).length} unread messages
                      </div>
                      <Button 
                        variant="link" 
                        className="mt-2 p-0 h-auto self-start"
                        onClick={() => setActiveTab('messages')}
                      >
                        View all messages
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex flex-col">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Friends</div>
                      <div className="text-2xl font-bold">{sampleFriends.length}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {sampleFriends.filter(f => f.status === 'online').length} online now
                      </div>
                      <Button 
                        variant="link" 
                        className="mt-2 p-0 h-auto self-start"
                        onClick={() => setActiveTab('friends')}
                      >
                        View all friends
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Upcoming Events</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('events')}
                  >
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedEvents.slice(0, 3).map((event) => (
                    <Card key={event.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleEventClick(event)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                          </div>
                          <Badge>{event.hobby}</Badge>
                        </div>
                        
                        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            <Users className="mr-1 h-4 w-4" />
                            <span>{event.attendees} attending</span>
                          </div>
                          
                          {event.isLive && event.liveViewers !== undefined && (
                            <div className="flex items-center text-sm text-red-500">
                              <Eye className="mr-1 h-4 w-4" />
                              <span>{event.liveViewers} watching</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">My Places</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('places')}
                  >
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {samplePlaces.filter(p => p.isOwner).slice(0, 3).map((place) => (
                    <Card key={place.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handlePlaceClick(place)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{place.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="mr-1 h-4 w-4" />
                              <span>{place.location.buildingName || 'Unknown location'}</span>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {place.category === 'flat' ? 'Flat' : 
                             place.category === 'villa' ? 'Villa' :
                             place.category === 'restaurant' ? 'Restaurant' : 
                             place.category === 'shop' ? 'Shop' : 'Place'}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {place.description}
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          {place.price !== undefined && (
                            <div className="font-semibold">
                              ${place.price.toLocaleString()}{place.action === 'rent' ? '/month' : ''}
                            </div>
                          )}
                          
                          <Badge variant={place.action === 'rent' ? 'default' : place.action === 'sell' ? 'destructive' : 'secondary'}>
                            {place.action === 'rent' ? 'For Rent' : 
                             place.action === 'sell' ? 'For Sale' : 
                             'Wanted to Buy'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Messages</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('messages')}
                  >
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {sampleMessages.slice(0, 3).map((message) => (
                    <Card 
                      key={message.id} 
                      className={`cursor-pointer hover:border-primary transition-colors ${message.unread ? 'bg-primary/5' : ''}`}
                      onClick={() => handleMessageClick(message.id)}
                    >
                      <CardContent className="p-4 flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{message.sender}</h3>
                            <span className="text-xs text-muted-foreground">{message.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                        </div>
                        {message.unread && (
                          <div className="ml-2 h-2 w-2 bg-primary rounded-full"></div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Events</h1>
                
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search events..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {sampleHobbies.map((hobby) => (
                  <Badge 
                    key={hobby.id}
                    variant={selectedHobby === hobby.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleHobbyFilter(hobby.id)}
                  >
                    {hobby.name} ({hobby.count})
                  </Badge>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleEventClick(event)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                          </div>
                          <Badge>{event.hobby}</Badge>
                        </div>
                        
                        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            <Users className="mr-1 h-4 w-4" />
                            <span>{event.attendees} attending</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {event.isLive && event.liveViewers !== undefined && (
                              <div className="flex items-center text-sm text-red-500">
                                <Eye className="mr-1 h-4 w-4" />
                                <span>{event.liveViewers} watching</span>
                              </div>
                            )}
                            
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, User } from '@/components/Map/MapMarker';
import { useAuth } from '@/context/AuthContext';

interface EventContextProps {
  allEvents: Event[];
  displayedEvents: Event[];
  pastEvents: Event[];
  friendEvents: Event[];
  suggestedEvents: Event[];
  likeEvent: (eventId: string) => void;
  markEventComplete: (eventId: string) => void;
  filterEvents: (filter: EventFilterOptions) => void;
  getPastEventsForLocation: (placeId?: string) => Event[];
  getUserPastEvents: () => Event[];
  getPersonalizedEvents: () => Event[];
  selectAreaEvents: (lat: number, lng: number, radius: number) => void;
  clearAreaFilter: () => void;
  isAreaFilterActive: boolean;
  getEventsInArea: (lat: number, lng: number, radius: number) => Event[];
  getEventsWithSimilarHobbies: (hobbies: string[]) => Event[];
}

interface EventFilterOptions {
  showAll?: boolean;
  showFriendsOnly?: boolean;
  showSuggestedOnly?: boolean;
  showPersonalized?: boolean;
  hobby?: string;
  dateRange?: 'today' | 'tomorrow' | 'this-week' | 'all';
  distance?: number;
  liveOnly?: boolean;
  areaOnly?: boolean;
}

interface EventProviderProps {
  children: ReactNode;
  initialEvents: Event[];
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const EventProvider: React.FC<EventProviderProps> = ({ children, initialEvents }) => {
  const { user } = useAuth();
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents || []);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>(initialEvents || []);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [friendEvents, setFriendEvents] = useState<Event[]>([]);
  const [suggestedEvents, setSuggestedEvents] = useState<Event[]>([]);
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [areaFilter, setAreaFilter] = useState<{lat: number, lng: number, radius: number} | null>(null);
  
  // Process initial events and separate them
  useEffect(() => {
    if (initialEvents) {
      const now = new Date();
      
      // Split events into past and future
      const past = initialEvents.filter(event => new Date(event.date) < now);
      const future = initialEvents.filter(event => new Date(event.date) >= now);
      
      // Just using random logic to mark some events as friend events and suggested events
      // In a real app, this would come from a backend based on user connections and preferences
      const friendsEvts = future.filter((_, index) => index % 5 === 0);
      const suggestedEvts = future.filter((_, index) => index % 3 === 0 && index % 5 !== 0);
      
      setAllEvents(future);
      setDisplayedEvents(future);
      setPastEvents(past);
      setFriendEvents(friendsEvts);
      setSuggestedEvents(suggestedEvts);
    }
  }, [initialEvents]);

  // Update friend events whenever the user's friends list changes
  useEffect(() => {
    if (user && user.friends && allEvents.length > 0) {
      // In a real app, filter events created by or attended by friends
      // For now, just simulate with random selection
      const friends = user.friends || [];
      const friendsEvents = allEvents.filter(event => 
        event.createdBy && friends.includes(event.createdBy) ||
        event.attendeesList?.some(attendee => friends.includes(attendee))
      );
      
      // If we have a small number of friend events, supplement with some random ones
      if (friendsEvents.length < 3) {
        const additionalEvents = allEvents
          .filter(e => !friendsEvents.some(fe => fe.id === e.id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        
        setFriendEvents([...friendsEvents, ...additionalEvents]);
      } else {
        setFriendEvents(friendsEvents);
      }
    }
  }, [user, allEvents]);
  
  const likeEvent = (eventId: string) => {
    const newLiked = new Set(likedEvents);
    if (newLiked.has(eventId)) {
      newLiked.delete(eventId);
    } else {
      newLiked.add(eventId);
    }
    setLikedEvents(newLiked);
  };
  
  const markEventComplete = (eventId: string) => {
    // Find the event to move to past events
    const eventToMove = allEvents.find(e => e.id === eventId);
    
    if (eventToMove) {
      // Remove from current events
      setAllEvents(prev => prev.filter(e => e.id !== eventId));
      setDisplayedEvents(prev => prev.filter(e => e.id !== eventId));
      
      // Add to past events
      setPastEvents(prev => [...prev, eventToMove]);
    }
  };

  // Calculate distance between two points in kilometers
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

  // Get events within a specific radius from a point
  const getEventsInArea = (lat: number, lng: number, radius: number): Event[] => {
    return allEvents.filter(event => {
      const distance = calculateDistance(
        lat, 
        lng, 
        event.location.lat, 
        event.location.lng
      );
      return distance <= radius;
    });
  };
  
  // Get events that match user hobbies
  const getEventsWithSimilarHobbies = (hobbies: string[]): Event[] => {
    if (!hobbies || hobbies.length === 0) return [];
    
    const lowerCaseHobbies = hobbies.map(h => h.toLowerCase());
    
    return allEvents.filter(event => 
      lowerCaseHobbies.some(h => 
        event.hobby.toLowerCase().includes(h) || 
        event.hobbyType.toLowerCase().includes(h) || 
        (event.eventType && typeof event.eventType === 'string' && event.eventType.toLowerCase().includes(h))
      )
    );
  };
  
  // Get personalized events for the current user
  const getPersonalizedEvents = (): Event[] => {
    if (!user || !user.hobbies || user.hobbies.length === 0) {
      return suggestedEvents;
    }
    
    // Start with events matching user's hobbies
    const hobbyEvents = getEventsWithSimilarHobbies(user.hobbies);
    
    // Add friend events if available
    const combinedEvents = [...hobbyEvents];
    
    friendEvents.forEach(event => {
      if (!combinedEvents.some(e => e.id === event.id)) {
        combinedEvents.push(event);
      }
    });
    
    // Add nearby events if user has location
    if (user.location) {
      const nearbyEvents = getEventsInArea(user.location.lat, user.location.lng, 10); // 10km radius
      nearbyEvents.forEach(event => {
        if (!combinedEvents.some(e => e.id === event.id)) {
          combinedEvents.push(event);
        }
      });
    }
    
    // If we still have too few events, add some suggested ones
    if (combinedEvents.length < 5) {
      suggestedEvents.forEach(event => {
        if (!combinedEvents.some(e => e.id === event.id)) {
          combinedEvents.push(event);
        }
      });
    }
    
    return combinedEvents;
  };
  
  // Set area filter for events
  const selectAreaEvents = (lat: number, lng: number, radius: number) => {
    setAreaFilter({ lat, lng, radius });
    const eventsInArea = getEventsInArea(lat, lng, radius);
    setDisplayedEvents(eventsInArea);
  };
  
  // Clear area filter
  const clearAreaFilter = () => {
    setAreaFilter(null);
    filterEvents({ showAll: true });
  };
  
  const filterEvents = (filter: EventFilterOptions) => {
    let filtered = [...allEvents];
    
    // If area filter is active and areaOnly is true, start with events in that area
    if (areaFilter && filter.areaOnly) {
      filtered = getEventsInArea(areaFilter.lat, areaFilter.lng, areaFilter.radius);
    }
    
    // Apply filters
    if (filter.showFriendsOnly) {
      filtered = friendEvents;
    } else if (filter.showSuggestedOnly) {
      filtered = suggestedEvents;
    } else if (filter.showPersonalized) {
      filtered = getPersonalizedEvents();
    }
    
    if (filter.hobby && filter.hobby !== 'All') {
      filtered = filtered.filter(event => event.hobby === filter.hobby);
    }
    
    if (filter.liveOnly) {
      filtered = filtered.filter(event => event.isLive);
    }
    
    if (filter.dateRange) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filter.dateRange === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate < tomorrow;
        });
      } else if (filter.dateRange === 'tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= tomorrow && eventDate < dayAfterTomorrow;
        });
      } else if (filter.dateRange === 'this-week') {
        const endOfWeek = new Date(today);
        endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate <= endOfWeek;
        });
      }
    }
    
    // Apply distance filter if provided and user has location
    if (filter.distance && user?.location) {
      filtered = filtered.filter(event => {
        if (!user.location) return true;
        const distance = calculateDistance(
          user.location.lat, 
          user.location.lng, 
          event.location.lat, 
          event.location.lng
        );
        return distance <= filter.distance!;
      });
    }
    
    setDisplayedEvents(filtered);
  };
  
  const getPastEventsForLocation = (placeId?: string) => {
    if (!placeId) return [];
    return pastEvents.filter(event => event.placeId === placeId);
  };
  
  const getUserPastEvents = () => {
    // In a real app, this would filter to only return events the user participated in
    return pastEvents;
  };
  
  return (
    <EventContext.Provider 
      value={{
        allEvents,
        displayedEvents,
        pastEvents,
        friendEvents,
        suggestedEvents,
        likeEvent,
        markEventComplete,
        filterEvents,
        getPastEventsForLocation,
        getUserPastEvents,
        getPersonalizedEvents,
        selectAreaEvents,
        clearAreaFilter,
        isAreaFilterActive: !!areaFilter,
        getEventsInArea,
        getEventsWithSimilarHobbies
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

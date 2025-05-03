
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '@/components/Map/MapMarker';
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
}

interface EventFilterOptions {
  showAll?: boolean;
  showFriendsOnly?: boolean;
  showSuggestedOnly?: boolean;
  hobby?: string;
  dateRange?: 'today' | 'tomorrow' | 'this-week' | 'all';
  distance?: number;
  liveOnly?: boolean;
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
  
  const filterEvents = (filter: EventFilterOptions) => {
    let filtered = [...allEvents];
    
    // Apply filters
    if (filter.showFriendsOnly) {
      filtered = friendEvents;
    } else if (filter.showSuggestedOnly) {
      filtered = suggestedEvents;
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
    
    // Apply distance filter if provided
    if (filter.distance) {
      // In a real app, you would filter by actual distance from user
      // For now, we'll just assume all events are within the distance
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
        getUserPastEvents
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

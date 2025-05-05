import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, MapPin, Home, Store, Gift, Map, Building, UtensilsCrossed, 
  Music, Book, Camera, Mic, Palette, Utensils, Coffee, Beer, Trophy, Heart, 
  Star, Ticket, School, Landmark, Hotel, Theater, Waves, Tent, Plane 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define marker types
export type MarkerType = 'event' | 'myPlace' | 'publicPlace' | 'property' | 'donation' | 'flat' | 'restaurant' | 'shop';

// Define event types that will have special icons
export type EventType = 'football' | 'swimming' | 'rent' | 'other' | 'concert' | 'exhibition' | 'workshop' | 'meetup' | 'party' | 'festival' | 'conference' | 'sports' | 'charity' | 'sale';

// Define place categories
export type PlaceCategory = 'flat' | 'restaurant' | 'shop' | 'villa' | 'cafe' | 'bar' | 'hotel' | 'school' | 'park' | 'landmark' | 'theater' | 'beach' | 'camping';

// Define place actions
export type PlaceAction = 'rent' | 'sell' | 'buy';

// Create custom icons for different marker types
const createMarkerIcon = (type: MarkerType | string, hobbyType: string = 'other', isSelected: boolean = false, isEnhanced: boolean = false, eventType?: EventType, category?: PlaceCategory, isLive: boolean = false) => {
  // Color mapping for different marker types
  const typeColorMap: Record<string, string> = {
    event: '#EF4444',      // Bright red for events
    myPlace: '#3B82F6',    // Blue for your places
    publicPlace: '#F59E0B', // Yellow for public places
    property: '#10B981',   // Green for properties
    donation: '#8B5CF6',   // Purple for donations
    flat: '#EC4899',       // Pink for flats
    villa: '#8B5CF6',      // Purple for villas
    restaurant: '#F59E0B', // Yellow for restaurants
    shop: '#10B981',       // Green for shops
    cafe: '#D97706',       // Amber for cafes
    bar: '#7C3AED',        // Violet for bars
    hotel: '#06B6D4',      // Cyan for hotels
    school: '#2563EB',     // Blue for schools
    park: '#059669',       // Emerald for parks
    landmark: '#9333EA',   // Purple for landmarks
    theater: '#DB2777',    // Pink for theaters
    beach: '#0284C7',      // Sky blue for beaches
    camping: '#65A30D',    // Lime for camping
  };
  
  // Color mapping for different hobby types (used for event markers)
  const hobbyColorMap: Record<string, string> = {
    sports: '#3B82F6',   // blue
    arts: '#8B5CF6',     // purple
    music: '#EC4899',    // pink
    tech: '#10B981',     // green
    outdoors: '#F59E0B', // amber
    food: '#EF4444',     // red
    other: '#6B7280'     // gray
  };

  // Color mapping for specific event types
  const eventTypeColorMap: Record<string, string> = {
    football: '#33C3F0',      // sky blue
    swimming: '#F2FCE2',      // soft green
    rent: '#FEC6A1',          // soft orange
    concert: '#EC4899',       // pink
    exhibition: '#8B5CF6',    // purple
    workshop: '#10B981',      // green
    meetup: '#3B82F6',        // blue
    party: '#F472B6',         // pink
    festival: '#F59E0B',      // amber
    conference: '#6366F1',    // indigo
    sports: '#0EA5E9',        // sky
    charity: '#14B8A6',       // teal
    sale: '#F97316',          // orange
    other: '#9b87f5'          // purple
  };

  // Category-specific colors
  const categoryColorMap: Record<string, string> = {
    flat: '#EC4899',       // Pink for flats
    villa: '#8B5CF6',      // Purple for villas
    restaurant: '#F59E0B', // Yellow for restaurants
    shop: '#10B981',       // Green for shops
    cafe: '#D97706',       // Amber for cafes
    bar: '#7C3AED',        // Violet for bars
    hotel: '#06B6D4',      // Cyan for hotels
    school: '#2563EB',     // Blue for schools
    park: '#059669',       // Emerald for parks
    landmark: '#9333EA',   // Purple for landmarks
    theater: '#DB2777',    // Pink for theaters
    beach: '#0284C7',      // Sky blue for beaches
    camping: '#65A30D',    // Lime for camping
  };
  
  // Determine base color
  let color;
  if (type === 'event' && eventType) {
    color = eventTypeColorMap[eventType] || eventTypeColorMap.other;
  } else if (type === 'event') {
    color = hobbyColorMap[hobbyType] || hobbyColorMap.other;
  } else if (category) {
    color = categoryColorMap[category] || typeColorMap[type];
  } else {
    color = typeColorMap[type] || typeColorMap.event;
  }
  
  // Enhanced marker gets a glow effect
  const enhancedEffect = isEnhanced ? 
    ' filter="drop-shadow(0 0 6px ' + color + ')" stroke-width="2" stroke="white"' : '';
    
  // Live event effect - pulsating red outline
  const liveEffect = isLive ?
    ' filter="drop-shadow(0 0 8px #ef4444)" stroke-width="2" stroke="#ef4444"' : enhancedEffect;
  
  // SVG for marker - different shapes based on type
  let svgPath;
  
  // Custom event type icons
  if (type === 'event') {
    if (eventType === 'football') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M16 3c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3 5.5l-1.5 2.6-3 .4-2.2-1.9.4-3 2.8-1.1 2.8 1.1.7 1.9z"/>`;
    } else if (eventType === 'swimming') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M20 12c-1.4 0-2.2-.8-2.8-1.3-.5-.4-.7-.7-1.2-.7s-.7.3-1.2.7c-.6.5-1.4 1.3-2.8 1.3s-2.2-.8-2.8-1.3c-.1-.1-.2-.2-.3-.3.1.4.3.8.5 1.3.7.5 1.5 1.3 2.6 1.3s2.2-.8 2.8-1.3c.5-.4.7-.7 1.2-.7s.7.3 1.2.7c.6.5 1.4 1.3 2.8 1.3 1.1 0 1.9-.5 2.4-1-1.1-.7-1.7-1-2.4-1z"/>
                 <path fill="white" d="M20 9c-.5 0-.9-.2-1-.5-.2-.3-.5-.5-1-.5s-.8.2-1 .5c-.1.3-.5.5-1 .5s-.9-.2-1-.5c-.2-.3-.5-.5-1-.5s-.8.2-1 .5c-.1.3-.5.5-1 .5-.8 0-1.5-.7-1.5-1.5S11.2 6 12 6s1.5.7 1.5 1.5c0 .3.1.5.4.6.3.1.5.1.7-.1.1-.1.3-.2.4-.4.1-.1.1-.2.2-.4.2-.3.5-.5.9-.5.6 0 1.1.4 1.3 1 .1.2.3.3.6.3.3 0 .5-.1.6-.3.2-.6.7-1 1.3-1 .8 0 1.5.7 1.5 1.5S20.8 9 20 9z"/>`;
    } else if (eventType === 'rent') {
      svgPath = `<path fill="${color}" d="M16 0 L2 10 L2 30 L30 30 L30 10 Z"${liveEffect}/>
                 <path fill="white" d="M16 5 L8 10 L8 25 L24 25 L24 10 Z"/>
                 <path fill="${color}" d="M12 13 L20 13 L20 25 L12 25 Z"/>`;
    } else if (eventType === 'concert') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M12 5v10h1V5zm2 2v8h1V7zm2-2v10h1V5zm2 2v8h1V7z"/>`;
    } else if (eventType === 'exhibition') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M12 6h8v8h-8z"/>
                 <path fill="${color}" d="M13 7h6v6h-6z"/>
                 <path fill="white" d="M14 8h4v4h-4z"/>`;
    } else if (eventType === 'workshop') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M11 7h2v6h-2zm4 0h2v6h-2zm-5 7h10v1H10z"/>`;
    } else if (eventType === 'meetup') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <circle cx="13" cy="9" r="2" fill="white"/>
                 <circle cx="19" cy="9" r="2" fill="white"/>
                 <path fill="white" d="M16 12c-2 0-5 1-5 3h10c0-2-3-3-5-3s-.8.2-1 .5c-.1.3-.5.5-1 .5s-.9-.2-1-.5c-.2-.3-.5-.5-1-.5s-.8.2-1 .5c-.1.3-.5.5-1 .5-.8 0-1.5-.7-1.5-1.5S11.2 6 12 6s1.5.7 1.5 1.5c0 .3.1.5.4.6.3.1.5.1.7-.1.1-.1.3-.2.4-.4.1-.1.1-.2.2-.4.2-.3.5-.5.9-.5.6 0 1.1.4 1.3 1 .1.2.3.3.6.3.3 0 .5-.1.6-.3.2-.6.7-1 1.3-1 .8 0 1.5.7 1.5 1.5S20.8 9 20 9z"/>`;
    } else if (eventType === 'party') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M16 5l1 3h3l-2.5 1.8 1 3.2L16 11l-2.5 2 1-3.2L12 8h3z"/>
                 <path fill="white" d="M12 7.5l.5 1h1l-.8.6.3 1-1-.7-1 .7.3-1-.8-.6h1zm7 0l.5 1h1l-.8.6.3 1-1-.7-1 .7.3-1-.8-.6h1z"/>`;
    } else if (eventType === 'festival') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M16 4l1 3 3-1-1 3 3 1-3 1 1 3-3-1-1 3-1-3-3 1 1-3-3-1 3-1-1-3 3 1z"/>`;
    } else if (eventType === 'conference') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M12 7h8v1h-8zm0 2h8v1h-8zm0 2h8v1h-8zm0 2h4v1h-4z"/>`;
    } else if (eventType === 'sports') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M16 4c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm3.6 2.4L16 9l-3.6-2.6c1-.5 2.3-.8 3.6-.8s2.6.3 3.6.8zm-8.1 2.1c.4-1.1 1.1-2 2-2.6L16 8.2l-2.7 3.7-1.8-3.4zm.9 3.6c-.2-.7-.4-1.4-.4-2.1 0-.2 0-.3.1-.5l2.3 4.3-2-.8.9.4-.9-.4v-1zm1.4 1.4c-1-.6-1.8-1.4-2.3-2.4l2.8 1.2.5.3c-.4.3-.7.6-1 .9zm6.3.5c-1.3.7-2.8.9-4.3.6.5-.4 1-.8 1.3-1.4l3 .8zM19.1 12l-3.8-1 3.1-4.3c.9.7 1.5 1.7 1.8 2.8L19.1 12z"/>`;
    } else if (eventType === 'charity') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M16 13.5l-4.2-4.2c-1.1-1.1-1.1-3 0-4.1.5-.5 1.2-.8 2-.8s1.5.3 2 .8l.2.2.2-.2c.5-.5 1.2-.8 2-.8s1.5.3 2 .8c1.1 1.1 1.1 3 0 4.1L16 13.5z"/>`;
    } else if (eventType === 'sale') {
      svgPath = `<circle cx="16" cy="10" r="9" fill="${color}"${liveEffect}/>
                 <path fill="white" d="M20 8c0-.6-.4-1-1-1h-6c-.2 0-.4.1-.6.2l-3 3c-.4.4-.4 1 0 1.4l5 5c.4.4 1 .4 1.4 0l3-3c.1-.2.2-.4.2-.6V8zm-2.5 2c-.8 0-1.5-.7-1.5-1.5S16.7 7 17.5 7s1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>`;
    } else {
      // Default event icon
      svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>`;
    }
  } else if (category === 'flat' || type === 'flat') {
    // Flat icon
    svgPath = `<path fill="${color}" d="M3 32h26v10H3z"/><path fill="${color}" d="M16 0L1 15h5v17h20V15h5L16 0z"${liveEffect}/>`;
  } else if (category === 'villa' || type === 'villa') {
    // Villa icon
    svgPath = `<path fill="${color}" d="M3 32h26v10H3z"/><path fill="${color}" d="M16 0L1 15h5v17h20V15h5L16 0z"${liveEffect}/>
               <path fill="white" d="M10 20h12v12H10z"/>`;
  } else if (category === 'restaurant' || type === 'restaurant') {
    // Restaurant icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M13 5v10c0 .6.4 1 1 1h1v-5h1v5h1v-5h1v5h1c.6 0 1-.4 1-1V5h-7z"/>
               <path fill="white" d="M13 16v1c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-1h-6z"/>`;
  } else if (category === 'shop' || type === 'shop') {
    // Shop icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M12 7v2h8V7h-8z"/>
               <path fill="white" d="M20 9H12l-1 5h10l-1-5z"/>
               <path fill="white" d="M19 14H13v3h6v-3z"/>`;
  } else if (category === 'cafe' || type === 'cafe') {
    // Cafe icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M12 6h8v4c0 2.2-1.8 4-4 4s-4-1.8-4-4V6z"/>
               <path fill="white" d="M20 7h2v2h-2z"/>`;
  } else if (category === 'bar' || type === 'bar') {
    // Bar icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M20 5H12l-1 2h10l-1-2z"/>
               <path fill="white" d="M18 7l-2 6-2-6z"/>
               <path fill="white" d="M14 13h4v3h-4z"/>`;
  } else if (category === 'hotel' || type === 'hotel') {
    // Hotel icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M11 6h10v10H11z"/>
               <path fill="white" d="M13 8h2v2h-2z"/>
               <path fill="white" d="M17 8h2v2h-2z"/>
               <path fill="white" d="M13 12h6v2h-6z"/>`;
  } else if (category === 'school' || type === 'school') {
    // School icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M16 5l-6 3v6c0 3.3 2.7 6 6 6s6-2.7 6-6V8l-6-3z"/>
               <path fill="${color}" d="M16 7l-3 1.5v3c0 1.7 1.3 3 3 3s3-1.3 3-3v-3L16 7z"/>`;
  } else if (category === 'park' || type === 'park') {
    // Park icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M16 6c-2.2 0-4 1.8-4 4 0 1.5.8 2.8 2 3.4V16h4v-2.6c1.2-.7 2-2 2-3.4 0-2.2-1.8-4-4-4z"/>
               <path fill="white" d="M14 6.8c-1 .6-1.3 1.5-1 2.7.3 1.2 1 1.9 2 2.2.3.1.7-.1.8-.4.1-.3-.1-.7-.4-.8-.6-.2-1-.6-1.2-1.3-.2-.7 0-1.2.5-1.5.3-.1.4-.5.3-.8-.1-.3-.5-.4-.8-.3z"/>`;
  } else if (category === 'landmark' || type === 'landmark') {
    // Landmark icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M16 5l-5 3v2h10V8l-5-3z"/>
               <path fill="white" d="M12 10h8v4H12z"/>
               <path fill="white" d="M11 14h10v2H11z"/>
               <path fill="white" d="M13 10h1v4h-1z"/>
               <path fill="white" d="M15.5 10h1v4h-1z"/>
               <path fill="white" d="M18 10h1v4h-1z"/>`;
  } else if (category === 'theater' || type === 'theater') {
    // Theater icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M21 10c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5 5 2.2 5 5z"/>
               <path fill="${color}" d="M19 10c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3z"/>
               <path fill="white" d="M13 7l-2-2h10l-2 2z"/>`;
  } else if (category === 'beach' || type === 'beach') {
    // Beach icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M12 12c0-2.2 1.8-4 4-4 1.4 0 2.6.7 3.3 1.8-1.4-3.2-5.2-4.7-8.5-3.3-1.4.6-2.6 1.8-3.3 3.3C10.2 8 14 6.5 17.3 7.9c-1.4 2.9-4.9 4.2-7.8 2.8-.6-.3-1.1-.7-1.5-1.1v2.3C8 15 10.7 17.8 14 18v-2c-1.2-.2-2-1.4-2-2.6V12z"/>
               <path fill="white" d="M21.6 8c-1.2 0-2.2-.7-2.6-1.8-.4 1-1.4 1.8-2.6 1.8-1.4 0-2.6-1-2.9-2.4-.2.9-1 1.6-1.9 1.8.8.3 1.4.9 1.4 1.8 0 1-.8 1.8-1.8 1.8h-.4c.7.5 1.5.8 2.4.8 1.2 0 2.2-.5 2.9-1.3.7.8 1.7 1.3 2.9 1.3 2.2 0 3.9-1.8 3.9-3.9 0-.3 0-.7-.1-1-.3.6-.9 1-1.6 1z"/>`;
  } else if (category === 'camping' || type === 'camping') {
    // Camping icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>
               <path fill="white" d="M16 5l-5 9h10l-5-9z"/>
               <path fill="white" d="M13 14h6v2h-6z"/>`;
  } else if (type === 'event') {
    // Standard event icon
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>`;
  }

  // Create a div element to hold the SVG
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42">
      ${svgPath}
    </svg>
  `;
  
  // Create custom icon using leaflet Icon
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
    className: `${isLive ? 'live-pulse' : ''} ${isSelected ? 'marker-bounce' : ''}`,
  });
};

// Location data interface
export interface Location {
  lat: number;
  lng: number;
  buildingName?: string;
  floor?: number;
  apartmentNumber?: string;
}

// Live queue information interface
export interface LiveQueue {
  count: number;
  estimatedWaitTime: number; // in minutes
  lastUpdated: string; // ISO date string
  status: 'low' | 'moderate' | 'busy' | 'very-busy';
}

// Event interface for events on the map
export interface Event {
  id: string;
  title: string;
  description?: string;
  location: Location;
  hobby: string;
  hobbyType: string;
  date: string; // ISO date string
  attendees: number;
  eventType?: EventType;
  isEnhanced?: boolean;
  isLive?: boolean;
}

// Place interface for locations on the map
export interface Place {
  id: string;
  title: string;
  description?: string;
  location: Location;
  type: MarkerType;
  category?: PlaceCategory;
  isOwner: boolean;
  action?: PlaceAction;
  liveQueue?: LiveQueue;
  hostedEvents?: {
    id: string;
    title: string;
    hobby: string;
    hobbyType: string;
    eventType?: EventType;
    date: string;
    attendees: number;
  }[];
}

// Combined type for all map markers
export type MapMarkerItem = Event | Place;

// Interface for the markers on the map
interface MapMarkerProps {
  item: MapMarkerItem;
  isSelected?: boolean;
  onClick: (item: MapMarkerItem) => void;
  filterHobby?: string;
}

// Main component for rendering markers on the map
const MapMarker = ({ item, isSelected = false, onClick, filterHobby }: MapMarkerProps) => {
  // Helper function to determine if the marker should be visible based on filter
  const isVisible = () => {
    // If no filter, show all markers
    if (!filterHobby) return true;
    
    // For events, check the hobby
    if ('hobby' in item) {
      return item.hobby === filterHobby;
    }
    
    // For places with hosted events, check if any events match the hobby
    if (item.hostedEvents && item.hostedEvents.length > 0) {
      return item.hostedEvents.some(event => event.hobby === filterHobby);
    }
    
    // Otherwise, show all places
    return true;
  };
  
  // If marker shouldn't be visible due to filters, don't render
  if (!isVisible()) return null;
  
  // Create the appropriate icon based on item type
  const getIcon = () => {
    if ('hobby' in item) {
      // It's an event
      return createMarkerIcon(
        'event', 
        item.hobbyType, 
        isSelected, 
        item.isEnhanced, 
        item.eventType,
        undefined,
        item.isLive
      );
    } else {
      // It's a place
      return createMarkerIcon(
        item.type,
        undefined,
        isSelected,
        false,
        undefined,
        item.category,
        item.liveQueue ? true : false
      );
    }
  };
  
  // Get position for the marker
  const position: [number, number] = [item.location.lat, item.location.lng];
  
  // Render the marker with appropriate popup
  return (
    <Marker 
      position={position} 
      icon={getIcon()} 
      eventHandlers={{
        click: () => onClick(item)
      }}
    >
      <Popup>
        <div className="w-64 p-0">
          <div className="bg-primary text-white p-2 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-sm">{item.title}</h3>
            {'hobby' in item && (
              <Badge variant="outline" className="bg-white/20 text-white text-xs">
                {item.hobby}
              </Badge>
            )}
          </div>
          
          <div className="p-3">
            {item.description && (
              <p className="text-xs text-gray-600 mb-2">{item.description}</p>
            )}
            
            <div className="flex flex-col space-y-1 mb-2">
              <div className="flex items-center text-xs">
                <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                <span>
                  {item.location.buildingName || "Unknown location"}
                  {item.location.floor && `, Floor ${item.location.floor}`}
                  {item.location.apartmentNumber && `, Apt ${item.location.apartmentNumber}`}
                </span>
              </div>
              
              {'hobby' in item && (
                <>
                  <div className="flex items-center text-xs">
                    <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                    <span>{new Date(item.date).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center text-xs">
                    <Users className="h-3 w-3 mr-1 text-gray-500" />
                    <span>{item.attendees} attending</span>
                  </div>
                </>
              )}
              
              {item.liveQueue && (
                <div className="flex items-center justify-between text-xs font-semibold mt-1">
                  <span className="live-indicator">Live Queue</span>
                  <span className={`
                    ${item.liveQueue.status === 'very-busy' ? 'text-red-500' : 
                      item.liveQueue.status === 'busy' ? 'text-orange-500' : 
                      'text-yellow-500'}
                  `}>
                    {item.liveQueue.count} people ({item.liveQueue.estimatedWaitTime} min wait)
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-2">
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <Link to={`${'hobby' in item ? `/events/${item.id}` : `/places/${item.id}`}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;

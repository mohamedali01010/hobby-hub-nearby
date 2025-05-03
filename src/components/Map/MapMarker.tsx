
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin, Home, Store, Gift, Map, Building, UtensilsCrossed, Store as Shop, Music, Book, Camera, Mic, Palette, Utensils, Coffee, Beer, Basketball, Trophy, Heart, Star, Park, Ticket, School, Landmark, Hotel, Theatre, Waves, Tent, Plane } from 'lucide-react';
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
                 <path fill="white" d="M16 12c-2 0-5 1-5 3h10c0-2-3-3-5-3z"/>`;
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
  } else if (type === 'myPlace') {
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/><circle cx="16" cy="10" r="4" fill="white"/>`;
  } else if (type === 'property') {
    svgPath = `<path fill="${color}" d="M3 32h26v10H3z"/><path fill="${color}" d="M16 0L1 15h5v17h20V15h5L16 0z"${liveEffect}/>`;
  } else if (type === 'donation') {
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/><path fill="white" d="M21 10h-4V6h-2v4h-4v2h4v4h2v-4h4z"/>`;
  } else {
    svgPath = `<path fill="${color}" d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"${liveEffect}/>`;
  }
  
  // Add a live pulse animation for live events
  const iconClass = isLive ? 'marker-bounce live-pulse' : isSelected ? 'marker-bounce' : '';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44">${svgPath}</svg>`,
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -44],
    className: iconClass
  });
};

export interface Location {
  lat: number;
  lng: number;
  floor?: number;
  unit?: string;
  buildingName?: string;
}

// New interface for LiveQueue tracking
export interface LiveQueue {
  count: number;
  estimatedWaitTime: number; // minutes
  lastUpdated: string; // ISO date string
  status: 'low' | 'moderate' | 'busy' | 'very-busy';
}

// New interface for hosted event summary (minimal info)
export interface HostedEventSummary {
  id: string;
  title: string;
  hobby: string;
  hobbyType: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
  eventType?: EventType;
  date: string;
  attendees: number;
}

export interface Place {
  id: string;
  title: string;
  description: string;
  location: Location;
  type: MarkerType;
  isOwner: boolean;
  price?: number;
  photos?: string[];
  isEnhanced?: boolean;
  category?: PlaceCategory;
  action?: PlaceAction;
  area?: number;
  broker?: BrokerInfo;
  deliverer?: DelivererInfo;
  liveQueue?: LiveQueue; // Added for tracking live queues
  hostedEvents?: HostedEventSummary[]; // Added for places with multiple events
}

export interface BrokerInfo {
  id: string;
  name: string;
  rating: number;
  commissionsRate: number;
  photoUrl?: string;
}

export interface DelivererInfo {
  id: string;
  name: string;
  rating: number;
  deliveryFee: number;
  photoUrl?: string;
  deliveryArea?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: Location;
  hobby: string;
  hobbyType: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
  date: string;
  attendees: number;
  placeId?: string;
  isEnhanced?: boolean;
  eventType?: EventType;
  photos?: string[];
  videos?: string[];
  isLive?: boolean; // Added to indicate live events
  liveViewers?: number; // Added to track live viewers
  startTime?: string; // ISO string for event start time
  endTime?: string; // ISO string for event end time
  streamUrl?: string; // URL for live stream
}

export type MapMarkerItem = Event | Place;

interface MapMarkerProps {
  item: MapMarkerItem;
  onClick: () => void;
  isSelected?: boolean;
}

// Helper to determine if the item is an Event
const isEvent = (item: MapMarkerItem): item is Event => {
  return 'hobby' in item && 'date' in item;
};

// Helper to determine the event type based on hobby or title
const getEventType = (event: Event): EventType => {
  const title = event.title.toLowerCase();
  const hobby = event.hobby.toLowerCase();
  
  if (hobby === 'football' || title.includes('football') || title.includes('soccer')) {
    return 'football';
  } else if (hobby === 'swimming' || title.includes('swim') || title.includes('pool')) {
    return 'swimming';
  } else if (title.includes('rent') || title.includes('lease') || hobby === 'property') {
    return 'rent';
  } else if (hobby === 'music' || title.includes('concert') || title.includes('music') || title.includes('band')) {
    return 'concert';
  } else if (hobby === 'arts' || title.includes('exhibition') || title.includes('gallery') || title.includes('museum')) {
    return 'exhibition';
  } else if (title.includes('workshop') || title.includes('class') || title.includes('course')) {
    return 'workshop';
  } else if (title.includes('meetup') || title.includes('networking') || title.includes('meet')) {
    return 'meetup';
  } else if (title.includes('party') || title.includes('celebration') || title.includes('birthday')) {
    return 'party';
  } else if (title.includes('festival') || title.includes('fair')) {
    return 'festival';
  } else if (title.includes('conference') || title.includes('convention') || title.includes('summit')) {
    return 'conference';
  } else if (hobby === 'sports' || title.includes('sport') || title.includes('game') || title.includes('match')) {
    return 'sports';
  } else if (title.includes('charity') || title.includes('fundraiser') || title.includes('donation')) {
    return 'charity';
  } else if (title.includes('sale') || title.includes('market') || title.includes('bazaar')) {
    return 'sale';
  }
  
  return 'other';
};

const MapMarker = ({ item, onClick, isSelected = false }: MapMarkerProps) => {
  // Determine marker type and properties
  let markerType: MarkerType = 'event';
  let hobbyType = 'other';
  const isEnhanced = 'isEnhanced' in item ? item.isEnhanced : false;
  let eventType: EventType | undefined;
  let category: PlaceCategory | undefined;
  let isLive = false;
  
  if (isEvent(item)) {
    markerType = 'event';
    hobbyType = item.hobbyType;
    eventType = item.eventType || getEventType(item);
    isLive = item.isLive || false;
  } else {
    markerType = item.type;
    category = item.category;
    // Check if the place has a live queue with busy status
    isLive = item.liveQueue && 
            (item.liveQueue.status === 'busy' || item.liveQueue.status === 'very-busy');
  }
  
  const icon = createMarkerIcon(markerType, hobbyType, isSelected, isEnhanced, eventType, category, isLive);
  
  // Get appropriate icon based on event type or place category for popup
  const getIcon = () => {
    if (isEvent(item)) {
      if (item.eventType === 'football' || item.eventType === 'sports') return <Basketball className="h-4 w-4 mr-2" />;
      if (item.eventType === 'swimming') return <Waves className="h-4 w-4 mr-2" />;
      if (item.eventType === 'rent') return <Home className="h-4 w-4 mr-2" />;
      if (item.eventType === 'concert') return <Music className="h-4 w-4 mr-2" />;
      if (item.eventType === 'exhibition') return <Palette className="h-4 w-4 mr-2" />;
      if (item.eventType === 'workshop') return <Book className="h-4 w-4 mr-2" />;
      if (item.eventType === 'meetup') return <Users className="h-4 w-4 mr-2" />;
      if (item.eventType === 'party') return <Music className="h-4 w-4 mr-2" />;
      if (item.eventType === 'festival') return <Ticket className="h-4 w-4 mr-2" />;
      if (item.eventType === 'conference') return <Mic className="h-4 w-4 mr-2" />;
      if (item.eventType === 'charity') return <Heart className="h-4 w-4 mr-2" />;
      if (item.eventType === 'sale') return <Store className="h-4 w-4 mr-2" />;
      return <Calendar className="h-4 w-4 mr-2" />;
    } else {
      if (item.category === 'flat') return <Building className="h-4 w-4 mr-2" />;
      if (item.category === 'villa') return <Home className="h-4 w-4 mr-2" />;
      if (item.category === 'restaurant') return <UtensilsCrossed className="h-4 w-4 mr-2" />;
      if (item.category === 'shop') return <Shop className="h-4 w-4 mr-2" />;
      if (item.category === 'cafe') return <Coffee className="h-4 w-4 mr-2" />;
      if (item.category === 'bar') return <Beer className="h-4 w-4 mr-2" />;
      if (item.category === 'hotel') return <Hotel className="h-4 w-4 mr-2" />;
      if (item.category === 'school') return <School className="h-4 w-4 mr-2" />;
      if (item.category === 'park') return <Park className="h-4 w-4 mr-2" />;
      if (item.category === 'landmark') return <Landmark className="h-4 w-4 mr-2" />;
      if (item.category === 'theater') return <Theatre className="h-4 w-4 mr-2" />;
      if (item.category === 'beach') return <Waves className="h-4 w-4 mr-2" />;
      if (item.category === 'camping') return <Tent className="h-4 w-4 mr-2" />;
      
      if (item.type === 'myPlace') return <Home className="h-4 w-4 mr-2" />;
      if (item.type === 'property') return <Building className="h-4 w-4 mr-2" />;
      if (item.type === 'donation') return <Gift className="h-4 w-4 mr-2" />;
      
      return <MapPin className="h-4 w-4 mr-2" />;
    }
  };
  
  // Get badge label for place action
  const getActionLabel = (action?: PlaceAction) => {
    switch(action) {
      case 'rent': return 'For Rent';
      case 'sell': return 'For Sale';
      case 'buy': return 'Wanted to Buy';
      default: return '';
    }
  };

  // Get appropriate status color for live queue
  const getQueueStatusColor = (status: 'low' | 'moderate' | 'busy' | 'very-busy') => {
    switch(status) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-amber-100 text-amber-700';
      case 'busy': return 'bg-orange-100 text-orange-700';
      case 'very-busy': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <Marker 
      position={[item.location.lat, item.location.lng]} 
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="min-w-[250px] p-2">
          {/* Marker Type Badge */}
          <div className="flex justify-between items-center mb-2">
            {isEvent(item) ? (
              <Badge variant="outline" className={`bg-primary text-white`}>
                {item.hobby}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-primary text-white">
                {item.category || 
                  (item.type === 'myPlace' ? 'My Place' : 
                  item.type === 'publicPlace' ? 'Public Place' :
                  item.type === 'property' ? 'Property' : 
                  item.type === 'donation' ? 'Donation' : item.type)}
              </Badge>
            )}
            
            {!isEvent(item) && item.action && (
              <Badge variant="secondary">
                {getActionLabel(item.action)}
              </Badge>
            )}
            
            {isEnhanced && (
              <Badge variant="outline" className="bg-amber-500 text-white ml-1">
                Featured
              </Badge>
            )}

            {isLive && (
              <span className="live-indicator ml-1">LIVE</span>
            )}
          </div>
          
          <h3 className="text-sm font-bold mb-1">{item.title}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          
          {/* Specific details based on type */}
          {isEvent(item) ? (
            <div className="flex flex-col space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center">
                {getIcon()}
                <span>{new Date(item.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {item.location.buildingName && `${item.location.buildingName}, `}
                  {item.location.floor && `Floor ${item.location.floor}, `}
                  {item.location.unit && `Unit ${item.location.unit}`}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{item.attendees} attending</span>
              </div>
              
              {/* Live event info */}
              {item.isLive && item.liveViewers && (
                <div className="flex items-center mt-1 bg-red-50 p-1 rounded text-red-600">
                  <span className="font-medium">● LIVE NOW: </span>
                  <span className="ml-1">{item.liveViewers} watching</span>
                </div>
              )}
              
              {/* Preview of photos if available */}
              {item.photos && item.photos.length > 0 && (
                <div className="mt-1">
                  <div className="flex space-x-1">
                    {item.photos.slice(0, 2).map((photo, index) => (
                      <img 
                        key={index}
                        src={photo} 
                        alt={`Event photo ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {item.photos.length > 2 && (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                        +{item.photos.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center">
                {getIcon()}
                <span>
                  {item.location.buildingName && `${item.location.buildingName}, `}
                  {item.location.floor && `Floor ${item.location.floor}, `}
                  {item.location.unit && `Unit ${item.location.unit}`}
                </span>
              </div>
              
              {item.price && (
                <div className="flex items-center font-medium text-sm">
                  ${item.price.toLocaleString()}
                  {item.action === 'rent' && <span className="text-xs ml-1">/month</span>}
                </div>
              )}
              
              {item.area && (
                <div className="flex items-center">
                  <span>{item.area} m²</span>
                </div>
              )}

              {/* Live queue information */}
              {item.liveQueue && (
                <div className={`flex items-center mt-1 p-1 rounded ${getQueueStatusColor(item.liveQueue.status)}`}>
                  <span className="font-medium">Current Queue: </span>
                  <span className="ml-1">{item.liveQueue.count} people</span>
                  <span className="ml-1">({item.liveQueue.estimatedWaitTime} min wait)</span>
                </div>
              )}
              
              {/* Broker information if available */}
              {item.broker && (
                <div className="flex items-center mt-1 bg-gray-50 p-1 rounded">
                  <div className="flex items-center text-xs">
                    <span className="font-medium">Broker: </span>
                    <span className="ml-1">{item.broker.name}</span>
                    <span className="ml-1">({item.broker.rating}★)</span>
                  </div>
                </div>
              )}
              
              {/* Deliverer information if available */}
              {item.deliverer && (
                <div className="flex items-center mt-1 bg-gray-50 p-1 rounded">
                  <div className="flex items-center text-xs">
                    <span className="font-medium">Deliverer: </span>
                    <span className="ml-1">{item.deliverer.name}</span>
                    <span className="ml-1">({item.deliverer.rating}★)</span>
                  </div>
                </div>
              )}
              
              {/* Upcoming events at this place */}
              {item.hostedEvents && item.hostedEvents.length > 0 && (
                <div className="mt-1 border-t pt-1">
                  <span className="font-medium">Upcoming Events:</span>
                  <div className="space-y-1 mt-1">
                    {item.hostedEvents.slice(0, 2).map(event => (
                      <div key={event.id} className="flex justify-between bg-gray-50 p-1 rounded">
                        <span>{event.title}</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {item.hostedEvents.length > 2 && (
                      <div className="text-xs text-center text-primary">
                        +{item.hostedEvents.length - 2} more events
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Preview of photos if available */}
              {item.photos && item.photos.length > 0 && (
                <div className="mt-1">
                  <div className="flex space-x-1">
                    {item.photos.slice(0, 2).map((photo, index) => (
                      <img 
                        key={index}
                        src={photo} 
                        alt={`Place photo ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {item.photos.length > 2 && (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                        +{item.photos.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-3 flex justify-between">
            <Link to={isEvent(item) ? `/events/${item.id}` : `/places/${item.id}`}>
              <Button size="sm" variant="outline">View Details</Button>
            </Link>
            <Button size="sm">
              {isEvent(item) ? (
                item.isLive ? 'Join Live' : 'Join'
              ) : ( 
                item.action === 'rent' ? 'Rent' :
                item.action === 'sell' ? 'Buy' : 
                item.action === 'buy' ? 'Offer' :
                item.category === 'restaurant' ? 'Book' :
                item.category === 'shop' ? 'Shop' :
                'View'
              )}
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;

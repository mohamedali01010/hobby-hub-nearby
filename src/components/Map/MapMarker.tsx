export interface Location {
  lat: number;
  lng: number;
  buildingName?: string;
  floor?: number;
  unit?: string; // Add the unit property
}

export interface BrokerInfo {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
}

export interface DelivererInfo {
  name: string;
  phone?: string;
  vehicle?: string;
  deliveryTime?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string; // Add name property to fix user.name errors
  // Add other user properties as needed
}

export type EventType = 'sports' | 'music' | 'food' | 'tech' | 'arts' | 'other';
export type HobbyType = 'sports' | 'music' | 'food' | 'tech' | 'arts' | 'outdoors';
export type PlaceCategory = 'flat' | 'villa' | 'restaurant' | 'shop' | 'cafe' | 'bar' | 'hotel' | 'school' | 'park';
export type PlaceAction = 'rent' | 'sell' | 'buy';

export interface Event {
  id: string;
  title: string;
  description?: string;
  location: Location;
  hobby: string;
  hobbyType: HobbyType;
  eventType: EventType | string;
  date: string;
  attendees: number;
  isLive?: boolean;
  liveViewers?: number;
  isEnhanced?: boolean;
  placeId?: string;
  photos?: string[]; // Add photos property
  liveQueue?: number; // Add liveQueue property
}

export interface Place {
  id: string;
  title: string;
  description?: string;
  location: Location;
  type: 'property' | 'restaurant' | 'cafe';
  isOwner: boolean;
  category?: PlaceCategory;
  action?: PlaceAction;
  price?: number; // Add price property
  area?: number; // Add area property
  broker?: BrokerInfo; // Add broker property
  deliverer?: DelivererInfo; // Add deliverer property
  isEnhanced?: boolean; // Add isEnhanced property
  photos?: string[]; // Add photos property
}

export type MapMarkerItem = Event | Place;

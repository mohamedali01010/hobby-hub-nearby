import { Place, Event, EventType, PlaceCategory, MarkerType, PlaceAction, Location } from "@/components/Map/MapMarker";

// Helper function to generate a random location within a radius from a center point
export const getRandomLocation = (center: { lat: number; lng: number }, radiusKm: number) => {
  // Earth's radius in km
  const earthRadius = 6371;
  
  // Convert radius from km to radians
  const radiusInRadians = radiusKm / earthRadius;
  
  // Random angle
  const randomAngle = Math.random() * Math.PI * 2;
  
  // Random distance within the radius
  const randomDistance = Math.random() * radiusInRadians;
  
  // Convert center from degrees to radians
  const centerLatRadians = (center.lat * Math.PI) / 180;
  const centerLngRadians = (center.lng * Math.PI) / 180;
  
  // Calculate new position
  const newLatRadians = Math.asin(
    Math.sin(centerLatRadians) * Math.cos(randomDistance) +
    Math.cos(centerLatRadians) * Math.sin(randomDistance) * Math.cos(randomAngle)
  );
  
  const newLngRadians = centerLngRadians + Math.atan2(
    Math.sin(randomAngle) * Math.sin(randomDistance) * Math.cos(centerLatRadians),
    Math.cos(randomDistance) - Math.sin(centerLatRadians) * Math.sin(newLatRadians)
  );
  
  // Convert back to degrees
  const newLat = (newLatRadians * 180) / Math.PI;
  const newLng = (newLngRadians * 180) / Math.PI;
  
  return { lat: newLat, lng: newLng };
};

// Helper to generate a random date within a range
export const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate sample events
export const generateSampleEvents = (count: number, center: Location): Event[] => {
  const events: Event[] = [];
  
  const hobbyTypes = ['sports', 'arts', 'music', 'tech', 'outdoors', 'food', 'other'] as const;
  const eventTypes: EventType[] = ['football', 'swimming', 'rent', 'concert', 'exhibition', 'workshop', 'meetup', 'party', 'festival', 'conference', 'sports', 'charity', 'sale', 'other'];

  const now = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

  // Photo URLs for sample data
  const samplePhotos = [
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2533",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2576",
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=2187",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2370",
    "https://images.unsplash.com/photo-1560090995-01632a28895b?q=80&w=2594",
    "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2940",
    "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2940",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2940",
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2787"
  ];

  const eventTitles = [
    "Local Football Match",
    "Outdoor Yoga Session",
    "Art Exhibition Opening",
    "Tech Meetup",
    "Live Music Concert",
    "Weekend Hiking Trip",
    "Cooking Workshop",
    "Street Photography Walk",
    "Charity 5K Run",
    "Web Development Workshop",
    "Apartment Viewing",
    "Networking Breakfast",
    "Dance Party",
    "Book Club Meeting",
    "Film Festival",
    "Wine Tasting Evening",
    "Startup Pitch Competition",
    "Monthly Board Game Night",
    "Local Market Day",
    "Beach Cleanup",
    "Fitness Boot Camp",
    "Financial Planning Seminar",
    "Language Exchange Meetup",
    "Jazz Night",
    "Bike Tour",
    "Coding Competition",
    "Craft Beer Festival",
    "History Walking Tour",
    "Community Garden Day",
    "Vintage Car Show"
  ];

  // Generate live events (4 of them)
  const liveEventCount = 4;
  for (let i = 0; i < liveEventCount; i++) {
    const hobbyType = hobbyTypes[Math.floor(Math.random() * hobbyTypes.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    let hobby = "";
    switch (hobbyType) {
      case 'sports': hobby = ['Football', 'Basketball', 'Swimming', 'Yoga', 'Running'][Math.floor(Math.random() * 5)]; break;
      case 'arts': hobby = ['Painting', 'Photography', 'Sculpture', 'Drawing', 'Theater'][Math.floor(Math.random() * 5)]; break;
      case 'music': hobby = ['Guitar', 'Piano', 'Singing', 'Concert', 'DJ Set'][Math.floor(Math.random() * 5)]; break;
      case 'tech': hobby = ['Programming', 'AI', 'Web Development', 'Data Science', 'IoT'][Math.floor(Math.random() * 5)]; break;
      case 'outdoors': hobby = ['Hiking', 'Camping', 'Cycling', 'Climbing', 'Surfing'][Math.floor(Math.random() * 5)]; break;
      case 'food': hobby = ['Cooking', 'Baking', 'Wine Tasting', 'Food Tour', 'BBQ'][Math.floor(Math.random() * 5)]; break;
      default: hobby = ['Travel', 'Movies', 'Reading', 'Gaming', 'Gardening'][Math.floor(Math.random() * 5)]; break;
    }

    const title = eventTitles[Math.floor(Math.random() * eventTitles.length)] + " (LIVE)";
    const location = getRandomLocation(center, 5);
    const buildingOptions = ["Central Hall", "Community Center", "Sports Complex", "Arts Center", "Tech Hub", "City Park", "Town Square"];
    
    const photoCount = Math.floor(Math.random() * 4) + 1; // 1-4 photos
    const photos = [];
    for (let p = 0; p < photoCount; p++) {
      photos.push(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
    }

    // Generate start time within the next few hours
    const now = new Date();
    const startTimeDate = new Date(now.getTime() - (Math.floor(Math.random() * 60) + 10) * 60000); // 10-70 minutes ago
    const endTimeDate = new Date(now.getTime() + (Math.floor(Math.random() * 120) + 30) * 60000); // 30-150 minutes from now
    
    events.push({
      id: `live-event-${i+1}`,
      title,
      description: `Join this exciting live ${hobby} event happening right now! Don't miss out on the action.`,
      location: {
        lat: location.lat,
        lng: location.lng,
        buildingName: buildingOptions[Math.floor(Math.random() * buildingOptions.length)]
      },
      hobby,
      hobbyType,
      date: now.toISOString(),
      attendees: Math.floor(Math.random() * 100) + 20, // 20-120 attendees
      eventType,
      isEnhanced: Math.random() > 0.7, // 30% chance to be enhanced
      photos,
      isLive: true,
      liveViewers: Math.floor(Math.random() * 200) + 50, // 50-250 live viewers
      startTime: startTimeDate.toISOString(),
      endTime: endTimeDate.toISOString(),
      streamUrl: `https://example.com/stream/${i+1}`
    });
  }

  // Generate regular upcoming events
  for (let i = liveEventCount; i < count; i++) {
    const hobbyType = hobbyTypes[Math.floor(Math.random() * hobbyTypes.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    let hobby = "";
    switch (hobbyType) {
      case 'sports': hobby = ['Football', 'Basketball', 'Swimming', 'Yoga', 'Running'][Math.floor(Math.random() * 5)]; break;
      case 'arts': hobby = ['Painting', 'Photography', 'Sculpture', 'Drawing', 'Theater'][Math.floor(Math.random() * 5)]; break;
      case 'music': hobby = ['Guitar', 'Piano', 'Singing', 'Concert', 'DJ Set'][Math.floor(Math.random() * 5)]; break;
      case 'tech': hobby = ['Programming', 'AI', 'Web Development', 'Data Science', 'IoT'][Math.floor(Math.random() * 5)]; break;
      case 'outdoors': hobby = ['Hiking', 'Camping', 'Cycling', 'Climbing', 'Surfing'][Math.floor(Math.random() * 5)]; break;
      case 'food': hobby = ['Cooking', 'Baking', 'Wine Tasting', 'Food Tour', 'BBQ'][Math.floor(Math.random() * 5)]; break;
      default: hobby = ['Travel', 'Movies', 'Reading', 'Gaming', 'Gardening'][Math.floor(Math.random() * 5)]; break;
    }

    const title = eventTitles[Math.floor(Math.random() * eventTitles.length)];
    const location = getRandomLocation(center, 8);
    const date = getRandomDate(now, twoMonthsLater);
    const buildingOptions = ["Central Hall", "Community Center", "Sports Complex", "Arts Center", "Tech Hub", "City Park", "Town Square"];
    
    const photoCount = Math.floor(Math.random() * 4) + 1; // 1-4 photos
    const photos = [];
    for (let p = 0; p < photoCount; p++) {
      photos.push(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
    }

    events.push({
      id: `event-${i+1}`,
      title,
      description: `Join us for an exciting ${hobby} event! Whether you're a beginner or expert, everyone is welcome.`,
      location: {
        lat: location.lat,
        lng: location.lng,
        buildingName: buildingOptions[Math.floor(Math.random() * buildingOptions.length)]
      },
      hobby,
      hobbyType,
      date: date.toISOString(),
      attendees: Math.floor(Math.random() * 50) + 5, // 5-55 attendees
      eventType,
      isEnhanced: Math.random() > 0.8, // 20% chance to be enhanced
      photos
    });
  }

  return events;
};

// Generate sample places
export const generateSamplePlaces = (count: number, center: Location): Place[] => {
  const places: Place[] = [];
  
  const types: MarkerType[] = ['property', 'myPlace', 'publicPlace', 'donation'];
  const categories: PlaceCategory[] = ['flat', 'restaurant', 'shop', 'villa', 'cafe', 'bar', 'hotel', 'school', 'park', 'landmark', 'theater', 'beach', 'camping'];
  const actions: PlaceAction[] = ['rent', 'sell', 'buy'];
  
  // Photo URLs for sample data
  const samplePhotos = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2940",
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2787",
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800",
    "https://images.unsplash.com/photo-1493962853295-0fd70327578a?q=80&w=800",
    "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?q=80&w=800",
    "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?q=80&w=800",
    "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?q=80&w=800",
    "https://images.unsplash.com/photo-1518877593221-1f28583780b4?q=80&w=800",
    "https://images.unsplash.com/photo-1439886183900-e79ec0057170?q=80&w=800",
    "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?q=80&w=800"
  ];

  const placeTitles = {
    flat: ["Modern Studio Apartment", "Luxury Downtown Flat", "Cozy One-Bedroom", "Family Apartment", "Penthouse Suite"],
    restaurant: ["Gourmet Kitchen", "Farm-to-Table Restaurant", "Seaside Dining", "Italian Trattoria", "Vegan Cafe"],
    shop: ["Fashion Boutique", "Tech Store", "Artisan Market", "Bookshop", "Organic Grocery"],
    villa: ["Mountain View Villa", "Beach House", "Countryside Estate", "Luxury Villa with Pool", "Historic Manor"],
    cafe: ["Specialty Coffee Shop", "Artisan Bakery", "Tea House", "Breakfast & Brunch", "Study Cafe"],
    bar: ["Craft Cocktail Lounge", "Wine Bar", "Sports Pub", "Rooftop Bar", "Speakeasy"],
    hotel: ["Boutique Hotel", "Luxury Resort", "Business Hotel", "Family Inn", "Historic Hotel"],
    school: ["International Academy", "Language School", "Culinary Institute", "Music Conservatory", "Tech Bootcamp"],
    park: ["Central Park", "Botanical Garden", "Adventure Playground", "Community Green", "Wildlife Reserve"],
    landmark: ["Historic Monument", "Cultural Center", "Museum Complex", "Art Gallery", "Science Center"],
    theater: ["Independent Cinema", "Historic Theater", "IMAX Experience", "Performing Arts Center", "Community Playhouse"],
    beach: ["Private Beach Club", "Public Shoreline", "Surf Spot", "Family Beach", "Sunset Cove"],
    camping: ["Glamping Site", "Wilderness Campground", "Family Campsite", "RV Park", "Adventure Camp"]
  };

  // Generate places with different categories
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const action = type === 'property' ? actions[Math.floor(Math.random() * actions.length)] : undefined;
    const location = getRandomLocation(center, 10);

    // Select a title based on category
    const titleOptions = placeTitles[category as keyof typeof placeTitles] || ["Interesting Place", "Local Spot", "Hidden Gem", "Popular Destination", "Must Visit"];
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];

    // Generate descriptions based on category
    let description = "";
    switch (category) {
      case 'flat':
        description = `A ${['spacious', 'cozy', 'luxurious', 'modern', 'charming'][Math.floor(Math.random() * 5)]} ${['studio', 'one-bedroom', 'two-bedroom', 'penthouse', 'loft'][Math.floor(Math.random() * 5)]} with ${['great views', 'excellent amenities', 'central location', 'modern furnishings', 'recent renovations'][Math.floor(Math.random() * 5)]}.`;
        break;
      case 'restaurant':
        description = `${['Elegant', 'Casual', 'Family-friendly', 'Upscale', 'Cozy'][Math.floor(Math.random() * 5)]} restaurant serving ${['international', 'local', 'fusion', 'seasonal', 'organic'][Math.floor(Math.random() * 5)]} cuisine with ${['outdoor seating', 'a full bar', 'weekend specials', 'live music', 'a renowned chef'][Math.floor(Math.random() * 5)]}.`;
        break;
      case 'shop':
        description = `${['Boutique', 'Specialty', 'Discount', 'Designer', 'Vintage'][Math.floor(Math.random() * 5)]} shop offering ${['unique finds', 'local products', 'premium selections', 'affordable options', 'exclusive collections'][Math.floor(Math.random() * 5)]}.`;
        break;
      default:
        description = `A ${['popular', 'hidden', 'must-visit', 'highly-rated', 'charming'][Math.floor(Math.random() * 5)]} ${category} in the ${['heart of the city', 'quiet suburbs', 'bustling district', 'historic center', 'trendy neighborhood'][Math.floor(Math.random() * 5)]}.`;
    }

    // Generate random floor, unit, building name
    const floor = Math.floor(Math.random() * 30) + 1;
    const unit = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`;
    const buildingOptions = ["Riverside Towers", "Central Plaza", "Parkview Heights", "Metropolitan Building", "Sunset Apartments", "Heritage Complex", "The Residences", "Liberty Square"];
    
    // Generate price for properties
    const price = type === 'property' || category === 'flat' || category === 'villa' ? 
                  (action === 'rent' ? (Math.floor(Math.random() * 3000) + 700) : (Math.floor(Math.random() * 900000) + 100000)) : 
                  undefined;
    
    // Generate area for properties
    const area = type === 'property' || category === 'flat' || category === 'villa' ? 
                 Math.floor(Math.random() * 200) + 40 : 
                 undefined;

    // Generate photos
    const photoCount = Math.floor(Math.random() * 4) + 1; // 1-4 photos
    const photos = [];
    for (let p = 0; p < photoCount; p++) {
      photos.push(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
    }

    // Generate broker info for properties
    const broker = (type === 'property' || category === 'flat' || category === 'villa') && Math.random() > 0.5 ? 
                  {
                    id: `broker-${Math.floor(Math.random() * 1000)}`,
                    name: `${['John', 'Sarah', 'Michael', 'Emma', 'David'][Math.floor(Math.random() * 5)]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0
                    commissionsRate: parseFloat((Math.random() * 3 + 2).toFixed(1)), // 2.0-5.0%
                    photoUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
                  } : undefined;

    // Generate live queue for places that would have them
    const liveQueue = (category === 'restaurant' || category === 'cafe' || category === 'bar' || category === 'shop') && Math.random() > 0.6 ? 
                      {
                        count: Math.floor(Math.random() * 50),
                        estimatedWaitTime: Math.floor(Math.random() * 60) + 5, // 5-65 minutes
                        lastUpdated: new Date().toISOString(),
                        status: ['low', 'moderate', 'busy', 'very-busy'][Math.floor(Math.random() * 4)] as 'low' | 'moderate' | 'busy' | 'very-busy'
                      } : undefined;

    // Generate hosted events for some places
    const hostedEvents = Math.random() > 0.7 ? 
                         Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
                           const hobbyTypes = ['sports', 'arts', 'music', 'tech', 'outdoors', 'food', 'other'] as const;
                           const hobbyType = hobbyTypes[Math.floor(Math.random() * hobbyTypes.length)];
                           
                           let hobby = "";
                           switch (hobbyType) {
                             case 'sports': hobby = ['Football', 'Basketball', 'Swimming', 'Yoga', 'Running'][Math.floor(Math.random() * 5)]; break;
                             case 'arts': hobby = ['Painting', 'Photography', 'Sculpture', 'Drawing', 'Theater'][Math.floor(Math.random() * 5)]; break;
                             case 'music': hobby = ['Guitar', 'Piano', 'Singing', 'Concert', 'DJ Set'][Math.floor(Math.random() * 5)]; break;
                             case 'tech': hobby = ['Programming', 'AI', 'Web Development', 'Data Science', 'IoT'][Math.floor(Math.random() * 5)]; break;
                             case 'outdoors': hobby = ['Hiking', 'Camping', 'Cycling', 'Climbing', 'Surfing'][Math.floor(Math.random() * 5)]; break;
                             case 'food': hobby = ['Cooking', 'Baking', 'Wine Tasting', 'Food Tour', 'BBQ'][Math.floor(Math.random() * 5)]; break;
                             default: hobby = ['Travel', 'Movies', 'Reading', 'Gaming', 'Gardening'][Math.floor(Math.random() * 5)]; break;
                           }
                           
                           const eventDate = new Date();
                           eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-15 days from now
                           
                           return {
                             id: `hosted-event-${i}-place-${i}`,
                             title: `${hobby} at ${title}`,
                             hobby,
                             hobbyType,
                             date: eventDate.toISOString(),
                             attendees: Math.floor(Math.random() * 30) + 5 // 5-35 attendees
                           };
                         }) : undefined;

    places.push({
      id: `place-${i+1}`,
      title,
      description,
      location: {
        lat: location.lat,
        lng: location.lng,
        floor: Math.random() > 0.5 ? floor : undefined,
        unit: Math.random() > 0.6 ? unit : undefined,
        buildingName: Math.random() > 0.4 ? buildingOptions[Math.floor(Math.random() * buildingOptions.length)] : undefined
      },
      type,
      isOwner: Math.random() > 0.7, // 30% chance to be owned by user
      price,
      area,
      category,
      action,
      photos,
      broker,
      isEnhanced: Math.random() > 0.8, // 20% chance to be enhanced
      liveQueue,
      hostedEvents
    });
  }

  return places;
};

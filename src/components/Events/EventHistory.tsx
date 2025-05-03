
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarCheck, CalendarClock, Clock, MapPin, Users } from 'lucide-react';
import { Event } from '@/components/Map/MapMarker';

interface EventHistoryProps {
  userEvents: Event[];
  placeEvents: Event[];
}

const EventHistory: React.FC<EventHistoryProps> = ({ userEvents, placeEvents }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event History</CardTitle>
        <CardDescription>Past events you've attended or that happened at this location</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Your Events</TabsTrigger>
            <TabsTrigger value="place">Place Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <ScrollArea className="h-[300px]">
              {userEvents.length > 0 ? (
                <div className="space-y-3 p-1">
                  {userEvents.map(event => (
                    <EventHistoryCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                  <CalendarCheck className="h-10 w-10 mb-2" />
                  <p>No past events found</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="place">
            <ScrollArea className="h-[300px]">
              {placeEvents.length > 0 ? (
                <div className="space-y-3 p-1">
                  {placeEvents.map(event => (
                    <EventHistoryCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                  <MapPin className="h-10 w-10 mb-2" />
                  <p>No past events at this location</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface EventHistoryCardProps {
  event: Event;
}

const EventHistoryCard: React.FC<EventHistoryCardProps> = ({ event }) => {
  const eventDate = new Date(event.date);
  
  return (
    <Card className="p-3 border rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-sm">{event.title}</h4>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            <span>{eventDate.toLocaleDateString()}</span>
          </div>
          {event.location.buildingName && (
            <div className="flex items-center text-xs text-gray-500 mt-0.5">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{event.location.buildingName}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
            {event.hobby}
          </span>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Users className="h-3 w-3 mr-1" />
            <span>{event.attendees}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventHistory;

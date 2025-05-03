import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Building, UtensilsCrossed, Store, Home, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Checkbox
} from '@/components/ui/checkbox';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from '@/components/ui/use-toast';
import { Place, PlaceCategory, PlaceAction, Location } from '@/components/Map/MapMarker';

// Form schema
const placeFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  // Updated to match the PlaceCategory type in MapMarker.tsx
  category: z.enum(['flat', 'villa', 'restaurant', 'shop', 'cafe', 'bar', 'hotel', 'school', 'park', 'landmark', 'theater', 'beach', 'camping'] as const, {
    required_error: "You need to select a category.",
  }),
  action: z.enum(['rent', 'sell', 'buy'], {
    required_error: "You need to select an action.",
  }),
  buildingName: z.string().optional(),
  floor: z.coerce.number().optional(),
  unit: z.string().optional(),
  price: z.coerce.number().min(1, {
    message: "Price must be greater than 0.",
  }),
  area: z.coerce.number().optional(),
  hasBroker: z.boolean().default(false),
  needsDeliverer: z.boolean().default(false),
  useCurrentLocation: z.boolean().default(true),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type PlaceFormValues = z.infer<typeof placeFormSchema>;

interface PlaceFormProps {
  onSubmit: (data: Place) => void;
  initialData?: Partial<Place>;
}

const PlaceForm = ({ onSubmit, initialData }: PlaceFormProps) => {
  const { location } = useGeolocation();
  const [images, setImages] = useState<File[]>([]);
  
  // Initialize form
  const form = useForm<PlaceFormValues>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: (initialData?.category as PlaceCategory) || 'flat',
      action: (initialData?.action as PlaceAction) || 'rent',
      buildingName: initialData?.location?.buildingName || '',
      floor: initialData?.location?.floor || undefined,
      unit: initialData?.location?.unit || '',
      price: initialData?.price || 0,
      area: initialData?.area || undefined,
      hasBroker: !!initialData?.broker,
      needsDeliverer: !!initialData?.deliverer,
      useCurrentLocation: true,
      latitude: initialData?.location?.lat,
      longitude: initialData?.location?.lng,
    },
  });
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  // Watch form values
  const category = form.watch('category');
  const action = form.watch('action');
  const useCurrentLocation = form.watch('useCurrentLocation');
  const hasBroker = form.watch('hasBroker');
  const needsDeliverer = form.watch('needsDeliverer');

  // Handle form submission
  const handleFormSubmit = (data: PlaceFormValues) => {
    try {
      // Prepare location data
      let locationData: Location = {
        lat: data.latitude || 0,
        lng: data.longitude || 0,
      };
      
      // Use current location if selected
      if (data.useCurrentLocation && location) {
        locationData = {
          lat: location.lat,
          lng: location.lng,
        };
      }
      
      // Add optional location details
      if (data.buildingName) {
        locationData.buildingName = data.buildingName;
      }
      
      if (data.floor) {
        locationData.floor = data.floor;
      }
      
      if (data.unit) {
        locationData.unit = data.unit;
      }
      
      // Prepare broker data if needed
      const broker = data.hasBroker ? {
        id: initialData?.broker?.id || `broker-${Date.now()}`,
        name: initialData?.broker?.name || 'Available broker',
        rating: initialData?.broker?.rating || 4.5,
        commissionsRate: initialData?.broker?.commissionsRate || 5,
      } : undefined;
      
      // Prepare deliverer data if needed
      const deliverer = data.needsDeliverer ? {
        id: initialData?.deliverer?.id || `deliverer-${Date.now()}`,
        name: initialData?.deliverer?.name || 'Available deliverer',
        rating: initialData?.deliverer?.rating || 4.5,
        deliveryFee: initialData?.deliverer?.deliveryFee || 10,
      } : undefined;
      
      // Prepare full place data
      const placeData: Place = {
        id: initialData?.id || `place-${Date.now()}`,
        title: data.title,
        description: data.description,
        location: locationData,
        type: 'property', // Default type
        isOwner: true,
        category: data.category,
        action: data.action,
        price: data.price,
        area: data.area,
        photos: images.map(img => URL.createObjectURL(img)),
        broker,
        deliverer,
      };
      
      onSubmit(placeData);
    } catch (error) {
      console.error("Error creating place:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your place" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your place..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="flat">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Flat</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="villa">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-purple-500" />
                        <span>Villa</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="restaurant">
                      <div className="flex items-center">
                        <UtensilsCrossed className="h-4 w-4 mr-2 text-amber-500" />
                        <span>Restaurant</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="shop">
                      <div className="flex items-center">
                        <Store className="h-4 w-4 mr-2 text-green-500" />
                        <span>Shop</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cafe">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>Cafe</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bar">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        <span>Bar</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hotel">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                        <span>Hotel</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="school">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span>School</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="park">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        <span>Park</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="landmark">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Landmark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="theater">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Theater</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="beach">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Beach</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="camping">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Camping</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="sell">For Sale</SelectItem>
                    <SelectItem value="buy">Want to Buy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Price and Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price {action === 'rent' && '(per month)'}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input type="number" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (in m²)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="number" {...field} />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">m²</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Location fields */}
        <Card className="p-4 space-y-4">
          <h3 className="font-medium">Location Details</h3>
          
          <FormField
            control={form.control}
            name="useCurrentLocation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Use my current location
                  </FormLabel>
                  <FormDescription>
                    This will use your device's GPS coordinates.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {!useCurrentLocation && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="e.g. 40.7128" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="e.g. -74.0060" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <FormField
            control={form.control}
            name="buildingName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Sunrise Tower" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. A2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
        
        {/* Photo upload */}
        <div className="space-y-2">
          <FormLabel>Photos</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <label className="cursor-pointer flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                Click to upload photos or drag and drop
              </span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                multiple 
                onChange={handleImageUpload}
              />
            </label>
          </div>
          {images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 overflow-hidden rounded-md">
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={`Preview ${idx}`} 
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Broker and Deliverer options */}
        <Card className="p-4 space-y-4">
          <h3 className="font-medium">Services</h3>
          
          <FormField
            control={form.control}
            name="hasBroker"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Use a broker
                  </FormLabel>
                  <FormDescription>
                    A broker will help facilitate the transaction for a small commission.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="needsDeliverer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Need delivery service
                  </FormLabel>
                  <FormDescription>
                    A deliverer can help with delivery of goods or services related to this place.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </Card>
        
        <Button type="submit" className="w-full">
          {initialData?.id ? 'Update Place' : 'Create Place'}
        </Button>
      </form>
    </Form>
  );
};

export default PlaceForm;

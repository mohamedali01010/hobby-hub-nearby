
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Home, Store, Gift, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from '@/components/ui/use-toast';
import { MarkerType } from '../Map/MapMarker';

// Import the Location interface from MapMarker to ensure consistency
import { Location } from '../Map/MapMarker';

// Form schema
const placeFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.enum(['myPlace', 'publicPlace', 'property', 'donation'], {
    required_error: "You need to select a place type.",
  }),
  buildingName: z.string().optional(),
  floor: z.coerce.number().optional(),
  unit: z.string().optional(),
  price: z.coerce.number().optional(),
  isPublic: z.boolean().default(false),
  isEnhanced: z.boolean().default(false),
  useCurrentLocation: z.boolean().default(true),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type PlaceFormValues = z.infer<typeof placeFormSchema>;

interface PlaceFormProps {
  onSubmit: (data: any) => void;
  initialData?: PlaceFormValues;
}

const PlaceForm = ({ onSubmit, initialData }: PlaceFormProps) => {
  const { location } = useGeolocation();
  const [images, setImages] = useState<File[]>([]);
  
  // Initialize form
  const form = useForm<PlaceFormValues>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      type: 'myPlace',
      isPublic: false,
      isEnhanced: false,
      useCurrentLocation: true,
    },
  });
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
    }
  };

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
      
      // Prepare full data object
      const placeData = {
        ...data,
        id: initialData?.title ? initialData.title : `place-${Date.now()}`,
        location: locationData,
        isOwner: data.type === 'myPlace',
        photos: images.map(img => URL.createObjectURL(img)), // This would be replaced with actual upload logic
      };
      
      onSubmit(placeData);
      toast({
        title: initialData ? "Place updated" : "Place created",
        description: `${placeData.title} has been successfully ${initialData ? "updated" : "added"} to the map.`,
      });
    } catch (error) {
      console.error("Error creating place:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show different fields based on place type
  const placeType = form.watch('type');
  const useCurrentLocation = form.watch('useCurrentLocation');

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
              <FormDescription>
                This will be displayed on the map and in listings.
              </FormDescription>
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
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a place type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="myPlace">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2 text-blue-500" />
                      <span>My Place</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="publicPlace">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Public Place</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="property">
                    <div className="flex items-center">
                      <Store className="h-4 w-4 mr-2 text-green-500" />
                      <span>Property (For Sale/Rent)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="donation">
                    <div className="flex items-center">
                      <Gift className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Donation</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Location fields */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-medium text-sm">Location Details</h3>
          
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
        </div>
        
        {/* Property-specific fields */}
        {placeType === 'property' && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 250000" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the sale price or monthly rent.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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
        
        {/* Enhancement options */}
        <FormField
          control={form.control}
          name="isEnhanced"
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
                  Enhance this place
                </FormLabel>
                <FormDescription>
                  Enhanced places get special visual effects on the map and appear higher in search results.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isPublic"
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
                  Make this place public
                </FormLabel>
                <FormDescription>
                  Public places can be seen by everyone. Private places are only visible to you and people you invite.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          {initialData ? 'Update Place' : 'Create Place'}
        </Button>
      </form>
    </Form>
  );
};

export default PlaceForm;

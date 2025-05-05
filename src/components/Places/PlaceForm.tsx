
import { useState } from 'react';
import { Place, PlaceCategory, PlaceAction, BrokerInfo, DelivererInfo } from '@/components/Map/MapMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, DollarSign, SquareFeet, Briefcase, Truck } from 'lucide-react';

interface PlaceFormProps {
  initialData?: Partial<Place>;
  onSubmit: (place: Place) => void;
}

const PlaceForm = ({ initialData, onSubmit }: PlaceFormProps) => {
  const [formData, setFormData] = useState<Partial<Place>>(initialData || {
    id: `place-${Date.now()}`,
    title: '',
    description: '',
    location: {
      lat: 0,
      lng: 0,
      buildingName: '',
      floor: undefined,
      unit: ''
    },
    type: 'property',
    isOwner: true,
    category: undefined,
    action: undefined,
    price: undefined,
    area: undefined
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle location properties separately
    if (name.startsWith('location.')) {
      const locationProp = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location!,
          [locationProp]: value
        }
      });
    } else if (name === 'price' || name === 'area' || name === 'floor') {
      // Convert numeric values
      setFormData({
        ...formData,
        [name]: value ? Number(value) : undefined
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'category') {
      setFormData({
        ...formData,
        [name]: value as PlaceCategory
      });
    } else if (name === 'action') {
      setFormData({
        ...formData,
        [name]: value as PlaceAction
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare complete data with required fields
    const completeData: Place = {
      id: formData.id || `place-${Date.now()}`,
      title: formData.title || 'Unnamed Place',
      description: formData.description,
      location: {
        lat: formData.location?.lat || 0,
        lng: formData.location?.lng || 0,
        buildingName: formData.location?.buildingName,
        floor: formData.location?.floor,
        unit: formData.location?.unit
      },
      type: formData.type || 'property',
      isOwner: formData.isOwner !== undefined ? formData.isOwner : true,
      category: formData.category,
      action: formData.action,
      price: formData.price,
      area: formData.area,
      broker: formData.broker,
      deliverer: formData.deliverer
    };
    
    onSubmit(completeData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Basic Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Enter place title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Enter place description"
            className="h-20"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="park">Park</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select 
              value={formData.action} 
              onValueChange={(value) => handleSelectChange('action', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="sell">For Sale</SelectItem>
                <SelectItem value="buy">Wanted to Buy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Location</h3>
        
        <div className="space-y-2">
          <Label htmlFor="location.buildingName">Building Name</Label>
          <Input 
            id="location.buildingName"
            name="location.buildingName"
            value={formData.location?.buildingName || ''}
            onChange={handleChange}
            placeholder="Enter building name"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location.floor">Floor</Label>
            <Input 
              id="location.floor"
              name="location.floor"
              type="number"
              value={formData.location?.floor || ''}
              onChange={handleChange}
              placeholder="Enter floor number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location.unit">Unit/Apartment Number</Label>
            <Input 
              id="location.unit"
              name="location.unit"
              value={formData.location?.unit || ''}
              onChange={handleChange}
              placeholder="Enter unit number"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Property Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>Price</span>
              </div>
            </Label>
            <Input 
              id="price"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area">
              <div className="flex items-center">
                <SquareFeet className="h-4 w-4 mr-1" />
                <span>Area (m²)</span>
              </div>
            </Label>
            <Input 
              id="area"
              name="area"
              type="number"
              value={formData.area || ''}
              onChange={handleChange}
              placeholder="Enter area in m²"
            />
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        {initialData?.id ? 'Update Place' : 'Add Place'}
      </Button>
    </form>
  );
};

export default PlaceForm;

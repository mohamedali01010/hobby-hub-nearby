
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { useGeolocation } from '@/hooks/useGeolocation';
import HobbyTag from '@/components/UI/HobbyTag';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Sample list of available hobbies
const availableHobbies = [
  { id: '1', name: 'Football', type: 'sports' as const },
  { id: '2', name: 'Basketball', type: 'sports' as const },
  { id: '3', name: 'Tennis', type: 'sports' as const },
  { id: '4', name: 'Swimming', type: 'sports' as const },
  { id: '5', name: 'Photography', type: 'arts' as const },
  { id: '6', name: 'Painting', type: 'arts' as const },
  { id: '7', name: 'Drawing', type: 'arts' as const },
  { id: '8', name: 'Guitar', type: 'music' as const },
  { id: '9', name: 'Piano', type: 'music' as const },
  { id: '10', name: 'Singing', type: 'music' as const },
  { id: '11', name: 'Programming', type: 'tech' as const },
  { id: '12', name: 'Gaming', type: 'tech' as const },
  { id: '13', name: 'Web Design', type: 'tech' as const },
  { id: '14', name: 'Hiking', type: 'outdoors' as const },
  { id: '15', name: 'Camping', type: 'outdoors' as const },
  { id: '16', name: 'Cycling', type: 'outdoors' as const },
  { id: '17', name: 'Cooking', type: 'food' as const },
  { id: '18', name: 'Baking', type: 'food' as const },
  { id: '19', name: 'Wine Tasting', type: 'food' as const },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState<typeof availableHobbies>([]);
  const { location } = useGeolocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const toggleHobby = (hobby: typeof availableHobbies[0]) => {
    if (selectedHobbies.find(h => h.id === hobby.id)) {
      setSelectedHobbies(selectedHobbies.filter(h => h.id !== hobby.id));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedHobbies.length === 0) {
      toast({
        title: 'Select hobbies',
        description: 'Please select at least one hobby',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
        hobbies: selectedHobbies,
        location: location ? {
          lat: location.lat,
          lng: location.lng,
          address: 'Current location' // In a real app, this would be reverse geocoded
        } : undefined
      });
      
      toast({
        title: 'Registration successful',
        description: 'Welcome to Same Hobbies!',
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="text-gray-600 mt-2">Join the Same Hobbies community</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Select your hobbies</FormLabel>
                  <FormDescription>
                    Choose at least one hobby to find events and people with similar interests
                  </FormDescription>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                    {availableHobbies.map(hobby => (
                      <div key={hobby.id} onClick={() => toggleHobby(hobby)}>
                        <HobbyTag
                          name={hobby.name}
                          type={hobby.type}
                          selected={!!selectedHobbies.find(h => h.id === hobby.id)}
                          onClick={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                  {selectedHobbies.length === 0 && (
                    <p className="text-sm text-destructive">Please select at least one hobby</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Your location</FormLabel>
                  <FormDescription>
                    {location ? 
                      `Location detected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 
                      'Allow location access to find events near you'
                    }
                  </FormDescription>
                  {!location && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigator.geolocation.getCurrentPosition(
                          () => {}, 
                          () => {
                            toast({
                              title: 'Location access denied',
                              description: 'Please enable location access to use all features',
                              variant: 'destructive',
                            });
                          }
                        );
                      }}
                    >
                      Enable Location
                    </Button>
                  )}
                </div>
                
                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Register"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;

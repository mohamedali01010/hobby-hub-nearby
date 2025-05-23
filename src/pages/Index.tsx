
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map as MapIcon, Users, CalendarPlus, Search, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import MapView from '@/components/Map/MapView';
import HobbyTag from '@/components/UI/HobbyTag';
import { useToast } from '@/hooks/use-toast';

// Sample featured hobbies
const featuredHobbies = [
  { name: 'Football', type: 'sports' as const },
  { name: 'Photography', type: 'arts' as const },
  { name: 'Guitar', type: 'music' as const },
  { name: 'Hiking', type: 'outdoors' as const },
  { name: 'Cooking', type: 'food' as const },
  { name: 'Programming', type: 'tech' as const },
];

// Sample testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    hobby: "Photography",
    text: "I've met amazing fellow photographers through Same Hobbies. We now organize weekly photo walks!",
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 2,
    name: "Mike T.",
    hobby: "Football",
    text: "Found a local football team to join within days. The app made it super easy to connect.",
    avatar: "https://i.pravatar.cc/100?img=2"
  },
  {
    id: 3,
    name: "Priya R.",
    hobby: "Cooking",
    text: "I host monthly cooking meetups with people I met on Same Hobbies. It's been life-changing!",
    avatar: "https://i.pravatar.cc/100?img=3"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Hobby search",
        description: `Searching for "${searchQuery}" activities near you`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 flex flex-col items-center overflow-hidden">
        {/* Background Map */}
        <div className="absolute inset-0 z-0 opacity-20">
          <MapView height="h-full" showControls={false} />
        </div>
        
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-white to-secondary/10 animate-gradient"></div>
        
        {/* Content */}
        <div className={`container relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-10 text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight">
            Find Friends with <span className="text-secondary">Same Hobbies</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover local events and connect with people who share your passions.
            Whether it's sports, arts, or tech - find your community nearby.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search for a hobby or activity..."
                  className="pl-10 py-6 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button type="submit" className="rounded-full">
                    Find Events
                  </Button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Featured Hobbies */}
          <div className="mt-8">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Popular Hobbies:</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {featuredHobbies.map((hobby, index) => (
                <HobbyTag key={index} name={hobby.name} type={hobby.type} />
              ))}
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Join the Community
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <MapIcon className="mr-2 h-5 w-5" />
                Browse Events Map
              </Button>
            </Link>
          </div>
          
          {/* Animated down arrow */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowRight className="h-8 w-8 text-primary transform rotate-90" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center transform transition-all hover:scale-105 duration-300">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <MapIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Share Your Location</h3>
              <p className="text-gray-600">
                Set your location and find hobby meetups and users near you. Discover
                hidden spots perfect for your activities.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center transform transition-all hover:scale-105 duration-300">
              <div className="mb-4 rounded-full bg-secondary/10 p-4">
                <CalendarPlus className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create & Join Events</h3>
              <p className="text-gray-600">
                Host your own meetups or join existing ones. From sports games to
                art workshops, there's always something happening.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center transform transition-all hover:scale-105 duration-300">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with People</h3>
              <p className="text-gray-600">
                Meet people who share your interests. Build a network of friends
                and enjoy your hobbies together.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Community Says</h2>
          
          <div className="max-w-3xl mx-auto relative h-64">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-1000 flex flex-col items-center bg-white p-6 rounded-lg shadow-lg
                  ${index === currentTestimonial ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4" 
                  />
                  <div className="text-left">
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <HobbyTag name={testimonial.hobby} type="other" />
                  </div>
                </div>
                <p className="text-gray-600 italic text-center">"{testimonial.text}"</p>
              </div>
            ))}
            
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshot Preview (mockup) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Explore Events on the Map</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our interactive map shows you all the hobby events happening near you.
                Filter by activity type, date, or distance to find exactly what you're looking for.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>See events and places near you</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Filter by hobby, distance, and date</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Create your own events and invite others</span>
                </li>
              </ul>
              <Link to="/register">
                <Button size="lg" className="animate-pulse">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden border transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gray-100 py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="h-64 md:h-96 bg-gray-200 relative">
                  <MapView height="h-full" showControls={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to find your community?</h2>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of hobby enthusiasts who are already connecting and
            sharing experiences through Same Hobbies.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 pulse-animation">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  hobbies: Array<{
    id: string;
    name: string;
    type: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
  }>;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegistrationData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegistrationData {
  email: string;
  username: string;
  password: string;
  avatar?: string;
  hobbies: Array<{
    id: string;
    name: string;
    type: 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';
  }>;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token/user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('samehobbies_user');
        const token = localStorage.getItem('samehobbies_token');

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        localStorage.removeItem('samehobbies_user');
        localStorage.removeItem('samehobbies_token');
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      const mockUser: User = {
        id: '123',
        email,
        username: email.split('@')[0],
        avatar: 'https://i.pravatar.cc/300',
        hobbies: [
          { id: '1', name: 'Football', type: 'sports' },
          { id: '2', name: 'Photography', type: 'arts' }
        ],
        location: {
          lat: 51.505,
          lng: -0.09,
          address: 'London, UK'
        }
      };

      // Store user info and token in localStorage
      localStorage.setItem('samehobbies_user', JSON.stringify(mockUser));
      localStorage.setItem('samehobbies_token', 'mock_token_123456');
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegistrationData) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar || 'https://i.pravatar.cc/300',
        hobbies: userData.hobbies,
        location: userData.location
      };

      // Store user info and token in localStorage
      localStorage.setItem('samehobbies_user', JSON.stringify(mockUser));
      localStorage.setItem('samehobbies_token', 'mock_token_' + Math.random());
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('samehobbies_user');
    localStorage.removeItem('samehobbies_token');
    setUser(null);
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo, just update local storage
      const updatedUser = { ...user, ...userData } as User;
      localStorage.setItem('samehobbies_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error('Failed to update user information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

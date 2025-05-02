
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Places from './pages/Places';
import Events from './pages/Events'; // Add the new Events page
import PlacePage from './pages/PlacePage';
import EventDetails from './pages/EventDetails';
import PlaceDetails from './pages/PlaceDetails';
import Index from './pages/Index';

import { Toaster } from '@/components/ui/toaster';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/browse" element={<PlacePage />} />
        <Route path="/places/:id" element={<PlaceDetails />} />
        <Route path="/events" element={<Events />} /> {/* Add the new Events route */}
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;

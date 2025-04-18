
import { Link } from "react-router-dom";
import { Map, Mail, GitHub, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and tagline */}
          <div>
            <div className="flex items-center">
              <Map className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold text-primary">
                Same<span className="text-secondary">Hobbies</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Connecting people through shared hobbies and activities in your local area.
              Discover events, meet new friends, and explore together.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-base font-medium text-gray-900">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-500 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-base font-medium text-gray-900">Connect With Us</h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <GitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Have feedback? We'd love to hear from you!
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} SameHobbies. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">Made with ❤️ for hobby enthusiasts</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

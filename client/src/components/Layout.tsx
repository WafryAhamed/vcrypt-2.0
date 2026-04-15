import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CarIcon,
  HomeIcon,
  ClipboardCheckIcon,
  SearchIcon,
  ArrowLeftRightIcon,
  UserIcon,
  LogOutIcon,
  ChevronRightIcon,
  SettingsIcon } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import ChatBot from './ChatBot';
const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-900 dark:to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
              <CarIcon size={24} className="text-blue-700 dark:text-blue-400" />
            </div>
            <span className="text-xl font-bold">
              Blockchain Transportation Registry
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ?
            <div className="flex items-center space-x-4">
                <span className="hidden md:flex items-center space-x-2 bg-blue-600/40 dark:bg-blue-800/40 py-1 px-3 rounded-full text-sm">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  <span>
                    {userRole === 'admin' && 'Admin'}
                    {userRole === 'officer' && 'Officer'}
                    {userRole === 'owner' && 'Vehicle Owner'}
                  </span>
                </span>
                <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm bg-red-600 hover:bg-red-700 px-3 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg">
                
                  <LogOutIcon size={16} />
                  <span>Logout</span>
                </button>
              </div> :

            <Link
              to="/login"
              className="flex items-center space-x-1 text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg">
              
                <UserIcon size={16} />
                <span>Login</span>
              </Link>
            }
          </div>
        </div>
      </header>
      {/* Navigation */}
      {isAuthenticated &&
      <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-1">
            <div className="flex space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide">
              <NavLink
              to="/"
              icon={<HomeIcon size={18} />}
              label="Home"
              active={isActive('/')} />
            
              <NavLink
              to="/dashboard"
              icon={<UserIcon size={18} />}
              label="Dashboard"
              active={isActive('/dashboard')} />
            
              <NavLink
              to="/register"
              icon={<ClipboardCheckIcon size={18} />}
              label="Register Vehicle"
              active={isActive('/register')} />
            
              <NavLink
              to="/verify"
              icon={<SearchIcon size={18} />}
              label="Verify Ownership"
              active={isActive('/verify')} />
            
              <NavLink
              to="/transfer"
              icon={<ArrowLeftRightIcon size={18} />}
              label="Transfer Ownership"
              active={isActive('/transfer')} />
            
            </div>
          </div>
        </nav>
      }
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Page path indicator */}
        {isAuthenticated && location.pathname !== '/' &&
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link
            to="/"
            className="hover:text-blue-600 dark:hover:text-blue-400">
            
              Home
            </Link>
            <ChevronRightIcon size={14} />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {location.pathname.substring(1).charAt(0).toUpperCase() +
            location.pathname.substring(2)}
            </span>
          </div>
        }
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white py-8 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <CarIcon size={20} className="mr-2 text-blue-400" />
                Blockchain Transportation Registration Authority
              </h3>
              <p className="text-sm text-gray-400">
                Secure, transparent vehicle registration on blockchain
                technology
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-white transition-colors">
                    
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/verify"
                    className="hover:text-white transition-colors">
                    
                    Verify Vehicle
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium mb-3">Contact</h4>
              <p className="text-sm text-gray-400 mb-2">
                Have questions? Contact our support team.
              </p>
              <button className="bg-blue-700 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-full transition-colors">
                Contact Support
              </button>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} BTRA. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors">
                
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors">
                
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Chat Bot */}
      <ChatBot />
    </div>);

};
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}
const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-3 rounded-lg transition-all duration-200 whitespace-nowrap
        ${active ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
      
      {icon}
      <span>{label}</span>
    </Link>);

};
export default Layout;
import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircleIcon,
  ShieldIcon,
  SearchIcon,
  ArrowRightLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  LockIcon,
  BarChartIcon } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-900 dark:to-blue-800 text-white py-16 px-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Blockchain Transportation Registration Authority
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Secure, transparent vehicle registration and ownership tracking
            powered by blockchain technology
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated ?
            <Link
              to="/login"
              className="inline-flex items-center bg-white text-blue-800 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
              
                Get Started
                <ChevronRightIcon size={20} className="ml-1" />
              </Link> :

            <Link
              to="/dashboard"
              className="inline-flex items-center bg-white text-blue-800 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
              
                Go to Dashboard
                <ChevronRightIcon size={20} className="ml-1" />
              </Link>
            }
            <Link
              to="/verify"
              className="inline-flex items-center bg-blue-700 dark:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800 border border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
              
              Verify a Vehicle
              <SearchIcon size={20} className="ml-1" />
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="hidden md:block absolute -bottom-6 -left-12 w-40 h-40 bg-blue-500 dark:bg-blue-700 opacity-20 rounded-full"></div>
        <div className="hidden md:block absolute -top-10 -right-10 w-32 h-32 bg-blue-500 dark:bg-blue-700 opacity-20 rounded-full"></div>
      </section>
      {/* Stats Section */}
      <section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              15K+
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Vehicles Registered
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              99%
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Verification Accuracy
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              5K+
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Daily Transactions
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              System Availability
            </div>
          </div>
        </div>
        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<CheckCircleIcon size={40} />}
              title="Vehicle Registration"
              description="Register vehicles with secure blockchain verification and immutable record-keeping" />
            
            <FeatureCard
              icon={<ShieldIcon size={40} />}
              title="Secure Ownership"
              description="Cryptographically secure proof of ownership linked to your blockchain wallet" />
            
            <FeatureCard
              icon={<SearchIcon size={40} />}
              title="Instant Verification"
              description="Instantly verify vehicle ownership and history with transparent blockchain records" />
            
            <FeatureCard
              icon={<ArrowRightLeftIcon size={40} />}
              title="Easy Transfers"
              description="Transfer vehicle ownership securely with blockchain-verified transactions" />
            
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            About the Platform
          </h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col space-y-4">
                <InfoCard icon={<GlobeIcon />} title="Global Access" />
                <InfoCard icon={<LockIcon />} title="Secure & Private" />
                <InfoCard icon={<BarChartIcon />} title="Real-time Analytics" />
              </div>
              <div className="md:w-2/3">
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  The Blockchain Transportation Registration Authority is a
                  decentralized application built on the Cardano blockchain,
                  providing a secure, transparent, and efficient system for
                  vehicle registration and ownership management.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Our platform eliminates fraud, reduces paperwork, and
                  streamlines the vehicle registration process by leveraging
                  blockchain technology to create immutable records that can be
                  verified by anyone while maintaining privacy and security.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Whether you're a vehicle owner, a government agency, or a
                  business involved in the automotive industry, our platform
                  provides the tools you need to manage vehicle registrations
                  with confidence and ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-12 mt-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-800 dark:to-blue-700 p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying the benefits of
            blockchain-based vehicle registration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300">
              
              Register a Vehicle
            </Link>
            <Link
              to="/verify"
              className="bg-transparent text-white border border-white hover:bg-blue-600 dark:hover:bg-blue-800 font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300">
              
              Verify Ownership
            </Link>
          </div>
        </div>
      </section>
    </div>);

};
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-blue-600 dark:text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>);

};
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
}
const InfoCard: React.FC<InfoCardProps> = ({ icon, title }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      <h4 className="font-medium text-gray-800 dark:text-white">{title}</h4>
    </div>);

};
export default Home;
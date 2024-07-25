import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation
import { FaHome, FaMoneyBill, FaAd, FaUser } from 'react-icons/fa';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden z-50"> {/* Adjust z-index here */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around py-3">
          <Link to="/earn" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#29625d] py-2 px-4">
            <FaHome className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/get-started" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#29625d] py-2 px-4">
            <FaMoneyBill className="h-6 w-6" />
            <span className="text-xs mt-1">Plans</span>
          </Link>
          <Link to="/advertise" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#29625d] py-2 px-4">
            <FaAd className="h-6 w-6" />
            <span className="text-xs mt-1">Documents</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#29625d] py-2 px-4">
            <FaUser className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

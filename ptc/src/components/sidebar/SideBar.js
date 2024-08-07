import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed z-50 top-3 left-4 p-2 rounded-md bg-white shadow-md focus:outline-none"
      >
        <svg
          className={`w-6 h-6 transform ${isMobileMenuOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`lg:relative lg:flex lg:flex-col lg:w-64 lg:h-screen px-4 py-6 overflow-y-auto bg-white border-r ${
          isMobileMenuOpen ? "fixed z-40 top-0 left-0 w-64 h-full bg-gray-100 shadow-md" : "hidden"
        }`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1">
            <div className="space-y-4">
              <Link
                to="/dashboard"
                className="flex items-center px-3 py-2 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h6v11H3zm8-7h6v18h-6zm8 7h6v11h-6z" />
                </svg>
                <span className="ml-3 text-sm font-medium">Dashboard</span>
              </Link>

              <Link
                to="/all-requests"
                className="flex items-center px-3 py-2 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14v4H5V3zm0 5h14v4H5V8zm0 5h14v4H5v-4zm0 5h14v4H5v-4z" />
                </svg>
                <span className="ml-3 text-sm font-medium">Requests</span>
              </Link>

              <Link
                to="/messages"
                className="flex items-center px-3 py-2 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4V5zm0 0h16v2H4V5zm0 4h16v2H4V9zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" />
                </svg>
                <span className="ml-3 text-sm font-medium">Messages</span>
              </Link>

              <Link
                to="/all-ads"
                className="flex items-center px-3 py-2 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14v14H5V5zm2 2v10h10V7H7zm0 0h10v10H7V7z" />
                </svg>
                <span className="ml-3 text-sm font-medium">All Ads</span>
              </Link>

              <Link
                to="/all-users"
                className="flex items-center px-3 py-2 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a3 3 0 100 6 3 3 0 000-6zM6 15a5 5 0 0110 0m-4 3v-3m-3 3h6m-3-3v-1m-3 0v1M6 12a6 6 0 1112 0M6 15a6 6 0 0112 0" />
                </svg>
                <span className="ml-3 text-sm font-medium">All Users</span>
              </Link>

              <Link
                to="/approved"
                className="flex items-center px-3 py-2 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6M12 15h.01M4 10.5V18a2.25 2.25 0 002.25 2.25h11.5A2.25 2.25 0 0020 18V10.5M8.5 7.5a3.375 3.375 0 116.75 0M12 4.5v10.5" />
                </svg>
                <span className="ml-3 text-sm font-medium">Approved</span>
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;

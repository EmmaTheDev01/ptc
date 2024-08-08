import React, { useContext, useEffect, useState } from 'react';
import { Disclosure, Menu } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { server } from '../../utils/server';
import BottomNav from './BottomNav';

export default function NavBar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token =
          localStorage.getItem('token') ||
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('accessToken='))
            .split('=')[1];

        if (token) {
          const response = await axios.get(`${server}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.data);  // Set user profile data from API response
        } else {
          throw new Error('No token found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    // Add a delay before navigating to the login page
    setTimeout(() => {
      navigate('/login');
    }, 500); // 500ms delay (adjust as needed)
  };

  const handleNavigation = (to, openInNewTab = false) => {
    if (openInNewTab) {
      window.open(to, '_blank'); // Open URL in a new tab
    } else {
      navigate(to); // Navigate to URL in the same tab
    }
  };

  const userNavigation = [
    { name: 'Your Profile', to: '/profile' },
    ...(user && user.role === 'admin'
      ? [{ name: 'Dashboard', to: '/dashboard', openInNewTab: true }] // Open Dashboard in a new tab
      : [{ name: 'Advertise', to: '/advertise' }]),
    { name: 'Sign out', onClick: handleLogout },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      {/* Top Navigation */}
      <Disclosure as="nav" className="bg-white shadow-md relative z-50">
        {({ open }) => (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h2 className="text-[#29625d] text-2xl font-[900]">AmamazaPTC</h2>
                </div>
                {/* Main Navigation Links */}
                <div className="hidden md:block ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/earn"
                    className="text-gray-700 hover:text-[#29625d] rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Earn
                  </Link>
                  <Link
                    to="/surveys"
                    className="text-gray-700 hover:text-[#29625d] rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Surveys
                  </Link>
                  <Link
                    to="/blog"
                    className="text-gray-700 hover:text-[#29625d] rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/contact"
                    className="text-gray-700 hover:text-[#29625d] rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              {isLoggedIn && (
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full p-1 text-gray-900 hover:text-[#29625d] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3 z-50">
                    <div>
                      <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src={user?.imageUrl || 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png'} alt="" />
                      </Menu.Button>
                    </div>
                    <Menu.Items
                      className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <button
                              onClick={() => item.onClick ? item.onClick() : handleNavigation(item.to, item.openInNewTab)}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                              )}
                            >
                              {item.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}

                      {/* Conditional Upgrade Button */}
                      {user && user.membership === 'basic' && (
                        <Menu.Item>
                          <button
                            onClick={() => handleNavigation('/get-started')}
                            className="block px-4 py-2 text-sm font-[500] text-red-500 w-full text-left"
                          >
                            Upgrade to Pro
                          </button>
                        </Menu.Item>
                      )}

                      {/* Premium and Standard Membership Text */}
                      {user && (
                        <Menu.Item>
                          <div className={classNames(
                            'block px-4 py-2 text-sm w-full text-left',
                            user.membership === 'premium' ? 'bg-gradient-to-r from-[#fec76f] to-yellow-900 text-white' : 'bg-gradient-to-r from-[#29625d] to-green-700 text-white'
                          )}>
                            {user.membership === 'premium' ? 'Premium Member' : user.membership === 'standard' ? 'Standard Member' : 'Free Member'}
                          </div>
                        </Menu.Item>
                      )}

                    </Menu.Items>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        )}
      </Disclosure>

      {/* Bottom Navigation (Fixed to bottom for smaller screens) */}
      <BottomNav className="md:hidden fixed z-100 bottom-0 left-0 right-0 bg-gray-200 w-full" />

    </>
  );
}

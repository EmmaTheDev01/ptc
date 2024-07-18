import React, { useContext, useEffect, useState } from 'react';
import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { server } from '../../utils/server';

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
    navigate('/login');
  };

  const handleNavigation = (to) => {
    navigate(to);
  };

  const navigation = [
    { name: 'Earn', to: '/earn' },
    { name: 'Surveys', to: '/surveys' },
    { name: 'Blog', to: '/blog' },
    { name: 'Contact Us', to: '/contact' },
  ];

  const userNavigation = [
    { name: 'Your Profile', to: '/profile' },
    ...(user && user.role === 'admin'
      ? [{ name: 'Dashboard', to: '/dashboard' }]
      : [{ name: 'Advertise', to: '/advertise' }]),
    { name: 'Sign out', onClick: handleLogout },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-200">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <h2 className="text-[#29625d] text-2xl font-[900]">Guriraline</h2>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.to}
                            className={classNames(
                              'text-gray-700 hover:text-[#29625d]',
                              'rounded-md px-3 py-2 text-sm font-medium',
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <div className="hidden md:block">
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
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <img className="h-8 w-8 rounded-full" src={user?.imageUrl || 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png'} alt="" />
                            </Menu.Button>
                          </div>
                          <Menu.Items
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <button
                                    onClick={() => item.onClick ? item.onClick() : handleNavigation(item.to)}
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
                                  onClick={() => handleNavigation('/upgrade')}
                                  className="block px-4 py-2 text-sm text-red-500 w-full text-left"
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
                                  {user.membership === 'premium' ? 'Premium Member' : 'Standard Member'}
                                </div>
                              </Menu.Item>
                            )}

                          </Menu.Items>
                        </Menu>
                      </div>
                    </div>
                  )}
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-700 hover:text-[#29625d] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.to}
                      className={classNames(
                        'text-gray-700 hover:text-[#29625d]',
                        'block rounded-md px-3 py-2 text-base font-medium',
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                {isLoggedIn && (
                  <div className="border-t border-gray-700 pb-3 pt-4">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={user?.imageUrl || 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png'} alt="" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-[900] leading-none text-gray-700 text-start">{user?.username}</div>
                        <div className="text-sm font-medium leading-none text-gray-700">{user?.email}</div>
                      </div>
                      <button
                        type="button"
                        className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-700 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="button"
                          onClick={() => item.onClick ? item.onClick() : handleNavigation(item.to)}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700  hover:text-[#29635d]"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}

                      {/* Conditional Upgrade Button */}
                      {user && user.membership === 'basic' && (
                        <Disclosure.Button
                          as="button"
                          onClick={() => handleNavigation('/get-started')}
                          className="block rounded-md px-3 py-2 text-base font-medium text-red-500 hover:text-red-700"
                        >
                          Upgrade to Pro
                        </Disclosure.Button>
                      )}

                      {/* Premium and Standard Membership Text */}
                      {user && (
                        <Disclosure.Button
                          as="button"
                          className={classNames(
                            'block rounded-md px-3 py-2 text-base font-medium',
                            user.membership === 'premium' ? 'bg-gradient-to-r from-[#fec76f] to-yellow-900 text-white' : 'bg-gradient-to-r from-[#29625d] to-green-700 text-white'
                          )}
                        >
                          {user.membership === 'premium' ? 'Premium Member' : 'Standard Member'}
                        </Disclosure.Button>
                      )}

                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../../utils/server';

const AllUserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null); // State for selected membership filter

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${server}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', response.data); // Log the entire response
        setUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleMembershipFilter = membership => {
    setSelectedMembership(membership === selectedMembership ? null : membership); // Toggle filter on/off
  };

  if (loading) return <p className='w-auto ml-auto mr-auto mt-4'>Loading...</p>;
  if (error) return <p className='w-auto ml-auto mr-auto mt-4'>Error fetching users: {error.message}</p>;

  // Filter users based on selected membership
  const filteredUsers = selectedMembership
    ? users.filter(user => user.membership === selectedMembership)
    : users;

  return (
    <div className='w-full'>
      <section className='p-6 m-2 w-full'>
        <div className="mb-4 w-full">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 w-full">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div>
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Users
                </h6>
                <p className="block antialiased tracking-normal font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  View all users
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className={`text-sm font-medium rounded-lg px-3 py-1 ${selectedMembership === 'premium' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleMembershipFilter('premium')}
                >
                  Premium
                </button>
                <button
                  className={`text-sm font-medium rounded-lg px-3 py-1 ${selectedMembership === 'standard' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleMembershipFilter('standard')}
                >
                  Standard
                </button>
                <button
                  className={`text-sm font-medium rounded-lg px-3 py-1 ${selectedMembership === 'basic' ? 'bg-gray-300 text-gray-600' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleMembershipFilter('basic')}
                >
                  Free
                </button>
                <button
                  className={`text-sm font-medium rounded-lg px-3 py-1 ${!selectedMembership ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleMembershipFilter(null)}
                >
                  Clear Filter
                </button>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        User
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Email
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Membership
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Earning
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Requests
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Date
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold text-start">
                          {user.username}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {user.email}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className={`block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start ${getMembershipColor(user.membership)}`}>
                          {getUserMembershipLabel(user.membership)}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600 text-start">
                          RWF {user.currentBalance?.toFixed(2) || '0.00'}
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div
                            className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
                            style={{ width: `${(user.currentBalance || 0) * 10}%` }} // Example of a progress bar
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600 text-start">
                          RWF {user.requests?.toFixed(2) || '0.00'}
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div
                            className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
                            style={{ width: `${(user.requests || 0) * 10}%` }} // Example of a progress bar
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {user.createdAt.split('T')[0]}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const getMembershipColor = membership => {
  switch (membership) {
    case 'premium':
      return 'p-2 bg-gradient-to-r from-[#fec76f] to-yellow-900 text-white rounded-lg';
    case 'standard':
      return 'bg-gradient-to-r from-[#29625d] to-green-700 text-white rounded-lg';
    case 'basic':
      return 'p-2 bg-gradient-to-r from-gray-300 to-gray-100 text-gray-600 rounded-lg';
    default:
      console.warn('Unknown membership type:', membership);
      return 'bg-gray-300 text-gray-700';
  }
};

const getUserMembershipLabel = membership => {
  switch (membership) {
    case 'premium':
      return 'Premium Member';
    case 'standard':
      return 'Standard Member';
    case 'basic':
      return 'Free Member';
    default:
      console.warn('Unknown membership type:', membership);
      return 'Unknown Membership';
  }
};

export default AllUserTable;

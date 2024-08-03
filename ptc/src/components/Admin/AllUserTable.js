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

        // Sort users by createdAt date from newest to oldest
        const sortedUsers = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleMembershipFilter = (membership) => {
    setSelectedMembership((prevMembership) =>
      prevMembership === membership ? null : membership
    ); // Toggle filter on/off
  };

  const handleUpdateBalance = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.patch(`${server}/user/${userId}`, 
      { 
        currentBalance: { $inc: { currentBalance: 500 }, $set: { bonus: 0 } } 
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh users list after update
      const response = await axios.get(`${server}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <p className="w-auto ml-auto mr-auto mt-4">Loading...</p>;
  if (error)
    return (
      <p className="w-auto ml-auto mr-auto mt-4">
        Error fetching users: {error.message}
      </p>
    );

  // Filter users based on selected membership
  const filteredUsers = selectedMembership
    ? users.filter((user) => user.membership === selectedMembership)
    : users;

  // Count of users referred by each user
  const referralCounts = filteredUsers.reduce((acc, user) => {
    if (user.refferedBy) {
      acc[user.refferedBy] = (acc[user.refferedBy] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="w-full overflow-x-auto">
      <section className="p-6 m-2 w-full">
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
                  className={`text-sm font-medium rounded-lg px-3 py-1 ${
                    selectedMembership === 'premium'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleMembershipFilter('premium')}
                >
                  Premium
                </button>
                <button
                  className={`text-sm font-medium rounded-lg px-3 py-1 ${
                    selectedMembership === 'standard'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleMembershipFilter('standard')}
                >
                  Standard
                </button>
                <button
                  className={`text-sm font-medium rounded-lg px-3 py-1 ${
                    selectedMembership === 'basic'
                      ? 'bg-gray-300 text-gray-600'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleMembershipFilter('basic')}
                >
                  Free
                </button>
                <button
                  className={`text-sm font-medium rounded-lg px-3 py-1 ${
                    !selectedMembership
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleMembershipFilter(null)}
                >
                  Clear Filter
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membership
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Earning
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ref-by
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requests
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          <p className={`font-medium ${getMembershipColor(user.membership)}`}>
                            {getUserMembershipLabel(user.membership)}
                          </p>
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          <p className="mb-1">
                            RWF {user.currentBalance?.toFixed(2) || '0.00'}
                          </p>
                          <div className="flex bg-gray-200 rounded-full overflow-hidden h-1">
                            <div
                              className="bg-blue-600 text-white"
                              style={{
                                width: `${(user.currentBalance || 0) * 10}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {user.referralCode}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {user.refferedBy}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          <p className="mb-1">
                            RWF {user.requests?.toFixed(2) || '0.00'}
                          </p>
                          <div className="flex bg-gray-200 rounded-full overflow-hidden h-1">
                            <div
                              className="bg-blue-600 text-white"
                              style={{
                                width: `${(user.requests || 0) * 10}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt.split('T')[0]}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {referralCounts[user._id] > 2 && (
                            <button
                              className="bg-[#29625d] text-white hover:bg-black px-4 py-2 rounded-lg"
                              onClick={() => handleUpdateBalance(user._id)}
                            >
                              Add Bonus
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const getMembershipColor = (membership) => {
  switch (membership) {
    case 'premium':
      return 'bg-gradient-to-r from-[#fec76f] to-yellow-900 text-white rounded-lg';
    case 'standard':
      return 'bg-gradient-to-r from-[#29625d] to-green-700 text-white rounded-lg';
    case 'basic':
      return 'bg-gradient-to-r from-gray-300 to-gray-100 text-gray-600 rounded-lg';
    default:
      console.warn('Unknown membership type:', membership);
      return 'bg-gray-300 text-gray-700';
  }
};

const getUserMembershipLabel = (membership) => {
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

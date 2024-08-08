import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../../utils/server';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllUserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [bonusGivenUsers, setBonusGivenUsers] = useState(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${server}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedUsers = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUsers(sortedUsers);
      setLoading(false);

      // Update memberships if needed
      await updateExpiredMemberships(sortedUsers);
    } catch (err) {
      setError(err);
      setLoading(false);
      toast.error(`Error fetching users: ${err.message}`);
    }
  };

  const updateExpiredMemberships = async (users) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const today = new Date();
      const updatedUsers = [];

      for (const user of users) {
        if (user.membershipUpdatedAt) {
          const membershipDate = new Date(user.membershipUpdatedAt);
          const daysDifference = Math.floor((today - membershipDate) / (1000 * 60 * 60 * 24));

          if (daysDifference > 30 && user.membership !== 'basic') {
            // Update user membership to 'basic'
            await axios.patch(
              `${server}/user/${user._id}`,
              { membership: 'basic' },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            updatedUsers.push(user._id);
          }
        }
      }

      if (updatedUsers.length > 0) {
        toast.success('Expired memberships updated to Basic!');
        await fetchUsers(); // Refresh user list after updating
      }
    } catch (err) {
      setError(err);
      toast.error(`Error updating memberships: ${err.message}`);
    }
  };

  const handleMembershipFilter = (membership) => {
    setSelectedMembership((prevMembership) =>
      prevMembership === membership ? null : membership
    );
  };

  const countReferralOccurrences = (referralCode) => {
    return users.filter((user) => user.referredBy === referralCode).length;
  };

  const handleUpdateBalance = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const referredUser = users.find((user) => user._id === userId);
      if (!referredUser) {
        throw new Error('User not found');
      }

      const referralCount = countReferralOccurrences(referredUser.referralCode);

      if (referralCount >= 3) {
        const bonusAmount = 500;

        await axios.put(
          `${server}/user/${userId}`,
          {
            currentBalance: referredUser.currentBalance + bonusAmount,
            bonus: 0,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success('Bonus added to referred user!');

        await fetchUsers(); // Refresh user list after update

        if (referredUser.referredBy) {
          const referrer = users.find(
            (user) => user.referralCode === referredUser.referredBy
          );
          if (referrer) {
            await updateReferrerBalance(referrer._id, bonusAmount);
          }
        }

        setBonusGivenUsers((prev) => new Set(prev.add(userId)));
      } else {
        toast.error(
          'Referral code must be used at least 3 times to be eligible for a bonus.'
        );
      }
    } catch (err) {
      setError(err);
      toast.error(`Error updating balance: ${err.message}`);
    }
  };

  const updateReferrerBalance = async (referrerId, bonusAmount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const referrerResponse = await axios.get(`${server}/user/${referrerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const referrer = referrerResponse.data;

      await axios.patch(
        `${server}/user/${referrerId}`,
        { currentBalance: referrer.currentBalance + bonusAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Bonus added to referrer!');
    } catch (err) {
      setError(err);
      toast.error(`Error updating referrer balance: ${err.message}`);
    }
  };

  if (loading) return <p className="w-auto ml-auto mr-auto mt-4">Loading...</p>;
  if (error)
    return (
      <p className="w-auto ml-auto mr-auto mt-4">
        Error fetching users: {error.message}
      </p>
    );

  const filteredUsers = selectedMembership
    ? users.filter((user) => user.membership === selectedMembership)
    : users;

  const referralCounts = filteredUsers.reduce((acc, user) => {
    if (user.referralCode) {
      const count = countReferralOccurrences(user.referralCode);
      acc[user.referralCode] = count;
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
                         DOM
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
                        ReferredBy
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
                          {user.membershipUpdatedAt ? 'Active' : 'Inactive'}
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
                              style={{ width: `${(user.currentBalance || 0) * 10}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {user.referralCode}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {user.referredBy}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          <p className="mb-1">
                            RWF {user.requests?.toFixed(2) || '0.00'}
                          </p>
                          <div className="flex bg-gray-200 rounded-full overflow-hidden h-1">
                            <div
                              className="bg-blue-600 text-white"
                              style={{ width: `${(user.requests || 0) * 10}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt.split('T')[0]}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                          {user.bonus === 0 ? (
                            <span className="text-green-600 font-medium">Bonus Given</span>
                          ) : bonusGivenUsers.has(user._id) ? (
                            <span className="text-green-600 font-medium">Bonus Given</span>
                          ) : countReferralOccurrences(user.referralCode) >= 3 ? (
                            <button
                              className="bg-[#29625d] text-white hover:bg-black px-4 py-2 rounded-lg"
                              onClick={() => handleUpdateBalance(user._id)}
                            >
                              Add Bonus
                            </button>
                          ) : (
                            <span className="text-gray-500">Not Eligible</span>
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
      <ToastContainer />
    </div>
  );
};

const getMembershipColor = (membership) => {
  switch (membership) {
    case 'premium':
      return 'bg-gradient-to-r from-[#fec76f] to-yellow-900 text-white rounded-lg p-2';
    case 'standard':
      return 'bg-gradient-to-r from-[#29625d] to-green-700 text-white rounded-lg p-2 ';
    case 'basic':
      return 'bg-gradient-to-r from-gray-300 to-gray-100 text-gray-600 rounded-lg p-2';
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

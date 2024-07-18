import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { server } from '../../utils/server';

const AllRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApproved, setShowApproved] = useState(false); // State for showing approved requests only

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${server}/payment`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          // Update requests to include date
          const requestsWithData = response.data.data.map(request => ({
            ...request,
            createdAt: new Date(request.createdAt).toLocaleDateString('en-US'), // Format the date as needed
          }));
          setRequests(requestsWithData);
        } else {
          console.error('Failed to fetch requests:', response.data.message);
          setError(response.data.message || 'Failed to fetch requests');
        }
      } catch (error) {
        console.error('Error fetching requests:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || error.message || 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id, userId, amount) => {
    try {
      const token = localStorage.getItem('token') || Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const balanceResponse = await axios.put(`${server}/user/updatebalance/${userId}`, { amount: -amount }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (balanceResponse.data.success) {
        const approvalResponse = await axios.put(`${server}/payment/approve/${id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (approvalResponse.data.success) {
          const updatedRequests = requests.map(request =>
            request._id === id ? { ...request, approved: true } : request
          );
          setRequests(updatedRequests);
        } else {
          console.error('Failed to approve request:', approvalResponse.data.message);
          setError(approvalResponse.data.message || 'Failed to approve request');
        }
      } else {
        console.error('Failed to update user balance:', balanceResponse.data.message);
        setError(balanceResponse.data.message || 'Failed to update user balance');
      }
    } catch (error) {
      console.error('Error approving request:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || error.message || 'Failed to approve request');
    }
  };

  if (loading) return <div className='w-auto ml-auto mr-auto mt-4'>Loading...</div>;
  if (error) return <div className='w-auto ml-auto mr-auto mt-4'>Error: {error}</div>;

  // Filter requests based on showApproved state
  const filteredRequests = showApproved ? requests.filter(request => request.approved) : requests;

  return (
    <div className='w-full'>
      <section className='p-6 m-2 w-full'>
        <div className="mb-4 w-full">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 w-full">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div>
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Payment Requests Made
                </h6>
                <p className="block antialiased tracking-normal font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  View all payment requests
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    checked={showApproved}
                    onChange={() => setShowApproved(!showApproved)}
                  />
                  <span className="text-sm font-medium text-blue-gray-700">Show Approved Only</span>
                </label>
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
                        Phone
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Withdrawal
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Approved
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Date
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Actions
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request._id}>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold text-start">
                          {request.fullName}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {request.userEmail}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {request.phone}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600 text-start">
                          {request.amount} RWF
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div
                            className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
                            style={{ width: `${(request.amount / 10000) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {request.approved ? 'Yes' : 'No'}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {request.createdAt}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        {!request.approved && (
                          <button
                            className="bg-[#29625d] hover:bg-black text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleApprove(request._id, request.userId, request.amount)}
                          >
                            Approve
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
      </section>
    </div>
  );
};

export default AllRequestTable;

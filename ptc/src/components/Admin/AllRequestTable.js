import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { server } from '../../utils/server';
const AllRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch payment requests data from backend
    const fetchRequests = async () => {
      try {
        // Retrieve token from localStorage or Cookies
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Fetch data from the API
        const response = await axios.get(`${server}/payment`, {
          headers: { Authorization: `Bearer ${token}` },  // Add token to headers
        });

        if (response.data.success) {
          setRequests(response.data.data);
        } else {
          console.error('Failed to fetch requests');
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <div>Error: {error}</div>;

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
                        Amount
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Approved
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
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
                            style={{ width: `${(request.earning / 10000) * 100}%` }}  // Adjust this to match your earning range
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {request.approved === true ? 'Yes' : 'No'}
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

export default AllRequestTable;

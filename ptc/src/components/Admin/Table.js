import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from '../../utils/server';
const Table = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch approved payment requests
    const fetchApprovedRequests = async () => {
      try {
        // Get the token from cookies or localStorage
        const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        // Make the API request with the token
        const response = await axios.get(`${server}/payment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setRequests(response.data.data); // Assuming this is how you get requests data
        } else {
          console.error('Failed to fetch approved requests');
          setError('Failed to fetch approved requests');
        }
      } catch (error) {
        console.error('Error fetching approved requests:', error);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false); // Data fetching is complete
      }
    };

    fetchApprovedRequests();
  }, []);

  return (
    <div className="z-10 mb-20">
      <section className="p-6 m-2">
        <div className="mb-4">
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

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center items-center h-48">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm16 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0z"
                  />
                </svg>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-6 text-center text-red-500">
                <p>{error}</p>
              </div>
            )}

            {/* Table Data */}
            {!loading && !error && (
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Table;

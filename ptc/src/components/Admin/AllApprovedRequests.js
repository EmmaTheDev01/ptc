import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllApprovedRequests = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);

  useEffect(() => {
    // Function to fetch approved payment requests
    const fetchApprovedRequests = async () => {
      try {
        // Get the token from cookies or localStorage
        const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        // Make the API request with the token
        const response = await axios.get('http://localhost:4000/api/v1/payment/approved', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setApprovedRequests(response.data.data);
        } else {
          console.error('Failed to fetch approved requests');
        }
      } catch (error) {
        console.error('Error fetching approved requests:', error);
      }
    };

    fetchApprovedRequests();
  }, []);

  return (
    <div className='w-full'>
      <section className="p-6 m-2 w-full">
        <div className="mb-4 w-full">
          <div className="relative flex w-full flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div>
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Approved Requests
                </h6>
                <p className="block antialiased tracking-normal font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  View all Approved payment requests
                </p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Full Names
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        User Email
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
                  </tr>
                </thead>
                <tbody>
                  {approvedRequests.map((request) => (
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
                          RWF {request.amount.toFixed(2)}
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                        </div>
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

export default AllApprovedRequests;

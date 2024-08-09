import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { server } from '../../utils/server';

const AllRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApproved, setShowApproved] = useState(false);
  const [todayTotal, setTodayTotal] = useState(0);
  const [dailyTotals, setDailyTotals] = useState({});
  const [userWithdrawals, setUserWithdrawals] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [totalDeducted, setTotalDeducted] = useState(0);
  const [totalPercentageDeducted, setTotalPercentageDeducted] = useState(0);
  const [totalUnapprovedDeducted, setTotalUnapprovedDeducted] = useState(0);
  const [totalUnapprovedPercentageDeducted, setTotalUnapprovedPercentageDeducted] = useState(0);
  const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);

  // Helper function to get month in "YYYY-MM" format
  const getMonthYear = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  // Function to calculate amount after tax based on withdrawal count
  const calculateAmountAfterTax = (amount, userId, createdAt) => {
    const withdrawalCount = userWithdrawals[userId]?.count || 0;
    const withdrawalMonth = getMonthYear(createdAt);
    const currentMonth = getMonthYear(new Date());

    if (withdrawalMonth === currentMonth) {
      if (withdrawalCount === 1) {
        return amount * (1 - 0.085); // 8.5% deduction for the first withdrawal
      } else if (withdrawalCount > 1) {
        return amount * (1 - 0.14); // 14% deduction for subsequent withdrawals
      }
    }
    return amount * (1 - 0.085); // Default rate if no specific case
  };

  // Function to calculate the total amount deducted and percentage deducted
  const calculateTotals = (requests, includeApproved) => {
    let totalDeducted = 0;
    let totalOriginal = 0;
    let totalApproved = 0;

    requests.forEach(request => {
      if (request.approved === includeApproved) {
        const originalAmount = request.amount;
        const deductedAmount = calculateAmountAfterTax(originalAmount, request.userId, request.createdAt);
        totalOriginal += originalAmount;
        totalDeducted += (originalAmount - deductedAmount);

        if (includeApproved) {
          totalApproved += originalAmount;
        }
      }
    });

    const totalPercentageDeducted = (totalOriginal === 0) ? 0 : ((totalDeducted / totalOriginal) * 100);
    return { totalDeducted, totalPercentageDeducted, totalApproved };
  };

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
          let requestsWithData = response.data.data.map(request => ({
            ...request,
            createdAt: new Date(request.createdAt).toLocaleDateString('en-US'),
          }));

          // Update user withdrawal tracking
          const userWithdrawalCounts = requestsWithData.reduce((acc, request) => {
            const userId = request.userId;
            const month = getMonthYear(request.createdAt);
            if (!acc[userId]) {
              acc[userId] = { count: 0, firstWithdrawal: request.createdAt, month };
            }
            if (acc[userId].month === month) {
              acc[userId].count++;
            } else {
              acc[userId] = { count: 1, firstWithdrawal: request.createdAt, month };
            }
            return acc;
          }, {});

          requestsWithData = requestsWithData.map(request => ({
            ...request,
            isSecondRequest: userWithdrawalCounts[request.userId]?.count > 1,
          }));

          // Sort requests: unapproved first, then by date (new to old)
          requestsWithData.sort((a, b) => {
            if (a.approved !== b.approved) {
              return a.approved ? 1 : -1; // Unapproved first
            }
            return new Date(b.createdAt) - new Date(a.createdAt); // New to old
          });

          setRequests(requestsWithData);

          const today = new Date().toLocaleDateString('en-US');
          const dailyTotals = requestsWithData.reduce((acc, request) => {
            const date = request.createdAt;
            if (!acc[date]) {
              acc[date] = 0;
            }
            acc[date] += request.amount;
            return acc;
          }, {});

          setDailyTotals(dailyTotals);
          setTodayTotal(dailyTotals[today] || 0);

          // Calculate totals
          const { totalDeducted, totalPercentageDeducted, totalApproved } = calculateTotals(requestsWithData, true);
          setTotalDeducted(totalDeducted);
          setTotalPercentageDeducted(totalPercentageDeducted);
          setTotalApprovedAmount(totalApproved);

          const { totalDeducted: unapprovedDeducted, totalPercentageDeducted: unapprovedPercentage } = calculateTotals(requestsWithData, false);
          setTotalUnapprovedDeducted(unapprovedDeducted);
          setTotalUnapprovedPercentageDeducted(unapprovedPercentage);

          setUserWithdrawals(userWithdrawalCounts);

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

          setSuccessMessage(`Request for ${amount} RWF has been approved successfully!`);

          setTimeout(() => setSuccessMessage(''), 3000);

          // Update totals
          const { totalDeducted, totalPercentageDeducted, totalApproved } = calculateTotals(updatedRequests, true);
          setTotalDeducted(totalDeducted);
          setTotalPercentageDeducted(totalPercentageDeducted);
          setTotalApprovedAmount(totalApproved);

          const { totalDeducted: unapprovedDeducted, totalPercentageDeducted: unapprovedPercentage } = calculateTotals(updatedRequests, false);
          setTotalUnapprovedDeducted(unapprovedDeducted);
          setTotalUnapprovedPercentageDeducted(unapprovedPercentage);

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

  // Filter to show only second or subsequent requests, regardless of approval status
  const filteredRequests = requests.filter(request => request.isSecondRequest);

  // Optionally filter further based on approval status
  const displayedRequests = showApproved
    ? filteredRequests.filter(request => request.approved)
    : filteredRequests;

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
              {successMessage && (
                <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
                  {successMessage}
                </div>
              )}

              <div className="mb-4">
                <div className="flex justify-between p-2 border-b border-blue-gray-50">
                  <span className="font-semibold text-gray-700">Today's Total</span>
                  <span className="font-medium text-green-600">{calculateAmountAfterTax(todayTotal, '', new Date().toLocaleDateString('en-US')).toFixed(2)} RWF</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between p-2 border-b border-blue-gray-50">
                  <span className="font-semibold text-gray-700">Total Deducted Amount (Approved)</span>
                  <span className="font-medium text-red-600">{totalDeducted.toFixed(2)} RWF</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between p-2 border-b border-blue-gray-50">
                  <span className="font-semibold text-gray-700">Total Percentage Deducted (Approved)</span>
                  <span className="font-medium text-red-600">{totalPercentageDeducted.toFixed(2)}%</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between p-2 border-b border-blue-gray-50">
                  <span className="font-semibold text-gray-700">Total Approved Amount</span>
                  <span className="font-medium text-green-600">{totalApprovedAmount.toFixed(2)} RWF</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between p-2 border-b border-blue-gray-50">
                  <span className="font-semibold text-gray-700">Total Deducted Amount (Unapproved)</span>
                  <span className="font-medium text-red-600">{totalUnapprovedDeducted.toFixed(2)} RWF</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between p-2 border-b border-blue-gray-50">
                  <span className="font-semibold text-gray-700">Total Percentage Deducted (Unapproved)</span>
                  <span className="font-medium text-red-600">{totalUnapprovedPercentageDeducted.toFixed(2)}%</span>
                </div>
              </div>

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
                  {displayedRequests.map(request => (
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
                          <span className="text-blue-700 font-bold">{request.amount} RWF</span>
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className={`block antialiased font-sans text-xs font-medium text-start ${request.approved ? 'text-green-600 font-bold' : 'text-red-600'}`}>
                          {request.approved ? `${calculateAmountAfterTax(request.amount, request.userId, request.createdAt).toFixed(2)} RWF` : 'No approval'}
                          {request.isSecondRequest && !request.approved && (
                            <span className="text-white rounded-lg bg-red-600 font-bold text-center block text-xxs ml-auto mr-auto">request2</span>
                          )}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {request.createdAt}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        {!request.approved ? (
                          <button
                            className="bg-[#29625d] hover:bg-black text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleApprove(request._id, request.userId, request.amount)}
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-green-600 text-[12px]">Approved</span>
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

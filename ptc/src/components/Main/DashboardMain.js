import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../../utils/server';
import Table from '../Admin/Table';
import { Link } from 'react-router-dom';

const DashboardMain = () => {
  const [userCount, setUserCount] = useState(0);
  const [adCount, setAdCount] = useState(0);
  const [revenue, setRevenue] = useState('RWF 0.00'); // Placeholder for revenue
  const [madeWithdrawals, setMadeWithdrawals] = useState(0);

  useEffect(() => {
    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Get the token from cookies or localStorage
        const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        // Fetch total users
        const usersResponse = await axios.get(`${server}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserCount(usersResponse.data.data.length || 0);

        // Calculate revenue from currentBalance
        const totalRevenue = usersResponse.data.data.reduce((acc, user) => acc + (user.currentBalance || 0), 0);
        setRevenue(`RWF ${totalRevenue.toFixed(2)}`);

        // Fetch total withdrawals
        const totalWithdraws = usersResponse.data.data.reduce((acc, user) => acc + (user.withdrawnBalance || 0), 0);
        setMadeWithdrawals(totalWithdraws);

        // Fetch all adverts
        const advertsResponse = await axios.get(`${server}/adverts/all-ads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdCount(advertsResponse.data.data.length || 0);

        // Optionally, you could fetch revenue data from another endpoint if needed
        // const revenueResponse = await axios.get('http://localhost:4000/api/v1/revenue', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // setRevenue(`RWF ${revenueResponse.data.revenue.toFixed(2)}`);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="container mx-auto p-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mb-8 mt-5">
          {/* Revenue Card */}
          <div className="relative flex flex-col bg-white text-gray-700 shadow-md rounded-xl transition-transform transform hover:scale-105">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 text-white p-4 absolute top-3 left-2 right-0 -mt-8 flex items-center justify-center w-16 h-16 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-8 h-8">
                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd"></path>
                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
              </svg>
            </div>
            <div className="p-6 text-right">
              <p className="text-sm font-normal text-blue-gray-600">User Earnings</p>
              <h4 className="text-2xl font-semibold text-blue-gray-900">{revenue}</h4>
            </div>
            <div className="border-t border-blue-gray-50 p-4">
              <p className="text-base font-normal text-blue-gray-600">
                <strong className="text-green-500">+1%</strong> Since Launch
              </p>
            </div>
          </div>

          {/* Total Users Card */}
          <div className="relative flex flex-col bg-white text-gray-700 shadow-md rounded-xl transition-transform transform hover:scale-105">
            <div className="bg-gradient-to-tr from-pink-600 to-pink-400 text-white p-4 absolute top-3 left-2 right-0 -mt-8 flex items-center justify-center w-16 h-16 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-8 h-8">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="p-6 text-right">
              <p className="text-sm font-normal text-blue-gray-600">Total Users</p>
              <h4 className="text-2xl font-semibold text-blue-gray-900">{userCount}</h4>
            </div>
            <div className="border-t border-blue-gray-50 p-4">
              <p className="text-base font-normal text-blue-gray-600">
               <Link to="/all-users" className="text-green-500">View Details</Link>
              </p>
            </div>
          </div>

          {/* All Ads Card */}
          <div className="relative flex flex-col bg-white text-gray-700 shadow-md rounded-xl transition-transform transform hover:scale-105">
            <div className="bg-gradient-to-tr from-green-600 to-green-400 text-white p-4 absolute top-3 left-2 right-0 -mt-8 flex items-center justify-center w-16 h-16 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-8 h-8">
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
              </svg>
            </div>
            <div className="p-6 text-right">
              <p className="text-sm font-normal text-blue-gray-600">All Ads</p>
              <h4 className="text-2xl font-semibold text-blue-gray-900">{adCount}</h4>
            </div>
            <div className="border-t border-blue-gray-50 p-4">
              <p className="text-base font-normal text-blue-gray-600">
              <Link to="/all-ads" className="text-green-500">View Details</Link>
              </p>
            </div>
          </div>

          {/* Payment Requests Card */}
          <div className="relative flex flex-col bg-white text-gray-700 shadow-md rounded-xl transition-transform transform hover:scale-105">
            <div className="bg-gradient-to-tr from-orange-600 to-orange-400 text-white p-4 absolute top-3 left-2 right-0 -mt-8 flex items-center justify-center w-16 h-16 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-8 h-8">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
              </svg>
            </div>
            <div className="p-6 text-right">
              <p className="text-sm font-normal text-blue-gray-600">Total Withdrawals</p>
              <h4 className="text-2xl font-semibold text-blue-gray-900">RWF {madeWithdrawals}</h4>
            </div>
            <div className="border-t border-blue-gray-50 p-4">
              <p className="text-base font-normal text-blue-gray-600">
                <strong className="text-green-500">0%</strong> Since Launch
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* Made requests table */}
          <Table/>
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;

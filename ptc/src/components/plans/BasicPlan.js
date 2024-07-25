import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { server } from '../../utils/server';
const BasicPlan = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming your token is stored in localStorage
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`${server}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserProfile(response.data); // Assuming response.data has email, phone, and username
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const config = {
    public_key: process.env.PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: 30000,
    currency: 'RWF',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: userProfile?.email,
      phone_number: userProfile?.phone,
      name: userProfile?.username,
    },
    customizations: {
      title: 'Standard Plan',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const fwConfig = {
    ...config,
    text: 'Get Started',
    callback: (response) => {
      console.log(response);
      closePaymentModal();
    },
    onClose: () => {},
  };

  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col h-full m-3">
      {/* Plan Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#29625d] to-green-700 text-white">
        <h2 className="text-2xl font-semibold mb-2">Standard Plan</h2>
        <p className="text-white mb-4">Perfect for individuals who are just getting started.</p>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">RWF 25,000</span>
          <span className="text-white text-sm">/month</span>
        </div>
      </div>

      {/* Plan Features */}
      <ul className="px-6 mb-5 mt-5 flex-1 space-y-2">
        <li className="flex items-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-green-500 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Watch Unlimited ads</span>
        </li>
        <li className="flex items-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-green-500 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Withdraw RWF 50,000 per day</span>
        </li>
        <li className="flex items-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-green-500 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>24/7 Support</span>
        </li>
      </ul>

      {/* Plan Footer */}
      <div className="px-6 pb-6">
        <FlutterWaveButton {...fwConfig} className='w-full bg-[#29625d] text-white py-2 px-4 rounded-lg hover:bg-[#000] transition duration-300' />
      </div>
    </div>
  );
};

export default BasicPlan;

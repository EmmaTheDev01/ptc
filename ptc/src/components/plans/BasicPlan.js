import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { server } from '../../utils/server';
import { public_key } from './key';

const BasicPlan = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const response = await axios.get(`${server}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handlePaymentSuccess = async (response) => {
    console.log('Payment response:', response);
    // Check if the payment is successful based on the response status or other criteria
    if (response.status === 'successful') {
      try {
        const token = localStorage.getItem('token');
        const userId = userProfile._id;
        const plan = response.tx_ref;
        await axios.put(
          `${server}/user/${userId}`,
          { membership: "standard", membershipUpdatedAt: Date.now() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    } else {
      console.error('Payment was not successful:', response);
    }

    closePaymentModal();
  };

  const config = {
    public_key: public_key,
    tx_ref: `tx_${Date.now()}_basic`, // Include plan identifier in tx_ref
    amount: 100, // Adjust amount as needed
    currency: 'RWF',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: userProfile?.email,
      phone_number: userProfile?.phone,
      name: userProfile?.username,
    },
    customizations: {
      title: 'Standard Plan',
      description: 'Payment for a standard plan for PTC',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  return (
    <div className="App max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col h-full m-3">
      {/* Plan Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#29625d] to-green-700 text-white">
        <h2 className="text-2xl font-semibold mb-2">Standard Plan</h2>
        <p className="text-white mb-4">Perfect for individuals who are just getting started.</p>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">RWF 7,500</span>
          <span className="text-white text-sm">/month</span>
        </div>
      </div>

      {/* Plan Features */}
      <ul className="px-6 mb-5 mt-5 flex-1 space-y-2">
        <li className="flex items-center text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-green-500 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Watch Unlimited ads</span>
        </li>
        <li className="flex items-center text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-green-500 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>2X earrning per ad</span>
        </li>
        <li className="flex items-center text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-green-500 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>24/7 Support</span>
        </li>
      </ul>

      {/* Plan Footer */}
      <div className="px-6 pb-6">
        <FlutterWaveButton
          public_key={config.public_key}
          tx_ref={config.tx_ref}
          amount={config.amount}
          currency={config.currency}
          payment_options={config.payment_options}
          customer={config.customer}
          customizations={config.customizations}
          text="Get Started"
          callback= {response => handlePaymentSuccess(response)}
          onClose={() => { }}
          className="w-full bg-[#29625d] text-white py-2 px-4 rounded-lg hover:bg-[#000] transition duration-300"
        />
      </div>
    </div>
  );
};

export default BasicPlan;

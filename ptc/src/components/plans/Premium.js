import React, { useState, useEffect } from "react";
import axios from "axios";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { server } from "../../utils/server";
import { public_key } from "./key";

const Premium = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get(`${server}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserProfile(response.data.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handlePaymentSuccess = async (response) => {
    console.log('Payment response:', response); // Log response for debugging

    // Check if the payment is successful based on the response status or other criteria
    if (response.status === 'successful') { // Modify based on actual response structure
      try {
        const token = localStorage.getItem('token');
        const userId = userProfile._id; // Assuming userProfile has an `_id` property

        // Update user profile to set the membership to 'premium'
        await axios.put(
          `${server}/user/${userId}`,
          { membership: "premium", membershipUpdatedAt: Date.now() },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('User profile updated to premium membership');
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    } else {
      console.error('Payment was not successful:', response);
    }

    closePaymentModal(); // Close the payment modal
  };

  const config = {
    public_key: public_key,
    tx_ref: `tx_${Date.now()}_premium`, // Include plan identifier in tx_ref
    amount: 100,
    currency: "RWF",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: userProfile?.email,
      phone_number: userProfile?.phone,
      name: userProfile?.username,
    },
    customizations: {
      title: "Premium Plan",
      description: "Payment for premium plan",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const fwConfig = {
    ...config,
    text: "Get Started",
    callback: handlePaymentSuccess, // Update callback to use handlePaymentSuccess
    onClose: () => { },
  };

  return (
    <div className="max-w-sm mb-20 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col h-full m-3">
      {/* Plan Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#fec76f] to-yellow-900 text-white">
        <h2 className="text-2xl font-semibold mb-2">Premium Plan</h2>
        <p className="text-gray-100 mb-4">
          Unlock advanced features for optimal performance.
        </p>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">RWF 31,000</span>
          <span className="text-gray-100 text-sm">/month</span>
        </div>
      </div>

      {/* Plan Features */}
      <ul className="px-6 flex-1 space-y-2 mt-5 mb-5">
        <li className="flex items-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-green-500 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Unlimited Ad watching</span>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>10X earning per ad</span>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Priority Support</span>
        </li>
      </ul>

      {/* Plan Footer */}
      <div className="px-6 pb-6">
        <FlutterWaveButton
          {...fwConfig}
          className="w-full bg-[#29625d] text-white py-2 px-4 rounded-lg hover:bg-[#000] transition duration-300"
        />
      </div>
    </div>
  );
};

export default Premium;

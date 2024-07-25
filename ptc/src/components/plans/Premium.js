import React, { useState, useEffect } from "react";
import axios from "axios";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { server } from "../../utils/server";

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

        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const config = {
    public_key: process.env.PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: 45000,
    currency: "RWF",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: userProfile?.email,
      phone_number: userProfile?.phone,
      name: userProfile?.username,
    },
    customizations: {
      title: "Premium Plan",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const fwConfig = {
    ...config,
    text: "Get Started",
    callback: (response) => {
      console.log(response);
      console.log(process.env.PUBLIC_KEY);
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => {},
  };

  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col h-full m-3">
      {/* Plan Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#fec76f] to-yellow-900 text-white">
        <h2 className="text-2xl font-semibold mb-2">Premium Plan</h2>
        <p className="text-gray-100 mb-4">
          Unlock advanced features for optimal performance.
        </p>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">RWF 45,000</span>
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
          <span>Unlimited Withdrawals</span>
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

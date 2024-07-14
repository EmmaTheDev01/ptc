import React from 'react';

const Premium = () => {
  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col h-full m-3">
      {/* Plan Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#29625d] to-green-700 text-white">
        <h2 className="text-2xl font-semibold mb-2">Premium Plan</h2>
        <p className="text-gray-100 mb-4">Unlock advanced features for optimal performance.</p>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">RWF 35,000</span>
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
        <button className="w-full bg-[#29625d] text-white py-2 px-4 rounded-lg hover:bg-[#000] transition duration-300">
          Get Premium
        </button>
      </div>
    </div>
  );
};

export default Premium;

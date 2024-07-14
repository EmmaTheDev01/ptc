import React from 'react';

const FreePlan = () => {
  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col h-full m-3">
      {/* Plan Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-300 to-gray-100 text-gray-600">
        <h2 className="text-2xl font-semibold mb-2 text-[#29625d]">Free Plan</h2>
        <p className="text-gray-600 mb-4">A great way to get started with no cost.</p>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">RWF 0.00</span>
          <span className="text-gray-600 text-sm">/forever</span>
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
          <span>Watch limited ads</span>
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
          <span>Withdraw RWF 5,000 per day</span>
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
          <span>Community Support</span>
        </li>
      </ul>
      
      {/* Plan Footer */}
      <div className="px-6 pb-6">
        <button className="w-full bg-[#29625d] text-white py-2 px-4 rounded-lg hover:bg-[#000] transition duration-300">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default FreePlan;

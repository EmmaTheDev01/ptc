import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
const Profile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-100 h-full mt-6 w-[90%] ml-auto mr-auto">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="md:flex no-wrap md:-mx-2">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-full w-[100px] mx-auto"
                  src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
                  alt=""
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                50inCash
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6 mb-3 font-600">
                Email@gmail.com
              </h3>
              <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                Dynamic marketing strategist with over a decade of experience in
                driving brand growth and creating compelling campaigns.
                Passionate about leveraging data-driven insights to craft
                innovative solutions and build lasting client relationships.
              </p>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Status</span>
                  <span className="ml-auto">
                    <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                      Active
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Member since</span>
                  <span className="ml-auto">Nov 07, 2016</span>
                </li>
              </ul>
            </div>
            <div className="my-4"></div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-green-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-6 18h6a2 2 0 002-2v-5a2 2 0 00-2-2h-6a2 2 0 00-2 2v5a2 2 0 002 2zM9 3h6"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">Current Balance</span>
              </div>
              <div className="text-gray-700">
                <div className="text-gray-700">
                  <span className="text-3xl font-semibold">RWF 0.00</span>
                </div>
                <button className=" mt-3 bg-[#29625d] hover:bg-black text-white font-bold py-2 px-4 rounded">
                Withdraw
                </button>
              </div>
            </div>
            <div className="my-4"></div>
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-green-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0 1.38-.56 2.63-1.464 3.536A4.978 4.978 0 017 16c-.796 0-1.568-.156-2.288-.464A5 5 0 017 21a5 5 0 01-3.536-1.464A4.978 4.978 0 017 16c-.796 0-1.568-.156-2.288-.464A5 5 0 017 21a5 5 0 01-3.536-1.464A4.978 4.978 0 017 16a4.978 4.978 0 013.536-1.464A4.978 4.978 0 0112 11zM12 3a1 1 0 010 2 1 1 0 010-2zm0 4a1 1 0 010 2 1 1 0 010-2zm0 4a1 1 0 010 2 1 1 0 010-2zM9 13a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zM9 9a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zM5 7a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zM5 3a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zM1 5a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zM1 1a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm0 4a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">Overall</span>
              </div>
              <div className="flex justify-center items-center">
                <div className="text-gray-700 w-[50%]">
                <p className="m-3 uppercase font-bold text-gray-600">Earnings</p>
                <span className="text-xl font-semibold text-green-500 text-end"><FaArrowUp/></span>
                  <span className="text-xl font-semibold text-gray-500">RWF 0.00</span>
                </div>
                <div className="text-gray-700 w-[50%]">
                <p className="m-3 uppercase font-bold text-gray-600">Withdrawals</p>
                <span className="text-xl font-semibold text-red-500 text-end"><FaArrowDown/></span>
                  <span className="text-xl font-semibold text-gray-500"><span></span>RWF 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;

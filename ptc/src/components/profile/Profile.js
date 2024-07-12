import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { server } from "../../utils/server";

const Profile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch user profile data from backend
    const fetchData = async () => {
      try {
        // Retrieve token from cookies (if available)
        const token = localStorage.getItem("token") || document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];

        if (token) {
          const response = await axios.get(`${server}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserData(response.data.data);  // Adjust to access the correct data field
        } else {
          setError(new Error("No token found"));
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="bg-gray-100 h-full mt-6 w-[90%] ml-auto mr-auto">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="md:flex no-wrap md:-mx-2">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-full w-[100px] mx-auto"
                  src={userData?.photo?.url || "https://cdn-icons-png.flaticon.com/512/3607/3607444.png"}
                  alt="profile"
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {userData?.username || "Loading..."}
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6 mb-3 font-600">
                {userData?.email || "Loading..."}
              </h3>
              <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                {userData?.bio || "Dynamic marketing strategist with over a decade of experience in driving brand growth and creating compelling campaigns. Passionate about leveraging data-driven insights to craft innovative solutions and build lasting client relationships."}
              </p>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Membership</span>
                  <span className="ml-auto">
                    <span className={`bg-${userData?.membership === "premium" ? "gold" : userData?.membership === "standard" ? "silver" : "green"}-500 py-1 px-2 rounded text-white text-sm`}>
                      {userData?.membership || "Free Plan"}
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Member since</span>
                  <span className="ml-auto">{new Date(userData?.createdAt).toLocaleDateString() || "Loading..."}</span>
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
              <span className="text-2xl mt-3 font-semibold text-green-600"><FaArrowDown/></span>
                <p className="text-2xl font-semibold">RWF {userData?.currentBalance || "0.00"}</p>
              </div>
            </div>
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
                <span className="tracking-wide">Withdrawals</span>
              </div>
              <div className="text-gray-700">
              <span className="text-2xl mt-3 font-semibold text-red-600"><FaArrowUp/></span>
                <p className="text-2xl font-semibold">RWF {userData?.withdrawnBalance || "0.00"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { server } from "../../utils/server";
import { Link } from "react-router-dom";

// Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="tail-spin"></div>
  </div>
);

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            .split("=")[1];

        if (token) {
          const response = await axios.get(`${server}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data.data);
        } else {
          setError(new Error("No token found"));
          window.location.reload();
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setNotification("Referral code copied!");
        setTimeout(() => setNotification(""), 3000); // Hide notification after 3 seconds
      },
      (err) => {
        setNotification("Failed to copy referral code.");
        setTimeout(() => setNotification(""), 3000); // Hide notification after 3 seconds
      }
    );
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error fetching data: {error.message}</p>;

  // Check if user has either "standard" or "premium" membership
  const canAdvertise =
    userData?.membership === "standard" || userData?.membership === "premium";

  return (
    <div className="bg-gray-100 h-full mt-6 w-[90%] mx-auto mb-20">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="md:flex no-wrap md:-mx-2">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-full w-[100px] mx-auto"
                  src={
                    userData?.photo?.url ||
                    "https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
                  }
                  alt="profile"
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {userData?.username || "Loading..."}
              </h1>
              <p
                className="text-sm font-bold text-black hover:text-gray-600 leading-6 cursor-pointer"
                onClick={() => copyToClipboard(userData?.referralCode || '')}
              >
                {userData?.referralCode || "No referral code"}
              </p>
              <h3 className="text-gray-600 font-lg text-semibold leading-6 mb-3 font-600">
                {userData?.email || "Loading..."}
              </h3>
              <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                {userData?.bio ||
                  "Dynamic marketing strategist with over a decade of experience in driving brand growth and creating compelling campaigns. Passionate about leveraging data-driven insights to craft innovative solutions and build lasting client relationships."}
              </p>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Membership</span>
                  <span className="ml-auto">
                    <span
                      className={`py-1 px-2 rounded text-white text-sm ${
                        userData?.membership === "premium"
                          ? "bg-[#DAA520]"
                          : userData?.membership === "standard"
                            ? "bg-[#c0c0c0]"
                            : "bg-green-500"
                      }`}
                    >
                      {userData?.membership || "No Membership"}
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Member since</span>
                  <span className="ml-auto">
                    {new Date(userData?.createdAt).toLocaleDateString() ||
                      "Loading..."}
                  </span>
                </li>
              </ul>
              {canAdvertise && (
                <div className="w-full mt-4">
                  <Link to="/advertise">
                    <button className="bg-[#29625d] p-3 shadow-sm rounded-md hover:bg-black w-full">
                      <span className="text-white">Advertise</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
            <div className="my-4"></div>
          </div>
          <div className="w-full md:w-9/12 md:mx-2 flex flex-col">
            <div className="bg-white p-3 shadow-sm rounded-sm mb-4">
              <div className="flex items-center justify-between font-semibold text-gray-900">
                <div className="flex items-center">
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
                  <span className="ml-2">Current Balance</span>
                </div>
                <div></div>
              </div>
              <div className="text-gray-700 m-3">
                <span className="text-2xl mt-3 font-semibold text-green-600">
                  <FaArrowDown />
                </span>
                <p className="text-2xl font-semibold">
                  RWF{" "}
                  {userData?.currentBalance > 0
                    ? userData?.currentBalance
                    : userData?.currentBalance + ".00"}
                </p>
              </div>
              <Link to="/withdraw">
                <button className="bg-[#29625d] hover:bg-black text-white py-1 px-3 rounded-md mt-3 md:mt-0">
                  Withdraw
                </button>
              </Link>
            </div>
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center justify-between font-semibold text-gray-900">
                <div className="flex items-center">
                  <span className="text-red-500">
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
                  <span className="ml-2">Withdrawals</span>
                </div>
              </div>
              <div className="text-gray-700 m-3">
                <span className="text-2xl mt-3 font-semibold text-red-600">
                  <FaArrowUp />
                </span>
                <p className="text-2xl font-semibold">
                  RWF{" "}
                  {userData?.withdrawnBalance > 0
                    ? userData?.withdrawnBalance
                    : userData?.withdrawnBalance + ".00"}
                </p>
                <p className="text-sm mt-4 text-gray-400">
                  Through withdraw, we tax you 0.00 to support our community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Profile;

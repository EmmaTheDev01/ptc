import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { server } from "../../utils/server";
import Cookies from "js-cookie";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdCard = () => {
  const [watched, setWatched] = useState(false);
  const [timer, setTimer] = useState(30);
  const [adverts, setAdverts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adViewed, setAdViewed] = useState(false);
  const [adUrl, setAdUrl] = useState(""); // To store the ad URL
  const [startTime, setStartTime] = useState(null); // Track when the ad view started
  const balanceUpdated = useRef(false); // Use ref to track if balance is updated
  const [pageLeftTime, setPageLeftTime] = useState(null); // Track when the user leaves the page

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${server}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUser(response.data.data);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
      setError(
        error.response?.data?.message || error.message || "Failed to fetch user data"
      );
    }
  };

  // Fetch advertisements
  const fetchAdvertisements = async () => {
    try {
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${server}/adverts/all-ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAdverts(response.data.data);
      } else {
        throw new Error("Failed to fetch advertisements");
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch advertisements"
      );
    }
  };

  // Update user balance
  const updateUserBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) throw new Error("No token found");

      const userId = user._id;
      const adPrice = adverts.length > 0 ? adverts[0].price : 0;
      const currentBalance = user.currentBalance || 0;

      const response = await axios.put(
        `${server}/user/${userId}`,
        { currentBalance: currentBalance + adPrice },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
        console.log("User balance updated successfully.");
      } else {
        throw new Error(response.data.message || "Failed to update user balance");
      }
    } catch (error) {
      console.error("Error updating user balance:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to update user balance"
      );
    }
  }, [adverts, user]);

  // Handle ad view actions
  const handleAdView = (advert) => {
    setWatched(true);
    setAdverts([advert]);
    setAdUrl(advert.redirect); // Store the ad URL
    setAdViewed(true); // Mark ad as viewed
    setStartTime(Date.now()); // Track when the ad view started
    balanceUpdated.current = false; // Reset balance updated state
    axios.post(`${server}/adverts/start`, { adUrl }, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }); // Notify server that ad viewing has started
  };

  // Update favicon and page title with countdown
  const updateFaviconAndTitle = (time) => {
    const favicon = document.getElementById('favicon');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 32;
    canvas.height = 32;

    ctx.fillStyle = '#29625d';
    ctx.fillRect(0, 0, 32, 32);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(time, 16, 16);

    const url = canvas.toDataURL('image/png');
    favicon.href = url;

    document.title = `Ad Countdown: ${time}s`;
  };

  // Timer and balance update effects
  useEffect(() => {
    let countdown;

    const performAdActions = async () => {
      if (watched && timer > 0) {
        updateFaviconAndTitle(timer);
        countdown = setTimeout(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      } else if (timer === 0) {
        updateFaviconAndTitle(0);

        if (adViewed && !balanceUpdated.current) {
          toast.success("Ad Watched! Your balance is being updated.");
          await updateUserBalance();
          balanceUpdated.current = true; // Set balance updated to true
          // Notify server that reward should be processed
          await axios.post(`${server}/adverts/confirm`, { adUrl }, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
        } else if (!adViewed) {
          toast.error("Please make sure to view the ad.");
          // Notify server to cancel the reward
          await axios.post(`${server}/adverts/cancel`, { adUrl }, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
        }

        // Reset states after timer ends
        setWatched(false);
        setTimer(30);
        setStartTime(null);
      }
    };

    performAdActions();

    return () => clearTimeout(countdown);
  }, [watched, timer, adViewed, adUrl, updateUserBalance]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setPageLeftTime(Date.now());
      } else if (document.visibilityState === 'visible') {
        if (pageLeftTime) {
          const timeSpentAway = (Date.now() - pageLeftTime) / 1000;
          if (timeSpentAway < 30) {
            setWatched(false);
            setTimer(30);
            setStartTime(null);
            balanceUpdated.current = false;
            toast.error("Please finish viewing the ad.");
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pageLeftTime]);

  // Fetch user data and advertisements on component mount
  useEffect(() => {
    fetchUserData();
    fetchAdvertisements();
  }, []);

  // Helper function to get token from local storage or cookies
  const getToken = () => localStorage.getItem("token") || Cookies.get("token");

  // Render loading state if data is still loading
  if (loading) return <div>Loading...</div>;

  // Render error message if there's an error fetching data
  if (error) return <div>Error: {error}</div>;

  // Render the ad card once data is loaded
  return (
    <div className="relative pt-2 min-h-screen">
      <ToastContainer />
      <div
        className="bg-cover w-full flex justify-center items-center"
        style={{ backgroundImage: "url('/images/mybackground.jpeg')" }}
      >
        <div className="w-full bg-white p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
          <div className="w-full mx-auto rounded-2xl bg-white p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 mx-auto">
              {adverts.map((advert) => (
                <article
                  key={advert._id}
                  className="bg-white p-4 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border flex flex-col"
                >
                  <div
                    className="relative mb-4 rounded-2xl flex-grow"
                    onClick={() => handleAdView(advert)}
                  >
                    <img
                      className="h-40 w-full rounded-2xl object-cover transition-transform duration-300 transform group-hover:scale-105"
                      src={
                        advert.photo?.url ||
                        advert.imageUrl ||
                        "https://www.vhv.rs/dpng/d/159-1593324_ppc-online-advertising-full-online-ads-clipart-hd.png"
                      }
                      alt={advert.title}
                    />
                    <a
                      className="flex justify-center items-center bg-[#29625d] bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:opacity-100"
                      href={advert.redirect}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setAdViewed(false)}
                    >
                      <span className="text-md">{advert.desc}</span>
                      <svg
                        className="ml-2 w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-600 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 3h2v6h-2zM11 17h2v2h-2zM6.293 5.293a1 1 0 011.414 0L12 8.586l4.293-4.293a1 1 0 111.414 1.414L13.414 10l4.293 4.293a1 1 0 11-1.414 1.414L12 12.414l-4.293 4.293a1 1 0 01-1.414-1.414z"
                        />
                      </svg>
                      <span className="text-[18px] font-semibold text-slate-400">
                        {advert.price} RWF
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg text-center leading-6">
                    <a
                      href={advert.redirect}
                      className="block text-gray-800 hover:text-[#29625d] transition-colors duration-200"
                    >
                      {advert.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    {advert.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;

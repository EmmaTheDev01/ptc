import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { server } from "../../utils/server";
import { FaCoins } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner"; // Import TailSpin

const AdCard = () => {
  const [adverts, setAdverts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adViewed, setAdViewed] = useState(false);
  const [adUrl, setAdUrl] = useState(""); // To store the ad URL
  const [timer, setTimer] = useState(30); // Timer state
  const [videoUrl, setVideoUrl] = useState(""); // To store the video URL
  const [youtubeVideoId, setYoutubeVideoId] = useState(""); // To store YouTube video ID
  const [pageLeftTime, setPageLeftTime] = useState(null); // Track when the user leaves the page
  const [startTime, setStartTime] = useState(null); // Track when the ad view started
  const [watchedAds, setWatchedAds] = useState([]); // State to store watched ads IDs

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${server}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setWatchedAds(userData.watchedAds || []); // Store watched ads IDs
        setLoading(false);
        fetchAdvertisements(userData.membership); // Pass membership level to fetchAdvertisements
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
  const fetchAdvertisements = async (membership) => {
    try {
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${server}/adverts/approved-ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Adjust ad prices based on user membership
        const updatedAdverts = response.data.data.map((advert) => {
          let adjustedPrice = advert.price || 0;
          switch (membership) {
            case "premium":
              adjustedPrice = advert.price;
              break;
            case "standard":
              adjustedPrice = advert.price / 5;
              break;
            case "basic":
              adjustedPrice = advert.price / 10;
              break;
            default:
              break;
          }
          return { ...advert, price: adjustedPrice };
        }).filter(advert => !watchedAds.includes(advert._id)) // Filter out watched ads
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt descending

        setAdverts(updatedAdverts);
        setLoading(false); // Set loading to false once ads are fetched
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
      setLoading(false); // Set loading to false on error
    }
  };

  // Update user balance
  const updateUserBalance = async (advert) => {
    try {
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) throw new Error("No token found");

      const userId = user._id;
      const adPrice = advert.price || 0; // Use the adjusted ad price from the advert
      const currentBalance = user.currentBalance || 0;

      // Prepare the request data
      const updateData = {
        currentBalance: currentBalance + adPrice,
        watchedAds: [...user.watchedAds, advert._id], // Add the watched ad ID
      };

      // Send the update request
      const response = await axios.put(`${server}/user/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUser(response.data.data);
        setWatchedAds(response.data.data.watchedAds); // Update watched ads state
        toast.success(`Ad Watched! Your balance is updated with ${adPrice} RWF.`);
      } else {
        throw new Error(response.data.message || "Failed to update user balance");
      }
    } catch (error) {
      console.error("Error updating user balance:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user balance"
      );
    }
  };

  // Handle ad view actions
  const handleAdView = (advert) => {
    if (user.watchedAds.includes(advert._id)) {
      return; // Prevent re-watching the same ad
    }

    setAdUrl(advert.redirect); // Store the ad URL
    setAdViewed(true); // Mark ad as viewed
    setStartTime(Date.now()); // Track when the ad view started
    setTimer(advert.timeout || 30); // Set the timer from advert.timeout or default to 30 seconds

    if (advert.videoUrl) {
      setVideoUrl(advert.videoUrl); // Set video URL if available
      if (isYouTubeVideoUrl(advert.videoUrl)) {
        const videoId = extractYouTubeVideoId(advert.videoUrl);
        setYoutubeVideoId(videoId); // Extract and store YouTube video ID
      }
    }

    axios.post(
      `${server}/adverts/start`,
      { adUrl: advert.redirect },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    ); // Notify server that ad viewing has started
  };

  // Check if the URL is a YouTube video URL
  const isYouTubeVideoUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Extract YouTube Video ID from URL
  const extractYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Update favicon and page title with countdown
  const updateFaviconAndTitle = (time) => {
    const favicon = document.getElementById("favicon");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 32;
    canvas.height = 32;

    ctx.fillStyle = "#29625d";
    ctx.fillRect(0, 0, 32, 32);

    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(time, 16, 16);

    const url = canvas.toDataURL("image/png");
    favicon.href = url;

    document.title = `Ad Countdown: ${time}s`;
  };

  // Timer and balance update effects
  useEffect(() => {
    let countdown;

    const performAdActions = async () => {
      if (adViewed && timer > 0) {
        updateFaviconAndTitle(timer);
        countdown = setTimeout(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      } else if (timer === 0) {
        updateFaviconAndTitle(0);

        if (adViewed) {
          await updateUserBalance(
            adverts.find((advert) => advert.redirect === adUrl)
          ); // Update balance with the correct ad price
        } else {
          toast.error("Please make sure to view the ad.");
          // Notify server to cancel the reward
          await axios.post(
            `${server}/adverts/cancel`,
            { adUrl },
            {
              headers: { Authorization: `Bearer ${getToken()}` },
            }
          );
        }

        // Reset states after timer ends
        setAdViewed(false);
        setTimer(30); // Reset timer to default value
        setStartTime(null);
        setVideoUrl(""); // Reset video URL
        setYoutubeVideoId(""); // Reset YouTube video ID
      }
    };

    performAdActions();

    return () => clearTimeout(countdown);
  }, [adViewed, timer, adUrl, adverts]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setPageLeftTime(Date.now());
      } else if (document.visibilityState === "visible") {
        if (pageLeftTime) {
          const timeSpentAway = (Date.now() - pageLeftTime) / 1000;
          if (timeSpentAway < 30) {
            setAdViewed(false);
            setTimer(30); // Reset timer to default value
            setStartTime(null);
            toast.error("Please finish viewing the ad.");
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [pageLeftTime]);

  // Fetch user data and advertisements on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Helper function to get token from local storage or cookies
  const getToken = () =>
    localStorage.getItem("token") || Cookies.get("token");

  // Render loading spinner if data is still loading
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <TailSpin
        height="80"
        width="80"
        color="#29625d"
        ariaLabel="loading"
      />
    </div>
  );

  // Render error message if there is an error
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  // Render no ads message if there are no advertisements
  if (adverts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center">
          There are currently no ads available. You can earn by referring new users using your referral code.
        </p>
      </div>
    );
  }

  // Render the ad card once data is loaded
  return (
    <div className="pt-2 mb-20 md:mb-0 min-h-screen z-100"> {/* Apply mb-20 only on smaller screens */}
      <ToastContainer />
      <div
        className="bg-cover w-full flex justify-center items-center"
        style={{ backgroundImage: "url('/images/mybackground.jpeg')" }}
      >
        <div className="w-full z-0 bg-white p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
          <div className="w-full mx-auto rounded-2xl bg-white p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 mx-auto">
              {adverts.map((advert) => (
                <article
                  key={advert._id}
                  className={`bg-white p-4 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer ${user?.watchedAds.includes(advert._id) ? 'opacity-50 pointer-events-none' : ''
                    }`}
                >
                  <div
                    className="relative mb-4 rounded-2xl flex-grow"
                    onClick={() => handleAdView(advert)}
                  >
                    {youtubeVideoId && advert.videoUrl ? (
                      <div className="h-40 w-full rounded-2xl overflow-hidden">
                        {isYouTubeVideoUrl(advert.videoUrl) ? (
                          <iframe
                            title={advert.title}
                            className="h-full w-full rounded-2xl object-cover transition-transform duration-300 transform group-hover:scale-105"
                            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                            frameBorder="0"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            controls
                            className="h-full w-full rounded-2xl object-cover transition-transform duration-300 transform group-hover:scale-105"
                            src={advert.videoUrl}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                        {advert.photo && advert.photo.length > 0 ? (
                          <div className="flex space-x-2 overflow-x-auto">
                            {advert.photo.map((photo, index) => (
                              <img
                                key={index}
                                className="h-40 w-full rounded-2xl object-cover transition-transform duration-300 transform group-hover:scale-105"
                                src={photo.url || "https://www.vhv.rs/dpng/d/159-1593324_ppc-online-advertising-full-online-ads-clipart-hd.png"}
                                alt={`${advert.title} ad ${index}`}
                              />
                            ))}
                          </div>
                        ) : (
                          <img
                            className="h-40 w-full rounded-2xl object-cover transition-transform duration-300 transform group-hover:scale-105"
                            src={
                              advert.imageUrl ||
                              "https://www.vhv.rs/dpng/d/159-1593324_ppc-online-advertising-full-online-ads-clipart-hd.png"
                            }
                            alt={advert.title}
                          />
                        )}
                      </div>
                    )}

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
                      <span className="mr-2 text-gold">
                        <FaCoins />
                      </span>
                      <span className="text-[16px] font-semibold text-slate-400">
                        {advert.price} RWF
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg text-center leading-6">
                    <a
                      href={advert.redirect}
                      target="_blank"
                      className="block text-gray-800 hover:text-[#29625d] transition-colors duration-200"
                      rel="noreferrer"
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

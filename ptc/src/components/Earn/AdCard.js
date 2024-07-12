import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../utils/server";
import Cookies from "js-cookie";

const AdCard = () => {
  const [watched, setWatched] = useState(false);
  const [timer, setTimer] = useState(30);
  const [adverts, setAdverts] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch adverts data from backend
  const fetchAdverts = async () => {
    try {
      // Retrieve token from localStorage or Cookies
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(`${server}/adverts/all-ads`, {
        headers: { Authorization: `Bearer ${token}` },  // Add token to headers
      });

      if (response.data.success) {
        setAdverts(response.data.data);
        console.log(response.data);
      } else {
        console.error("Failed to fetch adverts");
      }
    } catch (error) {
      console.error("Error fetching adverts:", error);
      setError(error.response?.data?.message || error.message || "Failed to fetch adverts");
    }
  };

  useEffect(() => {
    fetchAdverts();
  }, []);

  useEffect(() => {
    let countdown;
    if (watched && timer > 0) {
      countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      alert("Ad Watched");
    }

    return () => clearTimeout(countdown);
  }, [watched, timer]);

  const handleWatchAd = () => {
    // Start the countdown when the ad is clicked
    setWatched(true);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative pt-2 lg:pt-2 min-h-screen">
      <div
        className="bg-cover w-full flex justify-center items-center"
        style={{ backgroundImage: "url('/images/mybackground.jpeg')" }}
      >
        <div className="w-full bg-white p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
          <div className="w-full mx-auto rounded-2xl bg-white p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-center px-2 mx-auto">
              {adverts.map((advert) => (
                <article
                  key={advert._id}
                  className="bg-white p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border"
                >
                  <div
                    className="relative mb-4 rounded-2xl"
                    onClick={handleWatchAd}
                  >
                    <img
                      className="max-h-80 h-[300px] w-full rounded-2xl object-cover transition-transform duration-300 transform group-hover:scale-105"
                      src={
                        advert.photo?.url ||
                        advert.imageUrl ||
                        "https://www.vhv.rs/dpng/d/159-1593324_ppc-online-advertising-full-online-ads-clipart-hd.png"
                      }
                      alt={advert.title}
                    />
                    <div className="absolute bottom-3 left-3 inline-flex items-center rounded-lg bg-white p-2 shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5 text-red-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                      <span className="ml-1 text-sm text-slate-400">
                        {advert.price} RWF
                      </span>
                    </div>
                    <a
                      className="flex justify-center items-center bg-[#29625d] bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-md group-hover:opacity-100"
                      href={advert.redirect} // Update with your link field from backend
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {advert.desc}
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
                  <div className="flex justify-between items-center w-full pb-4 mb-auto">
                    <div className="flex items-center">
                      <div className="pr-3">
                        <span className="ml-1 text-[18px] font-[600] text-slate-400">
                          {advert.price} RWF
                        </span>
                      </div>
                      <div className="flex flex-1">
                        <div>
                          <p className="text-sm font-semibold"></p>
                          <p className="text-sm text-gray-500">
                            Published on{" "}
                            {new Date(advert.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="text-sm flex items-center text-gray-500">
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-xl leading-8">
                    <a
                      href={advert.redirect}
                      className="block relative group-hover:text-[#29625d] transition-colors duration-200"
                    >
                      {advert.title}
                    </a>
                  </h3>
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

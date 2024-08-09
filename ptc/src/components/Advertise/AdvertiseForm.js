import React, { useState, useContext, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../utils/server";
import Cookies from 'js-cookie';
import { AuthContext } from "../../context/AuthContext";
import { TailSpin } from 'react-loader-spinner'; // Import a spinner component

const AdvertiseForm = () => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [redirect, setRedirect] = useState("");
  const [timeout, setTimeout] = useState(30);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading
  const [userMembership, setUserMembership] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMembership = async () => {
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${server}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.data.membership === 'premium' || isAdmin) {
          setUserMembership(response.data.membership);
        } else {
          navigate("/get-started"); // Redirect if not premium or admin
        }
      } catch (error) {
        console.error("Error fetching user membership:", error);
        navigate("/login"); 
      }
    };

    if (isLoggedIn) {
      fetchUserMembership();
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photo.length === 0 && !imageUrl) {
      toast.error("Please upload at least one image or provide an image URL.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("price", price);
    formData.append("redirect", redirect);
    formData.append("timeout", timeout);

    if (photo.length > 0) {
      photo.forEach((photoFile) => {
        formData.append("images", photoFile);
      });
    }

    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }
    if (videoUrl) {
      formData.append("videoUrl", videoUrl);
    }

    try {
      const token = localStorage.getItem('token') || Cookies.get('token');
      if (!token) {
        throw new Error('You are not allowed to create an ad');
      }

      setLoading(true); // Start loading
      setIsButtonDisabled(true); // Disable button

      const response = await axios.post(`${server}/adverts/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        toast.success("Ad created successfully!");
        setIsModalOpen(false); // Close modal on success
        navigate("/earn");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error("Failed to create ad. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
      setIsButtonDisabled(false); // Re-enable button
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPhoto(files);
  };

  // Render loading spinner while checking membership or if the page is not accessible
  if (!isLoggedIn || userMembership === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <TailSpin height="80" width="80" color="#29625d" ariaLabel="loading" />
      </div>
    );
  }

  if (userMembership === 'basic' || userMembership === 'standard') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-center">You need to upgrade your membership to get started to create an ad.</p>
        <div className="ml-4">
          <Link to='/get-started'>
            <button className="px-4 py-2 bg-[#29625d] text-white rounded hover:bg-black">
              Upgrade Membership
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 mb-20">
      {/* Guidelines Section */}
      <section className="p-6 m-10 bg-white shadow-md mb-6 rounded-md max-w-3xl mx-auto text-start overflow-hidden">
        <h2 className="text-2xl font-bold text-[#29625d] mb-4">Advertisement Guidelines</h2>
        <div className="text-sm text-gray-600">
          <p className="mb-4">To create an effective advertisement, please follow these comprehensive guidelines:</p>
          <ul className="list-disc list-inside">
            <li>
              <strong>Ad Title:</strong>
              <p className="ml-4">Provide a concise and descriptive title for your advertisement...</p>
            </li>
            <li>
              <strong>Description:</strong>
              <p className="ml-4">Include a detailed description of the product or service...</p>
            </li>
            <li>
              <strong>Price:</strong>
              <p className="ml-4">Specify the price of the product or service you are offering...</p>
            </li>
            <li>
              <strong>Redirect URL:</strong>
              <p className="ml-4">Enter the URL where users will be directed when they click on your ad...</p>
            </li>
            <li>
              <strong>Image URL:</strong>
              <p className="ml-4">If you prefer, you can provide a direct URL to an image related to your advertisement...</p>
            </li>
            <li>
              <strong>Upload Images:</strong>
              <p className="ml-4">You can upload multiple images to showcase your product or service...</p>
            </li>
            <li>
              <strong>Video URL (Optional):</strong>
              <p className="ml-4">Optionally, you can include a video URL to provide a dynamic view of your product or service...</p>
            </li>
            <li>
              <strong>Timeout (Optional):</strong>
              <p className="ml-4">Specify the duration (in seconds) after which the advertisement will expire or be removed...</p>
            </li>
          </ul>
        </div>
      </section>

      <div className="flex justify-center mb-20">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center p-2 bg-[#29625d] hover:bg-[#1e4d46] text-white rounded-lg shadow-lg transition duration-300 ease-in-out"
        >
          <AiOutlinePlusCircle size={24} />
          <span className="ml-2">Create Ad</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative h-[75vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <IoMdClose size={24} />
            </button>

            <h5 className="text-center text-2xl font-bold mb-6 text-[#29625d]">Create Advertisement</h5>
            <p className="text-gray-600 mb-5">Enter your ad details below:</p>
            <form onSubmit={handleSubmit} className="relative">
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Ad Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter your product name..."
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="desc" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter a detailed description..."
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Price <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter the price..."
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="redirect" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Redirect URL
                </label>
                <input
                  type="url"
                  id="redirect"
                  name="redirect"
                  value={redirect}
                  onChange={(e) => setRedirect(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter the URL to redirect..."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter the image URL..."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Upload Images
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleImageChange}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4"
                  multiple
                />
              </div>
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter the video URL..."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timeout" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Timeout (Optional, in seconds)
                </label>
                <input
                  type="number"
                  id="timeout"
                  name="timeout"
                  value={timeout}
                  onChange={(e) => setTimeout(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter timeout duration in seconds..."
                />
              </div>
              <div className="flex justify-end relative">
                <input
                  type="submit"
                  value="Create Ad"
                  className="p-3 bg-[#29625d] w-full hover:bg-[#1e4d46] text-white rounded-md cursor-pointer transition duration-300 ease-in-out relative"
                  disabled={loading || isButtonDisabled} 
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                    <TailSpin
                      height="24"
                      width="24"
                      color="#fff"
                      ariaLabel="loading"
                    />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiseForm;

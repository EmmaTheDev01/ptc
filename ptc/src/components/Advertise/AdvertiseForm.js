import React, { useState, useContext } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../utils/server";
import Cookies from 'js-cookie';
import { AuthContext } from "../../context/AuthContext";

const AdvertiseForm = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [redirect, setRedirect] = useState("");
  const [timeout, setTimeout] = useState(30);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

      const response = await axios.post(`${server}/adverts/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        toast.success("Ad created successfully!");
        navigate("/earn");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error("Failed to create ad. Please try again later.");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPhoto(files);
  };

  if (!isLoggedIn) {
    navigate('/login');
    return null;
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
              <p className="ml-4">Provide a concise and descriptive title for your advertisement. This title should clearly convey the main subject of your ad. Aim for clarity and relevance to attract potential customers. Example: "Brand New Smartphone - Great Deal!"</p>
            </li>
            <li>
              <strong>Description:</strong>
              <p className="ml-4">Include a detailed description of the product or service you are advertising. Mention key features, benefits, and any relevant details that might interest potential buyers. A well-crafted description can significantly impact the effectiveness of your ad. Example: "This latest smartphone features a 6.5-inch display, 128GB storage, and a high-resolution camera. Perfect for photography enthusiasts and tech lovers."</p>
            </li>
            <li>
              <strong>Price:</strong>
              <p className="ml-4">Specify the price of the product or service you are offering. Ensure that the price is competitive and reflects the value of your offering. If applicable, mention if the price is negotiable or fixed. Example: "$499 or best offer."</p>
            </li>
            <li>
              <strong>Redirect URL:</strong>
              <p className="ml-4">Enter the URL where users will be directed when they click on your ad. This could be a product page, a service booking page, or any relevant link where users can learn more or make a purchase. Make sure the URL is correct and leads to the intended destination. Example: "https://www.yourwebsite.com/smartphone-deals"</p>
            </li>
            <li>
              <strong>Image URL:</strong>
              <p className="ml-4">If you prefer, you can provide a direct URL to an image related to your advertisement. Ensure the image is high-quality and represents your product or service accurately. This option is useful if you have a specific image hosted online that you want to use. Example: "https://www.yourwebsite.com/images/smartphone.jpg"</p>
            </li>
            <li>
              <strong>Upload Images:</strong>
              <p className="ml-4">You can upload multiple images to showcase your product or service from different angles or highlight various features. High-resolution images help in creating a compelling ad. Ensure the images are clear and of good quality. Example: Photos of the smartphone from different angles, close-ups of features, etc.</p>
            </li>
            <li>
              <strong>Video URL (Optional):</strong>
              <p className="ml-4">Optionally, you can include a video URL to provide a dynamic view of your product or service. Videos can demonstrate the product in action or provide additional details. Make sure the video is engaging and relevant to the advertisement. Example: "https://www.youtube.com/watch?v=example"</p>
            </li>
            <li>
              <strong>Timeout (Optional):</strong>
              <p className="ml-4">Specify the duration (in seconds) after which the advertisement will expire or be removed. This helps in creating urgency and managing how long your ad will be active. Example: "3600" for a 1-hour active period.</p>
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative h-[75vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <IoMdClose size={24} />
            </button>

            <h5 className="text-center text-2xl font-bold mb-6 text-[#29625d]">Create Advertisement</h5>
            <p className="text-gray-600 mb-5">Enter your ad details below:</p>
            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your product description..."
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter your product price..."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timeout" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Timeout in Seconds
                </label>
                <input
                  type="number"
                  id="timeout"
                  name="timeout"
                  value={timeout}
                  onChange={(e) => setTimeout(Number(e.target.value))}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter your Ad timeout in seconds..."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter image URL if applicable..."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Video URL (Optional)
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter video URL if applicable..."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="redirect" className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Redirect URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="redirect"
                  name="redirect"
                  value={redirect}
                  onChange={(e) => setRedirect(e.target.value)}
                  className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Enter Redirect URL..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-start">
                  Upload Images <span className="text-red-600">*</span>
                </label>
                <input
                  type="file"
                  id="upload"
                  className="hidden"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                  required={photo.length === 0 && !imageUrl}
                  name="images"
                />
                <div className="flex items-center space-x-4">
                  <label htmlFor="upload" className="cursor-pointer">
                    <AiOutlinePlusCircle size={30} color="#555" />
                  </label>
                  <div className="flex flex-wrap">
                    {photo.map((photoFile, index) => (
                      <div key={index} className="relative m-2">
                        <img
                          src={URL.createObjectURL(photoFile)}
                          alt={`ad ${index}`}
                          className="h-24 w-24 object-cover rounded-md shadow-md"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                          onClick={() => setPhoto(photo.filter((_, i) => i !== index))}
                        >
                          <IoMdClose size={20} color="#fff" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <input
                  type="submit"
                  value="Create Ad"
                  className="p-3 bg-[#29625d] hover:bg-[#1e4d46] text-white rounded-md cursor-pointer transition duration-300 ease-in-out"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiseForm;

import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../utils/server";
import Cookies from 'js-cookie';  // Import Cookies for token retrieval

const AdvertiseForm = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [redirect, setRedirect] = useState("");
  const navigate = useNavigate();

  // Handle form submission
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

    // Append images if photo array is not empty
    if (photo.length > 0) {
      photo.forEach((photoFile) => {
        formData.append("images", photoFile); // Ensure "images" matches backend field name
      });
    }

    // Append imageUrl if provided
    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    try {
      const token = localStorage.getItem('token') || Cookies.get('token');  // Get token from localStorage or cookies
      if (!token) {
        throw new Error('You are not allowed to create an ad');
      }

      const response = await axios.post(`${server}/adverts/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`  // Include Bearer token in headers
        },
      });

      if (response.status === 200) {
        toast.success("Ad created successfully!");
        navigate("/earn");
        // Do not reload the page, React will handle the navigation
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error("Failed to create ad. Please try again later.");
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPhoto(files);
  };

  return (
    <div className="flex justify-center flex-wrap w-full p-6">
      <div className="w-full sm:w-[90%] max-w-[600px] bg-gray-100 p-6 shadow-lg">
        <h4 className="text-center text-lg font-semibold mb-3 uppercase text-[18px] text-[#29625d]">Guidelines to create an ad:</h4>
        <div className="bg-white p-4 rounded-lg shadow text-start">
          <div className="mb-4">
            <h5 className="text-lg font-medium mb-2">1. Provide a clear and concise title</h5>
            <p className="text-gray-600">Make sure your title accurately describes your product or service.</p>
          </div>
          <div className="mb-4">
            <h5 className="text-lg font-medium mb-2">2. Describe your product or service thoroughly</h5>
            <p className="text-gray-600">Include all relevant details about what you are offering.</p>
          </div>
          <div className="mb-4">
            <h5 className="text-lg font-medium mb-2">3. Set a reasonable price for your offering</h5>
            <p className="text-gray-600">Research similar products/services to determine a competitive price.</p>
          </div>
          <div className="mb-4">
            <h5 className="text-lg font-medium mb-2">4. Upload high-quality images</h5>
            <p className="text-gray-600">Showcase your product/service with clear and appealing images.</p>
          </div>
          <div>
            <h5 className="text-lg font-medium mb-2">5. Include a valid redirect URL</h5>
            <p className="text-gray-600">Provide a URL where interested users can learn more or make a purchase.</p>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-[50%] ml-auto mr-auto mt-4 bg-white shadow rounded-[4px] p-3">
        <h5 className="text-[30px] font-Poppins text-center">Create Ad</h5>
        <form onSubmit={handleSubmit}>
          <br />
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
            <label className="block pb-2">
              Ad Title <span className="text-green-700">*</span>
              {/* Guideline 1: Provide a clear and concise title */}
            </label>
            <input
              type="text"
              name="title"
              value={title}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your product name..."
              required
            />
          </div>
          <br />
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
            <label className="block pb-2">
              Description <span className="text-green-700">*</span>
              {/* Guideline 2: Describe your product or service thoroughly */}
            </label>
            <textarea
              cols="30"
              rows="8"
              name="desc"
              value={desc}
              className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter your product description..."
              required
            ></textarea>
          </div>

          <br />
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
            <label className="block pb-2">Price</label>
            {/* Guideline 3: Set a reasonable price for your offering */}
            <input
              type="number"
              name="price"
              value={price}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter your product price..."
              required
            />
          </div>

          <br />
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
            <label className="block pb-2">Image URL (Optional)</label>
            {/* Guideline 4: Upload high-quality images */}
            <input
              type="text"
              name="imageUrl"
              value={imageUrl}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL if applicable..."
            />
          </div>

          <br />
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
            <label className="block pb-2">Redirect Url</label>
            {/* Guideline 5: Include a valid redirect URL */}
            <input
              type="text"
              name="redirect"
              value={redirect}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
              onChange={(e) => setRedirect(e.target.value)}
              placeholder="Enter Redirect URL..."
              required
            />
          </div>

          <br />
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
            <label className="block pb-2">
              Upload Images <span className="text-green-700">*</span>
              {/* Guideline 4: Upload high-quality images */}
            </label>
            <input
              type="file"
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              // Conditional required based on imageUrl
              required={photo.length === 0 && !imageUrl}
              name="images"
            />
            <div className="w-full flex items-center flex-wrap">
              <label htmlFor="upload">
                <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
              </label>
              {photo &&
                photo.map((photoFile, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(photoFile)}
                    alt={`ad ${index}`}
                    className="h-[100px] w-[100px] object-cover m-2"
                  />
                ))}
            </div>
            <br />
            <div>
              <input
                type="submit"
                value="Create Ad"
                className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvertiseForm;

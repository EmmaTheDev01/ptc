import React, { useState, useContext } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
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

    if (photo.length > 0) {
      photo.forEach((photoFile) => {
        formData.append("images", photoFile);
      });
    }

    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }
    if (videoUrl) {
      formData.append("videoUrl", videoUrl); // Append video URL to formData
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

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPhoto(files);
  };

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login');
    return null; // Or loading indicator if necessary
  }

  return (
    <div className="flex justify-center flex-wrap w-full p-6 space-x-4">
      <div className="w-full sm:w-90 max-w-[600px] bg-gray-100 p-6">
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
      <div className="w-full max-w-[600px] sm:w-90 ml-auto mr-auto mt-4 bg-white shadow rounded-[4px] p-3">
        <h5 className="text-center text-2xl font-bold mb-6 uppercase">Create Advertisement</h5>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="title" className="text-gray-700 text-sm font-bold mb-2 block">
              Ad Title <span className="text-green-700">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control w-full appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Enter your product name..."
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="desc" className="text-gray-700 text-sm font-bold mb-2 block">
              Description <span className="text-green-700">*</span>
            </label>
            <textarea
              id="desc"
              name="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="form-control w-full appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Enter your product description..."
              required
            ></textarea>
          </div>
          <div className="form-group mb-4">
            <label htmlFor="price" className="text-gray-700 text-sm font-bold mb-2 block">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control w-full appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Enter your product price..."
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="imageUrl" className="text-gray-700 text-sm font-bold mb-2 block">
              Image URL (Optional)
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="form-control w-full appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Enter image URL if applicable..."
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="videoUrl" className="text-gray-700 text-sm font-bold mb-2 block">
              Video URL (Optional)
            </label>
            <input
              type="text"
              id="videoUrl"
              name="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="form-control w-full appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Enter video URL if applicable..."
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="redirect" className="text-gray-700 text-sm font-bold mb-2 block">
              Redirect Url
            </label>
            <input
              type="text"
              id="redirect"
              name="redirect"
              value={redirect}
              onChange={(e) => setRedirect(e.target.value)}
              className="form-control w-full appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Enter Redirect URL..."
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="text-gray-700 text-sm font-bold mb-2 block">
              Upload Images <span className="text-green-700">*</span>
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
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create Ad"
              className="mt-4 w-[200px] float-start p-2 bg-[#29625d] hover:bg-black text-white rounded-lg cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvertiseForm;

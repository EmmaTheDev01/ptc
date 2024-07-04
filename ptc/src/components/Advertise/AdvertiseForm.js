import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../utils/server";

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
      const response = await axios.post(`${server}/adverts/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
    <div className="w-[50%] ml-auto mr-auto mt-4 bg-white shadow rounded-[4px] p-3">
      <h5 className="text-[30px] font-Poppins text-center">Create Ad</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Ad Title <span className="text-green-700">*</span>
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
        <div>
          <label className="pb-2">
            Description <span className="text-green-700">*</span>
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
        <div>
          <label className="pb-2">Price</label>
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
        <div>
          <label className="pb-2">Image URL (Optional)</label>
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
        <div>
          <label className="pb-2">Redirect Url</label>
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
        <div>
          <label className="pb-2">
            Upload Images <span className="text-green-700">*</span>
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
  );
};

export default AdvertiseForm;

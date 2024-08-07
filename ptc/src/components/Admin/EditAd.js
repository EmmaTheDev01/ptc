import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { server } from '../../utils/server';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const EditAd = () => {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photo, setPhoto] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${server}/adverts/${adId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const fetchedAd = response.data.data;
        setAd(fetchedAd);
        setTitle(fetchedAd.title);
        setDesc(fetchedAd.desc);
        setPrice(fetchedAd.price);
        setImageUrl(fetchedAd.imageUrl);
        setVideoUrl(fetchedAd.videoUrl);
        setRedirect(fetchedAd.redirect);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch ad');
        setLoading(false);
      }
    };

    fetchAd();
  }, [adId]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhoto(files);
  };

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
      formData.append("videoUrl", videoUrl);
    }

    try {
      const token = localStorage.getItem('token') || Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(`${server}/adverts/${adId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        toast.success("Ad updated successfully!");
        navigate("/earn");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (err) {
      console.error('Error updating ad:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to update ad');
    }
  };

  if (loading) return <div className="text-center text-lg ml-auto mr-auto">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-600">Error: {error}</div>;

  return (
    <div className="w-[60%] mx-auto mt-3 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Ad</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="desc" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL (Optional):</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="videoUrl" className="block text-gray-700 text-sm font-bold mb-2">Video URL (Optional):</label>
          <input
            type="text"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="redirect" className="block text-gray-700 text-sm font-bold mb-2">Redirect URL:</label>
          <input
            type="text"
            id="redirect"
            value={redirect}
            onChange={(e) => setRedirect(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="upload" className="block text-gray-700 text-sm font-bold mb-2">Upload Images:</label>
          <input
            type="file"
            id="upload"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="mb-4"
          />
          <div className="flex flex-wrap gap-2">
            {photo && Array.from(photo).map((photoFile, index) => (
              <img
                key={index}
                src={URL.createObjectURL(photoFile)}
                alt={`ad ${index}`}
                className="h-24 w-24 object-cover border border-gray-300 rounded-md"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#29625d] text-white font-bold rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Ad
        </button>
      </form>
    </div>
  );
};

export default EditAd;

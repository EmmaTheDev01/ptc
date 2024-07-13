import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../../utils/server';
import Cookies from 'js-cookie';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
const AllAdsTable = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle the delete request
  const handleDelete = async (adId) => {
    try {
      const token = localStorage.getItem('token') || Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      await axios.delete(`${server}/adverts/${adId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter out the deleted ad from the ads array
      setAds((prevAds) => prevAds.filter(ad => ad._id !== adId));
      toast.success("Ad deleted succesfully!");
    } catch (err) {
      console.error('Error deleting ad:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete ad');
    }
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${server}/adverts/all-ads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('API Response:', response.data); // Log the response to check its structure
        setAds(response.data.data); // Assuming response.data.data contains array of ads with _id
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch ads');
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <div className='w-auto ml-auto mr-auto mt-4'>Loading...</div>;
  if (error) return <div className='w-auto ml-auto mr-auto mt-4'>Error: {error}</div>;

  return (
    <div className='w-full'>
      <section className="p-6 m-2 w-full overflow-x-auto">
        <div className="mb-4 w-full">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden w-full xl:col-span-2">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div>
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  All Ads
                </h6>
                <p className="block antialiased tracking-normal font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  View all Advertisements
                </p>
              </div>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-200 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Ad Title
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-200 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Ad Description
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-200 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Price
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-200 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Date
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-200 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Action
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad._id}>
                      <td className="py-3 px-6 border-b border-blue-gray-200">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold text-start">
                          {ad.title}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-200">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {ad.desc}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-200">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          RWF {ad.price}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-200">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-200 text-left">
                        <button
                          onClick={() => handleDelete(ad._id)}  // Corrected to use ad._id
                          className="text-red-500 hover:text-red-700 text-center"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AllAdsTable;

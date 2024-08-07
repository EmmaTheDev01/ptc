import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../../utils/server';
import Cookies from 'js-cookie';
import { FaTrash, FaCheckCircle, FaEdit } from 'react-icons/fa'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

const AllAdsTable = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // Function to handle navigation to edit page
  const handleEdit = (adId) => {
    navigate(`/edit-ad/${adId}`); // Navigate to edit page with ad ID
  };

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

      setAds((prevAds) => prevAds.filter(ad => ad._id !== adId));
      toast.success("Ad deleted successfully!");
    } catch (err) {
      console.error('Error deleting ad:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete ad');
      toast.error('Failed to delete ad.');
    }
  };

  // Function to handle toggling ad approval status
  const handleApproveToggle = async (adId) => {
    let adToUpdate;
    try {
      const token = localStorage.getItem('token') || Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Retrieve the ad to update
      adToUpdate = ads.find(ad => ad._id === adId);
      if (!adToUpdate) {
        throw new Error('Ad not found');
      }

      const newApprovalStatus = !adToUpdate.approved;

      await axios.put(`${server}/adverts/${newApprovalStatus ? 'approve' : 'disapprove'}/${adId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAds((prevAds) =>
        prevAds.map(ad => {
          if (ad._id === adId) {
            return { ...ad, approved: newApprovalStatus };
          }
          return ad;
        })
      );

      toast.success(`Ad ${newApprovalStatus ? 'approved' : 'disapproved'} successfully!`);
    } catch (err) {
      console.error('Error toggling ad approval status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to toggle ad approval status');
      
      // Only show the error toast if adToUpdate is defined
      if (adToUpdate) {
        toast.error(`Failed to ${adToUpdate.approved ? 'disapprove' : 'approve'} ad.`);
      } else {
        toast.error('Failed to toggle ad approval status.');
      }
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

        const sortedAds = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAds(sortedAds);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch ads');
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const filterAds = (ads) => {
    if (filter === 'approved') {
      return ads.filter(ad => ad.approved);
    } else if (filter === 'not-approved') {
      return ads.filter(ad => !ad.approved);
    } else {
      return ads;
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

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
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`text-sm font-medium ${filter === 'all' ? 'text-blue-600' : 'text-blue-gray-500 hover:text-blue-700'} focus:outline-none`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('approved')}
                  className={`text-sm font-medium ${filter === 'approved' ? 'text-green-600' : 'text-blue-gray-500 hover:text-green-700'} focus:outline-none`}
                >
                  Displayed
                </button>
                <button
                  onClick={() => handleFilterChange('not-approved')}
                  className={`text-sm font-medium ${filter === 'not-approved' ? 'text-red-600' : 'text-blue-gray-500 hover:text-red-700'} focus:outline-none`}
                >
                  In Review
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
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
                    {filterAds(ads).map((ad) => (
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
                        <td className="py-3 px-6 border-b border-blue-gray-200 text-left flex items-center">
                          <button
                            onClick={() => handleEdit(ad._id)}
                            className="text-blue-500 hover:text-blue-700 mr-2 text-center"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleApproveToggle(ad._id)}
                            className={`text-${ad.approved ? 'red-500 hover:text-red-700' : 'green-500 hover:text-green-700'} mr-2 text-center`}
                            title={ad.approved ? 'Disapprove' : 'Approve'}
                          >
                            <FaCheckCircle className={ad.approved ? 'text-red-500' : 'text-green-500'} />
                          </button>
                          <button
                            onClick={() => handleDelete(ad._id)}
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
        </div>
      </section>
    </div>
  );
};

export default AllAdsTable;

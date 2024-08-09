import React, { useContext } from 'react';
import AdvertiseForm from '../components/Advertise/AdvertiseForm';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar/NavBar';
import { AuthContext } from '../context/AuthContext';
import { TailSpin } from 'react-loader-spinner';

const AdvertisePage = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <TailSpin
          height="80"
          width="80"
          color="#29625d"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible
        />
      </div>
    );
  }

  return isLoggedIn ? (
    <div className='bg-gray-100'>
      <NavBar />
      <AdvertiseForm />
      <Footer />
    </div>
  ) : (
    <div className='flex justify-center items-center h-screen'>
      <p className='text-3xl'>Please log in to create an ad</p>
      {window.location.reload()}
    </div>
  );
};

export default AdvertisePage;

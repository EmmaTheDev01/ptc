import React from 'react'
import AdvertiseForm from '../components/Advertise/AdvertiseForm'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar/NavBar'
const AdvertisePage = () => {
  return (
    <div className='bg-gray-100'>
      <NavBar />
      <AdvertiseForm />
      <Footer />
    </div>
  )
}

export default AdvertisePage
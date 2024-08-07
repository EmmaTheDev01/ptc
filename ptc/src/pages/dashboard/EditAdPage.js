import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import SideBar from '../../components/sidebar/SideBar'
import EditAd from '../../components/Admin/EditAd'

const EditAdPage = () => {
  return (
    <div>
      <NavBar />
      <div className='flex justify-start items-start w-full bg-gray-50'>
        <SideBar />
        <EditAd />
      </div>
    </div >
  )
}

export default EditAdPage
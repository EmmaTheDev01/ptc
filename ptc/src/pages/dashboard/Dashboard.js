import React from 'react'
import Navbar from '../../components/NavBar/NavBar'
import SideBar from '../../components/sidebar/SideBar'
import DashboardMain from '../../components/Main/DashboardMain'

const Dashboard = () => {
  return (
    <div>
        <Navbar/>
        <div className='flex justify-start w-full items-start h-screen  bg-gray-50/50 w-full'>
            <SideBar/>
            <DashboardMain/>
        </div>
    </div>
  )
}

export default Dashboard
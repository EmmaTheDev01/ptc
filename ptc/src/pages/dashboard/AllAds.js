import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/sidebar/SideBar";
import AllAdsTable from "../../components/Admin/AllAdsTable";

const AllAds = () => {
  return (
    <div>
      <NavBar />
      <div className="flex justify-start items-start w-full bg-gray-50">
        <SideBar />
        <AllAdsTable/>
      </div>
    </div>
  );
};

export default AllAds;

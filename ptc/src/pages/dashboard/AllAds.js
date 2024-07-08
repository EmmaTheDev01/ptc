import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/sidebar/SideBar";

const AllAds = () => {
  return (
    <div>
      <NavBar />
      <div className="flex justify-start items-start w-full bg-gray-50">
        <SideBar />
        <section className="p-6 m-2 w-full overflow-x-auto">
          <div className="mb-4 w-full">
            {/* Adjusted to fill the full width */}
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-6 border-b border-blue-gray-200">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold text-start">
                          Ad Title Here
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-200">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          Ad description goes here
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-200">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          $14,000
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-200">
                        <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600 text-start">
                          2024-07-08
                        </p>
                      </td>
                    </tr>
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllAds;

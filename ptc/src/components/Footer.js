import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const sections = [
  {
    title: "Solutions",
    items: ["Marketing", "Analytics", "Commerce", "Data", "Cloud"],
  },
  {
    title: "Support",
    items: ["Pricing", "Documentation", "Guides", "API Status"],
  },
  {
    title: "Company",
    items: ["About", "Blog", "Jobs", "Press", "Partners"],
  },
  {
    title: "Legal",
    items: ["Claims", "Privacy", "Terms", "Policies", "Conditions"],
  },
];

const items = [
  { name: "Facebook", icon: FaFacebook, link: "https://www.facebook.com/" },
  { name: "Instagram", icon: FaInstagram, link: "https://www.instagram.com/" },
  { name: "Twitter", icon: FaTwitter, link: "https://twitter.com/" },
];

const Footer = () => {
  return (
    <div className="w-full mt-24 bg-gray-200 text-gray-300 py-16 px-2 bottom-0 hidden lg:block">
      <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-6 border-b-2 border-gray-600 py-8">
        {sections.map((section, index) => (
          <div key={index}>
            <h6 className="font-bold uppercase pt-2 text-[#29625d]">{section.title}</h6>
            <ul>
              {section.items.map((item, i) => (
                <li key={i} className="py-1 text-gray-700 hover:text-[#29625d] cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 pt-8 md:pt-2">
          <p className="font-bold uppercase text-[#29625d]">Subscribe to our newsletter</p>
          <p className="py-4 text-gray-700">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <form className="flex flex-col sm:flex-row">
            <input
              className="w-full p-2 mr-4 rounded-md mb-4 outline-none text-gray-700"
              type="email"
              placeholder="Enter email.."
            />
            <button className="p-2 mb-4 bg-[#29625d] hover:bg-black rounded-md text-white font-[500]">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="flex flex-col max-w-[1240px] px-2 py-4 mx-auto justify-between sm:flex-row text-center text-gray-700">
        <p className="py-4">2024 PTC. All rights reserved</p>
        <div className="flex justify-between sm:w-[300px] pt-4 text-2xl">
          {items.map((x, index) => {
            return <x.icon key={index} className="text-[#29625d] hover:text-[#000] cursor-pointer" />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;

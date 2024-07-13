import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../utils/server";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WithdrawForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userEmail: "",
    phone: "",
    amount: "",
  });

  const [currentBalance, setCurrentBalance] = useState(0);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token") || Cookies.get("token");
        const profileUrl = `${server}/auth/profile`;

        const response = await axios.get(profileUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { currentBalance, _id } = response.data.data;
        setCurrentBalance(currentBalance);
        setUserId(_id);

        if (currentBalance <= 500) {
          console.log("Insufficient balance to withdraw.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile. Please try again later.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { fullName, userEmail, phone, amount } = formData;

    if (parseFloat(amount) <= 500 || parseFloat(amount) > currentBalance) {
      toast.error(
        "Invalid withdrawal amount. Please check your balance and ensure amount is greater than 500."
      );
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token") || Cookies.get("token");
      const apiUrl = `${server}/payment/request`;

      const requestData = {
        userId,
        fullName,
        userEmail,
        phone,
        amount: parseFloat(amount),
      };

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", response.data);

      toast.success("Withdrawal request successful!");

      // Reset form after successful submission
      e.target.reset();
      setFormData({
        fullName: "",
        userEmail: "",
        phone: "",
        amount: "",
      });
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      toast.error("Failed to withdraw money. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-center text-2xl font-bold mb-6">Withdraw Money</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="fullName"
              className="text-gray-700 text-sm font-bold mb-2"
            >
              Full Name
            </label>
            <input
              className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="fullName"
              type="text"
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="userEmail"
              className="text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="userEmail"
              type="email"
              placeholder="example@example.com"
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="phone"
              className="text-gray-700 text-sm font-bold mb-2"
            >
              Phone Number
            </label>
            <input
              className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="phone"
              type="tel"
              placeholder="123-456-7890"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6 flex flex-col">
            <label
              htmlFor="amount"
              className="text-gray-700 text-sm font-bold mb-2"
            >
              Amount to Withdraw
            </label>
            <input
              className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-[#29625d] hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 text-xs mt-3">
          Please fill out all fields to withdraw money.
        </p>
      </div>
    </div>
  );
};

export default WithdrawForm;

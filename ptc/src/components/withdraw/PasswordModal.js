// PasswordModal.js
import React, { useState } from "react";
import axios from "axios";
import { server } from "../../utils/server";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
const PasswordModal = ({ isOpen, onClose, onConfirm, userId }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || Cookies.get("token");
      const passwordVerificationUrl = `${server}/auth/verify-password`;

      const response = await axios.post(passwordVerificationUrl, { password }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.valid) {
        onConfirm(); // Continue with withdrawal
        onClose(); // Close the modal
      } else {
        toast.error("Incorrect password. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to verify password. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose} // Close modal when clicking outside of it
        ></div>
        {/* Modal Content */}
        <div className="relative bg-white p-6 rounded shadow-md w-80 z-10">
          <h3 className="text-lg font-bold mb-4">Confirm Password</h3>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            className="border p-2 w-full mb-4"
            required
          />
          <div className="flex justify-between">
            <button
              onClick={handleConfirm}
              className="bg-green-500 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Confirm"}
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default PasswordModal;

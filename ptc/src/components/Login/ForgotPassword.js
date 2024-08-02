import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../utils/server";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false); // State for processing indicator

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show processing indicator
    setProcessing(true);

    try {
      const response = await axios.post(
        `${server}/auth/forgot-password`,
        { email }
      );

      toast.success(response.data.message);
      navigate("/login"); // Redirect to login page after successful request
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while sending the reset email.");
        console.error(err);
      }
    } finally {
      // Hide processing indicator after submission completes
      setProcessing(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-5 lg:px-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-photo/3d-background-with-white-cubes_23-2150472987.jpg?w=740&t=st=1721891400~exp=1721892000~hmac=db9b4f51e16fe1fa160a80869b1a91d4a227b998f1926a75a875c9d60fefb509')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "0.5", // Adjust opacity as needed
        }}
      ></div>
      <div className="absolute inset-0 bg-[#fed592] opacity-50 z-0"></div>

      <div className="max-w-screen-xl md:w-3/5 sm:w-full bg-white border sm:rounded-lg flex flex-col md:flex-row justify-center relative z-10 shadow-3xl">
        <div className="md:w-1/2 bg-[#29625d] text-center py-12 px-6 md:px-12 rounded-md">
          <div className="my-auto">
            <h1 className="text-3xl font-extrabold text-white">
              Reset Password
            </h1>
            <p className="mt-4 text-sm text-gray-200">
              Enter your email address to receive a password reset link
            </p>
          </div>
        </div>
        <div className="md:w-1/2 p-6 sm:p-12 bg-white rounded-lg relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl mb-4 font-bold text-[#29625d]">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <div className="mb-4">
                <input
                  className="input-field text-sm p-2 w-full border rounded-md focus:border-[#29625d] focus:outline-none"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 rounded-lg bg-[#29625d] text-white font-semibold transition duration-300 hover:bg-[#fed592] shadow-md"
                disabled={processing} // Disable button during processing
              >
                {processing ? "Processing..." : "Send Reset Link"}
              </button>
            </form>
            <p className="mt-8 text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-[#29625d] font-semibold">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

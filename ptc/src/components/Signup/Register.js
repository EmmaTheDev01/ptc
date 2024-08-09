import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { GoogleLogin } from "react-google-login";
import { server } from "../../utils/server";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import LoadingOverlayComponent from "../LoadingOverlayComponent";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (response) => {
    try {
      const googleToken = response.tokenId;

      const googleResponse = await axios.post(
        `${server}/auth/google`,
        { token: googleToken },
        { withCredentials: true }
      );

      toast.success("Google Signup Success!");
      localStorage.setItem("token", googleResponse.data.token);
      localStorage.setItem("role", googleResponse.data.role);
      navigate("/earn");
    } catch (err) {
      console.error("Google signup error:", err);
      toast.error("Google signup failed. Please try again.");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google signup error:", error);
    toast.error("Google signup failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show loading indicator
    setLoading(true);

    try {
      const res = await axios.post(
        `${server}/auth/register`,
        {
          username,
          email,
          password,
          phone,
          referredBy,
        },
        { withCredentials: true }
      );

      toast.success("Signup Success!");
      navigate("/login");
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred during signup.");
        console.error(err);
      }
    } finally {
      // Hide loading indicator after submission completes
      setLoading(false);
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

      {/* Content */}
      <div className="max-w-screen-xl md:w-3/5 sm:w-full bg-white border sm:rounded-lg flex flex-col md:flex-row justify-center relative z-10 shadow-3xl">
        <div className="md:w-1/2 bg-[#29625d] text-center py-12 px-6 md:px-12 rounded-md">
          <div className="my-auto">
            <h1 className="text-3xl font-extrabold text-white">
              Start your journey with us!
            </h1>
            <p className="mt-4 text-sm text-gray-200">
              Enter your details to create your account
            </p>
            <GoogleLogin
              clientId="YOUR_GOOGLE_CLIENT_ID"
              buttonText="Continue with Google"
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              cookiePolicy={"single_host_origin"}
              className="btn-google w-full py-3 mt-3 rounded-full bg-white text-[#29625d] font-semibold transition duration-300 hover:bg-white shadow-md"
            />
          </div>
        </div>
        <div className="md:w-1/2 p-6 sm:p-12 bg-white rounded-lg relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl mb-4 font-bold text-[#29625d]">
              Create account
            </h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <div className="mb-4">
                <input
                  className="input-field p-2 w-full border text-sm rounded-md focus:border-[#29625d] focus:outline-none"
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  className="input-field p-2 w-full border text-sm rounded-md focus:border-[#29625d] focus:outline-none"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  className="input-field p-2 w-full border text-sm rounded-md focus:border-[#29625d] focus:outline-none"
                  type="tel"
                  placeholder="Enter your phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  className="input-field p-2 w-full border text-sm rounded-md focus:border-[#29625d] focus:outline-none"
                  type="text"
                  placeholder="Referral Code (optional)"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <input
                  className="input-field p-2 w-full border text-sm rounded-md focus:border-[#29625d] focus:outline-none"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-3 rounded-lg bg-[#29625d] text-white font-semibold transition duration-300 hover:bg-[#fed592] shadow-md"
                disabled={loading} // Disable button during processing
              >
                {loading ? <LoadingOverlayComponent/> : "Sign Up"}
              </button>
            </form>
            <p className="mt-8 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#29625d] font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;

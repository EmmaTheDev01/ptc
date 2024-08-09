import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "react-google-login";
import { server } from "../../utils/server";
import LoadingOverlay from "./LoadingOverlay"; // Import the overlay component

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false); // State for processing indicator

  const handleGoogleSuccess = async (response) => {
    try {
      const googleToken = response.tokenId;

      const googleResponse = await axios.post(
        `${server}/auth/google`,
        { token: googleToken },
        { withCredentials: true }
      );

      // Call login from AuthContext with token and role
      login(googleResponse.data.token, googleResponse.data.role);
      toast.success("Login Successful!");

      // Add a delay before navigation
      setTimeout(() => navigate("/earn"), 500); // 500ms delay
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login error:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show processing indicator
    setProcessing(true);

    try {
      const response = await axios.post(
        `${server}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // Call login from AuthContext with token and role
      login(response.data.token, response.data.role);
      toast.success("Login Successful!");

      // Add a delay before navigation
      setTimeout(() => navigate("/earn"), 500); // 500ms delay
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
        window.location.reload();
      } else {
        toast.error("An error occurred during login.");
        console.error(err);
        window.location.reload();
      }
    } finally {
      // Hide processing indicator after submission completes
      setProcessing(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-5 lg:px-0">
      {/* Background Image */}
      <ToastContainer />
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
              Welcome Back!
            </h1>
            <p className="mt-4 text-sm text-gray-200">
              Enter your details to log into your account
            </p>
            <div className="mt-8">
              <GoogleLogin
                clientId="YOUR_GOOGLE_CLIENT_ID"
                buttonText="Continue with Google"
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                cookiePolicy={"single_host_origin"}
                className="btn-google w-full py-3 rounded-full bg-white text-[#29625d] font-semibold transition duration-300 hover:bg-white shadow-md"
              />
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-6 sm:p-12 bg-white rounded-lg relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl mb-4 font-bold text-[#29625d]">Login</h2>
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
              <div className="mb-6">
                <input
                  className="input-field text-sm p-2 w-full border rounded-md focus:border-[#29625d] focus:outline-none"
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
                disabled={processing} // Disable button during processing
              >
                {processing ? "Processing..." : "Sign In"}
              </button>
            </form>
            <p className="mt-8 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#29625d] font-semibold">
                Sign Up
              </Link>
            </p>
            <p className="mt-4 text-sm text-gray-600">
              <Link to="/forgot-password" className="text-[#29625d] font-semibold">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Render loading overlay if processing */}
      {processing && <LoadingOverlay />}
    </div>
  );
};

export default Login;

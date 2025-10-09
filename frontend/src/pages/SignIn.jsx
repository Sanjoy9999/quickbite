import React, { useState } from "react";
import { PiEyeClosedBold } from "react-icons/pi";
import { PiEyeBold } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { MdEmail, MdLock, MdRestaurant } from "react-icons/md";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

// ...existing code...

const handleGoogleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // For Sign In with Google - only send email and name
    // Backend will find existing user by email
    const { data } = await axios.post(
      `${serverUrl}/api/auth/google-signin`,
      {
        fullName: result.user.displayName,
        email: result.user.email,
      },
      { withCredentials: true }
    );
    dispatch(setUserData(data));
    setErr("");
  } catch (error) {
    setErr(error?.response?.data?.message || "Error with Google authentication. Please try again.");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#ff4d2d]/10 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-[#ff4d2d]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-100/30 to-red-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2d]/20 via-orange-300/20 to-[#ff4d2d]/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>

          {/* Header with Logo */}
          <div className="text-center mb-8 transform transition-all duration-700 hover:scale-105">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2d]/20 to-orange-300/20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-full shadow-lg">
                <MdRestaurant className="text-[#ff4d2d] w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff4d2d] to-orange-600 bg-clip-text text-transparent mb-2">
              QuickBite
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sign In to continue to your account to get delicious food
              deliveries to your door.
            </p>
          </div>

          {/* Error Message */}
          {err && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl transform animate-shake">
              <p className="text-red-600 text-center font-medium">⚠️ {err}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6 group transform transition-all duration-300 hover:scale-105">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <MdEmail className="text-[#ff4d2d]" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md pl-12"
                placeholder="Enter your email address..."
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6 group transform transition-all duration-300 hover:scale-105">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <MdLock className="text-[#ff4d2d] cursor-pointer" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md pl-12 pr-12"
                placeholder="Enter your password..."
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <MdLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#ff4d2d] transition-colors duration-300 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <PiEyeClosedBold size={20} />
                ) : (
                  <PiEyeBold size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <button
              type="button"
              className="text-sm text-[#ff4d2d] font-semibold hover:text-[#e64323] transition-colors duration-300 hover:underline cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            className="group relative w-full bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden mb-4 cursor-pointer"
            onClick={handleSignIn}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                <>
                  <MdLock className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>Sign In</span>
                </>
              )}
            </div>
          </button>

          {/* Google Sign In */}
          <button
            className="group w-full flex items-center justify-center gap-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-4 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-white/90 cursor-pointer"
            onClick={handleGoogleAuth}
          >
            <FcGoogle
              size={24}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-gray-700">Sign in with Google</span>
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-8 p-4 bg-gray-50/50 rounded-2xl backdrop-blur-sm">
            <p className="text-gray-600">
              Want to create a new account?{" "}
              <button
                type="button"
                className="text-[#ff4d2d] font-semibold hover:text-[#e64323] transition-colors duration-300 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}

export default SignIn;

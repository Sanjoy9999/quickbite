import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { MdEmail, MdLock, MdVerifiedUser } from "react-icons/md";
import { FaKey } from "react-icons/fa";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      console.log(result);
      setErr("");
      setStep(2);
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(result);
      setErr("");
      setStep(3);
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setErr("Passwords don't match");
      return null;
    }
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      setErr("");
      console.log(result);
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return <MdEmail className="text-[#ff4d2d] w-12 h-12" />;
      case 2:
        return <MdVerifiedUser className="text-[#ff4d2d] w-12 h-12" />;
      case 3:
        return <FaKey className="text-[#ff4d2d] w-12 h-12" />;
      default:
        return <MdEmail className="text-[#ff4d2d] w-12 h-12" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Enter Your Email";
      case 2:
        return "Verify OTP";
      case 3:
        return "Reset Password";
      default:
        return "Forgot Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "We'll send you a verification code";
      case 2:
        return "Enter the code sent to your email";
      case 3:
        return "Create your new secure password";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#ff4d2d]/10 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-[#ff4d2d]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-100/30 to-red-100/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
          
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2d]/20 via-orange-300/20 to-[#ff4d2d]/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/signin")}
              className="group flex items-center justify-center w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-white/20"
            >
              <IoIosArrowRoundBack
                size={24}
                className="text-[#ff4d2d] group-hover:text-[#e64323] transition-colors duration-300"
              />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff4d2d] to-orange-600 bg-clip-text text-transparent">
              Forgot Password
            </h1>
          </div>

          {/* Step Progress */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step >= stepNum
                        ? "bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-8 h-1 mx-2 rounded transition-all duration-300 ${
                        step > stepNum ? "bg-[#ff4d2d]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Icon & Title */}
          <div className="text-center mb-8 transform transition-all duration-700 hover:scale-105">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2d]/20 to-orange-300/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-full shadow-lg">
                <div className="animate-bounce">{getStepIcon()}</div>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{getStepTitle()}</h2>
            <p className="text-gray-600 text-sm">{getStepDescription()}</p>
          </div>

          {/* Error Message */}
          {err && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl transform animate-shake">
              <p className="text-red-600 text-center font-medium">⚠️ {err}</p>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-6 transform animate-slideIn">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MdEmail className="text-[#ff4d2d]" />
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md pl-12"
                    placeholder="Enter your email address..."
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button
                className="group relative w-full bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                onClick={handleSendOtp}
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <ClipLoader size={20} color="#fff" />
                  ) : (
                    <>
                      <MdEmail className=" transition-transform duration-300" />
                      <span>Send OTP</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6 transform animate-slideIn">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MdVerifiedUser className="text-[#ff4d2d]" />
                  Verification Code *
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md pl-12 text-center text-2xl tracking-widest"
                    placeholder="Enter OTP..."
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    maxLength="6"
                  />
                  <MdVerifiedUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button
                className="group relative w-full bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <ClipLoader size={20} color="#fff" />
                  ) : (
                    <>
                      <MdVerifiedUser className="group-hover:rotate-12 transition-transform duration-300" />
                      <span>Verify OTP</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <div className="space-y-6 transform animate-slideIn">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MdLock className="text-[#ff4d2d]" />
                  New Password *
                </label>
                <div className="relative">
                  <input
                    required
                    type="password"
                    className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md pl-12"
                    placeholder="Enter new password..."
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                  />
                  <MdLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MdLock className="text-[#ff4d2d]" />
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    required
                    type="password"
                    className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md pl-12"
                    placeholder="Confirm new password..."
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    value={confirmNewPassword}
                  />
                  <MdLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <button
                className="group relative w-full bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                onClick={handleResetPassword}
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <ClipLoader size={20} color="#fff" />
                  ) : (
                    <>
                      <FaKey className="group-hover:rotate-12 transition-transform duration-300" />
                      <span>Reset Password</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;

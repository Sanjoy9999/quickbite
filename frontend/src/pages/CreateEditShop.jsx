import React, { useState, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils, FaStore, FaMapMarkerAlt, FaImage } from "react-icons/fa";
import { MdLocationCity, MdLocationOn } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

function CreateEditShop() {
  const navigate = useNavigate();
  const myShopData = useSelector((state) => state.owner.myShopData);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );
  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || ""
  );
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("state", state);
      formData.append("city", city);
      formData.append("address", address);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setMyShopData(result.data));

      // Success animation delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error creating/updating shop:", error);
    } finally {
      setIsLoading(false);
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

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-white/20"
        >
          <IoMdArrowBack
            size={24}
            className="text-[#ff4d2d] group-hover:text-[#e64323] transition-colors duration-300"
          />
        </button>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2d]/20 via-orange-300/20 to-[#ff4d2d]/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>

          {/* Header Section */}
          <div className="text-center mb-8 transform transition-all duration-700 hover:scale-105">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2d]/20 to-orange-300/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-full shadow-lg">
                <FaStore className="text-[#ff4d2d] w-12 h-12 animate-bounce" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-2 bg-gradient-to-r from-[#ff4d2d] to-orange-600 bg-clip-text ">
              {myShopData ? "Edit Your Shop Details" : "Create Your Food Shop"}
            </h1>
            <p className="text-gray-600 text-sm">
              {myShopData
                ? "Update your shop information"
                : "Set up your culinary business today"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Name */}
            <div className="group transform transition-all duration-300 hover:scale-105">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FaStore className="text-[#ff4d2d]" />
                Shop Name *
              </label>
              <input
                type="text"
                placeholder="Enter your restaurant name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
                required
              />
            </div>

            {/* Shop Image */}
            <div className="group transform transition-all duration-300 hover:scale-105">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FaImage className="text-[#ff4d2d]" />
                Shop Image *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ff4d2d] file:text-white hover:file:bg-[#e64323] file:cursor-pointer file:transition-all file:duration-300 cursor-pointer shadow-sm hover:shadow-md"
                  required={!myShopData}
                />
              </div>

              {/* Image Preview */}
              {frontendImage && (
                <div className="mt-4 transform transition-all duration-500 hover:scale-105">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg border-4 border-white group">
                    <img
                      src={frontendImage}
                      alt="Shop preview"
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium drop-shadow-lg">
                        Shop Preview
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State */}
              <div className="group transform transition-all duration-300 hover:scale-105">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MdLocationOn className="text-[#ff4d2d]" />
                  State *
                </label>
                <input
                  type="text"
                  placeholder="Enter state..."
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
                  required
                />
              </div>

              {/* City */}
              <div className="group transform transition-all duration-300 hover:scale-105">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MdLocationCity className="text-[#ff4d2d]" />
                  City *
                </label>
                <input
                  type="text"
                  placeholder="Enter city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="group transform transition-all duration-300 hover:scale-105">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FaMapMarkerAlt className="text-[#ff4d2d]" />
                Complete Address *
              </label>
              <textarea
                rows={4}
                placeholder="Enter your complete shop address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 resize-none shadow-sm hover:shadow-md"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{myShopData ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <FaStore className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>{myShopData ? "Update Shop" : "Create Shop"}</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEditShop;

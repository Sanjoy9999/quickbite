import React, { useState, useRef, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils, FaImage, FaRupeeSign } from "react-icons/fa";
import { MdCategory, MdFastfood } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

function EditItem() {
  const navigate = useNavigate();
  const myShopData = useSelector((state) => state.owner.myShopData);
  const {itemId} = useParams();
  const [currentItem, setCurrentItem] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState( "Veg");
  const [isLoading, setIsLoading] = useState(false);
  
  const categories = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers",
    "Sandwiches", "South Indian", "North Indian", "Chinese", "Fast Food", "Others",
  ];
  
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
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/item/edit-food-item/${itemId}`,
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
      console.error(error);
    } finally {
      setIsLoading(false);

    }
  };

  useEffect(()=>{
    const handleGetItemById = async()=>{
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`,{withCredentials:true});
        setCurrentItem(result.data);
      } catch (error) {
        console.log(error)
      }
    }
    handleGetItemById();
  },[itemId])


  useEffect(()=>{
    setName(currentItem?.name || "");
    setPrice(currentItem?.price || 0);
    setCategory(currentItem?.category || "");
    setFoodType(currentItem?.foodType || "Veg");
    setFrontendImage(currentItem?.image || null);
  },[currentItem])

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
      <div className="relative w-full max-w-lg mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
          
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2d]/20 via-orange-300/20 to-[#ff4d2d]/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
          
          {/* Header Section */}
          <div className="text-center mb-8 transform transition-all duration-700 hover:scale-105">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d2d]/20 to-orange-300/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-full shadow-lg">
                <FaUtensils className="text-[#ff4d2d] w-12 h-12 animate-bounce" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-2 bg-gradient-to-r from-[#ff4d2d] to-orange-600 bg-clip-text text-transparent">
              Edit Delicious Food Item
            </h1>
            <p className="text-gray-600 text-sm">
              Share your culinary masterpiece with hungry customers
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Food Name */}
            <div className="group transform transition-all duration-300 hover:scale-105">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <MdFastfood className="text-[#ff4d2d]" />
                Food Name *
              </label>
              <input
                type="text"
                placeholder="Enter delicious food name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
                required
              />
            </div>

            {/* Food Image */}
            <div className="group transform transition-all duration-300 hover:scale-105">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FaImage className="text-[#ff4d2d]" />
                Food Image *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ff4d2d] file:text-white hover:file:bg-[#e64323] file:cursor-pointer file:transition-all file:duration-300 cursor-pointer shadow-sm hover:shadow-md"
                    required={!currentItem?.image}
                />
              </div>
              
              {/* Image Preview */}
              {frontendImage && (
                <div className="mt-4 transform transition-all duration-500 hover:scale-105">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg border-4 border-white">
                    <img
                      src={frontendImage}
                      alt="Food preview"
                      className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Price */}
              <div className="group transform transition-all duration-300 hover:scale-105">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FaRupeeSign className="text-[#ff4d2d]" />
                  Price *
                </label>
                <input
                  type="number"
                  placeholder="₹ 0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
                  required
                  min="1"
                />
              </div>

              {/* Food Type */}
              <div className="group transform transition-all duration-300 hover:scale-105">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <div className={`w-3 h-3 rounded-full ${foodType === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  Food Type *
                </label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                  required
                >
                  <option value="Veg">🥬 Veg</option>
                  <option value="Non-Veg">🍖 Non-Veg</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="group transform transition-all duration-300 hover:scale-105">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <MdCategory className="text-[#ff4d2d]" />
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                required
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
                    <span>Editing Item...</span>
                  </>
                ) : (
                  <>
                    <FaUtensils className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Edit Food Item</span>
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

export default EditItem;

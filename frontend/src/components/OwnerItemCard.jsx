import React from "react";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";

function OwnerItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleDeleteItem = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete-item/${data._id}`,{
        withCredentials: true
      })
      dispatch(setMyShopData(result.data))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="group w-full max-w-2xl mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-red-300 hover:border-[#ff4d2d]/30 backdrop-blur-sm">
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d2d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        
        <div className="flex h-40">
          {/* Image Section */}
          <div className="w-40 h-full flex-shrink-0 relative overflow-hidden rounded-l-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
            {/* Floating food type badge */}
            <div className="absolute top-2 left-2 z-20">
              <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-md backdrop-blur-sm ${
                data.foodType === 'Veg' 
                  ? 'bg-green-100/90 text-green-800 border border-green-300' 
                  : 'bg-red-100/90 text-red-800 border border-red-300'
              }`}>
                {data.foodType}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-between p-6 flex-1 relative z-20">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-[#ff4d2d] transition-colors duration-300 line-clamp-2">
                {data.name}
              </h2>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ff4d2d] rounded-full"></span>
                  <span className="font-medium">Category:</span>
                  <span className="text-gray-700">{data.category}</span>
                </p>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#ff4d2d] group-hover:scale-110 transition-transform duration-300">
                  ₹{data.price}
                </span>
                <span className="text-xs text-gray-500">per item</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 cursor-pointer transform transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                  onClick={() => navigate(`/edit-food-item/${data._id}`)}
                >
                  <FaPen size={14} />
                </button>
                
                <button 
                  className="p-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 cursor-pointer transform transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                  onClick={() => {if(window.confirm("Are you sure you want to delete this item?")){ handleDeleteItem() }}}
                >
                  <FaTrashAlt size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animated border on hover */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#ff4d2d]/20 transition-all duration-300"></div>
        
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff4d2d]/20 via-orange-300/20 to-[#ff4d2d]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
      </div>
    </div>
  );
}

export default OwnerItemCard;

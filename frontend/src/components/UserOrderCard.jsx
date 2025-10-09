import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdLocationOn, 
  MdPayment, 
  MdShoppingCart,
  MdStore,
  MdDateRange,
  MdReceipt,
  MdOutlineDeliveryDining ,
  MdCheckCircle
} from "react-icons/md";
import { FaRupeeSign, FaClock, FaEye } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import axios from "axios";
import {serverUrl} from "../App";


const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();


  const  [selectedRating,setSelectedRating] = useState({}); //itemId : rating

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const handleRating = async(itemId,rating)=>{
    try {
      const result = await axios.post(`${serverUrl}/api/item/rating`,{
        itemId,
        rating},{withCredentials:true});
        setSelectedRating(prev=>({...prev,[itemId]:rating}))
    } catch (error) {
      console.log("Error in submitting rating",error);
    }
  }

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MdReceipt className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide">
                  Order #{data._id.slice(-6).toUpperCase()}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-blue-100">
                  <MdDateRange className="text-sm" />
                  <p className="text-sm">{formatDate(data.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="flex items-center gap-2">
                <MdPayment className="text-lg" />
                <p className="text-sm font-semibold">
                  {data.paymentMethod === "cod" ? "COD" : "Online"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Payment Method Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <MdPayment className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Payment Method</p>
              {data.paymentMethod === "cod" ? (
                <p className="text-lg font-bold text-orange-700">Cash On Delivery</p>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-bold text-green-700">Online Payment</p>
                  {data.payment && (
                    <MdCheckCircle className="text-green-600 text-xl" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shop Orders Section */}
        {data.shopOrders?.map((shopOrder, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 shadow-lg space-y-4"
          >
            {/* Shop Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-purple-200">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <MdStore className="text-white text-xl" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  From <span className="text-purple-600">{shopOrder.shop.name}</span> Shop
                </p>
                <p className="text-xs text-gray-600">Restaurant Partner</p>
              </div>
            </div>

            {/* Order Items Grid */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <BsBoxSeam className="text-orange-600 text-lg" />
                <h4 className="text-lg font-bold text-gray-800">Order Items</h4>
                <span className="ml-auto bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {shopOrder.shopOrderItems.length} Items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopOrder.shopOrderItems.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl border-2 border-gray-100 overflow-hidden transition-all duration-300"
                  >
                    <div className="relative overflow-hidden h-32">
                      <img
                        src={item.item.image}
                        alt={item.item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        x{item.quantity}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">
                        {item.item.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          <FaRupeeSign className="inline text-xs" />
                          {item.item.price} × {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-orange-600">
                          <FaRupeeSign className="inline text-xs" />
                          {item.item.price * item.quantity}
                        </span>
                      </div>
                      
                     <div className="flex flex-col items-start">
                       {shopOrder.status === "delivered" && (
                        <div className="flex space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star,index) => (
                          <button key={index} className={` cursor-pointer text-2xl ${selectedRating[item.item._id] >= star ? "text-yellow-400":"text-gray-400"}`}
                          onClick={() => handleRating(item.item._id,star)}
                          >☆</button>
                        ))}
                        </div>
                      )}
                     </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop Order Status & Subtotal */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/60 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <FaClock className="text-purple-600 text-lg" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">Status</p>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-bold mt-1 shadow-sm ${
                      shopOrder.status === "pending"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900"
                        : shopOrder.status === "preparing"
                        ? "bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900"
                        : shopOrder.status === "out of delivery"
                        ? "bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900"
                        : "bg-gradient-to-r from-green-400 to-green-500 text-green-900"
                    }`}
                  >
                    {shopOrder.status === "pending" && "⏳"}
                    {shopOrder.status === "preparing" && "👨‍🍳"}
                    {shopOrder.status === "out of delivery" && "🏍️"}
                    {shopOrder.status === "delivered" && "✅"}
                    <span className="uppercase tracking-wide">
                      {shopOrder.status}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">Subtotal</p>
                <div className="flex items-center gap-1 text-2xl font-bold text-purple-700">
                  <FaRupeeSign className="text-lg" />
                  <span>{shopOrder.subTotal}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Total Section & Track Button */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
            <div className="text-center sm:text-left">
              <p className="text-sm opacity-90 font-medium">Grand Total</p>
              <div className="flex items-center gap-1 text-4xl font-bold mt-1">
                <FaRupeeSign className="text-3xl" />
                <span>{data.totalAmount}</span>
              </div>
              <p className="text-xs opacity-75 mt-1">All charges included</p>
            </div>
            
            <button
              className="group bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/track-order/${data._id}`)}
            >
              <MdOutlineDeliveryDining  className="text-2xl group-hover:scale-110 transition-transform duration-300" />
              <span>Live Track Order</span>
              <FaEye className="text-lg group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderCard;

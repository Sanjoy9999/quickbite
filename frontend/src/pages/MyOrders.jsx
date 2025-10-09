import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { setMyOrders, setUpdateRealTimeOrderStatus } from "../redux/userSlice";

const MyOrders = () => {
  const { userData, myOrders,socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

useEffect(()=>{
    socket?.on("newOrder",(data)=>{
      console.log("📦 New order received via socket:", data); // Debug log
      
      // Check if the order belongs to this owner
      if(data?.shopOrders?.[0]?.owner?._id === userData?._id){
        // Ensure the order has the required structure before adding
        if (data.shopOrders && data.shopOrders.length > 0 && data.shopOrders[0].shopOrderItems) {
          dispatch(setMyOrders([data, ...myOrders]));
        } else {
          console.warn("⚠️ Received incomplete order data:", data);
        }
      }
    })

    socket?.on("updateStatus",({orderId,shopId,status,userId})=>{
      if(userId === userData?._id){
        dispatch(setUpdateRealTimeOrderStatus({orderId,shopId,status}) );
      }
    })

    

    return ()=>{
      socket?.off("newOrder");
      socket?.off("updateStatus");
    }
},[socket, myOrders, userData])


  return (
    <div className="w-full min-h-screen bg-[#fef4ef] flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">
        {/* Back Button */}
        <div className="absolute top-3 left-6">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-white/20 cursor-pointer"
          >
            <IoMdArrowBack
              size={24}
              className="text-[#ff4d2d] group-hover:text-[#e64323] transition-colors duration-300"
            />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-center mb-5">My Orders</h1>

        {myOrders?.length === 0 ? (
          <p className="text-center text-2xl text-gray-800 mt-20">No order found.</p>
        ) : (
          <div className="space-y-6">
            {myOrders?.map((order, index) =>
              userData.role == "user" ? (
                <UserOrderCard key={index} data={order} />
              ) : userData.role == "owner" ? (
                <OwnerOrderCard key={index} data={order} />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

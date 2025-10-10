import React from "react";
import { CiTrash } from "react-icons/ci";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeCartItem, updateQuantity } from "../redux/userSlice";

const CartItemCard = ({ data }) => {
  const dispatch = useDispatch();
  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  return (
   <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <img
            src={data.image}
            alt={data.name}
            className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-full object-cover rounded-xl border-2 border-orange-200 shadow-md"
          />
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold">
            {data.quantity}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
            {data.name}
          </h1>
          <p className="text-sm text-gray-500 mb-1">
            ₹{data.price} × {data.quantity}
          </p>
          <p className="font-bold text-lg sm:text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-100 rounded-full p-1">
          <button
            className="p-2 bg-white rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 shadow-sm"
            onClick={() => handleDecrease(data.id, data.quantity)}
          >
            <FaMinus size={14} />
          </button>
          <span className="px-4 py-2 font-semibold text-gray-800 min-w-[40px] text-center">
            {data.quantity}
          </span>
          <button
            className="p-2 bg-white rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 shadow-sm"
            onClick={() => handleIncrease(data.id, data.quantity)}
          >
            <FaPlus size={14} />
          </button>
        </div>
        
        <button 
          className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200 shadow-sm ml-2"
          onClick={() => dispatch(removeCartItem(data.id))}
        >
          <CiTrash size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;

import React from "react";
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";


const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = React.useState(0);
  const dispatch = useDispatch();//This useDispatch hook need to store data in redux store
  const {cartItems} = useSelector(state=>state.user) //to get data from redux store

   // Check if item is in cart
  const isInCart = cartItems.some(i => i.id === data._id);


  const renderStar = (rating) => {
    //rating - 3
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-2xl" />
        ) : (
          <CiStar key={i} className="text-yellow-500 text-2xl" />
        )
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };

  return (
    <div className="group w-[250px] rounded-2xl border-2 border-[#ff4d2d]/30 hover:border-[#ff4d2d] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:translate-y-[-8px] overflow-hidden">
      <div className="relative w-full h-[170px] bg-gradient-to-b from-red-50 to-orange-50 overflow-hidden">
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-white z-10 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {data.foodType == "Veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>

        {/* Category Tag */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-[#ff4d2d] shadow-md transform transition-transform duration-300 opacity-0 group-hover:opacity-100">
          {data.category || "Food"}
        </div>

        <div className="w-full h-full overflow-hidden">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 border-b border-gray-100">
        <h1 className="font-bold text-gray-900 text-lg truncate group-hover:text-[#ff4d2d] transition-colors duration-300">
          {data.name}
        </h1>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex gap-0.5">
            {renderStar(data.rating?.average || 0)}
          </div>
          <span className="text-xs text-gray-600 ml-1 bg-yellow-50 px-1.5 py-0.5 rounded-full">
            {data.rating?.count || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50/30">
        <span className="font-bold text-[#ff4d2d] text-xl transform transition-all duration-300 group-hover:scale-105">
          ₹{data.price}
        </span>
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-md bg-white">
          <button
            className="px-2 py-1.5 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            onClick={handleDecrease}
          >
            <FaMinus size={10} className="text-gray-700" />
          </button>
          <span className="w-5 text-center font-medium text-gray-800">
            {quantity}
          </span>
          <button
            className="px-2 py-1.5 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            onClick={handleIncrease}
          >
            <FaPlus size={10} className="text-gray-700" />
          </button>
          <button className={`p-2.5 text-white transition-all duration-300 flex items-center justify-center
              ${quantity === 0 && "opacity-50 cursor-not-allowed"} 
              ${isInCart 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-gradient-to-r from-[#ff4d2d] to-orange-600 hover:bg-green-600 hover:from-green-600 hover:to-green-600"
              }`} 
          onClick={()=>
            (quantity > 0) ? dispatch(addToCart({
            id:data._id,
            name:data.name,
            price:data.price,
            image:data.image,
            shop:data.shop,
            quantity:quantity,
            foodType:data.foodType
          })) : null}
          >
            <TiShoppingCart className="text-lg transform transition-all duration-300 group-hover:rotate-12 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

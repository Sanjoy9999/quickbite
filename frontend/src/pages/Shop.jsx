import React from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { FaStore } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import FoodCard from "../components/FoodCard";
import { IoMdArrowBack } from "react-icons/io";

const Shop = () => {
    const navigate = useNavigate();
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const handleShop = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/get-items-by-shop/${shopId}`,
        { withCredentials: true }
      );
      setShop(result.data.shop);
      setItems(result.data.items);
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-orange-100">
         {/* Back Button */}
              <div className="absolute top-6 left-6 z-50">
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
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-80">
          <img src={shop.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              {shop.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <FaLocationDot size={25} color="red" className="mt-4" />
              <p className="text-lg font-medium text-white mt-5">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800"><FaUtensils color="red"/> Our Menu</h2>
       {items.length > 0 ? (
        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
            {items.map((item,indx)=>(
                <FoodCard key={indx} data={item} />
            ))}
        </div>
       ):(
        <h2 className="text-center text-gray-600 text-3xl mt-8">No items available</h2>
       )}
      </div>
    </div>
  );
};

export default Shop;

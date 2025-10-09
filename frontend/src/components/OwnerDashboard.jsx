import React from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "./OwnerItemCard";

function OwnerDashboard() {
  const myShopData = useSelector((state) => state.owner.myShopData);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Nav />
      {!myShopData && (
        <div className="flex justify-content-center items-center padding pr-10 pl-6 sm:p-6 mt-10">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of hungry
                customers, every day.
              </p>
              <button
                className="bg-[#ff4d2d] text-white rounded-full py-2 px-5 sm:px-6 hover:bg-orange-700 font-medium shadow-md transition-colors duration-300 cursor-pointer"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6 mt-10">
          <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
            <FaUtensils className="text-[#ff4d2d] w-12 h-12 sm:w-20 sm:h-20 mb-4" />
            Welcome to {myShopData.name}
          </h1>

          <div className=" shadow-lg rounded-xl  overflow-hidden border  border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">
            <div
              className="absolute top-4 right-7 bg-[#ff4d2d] p-2 rounded-full shadow-md cursor-pointer hover:bg-orange-800"
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen className="text-white w-4 h-4" />
            </div>

            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-48 sm:h-64 object-cover rounded-lg border"
            />
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {myShopData.name}
              </h1>
              <p className="text-gray-500">
                {myShopData.city}, {myShopData.state}
              </p>
              <p className="text-gray-500">{myShopData.address}</p>
            </div>
          </div>

          {myShopData.items.length === 0 && (
            <div className="flex justify-content-center items-center padding pr-10 pl-6 sm:p-6 mt-10">
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add Your Food Items
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                   Share your delicious with our customers by adding them to the menu items.
                  </p>
                  <button
                    className="bg-[#ff4d2d] text-white rounded-full py-2 px-5 sm:px-6 hover:bg-orange-700 font-medium shadow-md transition-colors duration-300 cursor-pointer"
                    onClick={() => navigate("/add-food-item")}
                  >
                    Add Food Item
                  </button>
                </div>
              </div>
            </div>
          )}

          {myShopData.items.length > 0 && <div className="flex  flex-col 
          items-center gap-4 w-full max-w-4xl mb-10">
            {myShopData.items.map((item) => (
              <OwnerItemCard key={item._id} data={item} />
            ))}
          </div>}

        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;

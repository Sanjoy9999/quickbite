import React, { useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FaRobot } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { TbReceipt2 } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { setSearchItems, setUserData } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const myShopData = useSelector((state) => state.owner.myShopData);
  const cartItems = useSelector((state) => state.user.cartItems);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const currentCity = useSelector((state) => state.user.currentCity);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };

    if (showInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo]);

  const handelSearchItems = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true }
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      console.log(error);
      dispatch(setSearchItems(null));
    }
  };

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      handelSearchItems();
    } else {
      // Immediately clear search results when query is empty
      dispatch(setSearchItems(null));
    }

    return () => {};
  }, [query]);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowInfo(false);
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 backdrop-blur-xl border-b border-white/20 shadow-lg overflow-visible">
      {/* Mobile Search Overlay */}
      {showSearch && userData.role == "user" && (
        <div className="w-[90%] h-[70px] bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl items-center gap-[20px] flex fixed top-[90px] left-[5%] md:hidden transform animate-slideDown border border-white/20">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[15px] border-r-[2px] border-[#ff4d2d]/30">
            <div className="p-2 bg-[#ff4d2d]/10 rounded-full">
              <FaLocationDot size={16} className="text-[#ff4d2d]" />
            </div>
            <div className="w-[80%] truncate text-gray-700 font-medium text-sm">
              {currentCity}
            </div>
          </div>
          <div className="flex w-[70%] items-center gap-[10px] px-[15px]">
            <div className="p-2 bg-[#ff4d2d]/10 rounded-full">
              <FaSearch size={14} className="text-[#ff4d2d] cursor-pointer" />
            </div>
            <input
              type="text"
              placeholder="Search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full bg-transparent placeholder-gray-500 font-medium"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      {/* Logo */}
      <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-[#ff4d2d] to-orange-600 bg-clip-text text-transparent drop-shadow-sm"
          onClick={() => navigate("/")}
        >
          QuickBite
        </h1>
      </div>

      {/* Desktop Search Bar */}
      {userData.role == "user" && (
        <div className="md:w-[60%] lg:w-[50%] h-[60px] bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl items-center gap-[20px] hidden md:flex border border-white/20 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center w-[35%] overflow-hidden gap-[12px] px-[20px] border-r-[2px] border-[#ff4d2d]/20">
            <div className="p-2 bg-[#ff4d2d]/10 rounded-full group-hover:bg-[#ff4d2d]/20 transition-all duration-300">
              <FaLocationDot size={18} className="text-[#ff4d2d]" />
            </div>
            <div className="w-[80%] truncate text-gray-700 font-medium">
              {currentCity}
            </div>
          </div>
          <div className="flex w-[65%] items-center gap-[12px] px-[20px]">
            <div className="p-2 bg-[#ff4d2d]/10 rounded-full group-hover:bg-[#ff4d2d]/20 transition-all duration-300">
              <FaSearch size={16} className="text-[#ff4d2d] cursor-pointer" />
            </div>
            <input
              type="text"
              placeholder="Search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full bg-transparent placeholder-gray-500 font-medium"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center gap-[12px]">
        {/* Mobile Search Toggle */}
        {userData.role == "user" &&
          (showSearch ? (
            <button
              className="w-[40px] h-[40px] bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center md:hidden border border-white/20"
              onClick={() => setShowSearch(false)}
            >
              <RxCross2 size={20} className="text-[#ff4d2d]" />
            </button>
          ) : (
            <button
              className="w-[40px] h-[40px] bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center md:hidden border border-white/20"
              onClick={() => setShowSearch(true)}
            >
              <FaSearch size={18} className="text-[#ff4d2d] cursor-pointer" />
            </button>
          ))}

        {/* Cart for Users */}
        {userData.role == "user" && (
          <div className="relative cursor-pointer group">
            <div
              className="w-[45px] h-[45px] bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/20"
              onClick={() => navigate("/cart")}
            >
              <TiShoppingCart
                size={22}
                className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-xs font-bold shadow-lg">
              {cartItems.length}
            </span>
          </div>
        )}

        {/* Owner Actions */}
        {userData.role == "owner" ? (
          <>
            {myShopData && (
              <>
                {/* Desktop Add Food Item */}
                <button
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-[#ff4d2d]/50 text-[#ff4d2d] rounded-xl font-semibold hover:bg-[#ff4d2d] hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  onClick={() => navigate("/add-food-item")}
                >
                  <FaPlus
                    size={18}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                  <span>Add Food Item</span>
                </button>

                {/* Mobile Add Food Item */}
                <button
                  className="md:hidden w-[45px] h-[45px] bg-white/80 backdrop-blur-sm border-2 border-[#ff4d2d]/50 text-[#ff4d2d] rounded-full font-semibold hover:bg-[#ff4d2d] hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                  onClick={() => navigate("/add-food-item")}
                >
                  <FaPlus
                    size={18}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                </button>
              </>
            )}

            {/* Orders Button */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm text-[#ff4d2d] font-semibold border-2 border-[#ff4d2d]/50 hover:bg-[#ff4d2d] hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2
                size={20}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span>My Orders</span>
            </div>

            {/* Mobile Orders */}
            <div
              className="md:hidden flex items-center justify-center cursor-pointer relative w-[45px] h-[45px] rounded-full bg-white/80 backdrop-blur-sm text-[#ff4d2d] font-semibold border-2 border-[#ff4d2d]/50 hover:bg-[#ff4d2d] hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2
                size={20}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </>
        ) : userData.role === "deliveryBoy" ? (
          <>{/* ✅ Desktop My Orders for Delivery Boy */}</>
        ) : (
          <>
            {/* User My Orders */}
            {userData.role === "user" && (
              <button
                className="hidden md:block px-4 py-2 bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white rounded-xl font-semibold hover:from-[#e63a1a] hover:to-[#ff4d2d] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => navigate("/my-orders")}
              >
                My Orders
              </button>
            )}
          </>
        )}

        {/* Profile Avatar */}
        <div
          className="w-[45px] h-[45px] bg-gradient-to-r from-[#ff4d2d] to-orange-600 text-white text-lg rounded-full flex items-center justify-center font-bold cursor-pointer hover:from-[#e63a1a] hover:to-[#ff4d2d] transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl relative group"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          <span className="group-hover:scale-110 transition-transform duration-300">
            {userData?.fullName?.slice(0, 1) || ""}
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Profile Dropdown */}
        {showInfo && (
          <div
            ref={dropdownRef}
            className={`fixed top-[90px] ${
              userData.role == "deliveryBoy"
                ? "right-[10px] md:right-[22%] lg:right-[32%]"
                : userData.role === "admin"
                ? "md:-left-3.5 lg:-left-4"
                : "right-[10px] md:right-[1%] lg:right-[10%]"
            } w-[200px] bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-4 text-center font-medium text-gray-700 gap-3 flex flex-col z-[9999] border border-white/20 transform animate-slideDown`}
          >
            <div className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-200">
              {userData?.fullName}
            </div>
            {/* ✅ Mobile My Orders for User and Delivery Boy */}
            {(userData.role === "user" ) && (
              <div
                className="md:hidden px-3 py-2 text-[#ff4d2d] rounded-xl font-semibold hover:bg-[#ff4d2d]/10 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setShowInfo(false);
                  navigate("/my-orders");
                }}
              >
                My Orders
              </div>
            )}
            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer hover:bg-[#ff4d2d]/10 hover:rounded-xl py-2 transform hover:scale-105 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
            >
              Log Out
            </div>
          </div>
        )}
      </div>

      {/* Add custom animations to CSS */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Nav;

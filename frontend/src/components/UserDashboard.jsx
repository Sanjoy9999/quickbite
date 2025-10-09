import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot"; // ✅ Add this import
import chatBotImage from "../assets/chatbot.gif"
import { FaRobot } from "react-icons/fa"; // ✅ Add this import

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user
  );
  const catScrollRef = useRef();
  const shopScrollRef = useRef();
  const Navigate = useNavigate();
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filterList = itemsInMyCity?.filter(
        (item) => item.category === category
      );
      setUpdatedItemsList(filterList);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;

    if (element) {
      setLeftButton(element.scrollLeft > 0);
      // console.log("Scroll Left",element.scrollLeft)
      // console.log("Client width",element.clientWidth)

      // console.log("Scroll width",element.scrollWidth)

      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  useEffect(() => {
    if (catScrollRef.current && shopScrollRef.current) {
      // Initial button state update
      updateButton(catScrollRef, setShowLeftCateButton, setShowRightCateButton);
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      );

      // Define the handler functions so we can reference them when removing
      const catScrollHandler = () => {
        updateButton(
          catScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      };

      const shopScrollHandler = () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        );
      };

      // Add event listeners with the named functions
      catScrollRef.current.addEventListener("scroll", catScrollHandler);
      shopScrollRef.current.addEventListener("scroll", shopScrollHandler);

      // Clean up function
      return () => {
        if (catScrollRef.current) {
          catScrollRef.current.removeEventListener("scroll", catScrollHandler);
        }
        if (shopScrollRef.current) {
          shopScrollRef.current.removeEventListener(
            "scroll",
            shopScrollHandler
          );
        }
      };
    }
  }, [categories]);

  return (
    <>
      <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff0e8] overflow-y">
        <Nav />

        {searchItems &&
          Array.isArray(searchItems) &&
          searchItems.length > 0 && (
            <div className="w-full max-w-6xl flex flex-col gap-5 items-center p-5 bg-white shadow-md rounded-2xl mt-4">
              <h1 className="text-[#ff4d2d] text-2xl flex text-center sm:text-3xl font-semibold border-b border-gray-200 pb-2 ">
                Search Results
              </h1>
              <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
                {searchItems?.map((item, index) => (
                  <FoodCard key={index} data={item} />
                ))}
              </div>
            </div>
          )}

        {/* Food Categories  */}
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
          <h1 className="text-gray-800 text-2xl sm:text-3xl">
            Inspiration for your first order
          </h1>

          <div className="w-full relative">
            {showLeftCateButton && (
              <button
                className="absolute left-0 lg:-left-10 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 hover:scale-110 transition-transform duration-300 cursor-pointer"
                onClick={() => scrollHandler(catScrollRef, "left")}
              >
                <FaAnglesLeft />
              </button>
            )}

            <div
              className="w-full flex overflow-x-auto gap-4 pb-2 cursor-pointer"
              ref={catScrollRef}
            >
              {categories.map((cat, index) => (
                <CategoryCard
                  key={index}
                  name={cat.category}
                  image={cat.image}
                  onClick={() => handleFilterByCategory(cat.category)}
                />
              ))}
            </div>
            {showRightCateButton && (
              <button
                className="absolute right-0  lg:-right-10 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 hover:scale-110 transition-transform duration-300 cursor-pointer"
                onClick={() => scrollHandler(catScrollRef, "right")}
              >
                <FaAnglesRight />
              </button>
            )}
          </div>
        </div>

        {/* Shop according to your location  */}
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
          <h1 className="text-gray-800 text-2xl sm:text-3xl">
            Best shop in {currentCity}
          </h1>
          <div className="w-full relative">
            {showLeftShopButton && (
              <button
                className="absolute left-0 lg:-left-10 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 hover:scale-110 transition-transform duration-300 cursor-pointer"
                onClick={() => scrollHandler(shopScrollRef, "left")}
              >
                <FaAnglesLeft />
              </button>
            )}

            <div
              className="w-full flex overflow-x-auto gap-4 pb-2 cursor-pointer"
              ref={shopScrollRef}
            >
              {shopInMyCity?.map((shop, index) => (
                <CategoryCard
                  key={index}
                  name={shop.name}
                  image={shop.image}
                  onClick={() => Navigate(`/shop/${shop._id}`)}
                />
              ))}
            </div>
            {showRightShopButton && (
              <button
                className="absolute right-0  lg:-right-10 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 hover:scale-110 transition-transform duration-300 cursor-pointer"
                onClick={() => scrollHandler(shopScrollRef, "right")}
              >
                <FaAnglesRight />
              </button>
            )}
          </div>
        </div>

        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
          <h1 className="text-gray-800 text-2xl sm:text-3xl">
            Suggested food items
          </h1>
          <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
            {updatedItemsList?.map((item, index) => (
              <FoodCard key={index} data={item} />
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Floating Chatbot Button - Only visible on user dashboard */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-40  group cursor-pointer"
        title="Chat with AI Food Assistant"
      >
        {/* <FaRobot
          size={24}
          className="group-hover:scale-110 transition-transform duration-300"
        /> */}
        <img src={chatBotImage} alt="" className="font-sm group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* ✅ Chatbot Component */}
      <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </>
  );
}

export default UserDashboard;

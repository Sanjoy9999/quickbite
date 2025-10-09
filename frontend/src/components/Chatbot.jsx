import React, { useState, useRef, useEffect } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import { FaRobot, FaUser } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm QuickBite's AI food assistant 🤖\n\nI can help you:\n• Find food by name or category\n• Filter by price (under ₹100, ₹150, etc.)\n• Get personalized recommendations\n• Discover popular dishes\n\nWhat are you craving today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("🚀 Sending:", currentMessage);

      const response = await axios.post(
        `${serverUrl}/api/chatbot/chat`,
        { message: currentMessage },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Response:", response.data);

      if (response.data.success) {
        const botResponse = {
          id: Date.now() + 1,
          text: response.data.data.message,
          isBot: true,
          timestamp: new Date(),
          products: response.data.data.products || [],
          recommendations: response.data.data.recommendations || [],
        };

        // ✅ Log what we received
        console.log("Products received:", botResponse.products.length);
        console.log("Product prices:", botResponse.products.map((p) => p.price));

        setMessages((prev) => [...prev, botResponse]);
      } else {
        throw new Error("Response not successful");
      }
    } catch (error) {
      console.error("❌ Chatbot error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text:
          "Oops! I'm having trouble connecting right now. Please try again! 😅",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ✅ Product Card with price display
  const ProductCard = ({ product }) => {
    const getFoodTypeIcon = (foodType) => {
      if (foodType === "Veg") return "🟢";
      if (foodType === "Non-Veg") return "🔴";
      return "⚪";
    };

    return (
      <div className="bg-white rounded-lg p-3 mb-2 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex gap-3">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={
                product.image ||
                "https://via.placeholder.com/80x80?text=No+Image"
              }
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/80x80?text=Food";
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{getFoodTypeIcon(product.foodType)}</span>
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h4>
                </div>
                <p className="text-xs text-gray-600 mb-1">{product.category}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                  <MdRestaurant className="text-[#ff4d2d] flex-shrink-0" size={14} />
                  {product.shop?.name || 'Restaurant'}
                </p>
                {product.rating?.average > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-yellow-600">⭐</span>
                    <span className="text-xs text-gray-600">
                      {product.rating.average.toFixed(1)} ({product.rating.count || 0})
                    </span>
                  </div>
                )}
              </div>

              {/* Price - Always visible */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-[#ff4d2d] text-base">₹{product.price}</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full inline-block mt-1">
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuickActions = () => {
    const quickQuestions = [
      "🍕 Pizza",
      "💰 Under ₹100",
      "💵 Under ₹150",
      "💸 Under ₹200",
      "⭐ Popular items",
      "💡 Recommend me",
    ];

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => {
              const text = question.replace(/^[^\s]+\s/, ""); // Remove emoji
              setInputMessage(text);
              setTimeout(() => {
                handleSendMessage();
              }, 100);
            }}
            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-all duration-200"
          >
            {question}
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 sm:80 md:w-96 bg:w-1xl h-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <FaRobot className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-bold">QuickBite AI</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-white/90 text-sm">Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.isBot ? "justify-start" : "justify-end"
            } animate-in slide-in-from-bottom-1 duration-200`}
          >
            <div
              className={`flex items-start gap-2 max-w-[85%] ${
                message.isBot ? "" : "flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isBot
                    ? "bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {message.isBot ? <FaRobot size={14} /> : <FaUser size={14} />}
              </div>

              {/* Message Content */}
              <div
                className={`p-3 rounded-2xl ${
                  message.isBot
                    ? "bg-white text-gray-800 border border-gray-200"
                    : "bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] text-white"
                } shadow-sm`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {message.text}
                </p>

                {/* Products */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold mb-2 text-gray-600">
                      🍽️ Found {message.products.length} items:
                    </p>
                    <div className="max-h-80 overflow-y-auto">
                      {message.products.map((product, idx) => (
                        <ProductCard key={`${product._id}-${idx}`} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold mb-2 text-gray-600">
                      💡 You Might Like:
                    </p>
                    <div className="max-h-64 overflow-y-auto">
                      {message.recommendations.map((product, idx) => (
                        <ProductCard key={`rec-${product._id}-${idx}`} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {index === 0 && message.isBot && <QuickActions />}

                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-in slide-in-from-bottom-1 duration-200">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] text-white rounded-full flex items-center justify-center">
                <FaRobot size={14} />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#ff4d2d] rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-[#ff4d2d] rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#ff4d2d] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Try: pizza, under ₹100, recommend me..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/20 text-sm transition-all duration-200"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] text-white p-3 rounded-full hover:from-[#e64528] hover:to-[#ff4d2d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            <IoSend size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💬 Try: "under ₹100" | "under ₹150" | "pizza" | "recommend me"
        </p>
      </div>
    </div>
  );
};

export default Chatbot;

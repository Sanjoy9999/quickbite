import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center">
    
          <h1 className="text-9xl md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 leading-none">
            404
          </h1>
      

        {/* Food Emojis Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center gap-4 mb-8 text-6xl"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0 }}
          >
            🍕
          </motion.span>
          <motion.span
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
          >
            🍔
          </motion.span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
          >
            🍟
          </motion.span>
          <motion.span
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
          >
            🍜
          </motion.span>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found 😢
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            Looks like this dish is not on our menu!
          </p>
          <p className="text-base md:text-lg text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Decorative Food Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex justify-center gap-3 mb-10 text-3xl flex-wrap"
        >
          <span>🌮</span>
          <span>🍝</span>
          <span>🍕</span>
          <span>🍱</span>
          <span>🍰</span>
          <span>🍣</span>
          <span>🥗</span>
          <span>🍛</span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handleGoBack}
            className="group relative px-8 py-4 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-400 hover:border-orange-500 flex items-center gap-2 min-w-[200px] justify-center"
          >
            <motion.span
              animate={{ x: [-3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            >
              ⬅️
            </motion.span>
            <span className="group-hover:scale-110 inline-block transition-transform">
              Go Back
            </span>
          </button>

          <button
            onClick={handleGoHome}
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:from-orange-600 hover:to-red-600 flex items-center gap-2 min-w-[200px] justify-center"
          >
            <span className="group-hover:scale-110 inline-block transition-transform">
              Go to Home
            </span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🏠
            </motion.span>
          </button>
        </motion.div>

        {/* Fun Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-12"
        >
          <p className="text-gray-500 text-sm md:text-base italic">
            💡 Tip: Use the navigation to find delicious food near you!
          </p>
        </motion.div>

        {/* Floating Food Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
              animate={{
                y: "-20vh",
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              className="absolute text-4xl opacity-20"
              style={{ left: `${Math.random() * 100}%` }}
            >
              {["🍕", "🍔", "🍟", "🌮", "🍝", "🍱", "🍰", "🍣"][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;

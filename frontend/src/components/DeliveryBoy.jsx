import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipLoader } from "react-spinners";

function DeliveryBoy() {
  const navigate = useNavigate();
  const { userData, socket } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [otp, setOtp] = useState("");
  const [todaysDeliveries, setTodayDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // ✅ FIXED: Initialize with default location from userData or fallback values
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(() => {
    if (userData?.location?.coordinates) {
      return {
        lat: userData.location.coordinates[1],
        lon: userData.location.coordinates[0],
      };
    }
    return { lat: 0, lon: 0 }; // Fallback coordinates
  });

  useEffect(() => {
    if (!socket || userData?.role !== "deliveryBoy") return;

    let watchId;

    if (navigator.geolocation) {
      // ✅ FIXED: Proper geolocation watching with better options
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setDeliveryBoyLocation({ lat: latitude, lon: longitude });

          // console.log(`📍 Delivery boy location update: ${latitude}, ${longitude}`);

          // ✅ FIXED: Proper parameter structure
          socket.emit("updateLocation", {
            latitude,
            longitude,
            userId: userData._id,
          });
        },
        (error) => {
          console.log("❌ Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // ✅ Added timeout
          maximumAge: 5000, // ✅ Added maximum age
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        // console.log("🛑 Stopped watching geolocation");
      }
    };
  }, [socket, userData]);

  const ratePerDelivery = 50; // Example rate per delivery
  const totalEarnings = todaysDeliveries.reduce(
    (total, delivery) => total + delivery.count * ratePerDelivery,
    0
  );

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
      console.log("✅ Current order fetched:", result.data);
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "No current order found!"
      ) {
        // console.log("ℹ️ No current order found for delivery boy");
        setCurrentOrder(null);
      } else {
        console.error("❌ Error fetching current order:", error);
      }
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );

      // Remove the accepted assignment from available list immediately
      setAvailableAssignments((prev) =>
        prev.filter((assignment) => assignment.assignmentId !== assignmentId)
      );

      // Get current order (should now find the accepted assignment)
      await getCurrentOrder();
      alert("Order accepted successfully!");
    } catch (error) {
      console.error("❌ Error accepting order:", error);
      // alert(error.response?.data?.message || "Failed to accept order. Please try again.");
    }
  };



const sendOtp = async () => {
  setLoading(true);
  try {
    const result = await axios.post(
      `${serverUrl}/api/order/send-delivery-otp`,
      {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
      },
      { withCredentials: true }
    );
    setLoading(false);
    setShowOtpBox(true);
    setOtp(result.data.otp);
    alert("📧 Order bill and OTP sent to customer's email!");
  } catch (error) {
    console.log(error);
    setLoading(false);
    alert("Failed to send OTP. Please try again.");
  }
};



  const verifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verified-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp: otp,
        },
        { withCredentials: true }
      );

      // If we reach here, OTP was verified successfully (200 status)
      alert("OTP verified successfully! Order marked as delivered.");
      setShowOtpBox(false);
      setOtp("");
      await getCurrentOrder();
      navigate("/");
    } catch (error) {
      if (error.response?.status === 400) {
        // Invalid/Expired OTP
        alert(
          error.response.data.message ||
            "Invalid/Expired OTP. Please try again."
        );
      } else {
        // Other server errors
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true }
      );
      setTodayDeliveries(result.data);
      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const markOutForDelivery = async () => {
    try {
      console.log("🚛 Marking order as out for delivery");
      const result = await axios.put(
        `${serverUrl}/api/order/update-delivery-status`,
        {
          orderId: currentOrder.orderId,
          shopOrderId: currentOrder.shopOrderId,
          status: "out of delivery",
        },
        { withCredentials: true }
      );

      if (result.data.success) {
        alert("Order marked as out for delivery!");
        await getCurrentOrder(); // Refresh current order
      }
    } catch (error) {
      console.error("❌ Error marking order as out for delivery:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  useEffect(() => {
    if (!socket || !userData?._id) return;

    const handleNewAssignment = (data) => {
      console.log("🔔 New assignment received:", data);
      if (data.sentTo === userData._id) {
        setAvailableAssignments((prev) => {
          // Check if assignment already exists to avoid duplicates
          const exists = prev.some(
            (assignment) => assignment.assignmentId === data.assignmentId
          );
          if (exists) {
            // console.log("📋 Assignment already exists, skipping");
            return prev;
          }
          // console.log("✅ Adding new assignment to list");
          return [...prev, data];
        });
      }
    };

    const handleAssignmentTaken = (data) => {
      // console.log("🚫 Assignment taken by another delivery boy:", data);
      setAvailableAssignments((prev) =>
        prev.filter(
          (assignment) => assignment.assignmentId !== data.assignmentId
        )
      );
    };

    const handleAssignmentCancelled = (data) => {
      // console.log("❌ Assignment cancelled:", data);
      setAvailableAssignments((prev) =>
        prev.filter(
          (assignment) => assignment.assignmentId !== data.assignmentId
        )
      );
    };

    socket.on("newAssignment", handleNewAssignment);
    socket.on("assignmentTaken", handleAssignmentTaken);
    socket.on("assignmentCancelled", handleAssignmentCancelled);

    return () => {
      socket.off("newAssignment", handleNewAssignment);
      socket.off("assignmentTaken", handleAssignmentTaken);
      socket.off("assignmentCancelled", handleAssignmentCancelled);
    };
  }, [socket, userData?._id]);

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  return (
    <>
      <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff0e8] overflow-y-auto">
        <Nav />
        <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
          <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between items-center w-[90%] border border-orange-100 text-center gap-2">
            <h1 className="text-xl font-bold text-[#ff4d2d]">
              Welcome {userData.fullName}
            </h1>
            {deliveryBoyLocation && (
              <p className="text-[#ff4d2d]">
                <span className="font-semibold">Latitude:-</span>
                {deliveryBoyLocation.lat},
                <span className="font-semibold">Longitude:-</span>
                {deliveryBoyLocation.lon}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-200">
            <h1 className="text-lg font-bold mb-3 text-[#ff3d2d]">
              Today Deliveries
            </h1>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={todaysDeliveries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [value, "orders"]}
                  labelFormatter={(label) => `${label}:00`}
                />
                <Bar dataKey="count" fill="#ff4d2d" />
              </BarChart>
            </ResponsiveContainer>

            <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-md border border-orange-200 text-center">
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                Today's Earnings
              </h1>
              <span className="text-3xl font-bold text-green-600">
                ₹{totalEarnings}
              </span>
            </div>
          </div>

          {/* Status and Refresh Section */}
          <div className="bg-white rounded-2xl p-4 shadow-md w-[90%] border border-orange-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  {currentOrder ? "🚛 On Delivery" : "📱 Available for Orders"}
                </p>
                {availableAssignments.length > 0 && !currentOrder && (
                  <p className="text-xs text-orange-500">
                    {availableAssignments.length} order
                    {availableAssignments.length !== 1 ? "s" : ""} waiting
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    console.log("🔄 Refreshing data...");
                    getAssignments();
                    getCurrentOrder();
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 cursor-pointer"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>

          {!currentOrder && (
            <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-200">
              <h1 className="text-lg font-bold mb-4 flex items-center gap-2 text-center justify-center">
                Available Orders
              </h1>
              <div className="space-y-4">
                {availableAssignments.length === 0 ? (
                  <p className="text-center text-xl text-gray-800">
                    No available orders at this moment.
                  </p>
                ) : (
                  availableAssignments.map((a, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 flex flex-col justify-between items-start gap-1"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          Shop Name:- {a?.shopName}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">
                            Delivery Address:-
                          </span>{" "}
                          {a?.deliveryAddress.text}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {a.items.length}{" "}
                          {a.items.length === 1 ? `item` : `items`} | Price:- ₹
                          {a.subTotal}
                        </p>
                      </div>
                      <button
                        className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600 cursor-pointer"
                        onClick={() => acceptOrder(a.assignmentId)}
                      >
                        Accept
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {currentOrder && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Current Order
                  </h3>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentOrder.assignmentStatus === "assigned"
                      ? "bg-blue-100 text-blue-700"
                      : currentOrder.assignmentStatus === "out_for_delivery"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {currentOrder.assignmentStatus === "assigned"
                    ? "ACCEPTED"
                    : currentOrder.assignmentStatus === "out_for_delivery"
                    ? "OUT FOR DELIVERY"
                    : currentOrder.assignmentStatus?.toUpperCase()}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Shop Information */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <h4 className="font-semibold text-gray-800">Restaurant</h4>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    {currentOrder?.shop.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {currentOrder?.shop.address}
                  </p>
                </div>

                {/* Customer Information */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <h4 className="font-semibold text-gray-800">Customer</h4>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    {currentOrder.user.fullName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${currentOrder.user.mobile}`}
                      className="hover:text-blue-600"
                    >
                      {currentOrder.user.mobile}
                    </a>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h4 className="font-semibold text-gray-800">
                    Delivery Address
                  </h4>
                </div>
                <p className="text-gray-700">
                  {currentOrder.deliveryAddress.text}
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-4 h-4 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <h4 className="font-semibold text-gray-800">Order Items</h4>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {currentOrder.shopOrder.shopOrderItems.length}{" "}
                    {currentOrder.shopOrder.shopOrderItems.length === 1
                      ? "item"
                      : "items"}
                  </span>
                </div>

                <div className="space-y-3">
                  {currentOrder.shopOrder.shopOrderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Total */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="font-medium text-gray-700">
                      Payment Method:
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentOrder.paymentMethod === "cod"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {currentOrder.paymentMethod === "cod"
                      ? "💵 Cash On Delivery"
                      : "💳 Online Payment"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-orange-200">
                  <span className="text-lg font-semibold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₹
                    {currentOrder.shopOrder.subTotal > 500
                      ? currentOrder.shopOrder.subTotal
                      : currentOrder.shopOrder.subTotal + 50}
                  </span>
                </div>
                {currentOrder.shopOrder.subTotal <= 500 && (
                  <p className="text-xs text-gray-600 mt-1 text-right">
                    (Includes ₹50 delivery fee)
                  </p>
                )}
              </div>

              {deliveryBoyLocation &&
                currentOrder?.deliveryAddress?.latitude && (
                  <DeliveryBoyTracking
                    data={{
                      deliveryBoyLocation: deliveryBoyLocation,
                      customerLocation: {
                        lat: currentOrder.deliveryAddress.latitude,
                        lon: currentOrder.deliveryAddress.longitude,
                      },
                    }}
                  />
                )}
              {/* Show different buttons based on assignment status */}
              {currentOrder.assignmentStatus === "assigned" && (
                <button
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md font-semibold hover:bg-blue-600 cursor-pointer mt-3 active:scale-95 transition-all duration-200"
                  onClick={markOutForDelivery}
                >
                  🚛 Out for Delivery
                </button>
              )}

              {currentOrder.assignmentStatus === "out_for_delivery" &&
                (showOtpBox ? (
                  <div className="w-full flex flex-col gap-3 mt-3 border border-orange-200 rounded-xl p-3">
                    <p className="text-sm font-semibold mb-2">
                      {" "}
                      Enter OTP send to{" "}
                      <span className="text-orange-500">
                        {currentOrder.user.fullName}
                      </span>
                    </p>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      onChange={(e) => setOtp(e.target.value)}
                      value={otp}
                    />
                    {message && (
                      <p className="text-center text-green-400 text-2xl">
                        {message}
                      </p>
                    )}
                    <button
                      className=" w-full bg-green-500 text-white px-4 py-2 rounded-xl shadow-md font-semibold hover:bg-green-600 cursor-pointer mt-3 active:scale-95 transition-all duration-200"
                      onClick={verifyOtp}
                    >
                      Submit OTP
                    </button>
                  </div>
                ) : (
                  <button
                    className=" w-full bg-green-500 text-white px-4 py-2 rounded-xl shadow-md font-semibold hover:bg-green-600 cursor-pointer mt-3 active:scale-95 transition-all duration-200"
                    onClick={sendOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader size={20} color="white" />
                    ) : (
                      " ✅ Mark As Delivered"
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DeliveryBoy;

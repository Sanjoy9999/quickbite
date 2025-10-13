import React from "react";
import { 
  MdPhoneInTalk, 
  MdLocationOn, 
  MdEmail, 
  MdPerson,
  MdDeliveryDining,
  MdPayment,
  MdCheckCircle
} from "react-icons/md";
import { FaMotorcycle, FaClock, FaRupeeSign } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import axios from "axios";
import { serverUrl } from "../App";
import { updateOrderStatus } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const OwnerOrderCard = ({ data }) => {
  const [availableBoys, setAvailableBoys] = React.useState([]);
  const dispatch = useDispatch();

  // Add safety check for data structure
  if (!data || !data.shopOrders || data.shopOrders.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  const shopOrder = data.shopOrders[0];

  // Additional safety check for shopOrder
  if (!shopOrder || !shopOrder.shopOrderItems) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-600 font-medium">Loading order items...</p>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );

      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result.data.availableBoys || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <div className="bg-gradient-to-br from-white via-orange-50/30 to-pink-50/20 rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MdPerson className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide">
                  {data.user.fullName}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-orange-100">
                  <MdEmail className="text-sm" />
                  <p className="text-sm">{data.user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-sm font-semibold">Order #{data._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
            <MdPhoneInTalk className="text-lg" />
            <span className="font-semibold">{data.user.mobile}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Payment Info Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <MdPayment className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Payment Method</p>
              {data.paymentMethod === "online" ? (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-bold text-green-700">
                    Online Payment
                  </p>
                  {data.payment && (
                    <MdCheckCircle className="text-green-600 text-xl" />
                  )}
                </div>
              ) : (
                <p className="text-lg font-bold text-orange-700">
                  Cash On Delivery
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Address Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <MdLocationOn className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-semibold mb-2">📍 Delivery Address</p>
              <p className="text-gray-800 font-medium leading-relaxed">
                {data?.deliveryAddress?.text || "No address provided"}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 bg-white/60 px-3 py-2 rounded-lg w-fit">
                <span>📍 Lat: {data?.deliveryAddress?.latitude || "N/A"}</span>
                <span className="text-gray-300">|</span>
                <span>Lon: {data?.deliveryAddress?.longitude || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border-2 border-orange-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BsBoxSeam className="text-orange-600 text-xl" />
            <h3 className="text-lg font-bold text-gray-800">Order Items</h3>
            <span className="ml-auto bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {shopOrder?.shopOrderItems?.length || 0} Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(shopOrder?.shopOrderItems || []).map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl border-2 border-gray-100 overflow-hidden"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={item?.item?.image || "NA"}
                    alt={item?.item?.name || "NA"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    x{item.quantity}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-base font-bold text-gray-800 mb-2 line-clamp-1">
                    {item?.item?.name || "NA"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      <FaRupeeSign className="inline text-xs" />
                      {item?.item?.price || "NA"} × {item.quantity}
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      <FaRupeeSign className="inline text-sm" />
                      {item?.item?.price || "NA" * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status and Actions Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <FaClock className="text-purple-600 text-xl" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Order Status</p>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mt-1 shadow-sm ${
                    shopOrder?.status === "pending"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900"
                      : shopOrder?.status === "preparing"
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900"
                      : shopOrder?.status === "out of delivery"
                      ? "bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900"
                      : "bg-gradient-to-r from-green-400 to-green-500 text-green-900"
                  }`}
                >
                  {shopOrder?.status === "pending" && "⏳"}
                  {shopOrder?.status === "preparing" && "👨‍🍳"}
                  {shopOrder?.status === "out of delivery" && "🏍️"}
                  {shopOrder?.status === "delivered" && "✅"}
                  <span className="uppercase tracking-wide">
                    {shopOrder?.status || "pending"}
                  </span>
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <label className="text-xs text-gray-600 font-semibold mb-2 block">
                Update Status
              </label>
              <select
                onChange={(e) => {
                  handleUpdateStatus(
                    data._id,
                    shopOrder?.shop?._id,
                    e.target.value
                  );
                }}
                value={shopOrder?.status || "pending"}
                className="w-full sm:w-auto bg-white border-2 border-orange-300 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-semibold shadow-sm hover:shadow-md cursor-pointer"
              >
                <option value="" disabled>
                  Change Status
                </option>
                <option value="pending">⏳ Pending</option>
                <option value="preparing">👨‍🍳 Preparing</option>
                <option value="out of delivery">🏍️ Out for Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Delivery Boy Section */}
        {shopOrder?.status === "preparing" && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border-2 border-indigo-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaMotorcycle className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {shopOrder?.assignedDeliveryBoy
                    ? "Assigned Delivery Boy"
                    : "Available Delivery Boys"}
                </p>
                <p className="text-xs text-gray-600">
                  {shopOrder?.assignedDeliveryBoy
                    ? "Delivery partner information"
                    : "Select from available partners"}
                </p>
              </div>
            </div>

            {availableBoys && availableBoys.length > 0 ? (
              <div className="space-y-3">
                {availableBoys.map((b, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 border-2 border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {b.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{b.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <MdPhoneInTalk className="text-indigo-500" />
                          <span className="font-semibold">{b.mobile}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : shopOrder?.assignedDeliveryBoy ? (
              <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {shopOrder.assignedDeliveryBoy.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-lg">
                      {shopOrder.assignedDeliveryBoy.fullName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MdPhoneInTalk className="text-green-600" />
                      <span className="font-semibold">
                        {shopOrder.assignedDeliveryBoy.mobile}
                      </span>
                    </div>
                  </div>
                  <MdCheckCircle className="text-green-600 text-3xl" />
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                <div>
                  <p className="text-yellow-800 font-semibold">
                    Waiting for Delivery Boy
                  </p>
                  <p className="text-yellow-600 text-sm">
                    A delivery partner will be assigned shortly...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Total Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90 font-medium">Order Total</p>
              <p className="text-xs opacity-75 mt-1">
                Including all items and charges
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-4xl font-bold">
                <FaRupeeSign className="text-3xl" />
                <span>{shopOrder?.subTotal || 0}</span>
              </div>
              <p className="text-xs opacity-75 mt-1">Final Amount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerOrderCard;

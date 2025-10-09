import express from "express"
import { acceptOrder, getCurrentOrder, getDeliveryBoyAssignment, getMyOrders, getOrderById, placeOrder, sendDeliveryBoyOtp, updateOrderStatus, updateDeliveryStatus, verifyDeliveryOtp, verifyPayment, getTodayDeliveries, } from "../controllers/order.controller.js"
import isAuth from "../middleware/isAuth.js"

const orderRouter = express.Router()

orderRouter.post("/place-order", isAuth,placeOrder)
orderRouter.get("/my-orders", isAuth,getMyOrders)
orderRouter.post("/update-status/:orderId/:shopId", isAuth,updateOrderStatus)
orderRouter.get("/get-assignments", isAuth,getDeliveryBoyAssignment)
orderRouter.get("/accept-order/:assignmentId", isAuth,acceptOrder)
orderRouter.get("/get-current-order/", isAuth,getCurrentOrder)
orderRouter.get("/get-order-By-Id/:orderId", isAuth,getOrderById)
orderRouter.post("/send-delivery-otp", isAuth,sendDeliveryBoyOtp)
orderRouter.post("/verified-delivery-otp", isAuth,verifyDeliveryOtp)
orderRouter.post("/verified-payment", isAuth,verifyPayment)
orderRouter.put("/update-delivery-status", isAuth,updateDeliveryStatus)
orderRouter.get("/get-today-deliveries", isAuth,getTodayDeliveries)



export default orderRouter

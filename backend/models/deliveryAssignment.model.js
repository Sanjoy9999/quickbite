import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    shopOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    broadcastedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    status:{
        type: String,
        enum: ["broadcast","assigned","out_for_delivery","delivered"],
        default: "broadcast",
    },
    acceptedAt:{
        type: Date,
        default: null
    },
    outForDeliveryAt:{
        type: Date,
        default: null
    }
  },
  { timestamps: true }
);


const deliveryAssignment = mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);

export default deliveryAssignment;
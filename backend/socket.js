import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    // console.log(`🔗 User connected: ${socket.id}`);

    // Handle user identity
    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { socketId: socket.id, isOnline: true },
          { new: true }
        );
        // console.log(`✅ Identity set for user: ${user?.fullName}`);
      } catch (error) {
        console.log("❌ Identity error:", error);
      }
    });

    // ✅ FIXED: Proper parameter destructuring and type fix
    socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
      try {
        console.log(`📍 Location update - User: ${userId}, Lat: ${latitude}, Lon: ${longitude}`);
        
        const user = await User.findByIdAndUpdate(
          userId,
          {
            location: {
              type: "Point", // ✅ FIXED: Was "point", should be "Point"
              coordinates: [longitude, latitude] // ✅ [lon, lat] format for GeoJSON
            },
            isOnline: true,
            socketId: socket.id
          },
          { new: true }
        );

        if (user) {
          console.log(`📡 Broadcasting location for delivery boy: ${userId}`);
          // ✅ Broadcast to ALL clients (especially customers tracking this delivery boy)
          io.emit("updateDeliveryLocation", {
            deliveryBoyId: userId,
            latitude,
            longitude
          });
        }
      } catch (error) {
        console.log("❌ Update delivery location error:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null, isOnline: false },
          { new: true }
        );
        // console.log(`🔌 User disconnected: ${socket.id}`);
      } catch (error) {
        console.log("❌ Disconnect error:", error);
      }
    });
  });
};

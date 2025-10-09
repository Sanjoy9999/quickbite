import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import chatbotRouter from "./routes/chatbot.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

const port = process.env.PORT || 5000;
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api/chatbot", chatbotRouter); 

app.get("/health",(req,res)=>{
  res.json({message:"Everything is healthy"});
})

// ✅ Connect to DB first, then start server and socket handler
const startServer = async () => {
  try {
    await connectDb(); // ✅ Wait for DB connection
    console.log("✅ MongoDB connected successfully");

    socketHandler(io); // ✅ Initialize socket handler after DB is ready

    server.listen(port, () => {
      console.log(`🚀 Server started at port ${port}`);
      console.log("🤖 Chatbot service ready");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

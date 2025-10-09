import express from "express";
import { chatWithBot, getChatHistory } from "../controllers/chatbot.controller.js";
import isAuth from "../middleware/isAuth.js"

const router = express.Router();

// Chat endpoint
router.post("/chat", isAuth, chatWithBot);

// Get chat history
router.get("/history", isAuth, getChatHistory);

export default router;
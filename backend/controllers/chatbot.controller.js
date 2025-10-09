import ChatbotService from "../services/chatbot.service.js";
import User from "../models/user.model.js";

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    // console.log('\n📨 API REQUEST');
    // console.log('   User:', userId);
    // console.log('   Message:', message);

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message required"
      });
    }

    // Get user's city
    let city = 'Kolkata';
    try {
      const user = await User.findById(userId).select('currentCity');
      if (user?.currentCity) city = user.currentCity;
    } catch (err) {
      console.log('   ⚠️ Using default city');
    }

    // console.log('   City:', city);

    // Call chatbot
    const response = await ChatbotService.chat(message.trim(), userId, city);

    // console.log('✅ Response sent\n');

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('❌ Controller error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to process message",
      data: {
        message: "Sorry! Try: pizza, under ₹100, recommend me",
        products: [],
        recommendations: []
      }
    });
  }
};

export const getChatHistory = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { history: [] }
  });
};
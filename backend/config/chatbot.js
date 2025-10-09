import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

console.log("🔑 Checking API Key:", process.env.GOOGLE_GEMINI_API_KEY ? "✅ Found" : "❌ Missing");

let chatModel = null;
let isAIEnabled = false;

try {
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    chatModel = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey: process.env.GOOGLE_GEMINI_API_KEY,
      temperature: 0.7,
      maxRetries: 2,
    });
    isAIEnabled = true;
    console.log("✅ Gemini AI model initialized successfully");
  } else {
    console.log("⚠️ No GOOGLE_GEMINI_API_KEY found - running in simple mode");
  }
} catch (error) {
  console.error("❌ Failed to initialize Gemini:", error.message);
  console.log("⚠️ Falling back to simple mode");
}

// Zod schemas for validation
export const ProductQuerySchema = z.object({
  query: z.string().describe("User's product search query"),
  intent: z.enum(['search', 'recommendation', 'price_check', 'availability']).describe("Type of query"),
  category: z.string().optional().describe("Food category if specified"),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional()
  }).optional().describe("Price range if specified")
});

export const ChatResponseSchema = z.object({
  message: z.string().describe("Response message to user"),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    category: z.string(),
    shop: z.string(),
    available: z.boolean()
  })).optional().describe("Relevant products found"),
  recommendations: z.array(z.string()).optional().describe("Product recommendations")
});

export { chatModel, isAIEnabled };
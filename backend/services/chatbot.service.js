import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import { chatModel, isAIEnabled } from "../config/chatbot.js";

class ChatbotService {
  constructor() {
    this.useAI = isAIEnabled;
    console.log(`🤖 Chatbot initialized (AI: ${this.useAI ? 'ON' : 'OFF'})`);
  }

  // Detect what user wants
  detectIntent(query) {
    const q = query.toLowerCase();
    
    // Price queries - HIGHEST PRIORITY
    if (q.match(/under|below|less than|max|budget|cheap|affordable/i)) {
      return 'price';
    }
    
    // Recommendation queries
    if (q.match(/recommend|suggest|based on my|personalized|what should i/i)) {
      return 'recommend';
    }
    
    // Popular items
    if (q.match(/popular|trending|best|top rated|discover/i)) {
      return 'popular';
    }
    
    // Greetings
    if (q.match(/^(hi|hello|hey)/i)) {
      return 'greeting';
    }
    
    return 'search';
  }

  // Extract price from query
  extractPrice(query) {
    const match = query.match(/(\d+)/);
    if (match) {
      const price = parseInt(match[1]);
      // console.log(`💰 Price detected: ₹${price}`);
      return price;
    }
    return null;
  }

  // Extract category
  extractCategory(query) {
    const q = query.toLowerCase();
    
    if (q.includes('pizza')) return 'pizza';
    if (q.includes('burger')) return 'burgers';
    if (q.includes('chinese')) return 'chinese';
    if (q.includes('biryani')) return 'biryani';
    if (q.includes('dessert')) return 'desserts';
    if (q.includes('snack')) return 'snacks';
    if (q.includes('sandwich')) return 'sandwiches';
    if (q.includes('fast food')) return 'fast food';
    
    return null;
  }

  // Main chat function
  async chat(userQuery, userId, city) {
    try {
      // console.log('\n' + '='.repeat(60));
      // console.log('🤖 CHAT REQUEST');
      // console.log('   Query:', userQuery);
      // console.log('   City:', city);

      if (!userQuery?.trim()) {
        return {
          message: "Hi! 👋 Try: pizza, under ₹100, recommend me",
          products: [],
          recommendations: []
        };
      }

      city = city || 'Kolkata';
      const intent = this.detectIntent(userQuery);
      const price = this.extractPrice(userQuery);
      const category = this.extractCategory(userQuery);

      // console.log('   Intent:', intent);
      // console.log('   Price:', price);
      // console.log('   Category:', category);

      // Get shops in city
      const shops = await Shop.find({
        city: { $regex: new RegExp(`^${city}$`, 'i') }
      }).select('_id');

      const shopIds = shops.map(s => s._id);
      // console.log('   Shops found:', shopIds.length);

      if (shopIds.length === 0) {
        return {
          message: `No restaurants found in ${city} 😔`,
          products: [],
          recommendations: []
        };
      }

      let products = [];
      let recommendations = [];
      let message = '';

      // Handle based on intent
      if (intent === 'price' && price) {
        // PRICE SEARCH
        // console.log(`   🔍 Searching items under ₹${price}...`);
        
        products = await Item.find({
          shop: { $in: shopIds },
          price: { $lte: price }
        })
        .populate('shop', 'name address')
        .select('name image category price foodType rating shop')
        .sort({ price: 1 })
        .lean();

       
        
        // ✅ Log first 5 items with prices to verify
        if (products.length > 0) {
          // console.log('   📊 Sample items:');
          products.slice(0, 5).forEach(p => {
            console.log(`      - ${p.name}: ₹${p.price}`);
          });
          // console.log('   📊 All prices:', products.map(p => p.price).sort((a,b) => a-b));
        }

        if (products.length > 0) {
          message = `💰 Found ${products.length} items under ₹${price} in ${city}!\n\nSorted by price - cheapest first! 😋`;
        } else {
          message = `😔 No items found under ₹${price} in ${city}.\n\nTry a higher budget!`;
          // Show some recommendations
          recommendations = await Item.find({ shop: { $in: shopIds } })
            .populate('shop', 'name')
            .select('name image category price foodType rating shop')
            .sort({ price: 1 })
            .limit(5)
            .lean();
        }

      } else if (intent === 'recommend') {

        // Get user's order history
        const orders = await Order.find({ user: userId })
          .populate('shopOrders.shopOrderItems.item')
          .limit(5)
          .lean();

        const categories = new Set();
        orders.forEach(order => {
          order.shopOrders?.forEach(so => {
            so.shopOrderItems?.forEach(item => {
              if (item.item?.category) categories.add(item.item.category);
            });
          });
        });

        // console.log('   User categories:', Array.from(categories));

        if (categories.size > 0) {
          recommendations = await Item.find({
            shop: { $in: shopIds },
            category: { $in: Array.from(categories) }
          })
          .populate('shop', 'name')
          .select('name image category price foodType rating shop')
          .sort({ 'rating.average': -1 })
          .limit(10)
          .lean();

          message = `🎯 Based on your orders, here are ${recommendations.length} items you might like!`;
        } else {
          // No history - show popular
          recommendations = await Item.find({
            shop: { $in: shopIds },
            'rating.average': { $gte: 3 }
          })
          .populate('shop', 'name')
          .select('name image category price foodType rating shop')
          .sort({ 'rating.average': -1 })
          .limit(10)
          .lean();

          message = `💡 Here are popular items in ${city}!`;
        }

      } else if (intent === 'popular') {

        
        products = await Item.find({
          shop: { $in: shopIds },
          'rating.average': { $gte: 3 }
        })
        .populate('shop', 'name')
        .select('name image category price foodType rating shop')
        .sort({ 'rating.average': -1 })
        .limit(15)
        .lean();

        message = `⭐ Here are ${products.length} popular items in ${city}!`;

      } else if (intent === 'greeting') {
        // GREETING
        recommendations = await Item.find({ shop: { $in: shopIds } })
          .populate('shop', 'name')
          .select('name image category price foodType rating shop')
          .sort({ 'rating.average': -1 })
          .limit(6)
          .lean();

        message = `👋 Hi! I'm QuickBite AI. What are you craving today?`;

      } else {
        // REGULAR SEARCH
        console.log('   🔍 Regular search...');
        
        const query = { shop: { $in: shopIds } };
        
        if (category) {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        } else {
          query.$or = [
            { name: { $regex: new RegExp(userQuery, 'i') } },
            { category: { $regex: new RegExp(userQuery, 'i') } }
          ];
        }

        if (price) {
          query.price = { $lte: price };
        }

        products = await Item.find(query)
          .populate('shop', 'name address')
          .select('name image category price foodType rating shop')
          .sort({ price: 1 })
          .limit(20)
          .lean();

        // console.log('   ✅ Found:', products.length, 'items');

        if (products.length > 0) {
          message = `🎉 Found ${products.length} items for "${userQuery}" in ${city}!`;
        } else {
          message = `😔 No items found for "${userQuery}" in ${city}.\n\nTry: pizza, burgers, desserts`;
          
          // Show recommendations
          recommendations = await Item.find({ shop: { $in: shopIds } })
            .populate('shop', 'name')
            .select('name image category price foodType rating shop')
            .sort({ 'rating.average': -1 })
            .limit(5)
            .lean();
        }
      }

      const finalProducts = products.slice(0, 20);
      const finalRecommendations = recommendations.slice(0, 10);

      // console.log('✅ Response ready:');
      // console.log('   Products to send:', finalProducts.length);
      // console.log('   Recommendations to send:', finalRecommendations.length);
      // console.log('='.repeat(60) + '\n');

      return {
        message,
        products: finalProducts,
        recommendations: finalRecommendations
      };

    } catch (error) {
      console.error('❌ CHAT ERROR:', error);
      return {
        message: "Oops! Something went wrong 😅\n\nTry: pizza, under ₹100",
        products: [],
        recommendations: []
      };
    }
  }
}

export default new ChatbotService();
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isLoading: true,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    searchItems: null,
    socket: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload; //come from user action
      const existingItem = state.cartItems.find((i) => i.id == cartItem.id); //check if item already in cart(In Redux store)
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      ); // sum value by default 0 that is accumulator
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id == id);
      if (item) {
        item.quantity = quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      ); // sum value by default 0 that is accumulator
    },
    removeCartItem: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.id !== id);
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      ); // sum value by default 0 that is accumulator
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },

    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id === orderId);
      if (order && order.shopOrders) {
        // shopOrders is an array, so find the correct shop order
        const shopOrder = order.shopOrders.find(
          (shop) => shop.shop._id === shopId || shop.shop === shopId
        );
        if (shopOrder) {
          shopOrder.status = status;
        }
      }
    },

    setUpdateRealTimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id === orderId);
      if (order && order.shopOrders) {
        // shopOrders is an array, so find the correct shop order
        const shopOrder = order.shopOrders.find(
          (so) => so.shop._id === shopId || so.shop === shopId
        );
        if (shopOrder) {
          shopOrder.status = status;
        }
      } else {
        // If the order is not found, add it to the beginning of the myOrders array
        state.myOrders = [action.payload, ...state.myOrders];
      }
    },

    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setShopInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeCartItem,
  setMyOrders,
  addMyOrder,
  clearCart,
  updateOrderStatus,
  setUpdateRealTimeOrderStatus,
  setSearchItems,
  setSocket,
  setLoading,
} = userSlice.actions;
export default userSlice.reducer;

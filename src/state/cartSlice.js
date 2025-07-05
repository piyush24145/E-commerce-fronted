// src/state/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalItems: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.totalItems = action.payload.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    setCartCount: (state, action) => {
      state.totalItems = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const { setCartItems, clearCart, setCartCount } = cartSlice.actions;
export default cartSlice.reducer;





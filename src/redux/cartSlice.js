import { createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (existingItem) {
        // Eğer ürün zaten sepetteyse miktarını arttır
        if (existingItem.quantity < 5) {
          existingItem.quantity += 1;
        } else {
          Toast.show({
            text1: "Maksimum miktara ulaşıldı!",
            text2: "Bu üründen en fazla 5 adet alabilirsiniz.",
            type: "error",
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      } else {
        // Yeni bir ürün ekle
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (index !== -1) {
        state.items.splice(index, 1); // Ürünü sepetten çıkar
      }
    },
    clearCart: (state) => {
      state.items = []; // Sepeti temizle
    },
    increaseQuantity: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (existingItem) {
        if (existingItem.quantity < 5) {
          existingItem.quantity += 1; // Miktarı artır
        } else {
          Toast.show({
            text1: "Bu üründen en fazla 5 adet alabilirsiniz.",
            type: "error",
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      }
    },
    decreaseQuantity: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1; // Miktarı azalt
        } else {
          Toast.show({
            text1: "Bu ürünün miktarı 1'den az olamaz.",
            type: "error",
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;

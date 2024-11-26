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
        // Eğer ürün zaten sepetteyse, mevcut miktarı artır
        if (existingItem.quantity + action.payload.quantity <= 5) {
          existingItem.quantity += action.payload.quantity;
        } else {
          Toast.show({
            text1: "Maksimum miktara ulaşıldı!",
            text2: "Bu üründen en fazla 5 adet alabilirsiniz.",
            type: "error",
            position: "top",
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } else {
        // Yeni bir ürün ekle
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity,
        });
      }
    },
    // Ürünü sepetten çıkar
    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    // Sepeti temizle
    clearCart: (state) => {
      state.items = [];
    },
    increaseQuantity: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (existingItem) {
        if (existingItem.quantity < 5) {
          existingItem.quantity += 1;
        } else {
          Toast.show({
            text1: "Bu üründen en fazla 5 adet alabilirsiniz.",
            type: "error",
            position: "top",
            visibilityTime: 2000,
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
          existingItem.quantity -= 1;
        }
      }
    },
  },
});

// sepet üzerinde benzersiz ürün sayısını döndür
export const selectTotalQuantity = (state) => {
  return state.cart.items.length;
};

// Sepetteki ürünleri seçmek için
export const selectCartItems = (state) => state.cart.items;

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;

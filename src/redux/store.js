import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";
import productReducer from "../redux/productSlice";
import favoritesReducer from "../redux/favoriteSlice";
import cartReducer from "../redux/cartSlice";
export const store = configureStore({
  reducer: {
    users: userReducer,
    products: productReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
  },
});

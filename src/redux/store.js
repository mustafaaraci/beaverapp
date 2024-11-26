import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";
import productReducer from "../redux/productSlice";
import favoritesReducer from "../redux/favoriteSlice";
import cartReducer from "../redux/cartSlice";
import paymentReducer from "../redux/paymentSlice";
import orderReducer from "../redux/orderSlice";
import addressReducer from "../redux/addressSlice";
import contactsReducer from "../redux/contactSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    products: productReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    payment: paymentReducer,
    order: orderReducer,
    addresses: addressReducer,
    contacts: contactsReducer,
  },
});

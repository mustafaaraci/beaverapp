import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const existingProductIndex = state.favorites.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex >= 0) {
        state.favorites.splice(existingProductIndex, 1); // Favori ise, listeden çıkar
      } else {
        state.favorites.push({ ...product, isFavorite: true }); // Favori değilse, listeye ekle
      }
    },
    setInitialFavorites: (state, action) => {
      state.favorites = action.payload.map((product) => ({
        ...product,
        isFavorite: false,
      }));
    },
    //favori çıkar
    removeFavorite: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter((item) => item.id !== productId);
    },
    // Tüm favorileri çıkar
    removeAllFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const {
  toggleFavorite,
  setInitialFavorites,
  removeFavorite,
  removeAllFavorites,
} = favoriteSlice.actions;
export default favoriteSlice.reducer;

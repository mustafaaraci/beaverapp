import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get("https://fakestoreapi.com/products");
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    status: "idle",
    error: null,
    refreshing: false,
  },
  reducers: {
    //refreshing
    setRefreshing(state, action) {
      state.refreshing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.refreshing = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.refreshing = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.refreshing = false;
      });
  },
});

//refresing
export const refreshProducts = () => async (dispatch) => {
  dispatch(setRefreshing(true));
  await dispatch(fetchProducts());
  dispatch(setRefreshing(false));
};

// parametreli Selector
export const selectProductsByCategory = createSelector(
  (state) => state.products.products,
  (state, category) => category,
  (products, category) => {
    if (!category) return products; // Eğer kategori yoksa tüm ürünleri döner
    return products.filter((product) => product.category === category);
  }
);
export const { setRefreshing } = productSlice.actions;
export default productSlice.reducer;

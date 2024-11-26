import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage ekleyin

export const addMyOrder = createAsyncThunk(
  "order/addMyOrder",
  async (ordersData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Token'ı alın
      const response = await axios.post(
        "http://192.168.1.10:5000/api/orders/myorders",
        ordersData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı başlığa ekleyin
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Sipariş kaydedilirken bir hata oluştu."
      );
    }
  }
);

// Siparişleri çekmek için thunk
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Token'ı alın
      const response = await axios.get(
        "http://192.168.1.10:5000/api/orders/getmyorders",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı başlığa ekleyin
          },
        }
      );
      return response.data; // Siparişleri döndür
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Siparişler alınırken bir hata oluştu."
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    status: null, // Durumu takip etmek için ekledik
    error: null, // Hata durumu için ekledik
  },
  reducers: {
    // Buraya senkron reducer eklemeye devam edebilirsiniz
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMyOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addMyOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.push(action.payload); // Siparişi ekle
      })
      .addCase(addMyOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Hata mesajını sakla
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading"; // Yükleniyor durumu
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload; // Siparişleri güncelle
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Hata mesajını sakla
      });
  },
});

export default orderSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Adresleri çekmek için thunk
export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Token'ı al
      const response = await axios.get(
        `http://192.168.1.10:5000/api/addresses/getmyaddress`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı başlığa ekle
          },
        }
      );
      return response.data; // Adres verilerini döndür
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Adresler alınırken bir hata oluştu."
      );
    }
  }
);

// Yeni adres eklemek için thunk
export const addAddress = createAsyncThunk(
  "addresses/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Token'ı al
      const response = await axios.post(
        "http://192.168.1.10:5000/api/addresses/addmyaddress",
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı başlığa ekle
          },
        }
      );
      return response.data; // Yeni adresi döndür
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Adres eklenirken bir hata oluştu."
      );
    }
  }
);

// Adres güncellemek için thunk
export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Token'ı al
      const response = await axios.put(
        `http://192.168.1.10:5000/api/addresses/updateaddress/${id}`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı başlığa ekle
          },
        }
      );
      return response.data; // Güncellenmiş adresi döndür
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Adres güncellenirken bir hata oluştu."
      );
    }
  }
);

// Adres silmek için thunk
export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Token'ı al
      await axios.delete(
        `http://192.168.1.10:5000/api/addresses/deleteaddress/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı başlığa ekle
          },
        }
      );
      return id; // Silinen adresin ID'sini döndür
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Adres silinirken bir hata oluştu."
      );
    }
  }
);

// Slice oluşturma
const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    addresses: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Adresleri fetch etme
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = action.payload; // Yeni adresleri state'e ekle
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Hata mesajını sakla
      })
      // Adres ekleme
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Hata mesajını sakla
      })
      // Adres güncelleme
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (address) => address._id === action.payload._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload; // Güncellenmiş adresi değiştir
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Hata mesajını sakla
      })
      // Adres silme
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (address) => address._id !== action.payload
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Hata mesajını sakla
      });
  },
});

export default addressSlice.reducer;

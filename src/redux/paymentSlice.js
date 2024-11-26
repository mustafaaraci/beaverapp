import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API isteği: ödeme talebi oluşturma
export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async ({ amount, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://192.168.1.10:5000/api/payment/paymentorder",
        { amount, userId }
      );
      return response.data; // Başarılı sonuç dönüyor
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Hata durumunda mesaj
    }
  }
);

// API isteği: ödeme doğrulama
export const confirmPaymentIntent = createAsyncThunk(
  "payment/confirmPaymentIntent",
  async ({ clientSecret, paymentMethodDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://192.168.1.10:5000/api/payment/confirm",
        { clientSecret, paymentMethodDetails }
      );
      return response.data; // Başarılı sonuç dönüyor
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Hata durumunda mesaj
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    clientSecret: null,
    loading: false,
    confirmLoading: false, // Ödeme doğrulama için ayrı loading
    error: null,
    paymentStatus: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.confirmLoading = false;
      state.error = null;
      state.paymentStatus = null; // Durumları sıfırla
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = "pending"; // Ödeme talebi için pending durumu
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.paymentStatus = "paymentIntentCreated"; // PaymentIntent oluşturuldu
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.paymentStatus = "failed"; // Ödeme talebi başarısız
      })
      .addCase(confirmPaymentIntent.pending, (state) => {
        state.confirmLoading = true;
        state.error = null;
        state.paymentStatus = "pending"; // Ödeme doğrulama bekleniyor
      })
      .addCase(confirmPaymentIntent.fulfilled, (state) => {
        state.confirmLoading = false;
        state.paymentStatus = "successful"; // Ödeme başarılı
      })
      .addCase(confirmPaymentIntent.rejected, (state, action) => {
        state.confirmLoading = false;
        state.error = action.payload || action.error.message;
        state.paymentStatus = "failed"; // Ödeme doğrulama başarısız
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;

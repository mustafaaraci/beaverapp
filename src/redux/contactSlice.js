import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Bilgileri getir
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "http://192.168.1.10:5000/api/contacts/getmycontact",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Bilgileriniz alınırken bir hata oluştu."
      );
    }
  }
);

// Bilgileri ekle
export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "http://192.168.1.10:5000/api/contacts/addmycontact",
        contactData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Bilgileriniz eklenirken bir hata oluştu."
      );
    }
  }
);

// Bilgileri güncelle
export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ contactId, contactData }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `http://192.168.1.10:5000/api/contacts/updatemycontact/${contactId}`,
        contactData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Bilgileriniz güncellenirken bir hata oluştu."
      );
    }
  }
);

// Bilgileri sil
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(
        `http://192.168.1.10:5000/api/contacts/deletemycontact/${contactId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Bilgiler silinirken bir hata oluştu."
      );
    }
  }
);

// Slice oluşturma
const contactsSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    error: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Bilgi ekleme
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })
      .addCase(addContact.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Bilgi güncelleme
      .addCase(updateContact.fulfilled, (state, action) => {
        const updatedContacts = state.contacts.map((contact) =>
          contact._id === action.payload._id ? action.payload : contact
        );
        state.contacts = updatedContacts;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Bilgi silme
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload._id
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default contactsSlice.reducer;

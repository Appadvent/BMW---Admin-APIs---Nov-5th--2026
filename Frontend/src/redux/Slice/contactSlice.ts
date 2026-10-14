// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

interface ContactData {
  name: string;
  email: string;
  phone: string;
  category?: string;
  services?: string;
  message: string;
  carModel?: string;
  vin?: string;
  oemNumber?: string;
  year?: string;
}

// Async thunk to send contact data
export const sendContact = createAsyncThunk(
  "contact/sendContact",
  async (contactData: ContactData, { rejectWithValue }) => {
    try {
      const payload = { ...contactData, phone: String(contactData.phone) };

      const response = await api.post("/query/create",
        payload
      );

      console.log("Contact RESPONSE:", response.data);
      return response.data;
    } catch (err) {
      // Catch any error from backend
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    error: null,
    data: null,
    success: false,
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendContact.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(sendContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;



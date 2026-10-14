// @ts-nocheck
// redux/slices/pageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunk to fetch pages
export const fetchPages = createAsyncThunk(
  "pages/fetchPages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/page/get-pages");
      console.log(" Page:", response);
      return response.data.data; // assuming the response is { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch pages"
      );
    }
  }
);

const pageSlice = createSlice({
  name: "pages",
  initialState: {
    list: [],       // store pages here
    loading: false, // loading state
    error: null,    // error message
  },
  reducers: {
    clearPages: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPages } = pageSlice.actions;
export default pageSlice.reducer;


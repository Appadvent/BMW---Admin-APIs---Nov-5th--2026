// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Fetch all testimonials
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchAll",
  async (params?: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get("/testimonials", {
        params: { limit: 50, ...(params || {}) },
      });
      // API returns { success: true, data: [...], pagination: {...} }
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch testimonials"
      );
    }
  }
);

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testimonialSlice.reducer;

// @ts-nocheck
// src/redux/Slice/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/category/");
      console.log("API RESPONSE:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

interface CategoryState {
  list: any[];
  loading: boolean;
  error: any;
}

const initialState: CategoryState = {
  list: [], // store categories here
  loading: false, // loading state
  error: null, // error message
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
      })
      //   .addCase(fetchCategories.fulfilled, (state, action) => {
      //     state.loading = false;
      //     state.list = action.payload.data || [];
      //   })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;


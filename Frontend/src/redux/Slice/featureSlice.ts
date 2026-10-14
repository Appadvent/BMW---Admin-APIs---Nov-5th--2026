// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";


export const fetchFeaturesByProduct = createAsyncThunk(
  "features/fetchByProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/feature/product/${productId}`);
      console.log(" API RESPONSE:", data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch features");
    }
  }
);

const featureSlice = createSlice({
  name: "features",
  initialState: {
    feature: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFeatures: (state) => {
      state.feature = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturesByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturesByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.feature = action.payload;
      })
      .addCase(fetchFeaturesByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeatures } = featureSlice.actions;
export default featureSlice.reducer;


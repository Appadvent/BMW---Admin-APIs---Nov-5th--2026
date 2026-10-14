// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Fetch all active banners ordered by sequence
export const fetchActiveBanners = createAsyncThunk(
  "banners/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/banners");
      // Backend response: { statusCode: 200, type: "GET_BANNERS", data: { banners: [...] } } or response.data.data
      const resData = response.data?.data;
      if (resData?.banners && Array.isArray(resData.banners)) {
        return resData.banners;
      }
      if (Array.isArray(resData)) {
        return resData;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch banners"
      );
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    list: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchActiveBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;

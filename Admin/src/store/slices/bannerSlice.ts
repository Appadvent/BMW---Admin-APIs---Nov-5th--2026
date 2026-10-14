import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bannerService } from "../../services/api";

export interface Banner {
  id: number;
  bgMediaType: "IMAGE" | "VIDEO";
  bgMedia: string;
  label?: string | null;
  heading: string;
  description?: string | null;
  textAlignment: "LEFT" | "CENTER" | "RIGHT";
  primaryBtnText?: string | null;
  primaryBtnLink?: string | null;
  secondaryBtnText?: string | null;
  secondaryBtnLink?: string | null;
  sideImage?: string | null;
  sideImagePosition?: "LEFT" | "RIGHT";
  sequence: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BannerState {
  banners: Banner[];
  banner: Banner | null;
  activeCount: number;
  pagination: PaginationData;
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  banner: null,
  activeCount: 0,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  loading: false,
  error: null,
};

// ============ GET ALL BANNERS FOR ADMIN ============
export const fetchBannersAdmin = createAsyncThunk(
  "banners/fetchAdmin",
  async (
    params:
      | { page?: number; limit?: number; search?: string; isActive?: boolean | string }
      | undefined,
    thunkAPI
  ) => {
    try {
      const res = await bannerService.getBannersAdmin(params);
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching banners"
      );
    }
  }
);

// ============ GET BANNER BY ID ============
export const fetchBannerById = createAsyncThunk(
  "banners/fetchById",
  async (id: number | string, thunkAPI) => {
    try {
      const res = await bannerService.getBannerById(id);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching banner"
      );
    }
  }
);

// ============ CREATE BANNER ============
export const createBanner = createAsyncThunk(
  "banners/create",
  async (data: any, thunkAPI) => {
    try {
      const res = await bannerService.createBanner(data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error creating banner"
      );
    }
  }
);

// ============ UPDATE BANNER ============
export const updateBanner = createAsyncThunk(
  "banners/update",
  async ({ id, data }: { id: number | string; data: any }, thunkAPI) => {
    try {
      const res = await bannerService.updateBanner(id, data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error updating banner"
      );
    }
  }
);

// ============ TOGGLE BANNER STATUS ============
export const toggleBannerStatus = createAsyncThunk(
  "banners/toggleStatus",
  async (id: number | string, thunkAPI) => {
    try {
      const res = await bannerService.toggleBannerStatus(id);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error updating banner status"
      );
    }
  }
);

// ============ DELETE BANNER ============
export const deleteBanner = createAsyncThunk(
  "banners/delete",
  async (id: number | string, thunkAPI) => {
    try {
      await bannerService.deleteBanner(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error deleting banner"
      );
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    clearCurrentBanner: (state) => {
      state.banner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Banners
      .addCase(fetchBannersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const resData = action.payload?.data;
        state.banners = resData?.banners || [];
        state.activeCount = resData?.activeCount ?? 0;
        if (resData?.pagination) {
          state.pagination = resData.pagination;
        }
      })
      .addCase(fetchBannersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch banners";
      })

      // Fetch by ID
      .addCase(fetchBannerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannerById.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload;
      })
      .addCase(fetchBannerById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch banner";
      })

      // Create Banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.unshift(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create banner";
      })

      // Update Banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
        if (state.banner?.id === action.payload.id) {
          state.banner = action.payload;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update banner";
      })

      // Toggle Status
      .addCase(toggleBannerStatus.fulfilled, (state, action) => {
        const index = state.banners.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })

      // Delete Banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(
          (b) => b.id !== Number(action.payload)
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete banner";
      });
  },
});

export const { clearCurrentBanner } = bannerSlice.actions;
export default bannerSlice.reducer;

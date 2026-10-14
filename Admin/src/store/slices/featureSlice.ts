import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { featureService } from "../../services/api"; // implement API calls like productService

// Feature interface
interface Feature {
  id: number;
  title: string;
  description: string;
  image: string;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

// Slice state type
interface FeatureState {
  features: Feature[];
  selectedFeature: Feature | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  features: [],
  selectedFeature: null,
  loading: false,
  error: null,
};

// ===== Async Thunks =====

// Fetch all features
export const fetchFeatures = createAsyncThunk(
  "features/fetchFeatures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await featureService.getFeatures();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch features");
    }
  }
);

// Create feature
export const createFeature = createAsyncThunk(
  "features/createFeature",
  async (featureData: FormData, { rejectWithValue }) => {
    try {
      const response = await featureService.createFeature(featureData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create feature");
    }
  }
);

// Update feature
export const updateFeature = createAsyncThunk(
  "features/updateFeature",
  async ({ id, featureData }: { id: number; featureData: FormData }, { rejectWithValue }) => {
    try {
      const response = await featureService.updateFeature(id, featureData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update feature");
    }
  }
);

// Delete feature
export const deleteFeature = createAsyncThunk(
  "features/deleteFeature",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await featureService.deleteFeature(id);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to delete feature");
    }
  }
);

// ===== Slice =====
const featureSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    clearSelectedFeature: (state) => {
      state.selectedFeature = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createFeature.fulfilled, (state, action) => {
        state.features.push(action.payload);
      })
      .addCase(createFeature.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateFeature.fulfilled, (state, action) => {
        const updated = action.payload;
        state.features = state.features.map((f) => (f.id === updated.id ? updated : f));
      })
      .addCase(updateFeature.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.features = state.features.filter((f) => f.id !== action.payload.id);
      })
      .addCase(deleteFeature.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedFeature } = featureSlice.actions;
export default featureSlice.reducer;

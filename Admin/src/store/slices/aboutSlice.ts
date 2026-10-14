import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aboutService } from "../../services/api";

// About Item interface (legacy / hero highlights)
export interface AboutItem {
  id?: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  link?: string | null;
  order?: number;
  isActive?: boolean;
}

// Dynamic Item inside an About Detail Section
export interface AboutSectionItem {
  id?: number;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  order?: number;
  isActive?: boolean;
}

// Dynamic Detail Page Section
export interface AboutSection {
  id?: number;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  description?: string | null;
  content?: string | null;
  image?: string | null;
  imagePosition?: "left" | "right" | "top" | "none";
  layout?: "default" | "split" | "cards" | "stats" | string;
  order?: number;
  isActive?: boolean;
  items?: AboutSectionItem[];
}

// About Section interface
export interface About {
  id: number;
  badge?: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  content?: string | null;
  image?: string | null;
  image2?: string | null;
  videoUrl?: string | null;
  layout?: "image-left" | "image-right" | "image-top" | "text-only" | "centered" | "split";
  itemsLayout?: "grid" | "list" | "cards" | "columns-2" | "columns-3" | "columns-4";
  alignment?: "left" | "center" | "right";
  ctaEnabled?: boolean;
  ctaText?: string | null;
  ctaLink?: string | null;
  ctaTarget?: "_self" | "_blank";
  isActive?: boolean;
  items?: AboutItem[];
  sections?: AboutSection[];
  // Legacy compatibility fields
  titleOne?: string;
  titleTwo?: string;
  descriptionOne?: string;
  descriptionTwo?: string;
  createdAt: string;
  updatedAt: string;
}

// State type
interface AboutState {
  abouts: About[];
  selectedAbout: About | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AboutState = {
  abouts: [],
  selectedAbout: null,
  loading: false,
  error: null,
};

// ================= Async Thunks =================

// Fetch all about sections
export const fetchAbouts = createAsyncThunk("about/fetchAbouts", async () => {
  const response = await aboutService.getAbout();
  return response.data || response;
});

// Fetch by ID
export const fetchAboutById = createAsyncThunk(
  "about/fetchAboutById",
  async (id: string) => {
    const response = await aboutService.getAboutById(id);
    return response.data || response;
  }
);

// Create about
export const createAbout = createAsyncThunk(
  "about/createAbout",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await aboutService.createAbout(payload);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create about");
    }
  }
);

// Update about
export const updateAbout = createAsyncThunk(
  "about/updateAbout",
  async ({ id, payload }: { id: string | number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await aboutService.updateAbout(id.toString(), payload);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update about");
    }
  }
);

// Delete about
export const deleteAbout = createAsyncThunk(
  "about/deleteAbout",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await aboutService.deleteAbout(id);
      return { id, ...(response.data || response) };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to delete about");
    }
  }
);

// ================= Slice =================

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    clearSelectedAbout: (state) => {
      state.selectedAbout = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAbouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbouts.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.abouts = action.payload;
        } else if (Array.isArray(action.payload?.data)) {
          state.abouts = action.payload.data;
        } else {
          state.abouts = [];
        }
      })
      .addCase(fetchAbouts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch about records";
      })

      // Fetch by ID
      .addCase(fetchAboutById.fulfilled, (state, action) => {
        state.selectedAbout = action.payload?.data || action.payload;
      })

      // Create
      .addCase(createAbout.fulfilled, (state, action) => {
        const item = action.payload?.data || action.payload;
        if (item) state.abouts.push(item);
      })
      .addCase(createAbout.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateAbout.fulfilled, (state, action) => {
        const updated = action.payload?.data || action.payload;
        if (updated) {
          state.abouts = state.abouts.map((item) =>
            item.id === updated.id ? updated : item
          );
          if (state.selectedAbout?.id === updated.id) {
            state.selectedAbout = updated;
          }
        }
      })
      .addCase(updateAbout.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteAbout.fulfilled, (state, action) => {
        state.abouts = state.abouts.filter(
          (item) => item.id !== Number(action.payload.id)
        );
        if (state.selectedAbout?.id === Number(action.payload.id)) {
          state.selectedAbout = null;
        }
      })
      .addCase(deleteAbout.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedAbout, clearError } = aboutSlice.actions;
export default aboutSlice.reducer;

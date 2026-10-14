import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "../../services/api"; // implement API calls like featureService

// Category interface
export interface Category {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products?: number;
    blogs?: number;
  };
}

// Slice state type
interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

// ===== Async Thunks =====

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch categories");
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (
    data: { name: string; description?: string | null; image?: string | null } | string,
    { rejectWithValue }
  ) => {
    try {
      const payload = typeof data === "string" ? { name: data } : data;
      const response = await categoryService.createCategory(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create category");
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (
    {
      id,
      name,
      description,
      image,
    }: {
      id: number;
      name?: string;
      description?: string | null;
      image?: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await categoryService.updateCategory(id, {
        name,
        description,
        image,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update category");
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await categoryService.deleteCategory(id);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to delete category");
    }
  }
);

// ===== Slice =====
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        state.categories = state.categories.map((c) =>
          c.id === updated.id ? updated : c
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload.id
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;

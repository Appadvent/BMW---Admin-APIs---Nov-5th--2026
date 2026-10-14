import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { testimonialService } from "../../services/api";

export interface Testimonial {
  id: number;
  name: string;
  message: string;
  image?: string | null;
  designation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TestimonialState {
  testimonials: Testimonial[];
  testimonial: Testimonial | null;
  pagination: PaginationData;
  loading: boolean;
  error: string | null;
}

const initialState: TestimonialState = {
  testimonials: [],
  testimonial: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  loading: false,
  error: null,
};

// ============ GET ALL TESTIMONIALS (PAGINATED & SEARCHABLE) ============
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchAll",
  async (params: { page?: number; limit?: number; search?: string } | undefined, thunkAPI) => {
    try {
      const res = await testimonialService.getTestimonials(params);
      return res; // { success: true, data: [...], pagination: {...} }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching testimonials"
      );
    }
  }
);

// ============ GET TESTIMONIAL BY ID ============
export const fetchTestimonialById = createAsyncThunk(
  "testimonials/fetchById",
  async (id: number | string, thunkAPI) => {
    try {
      const res = await testimonialService.getTestimonialById(id);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching testimonial"
      );
    }
  }
);

// ============ CREATE TESTIMONIAL ============
export const createTestimonial = createAsyncThunk(
  "testimonials/create",
  async (
    data: {
      name: string;
      message: string;
      image?: string | null;
      designation?: string | null;
    },
    thunkAPI
  ) => {
    try {
      const res = await testimonialService.createTestimonial(data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error creating testimonial"
      );
    }
  }
);

// ============ UPDATE TESTIMONIAL ============
export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async (
    {
      id,
      data,
    }: {
      id: number | string;
      data: {
        name?: string;
        message?: string;
        image?: string | null;
        designation?: string | null;
      };
    },
    thunkAPI
  ) => {
    try {
      const res = await testimonialService.updateTestimonial(id, data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error updating testimonial"
      );
    }
  }
);

// ============ DELETE TESTIMONIAL ============
export const deleteTestimonial = createAsyncThunk(
  "testimonials/delete",
  async (id: number | string, thunkAPI) => {
    try {
      await testimonialService.deleteTestimonial(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error deleting testimonial"
      );
    }
  }
);

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearCurrentTestimonial: (state) => {
      state.testimonial = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL
    builder.addCase(fetchTestimonials.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTestimonials.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonials = action.payload?.data || [];
      if (action.payload?.pagination) {
        state.pagination = action.payload.pagination;
      }
    });
    builder.addCase(fetchTestimonials.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // FETCH BY ID
    builder.addCase(fetchTestimonialById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTestimonialById.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonial = action.payload;
    });
    builder.addCase(fetchTestimonialById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createTestimonial.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonials.unshift(action.payload);
      state.pagination.total += 1;
    });
    builder.addCase(createTestimonial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // UPDATE
    builder.addCase(updateTestimonial.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.testimonials.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.testimonials[index] = action.payload;
      }
      if (state.testimonial?.id === action.payload.id) {
        state.testimonial = action.payload;
      }
    });
    builder.addCase(updateTestimonial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteTestimonial.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonials = state.testimonials.filter(
        (item) => item.id !== Number(action.payload)
      );
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    });
    builder.addCase(deleteTestimonial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentTestimonial } = testimonialSlice.actions;
export default testimonialSlice.reducer;

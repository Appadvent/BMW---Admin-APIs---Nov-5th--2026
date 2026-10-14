import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewService } from '../../services/api';

export interface ReviewState {
  reviews: any[];
  review: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  review: null,
  loading: false,
  error: null,
};

// ============ GET ALL REVIEWS ============
export const fetchReviews = createAsyncThunk(
  "reviews/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await reviewService.getReviews();
      return res.data; // api returns data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching reviews");
    }
  }
);

// ============ GET REVIEW BY ID ============
export const fetchReviewById = createAsyncThunk(
  "reviews/fetchById",
  async (id: string, thunkAPI) => {
    try {
      const res = await reviewService.getReviewById(id);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching review");
    }
  }
);

// ============ CREATE REVIEW ============
export const createReview = createAsyncThunk(
  "reviews/create",
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await reviewService.createReview(formData);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error creating review");
    }
  }
);

// ============ UPDATE REVIEW ============
export const updateReview = createAsyncThunk(
  "reviews/update",
  async ({ id, formData }: { id: string; formData: FormData }, thunkAPI) => {
    try {
      const res = await reviewService.updateReview(id, formData);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error updating review");
    }
  }
);

// ============ DELETE REVIEW ============
export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async (id: string, thunkAPI) => {
    try {
      await reviewService.deleteReview(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error deleting review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // ===================== FETCH ALL =====================
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===================== GET BY ID =====================
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===================== CREATE =====================
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===================== UPDATE =====================
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateReview.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===================== DELETE =====================
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (item) => item.id !== Number(action.payload)
        );
      })
      .addCase(deleteReview.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;

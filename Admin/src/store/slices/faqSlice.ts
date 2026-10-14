import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { faqService } from "../../services/api";

// GET ALL
export const fetchFaqs = createAsyncThunk("faq/fetchAll", async (_, thunkAPI) => {
  try {
    return await faqService.getAll();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch FAQ");
  }
});

// GET BY ID
export const fetchFaqById = createAsyncThunk(
  "faq/fetchById",
  async (id: number, thunkAPI) => {
    try {
      return await faqService.getById(id);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch FAQ");
    }
  }
);

// CREATE
export const createFaq = createAsyncThunk("faq/create", async (faq: any, thunkAPI) => {
  try {
    return await faqService.create(faq);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create FAQ");
  }
});

// UPDATE
export const updateFaq = createAsyncThunk(
  "faq/update",
  async ({ id, faq }: { id: number; faq: any }, thunkAPI) => {
    try {
      return await faqService.update(id, faq);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update FAQ");
    }
  }
);

// DELETE
export const deleteFaq = createAsyncThunk("faq/delete", async (id: number, thunkAPI) => {
  try {
    return await faqService.delete(id);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete FAQ");
  }
});

interface FAQState {
  faqs: any[];
  currentFaq: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: FAQState = {
  faqs: [],
  currentFaq: null,
  loading: false,
  error: null,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload.data;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by id
      .addCase(fetchFaqById.fulfilled, (state, action) => {
        state.currentFaq = action.payload.data;
      })

      // Create
      .addCase(createFaq.fulfilled, (state, action) => {
        state.faqs.unshift(action.payload.data);
      })

      // Update
      .addCase(updateFaq.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.faqs = state.faqs.map((faq) => (faq.id === updated.id ? updated : faq));
      })

      // Delete
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter((faq) => faq.id !== action.meta.arg);
      });
  },
});

export default faqSlice.reducer;

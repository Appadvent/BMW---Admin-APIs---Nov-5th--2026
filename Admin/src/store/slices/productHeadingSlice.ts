
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productHeadingService } from "../../services/api";

export interface ProductHeadingState {
  headings: any[];
  heading: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductHeadingState = {
  headings: [],
  heading: null,
  loading: false,
  error: null,
};

// ============ GET ALL ============
export const fetchHeadings = createAsyncThunk(
  "productHeading/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await productHeadingService.getAll();
      return res; // <-- FIX
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching headings"
      );
    }
  }
);

// ============ GET BY ID ============
export const fetchHeadingById = createAsyncThunk(
  "productHeading/fetchById",
  async (id: number, thunkAPI) => {
    try {
      const res = await productHeadingService.getById(id);
      return res; // <-- FIX
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching heading"
      );
    }
  }
);

// ============ CREATE ============
export const createHeading = createAsyncThunk(
  "productHeading/create",
  async (data: { title: string; description: string }, thunkAPI) => {
    try {
      const res = await productHeadingService.create(data);
      return res; // <-- FIX (return only created object)
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error creating heading"
      );
    }
  }
);

// ============ UPDATE ============
export const updateHeading = createAsyncThunk(
  "productHeading/update",
  async (
    { id, data }: { id: number; data: { title: string; description: string } },
    thunkAPI
  ) => {
    try {
      const res = await productHeadingService.update(id, data);
      return res; // <-- FIX
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating heading"
      );
    }
  }
);

// ============ DELETE ============
export const deleteHeading = createAsyncThunk(
  "productHeading/delete",
  async (id: number, thunkAPI) => {
    try {
      await productHeadingService.delete(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting heading"
      );
    }
  }
);

const productHeadingSlice = createSlice({
  name: "productHeading",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchHeadings.fulfilled, (state, action) => {
        state.loading = false;
        state.headings = action.payload;
      })

      // CREATE
      .addCase(createHeading.fulfilled, (state, action) => {
        state.loading = false;
        state.headings.push(action.payload); // Now SAFE
      })

      // UPDATE
      .addCase(updateHeading.fulfilled, (state, action) => {
        state.loading = false;
        state.headings = state.headings.map((h) =>
          h.id === action.payload.id ? action.payload : h
        );
      })

      // DELETE
      .addCase(deleteHeading.fulfilled, (state, action) => {
        state.loading = false;
        state.headings = state.headings.filter(
          (h) => h.id !== Number(action.payload)
        );
      });
  },
});

export default productHeadingSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { founderService } from "../../services/api";

export interface Founder {
  id: number;
  name: string;
  title: string;
  description: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface FounderState {
  founders: Founder[];
  loading: boolean;
  error: string | null;
}

const initialState: FounderState = {
  founders: [],
  loading: false,
  error: null,
};

export const fetchFounders = createAsyncThunk("founders/fetchAll", async () => {
  const res = await founderService.getFounders();
  return res.data as Founder[];
});

export const createFounder = createAsyncThunk(
  "founders/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await founderService.createFounder(formData);
      return res.data as Founder;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed");
    }
  }
);

export const updateFounder = createAsyncThunk(
  "founders/update",
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await founderService.updateFounder(id, formData);
      return res.data as Founder;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed");
    }
  }
);

export const deleteFounder = createAsyncThunk(
  "founders/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await founderService.deleteFounder(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed");
    }
  }
);

const founderSlice = createSlice({
  name: "founders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFounders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFounders.fulfilled, (state, action) => {
        state.loading = false;
        state.founders = action.payload;
      })
      .addCase(fetchFounders.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error.message || "Failed to fetch");
      })

      .addCase(createFounder.fulfilled, (state, action) => {
        state.founders.unshift(action.payload);
      })
      .addCase(createFounder.rejected, (state, action) => {
        state.error = String(action.payload as any || action.error.message);
      })

      .addCase(updateFounder.fulfilled, (state, action) => {
        state.founders = state.founders.map((f) =>
          f.id === action.payload.id ? action.payload : f
        );
      })
      .addCase(updateFounder.rejected, (state, action) => {
        state.error = String(action.payload as any || action.error.message);
      })

      .addCase(deleteFounder.fulfilled, (state, action) => {
        state.founders = state.founders.filter((f) => f.id !== action.payload);
      })
      .addCase(deleteFounder.rejected, (state, action) => {
        state.error = String(action.payload as any || action.error.message);
      });
  },
});

export default founderSlice.reducer;

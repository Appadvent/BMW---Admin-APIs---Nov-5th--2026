import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { planService } from "../../services/api";



export const getPlans = createAsyncThunk(
  "plans/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await planService.getPlans();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPlanById = createAsyncThunk(
  "plans/getById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await planService.getPlanById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPlan = createAsyncThunk(
  "plans/create",
  async (data: any, { rejectWithValue }) => {
    try {
      return await planService.createPlan(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePlan = createAsyncThunk(
  "plans/update",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      return await planService.updatePlan(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePlan = createAsyncThunk(
  "plans/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await planService.deletePlan(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -----------------------------
// SLICE
// -----------------------------

interface PlanState {
  plans: any[];
  selectedPlan: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PlanState = {
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null,
  success: false,
};

export const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    clearStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ------- GET ALL -------
    builder.addCase(getPlans.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPlans.fulfilled, (state, action) => {
      state.loading = false;
    //   state.plans = action.payload;
     state.plans = action.payload?.data || [];
    });
    builder.addCase(getPlans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ------- GET BY ID -------
    builder.addCase(getPlanById.fulfilled, (state, action) => {
    //   state.selectedPlan = action.payload;
     state.plans = action.payload?.data || [];
    });

    // ------- CREATE -------
    builder.addCase(createPlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPlan.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(createPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ------- UPDATE -------
    builder.addCase(updatePlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePlan.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(updatePlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ------- DELETE -------
    builder.addCase(deletePlan.fulfilled, (state) => {
      state.success = true;
    });
  },
});

export const { clearStatus } = planSlice.actions;
export default planSlice.reducer;

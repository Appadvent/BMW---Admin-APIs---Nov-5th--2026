import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { serviceApi } from "../../services/api";

export interface ServiceItem {
  id?: number;
  title: string;
  description: string;
  image?: string | null;
}

export interface Service {
  id: number;
  heading: string;
  items: ServiceItem[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

// Async Thunks

export const fetchServices = createAsyncThunk(
  "services/fetchAll",
  async () => {
    const data = await serviceApi.getAllServices();
    return data.data as Service[];
  }
);

export const createService = createAsyncThunk(
  "services/create",
  async (payload: any) => {
    const data = await serviceApi.createService(payload);
    return data.data as Service;
  }
);

export const updateService = createAsyncThunk<
  Service,
  { id: number; payload: any },
  { rejectValue: string }
>(
  "services/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await serviceApi.updateService(id, payload);

      if (res.success === false) {
        return rejectWithValue(res.message);
      }

      return res.data as Service;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update service"
      );
    }
  }
);



export const deleteService = createAsyncThunk(
  "services/delete",
  async (id: number) => {
    await serviceApi.deleteService(id);
    return id;
  }
);

// Slice
const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch services";
      })

      // CREATE
      .addCase(createService.pending, (state) => {
        state.loading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create service";
      })

      // UPDATE
      .addCase(updateService.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update service";
      })

      // DELETE
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete service";
      });
  },
});

export default serviceSlice.reducer;

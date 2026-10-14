import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queryService } from '../../services/api';

export interface Query {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  services?: string;
  carModel?: string;
  vin?: string;
  oemNumber?: string;
  year?: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

interface QueryState {
  queries: Query[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  selectedQuery: Query | null;
  loading: boolean;
  error: string | null;
}

const initialState: QueryState = {
  queries: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  selectedQuery: null,
  loading: false,
  error: null,
};

// Async thunk for fetching queries
export const fetchQueries = createAsyncThunk(
  'queries/fetchQueries',
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await queryService.getQueries(params);
    return response;
  }
);

const querySlice = createSlice({
  name: 'queries',
  initialState,
  reducers: {
    clearSelectedQuery: (state) => {
      state.selectedQuery = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.loading = false;
        const resData = action.payload?.data;
        if (resData?.queries) {
          state.queries = resData.queries;
          state.pagination = resData.pagination || {
            total: resData.queries.length,
            page: 1,
            limit: resData.queries.length,
            totalPages: 1,
          };
        } else if (Array.isArray(resData)) {
          state.queries = resData;
          state.pagination = {
            total: resData.length,
            page: 1,
            limit: resData.length,
            totalPages: 1,
          };
        }
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch queries';
      });
  },
});

export const { clearSelectedQuery } = querySlice.actions;

export default querySlice.reducer;


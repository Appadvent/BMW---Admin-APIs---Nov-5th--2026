// @ts-nocheck
// redux/slices/BlogSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Fetch all blogs with optional pagination & append support for lazy loading
export const fetchAllBlogs = createAsyncThunk(
  "blogs/fetchAll",
  async (params?: { page?: number; limit?: number; append?: boolean }, { rejectWithValue }) => {
    try {
      const page = params?.page || 1;
      const limit = params?.limit;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());

      const url = `/blog/blogs/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await api.get(url);
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || {
          total: response.data.data?.length || 0,
          page,
          limit: limit || response.data.data?.length || 0,
          totalPages: 1,
        },
        append: !!params?.append,
        page,
      };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch all blogs");
    }
  }
);

// Fetch blogs by categoryId
export const fetchBlogsByCategory = createAsyncThunk(
  "blogs/fetchByCategory",
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/blogs/category/${categoryId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch blogs by category");
    }
  }
);

// Fetch single blog by ID
export const fetchBlogById = createAsyncThunk(
  "blogs/fetchById",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/blogs/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch blog details");
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    list: [],
    currentBlog: null,
    loading: false,
    detailLoading: false,
    loadingMore: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: true,
  },
  reducers: {
    clearBlogs: (state) => {
      state.list = [];
      state.currentBlog = null;
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.total = 0;
      state.hasMore = true;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchAllBlogs.pending, (state, action) => {
        const isAppend = action.meta.arg?.append;
        if (isAppend) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        const { data, pagination, append, page } = action.payload;
        state.loading = false;
        state.loadingMore = false;
        state.currentPage = page;
        state.totalPages = pagination.totalPages;
        state.total = pagination.total;
        state.hasMore = page < pagination.totalPages;

        if (append) {
          // Prevent duplicates
          const existingIds = new Set(state.list.map((item: any) => item.id));
          const newItems = data.filter((item: any) => !existingIds.has(item.id));
          state.list = [...state.list, ...newItems];
        } else {
          state.list = data;
        }
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      })

      // Fetch blogs by category
      .addCase(fetchBlogsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBlogsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogs, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;


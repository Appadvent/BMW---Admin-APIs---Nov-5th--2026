// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// 🔹 Fetch all products (supports optional categoryId, subcategoryId, tag, search filter)
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (
    params?:
      | {
          categoryId?: number | string;
          subcategoryId?: number | string;
          tag?: string;
          search?: string;
          limit?: number;
        }
      | number
      | string,
    { rejectWithValue }
  ) => {
    try {
      const cleanParams: any = { limit: 100 };
      if (typeof params === "object" && params !== null) {
        if (params.categoryId && params.categoryId !== "all") {
          cleanParams.categoryId = params.categoryId;
        }
        if (params.subcategoryId && params.subcategoryId !== "all") {
          cleanParams.subcategoryId = params.subcategoryId;
        }
        if (params.tag) cleanParams.tag = params.tag;
        if (params.search) cleanParams.search = params.search;
        if (params.limit) cleanParams.limit = params.limit;
      } else if (params !== undefined && params !== null && params !== "all" && params !== "") {
        cleanParams.categoryId = params;
      }
      const { data } = await api.get("/product", { params: cleanParams });
      return data.data; // returns products array in 'data'
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// 🔹 Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/product/${id}`);
      return data.data; // returns single product object with specifications, features, category, tag
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

interface ProductState {
  list: any[];
  loading: boolean;
  error: any;
  currentProduct: any;
  currentLoading: boolean;
  currentError: any;
}

const initialState: ProductState = {
  list: [],
  loading: false,
  error: null,
  currentProduct: null,
  currentLoading: false,
  currentError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.currentLoading = false;
      state.currentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // products array
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 Single Product Detail
      .addCase(fetchProductById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;


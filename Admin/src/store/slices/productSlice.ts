import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productService } from "../../services/api";

// ✅ Create Product
export const createProduct = createAsyncThunk(
  "product/create",
  async (productData: { title: string; description: string; image?: string }, { rejectWithValue }) => {
    try {
      const res = await productService.createProduct(productData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error creating product");
    }
  }
);

// ✅ Update Product
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, product }: { id: string; product: { title?: string; description?: string; image?: string } }, { rejectWithValue }) => {
    try {
      const res = await productService.updateProduct(id, product);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error updating product");
    }
  }
);

// ✅ Fetch All Products
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (
    params: { page?: number; limit?: number; search?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const res = await productService.getProducts(params);
      return res; // backend returns { success: true, data: [...], pagination: { total, page, limit, totalPages } }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error fetching products");
    }
  }
);

// ✅ Delete Product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error deleting product");
    }
  }
);

// ✅ Product Slice
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [] as any[],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ CREATE
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ UPDATE
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p: any) => p.id === action.payload.id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ FETCH ALL
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.products = action.payload.data;
          state.pagination = action.payload.pagination || {
            total: action.payload.data.length,
            page: 1,
            limit: action.payload.data.length,
            totalPages: 1,
          };
        } else if (Array.isArray(action.payload)) {
          state.products = action.payload;
          state.pagination = {
            total: action.payload.length,
            page: 1,
            limit: action.payload.length,
            totalPages: 1,
          };
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ DELETE
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p: any) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;

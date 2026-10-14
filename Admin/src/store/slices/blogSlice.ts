import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogService } from "../../services/api";

// Blog interface
interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

// State type
interface BlogState {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BlogState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
};

// ===== Async Thunks =====
export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const response = await blogService.getBlogs();
  return response.data;
});

// export const fetchBlogById = createAsyncThunk(
//   "blogs/fetchBlogById",
//   async (id: string) => {
//     const response = await blogService.getBlogById(id);
//     return response.data;
//   }
// );

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData: any, { rejectWithValue }) => {
    try {
      const response = await blogService.createBlog(blogData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }: { id: string; blogData: any }, { rejectWithValue }) => {
    try {
      const response = await blogService.updateBlog(id, blogData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await blogService.deleteBlog(id);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to delete blog");
    }
  }
);

// ===== Slice =====
const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Fetch all blogs =====
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload?.data || [];
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch blogs";
      })

      // ===== Fetch blog by ID =====
    //   .addCase(fetchBlogById.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchBlogById.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.selectedBlog = action.payload.data;
    //   })
    //   .addCase(fetchBlogById.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string || "Failed to fetch blog";
    //   })

      // ===== Create blog =====
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload.data);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ===== Update blog =====
      // .addCase(updateBlog.fulfilled, (state, action) => {
      //   const updated = action.payload.data;
      //   state.blogs = state.blogs.map((b) =>
      //     b.id === updated.id ? updated : b
      //   );
      //   if (state.selectedBlog?.id === updated.id) {
      //     state.selectedBlog = updated;
      //   }
      // })
      .addCase(updateBlog.fulfilled, (state, action) => {
  const updated = action.payload.data;
  state.blogs = state.blogs.map((b) => (b.id === updated.id ? updated : b));
})

      .addCase(updateBlog.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ===== Delete blog =====
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b.id !== Number(action.payload.id));
        if (state.selectedBlog?.id === Number(action.payload.id)) {
          state.selectedBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;

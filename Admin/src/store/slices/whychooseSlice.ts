import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { whyChooseService } from "../../services/api";

export interface WhyChooseState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WhyChooseState = {
  items: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchWhyChoose = createAsyncThunk(
  "whyChoose/fetch",
  async () => await whyChooseService.getAll()
);

export const createWhyChoose = createAsyncThunk(
  "whyChoose/create",
  async (data: any) => await whyChooseService.create(data)
);

export const updateWhyChoose = createAsyncThunk(
  "whyChoose/update",
  async ({ id, data }: any) => await whyChooseService.update(id, data)
);

export const deleteWhyChoose = createAsyncThunk(
  "whyChoose/delete",
  async (id: number) => {
    await whyChooseService.delete(id);
    return id;
  }
);

const whyChooseSlice = createSlice({
  name: "whyChoose",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhyChoose.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWhyChoose.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(createWhyChoose.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateWhyChoose.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })

      .addCase(deleteWhyChoose.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default whyChooseSlice.reducer;

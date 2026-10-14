import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { missionVisionApi } from "../../services/api";

export interface MissionVisionItem {
  id?: number;
  title: string;
  description: string;
}

export interface MissionVision {
  id: number;
  heading: string;
  description: string;
  items: MissionVisionItem[];
  createdAt: string;
  updatedAt: string;
}

interface MissionVisionState {
  items: MissionVision[];
  loading: boolean;
  error: string | null;
}

const initialState: MissionVisionState = {
  items: [],
  loading: false,
  error: null,
};

// FETCH ALL
export const fetchMissionVision = createAsyncThunk(
  "missionVision/fetchAll",
  async () => {
    const res = await missionVisionApi.getAll();
    return res.data.data as MissionVision[];
  }
);

// CREATE
export const createMissionVision = createAsyncThunk(
  "missionVision/create",
  async (formData: any) => {
    const res = await missionVisionApi.create(formData);
    return res.data.data as MissionVision;
  }
);

// UPDATE
export const updateMissionVision = createAsyncThunk(
  "missionVision/update",
  async ({ id, data }: any) => {
    const res = await missionVisionApi.update(id, data);
    return res.data.data as MissionVision;
  }
);

// DELETE
export const deleteMissionVision = createAsyncThunk(
  "missionVision/delete",
  async (id: number) => {
    await missionVisionApi.delete(id);
    return id;
  }
);

const missionVisionSlice = createSlice({
  name: "missionVision",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchMissionVision.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMissionVision.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      // CREATE
      .addCase(createMissionVision.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateMissionVision.fulfilled, (state, action) => {
        state.items = state.items.map((mv) =>
          mv.id === action.payload.id ? action.payload : mv
        );
      })

      // DELETE
      .addCase(deleteMissionVision.fulfilled, (state, action) => {
        state.items = state.items.filter((mv) => mv.id !== action.payload);
      });
  },
});

export default missionVisionSlice.reducer;

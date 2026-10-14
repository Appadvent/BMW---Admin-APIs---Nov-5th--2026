
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./Slice/productSlice";
import featureReducer from "./Slice/featureSlice";
import categoryReducer from "./Slice/categorySlice";
import BlogReducer from "./Slice/BlogSlice";
import pageReducer from "./Slice/pageSlice";
import contactReducer from "./Slice/contactSlice";
import testimonialReducer from "./Slice/testimonialSlice";
import bannerReducer from "./Slice/bannerSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    features: featureReducer,
    categories: categoryReducer,
    blogs: BlogReducer,
    pages: pageReducer,
    contact: contactReducer,
    testimonials: testimonialReducer,
    banners: bannerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

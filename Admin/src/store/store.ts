import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import pageReducer from './slices/pageSlice';
import queryReducer from './slices/querySlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import blogReducer from './slices/blogSlice';
import reviewReducer from "./slices/reviewSlice";
import serviceReducer from "./slices/serviceSlice";
import founderReducer from "./slices/founderSlice";
import missionReducer from "./slices/missionSlice";
import whyChooseReducer from "./slices/whychooseSlice";
import productHeadingReducer from "./slices/productHeadingSlice";
import faqReducer from "./slices/faqSlice";
import planReducer from "./slices/planSlice";
import aboutReducer from "./slices/aboutSlice";
import testimonialReducer from "./slices/testimonialSlice";
import bannerReducer from "./slices/bannerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    pages: pageReducer,
    queries: queryReducer,
    products: productReducer,
    categories: categoryReducer,
    blogs: blogReducer,
    reviews: reviewReducer,
    testimonials: testimonialReducer,
    banners: bannerReducer,
    services: serviceReducer,
    founders: founderReducer,
    mission: missionReducer,
    whyChoose: whyChooseReducer,
    productHeading: productHeadingReducer,
    faq: faqReducer,
    plans: planReducer,
    abouts: aboutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
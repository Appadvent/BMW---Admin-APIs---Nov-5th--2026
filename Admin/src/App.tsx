import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store/store";
import LoginPage from "./components/Auth/LoginPage";
import DashboardLayout from "./components/Layout/DashboardLayout";
import UserList from "./components/Users/UserList";
import PageList from "./components/Pages/PageList";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Home from "./components/Home/Home";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import QueryList from "./components/Querys/QueryList";
import PageForm from "./components/Pages/PageForm";
import ProductForm from "./components/Product/ProductForm";
import ProductList from "./components/Product/ProductList";
import FeatureDetails from "./components/Product/FeatureDetail";
import CategoryForm from "./components/Category/CategoryForm";
import CategoryList from "./components/Category/CategoryList";
import BlogForm from "./components/Blog/BlogForm"
import BlogList from "./components/Blog/BlogList"
import AboutForm from "./components/About/AboutForm";
import AboutPage from "./components/About/AboutPage"
import TestimonialForm from "./components/Testimonials/TestimonialForm";
import TestimonialList from "./components/Testimonials/TestimonialList";
import BannerForm from "./components/Banner/BannerForm";
import BannerList from "./components/Banner/BannerList";
import ReviewForm from "./components/Reviews/ReviewForm";
import ReviewList from "./components/Reviews/ReviewList";
import ServiceForm from "./components/Service/ServiceForm";
import ServiceList from "./components/Service/ServiceList";
import FounderForm from "./components/Founder/FounderFom";
import FounderList from "./components/Founder/FounderList";
import MissionForm from "./components/mission/MVisionForm";
import MissionList from "./components/mission/MVisionList"
import WhyChooseForm from "./components/whyChoose/WhyChooseForm";
import WhyChooseList from "./components/whyChoose/WhyChooseList";
import ProductHeadingForm from "./components/productHeading/HeadingProductForm";
import ProductHeadingList from "./components/productHeading/HeadingProductList"
import FAQForm from "./components/faq/FaqForm";
import FAQList from "./components/faq/FaqList";
// import PlanForm from "./components/plan/PlanForm";
// import PlanList from "./components/plan/PlanList"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="users" element={<UserList />} />
            <Route path="home" element={<Home />} />
            <Route path="pages" element={<PageList />} />
            <Route path="pagesForm" element={<PageForm />} />
            <Route path="queries" element={<QueryList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="productsForm" element={<ProductForm />} />
            <Route path="feature-details" element={<FeatureDetails />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogForm" element={<BlogForm />} />
            <Route path="categories" element={<CategoryList />}></Route>
            <Route path="categoryForm" element={<CategoryForm />}></Route>
            <Route path="aboutForm" element={<AboutForm/>}></Route>
            <Route path="abouts" element={<AboutPage/>}></Route>
            <Route path="testimonials" element={<TestimonialList />}></Route>
            <Route path="testimonialForm" element={<TestimonialForm />}></Route>
            <Route path="banners" element={<BannerList />}></Route>
            <Route path="bannerForm" element={<BannerForm />}></Route>
            <Route path="bannerForm/:id" element={<BannerForm />}></Route>
            <Route path="reviewsForm" element={<ReviewForm/>}></Route>
            <Route path="reviews"  element={<ReviewList/>}></Route>
            <Route path="serviceForm" element={<ServiceForm/>}></Route>
            <Route path="services"  element={<ServiceList/>}></Route>
            <Route path="founderForm" element={<FounderForm/>}></Route>
            <Route path="founderList" element={<FounderList/>}></Route>
            <Route path="missionForm" element={<MissionForm/>}></Route>
            <Route path="mission" element={<MissionList/>}></Route>
            <Route path="whyChooseForm" element={<WhyChooseForm/>}></Route>
            <Route path="whyChooseList" element={<WhyChooseList/>}></Route>
            <Route path="productHeadingForm" element={<ProductHeadingForm/>}></Route>
            <Route path="productHeading" element={<ProductHeadingList />}></Route>
            <Route path="faq" element={<FAQForm/>}></Route>
            <Route path="faqList" element={<FAQList/>}></Route>
            {/* <Route path="plan" element={<PlanForm/>}></Route>
            <Route path="planList" element={<PlanList/>}></Route> */}
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;

import axios from 'axios';
// import { AxiosProgressEvent } from 'axios';
// import { Recipient } from '../types';


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadService = {
  uploadFile: async (file: File, folder: string = "uploads") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // { success: true, data: { url: "...", key: "..." } }
  },

  uploadMultipleFiles: async (files: File[], folder: string = "uploads") => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("folder", folder);

    const response = await api.post("/api/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteFile: async (url: string) => {
    if (!url) return;
    const response = await api.delete("/api/upload", {
      data: { url },
    });
    return response.data;
  },

  getFiles: async (folder?: string) => {
    const response = await api.get("/api/upload", {
      params: folder ? { folder } : {},
    });
    return response.data;
  },
};

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/admin/login', credentials);
    // console.log("response", response);
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get('/api/user/get-users');
    // console.log("response users ", response);
    return response.data;

  },



  deleteUser: async (userId: string, payload: any,) => {
    console.log("userId", userId, "payload", payload);

    const response = await api.delete(`/api/admin/delete-user/${userId}`, { data: payload });
    // console.log("response", response);

    return response.data;
  },



  sendEmail: async (emailData: { email: any, subject: string, content: string }) => {
    // console.log("emailData", emailData);
    const response = await api.post('/api/admin/send-email', emailData);
    return response.data;
  },

};

export const statsService = {
  getStats: async (params?: { startDate?: string; endDate?: string; range?: string }) => {
    const response = await api.get('/api/admin/stats', { params });
    return response.data;
  },
};



export const queryService = {
  getQueries: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/api/query/get-queries', { params });
    return response.data;
  },
  deleteQuery: async (queryId: string) => {
    const response = await api.delete(`/api/query/delete-query/${queryId}`);
    return response.data;
  }
}



export const pageService = {
  getPage: async () => {
    const response = await api.get('/api/page/get-pages');
    // console.log("response", response);
    return response.data;
  },

  createPage: async (page: any) => {
    const response = await api.post('/api/page/create', page);
    // console.log("response", response);
    return response.data;
  },

  updatePage: async (id: string, page: any) => {
    const response = await api.patch(`/api/page/update/${id}`, page);
    // console.log("response", response);
    return response.data;
  },

  deletePage: async (id: string) => {
    // console.log("id", id);

    const response = await api.delete(`/api/page/delete/${id}`);
    // console.log("response", response);
    return response.data;
  },
}


export const productService = {
  getProducts: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/api/product/', { params });
    console.log("All products response:", response.data);
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/api/product/${id}`);
    console.log("Product response:", response.data);
    return response.data;
  },

  createProduct: async (product: any) => {
    const response = await api.post('/api/product/create', product);
    console.log("Create product response:", response.data);
    return response.data;
  },

  updateProduct: async (id: string, product: any) => {
    const response = await api.patch(`/api/product/${id}`, product);
    console.log("Update product response:", response.data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/api/product/${id}`);
    console.log("Delete product response:", response.data);
    return response.data;
  },
};


export const featureService = {
  // Get all features
  getFeatures: async () => {
    const response = await api.get("/api/feature/get-all");
    return response.data;
  },

  // Get features by product ID
  getFeaturesByProduct: async (productId: number) => {
    const response = await api.get(`/api/feature/product/${productId}`);
    return response.data;
  },

  // Get single feature by ID
  getFeatureById: async (id: number) => {
    const response = await api.get(`/api/feature/${id}`);
    return response.data;
  },

  // Create a new feature
  createFeature: async (data: any) => {
    const response = await api.post("/api/feature/", data);
    return response.data;
  },

  // Update feature
  updateFeature: async (id: number, data: any) => {
    const response = await api.patch(`/api/feature/${id}`, data);
    return response.data;
  },

  // Delete feature
  deleteFeature: async (id: number) => {
    const response = await api.delete(`/api/feature/${id}`);
    return response.data;
  },
};

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get("/api/category");
    return response.data;
  },

  // Get single category by ID
  getCategoryById: async (id: number) => {
    const response = await api.get(`/api/category/${id}`);
    return response.data;
  },

  // Create a new category
  createCategory: async (data: { name: string; description?: string | null; image?: string | null }) => {
    const response = await api.post("/api/category/create", data);
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, data: { name?: string; description?: string | null; image?: string | null }) => {
    const response = await api.patch(`/api/category/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number) => {
    const response = await api.delete(`/api/category/${id}`);
    return response.data;
  },
};

export const subcategoryService = {
  // Get all subcategories, optionally filtered by categoryId
  getSubcategories: async (params?: { categoryId?: number; status?: string }) => {
    const response = await api.get("/api/subcategory", { params });
    return response.data;
  },

  // Get single subcategory by ID
  getSubcategoryById: async (id: number | string) => {
    const response = await api.get(`/api/subcategory/${id}`);
    return response.data;
  },

  // Create a new subcategory
  createSubcategory: async (data: {
    name: string;
    categoryId: number;
    slug?: string | null;
    description?: string | null;
    image?: string | null;
    status?: string;
  }) => {
    const response = await api.post("/api/subcategory/create", data);
    return response.data;
  },

  // Update subcategory
  updateSubcategory: async (
    id: number | string,
    data: {
      name?: string;
      categoryId?: number;
      slug?: string | null;
      description?: string | null;
      image?: string | null;
      status?: string;
    }
  ) => {
    const response = await api.patch(`/api/subcategory/${id}`, data);
    return response.data;
  },

  // Delete subcategory
  deleteSubcategory: async (id: number | string) => {
    const response = await api.delete(`/api/subcategory/${id}`);
    return response.data;
  },
};

export const blogService = {
  // Get all blogs
  getBlogs: async () => {
    return await api.get("/api/blog/blogs/");
  },

  // Create blog
  createBlog: async (blogData: any) => {
    return await api.post("/api/blog/blogs", blogData);
  },

  // Update blog
  updateBlog: async (id: string, blogData: any) => {
    return await api.patch(`/api/blog/blogs/${id}`, blogData);
  },

  // Delete blog
  deleteBlog: async (id: string) => {
    return await api.delete(`/api/blog/blogs/${id}`);
  },
};

export const aboutService = {
  // Get all about sections
  getAbout: async () => {
    const response = await api.get("/api/about/");
    return response.data;
  },

  // Get about by ID
  getAboutById: async (id: string) => {
    const response = await api.get(`/api/about/${id}`);
    return response.data;
  },

  // Create about
  createAbout: async (data: any) => {
    const response = await api.post("/api/about/", data);
    return response.data;
  },

  // Update about
  updateAbout: async (id: string, data: any) => {
    const response = await api.patch(`/api/about/${id}`, data);
    return response.data;
  },

  // Delete about
  deleteAbout: async (id: number | string) => {
    const response = await api.delete(`/api/about/${id}`);
    return response.data;
  },
};

export const reviewService = {
  // Get all reviews
  getReviews: async () => {
    const response = await api.get("/api/reviews/");
    return response.data;
  },

  // Get review by ID
  getReviewById: async (id: string) => {
    const response = await api.get(`/api/reviews/${id}`);
    return response.data;
  },

  // Create review
  createReview: async (data: any) => {
    const response = await api.post("/api/reviews/", data);
    return response.data;
  },

  // Update review
  updateReview: async (id: string, data: any) => {
    const response = await api.patch(`/api/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  deleteReview: async (id: string) => {
    const response = await api.delete(`/api/reviews/${id}`);
    return response.data;
  },
};

export const serviceApi = {
  getAllServices: async () => {
    const response = await api.get("/api/services/");
    return response.data;
  },

  getServiceById: async (id: number | string) => {
    const response = await api.get(`/api/services/${id}`);
    return response.data;
  },

  createService: async (data: any) => {
    const response = await api.post("/api/services", data);
    return response.data;
  },

  updateService: async (id: number | string, data: any) => {
    const response = await api.patch(`/api/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: number | string) => {
    const response = await api.delete(`/api/services/${id}`);
    return response.data;
  },
};

export const founderService = {
  getFounders: async () => {
    const resp = await api.get("/api/founders");
    return resp.data;
  },

  getFounderById: async (id: number | string) => {
    const resp = await api.get(`/api/founders/${id}`);
    return resp.data;
  },

  createFounder: async (data: any) => {
    const resp = await api.post("/api/founders", data);
    return resp.data;
  },

  updateFounder: async (id: number | string, data: any) => {
    const resp = await api.patch(`/api/founders/${id}`, data);
    return resp.data;
  },

  deleteFounder: async (id: number | string) => {
    const resp = await api.delete(`/api/founders/${id}`);
    return resp.data;
  },
};

export const homeService = {
  getHomes: () => api.get("/api/home"),
  createHome: (data: any) => api.post("/api/home", data),
  updateHome: (id: number, data: any) => api.patch(`/api/home/${id}`, data),
  deleteHome: (id: number) => api.delete(`/api/home/${id}`),
};

export const missionVisionApi = {
  getAll: () => api.get("/api/mission"),
  getById: (id: number) => api.get(`/api/mission/${id}`),
  create: (data: any) => api.post("/api/mission", data),
  update: (id: number, data: any) => api.put(`/api/mission/${id}`, data),
  delete: (id: number) => api.delete(`/api/mission/${id}`)
};

export const whyChooseService = {
  create: async (data: any) => {
    const res = await api.post("/api/whychoose", data);
    return res.data.data;
  },

  getAll: async () => {
    const res = await api.get("/api/whychoose");
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await api.get(`/api/whychoose/${id}`);
    return res.data.data;
  },

  update: async (id: number, data: any) => {
    const res = await api.put(`/api/whychoose/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/api/whychoose/${id}`);
    return res.data;
  },
};


export const productHeadingService = {
  getAll: async () => {
    const res = await api.get("/api/product-headings");
    return res.data;
  },

  getById: async (id: number | string) => {
    const res = await api.get(`/api/product-headings/${id}`);
    return res.data;
  },

  create: async (data: { title: string; description: string }) => {
    const res = await api.post("/api/product-headings", data);
    return res.data;
  },

  update: async (id: number | string, data: { title?: string; description?: string }) => {
    const res = await api.put(`/api/product-headings/${id}`, data);
    return res.data;
  },

  delete: async (id: number | string) => {
    const res = await api.delete(`/api/product-headings/${id}`);
    return res.data;
  },
};

export const faqService = {
  getAll: async () => {
    const res = await api.get("/api/faq");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await api.get(`/api/faq/${id}`);
    return res.data;
  },

  create: async (faq: any) => {
    const res = await api.post("/api/faq", faq);
    return res.data;
  },

  update: async (id: number, faq: any) => {
    const res = await api.patch(`/api/faq/${id}`, faq);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/api/faq/${id}`);
    return res.data;
  },
};

export const planService = {
  // Get all plans
  getPlans: async () => {
    const response = await api.get("/api/plan");
    return response.data;
  },

  // Get single plan by ID
  getPlanById: async (id: number | string) => {
    const response = await api.get(`/api/plan/${id}`);
    return response.data;
  },

  // Create a new plan
  createPlan: async (data: {
    name: string;
    price: number;
    priceType: string;
    isPopular: boolean;
    buttonText: string;
    features: string[];
  }) => {
    const response = await api.post("/api/plan/", data);
    return response.data;
  },

  // Update plan
  updatePlan: async (
    id: number | string,
    data: {
      name?: string;
      price?: number;
      priceType?: string;
      isPopular?: boolean;
      buttonText?: string;
      features?: string[];
    }
  ) => {
    const response = await api.patch(`/api/plan/update/${id}`, data);
    return response.data;
  },

  // Delete a plan
  deletePlan: async (id: number | string) => {
    const response = await api.delete(`/api/plan/delete/${id}`);
    return response.data;
  },
};

export const testimonialService = {
  // Get all testimonials with pagination & search
  getTestimonials: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get("/api/testimonials", { params });
    return response.data;
  },

  // Get testimonial by ID
  getTestimonialById: async (id: number | string) => {
    const response = await api.get(`/api/testimonials/${id}`);
    return response.data;
  },

  // Create testimonial
  createTestimonial: async (data: {
    name: string;
    message: string;
    image?: string | null;
    designation?: string | null;
  }) => {
    const response = await api.post("/api/testimonials", data);
    return response.data;
  },

  // Update testimonial
  updateTestimonial: async (
    id: number | string,
    data: {
      name?: string;
      message?: string;
      image?: string | null;
      designation?: string | null;
    }
  ) => {
    const response = await api.patch(`/api/testimonials/${id}`, data);
    return response.data;
  },

  // Delete testimonial
  deleteTestimonial: async (id: number | string) => {
    const response = await api.delete(`/api/testimonials/${id}`);
    return response.data;
  },
};

export const bannerService = {
  // Get active banners (public)
  getActiveBanners: async () => {
    const response = await api.get("/api/banners");
    return response.data;
  },

  // Get all banners for admin (with pagination, search, status filter)
  getBannersAdmin: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean | string;
  }) => {
    const response = await api.get("/api/banners/admin", { params });
    return response.data;
  },

  // Get banner by ID
  getBannerById: async (id: number | string) => {
    const response = await api.get(`/api/banners/${id}`);
    return response.data;
  },

  // Create banner
  createBanner: async (data: any) => {
    const response = await api.post("/api/banners", data);
    return response.data;
  },

  // Update banner
  updateBanner: async (id: number | string, data: any) => {
    const response = await api.patch(`/api/banners/${id}`, data);
    return response.data;
  },

  // Toggle active status
  toggleBannerStatus: async (id: number | string) => {
    const response = await api.patch(`/api/banners/${id}/status`);
    return response.data;
  },

  // Delete banner
  deleteBanner: async (id: number | string) => {
    const response = await api.delete(`/api/banners/${id}`);
    return response.data;
  },
};








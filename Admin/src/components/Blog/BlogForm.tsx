import React, { useEffect, useState, useMemo } from "react";
import {
  Input,
  Button,
  Form,
  message,
  Upload,
  Select,
  Card,
  Row,
  Col,
  Spin,
  Tooltip,
  DatePicker,
  Tag,
} from "antd";
import {
  ArrowLeft,
  UploadCloud,
  Save,
  BookOpen,
  Image as ImageIcon,
  Trash2,
  Calendar,
  User,
  Layers,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, updateBlog } from "../../store/slices/blogSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { uploadService } from "../../services/api";
import type { RootState, AppDispatch } from "../../store/store";

const TITLE_LIMIT = 150;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};

const BlogForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const blog = location.state?.blog;
  const isEditing = !!blog;

  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track live form values for readiness checklist
  const [formValues, setFormValues] = useState<{
    title?: string;
    categoryId?: number;
    description?: string;
    author?: string;
  }>({});

  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Pre-fill form for editing
  useEffect(() => {
    if (blog) {
      const categoryId = blog.categoryId || blog?.category?.id;
      const initialDate = blog.publishedDate ? dayjs(blog.publishedDate) : dayjs();

      form.setFieldsValue({
        title: blog.title,
        author: blog.author || "",
        publishedDate: initialDate,
        categoryId,
        description: blog.description,
      });

      setFormValues({
        title: blog.title,
        author: blog.author,
        categoryId,
        description: blog.description,
      });

      if (blog.image) {
        setImageUrl(blog.image);
      }
    } else {
      form.setFieldsValue({
        publishedDate: dayjs(),
        author: "Eutorria Editorial Team",
      });
      setFormValues({
        author: "Eutorria Editorial Team",
      });
    }
  }, [blog, form]);

  const handleGoBack = () => navigate("/dashboard/blogs");

  // Handle image upload to storage
  const handleCustomUpload = async ({ file, onSuccess, onError }: any) => {
    setUploadingImage(true);
    const hide = message.loading("Uploading featured image...", 0);
    try {
      const response = await uploadService.uploadFile(file as File, "blogs");
      const uploadedUrl = response?.data?.url;

      if (!uploadedUrl) {
        throw new Error("Failed to retrieve uploaded image URL");
      }

      // If replacing previous new image
      if (imageUrl && imageUrl !== blog?.image) {
        try {
          await uploadService.deleteFile(imageUrl);
        } catch (delErr) {
          console.warn("Could not delete previous temp image:", delErr);
        }
      }

      setImageUrl(uploadedUrl);
      message.success("Featured image uploaded successfully");
      onSuccess?.(response, file);
    } catch (error: any) {
      console.error("Upload error:", error);
      message.error(error?.response?.data?.message || "Failed to upload image");
      onError?.(error);
    } finally {
      hide();
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (imageUrl) {
      if (imageUrl !== blog?.image) {
        try {
          await uploadService.deleteFile(imageUrl);
        } catch (err) {
          console.warn("Could not delete image:", err);
        }
      }
      setImageUrl(null);
      message.info("Image removed");
    }
  };

  // Word count & read time calculator
  const stats = useMemo(() => {
    const rawText = formValues.description
      ? formValues.description.replace(/<(.|\n)*?>/g, " ").trim()
      : "";
    const words = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
    return { words, readTimeMinutes, hasContent: words > 5 };
  }, [formValues.description]);

  const handleSubmit = async (values: any) => {
    const finalImage = imageUrl;
    if (!finalImage) {
      message.error("Please upload a featured article image");
      return;
    }

    const cleanDescription = values.description
      ? values.description.replace(/<(.|\n)*?>/g, "").trim()
      : "";
    if (!cleanDescription) {
      message.error("Please enter the article description content");
      return;
    }

    setIsSubmitting(true);
    const hide = message.loading(isEditing ? "Updating article..." : "Publishing article...", 0);

    try {
      const payload = {
        title: values.title.trim(),
        description: values.description,
        categoryId: Number(values.categoryId),
        author: values.author ? values.author.trim() : "Eutorria Editorial Team",
        publishedDate: values.publishedDate
          ? values.publishedDate.toISOString()
          : new Date().toISOString(),
        image: finalImage,
      };

      if (isEditing) {
        await dispatch(
          updateBlog({ id: blog.id.toString(), blogData: payload })
        ).unwrap();
        message.success("Article updated successfully");
      } else {
        await dispatch(createBlog(payload)).unwrap();
        message.success("Article published successfully");
      }

      form.resetFields();
      setImageUrl(null);
      navigate("/dashboard/blogs");
    } catch (error: any) {
      console.error("Failed to save blog:", error);
      message.error(error?.response?.data?.message || error?.message || "Failed to save article");
    } finally {
      hide();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <style>{`
        .blog-quill .ql-toolbar.ql-snow {
          border: 1px solid #e2e8f0 !important;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background-color: #f8fafc;
          padding: 12px 16px !important;
        }
        .blog-quill .ql-container.ql-snow {
          border: 1px solid #e2e8f0 !important;
          border-top: none !important;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          min-height: 420px;
          font-size: 15px;
          font-family: inherit;
        }
        .blog-quill .ql-editor {
          min-height: 420px;
          padding: 18px 20px;
          line-height: 1.75;
          font-size: 15px;
          color: #1f2937;
        }
        .blog-quill .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
          left: 20px;
          right: 20px;
        }
      `}</style>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <Button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 rounded-xl border-gray-200 text-gray-700 hover:text-indigo-600 hover:border-indigo-500 h-11 px-4 shadow-sm bg-gray-50/60 transition-all"
          >
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 m-0 tracking-tight">
                {isEditing ? "Edit Article" : "Create New Article"}
              </h1>
              <Tag
                color={isEditing ? "blue" : "purple"}
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold m-0"
              >
                {isEditing ? `ID: #${blog?.id}` : "News & Media"}
              </Tag>
            </div>
            <p className="text-xs md:text-sm text-gray-500 m-0 mt-1">
              {isEditing
                ? "Update published article details, rich-text body, and header cover image."
                : "Author and publish technical articles, product announcements, and company news."}
            </p>
          </div>
        </div>

      </div>

      {/* Main Form Content */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={(_, allValues) => setFormValues(allValues)}
        requiredMark={false}
        className="w-full"
      >
        <Row gutter={[24, 24]}>
          {/* Left Column: Form Details & Rich Text Editor */}
          <Col xs={24} xl={16}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <BookOpen size={17} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-base block leading-tight">
                        Article Details
                      </span>
                      <span className="text-xs text-gray-400 font-normal">
                        Main title, category routing, and publication metadata
                      </span>
                    </div>
                  </div>
                </div>
              }
            >
              {/* Title Field */}
              <Form.Item
                name="title"
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-gray-800 text-sm">
                      Article Title <span className="text-red-500">*</span>
                    </span>
                    <span className="text-xs text-gray-400">Max {TITLE_LIMIT} chars</span>
                  </div>
                }
                rules={[
                  { required: true, message: "Please enter the article title" },
                  {
                    max: TITLE_LIMIT,
                    message: `Title cannot exceed ${TITLE_LIMIT} characters.`,
                  },
                ]}
                className="mb-5"
              >
                <Input
                  placeholder="e.g. Architectural Hardware Trends in Modern Spaces"
                  size="large"
                  maxLength={TITLE_LIMIT}
                  showCount
                  className="rounded-xl text-base h-12 border-gray-200 hover:border-indigo-400 focus:border-indigo-600 shadow-sm"
                />
              </Form.Item>

              {/* Row: Category, Author, Publish Date */}
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="categoryId"
                    label={
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800 text-sm">
                        <Layers size={14} className="text-indigo-600" />
                        <span>Category</span>
                        <span className="text-red-500">*</span>
                      </div>
                    }
                    rules={[{ required: true, message: "Select a category" }]}
                  >
                    <Select
                      placeholder="Select category"
                      size="large"
                      loading={categoriesLoading}
                      className="rounded-xl h-11 w-full"
                    >
                      {categories.map((cat: any) => (
                        <Select.Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    name="author"
                    label={
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800 text-sm">
                        <User size={14} className="text-indigo-600" />
                        <span>Author Name</span>
                      </div>
                    }
                  >
                    <Input
                      placeholder="e.g. John Doe"
                      size="large"
                      className="rounded-xl h-11 border-gray-200"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    name="publishedDate"
                    label={
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800 text-sm">
                        <Calendar size={14} className="text-indigo-600" />
                        <span>Publish Date</span>
                      </div>
                    }
                  >
                    <DatePicker
                      size="large"
                      format="YYYY-MM-DD"
                      className="rounded-xl h-11 w-full border-gray-200"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Rich Text Editor */}
              <Form.Item
                name="description"
                label={
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-gray-800 text-sm">
                      Article Content & Story <span className="text-red-500">*</span>
                    </span>
                    <span className="text-xs text-gray-400">Rich text format with headings & lists</span>
                  </div>
                }
                rules={[
                  {
                    validator: (_, value) => {
                      const cleanText = value ? value.replace(/<(.|\n)*?>/g, "").trim() : "";
                      if (!cleanText) {
                        return Promise.reject(new Error("Please enter article body content"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                className="mb-2"
              >
                <ReactQuill
                  className="blog-quill"
                  theme="snow"
                  modules={quillModules}
                  placeholder="Write the full story, industry insights, hardware innovations, and architectural guidelines here..."
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column: Featured Image & Action Controls */}
          <Col xs={24} xl={8}>
            <div className="space-y-6 sticky top-6">
              {/* Featured Image Card */}
              <Card
                bordered={false}
                className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
                title={
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <ImageIcon size={17} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-base block leading-tight">
                        Featured Cover Image
                      </span>
                      <span className="text-xs text-gray-400 font-normal">
                        Displayed in banners and card previews
                      </span>
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  {imageUrl ? (
                    <div className="space-y-3">
                      <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 aspect-[16/10]">
                        <img
                          src={imageUrl}
                          alt="Cover preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <Tooltip title="Delete Image">
                            <Button
                              danger
                              type="primary"
                              shape="circle"
                              icon={<Trash2 size={16} />}
                              onClick={handleRemoveImage}
                              className="shadow-lg"
                            />
                          </Tooltip>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 size={14} /> Image Attached
                        </span>
                        <Upload
                          customRequest={handleCustomUpload}
                          showUploadList={false}
                          accept="image/*"
                          multiple={false}
                        >
                          <Button
                            type="text"
                            size="small"
                            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 p-0"
                            icon={<RefreshCw size={12} />}
                          >
                            Replace Image
                          </Button>
                        </Upload>
                      </div>
                    </div>
                  ) : (
                    <Upload.Dragger
                      customRequest={handleCustomUpload}
                      showUploadList={false}
                      accept="image/*"
                      multiple={false}
                      className="!rounded-xl !bg-indigo-50/20 hover:!bg-indigo-50/40 !border-indigo-200 hover:!border-indigo-500 !p-6 transition-all"
                    >
                      {uploadingImage ? (
                        <div className="py-8 flex flex-col items-center gap-3">
                          <Spin size="large" />
                          <span className="text-sm font-medium text-indigo-600">
                            Uploading image...
                          </span>
                        </div>
                      ) : (
                        <div className="py-4 space-y-3 text-center">
                          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-indigo-100">
                            <UploadCloud size={28} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              Click or drag cover image here
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                            </p>
                          </div>
                          <div className="inline-block bg-white text-gray-600 border border-gray-200 text-xs px-3 py-1 rounded-full shadow-2xs font-medium">
                            Recommended 16:9 ratio
                          </div>
                        </div>
                      )}
                    </Upload.Dragger>
                  )}
                </div>
              </Card>

              {/* Readiness & Publishing Card */}
              <Card
                bordered={false}
                className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              >
                <div className="space-y-4">


                  <div className="pt-2 flex flex-col gap-3">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-none shadow-md shadow-indigo-600/25 rounded-xl h-12 font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      icon={<Save size={18} />}
                    >
                      {isEditing ? "Update Article" : "Publish Article"}
                    </Button>
                    <Button
                      size="large"
                      onClick={handleGoBack}
                      className="w-full rounded-xl h-11 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium"
                    >
                      Discard & Return
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BlogForm;

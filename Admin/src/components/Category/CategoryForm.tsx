import React, { useEffect, useState } from "react";
import { Input, Button, Form, message, Upload, Card, Tooltip, Row, Col, Spin } from "antd";
import { ArrowLeft, UploadCloud, Image as ImageIcon, Sparkles, Trash2, Save } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCategory, updateCategory } from "../../store/slices/categorySlice";
import { uploadService } from "../../services/api";

const NAME_LIMIT = 70;

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const category = location.state?.category;
  const isEditing = !!category;

  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description || "",
        image: category.image || null,
      });
      if (category.image) {
        setImageUrl(category.image);
      }
    }
  }, [category, form]);

  const handleGoBack = () => navigate("/dashboard/categories");

  // Handle immediate MinIO upload on file selection
  const handleCustomUpload = async ({ file, onSuccess, onError }: any) => {
    setUploadingImage(true);
    const hide = message.loading("Uploading category image...", 0);
    try {
      const response = await uploadService.uploadFile(file as File, "categories");
      const uploadedUrl = response?.data?.url;

      if (!uploadedUrl) {
        throw new Error("Failed to retrieve uploaded image URL");
      }

      // Cleanup old newly uploaded image if replaced
      if (imageUrl && imageUrl !== category?.image) {
        try {
          await uploadService.deleteFile(imageUrl);
        } catch {}
      }

      setImageUrl(uploadedUrl);
      form.setFieldValue("image", uploadedUrl);
      message.success("Category image uploaded successfully");
      if (onSuccess) onSuccess("ok");
    } catch (error: any) {
      console.error("Category image upload error:", error);
      message.error(error?.response?.data?.message || error?.message || "Failed to upload image");
      if (onError) onError(error);
    } finally {
      hide();
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imageUrl) return;
    const hide = message.loading("Removing image...", 0);
    try {
      if (imageUrl !== category?.image) {
        await uploadService.deleteFile(imageUrl);
      }
      setImageUrl(null);
      form.setFieldValue("image", null);
      message.success("Image removed");
    } catch {
      setImageUrl(null);
      form.setFieldValue("image", null);
    } finally {
      hide();
    }
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const hide = message.loading(isEditing ? "Updating category..." : "Creating category...", 0);

    try {
      const payload = {
        name: values.name.trim(),
        description: values.description ? values.description.trim() : null,
        image: imageUrl || form.getFieldValue("image") || null,
      };

      if (isEditing) {
        await dispatch(
          updateCategory({
            id: category.id,
            name: payload.name,
            description: payload.description,
            image: payload.image,
          })
        ).unwrap();
        message.success("Category updated successfully");
      } else {
        await dispatch(createCategory(payload)).unwrap();
        message.success("Category created successfully");
      }

      form.resetFields();
      setImageUrl(null);
      navigate("/dashboard/categories");
    } catch (error: any) {
      message.error(error || "Failed to save category");
    } finally {
      hide();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
        <div className="flex items-center gap-4">
          <Tooltip title="Back to Categories List">
            <Button
              onClick={handleGoBack}
              icon={<ArrowLeft size={18} />}
              className="flex items-center justify-center rounded-xl border-gray-300 hover:border-indigo-600 hover:text-indigo-600 shadow-sm h-11 px-4"
            >
              Back
            </Button>
          </Tooltip>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 mb-0">
              {isEditing
                ? `Updating category ID #${category.id}`
                : "Create a category to organize products and blog posts."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="w-full"
      >
        <Row gutter={[24, 24]}>
          {/* Left Column: Category Details */}
          <Col xs={24} lg={14}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center gap-2 py-1">
                  <Sparkles size={18} className="text-indigo-600" />
                  <span className="font-semibold text-gray-800 text-base">Category Details</span>
                </div>
              }
            >
              <Form.Item
                name="name"
                label={
                  <span className="font-semibold text-gray-700 text-sm">
                    Category Name <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter category name" },
                  {
                    max: NAME_LIMIT,
                    message: `Category name cannot exceed ${NAME_LIMIT} characters.`,
                  },
                ]}
                className="mb-4"
              >
                <Input
                  placeholder="e.g. Industrial Automation, Robotics, Parts"
                  size="large"
                  maxLength={NAME_LIMIT}
                  showCount
                  className="rounded-lg text-base h-12"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={
                  <span className="font-semibold text-gray-700 text-sm">
                    Category Description
                  </span>
                }
                className="mb-4"
              >
                <Input.TextArea
                  rows={4}
                  maxLength={300}
                  showCount
                  placeholder="Write a short overview describing this category..."
                  className="rounded-lg text-base"
                />
              </Form.Item>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button
                  onClick={handleGoBack}
                  className="rounded-xl h-11 px-6 font-medium border-gray-300 hover:border-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  icon={<Save size={16} />}
                  className="rounded-xl h-11 px-7 bg-indigo-600 hover:bg-indigo-700 font-medium shadow-sm flex items-center gap-2"
                >
                  {isEditing ? "Update Category" : "Save Category"}
                </Button>
              </div>
            </Card>
          </Col>

          {/* Right Column: Category Image */}
          <Col xs={24} lg={10}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center gap-2 py-1">
                  <ImageIcon size={18} className="text-indigo-600" />
                  <span className="font-semibold text-gray-800 text-base">Category Banner / Icon</span>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Upload category image (PNG, JPG, WebP)
                  </span>
                  {uploadingImage && (
                    <span className="text-xs text-indigo-600 flex items-center gap-1">
                      <Spin size="small" /> Uploading...
                    </span>
                  )}
                </div>

                <Upload
                  customRequest={handleCustomUpload}
                  showUploadList={false}
                  accept="image/*"
                  disabled={uploadingImage}
                >
                  <Tooltip title="Upload category image">
                    <Button
                      icon={<UploadCloud size={16} />}
                      size="large"
                      loading={uploadingImage}
                      className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                    >
                      {imageUrl ? "Change Image" : "Upload Image"}
                    </Button>
                  </Tooltip>
                </Upload>

                {/* Image Preview */}
                {imageUrl ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 p-2 relative group">
                    <img
                      src={imageUrl}
                      alt="Category preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="mt-2 flex items-center justify-between px-1">
                      <span className="text-xs text-gray-500 truncate max-w-[180px]">
                        {imageUrl.split("/").pop()}
                      </span>
                      <Tooltip title="Remove Image">
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<Trash2 size={14} />}
                          onClick={handleRemoveImage}
                          className="hover:bg-red-50 flex items-center justify-center p-1 rounded"
                        >
                          Remove
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3">
                      <ImageIcon size={22} />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">No Category Image</p>
                    <p className="text-xs text-gray-400 max-w-xs mb-0">
                      Upload an optional thumbnail or banner image for this category.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CategoryForm;

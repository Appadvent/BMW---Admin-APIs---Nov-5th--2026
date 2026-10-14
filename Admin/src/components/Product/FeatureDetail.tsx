import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Image,
  Drawer,
  Form,
  Input,
  Upload,
  Button,
  message,
  Popconfirm,
  Tooltip,
  Card,
  Tag,
  Empty,
  Row,
  Col,
  Spin,
} from "antd";
import {
  Plus,
  UploadCloud,
  Edit2,
  Trash2,
  ArrowLeft,
  Sparkles,
  Package,
  Layers,
} from "lucide-react";
import { featureService, uploadService } from "../../services/api";

const TITLE_LIMIT = 70;
const DESC_LIMIT = 300;
const MAX_FEATURES_LIMIT = 10;

const FeatureDetails: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.product;

  const [features, setFeatures] = useState<any[]>([]);
  const isMaxFeaturesReached = features.length >= MAX_FEATURES_LIMIT;
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [featureForm] = Form.useForm();

  useEffect(() => {
    if (product?.id) {
      fetchFeatures();
    }
  }, [product]);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await featureService.getFeaturesByProduct(product.id);
      setFeatures(response?.data || []);
    } catch (err) {
      message.error("Failed to fetch features");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }: any) => {
    setUploadingImage(true);
    const hide = message.loading("Uploading feature image...", 0);
    try {
      const response = await uploadService.uploadFile(file as File, "features");
      const uploadedUrl = response?.data?.url;

      if (!uploadedUrl) {
        throw new Error("Failed to retrieve image URL");
      }

      if (imageUrl && imageUrl !== editingFeature?.image) {
        try {
          await uploadService.deleteFile(imageUrl);
        } catch { }
      }

      setImageUrl(uploadedUrl);
      featureForm.setFieldValue("image", uploadedUrl);
      message.success("Image uploaded successfully");
      if (onSuccess) onSuccess("ok");
    } catch (error: any) {
      console.error("Upload error:", error);
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
      if (imageUrl !== editingFeature?.image) {
        await uploadService.deleteFile(imageUrl);
      }
      setImageUrl(null);
      featureForm.setFieldValue("image", null);
      message.success("Image removed");
    } catch {
      setImageUrl(null);
      featureForm.setFieldValue("image", null);
    } finally {
      hide();
    }
  };

  // Add or Update Feature
  const handleFeatureSubmit = async (values: any) => {
    const finalImage = imageUrl || featureForm.getFieldValue("image") || undefined;

    if (!editingFeature && isMaxFeaturesReached) {
      message.error(`Maximum limit of ${MAX_FEATURES_LIMIT} features reached for this product.`);
      return;
    }

    if (!editingFeature && !finalImage) {
      message.error("Please upload an image for this feature");
      return;
    }

    setSubmitting(true);
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      productId: product.id,
      image: finalImage,
    };

    const hide = message.loading(
      editingFeature ? "Updating feature..." : "Adding feature...",
      0
    );
    try {
      if (editingFeature) {
        await featureService.updateFeature(editingFeature.id, payload);
        message.success("Feature updated successfully");
      } else {
        await featureService.createFeature(payload);
        message.success("Feature added successfully");
      }

      await fetchFeatures();
      featureForm.resetFields();
      setImageUrl(null);
      setDrawerVisible(false);
      setEditingFeature(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || "Operation failed");
    } finally {
      hide();
      setSubmitting(false);
    }
  };

  // Open drawer for editing
  const handleEdit = (feature: any) => {
    setEditingFeature(feature);
    setDrawerVisible(true);
    featureForm.setFieldsValue({
      title: feature.title,
      description: feature.description,
      image: feature.image,
    });
    setImageUrl(feature.image || null);
  };

  const handleDelete = async (id: string | number) => {
    const hide = message.loading("Deleting feature...", 0);
    try {
      await featureService.deleteFeature(Number(id));
      message.success("Feature deleted successfully");
      fetchFeatures();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to delete feature");
    } finally {
      hide();
    }
  };

  if (!product) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <Empty
          description="No product selected. Please navigate from the product list."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            type="primary"
            onClick={() => navigate("/dashboard/products")}
            className="bg-indigo-600"
          >
            Back to Products
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Tooltip title="Back to Products List">
            <Button
              onClick={() => navigate("/dashboard/products")}
              icon={<ArrowLeft size={16} />}
              className="flex items-center justify-center rounded-lg border-gray-300 hover:border-indigo-600 hover:text-indigo-600 shadow-sm"
              size="large"
            >
              Back
            </Button>
          </Tooltip>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0">
                Product Details & Features
              </h1>
              <Tag color="indigo" className="text-xs px-2 py-0.5 rounded-full font-medium">
                ID #{product.id}
              </Tag>
              <Tag
                color={isMaxFeaturesReached ? "volcano" : "blue"}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
              >
                {features.length} / {MAX_FEATURES_LIMIT} Features
              </Tag>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage product presentation and associated feature highlights (max {MAX_FEATURES_LIMIT}).
            </p>
          </div>
        </div>

        <Tooltip
          title={
            isMaxFeaturesReached
              ? `Maximum limit of ${MAX_FEATURES_LIMIT} features reached for this product`
              : "Add a new feature highlight to this product"
          }
        >
          <Button
            type="primary"
            size="large"
            disabled={isMaxFeaturesReached}
            icon={<Plus size={18} />}
            className={`${
              isMaxFeaturesReached
                ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30"
            } rounded-lg h-11 px-5 font-medium flex items-center gap-2`}
            onClick={() => {
              if (isMaxFeaturesReached) {
                message.warning(`Maximum limit of ${MAX_FEATURES_LIMIT} features reached for this product.`);
                return;
              }
              setEditingFeature(null);
              setDrawerVisible(true);
              featureForm.resetFields();
              setImageUrl(null);
            }}
          >
            Add Feature
          </Button>
        </Tooltip>
      </div>

      {/* Hero Product Overview Banner */}
      <Card
        bordered={false}
        className="shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30"
        bodyStyle={{ padding: "24px" }}
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-56 h-56 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white flex-shrink-0 flex items-center justify-center">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                width="100%"
                height="100%"
                className="object-cover w-full h-full"
              />
            ) : (
              <Package size={48} className="text-gray-300" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-0">
                {product.title}
              </h2>
              <span
                className={`px-2.5 py-1 ${
                  isMaxFeaturesReached
                    ? "bg-amber-100 text-amber-800"
                    : "bg-indigo-100 text-indigo-700"
                } text-xs font-semibold rounded-full`}
              >
                {features.length} / {MAX_FEATURES_LIMIT} Features
              </span>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed max-w-3xl prose prose-sm">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.description || "<em>No detailed description available.</em>",
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Features Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-0">
              Product Features & Capabilities ({features.length})
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Spin size="large" />
            <p className="text-gray-500 text-sm mt-3">Loading features...</p>
          </div>
        ) : features.length === 0 ? (
          <Card
            bordered={false}
            className="rounded-xl border border-dashed border-gray-300 text-center py-12 bg-gray-50/50"
          >
            <Layers size={40} className="mx-auto text-gray-300 mb-3" />
            <h4 className="text-base font-semibold text-gray-700">No Features Added Yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              Highlight key specifications, advantages, or modular features of this product.
            </p>
            <Tooltip title="Create the first feature">
              <Button
                type="primary"
                icon={<Plus size={16} />}
                className="bg-indigo-600 hover:bg-indigo-500"
                onClick={() => {
                  setEditingFeature(null);
                  setDrawerVisible(true);
                  featureForm.resetFields();
                  setImageUrl(null);
                }}
              >
                Add First Feature
              </Button>
            </Tooltip>
          </Card>
        ) : (
          <Row gutter={[20, 20]}>
            {features.map((feature: any) => (
              <Col xs={24} sm={12} lg={8} key={feature.id}>
                <Card
                  hoverable
                  bordered={false}
                  className="h-full rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
                  bodyStyle={{ padding: "18px", display: "flex", flexDirection: "column", height: "100%" }}
                >
                  <div className="space-y-3 flex-1">
                    {/* Feature Image */}
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 relative">
                      {feature.image ? (
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          width="100%"
                          height="100%"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers size={32} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Feature Content */}
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-0">
                        {feature.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-mono">
                      ID #{feature.id}
                    </span>
                    <div className="flex items-center gap-1">
                      <Tooltip title="Edit Feature">
                        <Button
                          type="text"
                          size="small"
                          icon={<Edit2 size={15} />}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md"
                          onClick={() => handleEdit(feature)}
                        />
                      </Tooltip>

                      <Tooltip title="Delete Feature">
                        <Popconfirm
                          title="Delete Feature"
                          description="Are you sure you want to delete this feature?"
                          okText="Yes, Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => handleDelete(feature.id)}
                        >
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<Trash2 size={15} />}
                            className="hover:bg-red-50 rounded-md"
                          />
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Feature Add / Edit Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600" />
            <span className="font-semibold text-gray-900">
              {editingFeature ? "Edit Feature" : "Add New Feature"}
            </span>
          </div>
        }
        width={440}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setEditingFeature(null);
          setImageUrl(null);
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Form
          layout="vertical"
          form={featureForm}
          onFinish={handleFeatureSubmit}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            name="title"
            label={
              <span className="font-medium text-gray-700">
                Feature Title <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Please enter a feature title" },
              {
                max: TITLE_LIMIT,
                message: `Title cannot exceed ${TITLE_LIMIT} characters.`,
              },
            ]}
          >
            <Input
              maxLength={TITLE_LIMIT}
              showCount
              placeholder="e.g. High-Speed Motor"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={
              <span className="font-medium text-gray-700">
                Feature Description <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Please enter a feature description" },
              {
                max: DESC_LIMIT,
                message: `Description cannot exceed ${DESC_LIMIT} characters.`,
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              maxLength={DESC_LIMIT}
              showCount
              placeholder="Describe what this feature offers..."
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Feature Image <span className="text-red-500">*</span>
              </span>
            }
          >
            <div className="space-y-3">
              <Upload
                customRequest={handleCustomUpload}
                showUploadList={false}
                accept="image/*"
                disabled={uploadingImage}
              >
                <Tooltip title="Upload image for this feature">
                  <Button
                    icon={<UploadCloud size={16} />}
                    loading={uploadingImage}
                    className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                  >
                    {imageUrl ? "Change Image" : "Upload Image"}
                  </Button>
                </Tooltip>
              </Upload>

              {imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-2 relative group">
                  <img
                    src={imageUrl}
                    alt="Feature Preview"
                    className="w-full h-36 object-cover rounded"
                  />
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="text-xs text-gray-500 truncate max-w-[220px]">
                      {imageUrl.split("/").pop()}
                    </span>
                    <Button
                      danger
                      type="text"
                      size="small"
                      icon={<Trash2 size={14} />}
                      onClick={handleRemoveImage}
                      className="hover:bg-red-50 flex items-center justify-center p-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </Form.Item>

          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <Tooltip title={editingFeature ? "Save changes to feature" : "Create new feature"}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                size="large"
                className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md rounded-lg font-medium"
              >
                {editingFeature ? "Update Feature" : "Add Feature"}
              </Button>
            </Tooltip>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default FeatureDetails;

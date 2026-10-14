import React, { useState, useEffect } from "react";
import {
  Button,
  Upload,
  message,
  Input,
  Card,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Tag,
  Spin,
} from "antd";
import {
  ArrowLeft,
  UploadCloud,
  Plus,
  Trash2,
  Save,
  Briefcase,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createService, updateService } from "../../store/slices/serviceSlice";
import { uploadService } from "../../services/api";

const MAX_ITEMS = 5;
const HEADING_LIMIT = 250;
const ITEM_TITLE_LIMIT = 50;
const ITEM_DESC_LIMIT = 200;

interface ServiceItemState {
  id?: number;
  title: string;
  description: string;
  image: string | null;
  uploading?: boolean;
}

const ServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const service = location.state?.service;
  const isEditing = !!service;

  const [heading, setHeading] = useState("");
  const [items, setItems] = useState<ServiceItemState[]>([
    { title: "", description: "", image: null },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setHeading(service.heading || "");
      if (service.items && service.items.length > 0) {
        setItems(
          service.items.map((item: any) => ({
            id: item.id,
            title: item.title || "",
            description: item.description || "",
            image: item.image || null,
          }))
        );
      }
    }
  }, [service]);

  const handleGoBack = () => navigate("/dashboard/services");

  // Add new item
  const handleAddItem = () => {
    if (items.length >= MAX_ITEMS) {
      message.error(`You can add a maximum of ${MAX_ITEMS} service offerings.`);
      return;
    }
    setItems([...items, { title: "", description: "", image: null }]);
  };

  // Remove item
  const handleRemoveItem = async (index: number) => {
    const itemToRemove = items[index];
    if (itemToRemove.image) {
      try {
        await uploadService.deleteFile(itemToRemove.image);
      } catch (err) {
        console.warn("Could not remove image from storage:", err);
      }
    }
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated.length > 0 ? updated : [{ title: "", description: "", image: null }]);
  };

  // Update item field
  const handleItemChange = (index: number, field: keyof ServiceItemState, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // Handle instant MinIO upload for a specific item
  const handleItemUpload = async (index: number, file: File) => {
    const updated = [...items];
    updated[index].uploading = true;
    setItems([...updated]);

    const hide = message.loading(`Uploading image for Item #${index + 1}...`, 0);
    try {
      const response = await uploadService.uploadFile(file, "services");
      const uploadedUrl = response?.data?.url;

      if (!uploadedUrl) {
        throw new Error("Failed to retrieve image URL from storage");
      }

      updated[index].image = uploadedUrl;
      updated[index].uploading = false;
      setItems([...updated]);
      message.success(`Item #${index + 1} image uploaded successfully`);
    } catch (error: any) {
      console.error("Item image upload error:", error);
      updated[index].uploading = false;
      setItems([...updated]);
      message.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      hide();
    }
  };

  // Remove image from specific item
  const handleRemoveItemImage = async (index: number) => {
    const item = items[index];
    if (item.image) {
      try {
        await uploadService.deleteFile(item.image);
      } catch (err) {
        console.warn("Could not delete image:", err);
      }
      const updated = [...items];
      updated[index].image = null;
      setItems(updated);
      message.info("Image removed");
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!heading.trim()) {
      return message.error("Please enter a section heading.");
    }
    if (heading.length > HEADING_LIMIT) {
      return message.error(`Heading cannot exceed ${HEADING_LIMIT} characters.`);
    }

    if (items.length === 0) {
      return message.error("Please add at least one service offering item.");
    }
    if (items.length > MAX_ITEMS) {
      return message.error(`A service cannot have more than ${MAX_ITEMS} items.`);
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.title.trim()) {
        return message.error(`Item #${i + 1} title is required.`);
      }
      if (item.title.length > ITEM_TITLE_LIMIT) {
        return message.error(`Item #${i + 1} title cannot exceed ${ITEM_TITLE_LIMIT} characters.`);
      }
      if (!item.description.trim()) {
        return message.error(`Item #${i + 1} description is required.`);
      }
      if (item.description.length > ITEM_DESC_LIMIT) {
        return message.error(`Item #${i + 1} description cannot exceed ${ITEM_DESC_LIMIT} characters.`);
      }
    }

    setIsSubmitting(true);
    const hideLoading = message.loading(isEditing ? "Updating service section..." : "Creating service section...", 0);

    try {
      const payload = {
        heading: heading.trim(),
        items: items.map((item) => ({
          ...(item.id ? { id: item.id } : {}),
          title: item.title.trim(),
          description: item.description.trim(),
          image: item.image,
        })),
      };

      if (isEditing) {
        await dispatch(
          updateService({ id: service.id, payload })
        ).unwrap();
        message.success("Service section updated successfully");
      } else {
        await dispatch(createService(payload)).unwrap();
        message.success("Service section created successfully");
      }

      navigate("/dashboard/services");
    } catch (error: any) {
      console.error("Failed to save service:", error);
      message.error(error?.response?.data?.message || error || "Failed to save service section");
    } finally {
      hideLoading();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:text-indigo-600 hover:border-indigo-600 h-10 px-4 shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Services</span>
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 m-0">
              {isEditing ? "Edit Services Section" : "Create Services Section"}
            </h1>
            <p className="text-xs text-gray-500 m-0">
              Configure your section title and up to 5 customized service offering items with MinIO storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tag color="indigo" className="px-3 py-1 font-semibold rounded-full text-xs border-none">
            {items.length} / {MAX_ITEMS} Items Configured
          </Tag>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Heading Card */}
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
          title={
            <div className="flex items-center gap-2 py-1">
              <Briefcase size={18} className="text-indigo-600" />
              <span className="font-semibold text-gray-800 text-base">Section Overview</span>
            </div>
          }
        >
          <div>
            <label className="block font-semibold text-gray-700 text-sm mb-2">
              Main Section Heading <span className="text-red-500">*</span>
            </label>
            <Input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. Precision Engineering & Turnkey Automation Services"
              maxLength={HEADING_LIMIT}
              showCount
              size="large"
              className="rounded-lg text-base h-12"
            />
            <span className="text-xs text-gray-400 mt-1.5 block">
              This headline appears at the top of the Services section on the website.
            </span>
          </div>
        </Card>

        {/* Dynamic Items Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base m-0 flex items-center gap-2">
              <span>Service Offering Items</span>
              <span className="text-xs font-normal text-gray-500">
                (Add between 1 and {MAX_ITEMS} items)
              </span>
            </h3>

            {items.length < MAX_ITEMS && (
              <Button
                type="dashed"
                onClick={handleAddItem}
                className="flex items-center gap-2 border-indigo-400 text-indigo-600 hover:text-indigo-700 hover:border-indigo-600 rounded-lg"
                icon={<Plus size={15} />}
              >
                Add Another Item ({items.length}/{MAX_ITEMS})
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {items.map((item, index) => (
              <Card
                key={index}
                bordered={false}
                className="shadow-sm rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all hover:border-indigo-200"
                title={
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-gray-800 text-sm">
                        {item.title ? item.title : `Service Item #${index + 1}`}
                      </span>
                    </div>

                    {items.length > 1 && (
                      <Popconfirm
                        title="Remove Service Item"
                        description="Are you sure you want to remove this service item?"
                        okText="Remove"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleRemoveItem(index)}
                      >
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<Trash2 size={15} />}
                          className="hover:bg-red-50 flex items-center gap-1 rounded-md"
                        >
                          Remove
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                }
              >
                <Row gutter={[24, 20]}>
                  {/* Left Column: Title & Description */}
                  <Col xs={24} md={15}>
                    <div className="space-y-4">
                      <div>
                        <label className="block font-semibold text-gray-700 text-xs mb-1.5">
                          Item Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={item.title}
                          onChange={(e) => handleItemChange(index, "title", e.target.value)}
                          placeholder="e.g. CNC Laser Cutting & Forming"
                          maxLength={ITEM_TITLE_LIMIT}
                          showCount
                          className="rounded-lg h-11"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 text-xs mb-1.5">
                          Item Description <span className="text-red-500">*</span>
                        </label>
                        <Input.TextArea
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          placeholder="Provide a concise description of this service..."
                          maxLength={ITEM_DESC_LIMIT}
                          showCount
                          rows={4}
                          className="rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </Col>

                  {/* Right Column: Decoupled MinIO Image Upload */}
                  <Col xs={24} md={9}>
                    <div>
                      <label className="block font-semibold text-gray-700 text-xs mb-1.5">
                        Item Illustration / Image
                      </label>

                      {item.image ? (
                        <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 h-36">
                          <img
                            src={item.image}
                            alt={`Service item ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Tooltip title="Delete Image">
                              <Button
                                danger
                                type="primary"
                                shape="circle"
                                size="small"
                                icon={<Trash2 size={14} />}
                                onClick={() => handleRemoveItemImage(index)}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      ) : (
                        <Upload.Dragger
                          customRequest={({ file }: any) => handleItemUpload(index, file)}
                          showUploadList={false}
                          accept="image/*"
                          multiple={false}
                          className="rounded-xl border-dashed border-2 border-indigo-200 hover:border-indigo-500 bg-indigo-50/20 p-4 transition-colors h-36 flex flex-col items-center justify-center"
                        >
                          {item.uploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <Spin size="small" />
                              <span className="text-xs font-medium text-indigo-600">Uploading...</span>
                            </div>
                          ) : (
                            <div className="space-y-1 text-center">
                              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                                <UploadCloud size={16} />
                              </div>
                              <div className="text-xs font-semibold text-gray-800">
                                Click or drag image
                              </div>
                              <p className="text-[10px] text-gray-400 m-0">
                                MinIO Storage (Max 5MB)
                              </p>
                            </div>
                          )}
                        </Upload.Dragger>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>

          {/* Add Item Bottom Button */}
          {items.length < MAX_ITEMS && (
            <Button
              type="dashed"
              onClick={handleAddItem}
              className="w-full py-4 h-12 flex items-center justify-center gap-2 border-dashed border-indigo-300 text-indigo-600 hover:text-indigo-700 hover:border-indigo-600 rounded-xl bg-indigo-50/20 font-medium"
              icon={<Plus size={16} />}
            >
              Add Service Offering Item ({items.length} of {MAX_ITEMS})
            </Button>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            size="large"
            onClick={handleGoBack}
            className="rounded-lg h-11 px-5 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 rounded-lg h-11 px-8 flex items-center gap-2 font-medium"
            icon={<Save size={16} />}
          >
            {isEditing ? "Update Services Section" : "Save Services Section"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;

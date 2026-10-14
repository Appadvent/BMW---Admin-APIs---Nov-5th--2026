import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
  Upload,
  Tooltip,
  Typography,
  Image,
} from "antd";
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  UploadCloud,
  Eye,
  Layers,
} from "lucide-react";
import { subcategoryService, uploadService } from "../../services/api";

const { Text } = Typography;

interface SubcategoryManagerModalProps {
  visible: boolean;
  onClose: () => void;
  categories: any[];
  selectedCategory?: any | null;
  onSubcategoriesChanged?: () => void;
}

export const SubcategoryManagerModal: React.FC<SubcategoryManagerModalProps> = ({
  visible,
  onClose,
  categories,
  selectedCategory,
  onSubcategoriesChanged,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(
    selectedCategory?.id
  );
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state for Create / Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out blog-only categories (e.g. CERTIFICATION, AWARD, etc.) so only product categories are available
  const productCategories = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.filter((cat: any) => {
      const isBlogOnly =
        ["CERTIFICATION", "PRODUCT LAUNCH", "AWARD", "BUSINESS"].includes(
          cat.name?.toUpperCase()?.trim()
        ) ||
        ((cat._count?.blogs ?? 0) > 0 &&
          (cat._count?.products ?? 0) === 0 &&
          (!cat.subcategories || cat.subcategories.length === 0));
      return !isBlogOnly;
    });
  }, [categories]);

  useEffect(() => {
    if (visible) {
      if (selectedCategory?.id) {
        setActiveCategoryId(selectedCategory.id);
      } else {
        setActiveCategoryId(undefined);
      }
    }
  }, [visible, selectedCategory]);

  const fetchSubcategories = async (catId?: number) => {
    setLoading(true);
    try {
      const res = await subcategoryService.getSubcategories(
        catId ? { categoryId: catId } : undefined
      );
      if (res?.data && Array.isArray(res.data)) {
        setSubcategories(res.data);
      } else {
        setSubcategories([]);
      }
    } catch (err: any) {
      console.error("Error loading subcategories:", err);
      message.error(err?.response?.data?.message || "Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchSubcategories(activeCategoryId);
    }
  }, [visible, activeCategoryId]);

  const handleOpenCreate = () => {
    setEditingSubcategory(null);
    setImageUrl(null);
    form.resetFields();
    form.setFieldsValue({
      categoryId: activeCategoryId || undefined,
      status: "ACTIVE",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingSubcategory(record);
    setImageUrl(record.image || null);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      categoryId: record.categoryId,
      slug: record.slug || "",
      description: record.description || "",
      status: record.status || "ACTIVE",
    });
    setIsFormOpen(true);
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }: any) => {
    setUploadingImage(true);
    const hide = message.loading("Uploading subcategory image...", 0);
    try {
      const response = await uploadService.uploadFile(file as File, "subcategories");
      const url = response?.data?.url;
      if (!url) throw new Error("No URL returned");

      setImageUrl(url);
      message.success("Image uploaded successfully");
      if (onSuccess) onSuccess("ok");
    } catch (err: any) {
      message.error(err?.message || "Failed to upload image");
      if (onError) onError(err);
    } finally {
      hide();
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    const hide = message.loading(
      editingSubcategory ? "Updating subcategory..." : "Creating subcategory...",
      0
    );
    try {
      const payload = {
        name: values.name.trim(),
        categoryId: Number(values.categoryId),
        slug: values.slug?.trim() || null,
        description: values.description?.trim() || null,
        image: imageUrl || null,
        status: values.status || "ACTIVE",
      };

      if (editingSubcategory) {
        await subcategoryService.updateSubcategory(editingSubcategory.id, payload);
        message.success("Subcategory updated successfully");
      } else {
        await subcategoryService.createSubcategory(payload);
        message.success("Subcategory created successfully");
      }

      setIsFormOpen(false);
      fetchSubcategories(activeCategoryId);
      if (onSubcategoriesChanged) onSubcategoriesChanged();
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || "Operation failed");
    } finally {
      hide();
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    const hide = message.loading("Deleting subcategory...", 0);
    try {
      await subcategoryService.deleteSubcategory(id);
      message.success("Subcategory deleted successfully");
      fetchSubcategories(activeCategoryId);
      if (onSubcategoriesChanged) onSubcategoriesChanged();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to delete subcategory");
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: "Subcategory",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
            {record.image ? (
              <Image
                src={record.image}
                alt={record.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
                preview={{ mask: <Eye size={12} className="text-white" /> }}
              />
            ) : (
              <FolderTree size={18} className="text-indigo-400" />
            )}
          </div>
          <div>
            <Text strong className="text-gray-900 text-sm font-semibold block">
              {record.name}
            </Text>
            {record.slug && (
              <span className="text-[11px] text-gray-400 block font-mono">
                /{record.slug}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Parent Category",
      key: "category",
      render: (_: any, record: any) => (
        <Tag color="purple" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
          {record.category?.name || "Category"}
        </Tag>
      ),
    },
    {
      title: "Products",
      key: "productsCount",
      width: 110,
      render: (_: any, record: any) => (
        <Tag icon={<Layers size={11} className="inline mr-1" />} color="blue">
          {record._count?.products || 0}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "default"}>
          {status || "ACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Edit Subcategory">
            <Button
              type="text"
              size="small"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1"
              icon={<Edit2 size={15} />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Subcategory">
            <Popconfirm
              title="Delete Subcategory"
              description="Are you sure? Products linked to this subcategory will have their subcategory set to null."
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteSubcategory(record.id)}
            >
              <Button
                type="text"
                danger
                size="small"
                className="hover:bg-red-50 p-1"
                icon={<Trash2 size={15} />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={860}
      footer={null}
      title={
        <div className="flex items-center gap-2 text-gray-800 text-lg font-bold pb-2 border-b border-gray-100">
          <FolderTree size={20} className="text-indigo-600" />
          <span>Subcategory Management</span>
        </div>
      }
      destroyOnClose
    >
      <div className="pt-3 space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider shrink-0">
              Filter by Category:
            </span>
            <Select
              className="w-full sm:w-56"
              value={activeCategoryId}
              onChange={(val) => setActiveCategoryId(val)}
              allowClear
              placeholder="All Categories"
              options={productCategories.map((c: any) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </div>

          <Button
            type="primary"
            icon={<Plus size={15} />}
            onClick={handleOpenCreate}
            className="btn-primary-yellow text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 h-9"
          >
            Add Subcategory
          </Button>
        </div>

        {/* Subcategories Table */}
        <Table
          columns={columns}
          dataSource={subcategories}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
          size="middle"
          className="border border-gray-100 rounded-xl overflow-hidden"
        />

        {/* Subcategory Create / Edit Inner Modal */}
        <Modal
          open={isFormOpen}
          onCancel={() => setIsFormOpen(false)}
          title={
            <div className="flex items-center gap-2 text-gray-800 text-base font-bold">
              <FolderTree size={18} className="text-indigo-600" />
              <span>
                {editingSubcategory ? "Edit Subcategory" : "Create New Subcategory"}
              </span>
            </div>
          }
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            className="pt-2 space-y-3"
          >
            <Form.Item
              name="categoryId"
              label={<span className="font-semibold text-gray-700 text-sm">Parent Category *</span>}
              rules={[{ required: true, message: "Please select parent category" }]}
            >
              <Select
                placeholder="Select parent category"
                size="large"
                className="rounded-lg h-11 w-full"
                options={productCategories.map((c: any) => ({
                  value: c.id,
                  label: c.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="name"
              label={<span className="font-semibold text-gray-700 text-sm">Subcategory Name *</span>}
              rules={[
                { required: true, message: "Please enter subcategory name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                placeholder="e.g. Mortise Handles, Concealed Hinges"
                size="large"
                className="rounded-lg h-11"
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label={<span className="font-semibold text-gray-700 text-sm">URL Slug (Optional)</span>}
            >
              <Input
                placeholder="e.g. mortise-handles"
                size="large"
                className="rounded-lg h-11"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="font-semibold text-gray-700 text-sm">Description</span>}
            >
              <Input.TextArea
                rows={2}
                placeholder="Brief description of products in this subcategory..."
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="status"
              label={<span className="font-semibold text-gray-700 text-sm">Status</span>}
            >
              <Select
                size="large"
                className="rounded-lg h-11"
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                ]}
              />
            </Form.Item>

            {/* Subcategory Image Upload */}
            <div>
              <span className="font-semibold text-gray-700 text-sm block mb-1.5">
                Subcategory Image (Optional)
              </span>
              <div className="flex items-center gap-3">
                <Upload
                  customRequest={handleCustomUpload}
                  showUploadList={false}
                  accept="image/*"
                  disabled={uploadingImage}
                >
                  <Button
                    icon={<UploadCloud size={15} />}
                    size="middle"
                    loading={uploadingImage}
                    className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    {imageUrl ? "Change Image" : "Upload Image"}
                  </Button>
                </Upload>
                {imageUrl && (
                  <div className="flex items-center gap-2">
                    <img
                      src={imageUrl}
                      alt="Thumbnail"
                      className="w-10 h-10 object-cover rounded-md border border-gray-200"
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      onClick={() => setImageUrl(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100">
              <Button onClick={() => setIsFormOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="btn-primary-yellow text-black font-semibold rounded-lg px-6"
              >
                {editingSubcategory ? "Save Changes" : "Create Subcategory"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </Modal>
  );
};

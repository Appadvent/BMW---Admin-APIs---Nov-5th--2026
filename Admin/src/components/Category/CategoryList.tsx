import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Image,
  Input,
  Tooltip,
  Popconfirm,
  Card,
  Tag,
  Typography,
  Empty,
} from "antd";
import {
  Edit2,
  Trash2,
  Plus,
  ArrowLeft,
  Search,
  FolderTree,
  Eye,
  Layers,
  FileText,
  Calendar,
  GitBranch,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchCategories, deleteCategory } from "../../store/slices/categorySlice";
import type { AppDispatch } from "../../store/store";
import { SubcategoryManagerModal } from "./SubcategoryManagerModal";

const { Text } = Typography;

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { categories, loading } = useSelector((state: RootState) => state.categories);
  const [searchText, setSearchText] = useState("");
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  const handleOpenSubcategories = (cat?: any) => {
    setSelectedCategoryForSub(cat || null);
    setIsSubcategoryModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const hide = message.loading("Deleting category...", 0);
    try {
      await dispatch(deleteCategory(Number(id))).unwrap();
      message.success("Category deleted successfully");
    } catch (error: any) {
      message.error(error || "Failed to delete category");
    } finally {
      hide();
    }
  };

  const handleGoBack = () => navigate("/dashboard/products");

  const filteredCategories = useMemo(() => {
    if (!searchText.trim()) return categories;
    const query = searchText.toLowerCase();
    return categories.filter((c: any) =>
      c.name?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    );
  }, [categories, searchText]);

  const columns = [
    {
      title: "Category",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3 py-1">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex-shrink-0 flex items-center justify-center">
            {record.image ? (
              <Image
                src={record.image}
                alt={record.name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                preview={{
                  mask: <Eye size={16} className="text-white" />,
                }}
              />
            ) : (
              <FolderTree size={24} className="text-indigo-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Text strong className="text-gray-900 text-sm font-semibold truncate block">
                {record.name}
              </Text>
              <Tag color="purple" className="text-[10px] px-1.5 py-0 leading-tight rounded">
                ID #{record.id}
              </Tag>
            </div>
            <span className="text-xs text-gray-400">
              Created {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["md" as const],
      render: (text: string) => (
        <span className="text-gray-600 text-sm line-clamp-2 max-w-xs">
          {text || <span className="italic text-gray-400">No description</span>}
        </span>
      ),
    },
    {
      title: "Associated Content",
      key: "counts",
      render: (_: any, record: any) => (
        <Space size="small" wrap>
          {/* Subcategories count disabled for automotive parts workflow
          <Tag
            icon={<GitBranch size={12} className="inline mr-1" />}
            color="cyan"
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleOpenSubcategories(record)}
          >
            {record._count?.subcategories || record.subcategories?.length || 0} Subcategories
          </Tag>
          */}
          <Tag icon={<Layers size={12} className="inline mr-1" />} color="blue">
            {record._count?.products || 0} Products
          </Tag>
          <Tag icon={<FileText size={12} className="inline mr-1" />} color="green">
            {record._count?.blogs || 0} News and media
          </Tag>
        </Space>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: ["md" as const],
      render: (date: string, record: any) => {
        const rawDate = date || record.createdAt;
        const formatted = rawDate
          ? new Date(rawDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "-";
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar size={13} className="text-gray-400" />
            <span>{formatted}</span>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 170,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {/* Subcategories button disabled for automotive parts workflow
          <Tooltip title="Manage Subcategories">
            <Button
              type="text"
              size="middle"
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center justify-center p-2 rounded-md"
              icon={<GitBranch size={16} />}
              onClick={() => handleOpenSubcategories(record)}
            />
          </Tooltip>
          */}

          <Tooltip title="Edit Category">
            <Button
              type="text"
              size="middle"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center justify-center p-2 rounded-md"
              icon={<Edit2 size={16} />}
              onClick={() =>
                navigate("/dashboard/categoryForm", { state: { category: record } })
              }
            />
          </Tooltip>

          <Tooltip title="Delete Category">
            <Popconfirm
              title="Delete Category"
              description="Are you sure you want to delete this category? Products linked to this category will have their category set to null."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                type="text"
                danger
                size="middle"
                className="hover:bg-red-50 transition-colors flex items-center justify-center p-2 rounded-md"
                icon={<Trash2 size={16} />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg backdrop-blur-sm">
                <FolderTree size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Taxonomy & Structure
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Categories
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Organize your products and blogs with structured categories and taxonomy images.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Tooltip title="Back to Products Catalog">
              <Button
                type="default"
                size="large"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 flex items-center gap-2 rounded-lg h-11 px-5 font-medium"
                icon={<ArrowLeft size={18} />}
                onClick={handleGoBack}
              >
                Back to Products
              </Button>
            </Tooltip>

            {/* Subcategories button disabled for automotive parts workflow
            <Tooltip title="Manage Subcategories">
              <Button
                type="default"
                size="large"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 flex items-center gap-2 rounded-lg h-11 px-5 font-medium"
                icon={<GitBranch size={18} />}
                onClick={() => handleOpenSubcategories()}
              >
                Manage Subcategories
              </Button>
            </Tooltip>
            */}

            <Tooltip title="Create a new category">
              <Button
                type="primary"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 font-medium flex items-center gap-2 rounded-lg h-11 px-5"
                icon={<Plus size={18} />}
                onClick={() => navigate("/dashboard/categoryForm")}
              >
                Add Category
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card
        bordered={false}
        className="shadow-sm rounded-xl border border-gray-200/80 overflow-hidden"
        bodyStyle={{ padding: "20px" }}
      >
        {/* Search & Counter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3 w-full sm:max-w-md">
            <Input
              placeholder="Search categories by name or description..."
              prefix={<Search size={16} className="text-gray-400 mr-1" />}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              className="rounded-lg shadow-sm border-gray-300 hover:border-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Layers size={16} className="text-indigo-600" />
            <span>
              Showing <strong className="text-gray-800">{filteredCategories.length}</strong> of{" "}
              <strong className="text-gray-800">{categories.length}</strong> categories
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={filteredCategories}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) => (
                <span className="text-xs text-gray-500">
                  {range[0]}-{range[1]} of {total} categories
                </span>
              ),
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="py-4">
                      <p className="text-gray-500 font-medium text-sm">
                        {searchText ? `No categories matching "${searchText}"` : "No categories created yet"}
                      </p>
                      {searchText ? (
                        <Button
                          size="small"
                          type="link"
                          onClick={() => setSearchText("")}
                          className="text-indigo-600"
                        >
                          Clear Search
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          icon={<Plus size={14} />}
                          size="small"
                          className="mt-2 bg-indigo-600"
                          onClick={() => navigate("/dashboard/categoryForm")}
                        >
                          Create Your First Category
                        </Button>
                      )}
                    </div>
                  }
                />
              ),
            }}
          />
        </div>
      </Card>

      <SubcategoryManagerModal
        visible={isSubcategoryModalOpen}
        onClose={() => {
          setIsSubcategoryModalOpen(false);
          setSelectedCategoryForSub(null);
        }}
        categories={categories}
        selectedCategory={selectedCategoryForSub}
        onSubcategoriesChanged={() => dispatch(fetchCategories() as any)}
      />
    </div>
  );
};

export default CategoryList;


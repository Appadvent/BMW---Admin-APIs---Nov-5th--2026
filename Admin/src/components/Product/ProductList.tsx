import React, { useEffect, useState } from "react";
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
  Eye,
  Search,
  Package,
  Layers,
  Calendar,
  FolderTree,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../store/slices/productSlice";
import { productService } from "../../services/api";

const { Text } = Typography;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, pagination, loading } = useSelector((state: RootState) => state.products);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchProducts({
          page,
          limit,
          search: searchText.trim() || undefined,
        }) as any
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, page, limit, searchText]);

  const handleSearchChange = (val: string) => {
    setSearchText(val);
    setPage(1);
  };

  // Delete Product
  const handleDeleteProduct = async (productId: number) => {
    const hide = message.loading("Deleting product...", 0);
    try {
      const response = await productService.deleteProduct(productId.toString());
      message.success(response?.message || "Product deleted successfully");
      dispatch(
        fetchProducts({
          page,
          limit,
          search: searchText.trim() || undefined,
        }) as any
      );
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      hide();
    }
  };

  const truncateHtml = (html: string, maxLength: number) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3 py-1">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex-shrink-0 flex items-center justify-center">
            {record.image ? (
              <Image
                src={record.image}
                alt={record.title}
                width={48}
                height={48}
                className="object-cover w-full h-full"
                preview={{
                  mask: <Eye size={14} className="text-white" />,
                }}
              />
            ) : (
              <Package size={22} className="text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Text strong className="text-gray-900 text-sm font-semibold truncate block max-w-xs">
                {record.title}
              </Text>
              <Tag color="blue" className="text-[10px] px-1.5 py-0 leading-tight rounded">
                ID #{record.id}
              </Tag>
              {record.oemNumber && (
                <Tag color="geekblue" className="text-[10px] px-1.5 py-0 leading-tight rounded font-mono">
                  OEM: {record.oemNumber}
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 flex-wrap">
              {record.make && <span className="font-semibold text-gray-700">{record.make}</span>}
              {record.model && <span className="text-indigo-600 font-medium">[{record.model}]</span>}
              {record.yearRange && <span>{record.yearRange}</span>}
              {record.position && <span className="text-gray-500">• {record.position}</span>}
              <span className="text-gray-300">•</span>
              <span>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 210,
      render: (_: any, record: any) => {
        const cat = record.category || record.subcategory?.category;
        const sub = record.subcategory;
        if (!cat && !sub) {
          return <span className="text-xs text-gray-400 italic">Uncategorized</span>;
        }
        return (
          <div className="flex flex-col gap-1 items-start">
            {cat && (
              <Tag
                icon={<FolderTree size={12} className="inline mr-1" />}
                color="purple"
                className="rounded-full px-2.5 py-0.5 text-xs font-medium max-w-[190px] truncate"
              >
                {cat.name}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Tag / Badge",
      dataIndex: "tag",
      key: "tag",
      width: 130,
      render: (tag: string) => {
        if (!tag) return <span className="text-xs text-gray-300">-</span>;
        const color =
          tag === "Best Seller" ? "gold" : tag === "Featured" ? "volcano" : tag === "New" ? "green" : "blue";
        return (
          <Tag color={color} className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {tag}
          </Tag>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["md" as const],
      render: (text: string) => (
        <p className="text-gray-600 text-xs line-clamp-2 max-w-md mb-0 leading-relaxed">
          {truncateHtml(text, 140) || <span className="italic text-gray-400">No description provided</span>}
        </p>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 140,
      render: (date: string, record: any) => {
        const rawDate = date || record.createdAt;
        const formatted = rawDate ? new Date(rawDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) : "-";
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
          <Tooltip title="View Features & Details">
            <Button
              type="text"
              size="middle"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-center p-2 rounded-md"
              icon={<Eye size={16} />}
              onClick={() =>
                navigate("/dashboard/feature-details", { state: { product: record } })
              }
            />
          </Tooltip>

          <Tooltip title="Edit Product">
            <Button
              type="text"
              size="middle"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center justify-center p-2 rounded-md"
              icon={<Edit2 size={16} />}
              onClick={() =>
                navigate("/dashboard/productsForm", { state: { product: record } })
              }
            />
          </Tooltip>

          <Tooltip title="Delete Product">
            <Popconfirm
              title="Delete Product"
              description="Are you sure you want to delete this product? All related features will also be affected."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteProduct(record.id)}
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
                <Package size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Catalog Management
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Products
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Manage your product catalog, customize details, and attach interactive product features.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Tooltip title="Manage all product categories">
              <Button
                type="default"
                size="large"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 flex items-center gap-2 rounded-lg h-11 px-5 font-medium"
                icon={<FolderTree size={18} />}
                onClick={() => navigate("/dashboard/categories")}
              >
                Manage Categories
              </Button>
            </Tooltip>

            <Tooltip title="Create a new product showcase">
              <Button
                type="primary"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 font-medium flex items-center gap-2 rounded-lg h-11 px-5"
                icon={<Plus size={18} />}
                onClick={() => navigate("/dashboard/productsForm")}
              >
                Create Product
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <Card
        bordered={false}
        className="shadow-sm rounded-xl border border-gray-200/80 overflow-hidden"
        bodyStyle={{ padding: "20px" }}
      >
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3 w-full sm:max-w-md">
            <Input
              placeholder="Search by product name or description..."
              prefix={<Search size={16} className="text-gray-400 mr-1" />}
              allowClear
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              size="large"
              className="rounded-lg shadow-sm border-gray-300 hover:border-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Layers size={16} className="text-indigo-600" />
            <span>
              Showing <strong className="text-gray-800">{products?.length || 0}</strong> of{" "}
              <strong className="text-gray-800">{pagination?.total || 0}</strong> products
            </span>
          </div>
        </div>

        {/* Products Table */}
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={products}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              current: pagination?.page || page,
              pageSize: pagination?.limit || limit,
              total: pagination?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => (
                <span className="text-xs text-gray-500">
                  {range[0]}-{range[1]} of {total} items
                </span>
              ),
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setLimit(newPageSize);
              },
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="py-4">
                      <p className="text-gray-500 font-medium text-sm">
                        {searchText ? `No products matching "${searchText}"` : "No products available"}
                      </p>
                      {searchText ? (
                        <Button
                          size="small"
                          type="link"
                          onClick={() => handleSearchChange("")}
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
                          onClick={() => navigate("/dashboard/productsForm")}
                        >
                          Add Your First Product
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
    </div>
  );
};

export default ProductList;

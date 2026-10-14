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
  Empty,
  Avatar,
} from "antd";
import {
  Edit2,
  Trash2,
  Plus,
  Eye,
  Search,
  BookOpen,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchBlogs, deleteBlog } from "../../store/slices/blogSlice";

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading } = useSelector((state: RootState) => state.blogs);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleEdit = (blog: any) => {
    navigate("/dashboard/blogForm", { state: { blog } });
  };

  const handleDelete = async (id: number) => {
    const hide = message.loading("Deleting blog...", 0);
    try {
      await dispatch(deleteBlog(id.toString())).unwrap();
      message.success("News and media deleted successfully");
      dispatch(fetchBlogs());
    } catch (error: any) {
      console.error("Failed to delete blog:", error);
      message.error(error?.response?.data?.message || error?.message || "Failed to delete blog");
    } finally {
      hide();
    }
  };

  const stripHtml = (html: string, maxLength: number = 75) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filtered blogs based on search query
  const filteredBlogs = useMemo(() => {
    if (!searchText.trim()) return blogs || [];
    const query = searchText.toLowerCase().trim();
    return (blogs || []).filter((blog: any) => {
      const titleMatch = blog.title?.toLowerCase().includes(query);
      const descMatch = blog.description?.toLowerCase().includes(query);
      const authorMatch = blog.author?.toLowerCase().includes(query);
      const catMatch = blog.category?.name?.toLowerCase().includes(query);
      return titleMatch || descMatch || authorMatch || catMatch;
    });
  }, [blogs, searchText]);

  const columns = [
    {
      title: "News and media Article",
      key: "article",
      width: 280,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3 py-1">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex-shrink-0 flex items-center justify-center">
            {record.image ? (
              <Image
                src={record.image}
                alt={record.title}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                preview={{
                  mask: <Eye size={16} className="text-white" />,
                }}
              />
            ) : (
              <BookOpen size={22} className="text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm m-0 truncate">{record.title}</h4>
            {record.category?.name && (
              <Tag color="indigo" className="mt-1 text-xs border-none font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {record.category.name}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: 160,
      render: (author: string) => (
        <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
          <Avatar size={24} className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
            {author ? author.charAt(0).toUpperCase() : "A"}
          </Avatar>
          <span className="truncate">{author || "Streamline Team"}</span>
        </div>
      ),
    },
    {
      title: "Description Preview",
      dataIndex: "description",
      key: "description",
      render: (desc: string, record: any) => (
        <div
          onClick={() => handleEdit(record)}
          className="cursor-pointer group hover:bg-indigo-50/60 p-2 rounded-lg transition-colors"
        >
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed m-0 group-hover:text-gray-900">
            {stripHtml(desc) || <span className="italic text-gray-400">No description</span>}
          </p>
        </div>
      ),
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
      width: 150,
      render: (date: string, record: any) => (
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <Calendar size={13} className="text-gray-400 flex-shrink-0" />
          <span>{formatDate(date || record.createdAt)}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size={4}>
          <Tooltip title="Edit News and media Article">
            <Button
              type="text"
              size="middle"
              className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-center p-2"
              icon={<Edit2 size={16} />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Delete News and media">
            <Popconfirm
              title="Delete News and media Article"
              description="Are you sure you want to delete this News and media post? This action cannot be undone."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                type="text"
                danger
                size="middle"
                className="hover:bg-red-50 rounded-lg flex items-center justify-center p-2"
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
                <BookOpen size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Articles & Publications
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              News and media Posts
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Publish insights, industry updates, technical articles, and company announcements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Write and publish a new article">
              <Button
                type="primary"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 font-medium flex items-center gap-2 rounded-lg h-11 px-5"
                icon={<Plus size={18} />}
                onClick={() => navigate("/dashboard/blogForm")}
              >
                Create Article
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
              placeholder="Search by title, author, category, or description..."
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
              Showing <strong className="text-gray-800">{filteredBlogs.length}</strong> of{" "}
              <strong className="text-gray-800">{blogs?.length || 0}</strong> articles
            </span>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={filteredBlogs}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "16", "24", "48"],
              showTotal: (total, range) => (
                <span className="text-xs text-gray-500">
                  {range[0]}-{range[1]} of {total} articles
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
                        {searchText ? `No articles matching "${searchText}"` : "No News and media posts published yet"}
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
                          className="mt-2 bg-indigo-600 rounded-lg"
                          onClick={() => navigate("/dashboard/blogForm")}
                        >
                          Write Your First Article
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

export default BlogList;

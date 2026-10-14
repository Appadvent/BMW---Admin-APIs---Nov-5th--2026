import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  message,
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
  Search,
  FileText,
  Clock,
  Layers,
  Sparkles,
  Shield,
  FileCode,
  Globe,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchPages } from "../../store/slices/pageSlice";
import { pageService } from "../../services/api";

const { Text } = Typography;

const PageList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pages, loading } = useSelector((state: RootState) => state.pages);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchPages() as any);
  }, [dispatch]);

  // Strip HTML tags for preview
  const stripHtml = (html: string, maxLength: number = 80) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Delete Page with Popconfirm
  const handleDeletePage = async (pageId: string | number) => {
    const hideLoading = message.loading("Deleting page...", 0);
    try {
      const response = await pageService.deletePage(pageId.toString());
      message.success(response?.message || "Page deleted successfully");
      dispatch(fetchPages() as any);
    } catch (error: any) {
      console.error("Failed to delete page:", error);
      message.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to delete page");
    } finally {
      hideLoading();
    }
  };

  const handleEditPage = (record: any) => {
    navigate(`/dashboard/pagesForm`, { state: { page: record } });
  };

  const handleCreatePage = () => {
    navigate("/dashboard/pagesForm");
  };

  // Get type badge
  const getTypeTag = (type: string) => {
    switch (type?.toLowerCase()) {
      case "privacy_and_policy":
      case "privacy_policy":
        return <Tag color="blue" className="rounded-full px-2.5 py-0.5 font-medium border-none">Privacy Policy</Tag>;
      case "terms_and_conditions":
      case "terms":
        return <Tag color="purple" className="rounded-full px-2.5 py-0.5 font-medium border-none">Terms & Conditions</Tag>;
      case "about":
      case "about_us":
        return <Tag color="cyan" className="rounded-full px-2.5 py-0.5 font-medium border-none">About Us</Tag>;
      case "refund_policy":
      case "return_policy":
        return <Tag color="orange" className="rounded-full px-2.5 py-0.5 font-medium border-none">Refund Policy</Tag>;
      case "cookie_policy":
        return <Tag color="geekblue" className="rounded-full px-2.5 py-0.5 font-medium border-none">Cookie Policy</Tag>;
      default:
        return <Tag color="default" className="rounded-full px-2.5 py-0.5 font-medium border-none">{type || "Custom"}</Tag>;
    }
  };

  // Filtered pages
  const filteredPages = useMemo(() => {
    if (!searchText.trim()) return pages || [];
    const query = searchText.toLowerCase().trim();
    return (pages || []).filter((page: any) => {
      const titleMatch = page.title?.toLowerCase().includes(query);
      const typeMatch = page.type?.toLowerCase().includes(query);
      const contentMatch = page.content?.toLowerCase().includes(query);
      return titleMatch || typeMatch || contentMatch;
    });
  }, [pages, searchText]);

  const columns = [
    {
      title: "Page Title",
      key: "title",
      width: 260,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm m-0 truncate">{record.title}</h4>
            <span className="text-[11px] text-gray-400 font-mono">/{record.type || "page"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Type / Category",
      dataIndex: "type",
      key: "type",
      width: 180,
      render: (type: string) => getTypeTag(type),
    },
    {
      title: "Content Preview",
      dataIndex: "content",
      key: "content",
      render: (content: string, record: any) => (
        <div
          onClick={() => handleEditPage(record)}
          className="cursor-pointer group hover:bg-indigo-50/60 p-2 rounded-lg transition-colors"
        >
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed m-0 group-hover:text-gray-900">
            {stripHtml(content) || <span className="italic text-gray-400">Empty content</span>}
          </p>
        </div>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 170,
      render: (date: string) => (
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <Clock size={13} className="text-gray-400 flex-shrink-0" />
          <span>{formatDate(date)}</span>
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
          <Tooltip title="Edit Page Content">
            <Button
              type="text"
              size="middle"
              className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-center p-2"
              icon={<Edit2 size={16} />}
              onClick={() => handleEditPage(record)}
            />
          </Tooltip>

          <Tooltip title="Delete Page">
            <Popconfirm
              title="Delete Page"
              description="Are you sure you want to delete this page? This action cannot be undone."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeletePage(record.id)}
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
                <FileText size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Content Management
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Pages & Policies
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Create and maintain legal policies, terms of service, privacy policies, and static web pages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Create a new web page or policy">
              <Button
                type="primary"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 font-medium flex items-center gap-2 rounded-lg h-11 px-5"
                icon={<Plus size={18} />}
                onClick={handleCreatePage}
              >
                Create Page
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
              placeholder="Search by page title, type, or content..."
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
              Showing <strong className="text-gray-800">{filteredPages.length}</strong> of{" "}
              <strong className="text-gray-800">{pages?.length || 0}</strong> pages
            </span>
          </div>
        </div>

        {/* Pages Table */}
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={filteredPages}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) => (
                <span className="text-xs text-gray-500">
                  {range[0]}-{range[1]} of {total} pages
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
                        {searchText ? `No pages matching "${searchText}"` : "No custom pages or policies created yet"}
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
                          onClick={handleCreatePage}
                        >
                          Create Your First Page
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

export default PageList;
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
  Search,
  Eye,
  Layers,
  Layout,
  FileText,
  Calendar,
  MousePointerClick,
  Sparkles,
  Compass,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchAbouts, deleteAbout, About } from "../../store/slices/aboutSlice";

const { Text } = Typography;

const AboutList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { abouts, loading } = useSelector((state: RootState) => state.abouts);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchAbouts());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    const hide = message.loading("Deleting about section...", 0);
    try {
      await dispatch(deleteAbout(id)).unwrap();
      message.success("About section deleted successfully");
      dispatch(fetchAbouts());
    } catch (error: any) {
      console.error("Delete failed:", error);
      message.error(error || "Failed to delete About section");
    } finally {
      hide();
    }
  };

  const filteredAbouts = useMemo(() => {
    if (!searchText.trim()) return abouts || [];
    const query = searchText.toLowerCase().trim();
    return (abouts || []).filter((item: About) => {
      const titleMatch = (item.title || item.titleOne || "").toLowerCase().includes(query);
      const subtitleMatch = (item.subtitle || item.titleTwo || "").toLowerCase().includes(query);
      const descMatch = (item.description || item.descriptionOne || "").toLowerCase().includes(query);
      const badgeMatch = (item.badge || "").toLowerCase().includes(query);
      return titleMatch || subtitleMatch || descMatch || badgeMatch;
    });
  }, [abouts, searchText]);

  const columns = [
    {
      title: "Section",
      dataIndex: "title",
      key: "title",
      width: 230,
      render: (_: any, record: About) => {
        const displayTitle = record.title || record.titleOne || "Untitled Section";
        const primaryImage = record.image;

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex-shrink-0 flex items-center justify-center">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={displayTitle}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  preview={{
                    mask: <Eye size={14} className="text-white" />,
                  }}
                />
              ) : (
                <Sparkles size={20} className="text-indigo-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Text strong className="text-gray-900 text-xs font-semibold truncate block max-w-[140px]">
                  {displayTitle}
                </Text>
                {record.badge && (
                  <Tag color="blue" className="text-[10px] px-1 py-0 leading-tight rounded">
                    {record.badge}
                  </Tag>
                )}
                <Tag color="purple" className="text-[10px] px-1 py-0 leading-tight rounded">
                  #{record.id}
                </Tag>
              </div>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Summary & Details",
      dataIndex: "description",
      key: "description",
      width: 220,
      render: (_: any, record: About) => {
        const desc = record.description || record.descriptionOne;
        const sub = record.subtitle || record.titleTwo;
        return (
          <div className="space-y-0.5">
            {sub && (
              <p className="text-xs font-medium text-gray-700 truncate max-w-[200px] mb-0">
                {sub}
              </p>
            )}
            <p className="text-xs text-gray-500 line-clamp-2 max-w-[200px] mb-0">
              {desc || <span className="italic text-gray-400">No summary description</span>}
            </p>
          </div>
        );
      },
    },
    {
      title: "Presentation",
      key: "presentation",
      width: 130,
      render: (_: any, record: About) => (
        <Space size="small" direction="vertical" className="text-xs">
          <Tag icon={<Layout size={11} className="inline mr-1" />} color="geekblue" className="text-[11px]">
            {record.layout || "image-left"}
          </Tag>
          <Tag icon={<Layers size={11} className="inline mr-1" />} color="cyan" className="text-[11px]">
            Items: {record.itemsLayout || "grid"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Content & Sections",
      key: "contentSections",
      width: 150,
      render: (_: any, record: About) => {
        const featureCount = Array.isArray(record.items) ? record.items.length : 0;
        const sectionCount = Array.isArray(record.sections) ? record.sections.length : 0;
        return (
          <Space size="small" direction="vertical" className="text-xs">
            <Tag
              icon={<Layers size={11} className="inline mr-1" />}
              color={featureCount > 0 ? "purple" : "default"}
              className="text-[11px]"
            >
              {featureCount} {featureCount === 1 ? "Feature" : "Features"}
            </Tag>
            <Tag
              icon={<Compass size={11} className="inline mr-1" />}
              color={sectionCount > 0 ? "blue" : "default"}
              className="text-[11px]"
            >
              {sectionCount} {sectionCount === 1 ? "Detail Section" : "Detail Sections"}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "CTA Button",
      key: "cta",
      width: 130,
      render: (_: any, record: About) =>
        record.ctaEnabled ? (
          <Tag icon={<MousePointerClick size={11} className="inline mr-1" />} color="green" className="truncate max-w-[120px] text-[11px]">
            {record.ctaText || "Enabled"}
          </Tag>
        ) : (
          <Tag color="default" className="text-[11px]">Disabled</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 90,
      align: "center" as const,
      render: (active: boolean | undefined) => (
        <Tag color={active !== false ? "success" : "default"} className="text-[11px]">
          {active !== false ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: About) => (
        <Space size="small">
          <Tooltip title="Edit Section">
            <Button
              type="text"
              size="small"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center justify-center p-1.5 rounded-md"
              icon={<Edit2 size={15} />}
              onClick={() =>
                navigate("/dashboard/aboutForm", { state: { about: record } })
              }
            />
          </Tooltip>

          <Tooltip title="Delete Section">
            <Popconfirm
              title="Delete About Section"
              description="Are you sure you want to delete this About section? This will also remove all associated feature items."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                type="text"
                danger
                size="small"
                className="hover:bg-red-50 transition-colors flex items-center justify-center p-1.5 rounded-md"
                icon={<Trash2 size={15} />}
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
                CMS & Page Builder
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              About Us
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Manage your dynamic About Us sections, presentation layouts, and feature pillars.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Create a new About section">
              <Button
                type="primary"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 font-medium flex items-center gap-2 rounded-lg h-11 px-5"
                icon={<Plus size={18} />}
                onClick={() => navigate("/dashboard/aboutForm")}
              >
                Create About Page
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
              placeholder="Search about sections by title, subtitle, or badge..."
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
              Showing <strong className="text-gray-800">{filteredAbouts.length}</strong> of{" "}
              <strong className="text-gray-800">{abouts.length}</strong> sections
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={filteredAbouts}
            loading={loading}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) => (
                <span className="text-xs text-gray-500">
                  {range[0]}-{range[1]} of {total} sections
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
                        {searchText ? `No sections matching "${searchText}"` : "No About sections created yet"}
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
                          onClick={() => navigate("/dashboard/aboutForm")}
                        >
                          Create Your First About Page
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

export default AboutList;




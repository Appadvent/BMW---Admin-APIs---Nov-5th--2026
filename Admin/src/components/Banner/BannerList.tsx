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
  Switch,
  Alert,
} from "antd";
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  Sliders,
  Eye,
  Video,
  ImageIcon,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  fetchBannersAdmin,
  deleteBanner,
  toggleBannerStatus,
  Banner,
} from "../../store/slices/bannerSlice";

const { Text } = Typography;

const BannerList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { banners, activeCount, pagination, loading } = useSelector(
    (state: RootState) => state.banners
  );

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const loadBanners = () => {
    dispatch(
      fetchBannersAdmin({
        page: currentPage,
        limit: pageSize,
        search: searchText.trim() || undefined,
      })
    );
  };

  useEffect(() => {
    loadBanners();
  }, [dispatch, currentPage, pageSize, searchText]);

  const handleDelete = async (id: number) => {
    const hide = message.loading("Deleting banner...", 0);
    try {
      await dispatch(deleteBanner(id)).unwrap();
      message.success("Banner deleted successfully");
      loadBanners();
    } catch (error: any) {
      console.error("Delete failed:", error);
      message.error(error || "Failed to delete banner");
    } finally {
      hide();
    }
  };

  const handleToggleStatus = async (record: Banner) => {
    setTogglingId(record.id);
    try {
      await dispatch(toggleBannerStatus(record.id)).unwrap();
      message.success(
        record.isActive
          ? "Banner deactivated"
          : "Banner activated (Max 3 active enforced)"
      );
      loadBanners();
    } catch (error: any) {
      message.error(error || "Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      title: "Seq",
      dataIndex: "sequence",
      key: "sequence",
      width: 75,
      align: "center" as const,
      render: (seq: number) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
          #{seq}
        </span>
      ),
    },
    {
      title: "Background Media",
      key: "bgMedia",
      width: 170,
      render: (_: any, record: Banner) => {
        const isVideo = record.bgMediaType === "VIDEO";
        return (
          <div className="flex flex-col gap-1.5 py-1">
            <div className="relative w-28 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-900 shadow-sm flex items-center justify-center group">
              {isVideo ? (
                <>
                  <video
                    src={record.bgMedia}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Video size={18} className="text-white drop-shadow" />
                  </div>
                </>
              ) : (
                <Image
                  src={record.bgMedia}
                  alt={record.heading}
                  width={112}
                  height={64}
                  className="object-cover w-full h-full rounded-lg"
                  preview={{
                    mask: <Eye size={14} className="text-white" />,
                  }}
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Tag
                color={isVideo ? "purple" : "blue"}
                className="text-[10px] font-bold uppercase rounded px-1.5 py-0 m-0 flex items-center gap-1"
              >
                {isVideo ? <Video size={10} /> : <ImageIcon size={10} />}
                {record.bgMediaType}
              </Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Content & Headline",
      key: "content",
      render: (_: any, record: Banner) => {
        return (
          <div className="space-y-1.5 max-w-md py-1">
            {record.label && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/60">
                {record.label}
              </span>
            )}
            <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
              {record.heading}
            </h4>
            {record.description && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {record.description}
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: "Layout & Side Image",
      key: "layout",
      width: 170,
      render: (_: any, record: Banner) => {
        return (
          <div className="space-y-1.5 py-1 text-xs">
            <div>
              <span className="text-gray-400 text-[11px] block">Alignment:</span>
              <Tag className="font-semibold rounded uppercase text-[10px]">
                {record.textAlignment || "LEFT"}
              </Tag>
            </div>
            {record.sideImage ? (
              <div className="flex items-center gap-1.5 pt-0.5">
                <Image
                  src={record.sideImage}
                  width={28}
                  height={28}
                  className="object-cover rounded-md border border-gray-200"
                />
                <span className="text-[11px] text-gray-600 font-medium">
                  {record.sideImagePosition === "LEFT" ? "Left Side" : "Right Side"}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-400">No side image</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Call to Action",
      key: "cta",
      width: 170,
      render: (_: any, record: Banner) => {
        return (
          <div className="space-y-1 py-1 text-xs">
            {record.primaryBtnText ? (
              <div className="flex items-center gap-1 text-gray-800 font-semibold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{record.primaryBtnText}</span>
              </div>
            ) : (
              <span className="text-gray-400 text-[11px]">No primary CTA</span>
            )}
            {record.secondaryBtnText && (
              <div className="flex items-center gap-1 text-gray-600 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                <span className="truncate">{record.secondaryBtnText}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      align: "center" as const,
      render: (isActive: boolean, record: Banner) => {
        return (
          <div className="flex flex-col items-center gap-1 py-1">
            <Switch
              checked={isActive}
              loading={togglingId === record.id}
              onChange={() => handleToggleStatus(record)}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      align: "center" as const,
      render: (_: any, record: Banner) => (
        <Space size="small">
          <Tooltip title="Edit Banner">
            <Button
              type="text"
              icon={<Edit2 size={16} />}
              onClick={() => navigate(`/dashboard/bannerForm/${record.id}`)}
              className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 flex items-center justify-center p-2 rounded-lg"
            />
          </Tooltip>

          <Tooltip title="Delete Banner">
            <Popconfirm
              title="Delete Banner"
              description="Are you sure you want to delete this banner permanently?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<Trash2 size={16} />}
                className="hover:bg-red-50 flex items-center justify-center p-2 rounded-lg"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg backdrop-blur-sm">
                <Sliders size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Hero Showcase
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Banner Management
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Manage homepage hero banners, background video/images, custom CTAs, and layout positions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 flex items-center gap-2 text-white">
              <span className="text-xs text-slate-300 font-medium">Active Limit:</span>
              <span
                className={`font-bold text-sm px-2 py-0.5 rounded-md ${
                  activeCount === 3
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                }`}
              >
                {activeCount} / 3 Active
              </span>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<Plus size={18} />}
              onClick={() => navigate("/dashboard/bannerForm")}
              className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md hover:shadow-indigo-500/25 flex items-center gap-2 h-11 px-6 rounded-xl font-medium"
            >
              Add New Banner
            </Button>
          </div>
        </div>
      </div>

      {/* Active Rules Notice */}
      <Alert
        message="Active Banner Limit Rule"
        description="Exactly 3 banners can be active simultaneously on the homepage. If you activate a 4th banner, the system automatically shifts the lowest sequence banner to inactive to preserve optimal slider presentation."
        type="info"
        showIcon
        icon={<Info size={18} />}
        className="rounded-xl border-indigo-100 bg-indigo-50/50"
      />

      {/* Filter and Table Container */}
      <Card
        bordered={false}
        className="shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden"
        bodyStyle={{ padding: "24px" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by heading or label..."
              prefix={<Search size={16} className="text-gray-400 mr-1" />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              allowClear
              className="rounded-xl py-2 px-3 border-gray-200 hover:border-indigo-400 focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Total Records:</span>
            <span className="font-semibold text-gray-800">{pagination.total}</span>
          </div>
        </div>

        <Table
          dataSource={banners}
          columns={columns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} banners`,
          }}
          locale={{
            emptyText: (
              <div className="py-12 flex flex-col items-center justify-center">
                <Empty
                  description={
                    <span className="text-gray-500 text-sm">
                      {searchText
                        ? "No banners match your search"
                        : "No banners found. Create your first banner!"}
                    </span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                {!searchText && (
                  <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={() => navigate("/dashboard/bannerForm")}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
                  >
                    Add Banner
                  </Button>
                )}
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default BannerList;

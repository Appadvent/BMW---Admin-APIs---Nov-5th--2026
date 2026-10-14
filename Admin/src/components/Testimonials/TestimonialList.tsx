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
  Avatar,
} from "antd";
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  Quote,
  User,
  Calendar,
  Building,
  Eye,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  fetchTestimonials,
  deleteTestimonial,
  Testimonial,
} from "../../store/slices/testimonialSlice";

const { Text } = Typography;

const TestimonialList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { testimonials, pagination, loading } = useSelector(
    (state: RootState) => state.testimonials
  );

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load testimonials on page, limit, or search change
  useEffect(() => {
    dispatch(
      fetchTestimonials({
        page: currentPage,
        limit: pageSize,
        search: searchText.trim() || undefined,
      })
    );
  }, [dispatch, currentPage, pageSize, searchText]);

  const handleDelete = async (id: number) => {
    const hide = message.loading("Deleting testimonial...", 0);
    try {
      await dispatch(deleteTestimonial(id)).unwrap();
      message.success("Testimonial deleted successfully");
      dispatch(
        fetchTestimonials({
          page: currentPage,
          limit: pageSize,
          search: searchText.trim() || undefined,
        })
      );
    } catch (error: any) {
      console.error("Delete failed:", error);
      message.error(error || "Failed to delete testimonial");
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: "Client",
      key: "client",
      width: 250,
      render: (_: any, record: Testimonial) => {
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex-shrink-0 flex items-center justify-center">
              {record.image ? (
                <Image
                  src={record.image}
                  alt={record.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full rounded-full"
                  preview={{
                    mask: <Eye size={14} className="text-white" />,
                  }}
                />
              ) : (
                <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  {record.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <Text strong className="text-gray-900 text-sm font-semibold truncate block max-w-[170px]">
                {record.name}
              </Text>
              {record.designation ? (
                <span className="text-xs text-indigo-600 font-medium truncate block max-w-[170px]">
                  {record.designation}
                </span>
              ) : (
                <span className="text-xs text-gray-400 italic">No designation</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Testimonial Message",
      dataIndex: "message",
      key: "message",
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <div className="flex items-start gap-2 max-w-xl">
            <Quote size={14} className="text-indigo-400 flex-shrink-0 mt-1 rotate-180" />
            <p className="text-xs text-gray-600 line-clamp-3 mb-0 italic leading-relaxed">
              "{text}"
            </p>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Date Added",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (dateStr: string) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={13} className="text-gray-400" />
          <span>{dateStr ? new Date(dateStr).toLocaleDateString() : "-"}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: Testimonial) => (
        <Space size="small">
          <Tooltip title="Edit Testimonial">
            <Button
              type="text"
              size="small"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center justify-center p-1.5 rounded-md"
              icon={<Edit2 size={15} />}
              onClick={() =>
                navigate("/dashboard/testimonialForm", {
                  state: { testimonial: record },
                })
              }
            />
          </Tooltip>

          <Tooltip title="Delete Testimonial">
            <Popconfirm
              title="Delete Testimonial"
              description="Are you sure you want to delete this testimonial? This action cannot be undone."
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
                <Quote size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Content Management
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Testimonials
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Manage client feedback, endorsements, and customer testimonials displayed across your website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Create a new client testimonial">
              <Button
                type="primary"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 font-medium flex items-center gap-2 rounded-lg h-11 px-5"
                icon={<Plus size={18} />}
                onClick={() => navigate("/dashboard/testimonialForm")}
              >
                Create Testimonial
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
              placeholder="Search testimonials by name, role, or message..."
              prefix={<Search size={16} className="text-gray-400 mr-1" />}
              allowClear
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              size="large"
              className="rounded-lg shadow-sm border-gray-300 hover:border-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Quote size={16} className="text-indigo-600" />
            <span>
              Total <strong className="text-gray-800">{pagination.total}</strong> testimonials
            </span>
          </div>
        </div>

        {/* Table with Server-side Pagination */}
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={testimonials}
            loading={loading}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: pagination.total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              onChange: (page, newPageSize) => {
                setCurrentPage(page);
                setPageSize(newPageSize);
              },
              showTotal: (total, range) => (
                <span className="text-xs text-gray-500">
                  {range[0]}-{range[1]} of {total} testimonials (Newest first)
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
                        {searchText
                          ? `No testimonials matching "${searchText}"`
                          : "No testimonials added yet"}
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
                          onClick={() => navigate("/dashboard/testimonialForm")}
                        >
                          Add Your First Testimonial
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

export default TestimonialList;

import React, { useEffect, useState, useCallback } from "react";
import {
  MessageSquare,
  Package,
  BookOpen,
  LayoutDashboard,
  FolderTree,
  RotateCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, Spin, Table, Tag, Button, Empty, Tooltip } from "antd";
import { statsService } from "../../services/api";

interface StatCounts {
  categories: number | null;
  products: number | null;
  queries: number | null;
  blogs: number | null;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatCounts>({
    categories: null,
    products: null,
    queries: null,
    blogs: null,
  });

  const [recentQueries, setRecentQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await statsService.getStats();
      const data = res?.data;

      if (data?.counts) {
        setStats({
          categories: data.counts.categories ?? 0,
          products: data.counts.products ?? 0,
          queries: data.counts.queries ?? 0,
          blogs: data.counts.blogs ?? 0,
        });
      }

      if (data?.recentQueries && Array.isArray(data.recentQueries)) {
        setRecentQueries(data.recentQueries);
      } else {
        setRecentQueries([]);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const topMetrics = [
    {
      title: "Total Categories",
      count: stats.categories,
      icon: <FolderTree size={22} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      path: "/dashboard/categories",
    },
    {
      title: "Listed Products",
      count: stats.products,
      icon: <Package size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      path: "/dashboard/products",
    },
    {
      title: "Customer Queries",
      count: stats.queries,
      icon: <MessageSquare size={22} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      path: "/dashboard/queries",
    },
    {
      title: "News & Media",
      count: stats.blogs,
      icon: <BookOpen size={22} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      path: "/dashboard/blogs",
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
                <LayoutDashboard size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                System Overview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Monitor key metrics, manage content, and oversee operations from a centralized hub.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip title="Refresh Statistics">
              <Button
                icon={<RotateCw size={16} className={loading ? "animate-spin" : ""} />}
                onClick={() => fetchStats()}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-1.5"
              >
                Refresh
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics (4 main cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topMetrics.map((metric, idx) => (
          <Card
            key={idx}
            bordered={false}
            className="shadow-sm rounded-xl border border-gray-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
            bodyStyle={{ padding: "24px", display: "flex", flexDirection: "column", height: "100%" }}
            onClick={() => navigate(metric.path)}
          >
            <div className="flex items-start justify-between flex-1">
              <div className="flex flex-col h-full">
                <p className="text-sm font-medium text-gray-500 mb-2">{metric.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-auto">
                  {loading && metric.count === null ? (
                    <Spin size="small" />
                  ) : (
                    metric.count ?? 0
                  )}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Customer Queries Table */}
      <div className="w-full">
        <Card
          bordered={false}
          title={
            <div className="flex items-center gap-2 text-gray-800 font-bold py-2">
              <MessageSquare size={20} className="text-emerald-600" />
              <span>Recent Customer Inquiries</span>
            </div>
          }
          className="shadow-sm rounded-xl border border-gray-200/80"
          extra={
            <Button
              type="link"
              onClick={() => navigate("/dashboard/queries")}
              className="text-indigo-600 font-medium p-0"
            >
              View All Queries →
            </Button>
          }
        >
          <Table
            dataSource={recentQueries}
            rowKey={(record) => record.id || record._id}
            loading={loading}
            pagination={false}
            scroll={{ x: "max-content" }}
            columns={[
              {
                title: "Customer Name",
                dataIndex: "name",
                key: "name",
                render: (text) => (
                  <span className="font-semibold text-gray-800">{text || "Anonymous"}</span>
                ),
              },
              {
                title: "Email",
                dataIndex: "email",
                key: "email",
                render: (text) => text || <span className="text-gray-400">N/A</span>,
              },
              {
                title: "Phone",
                dataIndex: "phone",
                key: "phone",
                render: (text) => text || <span className="text-gray-400">N/A</span>,
              },
              {
                title: "Service / Category",
                dataIndex: "services",
                key: "services",
                render: (text) =>
                  text ? (
                    <Tag
                      color="blue"
                      className="bg-indigo-50 text-indigo-700 border-none rounded-full px-3 py-0.5 text-xs font-medium"
                    >
                      {text}
                    </Tag>
                  ) : (
                    <span className="text-gray-400">General Inquiry</span>
                  ),
              },
              {
                title: "Message Preview",
                dataIndex: "message",
                key: "message",
                render: (text) => (
                  <span className="text-gray-600 text-xs line-clamp-1 max-w-xs" title={text}>
                    {text || "No message content"}
                  </span>
                ),
              },
              {
                title: "Submitted Date",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (dateStr) => {
                  if (!dateStr) return "N/A";
                  return new Date(dateStr).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                },
              },
            ]}
            locale={{
              emptyText: (
                <Empty
                  description="No customer inquiries found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Home;

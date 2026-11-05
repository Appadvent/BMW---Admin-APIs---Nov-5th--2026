import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Drawer,
  message,
  Form,
  Card,
  Tag,
  Tooltip,
  Popconfirm,
  Empty,
  Avatar,
  Divider,
} from "antd";
import {
  Eye,
  Search,
  Mail,
  Trash2,
  Phone,
  MessageSquare,
  Calendar,
  Send,
  User,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Inbox,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchQueries, Query } from "../../store/slices/querySlice";
import { queryService, userService } from "../../services/api";

// Helper to clean duplicate OEM prefix e.g. "OEM: OEM: sample data" -> "sample data"
const cleanOemDisplay = (val?: string | null) => {
  if (!val) return "";
  return val.replace(/^(OEM:s*)+/i, "").trim();
};

// Helper to extract clean pure customer message without technical brackets/headers
const extractPureCustomerMessage = (raw?: string | null) => {
  if (!raw) return "";
  let text = raw;
  if (text.includes("User Message:")) {
    text = text.split("User Message:")[1] || "";
  } else {
    text = text.replace(/\[(Issue|Part|Ref\/Part|OEM|VIN|Country|Brand|Qty|Attachment):[^\]]*\]/gi, "");
    text = text.replace(/^(Vehicle|VIN|OEM Number|Product Reference|Quantity|Country|Attachment):[^\n]*\n?/gim, "");
  }
  return text.trim();
};

// Helper to parse extra structured details from message
const parseMessageFitment = (msg?: string | null) => {
  const info: Record<string, string> = {};
  if (!msg) return info;

  const partM = msg.match(/(?:\[(?:Part|Ref\/Part):\s*|Product Reference:\s*)([^,\]\n]+)/i);
  if (partM) info.part = partM[1].trim();

  const oemM = msg.match(/(?:\[OEM:\s*|OEM Number:\s*)([^,\]\n]+)/i);
  if (oemM) info.oem = cleanOemDisplay(oemM[1].replace(/\]$/, ""));

  const modelM = msg.match(/(?:\[Model:\s*|Vehicle:\s*)([^,\]\n]+)/i);
  if (modelM) info.model = modelM[1].replace(/\]$/, "").trim();

  const vinM = msg.match(/(?:\[VIN:\s*|VIN:\s*)([^,\]\n]+)/i);
  if (vinM) info.vin = vinM[1].replace(/\]$/, "").trim();

  const countryM = msg.match(/(?:\[Country:\s*|Country:\s*)([^,\]\n]+)/i);
  if (countryM) info.country = countryM[1].replace(/\]$/, "").trim();

  const qtyM = msg.match(/(?:\[Qty:\s*|Quantity:\s*)([^,\]\n]+)/i);
  if (qtyM) info.qty = qtyM[1].replace(/\]$/, "").trim();

  return info;
};

const QueryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { queries, pagination, loading } = useSelector((state: RootState) => state.queries);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<"all" | "inquiry" | "contact">("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Detail Drawer state
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  // Email Modal state
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailForm] = Form.useForm();

  // Load queries with debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchQueries({
          page,
          limit,
          search: searchText.trim() || undefined,
        })
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, page, limit, searchText]);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  const handleRefresh = () => {
    dispatch(
      fetchQueries({
        page,
        limit,
        search: searchText.trim() || undefined,
      })
    );
    message.success("Queries refreshed");
  };

  // View Details
  const handleViewDetails = (record: Query) => {
    setSelectedQuery(record);
    setIsDrawerVisible(true);
  };

  // Open Email Modal
  const handleOpenEmailModal = (record: Query) => {
    emailForm.resetFields();
    emailForm.setFieldsValue({
      email: record.email,
      name: record.name,
      subject: `Response regarding your inquiry at Streamline`,
      content: `Hello ${record.name},\n\nThank you for reaching out to Streamline. We have received your inquiry regarding "${record.services || "our solutions"}".\n\n`,
    });
    setIsEmailModalVisible(true);
  };

  // Send Email Handler
  const handleSendEmail = async (values: { email: string; subject: string; content: string }) => {
    setSendingEmail(true);
    const hideLoading = message.loading("Sending email...", 0);
    try {
      const response = await userService.sendEmail({
        email: values.email,
        subject: values.subject,
        content: values.content,
      });

      if (response && response.message) {
        message.success(response.message);
      } else {
        message.success("Email sent successfully");
      }
      emailForm.resetFields();
      setIsEmailModalVisible(false);
    } catch (error: any) {
      console.error("Failed to send email:", error);
      message.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to send email");
    } finally {
      hideLoading();
      setSendingEmail(false);
    }
  };

  // Delete Query
  const handleDeleteQuery = async (queryId: number | string) => {
    const hideLoading = message.loading("Deleting query...", 0);
    try {
      const response = await queryService.deleteQuery(queryId.toString());
      message.success(response?.message || "Query deleted successfully");
      dispatch(
        fetchQueries({
          page,
          limit,
          search: searchText.trim() || undefined,
        })
      );
      if (selectedQuery?.id === queryId) {
        setIsDrawerVisible(false);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to delete query");
    } finally {
      hideLoading();
    }
  };

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    message.success(`Copied ${field} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
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

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Table Columns
  const columns = [
    {
      title: "User / Requester",
      key: "requester",
      width: 240,
      render: (_: any, record: Query) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={42}
            className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-semibold flex-shrink-0 shadow-sm"
          >
            {getInitials(record.name)}
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate flex items-center gap-1.5">
              <span>{record.name || "Anonymous User"}</span>
            </div>
            {record.services && (
              <Tag color="blue" className="mt-1 text-xs border-none font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {record.services}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Contact Info",
      key: "contact",
      width: 260,
      render: (_: any, record: Query) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 group text-gray-600 hover:text-indigo-600">
            <Mail size={13} className="text-gray-400 group-hover:text-indigo-600 flex-shrink-0" />
            <a
              href={`mailto:${record.email}`}
              className="truncate text-gray-700 hover:text-indigo-600 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {record.email || "No email"}
            </a>
            {record.email && (
              <Tooltip title="Copy Email">
                <button
                  type="button"
                  onClick={() => handleCopy(record.email, `email-${record.id}`)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-600 transition-opacity p-0.5"
                >
                  {copiedField === `email-${record.id}` ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
              </Tooltip>
            )}
          </div>

          <div className="flex items-center gap-2 group text-gray-600 hover:text-indigo-600">
            <Phone size={13} className="text-gray-400 group-hover:text-indigo-600 flex-shrink-0" />
            <a
              href={`tel:${record.phone}`}
              className="text-gray-700 hover:text-indigo-600 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {record.phone || "No phone number"}
            </a>
            {record.phone && (
              <Tooltip title="Copy Phone">
                <button
                  type="button"
                  onClick={() => handleCopy(record.phone, `phone-${record.id}`)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-600 transition-opacity p-0.5"
                >
                  {copiedField === `phone-${record.id}` ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Vehicle / Part Details",
      key: "vehicle",
      width: 220,
      render: (_: any, record: Query) => (
        <div className="space-y-1 text-xs">
          {record.oemNumber && (
            <div className="flex items-center gap-1 font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-semibold w-fit">
              OEM: {cleanOemDisplay(record.oemNumber)}
            </div>
          )}
          {record.carModel && (
            <div className="text-gray-800 font-medium">
              Model: {record.carModel} {record.year ? `(${record.year})` : ""}
            </div>
          )}
          {record.vin && (
            <div className="text-[11px] text-gray-500 font-mono">
              VIN: {record.vin}
            </div>
          )}
          {!record.oemNumber && !record.carModel && !record.vin && (
            <span className="text-gray-400 italic">General Inquiry</span>
          )}
        </div>
      ),
    },
    {
      title: "Inquiry Message",
      dataIndex: "message",
      key: "message",
      width: 320,
      render: (text: string, record: Query) => (
        <div
          onClick={() => handleViewDetails(record)}
          className="cursor-pointer group hover:bg-indigo-50/60 p-2 rounded-lg transition-colors"
        >
          <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed group-hover:text-gray-900 m-0">
            {extractPureCustomerMessage(text) || <span className="italic text-gray-400">No message content</span>}
          </p>
          <span className="text-[11px] text-indigo-600 font-medium mt-1 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
            Click to view full message →
          </span>
        </div>
      ),
    },
    {
      title: "Date Received",
      dataIndex: "createdAt",
      key: "createdAt",
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
      width: 120,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: Query) => (
        <Space size={4}>
          <Tooltip title="View Details">
            <Button
              type="text"
              size="middle"
              className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-center p-2"
              icon={<Eye size={16} />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>

          <Tooltip title="Send Direct Email">
            <Button
              type="text"
              size="middle"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center p-2"
              icon={<Mail size={16} />}
              onClick={() => handleOpenEmailModal(record)}
            />
          </Tooltip>

          <Tooltip title="Delete Query">
            <Popconfirm
              title="Delete Inquiry"
              description="Are you sure you want to delete this customer inquiry? This action cannot be undone."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteQuery(record.id)}
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
                <MessageSquare size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Customer Support & Inquiries
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Customer Queries
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track, search, and respond to inquiries submitted by prospective clients and website visitors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Refresh queries">
              <Button
                type="default"
                size="large"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 flex items-center gap-2 rounded-lg h-11 px-4"
                icon={<RefreshCw size={16} />}
                onClick={handleRefresh}
              >
                Refresh
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
              placeholder="Search by name, email, phone number, service..."
              prefix={<Search size={16} className="text-gray-400 mr-1" />}
              allowClear
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              size="large"
              className="rounded-lg shadow-sm border-gray-300 hover:border-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterType === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                All ({queries?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("inquiry")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterType === "inquiry"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                <Sparkles size={13} />
                Inquiries ({
                  queries?.filter(
                    (q) =>
                      (q.services && q.services.toLowerCase().includes("inquiry")) ||
                      (q.message && q.message.includes("Vehicle:"))
                  ).length || 0
                })
              </button>
              <button
                type="button"
                onClick={() => setFilterType("contact")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterType === "contact"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                General Contact ({
                  queries?.filter(
                    (q) =>
                      !(
                        (q.services && q.services.toLowerCase().includes("inquiry")) ||
                        (q.message && q.message.includes("Vehicle:"))
                      )
                  ).length || 0
                })
              </button>
            </div>
          </div>
        </div>

        {/* Queries Table */}
        <div className="mt-4">
          <Table
            columns={columns}
            scroll={{ x: 1200 }}
            dataSource={queries.filter((q) => {
              if (filterType === "all") return true;
              const isPartsInq = (q.services && q.services.toLowerCase().includes("inquiry")) ||
                                 (q.message && q.message.includes("Vehicle:"));
              return filterType === "inquiry" ? isPartsInq : !isPartsInq;
            })}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination?.page || page,
              pageSize: pagination?.limit || limit,
              total: pagination?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => (
                <span className="text-xs text-gray-500">
                  {range[0]}-{range[1]} of {total} inquiries
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
                        {searchText ? `No queries matching "${searchText}"` : "No customer inquiries found"}
                      </p>
                      {searchText && (
                        <Button
                          size="small"
                          type="link"
                          onClick={() => handleSearchChange("")}
                          className="text-indigo-600"
                        >
                          Clear Search
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

      {/* Modern Drawer for Query Details */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <span className="font-semibold text-gray-800 text-base">Inquiry Details</span>
          </div>
        }
        placement="right"
        width={Math.min(600, typeof window !== "undefined" ? window.innerWidth * 0.95 : 600)}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        bodyStyle={{ padding: "24px" }}
        extra={
          selectedQuery && (
            <Button
              type="primary"
              icon={<Send size={14} />}
              className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-lg"
              onClick={() => {
                setIsDrawerVisible(false);
                handleOpenEmailModal(selectedQuery);
              }}
            >
              Reply via Email
            </Button>
          )
        }
      >
        {selectedQuery && (
          <div className="space-y-6">
            {/* Header User Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-indigo-100/60">
              <Avatar
                size={54}
                className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold text-lg flex-shrink-0 shadow-sm"
              >
                {getInitials(selectedQuery.name)}
              </Avatar>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-base m-0 truncate">{selectedQuery.name}</h3>
                {selectedQuery.services && (
                  <Tag color="indigo" className="mt-1 font-medium rounded-full border-none">
                    {selectedQuery.services}
                  </Tag>
                )}
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-gray-400" />
                  <span>Submitted on {formatDate(selectedQuery.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Contact Details</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Mail size={16} className="text-indigo-600 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">Email Address</div>
                      <a href={`mailto:${selectedQuery.email}`} className="text-sm font-semibold text-gray-800 hover:text-indigo-600 truncate block">
                        {selectedQuery.email || "N/A"}
                      </a>
                    </div>
                  </div>
                  {selectedQuery.email && (
                    <Tooltip title="Copy Email">
                      <Button
                        type="text"
                        size="small"
                        icon={<Copy size={14} className="text-gray-500" />}
                        onClick={() => handleCopy(selectedQuery.email, "email-drawer")}
                      />
                    </Tooltip>
                  )}
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Phone size={16} className="text-indigo-600 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">Phone Number</div>
                      <a href={`tel:${selectedQuery.phone}`} className="text-sm font-semibold text-gray-800 hover:text-indigo-600 truncate block">
                        {selectedQuery.phone || "N/A"}
                      </a>
                    </div>
                  </div>
                  {selectedQuery.phone && (
                    <Tooltip title="Copy Phone">
                      <Button
                        type="text"
                        size="small"
                        icon={<Copy size={14} className="text-gray-500" />}
                        onClick={() => handleCopy(selectedQuery.phone, "phone-drawer")}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>

            {/* Automotive Fitment & Enquiry Details */}
            {(() => {
              const extra = parseMessageFitment(selectedQuery.message);
              const oemVal = cleanOemDisplay(selectedQuery.oemNumber) || extra.oem;
              const modelVal = selectedQuery.carModel || extra.model;
              const vinVal = selectedQuery.vin || extra.vin;
              const yearVal = selectedQuery.year;
              const partVal = extra.part;
              const countryVal = extra.country;
              const qtyVal = extra.qty;
              const pureMsg = extractPureCustomerMessage(selectedQuery.message);

              const hasFitment = oemVal || modelVal || vinVal || yearVal || partVal || countryVal || qtyVal;

              return (
                <>
                  {hasFitment && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Automotive Fitment & Part
                      </h4>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
                        {oemVal && (
                          <div>
                            <span className="text-gray-400 block text-[11px]">Requested OEM Number</span>
                            <span className="font-mono font-bold text-indigo-700 text-sm">
                              {oemVal}
                            </span>
                          </div>
                        )}
                        {modelVal && (
                          <div>
                            <span className="text-gray-400 block text-[11px]">Vehicle Model</span>
                            <span className="font-semibold text-gray-800">{modelVal}</span>
                          </div>
                        )}
                        {partVal && (
                          <div>
                            <span className="text-gray-400 block text-[11px]">Product Reference / Part</span>
                            <span className="font-semibold text-gray-800">{partVal}</span>
                          </div>
                        )}
                        {qtyVal && (
                          <div>
                            <span className="text-gray-400 block text-[11px]">Required Quantity</span>
                            <span className="font-semibold text-gray-800">{qtyVal} pcs</span>
                          </div>
                        )}
                        {countryVal && (
                          <div>
                            <span className="text-gray-400 block text-[11px]">Destination Country</span>
                            <span className="font-semibold text-gray-800">{countryVal}</span>
                          </div>
                        )}
                        {yearVal && (
                          <div>
                            <span className="text-gray-400 block text-[11px]">Model Year</span>
                            <span className="font-semibold text-gray-800">{yearVal}</span>
                          </div>
                        )}
                        {vinVal && (
                          <div className="col-span-2">
                            <span className="text-gray-400 block text-[11px]">
                              VIN Number (Confidential Verification)
                            </span>
                            <span className="font-mono font-semibold text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 inline-block mt-0.5">
                              {vinVal}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customer Message Card (Pure user message separated) */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Customer Message
                    </h4>
                    <div
                      className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-sm leading-relaxed text-sm text-gray-800 whitespace-pre-wrap break-all"
                      style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                    >
                      {pureMsg || <span className="italic text-gray-400">No additional message provided</span>}
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <Button
                type="primary"
                size="large"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 border-none rounded-lg h-11 flex items-center justify-center gap-2"
                icon={<Mail size={16} />}
                onClick={() => {
                  setIsDrawerVisible(false);
                  handleOpenEmailModal(selectedQuery);
                }}
              >
                Send Email Reply
              </Button>
              <Popconfirm
                title="Delete Inquiry"
                description="Are you sure you want to permanently delete this inquiry?"
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
                onConfirm={() => handleDeleteQuery(selectedQuery.id)}
              >
                <Button
                  danger
                  size="large"
                  className="rounded-lg h-11 px-4 flex items-center justify-center"
                  icon={<Trash2 size={16} />}
                />
              </Popconfirm>
            </div>
          </div>
        )}
      </Drawer>

      {/* Send Email Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Send size={18} className="text-indigo-600" />
            <span className="font-semibold text-gray-800 text-base">Send Direct Email Response</span>
          </div>
        }
        open={isEmailModalVisible}
        onCancel={() => {
          emailForm.resetFields();
          setIsEmailModalVisible(false);
        }}
        footer={null}
        width={560}
      >
        <Form
          layout="vertical"
          form={emailForm}
          onFinish={handleSendEmail}
          className="mt-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="font-medium text-gray-700 text-xs">Recipient Name</span>}
              name="name"
            >
              <Input disabled className="rounded-lg bg-gray-50 font-medium" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700 text-xs">Recipient Email</span>}
              name="email"
              rules={[{ required: true, message: "Recipient email is required" }]}
            >
              <Input disabled className="rounded-lg bg-gray-50 font-medium" />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="font-medium text-gray-700 text-xs">Subject Line</span>}
            name="subject"
            rules={[{ required: true, message: "Please enter a subject line" }]}
          >
            <Input
              placeholder="e.g. Response regarding your inquiry at Streamline"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700 text-xs">Email Message Content</span>}
            name="content"
            rules={[{ required: true, message: "Please enter the email content" }]}
          >
            <Input.TextArea
              rows={7}
              placeholder="Type your reply message here..."
              className="rounded-lg text-sm leading-relaxed"
            />
          </Form.Item>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              onClick={() => setIsEmailModalVisible(false)}
              className="rounded-lg px-4"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={sendingEmail}
              className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 rounded-lg px-6 flex items-center gap-2"
              icon={<Send size={15} />}
            >
              Send Response
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default QueryList;

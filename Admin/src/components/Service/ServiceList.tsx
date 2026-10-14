import React, { useEffect } from "react";
import {
  Button,
  message,
  Image,
  Card,
  Tooltip,
  Popconfirm,
  Tag,
  Row,
  Col,
  Empty,
  Typography,
} from "antd";
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Layers,
  Sparkles,
  Eye,
  Cog,
  CheckCircle2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { fetchServices, deleteService } from "../../store/slices/serviceSlice";

const { Text, Paragraph } = Typography;

const ServiceList: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { services, loading } = useSelector((state: RootState) => state.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    const hide = message.loading("Deleting service...", 0);
    try {
      await dispatch(deleteService(id)).unwrap();
      message.success("Service section deleted successfully");
      dispatch(fetchServices());
    } catch (error: any) {
      console.error("Failed to delete service:", error);
      message.error(error?.response?.data?.message || "Failed to delete service");
    } finally {
      hide();
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg backdrop-blur-sm">
                <Briefcase size={20} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Services & Capabilities
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Our Services
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Showcase your specialized engineering, manufacturing, and industrial fabrication services.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {services.length === 0 ? (
              <Tooltip title="Create a new services section">
                <Button
                  type="primary"
                  size="large"
                  className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 font-medium flex items-center gap-2 rounded-lg h-11 px-5"
                  icon={<Plus size={18} />}
                  onClick={() => navigate("/dashboard/serviceForm")}
                >
                  Create Services
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Edit services and offerings">
                <Button
                  type="primary"
                  size="large"
                  className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 font-medium flex items-center gap-2 rounded-lg h-11 px-5"
                  icon={<Edit2 size={16} />}
                  onClick={() =>
                    navigate("/dashboard/serviceForm", {
                      state: { service: services[0] },
                    })
                  }
                >
                  Edit Services
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <Card className="rounded-2xl text-center py-12 shadow-sm border border-gray-200">
          <div className="flex flex-col items-center justify-center gap-3">
            <Cog size={36} className="animate-spin text-indigo-600" />
            <p className="text-gray-500 font-medium text-sm">Loading services...</p>
          </div>
        </Card>
      ) : services.length === 0 ? (
        <Card className="rounded-2xl text-center py-12 shadow-sm border border-gray-200">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="py-4 space-y-2">
                <p className="text-gray-500 font-medium text-sm">No services configured yet</p>
                <Button
                  type="primary"
                  icon={<Plus size={15} />}
                  className="mt-2 bg-indigo-600 rounded-lg"
                  onClick={() => navigate("/dashboard/serviceForm")}
                >
                  Configure Services Section
                </Button>
              </div>
            }
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {services.map((service) => (
            <Card
              key={service.id}
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white overflow-hidden"
              bodyStyle={{ padding: "24px md:32px" }}
            >
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag color="indigo" className="font-medium rounded-full border-none px-2.5 py-0.5">
                      Section Heading
                    </Tag>
                    <span className="text-xs text-gray-400">
                      {service.items?.length || 0} / 5 Service Offerings
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 m-0 tracking-tight">
                    {service.heading}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip title="Edit Service Offerings">
                    <Button
                      type="default"
                      className="border-gray-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg flex items-center gap-2 h-10 px-4"
                      icon={<Edit2 size={16} />}
                      onClick={() =>
                        navigate("/dashboard/serviceForm", {
                          state: { service },
                        })
                      }
                    >
                      Edit Section
                    </Button>
                  </Tooltip>

                  <Tooltip title="Delete Service Section">
                    <Popconfirm
                      title="Delete Service Section"
                      description="Are you sure you want to permanently delete this service section?"
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDelete(service.id)}
                    >
                      <Button
                        danger
                        type="text"
                        className="hover:bg-red-50 rounded-lg p-2 flex items-center justify-center h-10 w-10"
                        icon={<Trash2 size={16} />}
                      />
                    </Popconfirm>
                  </Tooltip>
                </div>
              </div>

              {/* Service Items Grid */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                  Service Offerings
                </h3>

                {service.items && service.items.length > 0 ? (
                  <Row gutter={[20, 20]}>
                    {service.items.map((item: any, idx: number) => (
                      <Col xs={24} sm={12} lg={8} key={item.id || idx}>
                        <div className="h-full bg-slate-50/70 hover:bg-white rounded-xl p-5 border border-gray-200/70 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between group">
                          <div>
                            {/* Image Preview */}
                            <div className="w-full h-40 rounded-lg overflow-hidden bg-white border border-gray-100 shadow-xs mb-4 flex items-center justify-center relative">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  preview={{
                                    mask: <Eye size={16} className="text-white" />,
                                  }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-gray-300 gap-1">
                                  <Briefcase size={28} className="stroke-1" />
                                  <span className="text-xs">No image attached</span>
                                </div>
                              )}
                              <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                #{idx + 1}
                              </span>
                            </div>

                            {/* Details */}
                            <h4 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed m-0">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-sm text-gray-400 italic">No service items added yet.</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;

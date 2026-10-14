import React, { useEffect, useState } from "react";
import {
  Button,
  message,
  Upload,
  Card,
  Input,
  Tooltip,
  Spin,
  Row,
  Col,
} from "antd";
import {
  ArrowLeft,
  UploadCloud,
  Save,
  User,
  Quote,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { testimonialService, uploadService } from "../../services/api";

const { TextArea } = Input;

const TestimonialForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const testimonial = location.state?.testimonial;
  const isEditing = !!testimonial;

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Populate data when editing
  useEffect(() => {
    if (testimonial) {
      setName(testimonial.name || "");
      setDesignation(testimonial.designation || "");
      setMsgContent(testimonial.message || "");
      setImage(testimonial.image || "");
    }
  }, [testimonial]);

  const handleGoBack = () => navigate("/dashboard/testimonials");

  // Profile image upload handler using MinIO uploadService
  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const res = await uploadService.uploadFile(file, "testimonials");
      const uploadedUrl = res?.data?.url || res?.url;

      if (!uploadedUrl) throw new Error("Invalid upload response");

      setImage(uploadedUrl);
      message.success("Profile image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Failed to upload profile photo");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return message.error("Client Name is required.");
    }
    if (!msgContent.trim()) {
      return message.error("Testimonial Message is required.");
    }

    setSubmitting(true);
    const hide = message.loading(
      isEditing ? "Updating testimonial..." : "Creating testimonial...",
      0
    );

    const payload = {
      name: name.trim(),
      designation: designation.trim() || null,
      message: msgContent.trim(),
      image: image.trim() || null,
    };

    try {
      if (testimonial?.id) {
        await testimonialService.updateTestimonial(testimonial.id, payload);
        message.success("Testimonial updated successfully!");
      } else {
        await testimonialService.createTestimonial(payload);
        message.success("Testimonial created successfully!");
      }
      navigate("/dashboard/testimonials");
    } catch (err: any) {
      console.error("Save error:", err);
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to save testimonial";
      message.error(errMsg);
    } finally {
      hide();
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-4">
          <Tooltip title="Back to Testimonials List">
            <Button
              onClick={handleGoBack}
              icon={<ArrowLeft size={18} />}
              className="flex items-center justify-center rounded-xl border-gray-300 hover:border-indigo-600 hover:text-indigo-600 shadow-sm h-11 px-4"
            >
              Back
            </Button>
          </Tooltip>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0">
              {isEditing ? "Edit Testimonial" : "Create Testimonial"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 mb-0">
              {isEditing
                ? `Updating testimonial ID #${testimonial.id}`
                : "Add client endorsement, feedback, and quote details."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <Row gutter={[24, 24]}>
          {/* Main Content Column */}
          <Col xs={24} md={16} className="space-y-6">
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center gap-2 py-1">
                  <Quote size={18} className="text-indigo-600" />
                  <span className="font-semibold text-gray-800 text-base">
                    Testimonial Content
                  </span>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Client / Customer Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Sarah Jenkins"
                    size="large"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={120}
                    showCount
                    className="rounded-lg text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Designation / Company / Destination (Optional)
                  </label>
                  <Input
                    placeholder="e.g. Operations Director, Apex Industrial"
                    size="large"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    maxLength={120}
                    showCount
                    className="rounded-lg text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Testimonial Message <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-400">Max 220 characters</span>
                  </div>
                  <TextArea
                    rows={4}
                    placeholder="Enter the client's quote or feedback (e.g. 'OEM parts fitment and quality exceeded expectations...')"
                    value={msgContent}
                    onChange={(e) => setMsgContent(e.target.value)}
                    required
                    maxLength={220}
                    showCount
                    className="rounded-lg text-sm"
                  />
                </div>
              </div>
            </Card>
          </Col>

          {/* Media / Profile Image Column */}
          <Col xs={24} md={8} className="space-y-6">
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center gap-2 py-1">
                  <User size={18} className="text-indigo-600" />
                  <span className="font-semibold text-gray-800 text-base">
                    Profile Photo
                  </span>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  {image ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-200 bg-gray-50 mb-3 shadow-md group">
                      <img
                        src={image}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="small"
                          danger
                          icon={<Trash2 size={14} />}
                          onClick={() => setImage("")}
                          className="bg-white/90"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 mb-3">
                      <ImageIcon size={32} className="text-gray-300 mb-1" />
                      <span className="text-[11px] text-gray-400">Optional Photo</span>
                    </div>
                  )}

                  {uploadingImage && (
                    <span className="text-xs text-indigo-600 flex items-center gap-1 mb-2">
                      <Spin size="small" /> Uploading image...
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Upload
                    beforeUpload={(file) => {
                      handleImageUpload(file);
                      return false;
                    }}
                    showUploadList={false}
                    accept="image/*"
                    disabled={uploadingImage}
                    className="w-full block"
                  >
                    <Button
                      icon={<UploadCloud size={15} />}
                      loading={uploadingImage}
                      size="middle"
                      className="w-full rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium text-xs flex items-center justify-center gap-1.5"
                    >
                      {image ? "Replace Photo" : "Upload Client Photo"}
                    </Button>
                  </Upload>

                  <Input
                    placeholder="Or paste image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    size="middle"
                    className="rounded-lg text-xs"
                  />
                </div>
              </div>
            </Card>

            {/* Submit & Cancel Actions Card */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between gap-3">
              <Button
                onClick={handleGoBack}
                className="rounded-xl h-11 px-5 font-medium border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<Save size={16} />}
                className="rounded-xl h-11 px-6 bg-indigo-600 hover:bg-indigo-700 font-medium shadow-sm flex items-center gap-2"
              >
                {isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default TestimonialForm;

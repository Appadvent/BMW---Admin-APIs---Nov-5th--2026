import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Form,
  message,
  Select,
  Card,
  Row,
  Col,
  Space,
} from "antd";
import {
  ArrowLeft,
  Save,
  FileText,
  Sparkles,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { pageService } from "../../services/api";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};

const PageForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.state?.page;
  const isEditing = !!page;

  const [form] = Form.useForm();
  const [content, setContent] = useState(page?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (page) {
      form.setFieldsValue({
        title: page.title,
        type: page.type,
      });
      setContent(page.content || "");
    }
  }, [page, form]);

  const handleGoBack = () => {
    navigate("/dashboard/pages");
  };

  const handleSubmit = async (values: any) => {
    const cleanContent = content ? content.replace(/<(.|\n)*?>/g, "").trim() : "";
    if (!cleanContent) {
      message.error("Please enter the page content");
      return;
    }

    setIsSubmitting(true);
    const hideLoading = message.loading(isEditing ? "Updating page..." : "Creating page...", 0);

    try {
      const payload = {
        title: values.title.trim(),
        type: values.type,
        content: content,
      };

      let response;
      if (isEditing) {
        response = await pageService.updatePage(page.id, payload);
      } else {
        response = await pageService.createPage(payload);
      }

      hideLoading();

      if (response && response.message) {
        message.success(response.message);
      } else {
        message.success(isEditing ? "Page updated successfully" : "Page created successfully");
      }

      form.resetFields();
      setContent("");
      navigate("/dashboard/pages");
    } catch (error: any) {
      hideLoading();
      console.error("Failed to save page:", error);
      message.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to save page");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Navigation & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:text-indigo-600 hover:border-indigo-600 h-10 px-4 shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Pages</span>
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 m-0">
              {isEditing ? `Edit Page: ${page.title}` : "Create New Page"}
            </h1>
            <p className="text-xs text-gray-500 m-0">
              {isEditing
                ? "Update page content, category type, and formatted text."
                : "Fill in the details below to publish a new page or legal policy."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <Card
        bordered={false}
        className="shadow-sm rounded-2xl border border-gray-200/80 bg-white overflow-hidden"
        bodyStyle={{ padding: "28px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="w-full space-y-6"
        >
          {/* Page Details Grid */}
          <Row gutter={[20, 20]}>
            <Col xs={24} md={14}>
              <Form.Item
                name="title"
                label={
                  <span className="font-semibold text-gray-700 text-sm">
                    Page Title <span className="text-red-500">*</span>
                  </span>
                }
                rules={[{ required: true, message: "Please enter the page title" }]}
              >
                <Input
                  placeholder="e.g. Privacy Policy, Terms of Service"
                  size="large"
                  className="rounded-lg h-12 text-base"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={10}>
              <Form.Item
                name="type"
                label={
                  <span className="font-semibold text-gray-700 text-sm">
                    Page Type / Slug <span className="text-red-500">*</span>
                  </span>
                }
                rules={[{ required: true, message: "Please select a page type" }]}
              >
                <Select
                  placeholder="Select or specify page type"
                  size="large"
                  className="rounded-lg h-12"
                >
                  <Select.Option value="privacy_and_policy">Privacy Policy</Select.Option>
                  <Select.Option value="terms_and_conditions">Terms & Conditions</Select.Option>
                  <Select.Option value="about">About Us</Select.Option>
                  <Select.Option value="refund_policy">Refund & Return Policy</Select.Option>
                  <Select.Option value="cookie_policy">Cookie Policy</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Rich Text Editor */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700 text-sm">
                Page Content <span className="text-red-500">*</span>
              </span>
            }
            required
            className="mb-0"
          >
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                placeholder="Write the full content of your page, policy terms, clauses, or documentation here..."
                style={{ height: "350px", marginBottom: "42px" }}
              />
            </div>
          </Form.Item>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Button
              size="large"
              onClick={handleGoBack}
              className="rounded-lg h-11 px-5 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 rounded-lg h-11 px-7 flex items-center gap-2 font-medium"
              icon={<Save size={16} />}
            >
              {isEditing ? "Update Page" : "Publish Page"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PageForm;

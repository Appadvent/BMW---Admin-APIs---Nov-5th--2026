import { useEffect } from "react";
import { Button, Form, Input, Card, message } from "antd";
import { useDispatch } from "react-redux";
import {
  createHeading,
  updateHeading,
} from "../../store/slices/productHeadingSlice";
import { useNavigate, useLocation } from "react-router-dom";

const ProductHeadingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.item || null;

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        title: editData.title,
        description: editData.description,
      });
    }
  }, [editData, form]);

  const onFinish = async (values: any) => {
    if (values.title.length > 70) {
      return message.error("Title cannot exceed 70 characters");
    }

    if (values.description.length > 300) {
      return message.error("Description cannot exceed 300 characters");
    }

    try {
      if (editData) {
        await dispatch(
          updateHeading({ id: editData.id, data: values }) as any
        );
        message.success("Updated successfully");
      } else {
        await dispatch(createHeading(values) as any);
        message.success("Created successfully");
      }

      form.resetFields();
      navigate("/dashboard/productHeading");
    } catch (err) {
      message.error("Something went wrong");
    }
  };

  return (
    <Card
      title={editData ? "Edit Product Heading" : "Add Product Heading"}
      bordered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Title */}
        <Form.Item
          name="title"
          label="Title"
        rules={[
                                { required: true, message: "Enter title" },
                                {
                                    validator: (_, value) =>
                                        value && value.length > 70
                                            ? Promise.reject("Title cannot exceed 70 characters.")
                                            : Promise.resolve(),
                                },
                            ]}
                        >
                            <Input maxLength={70} showCount />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Description"
         rules={[
                             { required: true, message: "Enter description" },
                             {
                                 validator: (_, value) =>
                                     value && value.length > 300
                                         ? Promise.reject("Description cannot exceed 300 characters.")
                                         : Promise.resolve(),
                             },
                         ]}>
                             <Input.TextArea rows={6} maxLength={300} showCount />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          {editData ? "Update" : "Create"}
        </Button>
      </Form>
    </Card>
  );
};

export default ProductHeadingForm;

import { useEffect } from "react";
import { Button, Form, Input, Card } from "antd";
import { useDispatch } from "react-redux";
import {
  createWhyChoose,
  updateWhyChoose,
} from "../../store/slices/whychooseSlice";
import { useNavigate, useLocation } from "react-router-dom";

const WhyChooseForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editData = location.state?.item || null;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Prefill form on edit
  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        heading: editData.heading,
        description: editData.description,
        items: editData.items?.map((i: any) => ({
          id: i.id,
          description: i.description,
        })) || [],
      });
    }
  }, [editData]);

  // ---------------------------
  //  SAVE HANDLER WITH ID MERGE
  // ---------------------------
  const onFinish = async (values: any) => {
    let formattedItems = [];

    if (editData) {
      formattedItems = values.items?.map((item: any, index: number) => {
        const existingItem = editData.items[index];

        return existingItem
          ? { id: existingItem.id, description: item.description } // update
          : { description: item.description }; // new
      });
    } else {
      formattedItems =
        values.items?.map((item: any) => ({
          description: item.description,
        })) || [];
    }

    const payload = {
      heading: values.heading,
      description: values.description,
      items: formattedItems,
    };

    if (editData) {
      await dispatch(updateWhyChoose({ id: editData.id, data: payload }) as any);
    } else {
      await dispatch(createWhyChoose(payload) as any);
    }

    form.resetFields();
    navigate("/dashboard/whyChooseList");
  };

  return (
    <Card title={editData ? "Edit Why Choose" : "Add Why Choose"} bordered>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Heading */}
        <Form.Item
          name="heading"
          label="Heading"
        rules={[
            { required: true, message: "Heading is required" },
            {
              validator: (_, value) =>
                value && value.length > 50
                  ? Promise.reject("Heading cannot exceed 50 characters.")
                  : Promise.resolve(),
            },
          ]}
        >
          <Input maxLength={50} showCount />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Description"
       rules={[
            { required: true, message: "Description is required" },
            {
              validator: (_, value) =>
                value && value.length > 270
                  ? Promise.reject("Description cannot exceed 300 characters.")
                  : Promise.resolve(),
            },
          ]}
        >
          <Input.TextArea rows={3} maxLength={270} showCount />

        </Form.Item>

        {/* Items List */}
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Card
                  key={key}
                  size="small"
                  style={{ marginBottom: 10 }}
                  title={`Item ${name + 1}`}
                  extra={
                    <Button danger onClick={() => remove(name)}>
                      Delete
                    </Button>
                  }
                >
                  {/* Item Description */}
                  <Form.Item
                    name={[name, "description"]}
                    label="Item Description"
                  rules={[
                      { required: true, message: "Item description required" },
                      {
                        validator: (_, value) =>
                          value && value.length > 50
                            ? Promise.reject(
                                "Item description cannot exceed 150 characters."
                              )
                            : Promise.resolve(),
                      },
                    ]}
                  >
                    <Input.TextArea maxLength={50} showCount rows={2} />
                  </Form.Item>
                </Card>
              ))}

              <Button onClick={() => add()}>Add Item</Button>
            </>
          )}
        </Form.List>

        {/* Submit */}
        <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
          {editData ? "Update" : "Create"}
        </Button>
      </Form>
    </Card>
  );
};

export default WhyChooseForm;


import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { faqService } from "../../services/api";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQSection {
  id: number;
  heading: string;
  items: FAQItem[];
  createdAt: string;
}

const FAQList: React.FC = () => {
  const navigate = useNavigate();
  const [faqList, setFaqList] = useState<FAQSection[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const res = await faqService.getAll();
      setFaqList(res.data || []);
    } catch (error) {
      console.error("Failed to load FAQs:", error);
      message.error("Failed to load FAQ sections");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await faqService.delete(id);
      message.success("FAQ section deleted successfully");
      loadFAQs();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete FAQ");
    }
  };

  const columns = [
    {
      title: "Heading",
      dataIndex: "heading",
      key: "heading",
      width: "20%",
    },
    {
      title: "Questions & Answers",
      key: "items",
      render: (_: any, record: FAQSection) => (
        <div className="space-y-3">
          {record.items?.map((item) => (
            <div
              key={item.id}
              className="p-3 border rounded-lg bg-gray-50 shadow-sm"
            >
              <p className="font-semibold text-gray-900">{item.question}</p>
              <p className="text-gray-600 mt-1">{item.answer}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: FAQSection) => (
        <div className="flex gap-3">
          <Button
            type="primary"
            onClick={() =>
              navigate("/dashboard/faq", { state: { faq: record } })
            }
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this section?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">FAQ Sections</h2>
        <Button type="primary" onClick={() => navigate("/dashboard/faq")}>
          + Add FAQ
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={faqList}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="py-4">
                  <p className="text-gray-500 font-medium text-sm">No FAQ sections configured yet</p>
                  <Button
                    type="primary"
                    size="small"
                    className="mt-2 bg-indigo-600 rounded-lg"
                    onClick={() => navigate("/dashboard/faq")}
                  >
                    + Add FAQ
                  </Button>
                </div>
              }
            />
          ),
        }}
      />
    </div>
  );
};

export default FAQList;

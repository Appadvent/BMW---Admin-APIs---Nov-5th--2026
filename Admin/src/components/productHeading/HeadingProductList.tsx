import { useEffect } from "react";
import { Table, Button, Space, message, Empty } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

import {
  fetchHeadings,
  deleteHeading,
} from "../../store/slices/productHeadingSlice";

const ProductHeadingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { headings, loading } = useSelector(
    (state: RootState) => state.productHeading
  );

  useEffect(() => {
    dispatch(fetchHeadings() as any);
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this heading?")) return;

    try {
      await dispatch(deleteHeading(id) as any);
      message.success("Deleted successfully");
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text: string) =>
        text?.length > 60 ? text.slice(0, 60) + "..." : text,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() =>
              navigate("/dashboard/productHeadingForm", {
                state: { item: record },
              })
            }
          />

          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Product Headings</h1>
         
         {headings.length === 0 && (
           <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate("/dashboard/productHeadingForm")}
        >
          Create Product Heading
        </Button>
         )}
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={headings}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="py-4">
                  <p className="text-gray-500 font-medium text-sm">No product headings configured yet</p>
                  <Button
                    type="primary"
                    icon={<Plus size={14} />}
                    size="small"
                    className="mt-2 bg-indigo-600 rounded-lg"
                    onClick={() => navigate("/dashboard/productHeadingForm")}
                  >
                    Create Product Heading
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

export default ProductHeadingList;

// import React, { useEffect } from "react";
// import { Table, Button, Space, Image, message } from "antd";
// import { Edit2, Trash2, Plus, Divide } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import { useNavigate } from "react-router-dom";

// import {
//   fetchReviews,
//   deleteReview,
// } from "../../store/slices/reviewSlice";

// const ReviewList: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { reviews, loading } = useSelector(
//     (state: RootState) => state.reviews
//   );

//   // Load all reviews on page load
//   useEffect(() => {
//     dispatch(fetchReviews() as any);
//   }, [dispatch]);

//   // Delete Review Handler
//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this review?"))
//       return;

//     try {
//       await dispatch(deleteReview(id.toString()) as any);
//       message.success("Review deleted successfully");
//     } catch (error) {
//       message.error("Failed to delete review");
//     }
//   };

//   const columns = [
//     {
//       title: "Image",
//       dataIndex: "image",
//       key: "image",
//       render: (url: string) =>
//         url ? (
//           <Image
//             src={url}
//             width={70}
//             height={70}
//             style={{ borderRadius: 8, objectFit: "cover" }}
//             preview={false}
//           />
//         ) : (
//           "No Image"
//         ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//       render: (text: string) =>
//         text?.length > 60 ? text.slice(0, 60) + "..." : text,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, review: any) => (
//         <Space>
//           <Button
//             type="text"
//             icon={<Edit2 size={16} />}
//             onClick={() =>
//               navigate("/dashboard/reviewsForm", {
//                 state: { review },
//               })
//             }
//           />

//           <Button
//             type="text"
//             danger
//             icon={<Trash2 size={16} />}
//             onClick={() => handleDelete(review.id)}
//           />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Reviews</h1>
//            <Button
//           type="primary"
//           icon={<Plus size={16} />}
//           onClick={() => navigate("/dashboard/reviewsForm")}
//         >
//           Create Review
//         </Button>
//       </div>

//       {/* Table */}
//       <Table
//         columns={columns}
//         dataSource={reviews}
//         loading={loading}
//         rowKey="id"
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
// };

// export default ReviewList;


import React, { useEffect } from "react";
import { Table, Button, Space, Image, message, Empty } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

import {
  fetchReviews,
  deleteReview,
} from "../../store/slices/reviewSlice";

const ReviewList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reviews, loading } = useSelector(
    (state: RootState) => state.reviews
  );

  useEffect(() => {
    dispatch(fetchReviews() as any);
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await dispatch(deleteReview(id.toString()) as any);
      message.success("Review deleted successfully");
    } catch {
      message.error("Failed to delete review");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            width={70}
            height={70}
            style={{ borderRadius: 8, objectFit: "cover" }}
            preview={false}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) =>
        text?.length > 60 ? text.slice(0, 60) + "..." : text,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, review: any) => (
        <Space>
          <Button
            icon={<Edit2 size={16} />}
            onClick={() =>
              navigate("/dashboard/reviewsForm", { state: { review } })
            }
          />

          <Button
            danger
            icon={<Trash2 size={16} />}
            onClick={() => handleDelete(review.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Reviews</h1>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate("/dashboard/reviewsForm")}
        >
          Create Review
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={reviews}
        loading={loading}
        rowKey="id"
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="py-4">
                  <p className="text-gray-500 font-medium text-sm">No reviews added yet</p>
                  <Button
                    type="primary"
                    icon={<Plus size={14} />}
                    size="small"
                    className="mt-2 bg-indigo-600 rounded-lg"
                    onClick={() => navigate("/dashboard/reviewsForm")}
                  >
                    Create Your First Review
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

export default ReviewList;

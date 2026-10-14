// import React, { useEffect, useState } from "react";
// import { Table, Button, Space, message } from "antd";
// import { Edit2, Trash2, Plus } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import { getPlans, deletePlan } from "../../store/slices/planSlice";
// import PlanForm from "./PlanForm";

// const PlanList: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const { plans, loading, error, success } = useSelector((state: RootState) => state.plans);

//   const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
//   const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

//   useEffect(() => {
//     dispatch(getPlans());
//   }, [dispatch, success]);

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this plan?")) return;

//     try {
//       await dispatch(deletePlan(id));
//       message.success("Plan deleted successfully");
//     } catch {
//       message.error("Failed to delete plan");
//     }
//   };

//   const columns = [
//     { title: "Name", dataIndex: "name", key: "name" },
//     { title: "Price", dataIndex: "price", key: "price", render: (_: any, record: any) => record.price ? `$${record.price} / ${record.priceType}` : "Free Plan" },
//     { title: "Button Text", dataIndex: "buttonText", key: "buttonText" },
//     { title: "Features", dataIndex: "features", key: "features", render: (features: any[]) => features?.map((f) => f.text).join(", ") },
//     { title: "Popular", dataIndex: "isPopular", key: "isPopular", render: (val: boolean) => (val ? "Yes" : "No") },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => (
//         <Space>
//           <Button icon={<Edit2 size={16} />} onClick={() => setEditingPlanId(record.id)} />
//           <Button danger icon={<Trash2 size={16} />} onClick={() => handleDelete(record.id)} />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-xl font-semibold">Plans</h1>
//         <Button type="primary" icon={<Plus size={16} />} onClick={() => setShowCreateForm(!showCreateForm)}>
//           {showCreateForm ? "Close Form" : "Create Plan"}
//         </Button>
//       </div>

//       {showCreateForm && <PlanForm onClose={() => setShowCreateForm(false)} />}
//       {editingPlanId && <PlanForm planId={editingPlanId} onClose={() => setEditingPlanId(null)} />}

//       <Table columns={columns} dataSource={Array.isArray(plans) ? plans : []} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//     </div>
//   );
// };

// export default PlanList;

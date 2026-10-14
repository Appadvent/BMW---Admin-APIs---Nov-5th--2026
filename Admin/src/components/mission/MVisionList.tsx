// import  { useEffect } from "react";
// import { Table, Button, Space, message } from "antd";
// import { Plus, Edit2, Trash2 } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import {
//   fetchMissionVision,
//   deleteMissionVision,
// } from "../../store/slices/missionSlice";
// import { useNavigate } from "react-router-dom";

// const MissionVisionList = () => {
//   const dispatch = useDispatch<any>();
//   const navigate = useNavigate();
//   const { items, loading } = useSelector((state: RootState) => state.mission);

//   useEffect(() => {
//     dispatch(fetchMissionVision());
//   }, [dispatch]);

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete?")) return;

//     try {
//       await dispatch(deleteMissionVision(id)).unwrap();
//       message.success("Deleted successfully");
//     } catch {
//       message.error("Delete failed");
//     }
//   };

//   const columns = [
//     { title: "Heading", dataIndex: "heading" },
//     { title: "Description", dataIndex: "description" },
//     {
//       title: "Items",
//       render: (record: any) =>
//         record.items.map((i: any) => (
//           <div key={i.id}>
//             <strong>{i.title}</strong> – {i.description}
//           </div>
//         )),
//     },
//     {
//       title: "Actions",
//       render: (record: any) => (
//         <Space>
//           <Button
//             icon={<Edit2 />}
//             onClick={() => navigate("/dashboard/missionForm", { state: { edit: record } })}
//           />
//           <Button danger icon={<Trash2 />} onClick={() => handleDelete(record.id)} />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-xl font-semibold">Mission & Vision</h1>
//         {items?.length === 0 && (
//            <Button type="primary" icon={<Plus />} onClick={() => navigate("/dashboard/missionForm")}>Create Mission</Button>
//         )}
//       </div>

//       <Table
//         columns={columns}
//         dataSource={items}
//         loading={loading}
//         rowKey="id"
//       />
//     </div>
//   );
// };

// export default MissionVisionList;

import { useEffect } from "react";
import { Button, Card, message, Empty } from "antd";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
    fetchMissionVision,
    deleteMissionVision,
} from "../../store/slices/missionSlice";
import { useNavigate } from "react-router-dom";

const MissionVisionList = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { items, loading } = useSelector((state: RootState) => state.mission);

    useEffect(() => {
        dispatch(fetchMissionVision());
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete?")) return;

        try {
            await dispatch(deleteMissionVision(id)).unwrap();
            message.success("Deleted successfully");
        } catch {
            message.error("Delete failed");
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Mission & Vision</h1>

                {items?.length === 0 && (
                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        onClick={() => navigate("/dashboard/missionForm")}
                    >
                        Create Mission
                    </Button>
                )}
            </div>

            {/* Card Layout */}
            <div className="flex flex-col gap-6">
                {items.map((section) => (
                    <Card
                        key={section.id}
                        loading={loading}
                        className="rounded-xl shadow-md border w-full"
                    >
                        {/* Heading */}
                        <h2 className="text-xl font-semibold mb-2">
                            {section.heading}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 mb-4">
                            {section.description}
                        </p>

                        {/* Sub Items */}
                        {section.items?.length > 0 ? (
                            <div className="space-y-3 mb-4">
                                {section.items.map((i: any) => (
                                    <div
                                        key={i.id}
                                        className="p-3 bg-gray-50 rounded-lg border"
                                    >
                                        <h4 className="font-semibold">{i.title}</h4>
                                        <p className="text-gray-600">{i.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic mb-4">
                                No mission/vision items added
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                icon={<Edit2 size={16} />}
                                onClick={() =>
                                    navigate("/dashboard/missionForm", {
                                        state: { edit: section },
                                    })
                                }
                            >
                                Edit
                            </Button>

                            <Button
                                danger
                                icon={<Trash2 size={16} />}
                                onClick={() => handleDelete(section.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}

                {/* No Data */}
                {!loading && items.length === 0 && (
                    <Card className="rounded-2xl text-center py-12 shadow-sm border border-gray-200">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className="py-4 space-y-2">
                                    <p className="text-gray-500 font-medium text-sm">No Mission & Vision sections found</p>
                                    <Button
                                        type="primary"
                                        icon={<Plus size={15} />}
                                        className="mt-2 bg-indigo-600 rounded-lg"
                                        onClick={() => navigate("/dashboard/missionForm")}
                                    >
                                        Create Mission & Vision
                                    </Button>
                                </div>
                            }
                        />
                    </Card>
                )}
            </div>
        </div>
    );
};

export default MissionVisionList;

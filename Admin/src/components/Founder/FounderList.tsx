import React, { useEffect } from "react";
import { Button, message, Image } from "antd";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchFounders, deleteFounder } from "../../store/slices/founderSlice";

const FounderList: React.FC = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { founders, loading } = useSelector((state: RootState) => state.founders);

    useEffect(() => {
        dispatch(fetchFounders());
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure to delete this founder?")) return;
        try {
            await dispatch(deleteFounder(id)).unwrap();
            message.success("Founder deleted");
        } catch (err) {
            message.error("Failed to delete");
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow mt-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Founders</h1>
                {founders.length === 0 && (
                    <Button type="primary" icon={<Plus />} onClick={() => navigate("/dashboard/founderForm")}>
                    Create Founder
                </Button>
                )}
            </div>

            {loading ? (
                <p className="text-center py-6">Loading...</p>
            ) : founders.length === 0 ? (
                <p className="text-center py-6">No founders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left font-semibold">Image</th>
                                <th className="p-3 text-left font-semibold">Name</th>
                                <th className="p-3 text-left font-semibold">Title</th>
                                <th className="p-3 text-left font-semibold">Description</th>
                                <th className="p-3 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {founders.map((f) => (
                                <tr key={f.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        {f.image ? (
                                            <Image src={f.image} width={70} height={70} preview={false} />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td className="p-3">{f.name}</td>
                                    <td className="p-3">{f.title}</td>
                                    <td className="p-3">{f.description?.length > 80 ? f.description.slice(0, 80) + "..." : f.description}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                icon={<Edit2 size={16} />}
                                                onClick={() =>
                                                    navigate("/dashboard/founderForm", { state: { founder: f } })
                                                }
                                            />
                                            <Button icon={<Trash2 size={16} />} danger onClick={() => handleDelete(f.id)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FounderList;

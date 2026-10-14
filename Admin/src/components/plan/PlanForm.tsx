// import React, { useEffect, useState } from "react";
// import { Button, message } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { RootState } from "../../store/store";
// import { createPlan, updatePlan, clearStatus, getPlanById } from "../../store/slices/planSlice";

// interface PlanFormProps {
//   planId?: number;
//   onClose?: () => void;
// }

// const PlanForm: React.FC<PlanFormProps> = ({ planId, onClose }) => {
//   const dispatch = useDispatch<any>();
//   const navigate = useNavigate();

//   const { selectedPlan, loading, success, error } = useSelector((state: RootState) => state.plans);

//   const [formData, setFormData] = useState({
//     name: "",
//     price: 0,
//     priceType: "monthly",
//     isPopular: false,
//     buttonText: "Choose Plan",
//     features: [] as string[],
//   });

//   const [featureInput, setFeatureInput] = useState("");

//   // Fetch plan for editing
//   useEffect(() => {
//     if (planId) dispatch(getPlanById(planId));
//   }, [planId, dispatch]);

//   // Populate form when selectedPlan changes
//   useEffect(() => {
//     if (selectedPlan && planId) {
//       setFormData({
//         name: selectedPlan.name,
//         price: selectedPlan.price || 0,
//         priceType: selectedPlan.priceType,
//         isPopular: selectedPlan.isPopular,
//         buttonText: selectedPlan.buttonText,
//         features: selectedPlan.features?.map((f: any) => f.text) || [],
//       });
//     }
//   }, [selectedPlan, planId]);

//   // Handle success
//   useEffect(() => {
//     if (success) {
//       message.success(planId ? "Plan updated successfully" : "Plan created successfully");
//       dispatch(clearStatus());
//       onClose ? onClose() : navigate("/dashboard/planList");
//     }
//   }, [success, dispatch, navigate, onClose, planId]);

//   // Form handlers
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const target = e.target as HTMLInputElement;
//     const { name, value, type, checked } = target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : name === "price" ? Number(value) : value,
//     }));
//   };

//   const handleAddFeature = () => {
//     if (featureInput.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         features: [...prev.features, featureInput.trim()],
//       }));
//       setFeatureInput("");
//     }
//   };

//   const handleRemoveFeature = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const payload = { ...formData, features: formData.features.map((text) => ({ text })) };
//     planId ? dispatch(updatePlan({ id: planId, data: payload })) : dispatch(createPlan(payload));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-md w-full mb-4">
//       <h2 className="text-xl font-bold mb-4">{planId ? "Update Plan" : "Create Plan"}</h2>

//       {error && <p className="text-red-500 mb-2">{error?.message || error}</p>}

//       <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border px-2 py-1 rounded mb-2" required />
//       <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border px-2 py-1 rounded mb-2" />
//       <select name="priceType" value={formData.priceType} onChange={handleChange} className="w-full border px-2 py-1 rounded mb-2">
//         <option value="monthly">Monthly</option>
//         <option value="yearly">Yearly</option>
//       </select>
//       <div className="mb-2">
//         <label className="mr-2"><input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleChange} /> Popular</label>
//       </div>
//       <input type="text" name="buttonText" value={formData.buttonText} onChange={handleChange} placeholder="Button Text" className="w-full border px-2 py-1 rounded mb-2" />

//       {/* Features */}
//       <div className="mb-2">
//         <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add feature" className="border px-2 py-1 rounded mr-2" />
//         <button type="button" onClick={handleAddFeature} className="bg-green-500 text-white px-2 rounded">Add</button>
//         <ul className="list-disc ml-5 mt-2">
//           {formData.features.map((f, i) => (
//             <li key={i} className="flex justify-between items-center">
//               {f} <button type="button" onClick={() => handleRemoveFeature(i)} className="text-red-500 ml-2">Remove</button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//         {planId ? "Update Plan" : "Create Plan"}
//       </button>
//     </form>
//   );
// };

// export default PlanForm;

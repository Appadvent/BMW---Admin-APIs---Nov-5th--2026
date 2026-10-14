import { useState } from "react";
import { Button, Input, message } from "antd";
import { Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  createMissionVision,
  updateMissionVision,
} from "../../store/slices/missionSlice";
import { useLocation, useNavigate } from "react-router-dom";

interface MissionVisionItem {
  title: string;
  description: string;
}

interface EditMissionVision {
  id: number;
  heading: string;
  description: string;
  items: MissionVisionItem[];
}

const MissionVisionForm: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const editData = state?.edit as EditMissionVision | undefined;

  const [heading, setHeading] = useState<string>(editData?.heading || "");
  const [description, setDescription] = useState<string>(
    editData?.description || ""
  );

  const [items, setItems] = useState<MissionVisionItem[]>(
    editData?.items || [{ title: "", description: "" }]
  );

  // Add new item
  const addItem = () => {
    setItems([...items, { title: "", description: "" }]);
  };

  // Update specific item
  const updateItem = (
    index: number,
    key: keyof MissionVisionItem,
    value: string
  ) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  // Remove item
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Submit handler
//   const handleSubmit = async () => {
//     if (!heading.trim()) return message.error("Heading is required.");
//     if (!description.trim()) return message.error("Description is required.");

//     const payload = { heading, description, items };

//     try {
//       if (editData) {
//         await dispatch(
//           updateMissionVision({ id: editData.id, data: payload })
//         );
//         message.success("Updated Successfully");
//       } else {
//         await dispatch(createMissionVision(payload));
//         message.success("Created Successfully");
//       }

//       navigate("/dashboard/mission");
//     } catch {
//       message.error("Something went wrong.");
//     }
//   };
// Submit handler
const handleSubmit = async () => {
  if (!heading.trim()) return message.error("Heading is required.");

  if (!description.trim()) return message.error("Description is required.");
   if (heading.length > 60) {
      return message.error("Heading cannot exceed 100 characters.");
    }
  //  Character limit validation
  if (description.length > 250) {
    return message.error("Description cannot exceed 400 characters.");
  }

  // Validate each item description
  for (const item of items) {
    if (item.title.length > 60) {
        return message.error("Item title cannot exceed 80 characters.");
      }
    if (item.description.length > 300) {
      return message.error("Item description cannot exceed 300 characters.");
    }
  }

  const payload = { heading, description, items };

  try {
    if (editData) {
      await dispatch(updateMissionVision({ id: editData.id, data: payload }));
      message.success("Updated Successfully");
    } else {
      await dispatch(createMissionVision(payload));
      message.success("Created Successfully");
    }

    navigate("/dashboard/mission");
  } catch {
    message.error("Something went wrong.");
  }
};

  return (
    <div className="max-w-5xl mx-auto bg-white p-4 rounded shadow mt-1">
      <h2 className="text-xl font-semibold mb-4">
        {editData ? "Edit Mission & Vision" : "Create Mission & Vision"}
      </h2>

      <label className="font-medium">Heading</label>
      <Input
        value={heading}
        maxLength={60}
        onChange={(e) => setHeading(e.target.value)}
        className="mb-3"      
      />
      <p className="text-right text-xs text-gray-500 mb-3">
      {heading.length}/60
    </p>

      <label className="font-medium">Description</label>
      <Input.TextArea
        rows={4}
        maxLength={250} 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />
      <p className="text-right text-xs text-gray-500 mb-4">
      {description.length}/250
    </p>

      <h3 className="font-semibold mb-2">Items</h3>

      {items.map((item, index) => (
        <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
          <label className="font-medium">Title</label>
          <Input
            value={item.title}
            maxLength={60}
            onChange={(e) => updateItem(index, "title", e.target.value)}
            className="mb-2"
          />
           <p className="text-right text-xs text-gray-500 mb-2">
          {item.title.length}/60
        </p>

          <label className="font-medium">Description</label>
          <Input.TextArea
            rows={2}
            maxLength={300} 
            value={item.description}
            onChange={(e) => updateItem(index, "description", e.target.value)}
          />
          <p className="text-right text-xs text-gray-500">
          {item.description.length}/300
        </p>

          {items.length > 1 && (
            <Button
              danger
              icon={<Trash2 size={16} />}
              onClick={() => removeItem(index)}
              className="mt-3"
            >
              Remove Item
            </Button>
          )}
        </div>
      ))}

      <Button icon={<Plus size={16} />} onClick={addItem}>
        Add Item
      </Button>

      <br />

      <Button type="primary" className="mt-4" onClick={handleSubmit}>
        {editData ? "Update" : "Create"}
      </Button>
    </div>
  );
};

export default MissionVisionForm;

import React, { useEffect, useState } from "react";
import { Button, message, Upload } from "antd";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { reviewService } from "../../services/api";

const ReviewForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const review = location.state?.review; // receiving edit data

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Prefill data when editing
  useEffect(() => {
    if (review) {
      setName(review.name);
      setTitle(review.title);
      setDescription(review.description);

      if (review.image) {
        setFileList([
          {
            uid: "-1",
            name: review.image.split("/").pop(),
            status: "done",
            url: review.image,
          },
        ]);
      }
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (name.length > 50) {
      setLoading(false);
      return message.error("Name cannot exceed 50 characters.");
    }
    if (title.length > 70) {
      setLoading(false);
      return message.error("Title cannot exceed 70 characters.");
    }
    if (description.length > 300) {
      setLoading(false);
      return message.error("Description cannot exceed 250 characters.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("description", description);

    if (fileList[0]?.originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    try {
      if (review) {
        await reviewService.updateReview(review.id, formData);
        message.success("Review updated successfully");
      } else {
        await reviewService.createReview(formData);
        message.success("Review created successfully");
      }

      navigate("/dashboard/reviews");
    } catch (error) {
      console.error("Save failed:", error);
      message.error("Failed to save review");
    }

    setLoading(false);
  };

  return (
    <>
      <Button
        className="mb-4"
        onClick={() => navigate("/dashboard/reviews")}
        icon={<ArrowLeft size={16} />}
      >
        Go Back
      </Button>

      <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {review ? "Update Review" : "Create Review"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className="font-semibold block mb-1">Name</label>
            <input
              type="text"
              className="border p-3 rounded-lg w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
             <p className="text-gray-500 text-sm">{name.length}/50</p>
          </div>

          {/* Title */}
          <div>
            <label className="font-semibold block mb-1">Title</label>
            <input
              type="text"
              className="border p-3 rounded-lg w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
             <p className="text-gray-500 text-sm">{title.length}/70</p>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold block mb-1">Description</label>
            <textarea
              className="border p-3 rounded-lg w-full h-28"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <p className="text-gray-500 text-sm">{description.length}/300</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-semibold block mb-1">Image</label>
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadCloud size={16} />}>
                {fileList.length > 0 ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : review ? "Update Review" : "Create Review"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ReviewForm;

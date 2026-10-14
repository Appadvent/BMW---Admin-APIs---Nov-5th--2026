import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { faqService } from "../../services/api";

interface FAQItem {
  id?: number;
  question: string;
  answer: string;
}

interface FAQSection {
  id?: number;
  heading: string;
  items: FAQItem[];
}

const FAQForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const faq: FAQSection | undefined = location.state?.faq;

  const [heading, setHeading] = useState("");
  const [items, setItems] = useState<FAQItem[]>([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faq) {
      setHeading(faq.heading);
      setItems(faq.items);
    }
  }, [faq]);

  const addItem = () => {
    setItems([...items, { question: "", answer: "" }]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index: number, key: keyof FAQItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    setItems(updated);
  };

  const validateForm = () => {
    if (heading.length < 3) return "Heading must have at least 3 characters";
    if (heading.length > 100) return "Heading cannot exceed 100 characters";

    for (const item of items) {
      if (!item.question.trim()) return "All questions are required";
      if (!item.answer.trim()) return "All answers are required";

      if (item.question.length > 150)
        return "Question cannot exceed 150 characters";

      if (item.answer.length > 300)
        return "Answer cannot exceed 300 characters";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) return message.error(errorMessage);

    setLoading(true);

    const payload: FAQSection = {
      heading,
      items,
    };

    try {
      if (faq?.id) {
        await faqService.update(faq.id, payload);
        message.success("FAQ updated successfully");
      } else {
        await faqService.create(payload);
        message.success("FAQ created successfully");
      }

      navigate("/dashboard/faqList");
    } catch (error) {
      console.error(error);
      message.error("Failed to save FAQ");
    }

    setLoading(false);
  };

  return (
    <>
      <Button
        className="mb-4"
        onClick={() => navigate("/dashboard/faq")}
        icon={<ArrowLeft size={16} />}
      >
        Go Back
      </Button>

      <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {faq ? "Update FAQ Section" : "Create FAQ Section"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold block mb-1">Section Heading</label>
            <input
              type="text"
              className="border p-3 rounded-lg w-full"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
            />
            <p className="text-gray-500 text-sm">{heading.length}/100</p>
          </div>

          <div>
            <label className="font-semibold block mb-3 text-lg">FAQ Items</label>

            {items.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 bg-gray-50 space-y-3"
              >
                <div>
                  <label className="font-semibold block mb-1">Question</label>
                  <input
                    type="text"
                    className="border p-3 rounded-lg w-full"
                    value={item.question}
                    onChange={(e) =>
                      updateItem(index, "question", e.target.value)
                    }
                    required
                  />
                  <p className="text-gray-500 text-sm">
                    {item.question.length}/150
                  </p>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Answer</label>
                  <textarea
                    className="border p-3 rounded-lg w-full h-28"
                    value={item.answer}
                    onChange={(e) =>
                      updateItem(index, "answer", e.target.value)
                    }
                    required
                  />
                  <p className="text-gray-500 text-sm">
                    {item.answer.length}/300
                  </p>
                </div>

                {items.length > 1 && (
                  <Button danger onClick={() => removeItem(index)}>
                    Remove Item
                  </Button>
                )}
              </div>
            ))}

            <Button type="dashed" onClick={addItem} className="w-full py-2">
              + Add FAQ Item
            </Button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : faq ? "Update FAQ" : "Create FAQ"}
          </button>
        </form>
      </div>
    </>
  );
};

export default FAQForm;

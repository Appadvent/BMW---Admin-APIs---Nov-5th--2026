import React, { useEffect, useState, useMemo } from "react";
import {
  Input,
  Button,
  Form,
  message,
  Upload,
  Card,
  Tooltip,
  Row,
  Col,
  Spin,
  Select,
} from "antd";
import {
  ArrowLeft,
  UploadCloud,
  Save,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  FolderTree,
  Sliders,
  Plus,
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../../store/slices/productSlice";
import { uploadService, categoryService, subcategoryService, productService } from "../../services/api";

const TITLE_LIMIT = 100;
const DESCRIPTION_LIMIT = 500;

interface SpecificationRow {
  id?: number;
  name: string;
  value: string;
  order: number;
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const product = location.state?.product;
  const isEditing = !!product;

  const [form] = Form.useForm();
  const descriptionValue = Form.useWatch("description", form);
  const selectedCategoryId = Form.useWatch("categoryId", form);
  const cleanDescLength = descriptionValue
    ? descriptionValue.replace(/<(.|\n)*?>/g, "").trim().length
    : 0;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [specifications, setSpecifications] = useState<SpecificationRow[]>([]);

  // Fetch available categories
  useEffect(() => {
    const fetchCats = async () => {
      setLoadingCategories(true);
      try {
        const response = await categoryService.getCategories();
        if (response?.data && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

  // Filter product categories (excluding blog-only categories like CERTIFICATION, AWARD, etc.)
  const productCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.filter((cat: any) => {
      const isBlogOnly =
        ["CERTIFICATION", "PRODUCT LAUNCH", "AWARD", "BUSINESS"].includes(
          cat.name?.toUpperCase()?.trim()
        ) ||
        ((cat._count?.blogs ?? 0) > 0 &&
          (cat._count?.products ?? 0) === 0 &&
          (!cat.subcategories || cat.subcategories.length === 0));
      return !isBlogOnly;
    });
  }, [categories]);

  // Fetch subcategories when selected category changes
  useEffect(() => {
    if (selectedCategoryId) {
      setLoadingSubcategories(true);
      subcategoryService
        .getSubcategories({ categoryId: Number(selectedCategoryId) })
        .then((res) => {
          const list = res?.data && Array.isArray(res.data) ? res.data : [];
          setSubcategories(list);
          const currentSubId = form.getFieldValue("subcategoryId");
          if (currentSubId && !list.some((sc: any) => sc.id === Number(currentSubId))) {
            form.setFieldValue("subcategoryId", null);
          }
        })
        .catch((err) => {
          console.error("Failed to load subcategories:", err);
          setSubcategories([]);
        })
        .finally(() => {
          setLoadingSubcategories(false);
        });
    } else {
      setSubcategories([]);
      form.setFieldValue("subcategoryId", null);
    }
  }, [selectedCategoryId, form]);

  // Load existing data and fetch full product details on edit
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        image: product.image,
        brochure: product.brochure,
        tag: product.tag || null,
        oemNumber: product.oemNumber || null,
        make: product.make || null,
        model: product.model || null,
        yearRange: product.yearRange || null,
        position: product.position || null,
        condition: product.condition || null,
        price: product.price ?? null,
        finish: product.finish || null,
        price: product.price ?? null,
        finish: product.finish || null,
        categoryId: product.categoryId || (product.category?.id ?? null),
        subcategoryId: product.subcategoryId || (product.subcategory?.id ?? null),
      });

      if (product.image) {
        setImageUrl(product.image);
      }
      if (product.brochure) {
        setBrochureUrl(product.brochure);
      }

      if (product.specifications && Array.isArray(product.specifications)) {
        setSpecifications(
          product.specifications.map((s: any, idx: number) => ({
            id: s.id,
            name: s.name || "",
            value: s.value || "",
            order: typeof s.order === "number" ? s.order : idx,
          }))
        );
      }

      // Fetch fresh details by ID to get full specifications if needed
      if (product.id) {
        productService
          .getProductById(product.id.toString())
          .then((res: any) => {
            const prodData = res?.data || res;
            if (prodData?.specifications && Array.isArray(prodData.specifications)) {
              setSpecifications(
                prodData.specifications.map((s: any, idx: number) => ({
                  id: s.id,
                  name: s.name || "",
                  value: s.value || "",
                  order: typeof s.order === "number" ? s.order : idx,
                }))
              );
            }
          })
          .catch(() => {});
      }
    }
  }, [product, form]);

  const handleGoBack = () => navigate("/dashboard/products");

  // Specifications management helpers
  const handleAddSpecification = () => {
    setSpecifications((prev) => [
      ...prev,
      { name: "", value: "", order: prev.length },
    ]);
  };

  const handleUpdateSpecification = (
    index: number,
    field: "name" | "value",
    val: string
  ) => {
    setSpecifications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleDeleteSpecification = (index: number) => {
    setSpecifications((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((item, idx) => ({ ...item, order: idx }));
    });
  };

  const handleMoveSpecification = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === specifications.length - 1)
    ) {
      return;
    }

    setSpecifications((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next.map((item, idx) => ({ ...item, order: idx }));
    });
  };

  // Handle immediate MinIO image upload on file selection
  const handleCustomUpload = async ({ file, onSuccess, onError }: any) => {
    setUploadingImage(true);
    const hide = message.loading("Uploading image to storage...", 0);
    try {
      const response = await uploadService.uploadFile(file as File, "products");
      const uploadedUrl = response?.data?.url;

      if (!uploadedUrl) {
        throw new Error("Failed to retrieve uploaded image URL");
      }

      // If replacing an existing new upload, optionally delete previous from storage
      if (imageUrl && imageUrl !== product?.image) {
        try {
          await uploadService.deleteFile(imageUrl);
        } catch {}
      }

      setImageUrl(uploadedUrl);
      form.setFieldValue("image", uploadedUrl);
      message.success("Image uploaded successfully");
      if (onSuccess) onSuccess("ok");
    } catch (error: any) {
      console.error("Upload error:", error);
      message.error(error?.response?.data?.message || error?.message || "Failed to upload image");
      if (onError) onError(error);
    } finally {
      hide();
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imageUrl) return;
    const hide = message.loading("Removing image...", 0);
    try {
      if (imageUrl !== product?.image) {
        await uploadService.deleteFile(imageUrl);
      }
      setImageUrl(null);
      form.setFieldValue("image", null);
      message.success("Image removed");
    } catch (err: any) {
      setImageUrl(null);
      form.setFieldValue("image", null);
    } finally {
      hide();
    }
  };

  const handleBrochureUpload = async ({ file, onSuccess, onError }: any) => {
    setUploadingBrochure(true);
    const hide = message.loading("Uploading brochure...", 0);
    try {
      const response = await uploadService.uploadFile(file as File, "products");
      const uploadedUrl = response?.data?.url;

      if (!uploadedUrl) {
        throw new Error("Failed to retrieve uploaded brochure URL");
      }

      if (brochureUrl && brochureUrl !== product?.brochure) {
        try {
          await uploadService.deleteFile(brochureUrl);
        } catch {}
      }

      setBrochureUrl(uploadedUrl);
      form.setFieldValue("brochure", uploadedUrl);
      message.success("Brochure uploaded successfully");
      if (onSuccess) onSuccess("ok");
    } catch (error: any) {
      console.error("Upload error:", error);
      message.error(error?.response?.data?.message || error?.message || "Failed to upload brochure");
      if (onError) onError(error);
    } finally {
      hide();
      setUploadingBrochure(false);
    }
  };

  const handleRemoveBrochure = async () => {
    if (!brochureUrl) return;
    const hide = message.loading("Removing brochure...", 0);
    try {
      if (brochureUrl !== product?.brochure) {
        await uploadService.deleteFile(brochureUrl);
      }
      setBrochureUrl(null);
      form.setFieldValue("brochure", null);
      message.success("Brochure removed");
    } catch (err: any) {
      setBrochureUrl(null);
      form.setFieldValue("brochure", null);
    } finally {
      hide();
    }
  };

  const handleSubmit = async (values: any) => {
    const finalImage = imageUrl || form.getFieldValue("image") || undefined;

    if (!finalImage) {
      message.error("Please upload a product image");
      return;
    }

    const cleanDesc = (values.description || "").replace(/<(.|\n)*?>/g, "").trim();
    if (cleanDesc.length > DESCRIPTION_LIMIT) {
      message.error(`Product description cannot exceed ${DESCRIPTION_LIMIT} characters.`);
      return;
    }

    // Filter out completely blank specification rows
    const cleanSpecifications = specifications
      .filter((s) => s.name.trim() !== "" || s.value.trim() !== "")
      .map((s, idx) => ({
        id: s.id,
        name: s.name.trim(),
        value: s.value.trim(),
        order: idx,
      }));

    setIsSubmitting(true);
    const hide = message.loading(isEditing ? "Updating product..." : "Creating product...", 0);

    try {
      const payload = {
        title: values.title.trim(),
        description: values.description || "",
        image: finalImage,
        brochure: brochureUrl || form.getFieldValue("brochure") || undefined,
        tag: values.tag ? String(values.tag).trim() : null,
        oemNumber: values.oemNumber ? String(values.oemNumber).trim() : null,
        make: values.make ? String(values.make).trim() : null,
        model: values.model ? String(values.model).trim() : null,
        yearRange: values.yearRange ? String(values.yearRange).trim() : null,
        position: values.position ? String(values.position).trim() : null,
        condition: values.condition ? String(values.condition).trim() : null,
        price: values.price !== undefined && values.price !== null && values.price !== "" ? Number(values.price) : null,
        finish: values.finish ? String(values.finish).trim() : null,
        categoryId: values.categoryId ? Number(values.categoryId) : null,
        subcategoryId: product?.subcategoryId || null,
        specifications: cleanSpecifications,
      };

      if (isEditing) {
        await dispatch(
          updateProduct({ id: product.id.toString(), product: payload })
        ).unwrap();
        message.success("Product updated successfully");
      } else {
        await dispatch(createProduct(payload)).unwrap();
        message.success("Product created successfully");
      }

      form.resetFields();
      setImageUrl(null);
      setBrochureUrl(null);
      setSpecifications([]);
      navigate("/dashboard/products");
    } catch (error: any) {
      message.error(error || "Failed to save product");
    } finally {
      hide();
      setIsSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "clean"],
    ],
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Custom Styles for large Quill Editor */}
      <style>{`
        .product-quill .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-color: #e2e8f0;
          background: #f8fafc;
        }
        .product-quill .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: #e2e8f0;
          font-family: inherit;
        }
        .product-quill .ql-editor {
          min-height: 320px;
          font-size: 15px;
          line-height: 1.65;
          color: #334155;
          padding: 16px;
        }
        .product-quill .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
          left: 16px;
        }
      `}</style>

      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
        <div className="flex items-center gap-4">
          <Tooltip title="Back to Products List">
            <Button
              onClick={handleGoBack}
              icon={<ArrowLeft size={18} />}
              className="flex items-center justify-center rounded-xl border-gray-300 hover:border-indigo-600 hover:text-indigo-600 shadow-sm h-11 px-4"
            >
              Back
            </Button>
          </Tooltip>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0">
              {isEditing ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 mb-0">
              {isEditing
                ? `Updating product ID #${product.id}`
                : "Fill in the required information to publish a new product in your catalog."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="w-full"
      >
        <Row gutter={[24, 24]}>
          {/* Left Column: Title & Big Description Box */}
          <Col xs={24} xl={16}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center gap-2 py-1">
                  <Sparkles size={18} className="text-indigo-600" />
                  <span className="font-semibold text-gray-800 text-base">Product Information</span>
                </div>
              }
            >
              {/* Title */}
              <Form.Item
                name="title"
                label={
                  <span className="font-semibold text-gray-700 text-sm">
                    Product Title <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter product title" },
                  {
                    max: TITLE_LIMIT,
                    message: `Title cannot exceed ${TITLE_LIMIT} characters.`,
                  },
                ]}
                className="mb-6"
              >
                <Input
                  placeholder="e.g. BMW G20 Front Bumper Complete Assembly"
                  size="large"
                  maxLength={TITLE_LIMIT}
                  showCount
                  className="rounded-lg text-base h-12"
                />
              </Form.Item>

              {/* Automotive Fitment & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <Form.Item name="oemNumber" label={<span className="font-semibold text-gray-700 text-sm">OEM Part Number</span>} className="mb-2">
                  <Input placeholder="e.g. 51117292959" size="large" className="rounded-lg h-11" />
                </Form.Item>
                <Form.Item name="make" label={<span className="font-semibold text-gray-700 text-sm">Make / Brand</span>} className="mb-2">
                  <Select
                    placeholder="Select Brand"
                    allowClear
                    size="large"
                    className="rounded-lg h-11 w-full"
                    options={[
                      { value: "BMW", label: "BMW" },
                      { value: "MERCEDES-BENZ", label: "MERCEDES-BENZ" },
                      { value: "AUDI", label: "AUDI" },
                      { value: "RANGE ROVER", label: "RANGE ROVER" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="model" label={<span className="font-semibold text-gray-700 text-sm">Model / Chassis</span>} className="mb-2">
                  <Input placeholder="e.g. F20, G20, W205, E90" size="large" className="rounded-lg h-11" />
                </Form.Item>
                <Form.Item name="yearRange" label={<span className="font-semibold text-gray-700 text-sm">Model Year(s)</span>} className="mb-2">
                  <Input placeholder="e.g. 2012-2016" size="large" className="rounded-lg h-11" />
                </Form.Item>
                <Form.Item name="position" label={<span className="font-semibold text-gray-700 text-sm">Position</span>} className="mb-2">
                  <Select
                    placeholder="Select Position"
                    allowClear
                    size="large"
                    className="rounded-lg h-11 w-full"
                    options={[
                      { value: "Front", label: "Front" },
                      { value: "Rear", label: "Rear" },
                      { value: "Front Left", label: "Front Left" },
                      { value: "Front Right", label: "Front Right" },
                      { value: "Rear Left", label: "Rear Left" },
                      { value: "Rear Right", label: "Rear Right" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="condition" label={<span className="font-semibold text-gray-700 text-sm">Condition</span>} className="mb-2">
                  <Select
                    placeholder="Select Condition"
                    allowClear
                    size="large"
                    className="rounded-lg h-11 w-full"
                    options={[
                      { value: "OEM Replacement", label: "OEM Replacement" },
                      { value: "OEM Shell / Primed", label: "OEM Shell / Primed" },
                      { value: "Complete Assembly", label: "Complete Assembly" },
                      { value: "Brand New Replacement", label: "Brand New Replacement" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="finish" label={<span className="font-semibold text-gray-700 text-sm">Finish / Surface</span>} className="mb-2">
                  <Select
                    placeholder="Select Finish"
                    allowClear
                    size="large"
                    className="rounded-lg h-11 w-full"
                    options={[
                      { value: "To be painted", label: "To be painted" },
                      { value: "Primed", label: "Primed" },
                      { value: "Gloss Black", label: "Gloss Black" },
                      { value: "Matte Black", label: "Matte Black" },
                      { value: "Chrome", label: "Chrome" },
                      { value: "Carbon Fiber Look", label: "Carbon Fiber Look" },
                      { value: "Textured", label: "Textured" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="price" label={<span className="font-semibold text-gray-700 text-sm">Price (€)</span>} className="mb-2">
                  <Input type="number" step="0.01" min="0" placeholder="e.g. 1250.00 (leave blank for Inquire)" size="large" className="rounded-lg h-11" />
                </Form.Item>
              </div>

              {/* Big Rich Text Description */}
              <Form.Item
                name="description"
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-gray-700 text-sm">
                      Product Description <span className="text-red-500">*</span>
                    </span>
                    <span
                      className={`text-xs ${
                        cleanDescLength > DESCRIPTION_LIMIT
                          ? "text-red-500 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {cleanDescLength} / {DESCRIPTION_LIMIT}
                    </span>
                  </div>
                }
                rules={[
                  {
                    validator: (_, value) => {
                      const cleanText = value ? value.replace(/<(.|\n)*?>/g, "").trim() : "";
                      if (!cleanText) {
                        return Promise.reject(new Error("Please enter product description"));
                      }
                      if (cleanText.length > DESCRIPTION_LIMIT) {
                        return Promise.reject(
                          new Error(
                            `Description cannot exceed ${DESCRIPTION_LIMIT} characters (currently ${cleanText.length} characters).`
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                className="mb-2"
              >
                <ReactQuill
                  className="product-quill"
                  modules={quillModules}
                  placeholder="Write a concise description of the product, its specifications, key advantages, and applications..."
                />
              </Form.Item>
            </Card>

            {/* Technical Specifications Card */}
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white mt-6"
              title={
                <div className="flex items-center justify-between w-full py-1">
                  <div className="flex items-center gap-2">
                    <Sliders size={18} className="text-indigo-600" />
                    <div>
                      <span className="font-semibold text-gray-800 text-base">
                        Technical Specifications
                      </span>
                      <span className="text-xs text-gray-400 font-normal ml-2">
                        ({specifications.length} items)
                      </span>
                    </div>
                  </div>
                  <Button
                    type="dashed"
                    onClick={handleAddSpecification}
                    icon={<Plus size={16} />}
                    className="flex items-center gap-1.5 text-indigo-600 border-indigo-300 hover:border-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 font-medium rounded-lg h-9"
                  >
                    Add Row
                  </Button>
                </div>
              }
            >
              {specifications.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/40">
                  <Sliders size={36} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    No specifications added yet
                  </p>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                    Add key parameters like Material, Dimensions, Finish, Warranty, Operating Voltage, Load Capacity, etc.
                  </p>
                  <Button
                    type="primary"
                    ghost
                    onClick={handleAddSpecification}
                    icon={<Plus size={16} />}
                    className="rounded-lg border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                  >
                    Add First Specification
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-5">Specification Name</div>
                    <div className="col-span-5">Value / Detail</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>

                  {specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-center bg-gray-50/70 p-2.5 rounded-xl border border-gray-200/70 hover:border-indigo-200 transition-colors"
                    >
                      <div className="col-span-5">
                        <Input
                          placeholder="e.g. Material, Dimensions, Finish"
                          value={spec.name}
                          onChange={(e) =>
                            handleUpdateSpecification(index, "name", e.target.value)
                          }
                          className="rounded-lg h-10 bg-white"
                        />
                      </div>
                      <div className="col-span-5">
                        <Input
                          placeholder="e.g. Stainless Steel 304, 150 x 50 mm"
                          value={spec.value}
                          onChange={(e) =>
                            handleUpdateSpecification(index, "value", e.target.value)
                          }
                          className="rounded-lg h-10 bg-white"
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-center gap-1">
                        <Tooltip title="Move Up">
                          <Button
                            type="text"
                            size="small"
                            disabled={index === 0}
                            onClick={() => handleMoveSpecification(index, "up")}
                            icon={<ChevronUp size={16} />}
                            className="text-gray-500 hover:text-indigo-600 disabled:text-gray-300 h-8 w-8 p-0 flex items-center justify-center"
                          />
                        </Tooltip>
                        <Tooltip title="Move Down">
                          <Button
                            type="text"
                            size="small"
                            disabled={index === specifications.length - 1}
                            onClick={() => handleMoveSpecification(index, "down")}
                            icon={<ChevronDown size={16} />}
                            className="text-gray-500 hover:text-indigo-600 disabled:text-gray-300 h-8 w-8 p-0 flex items-center justify-center"
                          />
                        </Tooltip>
                        <Tooltip title="Delete Row">
                          <Button
                            danger
                            type="text"
                            size="small"
                            onClick={() => handleDeleteSpecification(index)}
                            icon={<Trash2 size={16} />}
                            className="text-red-500 hover:bg-red-50 h-8 w-8 p-0 flex items-center justify-center"
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Right Column: Organization, Featured Image & Actions */}
          <Col xs={24} xl={8}>
            <div className="space-y-6">
              {/* Category & Tag Organization Card */}
              <Card
                bordered={false}
                className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
                title={
                  <div className="flex items-center gap-2 py-1">
                    <FolderTree size={18} className="text-indigo-600" />
                    <span className="font-semibold text-gray-800 text-base">Organization & Tag</span>
                  </div>
                }
              >
                <Form.Item
                  name="categoryId"
                  label={
                    <span className="font-semibold text-gray-700 text-sm">
                      Select Category
                    </span>
                  }
                  className="mb-4"
                >
                  <Select
                    placeholder="Choose a product category"
                    allowClear
                    size="large"
                    loading={loadingCategories}
                    className="rounded-lg h-11 w-full"
                    options={productCategories.map((cat: any) => ({
                      value: cat.id,
                      label: (
                        <div className="flex items-center gap-2">
                          <span>{cat.name}</span>
                        </div>
                      ),
                    }))}
                  />
                </Form.Item>

                {/* Subcategory field cleanly disabled for automotive parts workflow
                <Form.Item
                  name="subcategoryId"
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-gray-700 text-sm">
                        Select Subcategory
                      </span>
                      <span className="text-xs text-gray-400">Optional</span>
                    </div>
                  }
                  className="mb-4"
                >
                  <Select
                    placeholder={
                      !selectedCategoryId
                        ? "Select a category first"
                        : loadingSubcategories
                        ? "Loading subcategories..."
                        : subcategories.length === 0
                        ? "No subcategories found"
                        : "Choose a subcategory"
                    }
                    allowClear
                    disabled={!selectedCategoryId}
                    size="large"
                    loading={loadingSubcategories}
                    className="rounded-lg h-11 w-full"
                    options={subcategories.map((sub: any) => ({
                      value: sub.id,
                      label: (
                        <div className="flex items-center gap-2">
                          <span>{sub.name}</span>
                          {!sub.status && (
                            <span className="text-xs text-amber-500">(Inactive)</span>
                          )}
                        </div>
                      ),
                    }))}
                  />
                </Form.Item>
                */}

                <Form.Item
                  name="tag"
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-gray-700 text-sm">
                        Product Tag / Badge
                      </span>
                      <span className="text-xs text-gray-400">Optional</span>
                    </div>
                  }
                  className="mb-2"
                >
                  <Select
                    placeholder="Select product tag (e.g. Featured, Best Seller)"
                    allowClear
                    size="large"
                    className="rounded-lg h-11 w-full"
                    options={[
                      { value: "Featured", label: "🌟 Featured" },
                      { value: "Best Seller", label: "🔥 Best Seller" },
                      { value: "New", label: "✨ New" },
                    ]}
                  />
                </Form.Item>
                <p className="text-xs text-gray-400 mt-2 mb-0">
                  Tagging a product places it directly in matching homepage showcase sections (e.g. Bestsellers & Featured).
                </p>
              </Card>

              {/* Media Card */}
              <Card
                bordered={false}
                className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
                title={
                  <div className="flex items-center gap-2 py-1">
                    <ImageIcon size={18} className="text-indigo-600" />
                    <span className="font-semibold text-gray-800 text-base">Featured Image</span>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Upload cover image (PNG, JPG, WebP)
                    </span>
                    {uploadingImage && (
                      <span className="text-xs text-indigo-600 flex items-center gap-1">
                        <Spin size="small" /> Uploading...
                      </span>
                    )}
                  </div>

                  <Upload
                    customRequest={handleCustomUpload}
                    showUploadList={false}
                    accept="image/*"
                    disabled={uploadingImage}
                  >
                    <Tooltip title="Upload product cover image">
                      <Button
                        icon={<UploadCloud size={16} />}
                        size="large"
                        loading={uploadingImage}
                        className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                      >
                        {imageUrl ? "Change Image" : "Upload Image"}
                      </Button>
                    </Tooltip>
                  </Upload>

                  {/* Image Preview Box */}
                  {imageUrl ? (
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 p-2 relative group">
                      <img
                        src={imageUrl}
                        alt="Product preview"
                        className="w-full h-52 object-cover rounded-lg"
                      />
                      <div className="mt-2 flex items-center justify-between px-1">
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">
                          {imageUrl.split("/").pop()}
                        </span>
                        <Tooltip title="Remove Image">
                          <Button
                            danger
                            type="text"
                            size="small"
                            icon={<Trash2 size={14} />}
                            onClick={handleRemoveImage}
                            className="hover:bg-red-50 flex items-center justify-center p-1"
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                      <ImageIcon size={40} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400 mb-0">No image uploaded yet</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Brochure Card */}
              <Card
                bordered={false}
                className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
                title={
                  <div className="flex items-center gap-2 py-1">
                    <FileText size={18} className="text-indigo-600" />
                    <span className="font-semibold text-gray-800 text-base">Product Brochure (PDF)</span>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Upload PDF brochure (Optional)
                    </span>
                    {uploadingBrochure && (
                      <span className="text-xs text-indigo-600 flex items-center gap-1">
                        <Spin size="small" /> Uploading...
                      </span>
                    )}
                  </div>

                  <Upload
                    customRequest={handleBrochureUpload}
                    showUploadList={false}
                    accept="application/pdf"
                    disabled={uploadingBrochure}
                  >
                    <Tooltip title="Upload product brochure PDF">
                      <Button
                        icon={<UploadCloud size={16} />}
                        size="large"
                        loading={uploadingBrochure}
                        className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                      >
                        {brochureUrl ? "Change PDF" : "Upload PDF"}
                      </Button>
                    </Tooltip>
                  </Upload>

                  {/* Brochure Preview */}
                  {brochureUrl ? (
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 p-3 relative flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={20} className="text-red-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {brochureUrl.split("/").pop()}
                        </span>
                      </div>
                      <Tooltip title="Remove PDF">
                        <Button
                          danger
                          type="text"
                          size="small"
                          icon={<Trash2 size={16} />}
                          onClick={handleRemoveBrochure}
                          className="hover:bg-red-50 flex items-center justify-center p-1"
                        />
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50">
                      <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400 mb-0">No PDF uploaded</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Action Buttons Card */}
              <Card
                bordered={false}
                className="shadow-sm rounded-2xl border border-gray-200/80 bg-slate-50"
              >
                <div className="space-y-3">
                  <Tooltip title={isEditing ? "Save changes to product" : "Publish new product"}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={isSubmitting}
                      icon={<Save size={18} />}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 border-none shadow-md shadow-indigo-600/30 rounded-xl h-12 font-semibold text-base flex items-center justify-center gap-2"
                    >
                      {isEditing ? "Update Product" : "Create Product"}
                    </Button>
                  </Tooltip>

                  <Tooltip title="Cancel and return to list">
                    <Button
                      size="large"
                      onClick={handleGoBack}
                      className="w-full rounded-xl text-gray-600 hover:text-gray-800 border-gray-300 h-11 font-medium"
                    >
                      Cancel
                    </Button>
                  </Tooltip>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProductForm;

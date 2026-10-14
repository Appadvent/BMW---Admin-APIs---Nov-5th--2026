
import React, { useEffect, useState } from "react";
import {
  Button,
  message,
  Upload,
  Switch,
  Select,
  Radio,
  Card,
  Popconfirm,
  Tag,
  Divider,
  Row,
  Col,
  Input,
  Tooltip,
  Spin,
} from "antd";
import {
  ArrowLeft,
  UploadCloud,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Layout,
  MousePointerClick,
  Layers,
  FileText,
  Eye,
  Save,
  Sparkles,
  Video,
  Compass,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { aboutService, uploadService } from "../../services/api";
import { AboutItem, AboutSection, AboutSectionItem } from "../../store/slices/aboutSlice";

const { Option } = Select;
const { TextArea } = Input;

const AboutForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const about = location.state?.about;
  const isEditing = !!about;

  // Core details
  const [badge, setBadge] = useState("About Us");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  // Presentation & Layout
  const [layout, setLayout] = useState<
    "image-left" | "image-right" | "image-top" | "text-only" | "centered" | "split"
  >("image-left");
  const [itemsLayout, setItemsLayout] = useState<
    "grid" | "list" | "cards" | "columns-2" | "columns-3" | "columns-4"
  >("grid");
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [isActive, setIsActive] = useState<boolean>(true);

  // Call to Action (CTA)
  const [ctaEnabled, setCtaEnabled] = useState<boolean>(false);
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [ctaTarget, setCtaTarget] = useState<"_self" | "_blank">("_self");

  // Media
  const [image, setImage] = useState<string>("");
  const [image2, setImage2] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImage2, setUploadingImage2] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Dynamic 0-to-N Features/Pillars for the hero/overview
  const [items, setItems] = useState<AboutItem[]>([]);

  // Dynamic 0-to-N Detail Page Content Sections (Vision, Mission, Values, History, etc.)
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [uploadingSectionImg, setUploadingSectionImg] = useState<{ [key: number]: boolean }>({});
  const [uploadingItemImg, setUploadingItemImg] = useState<{ [key: string]: boolean }>({});

  const [submitting, setSubmitting] = useState(false);

  // Populate data when editing
  useEffect(() => {
    if (about) {
      setBadge(about.badge ?? "About Us");
      setTitle(about.title || about.titleOne || "");
      setSubtitle(about.subtitle || about.titleTwo || "");
      setDescription(about.description || about.descriptionOne || "");
      setContent(about.content || about.descriptionTwo || "");

      setLayout(about.layout || "image-left");
      setItemsLayout(about.itemsLayout || "grid");
      setAlignment(about.alignment || "left");
      setIsActive(about.isActive ?? true);

      setCtaEnabled(about.ctaEnabled ?? false);
      setCtaText(about.ctaText || "");
      setCtaLink(about.ctaLink || "");
      setCtaTarget(about.ctaTarget || "_self");

      setImage(about.image || "");
      setImage2(about.image2 || "");
      setVideoUrl(about.videoUrl || "");

      if (Array.isArray(about.items) && about.items.length > 0) {
        setItems(
          about.items.map((it: any, idx: number) => ({
            id: it.id,
            title: it.title || "",
            description: it.description || "",
            icon: it.icon || "",
            link: it.link || "",
            order: it.order ?? idx + 1,
            isActive: it.isActive ?? true,
          }))
        );
      } else {
        setItems([]);
      }

      if (Array.isArray(about.sections) && about.sections.length > 0) {
        setSections(
          about.sections.map((sec: any, sIdx: number) => ({
            id: sec.id,
            title: sec.title || "",
            subtitle: sec.subtitle || "",
            badge: sec.badge || "",
            description: sec.description || "",
            content: sec.content || "",
            image: sec.image || "",
            imagePosition: sec.imagePosition || "left",
            layout: sec.layout || "default",
            order: sec.order ?? sIdx + 1,
            isActive: sec.isActive ?? true,
            items: Array.isArray(sec.items)
              ? sec.items.map((it: any, iIdx: number) => ({
                  id: it.id,
                  title: it.title || "",
                  description: it.description || "",
                  image: it.image || "",
                  icon: it.icon || "",
                  order: it.order ?? iIdx + 1,
                  isActive: it.isActive ?? true,
                }))
              : [],
          }))
        );
      } else {
        setSections([]);
      }
    }
  }, [about]);

  const handleGoBack = () => navigate("/dashboard/abouts");

  // Upload handlers
  const handleImageUpload = async (file: File, isSecond: boolean = false) => {
    try {
      if (isSecond) setUploadingImage2(true);
      else setUploadingImage(true);

      const res = await uploadService.uploadFile(file, "about");
      const uploadedUrl = res?.data?.url || res?.url;

      if (!uploadedUrl) throw new Error("Invalid upload response");

      if (isSecond) {
        setImage2(uploadedUrl);
      } else {
        setImage(uploadedUrl);
      }
      message.success("Image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Failed to upload image");
    } finally {
      if (isSecond) setUploadingImage2(false);
      else setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      setUploadingVideo(true);
      const res = await uploadService.uploadFile(file, "about-videos");
      const uploadedUrl = res?.data?.url || res?.url;
      if (!uploadedUrl) throw new Error("Invalid upload response");
      setVideoUrl(uploadedUrl);
      message.success("Video uploaded successfully");
    } catch (err) {
      console.error("Video upload error:", err);
      message.error("Failed to upload video file");
    } finally {
      setUploadingVideo(false);
    }
  };

  // Dynamic Feature Item Helpers
  const handleAddItem = () => {
    const newItem: AboutItem = {
      title: "",
      description: "",
      icon: "Sparkles",
      link: "",
      order: items.length + 1,
      isActive: true,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof AboutItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    const reordered = updated.map((it, idx) => ({ ...it, order: idx + 1 }));
    setItems(reordered);
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === items.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((it, idx) => ({ ...it, order: idx + 1 }));
    setItems(reordered);
  };

  // ==========================================
  // Dynamic Detail Page Content Section Helpers
  // ==========================================
  const handleAddSection = () => {
    const newSection: AboutSection = {
      title: "",
      subtitle: "",
      badge: "",
      description: "",
      content: "",
      image: "",
      imagePosition: "left",
      layout: "default",
      order: sections.length + 1,
      isActive: true,
      items: [],
    };
    setSections([...sections, newSection]);
  };

  const handleUpdateSection = (sIndex: number, field: keyof AboutSection, value: any) => {
    const updated = [...sections];
    updated[sIndex] = { ...updated[sIndex], [field]: value };
    setSections(updated);
  };

  const handleRemoveSection = (sIndex: number) => {
    const updated = sections.filter((_, i) => i !== sIndex);
    const reordered = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(reordered);
  };

  const handleMoveSection = (sIndex: number, direction: "up" | "down") => {
    if (direction === "up" && sIndex === 0) return;
    if (direction === "down" && sIndex === sections.length - 1) return;

    const targetIdx = direction === "up" ? sIndex - 1 : sIndex + 1;
    const updated = [...sections];
    const temp = updated[sIndex];
    updated[sIndex] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(reordered);
  };

  const handleSectionImageUpload = async (sIndex: number, file: File) => {
    try {
      setUploadingSectionImg((prev) => ({ ...prev, [sIndex]: true }));
      const res = await uploadService.uploadFile(file, "about-sections");
      const uploadedUrl = res?.data?.url || res?.url;
      if (!uploadedUrl) throw new Error("Invalid upload response");

      handleUpdateSection(sIndex, "image", uploadedUrl);
      message.success("Section image uploaded successfully");
    } catch (err) {
      console.error("Section image upload error:", err);
      message.error("Failed to upload section image");
    } finally {
      setUploadingSectionImg((prev) => ({ ...prev, [sIndex]: false }));
    }
  };

  // Section Item Helpers (Nested within Sections)
  const handleAddSectionItem = (sIndex: number) => {
    const section = sections[sIndex];
    const currentItems = section.items || [];
    const newItem: AboutSectionItem = {
      title: "",
      description: "",
      image: "",
      icon: "",
      order: currentItems.length + 1,
      isActive: true,
    };
    handleUpdateSection(sIndex, "items", [...currentItems, newItem]);
  };

  const handleUpdateSectionItem = (
    sIndex: number,
    itemIndex: number,
    field: keyof AboutSectionItem,
    value: any
  ) => {
    const section = sections[sIndex];
    const currentItems = [...(section.items || [])];
    currentItems[itemIndex] = { ...currentItems[itemIndex], [field]: value };
    handleUpdateSection(sIndex, "items", currentItems);
  };

  const handleRemoveSectionItem = (sIndex: number, itemIndex: number) => {
    const section = sections[sIndex];
    const currentItems = (section.items || []).filter((_, i) => i !== itemIndex);
    const reordered = currentItems.map((it, idx) => ({ ...it, order: idx + 1 }));
    handleUpdateSection(sIndex, "items", reordered);
  };

  const handleMoveSectionItem = (
    sIndex: number,
    itemIndex: number,
    direction: "up" | "down"
  ) => {
    const section = sections[sIndex];
    const currentItems = [...(section.items || [])];
    if (direction === "up" && itemIndex === 0) return;
    if (direction === "down" && itemIndex === currentItems.length - 1) return;

    const targetIdx = direction === "up" ? itemIndex - 1 : itemIndex + 1;
    const temp = currentItems[itemIndex];
    currentItems[itemIndex] = currentItems[targetIdx];
    currentItems[targetIdx] = temp;

    const reordered = currentItems.map((it, idx) => ({ ...it, order: idx + 1 }));
    handleUpdateSection(sIndex, "items", reordered);
  };

  const handleSectionItemImageUpload = async (
    sIndex: number,
    itemIndex: number,
    file: File
  ) => {
    const key = `${sIndex}-${itemIndex}`;
    try {
      setUploadingItemImg((prev) => ({ ...prev, [key]: true }));
      const res = await uploadService.uploadFile(file, "about-items");
      const uploadedUrl = res?.data?.url || res?.url;
      if (!uploadedUrl) throw new Error("Invalid upload response");

      handleUpdateSectionItem(sIndex, itemIndex, "image", uploadedUrl);
      message.success("Item image uploaded successfully");
    } catch (err) {
      console.error("Item image upload error:", err);
      message.error("Failed to upload item image");
    } finally {
      setUploadingItemImg((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return message.error("Main Section Title is required.");
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].title.trim()) {
        return message.error(`Feature Item #${i + 1} must have a title.`);
      }
    }

    for (let s = 0; s < sections.length; s++) {
      if (!sections[s].title.trim()) {
        return message.error(`Detail Section #${s + 1} must have a title.`);
      }
      const secItems = sections[s].items || [];
      for (let si = 0; si < secItems.length; si++) {
        if (!secItems[si].title.trim()) {
          return message.error(
            `Detail Section "${sections[s].title || `#${s + 1}`}" Item #${si + 1} must have a title.`
          );
        }
      }
    }

    setSubmitting(true);
    const hide = message.loading(
      isEditing ? "Updating About section..." : "Creating About section...",
      0
    );

    const payload = {
      badge: badge.trim() || undefined,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      content: content.trim() || undefined,
      image: image.trim() || undefined,
      image2: image2.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      layout,
      itemsLayout,
      alignment,
      ctaEnabled,
      ctaText: ctaEnabled ? ctaText.trim() || undefined : undefined,
      ctaLink: ctaEnabled ? ctaLink.trim() || undefined : undefined,
      ctaTarget: ctaEnabled ? ctaTarget : undefined,
      isActive,
      items: items.map((it, idx) => ({
        id: it.id,
        title: it.title.trim(),
        description: it.description?.trim() || undefined,
        icon: it.icon?.trim() || undefined,
        link: it.link?.trim() || undefined,
        order: idx + 1,
        isActive: it.isActive ?? true,
      })),
      sections: sections.map((sec, sIdx) => ({
        id: sec.id,
        title: sec.title.trim(),
        subtitle: sec.subtitle?.trim() || undefined,
        badge: sec.badge?.trim() || undefined,
        description: sec.description?.trim() || undefined,
        content: sec.content?.trim() || undefined,
        image: sec.image?.trim() || undefined,
        imagePosition: sec.imagePosition || "left",
        layout: sec.layout || "default",
        order: sIdx + 1,
        isActive: sec.isActive ?? true,
        items: Array.isArray(sec.items)
          ? sec.items.map((it, iIdx) => ({
              id: it.id,
              title: it.title.trim(),
              description: it.description?.trim() || undefined,
              image: it.image?.trim() || undefined,
              icon: it.icon?.trim() || undefined,
              order: iIdx + 1,
              isActive: it.isActive ?? true,
            }))
          : [],
      })),
    };

    try {
      if (about?.id) {
        await aboutService.updateAbout(about.id, payload);
        message.success("About section updated successfully!");
      } else {
        await aboutService.createAbout(payload);
        message.success("About section created successfully!");
      }
      navigate("/dashboard/abouts");
    } catch (err: any) {
      console.error("Save error:", err);
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to save About section";
      message.error(errMsg);
    } finally {
      hide();
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-4">
          <Tooltip title="Back to About Sections">
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
              {isEditing ? "Edit About Section" : "Create About Section"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 mb-0">
              {isEditing
                ? `Updating section ID #${about.id}`
                : "Build a dynamic About Us section with presentation layouts, media, and feature pillars."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tag
            color={isActive ? "success" : "default"}
            className="text-xs px-3 py-1 rounded-full font-medium"
          >
            {isActive ? "Status: Published" : "Status: Draft"}
          </Tag>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <Row gutter={[24, 24]}>
          {/* Left Column (Main Content & Dynamic Items) */}
          <Col xs={24} lg={14} className="space-y-6">
            {/* Card 1: Section Details & Content */}
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center gap-2 py-1">
                  <FileText size={18} className="text-indigo-600" />
                  <span className="font-semibold text-gray-800 text-base">
                    Section Content & Narrative
                  </span>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Section Badge / Tagline
                    </label>
                    <Input
                      placeholder="e.g. About Us, Who We Are, Our Mission"
                      size="large"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      maxLength={60}
                      showCount
                      className="rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Sub-heading / Secondary Title
                    </label>
                    <Input
                      placeholder="e.g. Innovating Precision Solutions"
                      size="large"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      maxLength={100}
                      showCount
                      className="rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Main Section Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Driving Excellence Across Every Operation"
                    size="large"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={120}
                    showCount
                    className="rounded-lg text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Short Summary / Overview
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Brief summary paragraph highlighting key value proposition..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={600}
                    showCount
                    className="rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Detailed Extended Content (Optional)
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Additional detailed narrative, history, or extended company story..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="rounded-lg text-sm"
                  />
                </div>
              </div>
            </Card>

            {/* Card 2: Dynamic Feature Items (0 to N Items) */}
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-purple-600" />
                    <span className="font-semibold text-gray-800 text-base">
                      Feature Highlights & Pillars ({items.length})
                    </span>
                  </div>
                  <Button
                    type="primary"
                    size="middle"
                    icon={<Plus size={15} />}
                    onClick={handleAddItem}
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 font-medium shadow-none text-xs"
                  >
                    Add Feature Item
                  </Button>
                </div>
              }
            >
              {items.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-xl bg-gray-50/50">
                  <Sparkles size={32} className="text-gray-300 mx-auto mb-2" />
                  <h4 className="text-gray-700 font-medium text-sm">No Features Added</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                    Add bullet points, capabilities, core pillars, or key statistics with custom icons and links.
                  </p>
                  <Button
                    type="dashed"
                    icon={<Plus size={14} />}
                    onClick={handleAddItem}
                    className="rounded-lg text-xs"
                  >
                    Add First Feature Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-xl bg-gray-50/70 hover:bg-gray-50 transition border-gray-200/90 shadow-sm"
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/80">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {item.title || `Item #${index + 1}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Tooltip title="Move Up">
                            <Button
                              size="small"
                              icon={<ChevronUp size={14} />}
                              disabled={index === 0}
                              onClick={() => handleMoveItem(index, "up")}
                            />
                          </Tooltip>
                          <Tooltip title="Move Down">
                            <Button
                              size="small"
                              icon={<ChevronDown size={14} />}
                              disabled={index === items.length - 1}
                              onClick={() => handleMoveItem(index, "down")}
                            />
                          </Tooltip>
                          <Divider type="vertical" className="mx-1" />
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Active:</span>
                            <Switch
                              size="small"
                              checked={item.isActive ?? true}
                              onChange={(checked) =>
                                handleUpdateItem(index, "isActive", checked)
                              }
                            />
                          </div>
                          <Divider type="vertical" className="mx-1" />
                          <Popconfirm
                            title="Delete Item"
                            description="Remove this feature item?"
                            onConfirm={() => handleRemoveItem(index)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              size="small"
                              danger
                              type="text"
                              icon={<Trash2 size={15} />}
                            />
                          </Popconfirm>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Item Title <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="e.g. Industry Certified Standards"
                            value={item.title}
                            onChange={(e) =>
                              handleUpdateItem(index, "title", e.target.value)
                            }
                            className="rounded-lg bg-white text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Icon (Lucide name)
                          </label>
                          <Input
                            placeholder="e.g. ShieldCheck, Sparkles, Award"
                            value={item.icon || ""}
                            onChange={(e) =>
                              handleUpdateItem(index, "icon", e.target.value)
                            }
                            className="rounded-lg bg-white text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Description
                          </label>
                          <TextArea
                            rows={2}
                            placeholder="Detail about this feature or capability..."
                            value={item.description || ""}
                            onChange={(e) =>
                              handleUpdateItem(index, "description", e.target.value)
                            }
                            className="rounded-lg bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Link (Optional URL)
                          </label>
                          <Input
                            placeholder="e.g. /services or https://..."
                            value={item.link || ""}
                            onChange={(e) =>
                              handleUpdateItem(index, "link", e.target.value)
                            }
                            className="rounded-lg bg-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Card 3: Dynamic Detail Page Content Sections (Vision, Mission, Values, Craft, etc.) */}
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-indigo-100/80 bg-white ring-1 ring-indigo-50"
              title={
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Compass size={18} className="text-indigo-600" />
                    <div>
                      <span className="font-semibold text-gray-800 text-base block">
                        Detail Page Content Sections ({sections.length})
                      </span>
                      <span className="text-[11px] text-gray-400 font-normal">
                        Dynamic sections rendered on the dedicated About Us detail page (Vision, Mission, Values, History, etc.)
                      </span>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    size="middle"
                    icon={<Plus size={15} />}
                    onClick={handleAddSection}
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 font-medium shadow-none text-xs"
                  >
                    Add Detail Section
                  </Button>
                </div>
              }
            >
              {sections.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-xl bg-slate-50/70">
                  <Compass size={36} className="text-indigo-300 mx-auto mb-2" />
                  <h4 className="text-gray-700 font-medium text-sm">No Detail Sections Added</h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
                    Create dynamic content blocks for your About Us detail page such as Our Vision, Our Mission, Values, Heritage, or Custom Highlights with nested cards and imagery.
                  </p>
                  <Button
                    type="dashed"
                    icon={<Plus size={14} />}
                    onClick={handleAddSection}
                    className="rounded-lg text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    Add First Detail Section
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {sections.map((section, sIndex) => (
                    <div
                      key={sIndex}
                      className="p-5 border rounded-2xl bg-slate-50/60 hover:bg-slate-50 transition border-slate-200/90 shadow-sm space-y-4"
                    >
                      {/* Section Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            {sIndex + 1}
                          </span>
                          <span className="font-bold text-gray-800 text-sm">
                            {section.title || `Detail Section #${sIndex + 1}`}
                          </span>
                          {section.badge && (
                            <Tag color="blue" className="text-[10px] px-1.5 py-0 rounded">
                              {section.badge}
                            </Tag>
                          )}
                          <Tag color="purple" className="text-[10px] px-1.5 py-0 rounded uppercase">
                            {section.layout || "default"}
                          </Tag>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Tooltip title="Move Section Up">
                            <Button
                              size="small"
                              icon={<ChevronUp size={14} />}
                              disabled={sIndex === 0}
                              onClick={() => handleMoveSection(sIndex, "up")}
                            />
                          </Tooltip>
                          <Tooltip title="Move Section Down">
                            <Button
                              size="small"
                              icon={<ChevronDown size={14} />}
                              disabled={sIndex === sections.length - 1}
                              onClick={() => handleMoveSection(sIndex, "down")}
                            />
                          </Tooltip>
                          <Divider type="vertical" className="mx-1" />
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Active:</span>
                            <Switch
                              size="small"
                              checked={section.isActive ?? true}
                              onChange={(checked) =>
                                handleUpdateSection(sIndex, "isActive", checked)
                              }
                            />
                          </div>
                          <Divider type="vertical" className="mx-1" />
                          <Popconfirm
                            title="Delete Detail Section"
                            description="Remove this entire detail section and all its nested items?"
                            onConfirm={() => handleRemoveSection(sIndex)}
                            okText="Yes, Delete"
                            cancelText="Cancel"
                          >
                            <Button
                              size="small"
                              danger
                              type="text"
                              icon={<Trash2 size={15} />}
                            />
                          </Popconfirm>
                        </div>
                      </div>

                      {/* Section Main Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Badge / Tagline
                          </label>
                          <Input
                            placeholder="e.g. Our Vision, Our Heritage"
                            value={section.badge || ""}
                            onChange={(e) =>
                              handleUpdateSection(sIndex, "badge", e.target.value)
                            }
                            className="rounded-lg bg-white text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Section Title <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="e.g. Crafting Excellence for Three Decades"
                            value={section.title}
                            onChange={(e) =>
                              handleUpdateSection(sIndex, "title", e.target.value)
                            }
                            className="rounded-lg bg-white text-sm font-medium"
                            required
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Subtitle / Supporting Tagline (Optional)
                          </label>
                          <Input
                            placeholder="e.g. Empowering modern living through precision design"
                            value={section.subtitle || ""}
                            onChange={(e) =>
                              handleUpdateSection(sIndex, "subtitle", e.target.value)
                            }
                            className="rounded-lg bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Layout Style
                          </label>
                          <Select
                            value={section.layout || "default"}
                            onChange={(val) => handleUpdateSection(sIndex, "layout", val)}
                            className="w-full text-xs"
                            size="middle"
                          >
                            <Option value="default">Default Content</Option>
                            <Option value="split">50/50 Split Showcase</Option>
                            <Option value="cards">Card Grid</Option>
                            <Option value="stats">Key Stats & Metrics</Option>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Image Position
                          </label>
                          <Select
                            value={section.imagePosition || "left"}
                            onChange={(val) =>
                              handleUpdateSection(sIndex, "imagePosition", val)
                            }
                            className="w-full text-xs"
                            size="middle"
                          >
                            <Option value="left">Image on Left</Option>
                            <Option value="right">Image on Right</Option>
                            <Option value="top">Image on Top</Option>
                            <Option value="none">No Image (Text only)</Option>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Display Order
                          </label>
                          <Input
                            type="number"
                            value={section.order || sIndex + 1}
                            onChange={(e) =>
                              handleUpdateSection(
                                sIndex,
                                "order",
                                parseInt(e.target.value) || sIndex + 1
                              )
                            }
                            className="rounded-lg bg-white text-xs"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Short Overview / Description
                          </label>
                          <TextArea
                            rows={2}
                            placeholder="Primary overview paragraph for this detail section..."
                            value={section.description || ""}
                            onChange={(e) =>
                              handleUpdateSection(sIndex, "description", e.target.value)
                            }
                            className="rounded-lg bg-white text-xs"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Extended Story / Rich Narrative (Optional)
                          </label>
                          <TextArea
                            rows={3}
                            placeholder="Detailed background, story paragraphs, or operational philosophy..."
                            value={section.content || ""}
                            onChange={(e) =>
                              handleUpdateSection(sIndex, "content", e.target.value)
                            }
                            className="rounded-lg bg-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Section Image Uploader */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-semibold text-gray-700">
                            Section Feature Image
                          </label>
                          {uploadingSectionImg[sIndex] && (
                            <span className="text-xs text-indigo-600 flex items-center gap-1">
                              <Spin size="small" /> Uploading image...
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          {section.image ? (
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 group">
                              <img
                                src={section.image}
                                alt="Section Preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                size="small"
                                danger
                                icon={<Trash2 size={12} />}
                                onClick={() => handleUpdateSection(sIndex, "image", "")}
                                className="absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center bg-white/90"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-16 border border-dashed rounded-lg flex items-center justify-center bg-gray-50 flex-shrink-0">
                              <ImageIcon size={18} className="text-gray-300" />
                            </div>
                          )}

                          <div className="flex-1 flex gap-2 w-full">
                            <Upload
                              beforeUpload={(file) => {
                                handleSectionImageUpload(sIndex, file);
                                return false;
                              }}
                              showUploadList={false}
                              accept="image/*"
                              disabled={uploadingSectionImg[sIndex]}
                            >
                              <Button
                                icon={<UploadCloud size={14} />}
                                loading={uploadingSectionImg[sIndex]}
                                size="middle"
                                className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs"
                              >
                                {section.image ? "Replace" : "Upload"}
                              </Button>
                            </Upload>
                            <Input
                              placeholder="Or paste section image URL"
                              value={section.image || ""}
                              onChange={(e) =>
                                handleUpdateSection(sIndex, "image", e.target.value)
                              }
                              size="middle"
                              className="rounded-lg text-xs flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Nested Section Items (Values, Milestones, Pillars) */}
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <Layers size={14} className="text-indigo-600" />
                            <span className="text-xs font-semibold text-gray-800">
                              Section Feature Items / Cards ({(section.items || []).length})
                            </span>
                          </div>
                          <Button
                            type="dashed"
                            size="small"
                            icon={<Plus size={13} />}
                            onClick={() => handleAddSectionItem(sIndex)}
                            className="rounded-lg text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          >
                            Add Section Item
                          </Button>
                        </div>

                        {(section.items || []).length === 0 ? (
                          <div className="text-center py-4 border border-dashed rounded-xl bg-white/60 text-xs text-gray-400">
                            No nested items in this section (e.g. specific Value cards, Mission bullets, or Stats). Click "Add Section Item" above to add.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(section.items || []).map((secItem, itemIdx) => {
                              const itemKey = `${sIndex}-${itemIdx}`;
                              return (
                                <div
                                  key={itemIdx}
                                  className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5"
                                >
                                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                                        {itemIdx + 1}
                                      </span>
                                      <span className="font-semibold text-gray-700 text-xs">
                                        {secItem.title || `Item #${itemIdx + 1}`}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Tooltip title="Move Up">
                                        <Button
                                          size="small"
                                          icon={<ChevronUp size={12} />}
                                          disabled={itemIdx === 0}
                                          onClick={() =>
                                            handleMoveSectionItem(sIndex, itemIdx, "up")
                                          }
                                        />
                                      </Tooltip>
                                      <Tooltip title="Move Down">
                                        <Button
                                          size="small"
                                          icon={<ChevronDown size={12} />}
                                          disabled={
                                            itemIdx === (section.items || []).length - 1
                                          }
                                          onClick={() =>
                                            handleMoveSectionItem(sIndex, itemIdx, "down")
                                          }
                                        />
                                      </Tooltip>
                                      <Divider type="vertical" className="mx-0.5" />
                                      <Switch
                                        size="small"
                                        checked={secItem.isActive ?? true}
                                        onChange={(checked) =>
                                          handleUpdateSectionItem(
                                            sIndex,
                                            itemIdx,
                                            "isActive",
                                            checked
                                          )
                                        }
                                      />
                                      <Divider type="vertical" className="mx-0.5" />
                                      <Popconfirm
                                        title="Delete Item"
                                        description="Remove this item?"
                                        onConfirm={() =>
                                          handleRemoveSectionItem(sIndex, itemIdx)
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                      >
                                        <Button
                                          size="small"
                                          danger
                                          type="text"
                                          icon={<Trash2 size={13} />}
                                        />
                                      </Popconfirm>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="sm:col-span-2">
                                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                        Item Title <span className="text-red-500">*</span>
                                      </label>
                                      <Input
                                        placeholder="e.g. Uncompromising Quality"
                                        value={secItem.title}
                                        onChange={(e) =>
                                          handleUpdateSectionItem(
                                            sIndex,
                                            itemIdx,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        className="rounded-lg text-xs"
                                        required
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                        Icon (Lucide name)
                                      </label>
                                      <Input
                                        placeholder="e.g. Eye, Target, Award"
                                        value={secItem.icon || ""}
                                        onChange={(e) =>
                                          handleUpdateSectionItem(
                                            sIndex,
                                            itemIdx,
                                            "icon",
                                            e.target.value
                                          )
                                        }
                                        className="rounded-lg text-xs"
                                      />
                                    </div>

                                    <div className="sm:col-span-2">
                                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                        Description
                                      </label>
                                      <TextArea
                                        rows={2}
                                        placeholder="Description or bullet point detail..."
                                        value={secItem.description || ""}
                                        onChange={(e) =>
                                          handleUpdateSectionItem(
                                            sIndex,
                                            itemIdx,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        className="rounded-lg text-xs"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                        Item Image (Optional)
                                      </label>
                                      <div className="flex gap-1.5">
                                        <Input
                                          placeholder="Image URL"
                                          value={secItem.image || ""}
                                          onChange={(e) =>
                                            handleUpdateSectionItem(
                                              sIndex,
                                              itemIdx,
                                              "image",
                                              e.target.value
                                            )
                                          }
                                          className="rounded-lg text-xs flex-1"
                                        />
                                        <Upload
                                          beforeUpload={(file) => {
                                            handleSectionItemImageUpload(
                                              sIndex,
                                              itemIdx,
                                              file
                                            );
                                            return false;
                                          }}
                                          showUploadList={false}
                                          accept="image/*"
                                          disabled={uploadingItemImg[itemKey]}
                                        >
                                          <Tooltip title="Upload item image">
                                            <Button
                                              icon={<UploadCloud size={13} />}
                                              loading={uploadingItemImg[itemKey]}
                                              size="middle"
                                              className="rounded-lg px-2"
                                            />
                                          </Tooltip>
                                        </Upload>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Right Column (Controls, CTA & Media) */}
          <Col xs={24} lg={10} className="space-y-6">
            {/* Card 4: Presentation & Layout Controls */}
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center gap-2 py-1">
                  <Layout size={18} className="text-indigo-600" />
                  <span className="font-semibold text-gray-800 text-base">
                    Layout & Presentation
                  </span>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Media Position
                  </label>
                  <Select
                    value={layout}
                    onChange={(val) => setLayout(val)}
                    className="w-full"
                    size="large"
                  >
                    <Option value="image-left">Media on Left</Option>
                    <Option value="image-right">Media on Right</Option>
                    <Option value="image-top">Media on Top</Option>
                    <Option value="text-only">Text Only (No Media)</Option>
                    <Option value="centered">Centered Showcase</Option>
                    <Option value="split">50/50 Split Showcase</Option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Features Display Layout
                  </label>
                  <Select
                    value={itemsLayout}
                    onChange={(val) => setItemsLayout(val)}
                    className="w-full"
                    size="large"
                  >
                    <Option value="grid">Grid (Responsive)</Option>
                    <Option value="list">Vertical List</Option>
                    <Option value="cards">Card Boxes</Option>
                    <Option value="columns-2">2 Columns</Option>
                    <Option value="columns-3">3 Columns</Option>
                    <Option value="columns-4">4 Columns</Option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Text Alignment
                  </label>
                  <Radio.Group
                    value={alignment}
                    onChange={(e) => setAlignment(e.target.value)}
                    buttonStyle="solid"
                    className="w-full flex"
                    size="middle"
                  >
                    <Radio.Button value="left" className="flex-1 text-center">
                      Left
                    </Radio.Button>
                    <Radio.Button value="center" className="flex-1 text-center">
                      Center
                    </Radio.Button>
                    <Radio.Button value="right" className="flex-1 text-center">
                      Right
                    </Radio.Button>
                  </Radio.Group>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-semibold text-gray-700">
                      Publication Status
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {isActive ? "Visible on frontend" : "Hidden in draft"}
                    </span>
                  </div>
                  <Switch
                    checked={isActive}
                    onChange={(checked) => setIsActive(checked)}
                    checkedChildren="Active"
                    unCheckedChildren="Draft"
                  />
                </div>
              </div>
            </Card>

            {/* Card 4: Call to Action (CTA) */}
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <MousePointerClick size={18} className="text-emerald-600" />
                    <span className="font-semibold text-gray-800 text-base">
                      Call to Action (CTA)
                    </span>
                  </div>
                  <Switch
                    checked={ctaEnabled}
                    onChange={(checked) => setCtaEnabled(checked)}
                    checkedChildren="On"
                    unCheckedChildren="Off"
                  />
                </div>
              }
            >
              {ctaEnabled ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Button Label
                    </label>
                    <Input
                      placeholder="e.g. Know More, Contact Us"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      size="large"
                      className="rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Target URL
                    </label>
                    <Input
                      placeholder="e.g. /contact or https://..."
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      size="large"
                      className="rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Link Behavior
                    </label>
                    <Select
                      value={ctaTarget}
                      onChange={(val) => setCtaTarget(val)}
                      className="w-full"
                      size="large"
                    >
                      <Option value="_self">Open in Same Tab (_self)</Option>
                      <Option value="_blank">Open in New Tab (_blank)</Option>
                    </Select>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic mb-0">
                  CTA button is disabled. Turn on the switch above to attach a clickable action button.
                </p>
              )}
            </Card>

            {/* Card 5: Media Assets */}
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl border border-gray-200/80 bg-white"
              title={
                <div className="flex items-center gap-2 py-1">
                  <ImageIcon size={18} className="text-amber-600" />
                  <span className="font-semibold text-gray-800 text-base">
                    Media Assets & Visuals
                  </span>
                </div>
              }
            >
              <div className="space-y-4">
                {/* Primary Image */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Primary Section Image
                    </label>
                    {uploadingImage && (
                      <span className="text-xs text-indigo-600 flex items-center gap-1">
                        <Spin size="small" /> Uploading...
                      </span>
                    )}
                  </div>

                  {image ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-2 group">
                      <img
                        src={image}
                        alt="Primary preview"
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="small"
                          danger
                          icon={<Trash2 size={13} />}
                          onClick={() => setImage("")}
                          className="bg-white/90 backdrop-blur-sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50/50 mb-2">
                      <ImageIcon size={28} className="text-gray-300 mb-1" />
                      <span className="text-xs text-gray-400">No primary image selected</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Upload
                      beforeUpload={(file) => {
                        handleImageUpload(file, false);
                        return false;
                      }}
                      showUploadList={false}
                      accept="image/*"
                      disabled={uploadingImage}
                    >
                      <Button
                        icon={<UploadCloud size={15} />}
                        loading={uploadingImage}
                        size="middle"
                        className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium text-xs flex items-center gap-1.5"
                      >
                        {image ? "Replace" : "Upload"}
                      </Button>
                    </Upload>
                    <Input
                      placeholder="Or paste image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      size="middle"
                      className="rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Secondary Image */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Secondary Image (Optional)
                    </label>
                    {uploadingImage2 && (
                      <span className="text-xs text-indigo-600 flex items-center gap-1">
                        <Spin size="small" /> Uploading...
                      </span>
                    )}
                  </div>

                  {image2 ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-2 group">
                      <img
                        src={image2}
                        alt="Secondary preview"
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="small"
                          danger
                          icon={<Trash2 size={13} />}
                          onClick={() => setImage2("")}
                          className="bg-white/90 backdrop-blur-sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50/50 mb-2">
                      <ImageIcon size={24} className="text-gray-300 mb-1" />
                      <span className="text-xs text-gray-400">No secondary image</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Upload
                      beforeUpload={(file) => {
                        handleImageUpload(file, true);
                        return false;
                      }}
                      showUploadList={false}
                      accept="image/*"
                      disabled={uploadingImage2}
                    >
                      <Button
                        icon={<UploadCloud size={15} />}
                        loading={uploadingImage2}
                        size="middle"
                        className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium text-xs flex items-center gap-1.5"
                      >
                        {image2 ? "Replace" : "Upload"}
                      </Button>
                    </Upload>
                    <Input
                      placeholder="Or paste secondary URL"
                      value={image2}
                      onChange={(e) => setImage2(e.target.value)}
                      size="middle"
                      className="rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Video URL or Upload */}
                <div className="pt-3 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Video URL / MinIO File (Optional)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://... or video URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      size="middle"
                      className="rounded-lg text-xs"
                    />
                    <Upload
                      beforeUpload={(file) => {
                        handleVideoUpload(file);
                        return false;
                      }}
                      showUploadList={false}
                      accept="video/*"
                      disabled={uploadingVideo}
                    >
                      <Tooltip title="Upload video file">
                        <Button
                          icon={<Video size={15} />}
                          loading={uploadingVideo}
                          size="middle"
                          className="rounded-lg"
                        />
                      </Tooltip>
                    </Upload>
                  </div>
                  {videoUrl && (
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Eye size={12} /> Preview Video
                      </a>
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => setVideoUrl("")}
                        className="p-0 h-auto text-xs"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Sticky/Bottom Form Actions */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between gap-3">
              <Button
                onClick={handleGoBack}
                className="rounded-xl h-11 px-6 font-medium border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<Save size={16} />}
                className="rounded-xl h-11 px-7 bg-indigo-600 hover:bg-indigo-700 font-medium shadow-sm flex items-center gap-2"
              >
                {isEditing ? "Update About Page" : "Save About Page"}
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default AboutForm;



import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Radio,
  Switch,
  InputNumber,
  message,
  Spin,
  Tooltip,
  Tag,
} from "antd";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Video,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  createBanner,
  updateBanner,
  fetchBannerById,
  clearCurrentBanner,
} from "../../store/slices/bannerSlice";
import { uploadService } from "../../services/api";

const { TextArea } = Input;

const BannerForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { banner, loading: sliceLoading } = useSelector(
    (state: RootState) => state.banners
  );

  // Form states
  const [bgMediaType, setBgMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [bgMedia, setBgMedia] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [heading, setHeading] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [textAlignment, setTextAlignment] = useState<"LEFT" | "CENTER" | "RIGHT">("LEFT");
  const [primaryBtnText, setPrimaryBtnText] = useState<string>("");
  const [primaryBtnLink, setPrimaryBtnLink] = useState<string>("");
  const [secondaryBtnText, setSecondaryBtnText] = useState<string>("");
  const [secondaryBtnLink, setSecondaryBtnLink] = useState<string>("");
  const [sideImage, setSideImage] = useState<string>("");
  const [sideImagePosition, setSideImagePosition] = useState<"LEFT" | "RIGHT">("RIGHT");
  const [sequence, setSequence] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Uploading state
  const [uploadingBg, setUploadingBg] = useState<boolean>(false);
  const [uploadingSide, setUploadingSide] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchBannerById(id));
    }
    return () => {
      dispatch(clearCurrentBanner());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && banner) {
      setBgMediaType(banner.bgMediaType || "IMAGE");
      setBgMedia(banner.bgMedia || "");
      setLabel(banner.label || "");
      setHeading(banner.heading || "");
      setDescription(banner.description || "");
      setTextAlignment(banner.textAlignment || "LEFT");
      setPrimaryBtnText(banner.primaryBtnText || "");
      setPrimaryBtnLink(banner.primaryBtnLink || "");
      setSecondaryBtnText(banner.secondaryBtnText || "");
      setSecondaryBtnLink(banner.secondaryBtnLink || "");
      setSideImage(banner.sideImage || "");
      setSideImagePosition(banner.sideImagePosition || "RIGHT");
      setSequence(banner.sequence ?? 1);
      setIsActive(banner.isActive ?? true);
    }
  }, [banner, isEdit]);

  // Handle Background Media Upload
  const handleBgMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (bgMediaType === "VIDEO") {
      if (!file.type.startsWith("video/")) {
        message.error("Please upload a valid video file (MP4, WEBM)");
        return;
      }
    } else {
      if (!file.type.startsWith("image/")) {
        message.error("Please upload a valid image file (JPEG, PNG, WEBP)");
        return;
      }
    }

    setUploadingBg(true);
    try {
      const res = await uploadService.uploadFile(file, "banners");
      if (res?.data?.url) {
        setBgMedia(res.data.url);
        message.success("Background media uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload media");
    } finally {
      setUploadingBg(false);
    }
  };

  // Handle Side Image Upload
  const handleSideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Please upload a valid image file");
      return;
    }

    setUploadingSide(true);
    try {
      const res = await uploadService.uploadFile(file, "banners/side-images");
      if (res?.data?.url) {
        setSideImage(res.data.url);
        message.success("Side image uploaded successfully");
      }
    } catch (error) {
      console.error("Side image upload error:", error);
      message.error("Failed to upload side image");
    } finally {
      setUploadingSide(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bgMedia.trim()) {
      message.error("Background media (Image or Video) is required");
      return;
    }

    if (!heading.trim()) {
      message.error("Main heading is required");
      return;
    }

    const payload = {
      bgMediaType,
      bgMedia: bgMedia.trim(),
      label: label.trim() || null,
      heading: heading.trim(),
      description: description.trim() || null,
      textAlignment,
      primaryBtnText: primaryBtnText.trim() || null,
      primaryBtnLink: primaryBtnLink.trim() || null,
      secondaryBtnText: secondaryBtnText.trim() || null,
      secondaryBtnLink: secondaryBtnLink.trim() || null,
      sideImage: sideImage.trim() || null,
      sideImagePosition,
      sequence: Number(sequence) || 1,
      isActive,
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await dispatch(updateBanner({ id, data: payload })).unwrap();
        message.success("Banner updated successfully");
      } else {
        await dispatch(createBanner(payload)).unwrap();
        message.success("Banner created successfully (Active limit enforced)");
      }
      navigate("/dashboard/banners");
    } catch (error: any) {
      console.error("Save error:", error);
      message.error(error || "Failed to save banner");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && sliceLoading && !banner) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
        <div className="flex items-center gap-4">
          <Tooltip title="Back to Banners List">
            <Button
              onClick={() => navigate("/dashboard/banners")}
              icon={<ArrowLeft size={18} />}
              className="flex items-center justify-center rounded-xl border-gray-300 hover:border-indigo-600 hover:text-indigo-600 shadow-sm h-11 px-4 cursor-pointer"
            >
              Back
            </Button>
          </Tooltip>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0">
                {isEdit ? `Edit Banner #${id}` : "Configure Hero Banner"}
              </h1>
              <Tag
                color={isEdit ? "blue" : "purple"}
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold m-0"
              >
                {isEdit ? `ID: #${id}` : "Hero Slider"}
              </Tag>
            </div>
            <p className="text-sm text-gray-500 mt-0.5 mb-0">
              {isEdit
                ? "Update background media, headings, CTA buttons, and optional side image."
                : "Configure background media (Image or Video), dynamic text, alignment, and CTAs."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
        {/* 1. Background Media Section */}
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden"
          title={
            <div className="flex items-center gap-2 text-gray-800 font-bold py-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>1. Background Media (Image OR Video)</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Media Type
                </label>
                <p className="text-xs text-gray-500">
                  Select whether this banner uses a full-screen background video or high-res image.
                </p>
              </div>

              <Radio.Group
                value={bgMediaType}
                onChange={(e) => {
                  setBgMediaType(e.target.value);
                  setBgMedia(""); // Clear so user uploads appropriate type
                }}
                buttonStyle="solid"
                className="font-medium"
              >
                <Radio.Button value="IMAGE" className="px-4">
                  <span className="inline-flex items-center gap-1.5">
                    <ImageIcon size={14} />
                    Background Image
                  </span>
                </Radio.Button>
                <Radio.Button value="VIDEO" className="px-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Video size={14} />
                    Background Video
                  </span>
                </Radio.Button>
              </Radio.Group>
            </div>

            {/* Media Upload & Preview Box */}
            <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 transition-colors bg-white flex flex-col items-center justify-center text-center relative min-h-[220px]">
              {bgMedia ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="relative max-w-xl w-full h-56 rounded-xl overflow-hidden shadow-md bg-black">
                    {bgMediaType === "VIDEO" ? (
                      <video
                        src={bgMedia}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={bgMedia}
                        alt="Banner Background Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      danger
                      icon={<Trash2 size={16} />}
                      onClick={() => setBgMedia("")}
                      className="rounded-lg flex items-center gap-1.5"
                    >
                      Remove Media
                    </Button>
                    <span className="text-xs text-gray-500 truncate max-w-xs">
                      {bgMedia}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    {uploadingBg ? (
                      <Spin size="small" />
                    ) : bgMediaType === "VIDEO" ? (
                      <Video size={28} />
                    ) : (
                      <Upload size={28} />
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-800 mb-1">
                    {uploadingBg
                      ? "Uploading media..."
                      : `Upload ${bgMediaType === "VIDEO" ? "Video (MP4/WEBM)" : "Image (JPEG/PNG/WEBP)"}`}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Maximum file size 50MB. Recommended 1920x1080 resolution.
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95">
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept={bgMediaType === "VIDEO" ? "video/*" : "image/*"}
                      className="hidden"
                      onChange={handleBgMediaUpload}
                      disabled={uploadingBg}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 2. Main Content & Text Alignment */}
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden"
          title={
            <div className="flex items-center gap-2 text-gray-800 font-bold py-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>2. Main Content & Alignment</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Small Label / Tag */}
            <div className="md:col-span-8">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Top Label / Badge (Optional)
                </label>
                <span className="text-[11px] text-gray-400">
                  {label.length} / 100
                </span>
              </div>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value.slice(0, 100))}
                placeholder="e.g. ARCHITECTURAL HARDWARE & HOME SOLUTIONS"
                className="rounded-xl py-2 px-3 text-sm"
              />
            </div>

            {/* Text Alignment */}
            <div className="md:col-span-4">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                Text Alignment
              </label>
              <Radio.Group
                value={textAlignment}
                onChange={(e) => setTextAlignment(e.target.value)}
                buttonStyle="solid"
                className="w-full grid grid-cols-3 text-center"
              >
                <Radio.Button value="LEFT" className="flex items-center justify-center gap-1 text-xs font-medium">
                  <AlignLeft size={14} /> Left
                </Radio.Button>
                <Radio.Button value="CENTER" className="flex items-center justify-center gap-1 text-xs font-medium">
                  <AlignCenter size={14} /> Center
                </Radio.Button>
                <Radio.Button value="RIGHT" className="flex items-center justify-center gap-1 text-xs font-medium">
                  <AlignRight size={14} /> Right
                </Radio.Button>
              </Radio.Group>
            </div>

            {/* Headline / Title */}
            <div className="md:col-span-12">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Main Headline / Title <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  {heading.length} / 180
                </span>
              </div>
              <Input
                value={heading}
                onChange={(e) => setHeading(e.target.value.slice(0, 180))}
                placeholder="e.g. Better Spaces. Smarter Living."
                className="rounded-xl py-2.5 px-3 text-base font-bold text-gray-900"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-12">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Description Text (Optional)
                </label>
                <span className="text-[11px] text-gray-400">
                  {description.length} / 500
                </span>
              </div>
              <TextArea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                placeholder="e.g. Discover innovative architectural hardware and home solutions designed to combine style, durability, and functionality."
                className="rounded-xl p-3 text-sm"
              />
            </div>
          </div>
        </Card>

        {/* 3. Call to Action Buttons */}
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden"
          title={
            <div className="flex items-center gap-2 text-gray-800 font-bold py-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>3. Call to Action Buttons (Optional)</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Button */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Primary Button (Yellow Accent)
              </span>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Button Text</label>
                <Input
                  value={primaryBtnText}
                  onChange={(e) => setPrimaryBtnText(e.target.value.slice(0, 60))}
                  placeholder="e.g. Explore Our Products"
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Target Link URL</label>
                <Input
                  prefix={<LinkIcon size={14} className="text-gray-400 mr-1" />}
                  value={primaryBtnLink}
                  onChange={(e) => setPrimaryBtnLink(e.target.value.slice(0, 255))}
                  placeholder="e.g. /products"
                  className="rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Secondary Button */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Secondary Button (Outline)
              </span>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Button Text</label>
                <Input
                  value={secondaryBtnText}
                  onChange={(e) => setSecondaryBtnText(e.target.value.slice(0, 60))}
                  placeholder="e.g. Contact Us"
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Target Link URL</label>
                <Input
                  prefix={<LinkIcon size={14} className="text-gray-400 mr-1" />}
                  value={secondaryBtnLink}
                  onChange={(e) => setSecondaryBtnLink(e.target.value.slice(0, 255))}
                  placeholder="e.g. #contact"
                  className="rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 4. Optional Side Image & Position */}
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden"
          title={
            <div className="flex items-center gap-2 text-gray-800 font-bold py-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>4. Optional Side Visual Image</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Add an optional product / architectural visual displayed in the arch showcase frame alongside the headline. If omitted, the text will take full width.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Side Image Position
                </label>
                <Radio.Group
                  value={sideImagePosition}
                  onChange={(e) => setSideImagePosition(e.target.value)}
                  buttonStyle="solid"
                  className="font-medium"
                >
                  <Radio.Button value="RIGHT" className="px-5">
                    Right Side (Default)
                  </Radio.Button>
                  <Radio.Button value="LEFT" className="px-5">
                    Left Side
                  </Radio.Button>
                </Radio.Group>
              </div>

              {!sideImage ? (
                <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs px-5 py-2.5 rounded-xl border border-gray-200 transition-all">
                  <Upload size={16} />
                  <span>{uploadingSide ? "Uploading..." : "Upload Side Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSideImageUpload}
                    disabled={uploadingSide}
                  />
                </label>
              ) : (
                <Button
                  danger
                  icon={<Trash2 size={16} />}
                  onClick={() => setSideImage("")}
                  className="rounded-lg flex items-center gap-1.5"
                >
                  Remove Side Image
                </Button>
              )}
            </div>

            {/* Side Image Preview Container */}
            <div className="md:col-span-5 flex justify-center">
              {sideImage ? (
                <div className="relative w-40 h-52 rounded-3xl overflow-hidden border-2 border-indigo-200 shadow-md bg-gray-900 group">
                  <img
                    src={sideImage}
                    alt="Side Visual Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {sideImagePosition}
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-3 text-gray-400">
                  <ImageIcon size={28} className="mb-1" />
                  <span className="text-xs">No side image</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 5. Sequence & Status */}
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden"
          title={
            <div className="flex items-center gap-2 text-gray-800 font-bold py-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>5. Sequence & Active State</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Display Sequence Order
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Active banners appear on the homepage in ascending sequence (1, 2, 3...).
              </p>
              <InputNumber
                min={1}
                max={999}
                value={sequence}
                onChange={(val) => setSequence(val || 1)}
                className="w-32 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Active Banner Status
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Max 3 active banners allowed simultaneously.
                </p>
              </div>
              <Switch
                checked={isActive}
                onChange={(val) => setIsActive(val)}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            size="large"
            onClick={() => navigate("/dashboard/banners")}
            className="rounded-xl px-6"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={submitting}
            className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl px-8 font-medium shadow-md hover:shadow-indigo-500/25"
          >
            {isEdit ? "Update Banner" : "Create Banner"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;

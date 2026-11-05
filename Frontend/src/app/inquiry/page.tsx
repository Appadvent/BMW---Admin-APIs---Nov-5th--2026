"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { ArrowRight, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { sendContact, resetContactState } from '@/redux/Slice/contactSlice';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedText from "@/components/AnimatedText";
import CustomSelect from "@/components/CustomSelect";

function SupportInquiryContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const paramPart = searchParams.get("part") || searchParams.get("product") || "";
  const paramOem = searchParams.get("oem") || "";
  const paramModel = searchParams.get("model") || "";
  const paramBrand = searchParams.get("brand") || "";

  useGSAP(
    () => {
      const header = containerRef.current?.querySelector(".gsap-header");
      const leftCard = containerRef.current?.querySelector(".gsap-left");
      const rightCard = containerRef.current?.querySelector(".gsap-right");

      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      }

      if (leftCard && rightCard) {
        gsap.fromTo(
          [leftCard, rightCard],
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            delay: 0.1,
          }
        );
      }
    },
    { scope: containerRef }
  );

  const dispatch = useAppDispatch();
  const { loading: contactLoading, success: contactSuccess } = useAppSelector(
    (state) => state.contact
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    vehicleBrand: paramBrand || "",
    modelGeneration: paramModel || "",
    vinNumber: "",
    oemNumber: paramOem || "",
    productReference: paramPart || "",
    requiredQuantity: "1",
    message: "",
    consent: false,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (paramPart || paramOem || paramModel || paramBrand) {
      setFormData((prev) => ({
        ...prev,
        vehicleBrand: paramBrand || prev.vehicleBrand,
        modelGeneration: paramModel || prev.modelGeneration,
        oemNumber: paramOem || prev.oemNumber,
        productReference: paramPart || prev.productReference,
      }));
    }
  }, [paramPart, paramOem, paramModel, paramBrand]);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "First and last name is required";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Invalid email address";
        return "";
      case "phone":
        if (!value.trim()) return "Phone with area code is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { [key: string]: string } = {};
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (phoneErr) errors.phone = phoneErr;

    if (!formData.consent) {
      errors.consent = "Please accept the Privacy Policy to submit your inquiry.";
    }

    setFormErrors(errors);
    setTouched({ name: true, email: true, phone: true, consent: true });
    if (Object.keys(errors).length > 0) return;

    try {
      // If a file is attached, upload it to MinIO storage first
      let fileAttachmentUrl: string | null = null;
      if (uploadedFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", uploadedFile);
          uploadFormData.append("folder", "inquiries");
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
          const res = await fetch(`${apiBase}/api/upload`, {
            method: "POST",
            body: uploadFormData,
          });
          const resData = await res.json();
          if (resData?.data?.url) {
            fileAttachmentUrl = resData.data.url;
          }
        } catch (uploadErr) {
          console.warn("Attachment upload warning:", uploadErr);
        }
      }

      // Build a well-structured message summarizing every single detail from the form
      const structuredDetails = [
        `Vehicle: ${formData.vehicleBrand || 'N/A'} ${formData.modelGeneration || ''}`.trim(),
        formData.vinNumber ? `VIN: ${formData.vinNumber}` : '',
        formData.oemNumber ? `OEM Number: ${formData.oemNumber}` : '',
        formData.productReference ? `Product Reference: ${formData.productReference}` : '',
        formData.requiredQuantity ? `Quantity: ${formData.requiredQuantity}` : '',
        formData.country ? `Country: ${formData.country}` : '',
        uploadedFile ? (fileAttachmentUrl ? `Attachment: ${uploadedFile.name} ( ${fileAttachmentUrl} )` : `Attachment: ${uploadedFile.name}`) : '',
        formData.message ? `\nUser Message:\n${formData.message}` : '',
      ].filter(Boolean).join('\n');

      const carModelDisplay = [
        formData.vehicleBrand,
        formData.modelGeneration,
        formData.productReference ? `(${formData.productReference})` : '',
      ].filter(Boolean).join(' ');

      await dispatch(
        sendContact({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          category: `Parts Inquiry - ${formData.vehicleBrand || 'Automotive'}`,
          carModel: carModelDisplay || formData.modelGeneration || 'Custom Inquiry',
          vin: formData.vinNumber || undefined,
          oemNumber: formData.oemNumber || undefined,
          message: structuredDetails.trim(),
        })
      ).unwrap();

      // Reset form fields
      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        vehicleBrand: "",
        modelGeneration: "",
        vinNumber: "",
        oemNumber: "",
        productReference: "",
        requiredQuantity: "1",
        message: "",
        consent: false,
      });
      setUploadedFile(null);
      setTouched({});
      setFormErrors({});

      setTimeout(() => {
        dispatch(resetContactState());
      }, 7000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#070e12] text-white min-h-screen pt-12 sm:pt-16 pb-28 font-['Manrope',sans-serif]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title: Tell us what part you are looking for. */}
        <div className="gsap-header mb-10 sm:mb-12">
          <AnimatedText
            text="Tell us what part you are looking for."
            variant="typewriter-char"
            as="h1"
            start="top 85%"
            duration={0.45}
            stagger={0.02}
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 500,
              lineHeight: '110%',
              letterSpacing: '-2px',
            }}
            className="text-white text-3xl sm:text-4xl lg:text-[44px] mb-3 sm:mb-4 tracking-[-1px] sm:tracking-[-2px]"
          />
          <AnimatedText
            text="The more accurate the vehicle data you provide, the more efficiently we will be able to check compatibility and delivery options."
            variant="smooth-paragraph"
            as="p"
            start="top 85%"
            duration={0.4}
            stagger={0.015}
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0px',
              color: '#9CA2A2',
            }}
            className="text-[#9CA2A2] max-w-4xl"
          />
        </div>

        {/* 2-Column Layout matching Figma / reference image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================================= */}
          {/* LEFT CARD: Parts department */}
          {/* ========================================================================= */}
          <div className="gsap-left lg:col-span-4 bg-[#121c21] p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[460px]">
            <div>
              <AnimatedText
                text="Parts department"
                variant="typewriter-char"
                as="h2"
                start="top 85%"
                duration={0.4}
                stagger={0.02}
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 400,
                  fontSize: '22px',
                  lineHeight: '33px',
                  letterSpacing: '0px',
                }}
                className="text-white mb-8"
              />

              {/* Contact Info Items */}
              <div className="space-y-6">
                {/* E-MAIL */}
                <div className="pb-5 border-b border-[#202d33]">
                  <span className="block text-[11px] font-medium tracking-[0.1em] text-[#6b7b83] uppercase mb-1">
                    E-MAIL
                  </span>
                  <a
                    href="mailto:kontakt@motorium.pl"
                    className="text-[15px] font-normal text-white hover:text-[#33FDFF] transition-colors"
                  >
                    kontakt@motorium.pl
                  </a>
                </div>

                {/* PHONE */}
                <div className="pb-5 border-b border-[#202d33]">
                  <span className="block text-[11px] font-medium tracking-[0.1em] text-[#6b7b83] uppercase mb-1">
                    PHONE
                  </span>
                  <a
                    href="tel:+48000000000"
                    className="text-[15px] font-normal text-white hover:text-[#33FDFF] transition-colors"
                  >
                    +48 000 000 000
                  </a>
                </div>

                {/* WORKING HOURS */}
                <div>
                  <span className="block text-[11px] font-medium tracking-[0.1em] text-[#6b7b83] uppercase mb-1">
                    WORKING HOURS
                  </span>
                  <p className="text-[15px] font-normal text-white">
                    Mon.–Fri. · 9:00AM - 10:00PM
                  </p>
                </div>
              </div>
            </div>

            {/* Cyan WhatsApp Button */}
            <div className="pt-8">
              <a
                href="https://wa.me/48000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#33FDFF] hover:bg-[#00e5ee] text-[#070e12] font-semibold text-[15px] py-3.5 px-4 rounded-none flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT CARD: Send inquiry Form matching Image word-to-word */}
          {/* ========================================================================= */}
          <div className="gsap-right lg:col-span-8 bg-[#121c21] p-6 sm:p-8 md:p-10">
            {/* Header: Send inquiry / Please fill the form to send quote */}
            <div className="mb-8">
              <AnimatedText
                text="Send inquiry"
                variant="typewriter-char"
                as="h2"
                start="top 85%"
                duration={0.4}
                stagger={0.02}
                className="text-[22px] sm:text-[24px] font-medium text-white mb-1.5"
              />
              <p className="text-[13px] text-[#9CA2A2]">
                Please fill the form to send quote.
              </p>
            </div>

            {contactSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 flex items-center space-x-3 text-sm">
                <CheckCircle size={20} className="shrink-0 text-emerald-400" />
                <span>Your inquiry has been submitted successfully! We will prepare your quote within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Row 1: FIRST AND LAST NAME * & EMAIL ADDRESS * */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    FIRST AND LAST NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=""
                    className={`w-full px-4 py-3 bg-[#192429] text-white border text-sm focus:outline-none transition-colors ${touched.name && formErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#253238] focus:border-[#33FDFF]"
                      }`}
                  />
                  {touched.name && formErrors.name && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=""
                    className={`w-full px-4 py-3 bg-[#192429] text-white border text-sm focus:outline-none transition-colors ${touched.email && formErrors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#253238] focus:border-[#33FDFF]"
                      }`}
                  />
                  {touched.email && formErrors.email && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: PHONE WITH AREA CODE * & COUNTRY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    PHONE WITH AREA CODE *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=""
                    className={`w-full px-4 py-3 bg-[#192429] text-white border text-sm focus:outline-none transition-colors ${touched.phone && formErrors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#253238] focus:border-[#33FDFF]"
                      }`}
                  />
                  {touched.phone && formErrors.phone && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{formErrors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    COUNTRY
                  </label>
                  <CustomSelect
                    value={formData.country}
                    onChange={(val) => setFormData((prev) => ({ ...prev, country: val }))}
                    placeholder="Select"
                    options={[
                      { value: "Germany", label: "Germany" },
                      { value: "United Kingdom", label: "United Kingdom" },
                      { value: "United States", label: "United States" },
                    ]}
                  />
                </div>
              </div>

              {/* Row 3: VEHICLE BRAND & MODEL AND GENERATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    VEHICLE BRAND
                  </label>
                  <CustomSelect
                    value={formData.vehicleBrand}
                    onChange={(val) => setFormData((prev) => ({ ...prev, vehicleBrand: val }))}
                    placeholder="Select"
                    options={[
                      { value: "BMW", label: "BMW" },
                      { value: "Mercedes-Benz", label: "MERCEDES-BENZ" },
                      { value: "Audi", label: "AUDI" },
                      { value: "Range Rover", label: "RANGE ROVER" },
                      { value: "Porsche", label: "PORSCHE" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    MODEL AND GENERATION
                  </label>
                  <input
                    type="text"
                    name="modelGeneration"
                    value={formData.modelGeneration}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors"
                  />
                </div>
              </div>

              {/* Row 4: VIN NUMBER & OEM / OE NUMBER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    VIN NUMBER
                  </label>
                  <input
                    type="text"
                    name="vinNumber"
                    value={formData.vinNumber}
                    onChange={handleChange}
                    maxLength={17}
                    placeholder="17 characters"
                    className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors placeholder-[#536269]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    OEM / OE NUMBER
                  </label>
                  <input
                    type="text"
                    name="oemNumber"
                    value={formData.oemNumber}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors"
                  />
                </div>
              </div>

              {/* Row 5: PRODUCT REFERENCE & REQUIRED QUANTITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    PRODUCT REFERENCE
                  </label>
                  <input
                    type="text"
                    name="productReference"
                    value={formData.productReference}
                    onChange={handleChange}
                    placeholder="e.g. MT-BMW-G20-001"
                    className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors placeholder-[#536269]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                    REQUIRED QUANTITY
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="requiredQuantity"
                    value={formData.requiredQuantity}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors"
                  />
                </div>
              </div>

              {/* Row 6: ADDITIONAL MESSAGE */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                  ADDITIONAL MESSAGE
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the part you are looking for and the vehicle specifications."
                  className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors resize-none placeholder-[#536269]"
                ></textarea>
              </div>

              {/* Row 7: Dashed File Upload Box (Add a photo or document) */}
              <div>
                <label
                  htmlFor="file-upload"
                  className="w-full border border-dashed border-[#2f3d45] hover:border-[#33FDFF]/60 rounded-none p-5 flex items-center gap-3.5 cursor-pointer bg-[#141e23]/60 transition-colors group"
                >
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <div className="w-9 h-9 rounded bg-[#1e2a30] flex items-center justify-center shrink-0 text-[#8e9fa7] group-hover:text-[#33FDFF] transition-colors">
                    <Upload size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-semibold text-white group-hover:text-[#33FDFF] transition-colors">
                      {uploadedFile ? uploadedFile.name : "Add a photo or document"}
                    </p>
                    <p className="text-[11px] text-[#6b7b83]">
                      Optional, max 10MB (PDF, JPG, PNG)
                    </p>
                  </div>
                </label>
              </div>

              {/* Row 8: GDPR Consent Checkbox */}
              <div className="pt-1">
                <div className="flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded-none bg-[#192429] border border-[#253238] accent-[#33FDFF] cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-[12px] text-[#7a8a91] leading-relaxed cursor-pointer select-none">
                    I consent to the processing of data for the purpose of handling the inquiry and accept the Privacy Policy.
                  </label>
                </div>
                {touched.consent && formErrors.consent && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 pl-7">
                    <AlertCircle size={13} />
                    <span>{formErrors.consent}</span>
                  </p>
                )}
              </div>

              {/* Send inquiry Red Button matching reference screenshot */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={contactLoading || !formData.consent}
                  className="bg-[#E52320] hover:bg-[#c91d1a] disabled:bg-[#4a1c1b] disabled:text-[#8a6b6b] text-white font-semibold text-[15px] py-3.5 px-8 rounded-none flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md"
                >
                  <span>{contactLoading ? "Sending..." : "Send inquiry"}</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupportInquiryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070e12] text-white flex items-center justify-center">
          Loading Inquiry...
        </div>
      }
    >
      <SupportInquiryContent />
    </Suspense>
  );
}

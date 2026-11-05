"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
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
    issue: "",
    message: "",
  });

  useEffect(() => {
    // Keep message field clean / empty for user typing
  }, [paramPart, paramOem, paramModel]);

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
    const { name, value } = e.target;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (phoneErr) errors.phone = phoneErr;

    setFormErrors(errors);
    setTouched({ name: true, email: true, phone: true });
    if (Object.keys(errors).length > 0) return;

    try {
      const payloadPartInfo = paramPart ? ` [Part: ${paramPart}${paramOem ? `, OEM: ${paramOem}` : ''}${paramModel ? `, Model: ${paramModel}` : ''}]` : '';
      await dispatch(
        sendContact({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          category: formData.issue || "Support Request",
          carModel: paramModel,
          oemNumber: paramOem,
          message: `${formData.issue ? `[Issue: ${formData.issue}] ` : ""}${formData.message}${payloadPartInfo}`.trim(),
        })
      ).unwrap();

      // Reset form fields after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        issue: "",
        message: "",
      });
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
        {/* Page Title: Contact us / Support Request */}
        <div className="gsap-header mb-8 sm:mb-10">
          <AnimatedText
            text="Inquiry"
            variant="typewriter-char"
            as="h1"
            start="top 85%"
            duration={0.45}
            stagger={0.02}
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 500,
              
              lineHeight: '100%',
              letterSpacing: '-2.43px',
            }}
            className="text-white text-3xl sm:text-4xl lg:text-[44px] mb-4 tracking-[-1px] sm:tracking-[-2.43px]"
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

        {/* 2-Column Layout */}
        <div className="items-center">

          {/* ========================================================================= */}
          {/* RIGHT CONTENT: Submit a Support Request Form */}
          {/* ========================================================================= */}
          <div className="gsap-right lg:col-span-8 bg-[#121c21] p-5 sm:p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <AnimatedText
                text="Submit a Support Request"
                variant="typewriter-char"
                as="h2"
                start="top 85%"
                duration={0.4}
                stagger={0.02}
                className="text-[22px] sm:text-[24px] font-medium text-white mb-1.5"
              />
              <p className="text-[13px] text-[#9CA2A2]">
                We will contact you in 24 hrs.
              </p>
            </div>

            {contactSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 flex items-center space-x-3 text-sm">
                <CheckCircle size={20} className="shrink-0 text-emerald-400" />
                <span>Your support request has been submitted successfully! We will contact you within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Row 1: FIRST AND LAST NAME & EMAIL ADDRESS */}
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

              {/* Row 2: PHONE WITH AREA CODE & ISSUE */}
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
                    ISSUE
                  </label>
                  <CustomSelect
                    value={formData.issue}
                    onChange={(val) => setFormData((prev) => ({ ...prev, issue: val }))}
                    placeholder="Select"
                    options={[
                      { value: "Part Price & Availability Inquiry", label: "Part Price & Availability Inquiry" },
                      { value: "VIN Fitment Verification", label: "VIN Fitment Verification" },
                      { value: "Order & Delivery Tracking", label: "Order & Delivery Tracking" },
                      { value: "OEM Number Check", label: "OEM Number Check" },
                      { value: "General Technical Question", label: "General Technical Question" },
                    ]}
                  />
                </div>
              </div>

              {/* Row 3: ADDITIONAL MESSAGE */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.08em] text-[#8e9fa7] uppercase mb-2">
                  ADDITIONAL MESSAGE
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the part you are looking for and the vehicle specifications."
                  className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors resize-none placeholder-[#6b7b83]"
                ></textarea>
              </div>

              {/* Send inquiry cyan button matching exact Figma screenshot */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="bg-[#33FDFF] hover:bg-[#00e5ee] text-[#070e12] font-semibold text-[15px] py-3.5 px-8 rounded-none flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md"
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

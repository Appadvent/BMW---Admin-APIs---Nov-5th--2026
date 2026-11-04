"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { sendContact, resetContactState } from '@/redux/Slice/contactSlice';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
          <h1
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 500,
              fontSize: '44px',
              lineHeight: '100%',
              letterSpacing: '-2.43px',
            }}
            className="text-white mb-4 tracking-[-2.43px]"
          >
            Inquiry
          </h1>
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0px',
              color: '#9CA2A2',
            }}
            className="text-[#9CA2A2] max-w-4xl"
          >
            The more accurate the vehicle data you provide, the more efficiently we will be able to check compatibility and delivery options.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================================= */}
          {/* LEFT CARD: Parts department (Exact match to contact page) */}
          {/* ========================================================================= */}
          <div className="gsap-left lg:col-span-4 bg-[#121c21] p-8 sm:p-10 flex flex-col justify-between min-h-[460px]">
            <div>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 400,
                  fontSize: '22px',
                  lineHeight: '33px',
                  letterSpacing: '0px',
                }}
                className="text-white mb-8"
              >
                Parts department
              </h2>

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
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT CONTENT: Submit a Support Request Form */}
          {/* ========================================================================= */}
          <div className="gsap-right lg:col-span-8 bg-[#121c21] p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-[22px] sm:text-[24px] font-medium text-white mb-1.5">
                Submit a Support Request
              </h2>
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
                  <div className="relative">
                    <select
                      name="issue"
                      value={formData.issue}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#121c21] text-gray-400">Select</option>
                      <option value="Part Price & Availability Inquiry" className="bg-[#121c21] text-white">Part Price & Availability Inquiry</option>
                      <option value="VIN Fitment Verification" className="bg-[#121c21] text-white">VIN Fitment Verification</option>
                      <option value="Order & Delivery Tracking" className="bg-[#121c21] text-white">Order & Delivery Tracking</option>
                      <option value="OEM Number Check" className="bg-[#121c21] text-white">OEM Number Check</option>
                      <option value="General Technical Question" className="bg-[#121c21] text-white">General Technical Question</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
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

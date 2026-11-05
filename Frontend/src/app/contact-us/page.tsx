"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { sendContact, resetContactState } from '../../redux/Slice/contactSlice';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedText from "@/components/AnimatedText";
import CustomSelect from "@/components/CustomSelect";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ContactUsContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const paramPart = searchParams.get("part") || "";
  const paramOem = searchParams.get("oem") || "";
  const paramModel = searchParams.get("model") || "";
  const paramCategory = searchParams.get("category") || "General Inquiry";

  // GSAP Animations
  useGSAP(
    () => {
      const header = containerRef.current?.querySelector(".gsap-contact-header");
      const leftBox = containerRef.current?.querySelector(".gsap-left-box");
      const rightBox = containerRef.current?.querySelector(".gsap-right-box");

      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }
        );
      }

      if (leftBox && rightBox) {
        gsap.fromTo(
          [leftBox, rightBox],
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.15,
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
    vehicleBrand: "",
    modelGeneration: paramModel || "",
    message: paramPart ? `Inquiry regarding OEM part: ${paramPart}${paramOem ? ` (OEM: ${paramOem})` : ''}` : "",
  });

  useEffect(() => {
    if (paramPart || paramOem || paramModel) {
      setFormData((prev) => ({
        ...prev,
        modelGeneration: paramModel || prev.modelGeneration,
        message: paramPart
          ? `Inquiry regarding OEM part: ${paramPart}${paramOem ? ` (OEM: ${paramOem})` : ''}`
          : prev.message,
      }));
    }
  }, [paramPart, paramOem, paramModel]);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "First and last name is required";
        if (value.trim().length < 2) return "Minimum 2 characters required";
        return "";

      case "email":
        if (!value.trim()) return "Email address is required";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address";
        }
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const cleanPhone = value.replace(/[\s-+()]/g, "");
        if (cleanPhone.length < 7 || cleanPhone.length > 18) {
          return "Please enter a valid phone number with area code";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    if (name === "phone") {
      value = value.replace(/[^0-9+() -]/g, "");
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

  const validateAll = (): boolean => {
    const errors: { [key: string]: string } = {};
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);

    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (phoneErr) errors.phone = phoneErr;

    setFormErrors(errors);
    setTouched({
      name: true,
      email: true,
      phone: true,
    });

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.vehicleBrand || paramCategory,
        carModel: formData.modelGeneration,
        message: `${formData.country ? `[Country: ${formData.country}] ` : ''}${formData.vehicleBrand ? `[Brand: ${formData.vehicleBrand}] ` : ''}${formData.message}`.trim(),
      };

      await dispatch(sendContact(payload)).unwrap();
      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        vehicleBrand: "",
        modelGeneration: "",
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
      className="w-full bg-[#070e12] text-white min-h-screen pt-12 sm:pt-16 pb-24 font-['Manrope',sans-serif]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section (Matching exact Figma typography specifications) */}
        <div className="gsap-contact-header mb-12 sm:mb-14">
          <AnimatedText
            text="Contact us"
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
            className="text-white text-3xl sm:text-4xl lg:text-[44px] mb-4 sm:mb-5 tracking-[-1px] sm:tracking-[-2.43px]"
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

        {/* 2-Column Grid (Left: Parts department, Right: Contact us form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================================= */}
          {/* LEFT CARD: Parts department */}
          {/* ========================================================================= */}
          <div className="gsap-left-box lg:col-span-4 bg-[#121c21] p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Heading matching Figma Image 2 */}
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
                {/* WhatsApp Icon */}
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT CARD: Contact us form */}
          {/* ========================================================================= */}
          <div className="gsap-right-box lg:col-span-8 bg-[#121c21] p-5 sm:p-8 md:p-10">
            {/* Header matching Figma */}
            <div className="mb-8">
              <AnimatedText
                text="Contact us"
                variant="typewriter-char"
                as="h2"
                start="top 85%"
                duration={0.4}
                stagger={0.02}
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 500,
                  fontSize: '24px',
                  lineHeight: '120%',
                }}
                className="text-white mb-2"
              />
              <p className="text-[13px] text-[#9CA2A2]">
                Please fill the form , we will get back to you in 24 hours.
              </p>
            </div>

            {contactSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 flex items-center space-x-3 text-sm">
                <CheckCircle size={20} className="shrink-0 text-emerald-400" />
                <span>Your message has been sent successfully! We will get back to you within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Row 1: FIRST AND LAST NAME & EMAIL ADDRESS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#A6B0B5] uppercase mb-2">
                    FIRST AND LAST NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=""
                    className={`w-full px-4 py-3 bg-[#192429] text-white border text-sm focus:outline-none transition-colors ${
                      touched.name && formErrors.name
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
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#A6B0B5] uppercase mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=""
                    className={`w-full px-4 py-3 bg-[#192429] text-white border text-sm focus:outline-none transition-colors ${
                      touched.email && formErrors.email
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

              {/* Row 2: PHONE WITH AREA CODE & COUNTRY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#A6B0B5] uppercase mb-2">
                    PHONE WITH AREA CODE *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=""
                    className={`w-full px-4 py-3 bg-[#192429] text-white border text-sm focus:outline-none transition-colors ${
                      touched.phone && formErrors.phone
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
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#A6B0B5] uppercase mb-2">
                    COUNTRY
                  </label>
                  <CustomSelect
                    value={formData.country}
                    onChange={(val) => setFormData((prev) => ({ ...prev, country: val }))}
                    placeholder="Select"
                    options={[
                      { value: "Poland", label: "Poland" },
                      { value: "Germany", label: "Germany" },
                      { value: "United Kingdom", label: "United Kingdom" },
                      { value: "United States", label: "United States" },
                      { value: "France", label: "France" },
                      { value: "Italy", label: "Italy" },
                      { value: "Spain", label: "Spain" },
                      { value: "Netherlands", label: "Netherlands" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
              </div>

              {/* Row 3: VEHICLE BRAND & MODEL AND GENERATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#A6B0B5] uppercase mb-2">
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
                  <label className="block text-[11px] font-bold tracking-[0.08em] text-[#A6B0B5] uppercase mb-2">
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

              {/* Row 4: ADDITIONAL MESSAGE */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.08em] text-[#A6B0B5] uppercase mb-2">
                  ADDITIONAL MESSAGE
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the part you are looking for and the vehicle specifications."
                  className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors resize-none placeholder-[#6b7b83]"
                ></textarea>
              </div>

              {/* Submit Red Button matching Figma */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full bg-[#E32626] hover:bg-[#c91d1d] active:bg-[#b51616] text-white font-medium text-[15px] py-4 px-6 rounded-none flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{contactLoading ? "Submitting..." : "Submit"}</span>
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

export default function ContactUs() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070e12] text-white flex items-center justify-center">
          Loading Contact...
        </div>
      }
    >
      <ContactUsContent />
    </Suspense>
  );
}

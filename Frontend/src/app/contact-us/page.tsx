"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Phone, Mail, MessageCircle, Clock, ArrowRight, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { sendContact, resetContactState } from '../../redux/Slice/contactSlice';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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

  useGSAP(
    () => {
      const infoCards = containerRef.current?.querySelectorAll(".gsap-info-card");
      if (infoCards && infoCards.length > 0) {
        const infoTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#info-section",
            start: "top 85%",
            once: true,
          },
        });
        infoTl.fromTo(
          infoCards,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      }

      const formSection = containerRef.current?.querySelector(".gsap-form-section");
      const faqSection = containerRef.current?.querySelector(".gsap-faq-section");

      if (formSection || faqSection) {
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#main-content-section",
            start: "top 85%",
            once: true,
          },
        });

        if (formSection) {
          mainTl.fromTo(
            formSection,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
          );
        }
        if (faqSection) {
          mainTl.fromTo(
            faqSection,
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
            formSection ? "-=0.4" : "0"
          );
        }
      }

      ScrollTrigger.refresh();
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
    category: paramCategory,
    carModel: paramModel,
    vin: "",
    oemNumber: paramOem,
    year: "",
    message: paramPart ? `Inquiry regarding OEM part: ${paramPart}${paramOem ? ` (OEM: ${paramOem})` : ''}` : "",
  });

  useEffect(() => {
    if (paramPart || paramOem || paramModel) {
      setFormData((prev) => ({
        ...prev,
        carModel: paramModel || prev.carModel,
        oemNumber: paramOem || prev.oemNumber,
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
        if (!value.trim()) return "Full Name / Company is required";
        if (value.trim().length < 2) return "Minimum 2 characters required";
        if (value.trim().length > 60) return "Maximum 60 characters allowed";
        return "";

      case "email":
        if (!value.trim()) return "Email address is required";
        if (value.length > 100) return "Maximum 100 characters allowed";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address (e.g. name@domain.com)";
        }
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const cleanPhone = value.replace(/[\s-+()]/g, "");
        if (cleanPhone.length < 7 || cleanPhone.length > 15) {
          return "Please enter a valid phone number";
        }
        return "";

      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 5) return "Minimum 5 characters required";
        if (value.length > 1000) return "Maximum 1000 characters allowed";
        return "";

      default:
        return "";
    }
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/[^0-9+() -]/g, "");
      if (value.length > 20) return;
    } else if (name === "name" && value.length > 60) {
      return;
    } else if (name === "email" && value.length > 100) {
      return;
    } else if (name === "message" && value.length > 1000) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const errors: { [key: string]: string } = {};
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);
    const messageErr = validateField("message", formData.message);

    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (phoneErr) errors.phone = phoneErr;
    if (messageErr) errors.message = messageErr;

    setFormErrors(errors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    });

    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    try {
      await dispatch(sendContact(formData)).unwrap();
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "General Inquiry",
        carModel: "",
        vin: "",
        oemNumber: "",
        year: "",
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

  const contactInfo = [
    {
      icon: <Phone size={24} className="text-[#00C2CB] mb-4 mx-auto" />,
      title: "HOTLINE / PHONE",
      main: "+1 800 555 0199",
      sub: "Mon - Fri: 8:00 AM - 6:00 PM EST",
    },
    {
      icon: <Mail size={24} className="text-[#00C2CB] mb-4 mx-auto" />,
      title: "EMAIL SUPPORT",
      main: "support@motorium-parts.com",
      sub: "Response within 2-4 business hours",
    },
    {
      icon: <MessageCircle size={24} className="text-[#25D366] mb-4 mx-auto" />,
      title: "WHATSAPP",
      main: "+1 800 555 0199",
      sub: "Instant VIN fitment & catalog check",
    },
  ];

  const faqs = [
    {
      question: "How is parts compatibility verified?",
      answer:
        "Every inquiry is cross-referenced against factory manufacturer catalogs (BMW ETK, Mercedes EPC, Audi PR codes) using your 17-character VIN, guaranteeing 100% factory fitment.",
    },
    {
      question: "What is the condition of body and lighting parts?",
      answer:
        "All items in our catalog are genuine OEM parts (bumpers, shells, headlights, lenses). Mounting tabs, structural integrity, and lens clarity are verified prior to dispatch.",
    },
    {
      question: "Do you supply wholesale orders to repair shops?",
      answer:
        "Yes, we partner with authorized collision centers, independent body shops, and fleet managers across North America and Europe with dedicated B2B trade pricing.",
    },
    {
      question: "How quickly will I receive an official quotation (RFQ)?",
      answer:
        "Standard quote turnaround is between 2 to 4 business hours. For urgent requests, please contact our hotline or message our technical team on WhatsApp.",
    },
  ];

  return (
    <div ref={containerRef} className="w-full bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-[#0E1524] border-b border-[#26354A]/60 text-white pt-36 pb-20 flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#00C2CB_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/25 text-[#00C2CB] text-xs font-semibold mb-4 tracking-wider uppercase">
            Customer Service &amp; Technical Support
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[46px] font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight text-white">
            Request a Quote &amp; VIN Fitment Verification
          </h1>
          <p className="text-slate-300 text-[15px] sm:text-[16px] font-normal max-w-3xl leading-relaxed">
            Need an OEM bumper, headlight, or replacement component for BMW, Mercedes-Benz, Audi, or Porsche? Provide your vehicle VIN or required part number. Our technical team will confirm factory fitment and price availability within 2-4 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section id="info-section" className="w-full bg-[#0B0F19] py-8 md:py-12 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="gsap-info-card bg-[#161F30] rounded-xl p-8 text-center border border-[#26354A] hover:border-[#00C2CB]/50 transition-all duration-300 shadow-lg group"
            >
              <div className="p-3 bg-[#0E1524] rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-[#26354A] group-hover:border-[#00C2CB]/40 transition-colors">
                {info.icon}
              </div>
              <p className="text-[11px] font-bold text-[#00C2CB] tracking-[0.1em] mb-2.5 uppercase mt-3">
                {info.title}
              </p>
              <h3 className="text-[17px] font-bold text-white mb-1.5">{info.main}</h3>
              <p className="text-[13px] font-normal text-slate-400">{info.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Area: Form & FAQ */}
      <section id="main-content-section" className="w-full bg-[#0B0F19] py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column: Form */}
          <div className="gsap-form-section lg:col-span-7 bg-[#161F30] border border-[#26354A] rounded-2xl p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-[11px] font-bold uppercase tracking-wider mb-3">
              Request for Quotation (RFQ)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
              Tell us what part you are looking for
            </h2>
            <p className="text-sm text-slate-300 mb-8 leading-relaxed">
              Not sure if a part fits your vehicle? Provide your 17-digit VIN from your vehicle registration — we will verify catalog compatibility free of charge.
            </p>

            {contactSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 rounded-xl flex items-center space-x-3 text-sm">
                <CheckCircle size={20} className="shrink-0 text-emerald-400" />
                <span>Your inquiry has been submitted successfully! Our technical advisor will contact you shortly with quotation details.</span>
              </div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5" onSubmit={handleContactSubmit} noValidate>
              <div className="col-span-1">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-200">Full Name / Company *</label>
                  <span className="text-[11px] text-slate-400">{formData.name.length}/60</span>
                </div>
                <input
                  type="text"
                  name="name"
                  maxLength={60}
                  value={formData.name}
                  onChange={handleContactChange}
                  onBlur={handleBlur}
                  placeholder="e.g. John Smith / Auto Repair LLC"
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none text-sm transition-all bg-[#0E1524] text-white placeholder-slate-500 ${
                    touched.name && formErrors.name
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#26354A] focus:border-[#00C2CB]"
                  }`}
                />
                {touched.name && formErrors.name && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formErrors.name}</span>
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-200">Email Address *</label>
                  <span className="text-[11px] text-slate-400">{formData.email.length}/100</span>
                </div>
                <input
                  type="email"
                  name="email"
                  maxLength={100}
                  value={formData.email}
                  onChange={handleContactChange}
                  onBlur={handleBlur}
                  placeholder="contact@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none text-sm transition-all bg-[#0E1524] text-white placeholder-slate-500 ${
                    touched.email && formErrors.email
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#26354A] focus:border-[#00C2CB]"
                  }`}
                />
                {touched.email && formErrors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-200">Phone Number *</label>
                  <span className="text-[11px] text-slate-400">Digits only</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  maxLength={15}
                  value={formData.phone}
                  onChange={handleContactChange}
                  onBlur={handleBlur}
                  placeholder="e.g. +1 555 123 4567"
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none text-sm transition-all bg-[#0E1524] text-white placeholder-slate-500 ${
                    touched.phone && formErrors.phone
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#26354A] focus:border-[#00C2CB]"
                  }`}
                />
                {touched.phone && formErrors.phone && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formErrors.phone}</span>
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Part Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleContactChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#26354A] focus:outline-none focus:border-[#00C2CB] text-sm bg-[#0E1524] text-slate-200 cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry / Quotation</option>
                  <option value="BMW OEM Bumper Assembly">BMW OEM Bumper Assembly</option>
                  <option value="BMW OEM Bumper Shell">BMW OEM Bumper Shell</option>
                  <option value="Headlight OEM BMW">Headlight OEM BMW</option>
                  <option value="Lens and Housing - BMW / BENZ">Lens and Housing - BMW / BENZ</option>
                  <option value="B2B Workshop Inquiry">B2B Workshop / Fleet Wholesale Inquiry</option>
                </select>
              </div>

              {/* Automotive Fitment Section */}
              <div className="col-span-1 md:col-span-2 p-4 bg-[#0E1524] rounded-xl border border-[#26354A]">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-[#00C2CB]" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    Vehicle details for factory fitment verification (Optional)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleContactChange}
                      placeholder="e.g. BMW 5 Series F10"
                      className="w-full px-3 py-1.5 rounded-md border border-[#26354A] text-xs bg-[#161F30] text-white placeholder-slate-500 focus:border-[#00C2CB] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      OEM Part Number
                    </label>
                    <input
                      type="text"
                      name="oemNumber"
                      value={formData.oemNumber}
                      onChange={handleContactChange}
                      placeholder="e.g. 51118056586"
                      className="w-full px-3 py-1.5 rounded-md border border-[#26354A] text-xs bg-[#161F30] text-white placeholder-slate-500 focus:border-[#00C2CB] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Vehicle VIN
                    </label>
                    <input
                      type="text"
                      name="vin"
                      maxLength={17}
                      value={formData.vin}
                      onChange={handleContactChange}
                      placeholder="e.g. WBA5A71020G..."
                      className="w-full px-3 py-1.5 rounded-md border border-[#26354A] text-xs uppercase bg-[#161F30] text-white placeholder-slate-500 focus:border-[#00C2CB] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleContactChange}
                      placeholder="e.g. 2016"
                      className="w-full px-3 py-1.5 rounded-md border border-[#26354A] text-xs bg-[#161F30] text-white placeholder-slate-500 focus:border-[#00C2CB] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-200">Message / Additional Notes *</label>
                  <span className="text-[11px] text-slate-400">{formData.message.length}/1000</span>
                </div>
                <textarea
                  name="message"
                  maxLength={1000}
                  value={formData.message}
                  onChange={handleContactChange}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="Describe the required part, package trim, mounting tabs, or specific requirements..."
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none text-sm resize-none transition-all bg-[#0E1524] text-white placeholder-slate-500 ${
                    touched.message && formErrors.message
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#26354A] focus:border-[#00C2CB]"
                  }`}
                ></textarea>
                {touched.message && formErrors.message && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{formErrors.message}</span>
                  </p>
                )}
              </div>

              <div className="col-span-1 md:col-span-2 pt-2">
                <button
                  disabled={contactLoading}
                  type="submit"
                  className="w-full bg-[#00C2CB] hover:bg-[#00B0B8] active:bg-[#009EA6] text-[#0B0F19] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
                >
                  {contactLoading ? (
                    <span>Submitting inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Part Request (RFQ)</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: FAQ */}
          <div className="gsap-faq-section lg:col-span-5 flex flex-col justify-start">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-[11px] font-bold uppercase tracking-wider mb-3 w-fit">
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 leading-tight">
              Questions &amp; Answers
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[#161F30] rounded-xl p-5 sm:p-6 border border-[#26354A] hover:border-[#00C2CB]/40 transition-colors">
                  <h4 className="text-[14px] font-bold text-white mb-2">{faq.question}</h4>
                  <p className="text-[13px] font-normal text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactUs() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">Loading...</div>}>
      <ContactUsContent />
    </Suspense>
  );
}

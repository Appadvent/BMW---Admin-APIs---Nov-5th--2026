"use client";

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { sendContact, resetContactState } from '../redux/Slice/contactSlice';
import { motion, AnimatePresence } from 'framer-motion';

interface EnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductTitle?: string;
  initialOem?: string;
  initialCategory?: string;
}

export default function EnquiryPopup({
  isOpen,
  onClose,
  initialProductTitle = "",
  initialOem = "",
  initialCategory = "General Inquiry",
}: EnquiryPopupProps) {
  const dispatch = useAppDispatch();
  const { loading: contactLoading, success: contactSuccess } = useAppSelector(
    (state) => state.contact
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: initialCategory || "General Inquiry",
    carModel: "",
    vin: "",
    oemNumber: initialOem || "",
    year: "",
    message: initialProductTitle ? `Inquiry regarding OEM part: ${initialProductTitle} (OEM: ${initialOem || 'N/A'})` : "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        category: initialCategory || "General Inquiry",
        oemNumber: initialOem || prev.oemNumber,
        message: initialProductTitle
          ? `Inquiry regarding OEM part: ${initialProductTitle}${initialOem ? ` (OEM: ${initialOem})` : ''}`
          : prev.message,
      }));
    }
  }, [isOpen, initialProductTitle, initialOem, initialCategory]);

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
          return "Please enter a valid email address";
        }
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const cleanPhone = value.replace(/[\s-]/g, "");
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

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/[^0-9+]/g, "");
      if (value.length > 15) return;
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-[#161F30] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#26354A] text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors bg-[#0E1524] hover:bg-[#1E293B] border border-[#26354A] rounded-full cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C2CB] bg-[#00C2CB]/10 border border-[#00C2CB]/30 px-2.5 py-1 rounded">
              VIN Verification &amp; OEM Quotation
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-2 mb-1">
              Request for Quotation (RFQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Provide vehicle details and part numbers. Our technical specialists will verify factory catalog fitment and respond with an official quotation.
            </p>
          </div>

          {contactSuccess && (
            <div className="mb-5 p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 rounded-lg flex items-center space-x-2.5 text-sm">
              <CheckCircle size={18} className="shrink-0 text-emerald-400" />
              <span>Your inquiry has been submitted successfully! Our technical team will contact you shortly.</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleContactSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Full Name / Company *
                </label>
                <input
                  type="text"
                  name="name"
                  maxLength={60}
                  value={formData.name}
                  onChange={handleContactChange}
                  onBlur={handleBlur}
                  placeholder="e.g. John Smith / Auto Repair LLC"
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm transition-all bg-[#0E1524] text-white placeholder-slate-500 ${
                    touched.name && formErrors.name
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#26354A] focus:border-[#00C2CB]"
                  }`}
                />
                {touched.name && formErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleContactChange}
                  onBlur={handleBlur}
                  placeholder="e.g. +1 555 123 4567"
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm transition-all bg-[#0E1524] text-white placeholder-slate-500 ${
                    touched.phone && formErrors.phone
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#26354A] focus:border-[#00C2CB]"
                  }`}
                />
                {touched.phone && formErrors.phone && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  maxLength={100}
                  value={formData.email}
                  onChange={handleContactChange}
                  onBlur={handleBlur}
                  placeholder="e.g. contact@example.com"
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm transition-all bg-[#0E1524] text-white placeholder-slate-500 ${
                    touched.email && formErrors.email
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#26354A] focus:border-[#00C2CB]"
                  }`}
                />
                {touched.email && formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Part Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleContactChange}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#26354A] text-sm bg-[#0E1524] text-slate-200 focus:border-[#00C2CB] cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry / Parts Check</option>
                  <option value="BMW OEM Bumper Assembly">BMW OEM Bumper Assembly</option>
                  <option value="BMW OEM Bumper Shell">BMW OEM Bumper Shell</option>
                  <option value="Headlight OEM BMW">Headlight OEM BMW</option>
                  <option value="Lens and Housing - BMW / BENZ">Lens and Housing - BMW / BENZ</option>
                  <option value="B2B Workshop Inquiry">B2B Workshop / Fleet Wholesale Inquiry</option>
                </select>
              </div>
            </div>

            {/* Automotive Fitment Details */}
            <div className="p-3.5 bg-[#0E1524] rounded-xl border border-[#26354A] space-y-3">
              <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>Vehicle details for fitment verification:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleContactChange}
                    placeholder="e.g. BMW 5 Series F10 LCI"
                    className="w-full px-3 py-1.5 rounded-md border border-[#26354A] text-xs bg-[#161F30] text-white placeholder-slate-500 focus:border-[#00C2CB]"
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
                    className="w-full px-3 py-1.5 rounded-md border border-[#26354A] text-xs bg-[#161F30] text-white placeholder-slate-500 focus:border-[#00C2CB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    VIN Number (17 characters)
                  </label>
                  <input
                    type="text"
                    name="vin"
                    maxLength={17}
                    value={formData.vin}
                    onChange={handleContactChange}
                    placeholder="e.g. WBA5A71020G123456"
                    className="w-full px-3 py-1.5 rounded-md border border-[#26354A] text-xs uppercase bg-[#161F30] text-white placeholder-slate-500 focus:border-[#00C2CB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Year of Manufacture
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleContactChange}
                    placeholder="e.g. 2016"
                    className="w-full px-3 py-1.5 rounded-md border border-[#26354A] text-xs bg-[#161F30] text-white placeholder-slate-500 focus:border-[#00C2CB]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-200">
                  Message / Additional Notes *
                </label>
                <span className="text-[11px] text-slate-400">{formData.message.length}/1000</span>
              </div>
              <textarea
                name="message"
                maxLength={1000}
                value={formData.message}
                onChange={handleContactChange}
                onBlur={handleBlur}
                rows={3}
                placeholder="Describe your requirement (e.g. trim level, parking sensor holes, package options)..."
                className={`w-full px-3.5 py-2 rounded-lg border text-sm resize-none transition-all bg-[#0E1524] text-white placeholder-slate-500 ${
                  touched.message && formErrors.message
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-[#26354A] focus:border-[#00C2CB]"
                }`}
              ></textarea>
              {touched.message && formErrors.message && (
                <p className="text-red-400 text-xs mt-1">{formErrors.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                disabled={contactLoading}
                type="submit"
                className="w-full bg-[#00C2CB] hover:bg-[#00B0B8] active:bg-[#009EA6] text-[#0B0F19] font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 text-sm disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/10"
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MessageCircle, Shield, Car, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchProductById, clearCurrentProduct } from '../redux/Slice/productSlice';

interface SpecificationItem {
  id?: number;
  name: string;
  value: string;
  order?: number;
}

interface FeatureItem {
  id?: number;
  title: string;
  description?: string;
  image?: string | null;
}

export default function ProductDetail() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const productId = params?.id as string;

  const { currentProduct, currentLoading, currentError } = useAppSelector(
    (state) => state.products
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [productId, dispatch]);

  useEffect(() => {
    if (currentProduct?.image) {
      setSelectedImage(currentProduct.image);
    }
  }, [currentProduct]);

  const galleryImages: string[] = [];
  if (currentProduct?.image) {
    galleryImages.push(currentProduct.image);
  }
  if (currentProduct?.features && Array.isArray(currentProduct.features)) {
    currentProduct.features.forEach((feat: FeatureItem) => {
      if (feat.image && !galleryImages.includes(feat.image)) {
        galleryImages.push(feat.image);
      }
    });
  }

  // Specifications list sorted by order
  const specifications: SpecificationItem[] = Array.isArray(
    currentProduct?.specifications
  )
    ? [...currentProduct.specifications].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      )
    : [];

  const oem = currentProduct?.oemNumber || (specifications.find((s) => s.name?.toLowerCase().includes("oem"))?.value);
  const model = currentProduct?.model || (specifications.find((s) => s.name?.toLowerCase().includes("model"))?.value);
  const make = currentProduct?.make || "BMW";

  const getWhatsAppLink = () => {
    const title = currentProduct?.title || 'OEM Automotive Part';
    const oemStr = oem ? ` [OEM: ${oem}]` : '';
    const text = encodeURIComponent(
      `Hello, I would like to inquire about the part: "${title}"${oemStr}. Please provide an RFQ quote and verify fitment against my vehicle VIN.`
    );
    return `https://wa.me/48221234567?text=${text}`;
  };

  const categoryName =
    currentProduct?.category?.name ||
    currentProduct?.category?.title ||
    'OEM AUTOMOTIVE PARTS';

  // Loading skeleton state
  if (currentLoading) {
    return (
      <div className="w-full bg-[#0B0F19] text-[#F8FAFC] min-h-screen pt-24 pb-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="h-4 w-64 bg-[#161F30] rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <div className="w-full h-[460px] bg-[#161F30] rounded-2xl animate-pulse" />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="h-6 w-32 bg-[#161F30] rounded animate-pulse" />
              <div className="h-10 w-full bg-[#161F30] rounded animate-pulse" />
              <div className="h-28 w-full bg-[#161F30] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (currentError || (!currentLoading && !currentProduct)) {
    return (
      <div className="w-full bg-[#0B0F19] text-[#F8FAFC] min-h-screen pt-28 pb-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-[#161F30] p-10 sm:p-14 rounded-2xl border border-[#26354A]">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Part Not Found
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              {currentError || "The requested automotive component does not exist in our active catalogue."}
            </p>
            <Link
              href="/products"
              className="bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] font-bold text-sm px-6 py-3 rounded-xl inline-block transition-all"
            >
              Back to Parts Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0B0F19] text-[#F8FAFC] min-h-screen pt-6 pb-24">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-[#26354A] bg-[#0E1524]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-3.5">
          <nav className="flex items-center flex-wrap gap-2 text-xs sm:text-[13px] text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-600">›</span>
            <Link href="/products" className="hover:text-white transition-colors">
              Parts Catalogue
            </Link>
            <span className="text-slate-600">›</span>
            <span className="text-slate-300 font-medium">
              {categoryName}
            </span>
            <span className="text-slate-600">›</span>
            <span className="font-bold text-white truncate max-w-[240px] sm:max-w-none">
              {currentProduct?.title}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Showcase Section matching Figma Frame 4 */}
      <div className="py-10 md:py-14">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] rounded-2xl overflow-hidden bg-[#0F172A] border border-[#26354A] flex items-center justify-center p-6 shadow-xl">
                {selectedImage || currentProduct?.image ? (
                  <img
                    src={selectedImage || currentProduct?.image}
                    alt={currentProduct?.title || 'Automotive OEM Part'}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,194,203,0.15)]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Car size={48} className="text-slate-600" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No Image Available</span>
                  </div>
                )}
                {make && (
                  <div className="absolute top-4 left-4 bg-[#0B0F19]/90 border border-[#26354A] text-white text-xs font-black px-3 py-1 rounded-lg backdrop-blur-md">
                    {make}
                  </div>
                )}
                {currentProduct?.tag && (
                  <div className="absolute top-4 right-4 bg-[#00C2CB] text-[#0B0F19] text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                    {currentProduct.tag}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((imgUrl, idx) => {
                    const isActive = selectedImage === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`relative w-24 h-20 rounded-xl overflow-hidden bg-[#0F172A] border-2 transition-all p-1.5 shrink-0 cursor-pointer ${
                          isActive ? 'border-[#00C2CB] shadow-md shadow-cyan-900/30' : 'border-[#26354A] hover:border-slate-500'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Title, OEM number, Compatibility, Actions */}
            <div className="lg:col-span-6 flex flex-col justify-start bg-[#161F30] p-6 sm:p-10 rounded-2xl border border-[#26354A] shadow-xl">
              <div className="flex items-center gap-2.5 flex-wrap mb-3">
                <span className="text-[#00C2CB] font-extrabold text-xs uppercase tracking-widest">
                  {categoryName}
                </span>
                {oem && (
                  <span className="font-mono text-xs font-bold text-white bg-[#0B0F19] px-3 py-1 rounded-lg border border-[#26354A]">
                    OEM: {oem}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {currentProduct?.title}
              </h1>

              {/* Vehicle Compatibility Box */}
              <div className="mb-6 p-4 rounded-xl bg-[#0B0F19] border border-[#26354A] flex items-start gap-3">
                <Car size={22} className="text-[#00C2CB] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-white block mb-0.5">Vehicle Compatibility:</span>
                  <span className="text-slate-300">
                    {model ? `Fits: ${make} ${model}. ` : `Engineered for ${make}. `}
                    Factory VIN fitment verification is available prior to dispatch.
                  </span>
                </div>
              </div>

              {/* Description */}
              <div
                className="text-slate-300 text-sm leading-relaxed mb-6 font-normal space-y-2"
                dangerouslySetInnerHTML={{
                  __html: currentProduct?.description || '',
                }}
              />

              {/* VIN Verification Guarantee Box */}
              <div className="mb-6 p-3.5 rounded-xl bg-[#00C2CB]/10 border border-[#00C2CB]/30 flex items-center gap-2.5 text-xs text-[#00C2CB] font-semibold">
                <Shield size={18} className="shrink-0" />
                <span>100% Guaranteed OEM Fitment — verified against 17-digit VIN before order fulfillment.</span>
              </div>

              {/* Action Buttons Row */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={`/contact-us?part=${encodeURIComponent(currentProduct?.title || '')}&oem=${encodeURIComponent(oem || '')}&model=${encodeURIComponent(model || '')}`}
                    className="flex-1 bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] font-bold text-sm px-6 py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all text-center cursor-pointer"
                  >
                    <span>Request for Quotation (RFQ)</span>
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#0B0F19] hover:bg-[#1E293B] text-white border border-[#26354A] hover:border-[#00C2CB] font-bold text-sm px-6 py-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all text-center cursor-pointer"
                  >
                    <MessageCircle size={18} className="text-[#00C2CB]" />
                    <span>Ask Question</span>
                  </a>
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Typical B2B quotation response: within 1-2 business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Specification Table matching Figma Frame 4 */}
      <div className="py-12 md:py-16 bg-[#0E1524] border-t border-[#26354A]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00C2CB]"></span>
            <p className="text-[#00C2CB] font-bold text-xs uppercase tracking-widest">
              TECHNICAL DATA
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8 tracking-tight">
            Product specification
          </h2>

          <div className="bg-[#161F30] rounded-2xl border border-[#26354A] overflow-hidden max-w-4xl shadow-xl">
            {specifications.length > 0 ? (
              <div className="divide-y divide-[#26354A]">
                {specifications.map((spec, index) => (
                  <div
                    key={spec.id || index}
                    className="grid grid-cols-1 sm:grid-cols-12 px-4 sm:px-6 py-3.5 sm:py-4 items-start sm:items-center hover:bg-[#0B0F19]/40 transition-colors gap-1 sm:gap-0"
                  >
                    <div className="sm:col-span-4 font-bold text-white text-xs sm:text-sm">
                      {spec.name}
                    </div>
                    <div className="sm:col-span-8 text-slate-300 text-xs sm:text-sm font-medium">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                Detailed technical parameters verified individually against catalogue number.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

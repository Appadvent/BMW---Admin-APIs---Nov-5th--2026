'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MessageCircle, ShieldCheck, Car, ArrowRight } from 'lucide-react';
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

  // WhatsApp enquiry link generator
  const getWhatsAppLink = () => {
    const title = currentProduct?.title || 'OEM Automotive Part';
    const oemStr = oem ? ` [OEM: ${oem}]` : '';
    const text = encodeURIComponent(
      `Hello, I would like to inquire about the part: "${title}"${oemStr}. Please provide a quote and verify compatibility against my VIN.`
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
      <div className="w-full bg-[#F8F9FA] min-h-screen pt-24 sm:pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-full h-[400px] bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (currentError || (!currentLoading && !currentProduct)) {
    return (
      <div className="w-full bg-[#F8F9FA] min-h-screen pt-28 sm:pt-36 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white p-10 sm:p-14 rounded-2xl border border-gray-200 shadow-sm">
            <h1 className="text-xl md:text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-3">
              Part Not Found
            </h1>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {currentError ||
                "The requested automotive component does not exist or has been updated in our catalogue."}
            </p>
            <Link
              href="/products"
              className="bg-[#C82021] hover:bg-[#A01819] text-white font-semibold text-sm px-6 py-3 rounded-lg inline-block shadow-sm transition-colors"
            >
              Back to Parts Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F9FA] min-h-screen pt-20 sm:pt-24">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
          <nav className="flex items-center flex-wrap gap-2 text-xs sm:text-[13px] text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="text-gray-400">›</span>
            <Link href="/products" className="hover:text-black transition-colors">
              Parts Catalogue
            </Link>
            <span className="text-gray-400">›</span>
            <span className="hover:text-black transition-colors font-medium text-gray-700">
              {categoryName}
            </span>
            <span className="text-gray-400">›</span>
            <span className="font-bold text-[#0F172A] truncate max-w-[220px] sm:max-w-none">
              {currentProduct?.title}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Showcase Section */}
      <div className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative w-full h-[360px] sm:h-[460px] md:h-[480px] rounded-2xl overflow-hidden bg-white border border-gray-200/90 shadow-sm flex items-center justify-center p-4">
                {selectedImage || currentProduct?.image ? (
                  <img
                    src={selectedImage || currentProduct?.image}
                    alt={currentProduct?.title || 'Automotive OEM Part'}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Car size={48} className="text-gray-300" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">No Image Available</span>
                  </div>
                )}
                {make && (
                  <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-md shadow-sm">
                    {make}
                  </div>
                )}
                {currentProduct?.tag && (
                  <div className="absolute top-4 right-4 bg-[#C82021] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {currentProduct.tag}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((imgUrl, idx) => {
                    const isActive = selectedImage === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`relative w-24 h-20 rounded-xl overflow-hidden bg-white border-2 transition-all p-1 shrink-0 cursor-pointer ${
                          isActive ? 'border-[#C82021] shadow-md' : 'border-gray-200 hover:border-gray-300'
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

            {/* Right Column: Automotive Fitment, Title, Description, and RFQ CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-start bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-[#C82021] font-extrabold text-xs uppercase tracking-widest">
                  {categoryName}
                </span>
                {oem && (
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    OEM: {oem}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-4 leading-tight">
                {currentProduct?.title}
              </h1>

              {/* Vehicle Compatibility Banner */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Car size={22} className="text-[#C82021] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-gray-900 block mb-0.5">Vehicle Compatibility:</span>
                  <span className="text-gray-600">
                    {model ? `Fits: ${make} ${model}. ` : `Component engineered for ${make}. `}
                    We recommend free VIN verification prior to placing your order.
                  </span>
                </div>
              </div>

              {/* Description */}
              <div
                className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal space-y-2"
                dangerouslySetInnerHTML={{
                  __html: currentProduct?.description || '',
                }}
              />

              {/* VIN Verification Guarantee Box */}
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>100% Guaranteed OEM Fitment — we verify compatibility in factory catalogues before dispatch.</span>
              </div>

              {/* Action Buttons Row */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={`/contact-us?part=${encodeURIComponent(currentProduct?.title || '')}&oem=${encodeURIComponent(oem || '')}&model=${encodeURIComponent(model || '')}`}
                    className="flex-1 bg-[#C82021] hover:bg-[#A01819] text-white font-bold text-sm px-6 py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all text-center"
                  >
                    <span>Request for Quotation (RFQ)</span>
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#15803D] hover:bg-green-700 text-white font-bold text-sm px-6 py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                  </a>
                </div>
                <p className="text-[11px] text-gray-400 text-center">
                  Typical quotation turnaround: within 1-2 business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Specifications & Fitment Table */}
      <div className="py-10 md:py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C82021]"></span>
            <p className="text-[#C82021] font-bold text-xs uppercase tracking-widest">TECHNICAL SPECIFICATIONS</p>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
            Technical Specifications & Fitment Data
          </h2>

          <div className="bg-[#F8F9FA] rounded-2xl border border-gray-200 overflow-hidden max-w-4xl shadow-xs">
            {specifications.length > 0 ? (
              <div className="divide-y divide-gray-200/80">
                {specifications.map((spec, index) => (
                  <div
                    key={spec.id || index}
                    className="grid grid-cols-12 px-6 py-3.5 items-center hover:bg-white transition-colors"
                  >
                    <div className="col-span-5 sm:col-span-4 font-bold text-[#0F172A] text-xs sm:text-sm">
                      {spec.name}
                    </div>
                    <div className="col-span-7 sm:col-span-8 text-gray-700 text-xs sm:text-sm font-medium">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                Detailed technical parameters verified individually for this catalogue number.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

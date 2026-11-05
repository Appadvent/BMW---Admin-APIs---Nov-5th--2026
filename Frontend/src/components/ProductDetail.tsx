'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, AlertTriangle, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchProductById, fetchProducts, clearCurrentProduct } from '../redux/Slice/productSlice';
import ProductCard from './ProductCard';

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

  const { currentProduct, currentLoading, currentError, list: allProducts } = useAppSelector(
    (state) => state.products
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
    dispatch(fetchProducts());
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
  if (currentProduct?.images && Array.isArray(currentProduct.images)) {
    currentProduct.images.forEach((img: string) => {
      if (img && !galleryImages.includes(img)) {
        galleryImages.push(img);
      }
    });
  }
  if (currentProduct?.features && Array.isArray(currentProduct.features)) {
    currentProduct.features.forEach((feat: FeatureItem) => {
      if (feat.image && !galleryImages.includes(feat.image)) {
        galleryImages.push(feat.image);
      }
    });
  }

  // Specifications
  const specifications: SpecificationItem[] = Array.isArray(currentProduct?.specifications)
    ? [...currentProduct.specifications].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const getSpec = (key: string, fallback = '') => {
    const found = specifications.find((s) => s.name?.toLowerCase().includes(key.toLowerCase()));
    return found ? found.value : fallback;
  };

  const oem = currentProduct?.oemNumber || getSpec('oem', 'Sample-data');
  const model = currentProduct?.model || getSpec('model', 'G20');
  const make = currentProduct?.make || getSpec('brand', 'BMW');
  const generation = getSpec('generation', 'G20 · 2019 - 2023');
  const finish = currentProduct?.finish || getSpec('finish', 'Primed');
  const reference = getSpec('reference', `MT-${make.toUpperCase()}-${model.toUpperCase()}-001`);
  const material = getSpec('material', 'Plastic');
  const modelYear = getSpec('year', '2019 - 2022');
  const fittingPosition = getSpec('position', 'Front');
  const pdc = getSpec('pdc', 'Primed');
  const productState = getSpec('condition', 'New - demo data');
  const radarSupport = getSpec('radar', 'Not specified');
  const cameraSupport = getSpec('camera', 'Not specified');
  const regionalSpec = getSpec('specification', 'EU - to be confirmed');
  const modelSeries = getSpec('series', '3 Series');

  const title = currentProduct?.title || 'BMW 3 Series G20 Front Bumper';
  const categoryBadge = currentProduct?.badge || `${make.toUpperCase()} · BUMPERS`;

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello, I would like to inquire about the part: "${title}" (OEM: ${oem}). Please provide a quote.`
    );
    return `https://wa.me/48000000000?text=${text}`;
  };

  // Recommended products list (excluding current)
  const recommendedParts = Array.isArray(allProducts)
    ? allProducts.filter((p: any) => String(p.id || p._id) !== String(productId)).slice(0, 4)
    : [];

  // Loading skeleton state
  if (currentLoading) {
    return (
      <div className="w-full bg-[#070e12] text-[#F8FAFC] min-h-screen pt-12 pb-24 font-['Manrope',sans-serif]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-48 bg-[#121c21] rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <div className="w-full h-[460px] bg-[#121c21] rounded animate-pulse" />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="h-6 w-32 bg-[#121c21] rounded animate-pulse" />
              <div className="h-10 w-full bg-[#121c21] rounded animate-pulse" />
              <div className="h-36 w-full bg-[#121c21] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (currentError || (!currentLoading && !currentProduct)) {
    return (
      <div className="w-full bg-[#070e12] text-[#F8FAFC] min-h-screen pt-28 pb-24 font-['Manrope',sans-serif]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-[#121c21] p-10 sm:p-14 border border-[#202d33]">
            <h1 className="text-2xl sm:text-3xl font-medium text-white mb-3">
              Part Not Found
            </h1>
            <p className="text-[#9CA2A2] text-sm mb-6">
              {currentError || "The requested automotive component does not exist in our active catalogue."}
            </p>
            <Link
              href="/products"
              className="bg-[#33FDFF] hover:bg-[#00e5ee] text-[#070e12] font-semibold text-sm px-6 py-3 inline-block transition-all"
            >
              Back to Parts Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#070e12] text-white min-h-screen pt-8 pb-28 font-['Manrope',sans-serif]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumb bar matching Figma */}
        <nav className="flex items-center flex-wrap gap-1.5 text-xs text-[#00E5EE] mb-8">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="text-[#00E5EE]/60">|</span>
          <Link href="/products" className="hover:underline">Parts</Link>
          <span className="text-[#00E5EE]/60">|</span>
          <Link href={`/products?brand=${encodeURIComponent(make)}`} className="hover:underline">{make} Series 3</Link>
          <span className="text-[#00E5EE]/60">|</span>
          <span className="text-[#00E5EE] truncate max-w-[280px] sm:max-w-none">{title}</span>
        </nav>

        {/* 2. Main Product Showcase Grid (Left: Image Gallery, Right: Product Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20 sm:mb-24">
          {/* Left Column: Big Image Display & Thumbnails */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] sm:aspect-square bg-black border border-[#1b2d30] overflow-hidden flex items-center justify-center mb-4">
              <img
                src={selectedImage || currentProduct?.image || '/products/bumper_assy_row_1.jpeg'}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnails row */}
            {galleryImages.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = (selectedImage || currentProduct?.image) === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-black border transition-all shrink-0 cursor-pointer overflow-hidden ${
                        isActive ? 'border-[#33FDFF]' : 'border-[#1b2d30] hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Title, Quick Specs Grid, Warning Card, Quote & WhatsApp Buttons */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Top Category Badge */}
            <span className="text-[#00E5EE] text-xs font-bold tracking-[0.18em] uppercase mb-2 block">
              {categoryBadge}
            </span>

            {/* Main Product Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium text-white tracking-tight leading-tight mb-3">
              {title}
            </h1>

            {/* Availability status line */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#D97706] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                COMPATIBILITY REQUIRES CONFIRMATION
              </span>
            </div>

            {/* 4-Box Technical Spec Grid matching exact image */}
            <div className="grid grid-cols-2 gap-px bg-[#1e2d33] border border-[#1e2d33] mb-6">
              {/* Box 1: PART NUMBER (OE) */}
              <div className="bg-[#121c21] p-4 sm:p-5">
                <span className="block text-[11px] font-medium tracking-[0.08em] text-[#6b7b83] uppercase mb-1">
                  PART NUMBER (OE)
                </span>
                <span className="text-sm sm:text-[15px] font-normal text-white">
                  {oem}
                </span>
              </div>

              {/* Box 2: REFERENCE */}
              <div className="bg-[#121c21] p-4 sm:p-5">
                <span className="block text-[11px] font-medium tracking-[0.08em] text-[#6b7b83] uppercase mb-1">
                  REFERENCE
                </span>
                <span className="text-sm sm:text-[15px] font-normal text-white">
                  {reference}
                </span>
              </div>

              {/* Box 3: GENERATION */}
              <div className="bg-[#121c21] p-4 sm:p-5">
                <span className="block text-[11px] font-medium tracking-[0.08em] text-[#6b7b83] uppercase mb-1">
                  GENERATION
                </span>
                <span className="text-sm sm:text-[15px] font-normal text-white">
                  {generation}
                </span>
              </div>

              {/* Box 4: FINISH */}
              <div className="bg-[#121c21] p-4 sm:p-5">
                <span className="block text-[11px] font-medium tracking-[0.08em] text-[#6b7b83] uppercase mb-1">
                  FINISH
                </span>
                <span className="text-sm sm:text-[15px] font-normal text-white">
                  {finish}
                </span>
              </div>
            </div>

            {/* Light Yellow/Beige Confirmation Notice Card matching screenshot */}
            <div className="bg-[#FFFBEB] text-[#92400E] p-4 sm:p-5 rounded-none border border-[#FDE68A] flex items-start gap-3.5 mb-6">
              <AlertTriangle size={18} className="text-[#D97706] shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-[#78350F] block mb-0.5">
                  Confirm fitment before purchase.
                </span>
                <span className="text-[#92400E]">
                  Compatibility depends on version, equipment options and engine variant. Provide VIN for 100% check.
                </span>
              </div>
            </div>

            {/* Action Buttons: Request a quote (Cyan) & Contact on WhatsApp (White/Outlined) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Link
                href={`/inquiry?part=${encodeURIComponent(title)}&oem=${encodeURIComponent(oem)}&model=${encodeURIComponent(model)}&brand=${encodeURIComponent(make)}`}
                className="bg-[#33FDFF] hover:bg-[#00e5ee] text-[#070e12] font-semibold text-sm py-3.5 px-6 rounded-none flex items-center justify-center transition-all cursor-pointer shadow-md text-center"
              >
                Request a quote
              </Link>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E6F4EA] hover:bg-[#d8ece0] text-[#1E7E34] border border-[#A7D7B5] font-semibold text-sm py-3.5 px-6 rounded-none flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md text-center"
              >
                <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Contact on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Product specification Section matching exact 2-column table in screenshot */}
        <div className="mb-20 sm:mb-24 pt-6 border-t border-[#1b2d30]">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-6 tracking-tight">
            Product specification
          </h2>

          <div className="border border-[#1e2d33] bg-[#0c151a]">
            {/* Table Rows matching screenshot */}
            <div className="divide-y divide-[#1e2d33] text-xs sm:text-[13px]">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2d33]">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Part number</span>
                  <span className="text-white font-medium">{oem}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Vehicle brand</span>
                  <span className="text-white font-medium">{make}</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2d33]">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Model</span>
                  <span className="text-white font-medium">{modelSeries}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Generation</span>
                  <span className="text-white font-medium">{model}</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2d33]">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Model year</span>
                  <span className="text-white font-medium">{modelYear}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Fitting position</span>
                  <span className="text-white font-medium">{fittingPosition}</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2d33]">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Material</span>
                  <span className="text-white font-medium">{material}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Product state</span>
                  <span className="text-white font-medium">{productState}</span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2d33]">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Finish</span>
                  <span className="text-white font-medium">{finish}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">PDC sensor support</span>
                  <span className="text-white font-medium">{pdc}</span>
                </div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2d33]">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Radar support</span>
                  <span className="text-white font-medium">{radarSupport}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Camera support</span>
                  <span className="text-white font-medium">{cameraSupport}</span>
                </div>
              </div>

              {/* Row 7 */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2d33]">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Regional specification</span>
                  <span className="text-white font-medium">{regionalSpec}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#6b7b83]">Warranty</span>
                  <span className="text-white font-medium">12 months OEM standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Recommended parts Section matching exact 4-card row in screenshot */}
        <div className="pt-6 border-t border-[#1b2d30]">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-8 tracking-tight">
            Recommended parts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {recommendedParts.map((prod: any, idx: number) => (
              <div key={prod.id || prod._id || idx} className="h-full">
                <ProductCard prod={prod} idx={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

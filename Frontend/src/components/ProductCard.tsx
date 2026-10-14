import Link from "next/link";
import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ProductCardProps {
  prod: any;
  idx?: number;
  className?: string;
  showTag?: boolean;
  onEnquire?: (product: any) => void;
}

export default function ProductCard({
  prod,
  idx = 0,
  className = "",
  showTag = true,
  onEnquire,
}: ProductCardProps) {
  const getTagColor = (tag: string) => {
    const t = tag?.toLowerCase()?.trim();
    if (t?.includes("m sport") || t === "best seller") return "bg-[#C82021] text-white";
    if (t?.includes("led") || t === "featured") return "bg-[#1E293B] text-white";
    if (t?.includes("oem") || t === "new") return "bg-[#0F172A] text-white";
    return "bg-[#334155] text-white";
  };

  const tagLabel = prod?.tag || prod?.badge;
  const oem = prod?.oemNumber || (prod?.specifications?.find((s: any) => s.name?.toLowerCase().includes("oem"))?.value);
  const model = prod?.model || (prod?.specifications?.find((s: any) => s.name?.toLowerCase().includes("model"))?.value);
  const make = prod?.make || "BMW";

  return (
    <div className={`bg-white rounded-[12px] overflow-hidden shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300 group flex flex-col h-full ${className}`}>
      {/* Product Image */}
      <div className="relative h-[200px] bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
        {prod?.image || prod?.images?.[0] || prod?.thumbnail ? (
          <img
            src={prod?.image || prod?.images?.[0] || prod?.thumbnail}
            alt={prod?.title || prod?.name || "Automotive Replacement Part"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1.5">
            <Car size={32} className="text-gray-300" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">OEM Part</span>
          </div>
        )}
        {showTag && tagLabel && (
          <div
            className={`absolute top-3 left-3 ${getTagColor(
              tagLabel
            )} text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-sm z-10`}
          >
            {tagLabel}
          </div>
        )}
        {make && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-gray-200 shadow-xs z-10">
            {make}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <span className="text-[#C82021] font-bold text-[10px] uppercase tracking-[0.12em]">
              {prod?.category?.title || prod?.category?.name || "OEM REPLACEMENT"}
            </span>
            {oem && (
              <span className="font-mono text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200/80">
                OEM: {oem.length > 15 ? oem.slice(0, 15) + "..." : oem}
              </span>
            )}
          </div>

          <h3 className="font-bold text-[#0F172A] text-[15px] sm:text-[16px] mb-2 line-clamp-2 leading-snug group-hover:text-[#C82021] transition-colors" title={prod?.title}>
            {prod?.title || "Automotive Component"}
          </h3>

          {model && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3 font-medium">
              <span className="text-gray-400">Fits:</span>
              <span className="text-gray-800 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                {model}
              </span>
            </div>
          )}

          <p className="text-gray-500 text-[12px] leading-relaxed line-clamp-2 mb-4">
            {prod?.description
              ? prod.description.replace(/<[^>]+>/g, '')
              : "Precision-engineered genuine OEM replacement part. Factory verified fitment and mounting points."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          <Link
            href={prod?.id ? `/products/${prod.id}` : '#'}
            className="text-center text-[12px] font-bold py-2.5 px-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
          >
            Details
            <ArrowRight size={13} />
          </Link>
          <Link
            href={`/contact-us?part=${encodeURIComponent(prod?.title || '')}&oem=${encodeURIComponent(oem || '')}`}
            className="text-center text-[12px] font-bold py-2.5 px-3 rounded-lg bg-red-50 text-[#C82021] border border-red-200 hover:bg-[#C82021] hover:text-white transition-colors block truncate"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </div>
  );
}

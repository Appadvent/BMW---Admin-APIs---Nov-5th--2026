import Link from "next/link";
import React from "react";
import { ArrowRight, CheckCircle2, Car, Shield } from "lucide-react";

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
    if (t?.includes("m sport")) return "bg-red-500/20 text-red-400 border border-red-500/30";
    if (t?.includes("led") || t === "featured") return "bg-[#00C2CB]/20 text-[#00C2CB] border border-[#00C2CB]/30";
    if (t?.includes("oem") || t === "new") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    return "bg-[#1E293B] text-slate-300 border border-[#334155]";
  };

  const tagLabel = prod?.tag || prod?.badge;
  const oem = prod?.oemNumber || (prod?.specifications?.find((s: any) => s.name?.toLowerCase().includes("oem"))?.value);
  const model = prod?.model || (prod?.specifications?.find((s: any) => s.name?.toLowerCase().includes("model"))?.value);
  const make = prod?.make || "BMW";

  return (
    <div className={`bg-[#161F30] rounded-xl overflow-hidden border border-[#26354A] hover:border-[#00C2CB] hover:shadow-[0_8px_24px_rgba(0,194,203,0.15)] transition-all duration-300 group flex flex-col h-full ${className}`}>
      {/* Product Image */}
      <div className="relative h-[210px] bg-[#0F172A] overflow-hidden shrink-0 flex items-center justify-center p-3">
        {prod?.image || prod?.images?.[0] || prod?.thumbnail ? (
          <img
            src={prod?.image || prod?.images?.[0] || prod?.thumbnail}
            alt={prod?.title || prod?.name || "Automotive Replacement Part"}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1.5">
            <Car size={36} className="text-slate-600" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">OEM Part</span>
          </div>
        )}
        {showTag && tagLabel && (
          <div
            className={`absolute top-3 left-3 ${getTagColor(
              tagLabel
            )} text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 backdrop-blur-md`}
          >
            {tagLabel}
          </div>
        )}
        {make && (
          <div className="absolute top-3 right-3 bg-[#0B0F19]/80 backdrop-blur-md text-slate-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded border border-[#26354A] shadow-xs z-10">
            {make}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-[#161F30]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Shield size={12} className="text-[#00C2CB]" />
              {prod?.category?.title || prod?.category?.name || "OEM REPLACEMENT"}
            </span>
            {oem && (
              <span className="font-mono text-[11px] font-medium text-slate-300 bg-[#0B0F19] px-2 py-0.5 rounded border border-[#26354A]">
                OEM: {oem.length > 16 ? oem.slice(0, 16) + "..." : oem}
              </span>
            )}
          </div>

          <h3 className="font-bold text-white text-[15px] sm:text-[16px] mb-2 line-clamp-2 leading-snug group-hover:text-[#00C2CB] transition-colors" title={prod?.title}>
            {prod?.title || "Automotive Component"}
          </h3>

          {model && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 font-medium">
              <span className="text-slate-500">Compatibility:</span>
              <span className="text-slate-200 font-semibold bg-[#0B0F19] px-2 py-0.5 rounded border border-[#26354A]">
                {model}
              </span>
            </div>
          )}

          <p className="text-slate-400 text-[12px] leading-relaxed line-clamp-2 mb-4">
            {prod?.description
              ? prod.description.replace(/<[^>]+>/g, '')
              : "Precision-engineered genuine OEM replacement part. Factory verified fitment and mounting points."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-3 border-t border-[#26354A]">
          <Link
            href={prod?.id ? `/products/${prod.id}` : '#'}
            className="text-center text-[12px] font-semibold py-2 px-3 rounded-lg bg-[#0B0F19] text-slate-200 border border-[#26354A] hover:border-[#00C2CB] hover:text-white transition-all flex items-center justify-center gap-1"
          >
            Details
            <ArrowRight size={13} />
          </Link>
          <Link
            href={`/contact-us?part=${encodeURIComponent(prod?.title || '')}&oem=${encodeURIComponent(oem || '')}`}
            className="text-center text-[12px] font-bold py-2 px-3 rounded-lg bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] transition-all block truncate shadow-sm"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </div>
  );
}

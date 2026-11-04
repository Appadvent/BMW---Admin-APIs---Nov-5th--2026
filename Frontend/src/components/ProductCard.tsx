import Link from "next/link";
import React from "react";

export interface ProductItem {
  id?: string | number;
  _id?: string | number;
  title?: string;
  name?: string;
  badge?: string;
  make?: string;
  image?: string;
  images?: string[];
  thumbnail?: string;
  version?: string;
  vehicle?: string;
  model?: string;
  condition?: string;
  finish?: string;
  price?: string | number;
  number?: string;
  category?: any;
  oemNumber?: string;
  description?: string;
  modelGen?: string[];
  modelYear?: string[];
  mountingPosition?: string[];
  productCondition?: string[];
  spec?: string[];
  bumperSpecs?: string[];
  specifications?: Array<{ name: string; value: string }>;
}

interface ProductCardProps {
  prod: ProductItem;
  idx?: number;
  className?: string;
  onInquire?: (prod: ProductItem) => void;
}

export default function ProductCard({
  prod,
  idx = 0,
  className = "",
  onInquire,
}: ProductCardProps) {
  const title = prod?.title || prod?.name || "Automotive Replacement Part";

  const brand =
    prod?.badge ||
    prod?.make?.toUpperCase() ||
    "BMW";

  const imageSrc =
    prod?.image ||
    prod?.images?.[0] ||
    prod?.thumbnail ||
    "/products/bumper_assy_row_1.jpeg";

  const vehicle =
    prod?.vehicle ||
    prod?.version ||
    prod?.model ||
    (prod?.specifications?.find((s: any) =>
      s.name?.toLowerCase().includes("model") || s.name?.toLowerCase().includes("version") || s.name?.toLowerCase().includes("vehicle")
    )?.value) ||
    "G20 • 2019-";

  const oemNumber =
    prod?.number ||
    prod?.oemNumber ||
    (prod?.specifications?.find((s: any) =>
      s.name?.toLowerCase().includes("oem") || s.name?.toLowerCase().includes("number")
    )?.value) ||
    "OEM: sample data";

  const finish =
    prod?.finish ||
    prod?.condition ||
    (prod?.specifications?.find((s: any) =>
      s.name?.toLowerCase().includes("finish") || s.name?.toLowerCase().includes("condition")
    )?.value) ||
    "To be painted";

  const productId = prod?.id || prod?._id || `ref-${idx + 1}`;
  const queryPart = encodeURIComponent(title);

  return (
    <div
      className={`bg-white rounded-none overflow-hidden flex flex-col justify-between text-[#111827] shadow-xl border border-white/10 group transition-all duration-300 hover:shadow-2xl h-full ${className}`}
    >
      {/* Product Photo with Badge */}
      <div className="relative h-44 sm:h-[185px] w-full bg-black overflow-hidden shrink-0 group/img">
        <Link
          href={`/products/${productId}`}
          className="block w-full h-full cursor-pointer focus:outline-none"
          title={`View specifications for ${title}`}
        >
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
          />
        </Link>
        {/* Brand Badge on photo bottom left */}
        <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
          <span className="bg-[#11161f]/40 backdrop-blur-sm text-[#00E5EE] text-[10px] font-bold px-2 py-0.5 border-[#00E5EE]/40 uppercase tracking-wider">
            {brand}
          </span>
        </div>
      </div>

      {/* Product Info Table */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h4 className="text-[15px] font-bold text-slate-900 mb-4 min-h-[42px] leading-snug line-clamp-2">
            <Link
              href={`/products/${productId}`}
              className="hover:text-[#00C2CB] transition-colors cursor-pointer"
              title={title}
            >
              {title}
            </Link>
          </h4>

          <div className="space-y-2.5 border-t border-slate-100 pt-3 text-[12px] text-[#11161f] mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[#686B70]">Vehicle</span>
              <span className="font-semibold text-[#11161f] truncate max-w-[170px] text-right">
                {vehicle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#686B70]">Number</span>
              <span className="font-mono text-[#11161f] truncate max-w-[170px] text-right">
                {oemNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#686B70]">Finish</span>
              <span className="font-semibold text-[#11161f] truncate max-w-[170px] text-right">
                {finish}
              </span>
            </div>
          </div>
        </div>

        {/* Cyan Inquire Button */}
        <button
          type="button"
          onClick={() => {
            const partQuery = encodeURIComponent(title);
            const oemQuery = encodeURIComponent(oemNumber || "");
            const modelQuery = encodeURIComponent(vehicle || "");
            window.location.href = `/inquiry?part=${partQuery}&oem=${oemQuery}&model=${modelQuery}`;
          }}
          className="w-full bg-[#33FDFF] hover:bg-[#00c8d1] text-[#111214] text-[15px] font-bold py-3 px-3 rounded text-center transition-colors shadow-sm block cursor-pointer"
        >
          Inquire about the part
        </button>
      </div>
    </div>
  );
}

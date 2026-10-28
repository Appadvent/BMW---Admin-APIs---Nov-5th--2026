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
  model?: string;
  condition?: string;
  price?: string | number;
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
    "/msp_car_1.png";

  const version =
    prod?.version ||
    prod?.model ||
    (prod?.specifications?.find((s: any) =>
      s.name?.toLowerCase().includes("model") || s.name?.toLowerCase().includes("version")
    )?.value) ||
    "OEM Specification";

  const condition =
    prod?.condition ||
    (prod?.specifications?.find((s: any) =>
      s.name?.toLowerCase().includes("condition")
    )?.value) ||
    "OEM complete piece";

  let priceStr = "Inquire";
  if (prod?.price !== undefined && prod?.price !== null && prod?.price !== "") {
    if (typeof prod.price === "number") {
      priceStr = `€${prod.price.toLocaleString()}`;
    } else {
      priceStr = String(prod.price);
    }
  }

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
          <span className="bg-[#11161f]/90 backdrop-blur-md text-[#00E5EE] text-[9px] font-bold px-2 py-0.5 rounded-xs border border-white/10 uppercase tracking-wider">
            {brand}
          </span>
        </div>
      </div>

      {/* Product Info Table */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h4
            className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-3 min-h-[40px] leading-snug line-clamp-2"
          >
            <Link
              href={`/products/${productId}`}
              className="hover:text-[#00C2CB] transition-colors cursor-pointer"
              title={title}
            >
              {title}
            </Link>
          </h4>

          <div className="space-y-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Version:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[160px] text-right">
                {version}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Condition:</span>
              <span className="font-semibold text-slate-800">{condition}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Price:</span>
              <span className="font-bold text-slate-900">{priceStr}</span>
            </div>
          </div>
        </div>

        {/* Cyan Inquire Button */}
        <button
          type="button"
          onClick={() => {
            if (onInquire) {
              onInquire(prod);
            } else {
              window.location.href = `/contact-us?subject=Part+Inquiry&part=${queryPart}`;
            }
          }}
          className="w-full bg-[#00E5EE] hover:bg-[#00c8d1] active:scale-[0.99] text-[#081516] text-xs font-bold py-2.5 sm:py-3 px-3 rounded-none text-center transition-all shadow-sm block uppercase tracking-wider font-sans cursor-pointer"
        >
          Inquire about this part
        </button>
      </div>
    </div>
  );
}

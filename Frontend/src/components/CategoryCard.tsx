import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

interface CategoryCardProps {
  cat: any;
  idx?: number;
  className?: string;
  onClick?: () => void;
  href?: string;
  productCount?: number;
}

export default function CategoryCard({ cat, idx = 0, className = "", onClick, href, productCount }: CategoryCardProps) {
  const content = (
    <>
      <div className="h-[190px] overflow-hidden w-full relative shrink-0 bg-[#0E1524] flex items-center justify-center">
        {cat?.image || cat?.thumbnail || cat?.images?.[0] ? (
          <img
            src={cat?.image || cat?.thumbnail || cat?.images?.[0]}
            alt={cat?.name || cat?.title || "Category"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <Layers size={32} className="text-slate-600" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat?.name || "Category"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161F30] via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="px-6 py-5 flex flex-col justify-between flex-1 bg-[#161F30]">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold text-[#00C2CB] uppercase tracking-wider">
              OEM CATEGORY
            </span>
            {productCount !== undefined && (
              <span className="text-[11px] font-medium text-slate-400 bg-[#0B0F19] px-2 py-0.5 rounded border border-[#26354A]">
                {productCount} Parts
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-[18px] mb-2 group-hover:text-[#00C2CB] transition-colors">
            {cat?.name || cat?.title || "Category Name"}
          </h3>
          <p className="text-slate-400 text-[13px] leading-relaxed line-clamp-2 mb-4">
            {cat?.description || "High-grade genuine OEM replacement parts with guaranteed factory fitment."}
          </p>
        </div>
        <p className="text-[#00C2CB] text-[13px] font-bold flex items-center gap-1.5 mt-auto group-hover:translate-x-1 transition-all">
          View Parts <ArrowRight size={14} />
        </p>
      </div>
    </>
  );

  const cardClasses = `flex flex-col rounded-xl overflow-hidden group cursor-pointer border border-[#26354A] hover:border-[#00C2CB] hover:shadow-[0_8px_24px_rgba(0,194,203,0.15)] hover:-translate-y-1 transition-all duration-300 bg-[#161F30] h-full w-full ${className}`;

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={cardClasses}>
      {content}
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';


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
      <div className="h-[180px] overflow-hidden w-full relative shrink-0 bg-gray-100 flex items-center justify-center">
        {cat?.image || cat?.thumbnail || cat?.images?.[0] ? (
          <img
            src={cat?.image || cat?.thumbnail || cat?.images?.[0]}
            alt={cat?.name || cat?.title || "Category"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{cat?.name || "Category"}</span>
          </div>
        )}
      </div>
      <div className="px-6 py-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-gray-900 font-bold text-[18px] mb-2 group-hover:text-[#C82021] transition-colors">
            {cat?.name || cat?.title || "Category Name"}
          </h3>
          <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4">
            {cat?.description || "High-grade genuine OEM replacement parts with guaranteed factory fitment."}
          </p>
        </div>
        <p className="text-[#C82021] text-[13px] font-bold flex items-center gap-1.5 mt-auto">
          View Parts <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </p>
      </div>
    </>
  );

  const cardClasses = `flex flex-col rounded-[12px] overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white h-full w-full ${className}`;

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

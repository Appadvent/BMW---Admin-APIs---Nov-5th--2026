"use client";
import React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-[#070A10] text-slate-400 pt-16 pb-12 border-t border-[#1E293B] font-sans">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
            {/* Column 1 & 2: Brand Information & Authentic Logo */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <Link href="/" className="inline-block group select-none">
                <img
                  src="/d4399531705f2cd5cbd3dc79bab27b7f083023f8.png"
                  alt="LampaIZderzak.pl"
                  className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>
              <p className="text-[13px] leading-relaxed max-w-xs text-slate-400 pt-1">
                Specialized catalog of replacement body elements for European premium vehicles.
              </p>
            </div>

            {/* Column 3: CATALOG */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white text-[11px] font-bold tracking-widest uppercase">
                Catalog
              </h3>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <Link href="/products?category=bumpers" className="hover:text-[#00C2CB] transition-colors">
                    Bumpers
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=headlights" className="hover:text-[#00C2CB] transition-colors">
                    Headlights
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=grilles" className="hover:text-[#00C2CB] transition-colors">
                    Grilles
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=trims" className="hover:text-[#00C2CB] transition-colors">
                    Trims and splitters
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: BRANDS */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white text-[11px] font-bold tracking-widest uppercase">
                Brands
              </h3>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <Link href="/products?brand=BMW" className="hover:text-[#00C2CB] transition-colors">
                    BMW
                  </Link>
                </li>
                <li>
                  <Link href="/products?brand=Mercedes-Benz" className="hover:text-[#00C2CB] transition-colors">
                    Mercedes-Benz
                  </Link>
                </li>
                <li>
                  <Link href="/products?brand=Audi" className="hover:text-[#00C2CB] transition-colors">
                    Audi
                  </Link>
                </li>
                <li>
                  <Link href="/products?brand=Range+Rover" className="hover:text-[#00C2CB] transition-colors">
                    Range Rover
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: INFORMATION */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white text-[11px] font-bold tracking-widest uppercase">
                Information
              </h3>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <Link href="/contact-us?subject=VIN+Verification" className="hover:text-[#00C2CB] transition-colors">
                    VIN verification
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#00C2CB] transition-colors">
                    B2B cooperation
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-[#00C2CB] transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-[#00C2CB] transition-colors">
                    Admin panel
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 6: CONTACT */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white text-[11px] font-bold tracking-widest uppercase">
                Contact
              </h3>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <a href="tel:+48000000000" className="hover:text-[#00C2CB] transition-colors">
                    +48 000 000 000
                  </a>
                </li>
                <li>
                  <a href="mailto:kontakt@motorium.pl" className="hover:text-[#00C2CB] transition-colors">
                    kontakt@motorium.pl
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer matching Figma */}
          <div className="pt-8 border-t border-[#1E293B]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-slate-500">
            <p>&copy; 2025 Motorium. Demonstration project.</p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-slate-300 transition-colors">
                Privacy policy
              </Link>
              <Link href="/about" className="hover:text-slate-300 transition-colors">
                Terms of service
              </Link>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">
                Cookie settings
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed WhatsApp Floating Button matching Figma 'FIXED > whatsapp' */}
      <a
        href="https://wa.me/48000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-lg shadow-black/50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        <MessageCircle size={26} fill="white" className="text-white" />
      </a>
    </>
  );
}

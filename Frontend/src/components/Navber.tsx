"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Navber() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const langDropdownRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close language dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Word-to-word links as shown in the reference image
  const navLinks = [
    { name: "Parts", href: "/products" },
    { name: "Search by OEM", href: "/products?search=OEM" },
    { name: "Blog", href: "/news" },
    { name: "Contact us", href: "/contact-us" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-[#060B11]/95 backdrop-blur-md border-b border-[#1E293B]/70 ${
        isScrolled ? "py-2.5 shadow-xl shadow-black/50" : "py-3.5"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Authentic Brand Logo matching reference image */}
        <Link href="/" className="flex items-center shrink-0 group select-none">
          <img
            src="/d4399531705f2cd5cbd3dc79bab27b7f083023f8.png"
            alt="LampaIZderzak.pl"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links & Language Switcher grouped to the right */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <nav className="flex items-center gap-7 lg:gap-9 text-[14px] font-medium text-white/90">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href.split("?")[0]);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors hover:text-white ${
                    isActive ? "text-white font-semibold" : "text-[#D1DCE8] hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Language Selector with UK Flag (exact match to image) */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 text-[14px] font-medium text-[#D1DCE8] hover:text-white cursor-pointer transition-colors"
            >
              {/* UK Flag Emoji / Icon */}
              <span className="text-base leading-none">🇬🇧</span>
              <span>{selectedLang}</span>
              <ChevronDown
                size={14}
                className={`text-[#8A9EB5] transition-transform duration-200 ${
                  isLangOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Language dropdown */}
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-28 bg-[#0D1520] border border-[#23354E] rounded-lg shadow-2xl py-1 z-50 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLang("EN");
                    setIsLangOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left text-slate-200 hover:bg-[#1A2536] hover:text-white"
                >
                  <span>🇬🇧</span>
                  <span>EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLang("PL");
                    setIsLangOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left text-slate-200 hover:bg-[#1A2536] hover:text-white"
                >
                  <span>🇵🇱</span>
                  <span>PL</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLang("DE");
                    setIsLangOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left text-slate-200 hover:bg-[#1A2536] hover:text-white"
                >
                  <span>🇩🇪</span>
                  <span>DE</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white bg-[#0D1520] border border-[#23354E] rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#060B11] border-t border-[#23354E] px-4 pt-4 pb-6 mt-2 space-y-4 shadow-2xl">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-2 px-3 rounded-lg hover:bg-[#0D1520] hover:text-white transition-colors ${
                  pathname === link.href ? "bg-[#0D1520] text-white font-bold" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#23354E] flex items-center justify-between text-xs text-slate-300 px-3">
            <span>Language</span>
            <div className="flex items-center gap-2">
              <span className="text-base">🇬🇧</span>
              <span className="font-semibold text-white">EN</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

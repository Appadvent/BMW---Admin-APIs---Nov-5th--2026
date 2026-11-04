"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navber() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Word-to-word links as shown in the reference image
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Parts", href: "/products" },
    { name: "Search by OEM", href: "/products?search=OEM" },
    { name: "Blog", href: "/news" },
    { name: "Contact us", href: "/contact-us" },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-[100] w-full transition-all duration-300 bg-[#060B11]/95 backdrop-blur-md border-b border-[#1E293B]/70 ${
        isScrolled ? "py-2.5 shadow-xl shadow-black/50" : "py-3.5"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Authentic Brand Logo matching reference image */}
        <Link href="/" className="flex items-center shrink-0 group select-none">
          <img
            src="/lampa-i-zderzak-logo.png"
            alt="LampaIZderzak.pl"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links grouped to the right */}
        <div className="hidden md:flex items-center">
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
        </div>
      )}
    </header>
  );
}

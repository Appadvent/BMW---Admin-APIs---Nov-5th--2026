"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Shield,
  Phone,
  Mail,
  Car,
  Layers,
  ArrowRight,
  Send,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchCategories } from "../redux/Slice/categorySlice";

export default function Navber() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPartsDropdownOpen, setIsPartsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { list: categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories?.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const navLinks = [
    { name: "Parts", href: "/products", hasDropdown: true },
    { name: "Replacement by brand", href: "/products?brand=BMW" },
    { name: "Search by OEM", href: "/products" },
    { name: "For workshops", href: "/about" },
    { name: "Blog", href: "/news" },
    { name: "Contact us", href: "/contact-us" },
  ];

  return (
    <>

      {/* Main Header matching Figma Component */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#26354A] shadow-lg shadow-black/40 ${
          isScrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
          {/* Authentic Brand Logo from Figma */}
          <Link href="/" className="flex items-center shrink-0 group select-none">
            <img
              src="/d4399531705f2cd5cbd3dc79bab27b7f083023f8.png"
              alt="LampaIZderzak.pl"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-sm xl:max-w-md">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center bg-[#161F30] border border-[#26354A] rounded-lg overflow-hidden focus-within:border-[#00C2CB] transition-colors"
            >
              <div className="pl-3.5 text-slate-400">
                <Search size={15} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by part, OEM, VIN..."
                className="w-full px-3 py-2 text-xs text-white placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-bold text-[#00C2CB] hover:text-[#00E5FF] transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-[13px] font-semibold text-slate-300 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => {
                      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                      setIsPartsDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      dropdownTimeoutRef.current = setTimeout(() => {
                        setIsPartsDropdownOpen(false);
                      }, 200);
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 py-1 hover:text-[#00C2CB] transition-colors ${
                        pathname.startsWith("/products") ? "text-[#00C2CB] font-bold" : ""
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isPartsDropdownOpen ? "rotate-180 text-[#00C2CB]" : ""}`} />
                    </Link>

                    {/* Categories Dropdown Panel */}
                    {isPartsDropdownOpen && (
                      <div className="absolute top-full -left-2 pt-2 z-50 w-72">
                        <div className="bg-[#161F30] border border-[#26354A] rounded-xl shadow-2xl p-3 space-y-1">
                          <Link
                            href="/products"
                            className="block px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-[#0B0F19] hover:text-[#00C2CB] transition-all"
                          >
                            All Categories
                          </Link>
                          {categories?.map((cat: any) => (
                            <Link
                              key={cat.id || cat._id}
                              href={`/products?categoryId=${cat.id || cat._id}`}
                              className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#0B0F19] hover:text-[#00C2CB] transition-all"
                            >
                              {cat.name || cat.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`hover:text-[#00C2CB] transition-colors ${
                    isActive ? "text-[#00C2CB] font-bold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Language and Quote / Profile */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors">
              <span>EN</span>
              <ChevronDown size={13} className="text-slate-400" />
            </div>
            <Link
              href="/contact-us"
              className="bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-900/20 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span>Request Quote</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-white bg-[#161F30] border border-[#26354A] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="xl:hidden bg-[#0B0F19] border-t border-[#26354A] px-4 pt-4 pb-6 mt-2 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#161F30] border border-[#26354A] rounded-lg p-2">
              <Search size={16} className="text-slate-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parts, OEM, VIN..."
                className="w-full text-xs text-white placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 px-3 rounded-lg hover:bg-[#161F30] hover:text-[#00C2CB] transition-colors ${
                    pathname === link.href ? "bg-[#161F30] text-[#00C2CB] font-bold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-[#26354A]">
              <Link
                href="/contact-us"
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <span>Request a Quote</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

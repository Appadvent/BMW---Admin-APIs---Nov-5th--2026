"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EnquiryPopup from "./EnquiryPopup";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchCategories } from "../redux/Slice/categorySlice";
import { fetchProducts } from "../redux/Slice/productSlice";

const Navber = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEnquiryPopupOpen, setIsEnquiryPopupOpen] = useState(false);
  const pathname = usePathname();

  const isProductDetailPage = pathname === "/products/52" || (/^\/products\/[^\/]+$/.test(pathname));
  const isWhiteNav = isProductDetailPage && !isScrolled;

  const dispatch = useAppDispatch();
  const { list: categories } = useAppSelector((state) => state.categories);
  const { list: products } = useAppSelector((state) => state.products);

  // Desktop Dropdown State
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile Dropdown Accordion State
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, categories?.length, products?.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Catalogue", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "VIN Check", href: "/contact-us?subject=VIN+Verification" },
    { name: "News & Media", href: "/news" },
    { name: "Contact", href: "/contact-us" },
  ];

  // Filter product categories (active 4 OEM categories)
  const productCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.filter((cat: any) => {
      const hasProds = (cat._count?.products ?? 0) > 0 || (cat.products?.length ?? 0) > 0;
      const isBlogOnly = (cat._count?.blogs ?? 0) > 0 && !hasProds;
      return !isBlogOnly;
    });
  }, [categories]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsProductDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductDropdownOpen(false);
    }, 200);
  };

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string
  ) => {
    setIsOpen(false);
    setIsProductDropdownOpen(false);
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (pathname === "/" || pathname === "") {
        e.preventDefault();
        setTimeout(() => {
          const elem = document.getElementById(targetId);
          if (elem) {
            const navHeight = 70;
            const elementPosition =
              elem.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
              top: elementPosition,
              behavior: "smooth",
            });
          }
        }, 120);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) {
          const navHeight = 70;
          const elementPosition =
            elem.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        }
      }, 150);
    }
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-[#10151C]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-white/10 py-3.5"
          : isWhiteNav
            ? "bg-white py-5 shadow-none backdrop-blur-none border-b border-gray-200"
            : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Automotive OEM Brand Mark */}
            <Link href="/" className="flex items-center space-x-3 group select-none">
              <div className="w-10 h-10 rounded-lg bg-[#C82021] flex items-center justify-center text-white font-extrabold text-base tracking-tighter shadow-md shadow-red-900/30 group-hover:scale-105 transition-transform">
                OEM
              </div>
              <div className="flex flex-col">
                <span className={`font-extrabold text-lg md:text-xl tracking-tight leading-none flex items-center gap-1 ${
                  isWhiteNav ? "text-[#10151C]" : "text-white"
                }`}>
                  AUTOPARTS <span className="text-[#C82021]">OEM</span>
                </span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mt-0.5">
                  Replacement Parts
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                // MULTI-CATEGORY DIRECT DROPDOWN (NO SUBCATEGORIES)
                if (link.href === "/products" || link.name === "Catalogue" || link.name === "Products") {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsProductDropdownOpen((prev) => !prev);
                        }}
                        className={`text-[15px] font-medium transition-colors duration-200 py-1 flex items-center gap-1.5 cursor-pointer bg-transparent border-none ${pathname.startsWith("/products") || isProductDropdownOpen
                          ? "text-[#C82021] font-semibold"
                          : isWhiteNav
                            ? "text-gray-800 hover:text-[#C82021]"
                            : "text-gray-300 hover:text-[#C82021]"
                          }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isProductDropdownOpen
                            ? "rotate-180 text-[#C82021]"
                            : isWhiteNav
                              ? "text-gray-700"
                              : "text-gray-400"
                            }`}
                        />
                      </button>

                      {/* Direct Category Dropdown Panel */}
                      <AnimatePresence>
                        {isProductDropdownOpen && (
                          <div className="absolute top-full -left-4 pt-3 z-50">
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 min-w-[320px] max-w-[360px] text-gray-800"
                            >
                              <div className="px-5 py-2 border-b border-gray-100 mb-1 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                  OEM Parts Categories
                                </span>
                                <span className="text-[11px] font-bold text-[#C82021]">
                                  BMW • BENZ • AUDI
                                </span>
                              </div>

                              <div className="py-1">
                                {productCategories && productCategories.length > 0 ? (
                                  productCategories.map((cat: any) => {
                                    const catId = cat.id ?? cat._id;
                                    const catName = cat.name || cat.title || "Category";

                                    return (
                                      <Link
                                        key={catId}
                                        href={`/products?categoryId=${catId}`}
                                        onClick={() => setIsProductDropdownOpen(false)}
                                        className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group select-none cursor-pointer"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <span className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[#C82021] transition-colors shrink-0" />
                                          <span className="text-[14px] font-semibold text-gray-800 group-hover:text-[#C82021] transition-colors truncate">
                                            {catName}
                                          </span>
                                        </div>
                                        <ChevronRight
                                          size={15}
                                          className="text-gray-400 group-hover:text-[#C82021] group-hover:translate-x-1 transition-all shrink-0 ml-2"
                                        />
                                      </Link>
                                    );
                                  })
                                ) : (
                                  <div className="px-5 py-4 text-xs text-gray-400">
                                    Loading categories...
                                  </div>
                                )}
                              </div>

                              <div className="px-5 pt-3 pb-1 border-t border-gray-100 mt-1">
                                <Link
                                  href="/products"
                                  onClick={() => setIsProductDropdownOpen(false)}
                                  className="text-xs font-bold text-[#C82021] hover:underline flex items-center justify-between"
                                >
                                  <span>View Complete Catalogue</span>
                                  <ArrowRight size={13} />
                                </Link>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`text-[15px] font-medium transition-colors duration-200 py-1 ${isActive
                      ? "text-[#C82021] font-semibold"
                      : isWhiteNav
                        ? "text-gray-800 hover:text-[#C82021]"
                        : "text-gray-300 hover:text-[#C82021]"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Button */}
            <div className="hidden sm:flex items-center space-x-5">
              <button
                onClick={() => setIsEnquiryPopupOpen(true)}
                className="inline-flex items-center gap-2 bg-[#C82021] hover:bg-[#A01819] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-red-900/20 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <ShieldCheck size={16} />
                <span>Request Quote (RFQ)</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg focus:outline-none transition-colors ${isWhiteNav
                  ? "text-gray-800 hover:text-black"
                  : "text-gray-200 hover:text-white"
                  }`}
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden border-t border-white/10 bg-[#10151C]/98 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col space-y-2">
                {navLinks.map((link) => {
                  if (link.href === "/products" || link.name === "Catalogue" || link.name === "Products") {
                    return (
                      <div key={link.name} className="flex flex-col">
                        <div className="flex items-center justify-between text-[15px] font-medium text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-md transition-colors">
                          <button
                            type="button"
                            onClick={() =>
                              setIsMobileProductsOpen(!isMobileProductsOpen)
                            }
                            className="flex-1 text-left cursor-pointer"
                          >
                            {link.name}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setIsMobileProductsOpen(!isMobileProductsOpen)
                            }
                            className="p-1 text-gray-400 hover:text-[#C82021]"
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 ${isMobileProductsOpen
                                ? "rotate-180 text-[#C82021]"
                                : ""
                                }`}
                            />
                          </button>
                        </div>

                        {/* Mobile Direct Categories (No Subcategories) */}
                        <AnimatePresence>
                          {isMobileProductsOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 pr-2 space-y-1 overflow-hidden py-1"
                            >
                              {productCategories?.map((cat: any) => {
                                const catId = cat.id ?? cat._id;
                                const catName = cat.name || cat.title;

                                return (
                                  <Link
                                    key={catId}
                                    href={`/products?categoryId=${catId}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-[13px] font-medium text-gray-300 hover:text-[#C82021] py-2 px-3 rounded block hover:bg-white/5 transition-colors"
                                  >
                                    {catName}
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-[15px] font-medium text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-md transition-colors"
                      onClick={(e) => scrollToSection(e, link.href)}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                <div className="pt-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsEnquiryPopupOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-[#C82021] hover:bg-[#A01819] text-white px-4 py-3 rounded-lg text-sm font-bold w-full active:scale-98 transition-all cursor-pointer shadow-md shadow-red-900/20"
                  >
                    <ShieldCheck size={16} />
                    <span>Request Quote (RFQ)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <EnquiryPopup
        isOpen={isEnquiryPopupOpen}
        onClose={() => setIsEnquiryPopupOpen(false)}
      />
    </>
  );
};

export default Navber;

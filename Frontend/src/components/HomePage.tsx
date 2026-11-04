"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Check,
  Scan,
  ChevronRight,
  Box,
  Globe,
  Headphones,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchCategories } from "../redux/Slice/categorySlice";
import { fetchProducts } from "../redux/Slice/productSlice";
import { fetchAllBlogs } from "../redux/Slice/BlogSlice";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const { list: products, loading: productsLoading } = useAppSelector((state) => state.products);
  const { list: categories, loading: categoriesLoading } = useAppSelector((state) => state.categories);
  const { list: blogs, loading: blogsLoading } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    dispatch(fetchAllBlogs({ page: 1, limit: 6 }));
  }, [dispatch]);

  // Tab State in Search Widget
  const [activeTab, setActiveTab] = useState<"vehicle" | "vin">("vehicle");

  // Filter state for Vehicle Search
  const [selectedBrand, setSelectedBrand] = useState("BMW");
  const [selectedModel, setSelectedModel] = useState("");
  const [oemInput, setOemInput] = useState("");

  const handleVehicleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedModel) params.set("model", selectedModel);
    if (oemInput.trim()) params.set("search", oemInput.trim());

    router.push(`/products?${params.toString()}`);
  };

  // GSAP SCROLLTRIGGER ANIMATIONS (Eutoriia & Black&Blink style)
  useGSAP(
    () => {
      // 1. Hero Content Entrance
      const heroContent = mainRef.current?.querySelector(".gsap-hero-content");
      if (heroContent) {
        gsap.fromTo(
          heroContent,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 }
        );
      }

      // 2. Premium Brands Cards Animation
      const brandHeader = mainRef.current?.querySelector(".gsap-brand-header");
      const brandCards = mainRef.current?.querySelectorAll(".gsap-brand-card");
      if (brandHeader && brandCards && brandCards.length > 0) {
        const brandTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#vehicle-search-widget",
            start: "top 85%",
            once: true,
          },
        });
        brandTl
          .fromTo(
            brandHeader,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            brandCards,
            { opacity: 0, y: 40, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.3"
          );
      }

      // 3. Categories Grid Animation
      const catHeader = mainRef.current?.querySelector(".gsap-cat-header");
      const catCards = mainRef.current?.querySelectorAll(".gsap-cat-card");
      if (catHeader && catCards && catCards.length > 0) {
        const catTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#categories-section",
            start: "top 85%",
            once: true,
          },
        });
        catTl
          .fromTo(
            catHeader,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            catCards,
            { opacity: 0, y: 35, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.3"
          );
      }

      // 4. Most Selling Parts Animation
      const mspHeader = mainRef.current?.querySelector(".gsap-msp-header");
      const mspCards = mainRef.current?.querySelectorAll(".gsap-msp-card");
      if (mspHeader && mspCards && mspCards.length > 0) {
        const mspTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#msp-section",
            start: "top 85%",
            once: true,
          },
        });
        mspTl
          .fromTo(
            mspHeader,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            mspCards,
            { opacity: 0, y: 40, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.3"
          );
      }

      // 5. Compatibility Verification Section (Split Horizon Left/Right)
      const compatImg = mainRef.current?.querySelector(".gsap-compat-img");
      const compatContent = mainRef.current?.querySelector(".gsap-compat-content");
      const compatItems = mainRef.current?.querySelectorAll(".gsap-compat-item");
      if (compatImg && compatContent) {
        const compatTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#compat-section",
            start: "top 82%",
            once: true,
          },
        });
        compatTl
          .fromTo(
            compatImg,
            { opacity: 0, x: -45, scale: 0.96 },
            { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "power2.out" }
          )
          .fromTo(
            compatContent,
            { opacity: 0, x: 45 },
            { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
            "-=0.5"
          );
        if (compatItems && compatItems.length > 0) {
          compatTl.fromTo(
            compatItems,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.05,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }
      }

      // 6. Simple Process Steps Animation
      const processHeader = mainRef.current?.querySelector(".gsap-process-header");
      const processSteps = mainRef.current?.querySelectorAll(".gsap-process-step");
      if (processHeader && processSteps && processSteps.length > 0) {
        const processTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#process-section",
            start: "top 85%",
            once: true,
          },
        });
        processTl
          .fromTo(
            processHeader,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            processSteps,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.3"
          );
      }

      // 7. Automotive Guides / Knowledge Base Animation
      const guideHeader = mainRef.current?.querySelector(".gsap-guide-header");
      const guideCards = mainRef.current?.querySelectorAll(".gsap-guide-card");
      if (guideHeader && guideCards && guideCards.length > 0) {
        const guideTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#guides-section",
            start: "top 85%",
            once: true,
          },
        });
        guideTl
          .fromTo(
            guideHeader,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            guideCards,
            { opacity: 0, y: 40, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.3"
          );
      }

      // 8. Value Pillars Animation
      const pillarsSection = mainRef.current?.querySelector("#pillars-section");
      const pillars = mainRef.current?.querySelectorAll(".gsap-pillar-item");
      if (pillarsSection && pillars && pillars.length > 0) {
        gsap.fromTo(
          pillars,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pillarsSection,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      // 9. Need Help Section Animation
      const helpSection = mainRef.current?.querySelector("#help-section");
      const helpBox = mainRef.current?.querySelector(".gsap-help-box");
      if (helpSection && helpBox) {
        gsap.fromTo(
          helpBox,
          { opacity: 0, scale: 0.97, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: helpSection,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: mainRef }
  );

  // Brand Cards matching Figma "Replacement by make and model"
  const brandCards = [
    {
      name: "BMW",
      num: "01",
      desc: "Precision body components for BMW series.",
      image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
      logo: "/B-M-W.png",
      brandParam: "BMW",
      containerStyle: "w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full bg-black/40 border border-white/20 p-2 shadow-xl",
      logoStyle: "w-full h-full object-contain scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]",
    },
    {
      name: "Mercedes-Benz",
      num: "02",
      desc: "Exterior elements for passenger and SUV models.",
      image: "/13d46830bc0c8f31c49b6fb7035b8c4135d3134c.jpg",
      logo: "/Benz.png",
      brandParam: "Mercedes-Benz",
      containerStyle: "w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full bg-black/40 border border-white/20 p-2 shadow-xl",
      logoStyle: "w-full h-full object-contain scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]",
    },
    {
      name: "Audi",
      num: "03",
      desc: "Modern body and lighting parts.",
      image: "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg",
      logo: "/Audi.png",
      brandParam: "Audi",
      containerStyle: "w-[120px] h-[62px] rounded-[40px] bg-[#000000]/80 px-4 py-1.5 shadow-xl flex items-center justify-center",
      logoStyle: "w-full h-full object-contain scale-125",
    },
    {
      name: "Range Rover",
      num: "04",
      desc: "Components for selected premium models.",
      image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
      logo: "/Land-Rover.png",
      brandParam: "Range Rover",
      containerStyle: "w-[130px] h-[70px] rounded-[260px] bg-white px-2 py-1 shadow-xl flex items-center justify-center overflow-hidden",
      logoStyle: "w-full h-full object-contain scale-125",
    },
  ];

  // Top Row & Bottom Row Categories Data
  const topCategories = [
    {
      name: "Complete bumpers",
      href: "/products?category=bumpers",
      image: "/7a633909f37ebad7ba458ab83b64e97d182de499.png",
    },
    {
      name: "Headlights",
      href: "/products?category=headlights",
      image: "/f93de2dfa9c809df119e34582c3f80a56d2e7e69.png",
    },
  ];

  const bottomCategories = [
    {
      name: "Grilles",
      href: "/products?category=grilles",
      image: "/a92783c40197d1e216cf1371a696c41a78daff2a.png",
    },
    {
      name: "Exterior trims",
      href: "/products?category=trims",
      image: "/9b7be6140818a0c881d657f179c827d267409917.png",
    },
    {
      name: "Front splitters",
      href: "/products?category=splitters",
      image: "/5dd349e4eaad559c6d2ec0c7249e247ac00dc1b0.png",
    },
    {
      name: "Body elements",
      href: "/products?category=body",
      image: "/9b7be6140818a0c881d657f179c827d267409917.png",
    },
  ];

  const categoryCardStyles = {
    title: "text-[19px] sm:text-[20px] font-bold text-white mb-1.5 group-hover:text-[#00C2CB] transition-colors",
    action: "inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-[#33FDFF] group-hover:text-[#00E5FF] transition-colors",
    actionText: "Discover category",
  };

  return (
    <main ref={mainRef} className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans antialiased selection:bg-[#00C2CB] selection:text-[#0B0F19] overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center border-b border-[#26354A]">
        {/* Full Hero Image matching reference image exactly */}
        <div className="absolute inset-0 z-0">
          <img
            src="/6e01705d37bba339a4a45c329968238c33c1ef92.png"
            alt="Premium automotive replacement parts"
            className="w-full h-full object-cover object-[center_right] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#070b12]/85 to-transparent w-full md:w-[65%]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
          <div className="gsap-hero-content max-w-2xl">
            {/* Main Hero Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              Premium replacements.<br />
              Perfect fitment.
            </h1>

            {/* Description Paragraph */}
            <p className="text-[#CFD0D2] text-sm sm:text-base lg:text-[17px] font-normal leading-relaxed mb-8 max-w-xl">
              Discover high-quality replacement bumpers, headlights, grilles, and exterior parts for BMW, Mercedes-Benz, Audi, and Range Rover.
            </p>

            {/* Search Input Bar with Cyan Search parts button */}
            <form onSubmit={handleVehicleSearch} className="mb-4 max-w-[520px]">
              <div className="relative flex items-center bg-[#07111e]/90 border border-[#23354E] rounded-xl p-1.5 focus-within:border-[#00C2CB] shadow-2xl backdrop-blur-md transition-all">
                <Search size={18} className="text-[#94A3B8] ml-3 mr-2 shrink-0" />
                <input
                  type="text"
                  value={oemInput}
                  onChange={(e) => setOemInput(e.target.value)}
                  placeholder="Enter OEM number, VIN, make or model"
                  className="w-full bg-transparent text-white placeholder-[#8A9EB5] text-sm sm:text-[15px] focus:outline-none px-2 py-2"
                />
                <button
                  type="submit"
                  className="bg-[#33FDFF] hover:bg-[#00f5ff] text-[#0B0F19] text-sm font-bold px-6 py-3.5 rounded-lg shrink-0 transition-colors cursor-pointer shadow-md"
                >
                  Search parts
                </button>
              </div>
            </form>

            {/* Check by VIN button */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("vin");
                  const widget = document.getElementById("vehicle-search-widget");
                  if (widget) {
                    widget.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0C1524]/80 hover:bg-[#142034] border border-[#23354E] text-[#D1DCE8] hover:text-white text-sm font-medium transition-all backdrop-blur-sm cursor-pointer"
              >
                <Scan size={16} className="text-[#8A9EB5]" />
                <span>Check by VIN</span>
                <ChevronRight size={15} className="text-[#8A9EB5] ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VEHICLE / VIN FILTER WIDGET */}
      {/* ========================================================================= */}
      <section id="vehicle-search-widget" className="relative pt-6 sm:pt-8 pb-10 sm:pb-12 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A] bg-[#081516]">
        {/* Header */}
        <div className="gsap-brand-header flex flex-col items-start justify-between mb-4 sm:mb-6">
          <span className="text-[#33FDFF] font-bold text-[14px] uppercase tracking-[0.2em] mb-2.5">
            PREMIUM BRANDS
          </span>
          <h2 className="text-[44px] sm:text-[45px] lg:text-[46px] font-bold text-white tracking-tight">
            Replacement by Make and Model
          </h2>
        </div>

        {/* 4 Brand Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 items-stretch">
          {brandCards.map((b) => (
            <Link
              key={b.name}
              href={`/products?brand=${encodeURIComponent(b.brandParam)}`}
              className="gsap-brand-card group relative rounded-[8px] overflow-hidden border border-[#1E293B]/80 hover:border-[#00E5EE]/70 bg-[#0B1522] h-[355px] sm:h-[365px] flex flex-col justify-between p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/25"
            >
              {/* Card Background Car Photo */}
              <div className="absolute inset-0 z-0">
                <img
                  src={b.image}
                  alt={b.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${b.name === "BMW" ? "object-[center_top]" : "object-center"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25 pointer-events-none" />
              </div>

              {/* Top Row: Prominent Larger Brand Logos on top-left + Index number on top-right */}
              <div className="relative z-10 flex items-start justify-between w-full">
                <div
                  className={`flex items-center justify-center shrink-0 ${b.containerStyle}`}
                >
                  <img
                    src={b.logo}
                    alt={`${b.name} Logo`}
                    className={b.logoStyle}
                  />
                </div>
                {b.num && (
                  <span className="text-[11px] sm:text-xs font-mono text-white/60 tracking-wider">
                    {b.num}
                  </span>
                )}
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 mt-auto">
                <h3 className="text-[25px] font-bold text-white mb-1 leading-snug group-hover:text-[#00E5EE] transition-colors">
                  {b.name}
                </h3>
                <p className="text-[#D2D3D4] text-[14px] sm:text-[15px] leading-[1.35] mb-2.5 line-clamp-2 max-w-[220px]">
                  {b.desc}
                </p>
                <div className="inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-[#00E5EE] group-hover:text-[#3bf7ff] transition-colors">
                  <span>Browse parts</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PARTS BY CATEGORY SECTION */}
      {/* ========================================================================= */}
      <section id="categories-section" className="py-16 sm:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A] bg-[#000000]">
        {/* Header */}
        <div className="gsap-cat-header mb-8">
          <p className="text-[#33FDFF] font-bold text-[14px] uppercase tracking-[0.2em] mb-2">
            CATEGORIES
          </p>
          <h2 className="text-[44px] sm:text-[45px] lg:text-[46px] font-bold text-white tracking-tight">
            Parts by category
          </h2>
        </div>

        {/* Categories Grid (Top row: 2 large cards, Bottom row: 4 smaller cards) */}
        <div className="space-y-3.5">
          {/* Top Row: 2 Large Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {topCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="gsap-cat-card group relative overflow-hidden border border-[#23354E]/60 bg-[#0B1522] h-[210px] sm:h-[240px] flex flex-col justify-end p-6 transition-all duration-300 hover:border-[#00C2CB] hover:shadow-xl hover:shadow-cyan-950/30"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                <div className="relative z-10">
                  <h3 className={categoryCardStyles.title}>
                    {cat.name}
                  </h3>
                  <div className={categoryCardStyles.action}>
                    <span>{categoryCardStyles.actionText}</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Row: 4 Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {bottomCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="gsap-cat-card group relative overflow-hidden border border-[#23354E]/60 bg-[#0B1522] h-[190px] sm:h-[210px] flex flex-col justify-end p-5 transition-all duration-300 hover:border-[#00C2CB] hover:shadow-xl hover:shadow-cyan-950/30"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                </div>
                <div className="relative z-10">
                  <h3 className={categoryCardStyles.title}>
                    {cat.name}
                  </h3>
                  <div className={categoryCardStyles.action}>
                    <span>{categoryCardStyles.actionText}</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MOST SELLING PARTS */}
      {/* ========================================================================= */}
      <section id="msp-section" className="pt-20 pb-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]/40 bg-[#081516]">
        {/* Header */}
        <div className="gsap-msp-header flex items-center justify-between mb-9">
          <div>
            <p className="text-[#33FDFF] font-bold text-[14px] uppercase tracking-[0.2em] mb-2.5">
              SELECTED FROM THE CATALOG
            </p>
            <h2 className="text-[44px] sm:text-[45px] lg:text-[46px] font-extrabold text-white tracking-tight leading-none">
              Most selling parts
            </h2>
          </div>
          <Link
            href="/products"
            className="bg-white hover:bg-slate-100 text-[#0B0F19] text-[14px] font-bold px-5 py-2.5 rounded shadow transition-all cursor-pointer"
          >
            View All
          </Link>
        </div>

        {/* 4 White-Card Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: "msp-1",
              title: "Front bumper BMW Series 3 G20",
              badge: "BMW",
              vehicle: "G20 • 2019-2022",
              number: "OEM: sample data",
              finish: "Primed",
              image: "/products/bumper_assy_row_1.jpeg",
              param: "BMW Series 3 G20 Bumper",
            },
            {
              id: "msp-2",
              title: "LED headlight BMW Series 5 G30",
              badge: "BMW",
              vehicle: "G30 / G31 • 2017-2020",
              number: "OEM: sample data",
              finish: "Primed",
              image: "/products/headlight_bmw_row_10.png",
              param: "BMW Series 5 G30 LED Headlight",
            },
            {
              id: "msp-3",
              title: "Front bumper C-Class W206",
              badge: "MERCEDES-BENZ",
              vehicle: "W206 • 2021-",
              number: "OEM: sample data",
              finish: "To be painted",
              image: "/products/bumper_assy_row_1.png",
              param: "Mercedes C-Class W206 Bumper",
            },
            {
              id: "msp-4",
              title: "Front bumper C-Class W206",
              badge: "MERCEDES-BENZ",
              vehicle: "W213 • 2016-2020",
              number: "OEM: sample data",
              finish: "Gloss black",
              image: "/products/bumper_shell_row_1.jpeg",
              param: "Mercedes C-Class W206 Gloss Black Bumper",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="gsap-msp-card bg-white rounded-none overflow-hidden flex flex-col justify-between text-[#111827] shadow-xl border border-white/10"
            >
              {/* Product Photo with Badge */}
              <div className="relative h-44 sm:h-[185px] w-full bg-black overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="bg-[#11161f]/40 backdrop-blur-sm text-[#00E5EE] text-[10px] font-bold px-2 py-0.5 border-[#00E5EE]/40 uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Product Info Table */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 mb-4 min-h-[42px] leading-snug">
                    {item.title}
                  </h4>

                  <div className="space-y-2.5 border-t border-slate-100 pt-3 text-[12px] text-[#11161f] mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[#686B70] ">Vehicle</span>
                      <span className="font-semibold text-[#11161f]">{item.vehicle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#686B70]">Number</span>
                      <span className="font-mono text-[#11161f]">{item.number}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#686B70]">Finish</span>
                      <span className="font-semibold text-[#11161f]"> {item.finish}</span>
                    </div>
                  </div>
                </div>

                {/* Cyan Inquire Button */}
                <Link
                  href={`/contact-us?subject=Part+Inquiry&part=${encodeURIComponent(item.param)}`}
                  className="w-full bg-[#33FDFF] hover:bg-[#00c8d1] text-[#111214] text-[15px] font-bold py-3 px-3 rounded text-center transition-colors shadow-sm block"
                >
                  Inquire about the part
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COMPATIBILITY VERIFICATION */}
      {/* ========================================================================= */}
      <section id="compat-section" className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]/40 bg-[#000000]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Car Front-End Image */}
          <div className="gsap-compat-img lg:col-span-5 relative overflow-hidden border border-white/10 bg-[#0d141e] aspect-square flex items-center justify-center shadow-2xl group">
            <img
              src="/compatibility_bmw_m5.jpg"
              alt="BMW M5 Front End Compatibility Verification"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-5 border border-white/20 pointer-events-none rounded-sm" />

            <div className="absolute top-[32%] right-6 bg-[#161a23]/90 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 flex items-center gap-2 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">PDC</span>
              <span className="text-[10px] font-mono font-bold text-[#00E5EE] tracking-wider">CHECK</span>
            </div>
            <div className="absolute bottom-[28%] left-8 bg-[#161a23]/90 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 flex items-center gap-2 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">OEM</span>
              <span className="text-[10px] font-mono font-bold text-[#00E5EE] tracking-wider">MATCH</span>
            </div>
          </div>

          {/* Right Column: Compatibility Checklist & Copy */}
          <div className="gsap-compat-content lg:col-span-7 flex flex-col justify-center">
            <span className="text-[#33FDFF] font-bold text-[14px] uppercase tracking-[0.2em] mb-2.5">
              COMPATIBILITY VERIFICATION
            </span>
            <h2 className="text-[44px] sm:text-[45px] lg:text-[46px] font-medium text-white tracking-tight leading-[1.15] mb-4">
              The right part starts with the right match.
            </h2>
            <p className="text-[#E6E8E8] text-[18px] leading-relaxed mb-8 max-w-xl">
              The same vehicle generation may have several equipment variants. Gather the most important data before sending an inquiry.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 mb-8">
              {[
                "VIN and OEM/OE number",
                "Generation and model year",
                "Equipment package",
                "PDC sensor holes",
                "Radar and camera",
                "Headlight washers",
                "Lighting technology",
                "EU or US specification",
              ].map((item, idx) => (
                <div key={idx} className="gsap-compat-item flex items-center gap-2.5 text-[14px] text-[#FFFFFF] font-regular">
                  <Check size={14} className="text-[#00E5EE] shrink-0" strokeWidth={2.5} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact-us?subject=Compatibility+Verification"
                className="bg-[#33FDFF] hover:bg-[#00c8d1] text-[#0B0F19] px-7 py-3 rounded-md text-[14px] sm:text-[16px] font-bold shadow-md transition-all cursor-pointer"
              >
                Verify the part
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-1.5 text-[#F3F3F3] hover:text-white px-4 py-3 text-[14px] sm:text-[14px] font-bold transition-colors"
              >
                <span>Contact an advisor</span>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SIMPLE PROCESS */}
      {/* ========================================================================= */}
      <section id="process-section" className="pt-20 pb-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 bg-[#081516]">
        <div className="gsap-process-header mb-14">
          <p className="text-[#33FDFF] font-bold text-[14px] uppercase tracking-[0.2em] mb-3">
            SIMPLE PROCESS
          </p>
          <h2 className="text-[44px] sm:text-[45px] lg:text-[46px] font-medium text-white tracking-tight leading-none">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4">
          {[
            {
              step: "01",
              title: "Find a part",
              desc: "Search by vehicle, OEM number, name, or VIN.",
            },
            {
              step: "02",
              title: "Check compatibility",
              desc: "Provide vehicle data and required specification.",
            },
            {
              step: "03",
              title: "Send inquiry",
              desc: "Include all product information.",
            },
            {
              step: "04",
              title: "Receive confirmation",
              desc: "We will check availability, matching, and delivery options.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="gsap-process-step border-l border-white/10 pl-6 sm:pl-7 pr-4 py-1 flex flex-col justify-between"
            >
              <div>
                <span className="text-[#33FDFF] font-mono font-extrabold text-[13px] uppercase tracking-widest block mb-8">
                  {item.step}
                </span>
                <h3 className="text-[#FFFFFF] font-semibold text-[20px] mb-3">
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#686B70] font-regular leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. AUTOMOTIVE GUIDES (Knowledge Base) */}
      {/* ========================================================================= */}
      <section id="guides-section" className="pt-20 pb-28 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gsap-guide-header mb-12">
          <p className="text-[#33FDFF] font-bold text-[14px] uppercase tracking-[0.2em] mb-2.5">
            KNOWLEDGE BASE
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-tight mb-2">
            Automotive guides
          </h2>
          <p className="text-[#686B70] text-xs sm:text-sm mt-1">
            Practical tips to help identify the right part.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {[
            {
              id: 1,
              badge: "OEM NUMBERS • 14.05.2025",
              title: "How to find the right OEM number for BMW?",
              desc: "Learn about the data worth checking before sending a part inquiry.",
              image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
            },
            {
              id: 2,
              badge: "COMPATIBILITY • 14.05.2025",
              title: "BMW G20 — compatibility of body parts",
              desc: "Learn about the data worth checking before sending a part inquiry.",
              image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
            },
            {
              id: 3,
              badge: "TECHNICAL GUIDE • 14.05.2025",
              title: "How to check if the bumper supports PDC?",
              desc: "Learn about the data worth checking before sending a part inquiry.",
              image: "/734295950a53ab641f4c489e327584416018d44d.jpg",
            },
          ].map((blog) => (
            <div
              key={blog.id}
              className="gsap-guide-card bg-white rounded-none overflow-hidden shadow-lg flex flex-col justify-between group"
            >
              <div className="h-[210px] sm:h-[220px] overflow-hidden bg-black relative text-[17px] font-medium">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white text-[#0B0F19]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#9CA2A2] uppercase tracking-wider block mb-3">
                    {blog.badge}
                  </span>
                  <h3 className="text-[17px] sm:text-lg font-medium text-[#111214] mb-3 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-[14px] text-[#686B70] leading-relaxed mb-6">
                    {blog.desc}
                  </p>
                </div>
                <Link
                  href={"/news/" + blog.id}
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-[#111214] hover:text-[#00c8d1] transition-colors mt-auto"
                >
                  <span>Read the article</span>
                  <ArrowRight size={13} className="text-slate-900" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. VALUE PILLARS */}
      {/* ========================================================================= */}
      <section id="pillars-section" className="w-full bg-[#081516] border-y border-white/10 py-8 sm:py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-center">
            {[
              {
                icon: Box,
                title: "Delivery in Poland",
                desc: "We confirm delivery options individually.",
              },
              {
                icon: Globe,
                title: "European shipping",
                desc: "We handle inquiries from European markets.",
              },
              {
                icon: Headphones,
                title: "Assistance in matching",
                desc: "Support based on vehicle data.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`gsap-pillar-item flex items-center justify-center ${idx !== 0 ? "md:border-l md:border-white/15" : ""}`}
              >
                <div className="flex items-center gap-4 py-1">
                  <item.icon size={22} className="text-[#00E5EE] shrink-0" strokeWidth={1.75} />
                  <div>
                    <h4 className="text-[16px] font-bold text-white mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[14px] text-[#686B70] font-regular leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. NEED HELP? */}
      {/* ========================================================================= */}
      <section id="help-section" className="pt-20 pb-28 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#081516]">
        <div className="gsap-help-box max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-[#33FDFF] font-bold text-[14px] uppercase tracking-[0.2em] mb-3 block">
            NEED HELP?
          </span>
          <h2 className="text-[44px] sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight mb-4 leading-tight">
            Looking for a specific car part?
          </h2>
          <p className="text-[#9CA2A2] text-[14px] font-regular sm:text-sm leading-relaxed mb-8 max-w-xl">
            Send vehicle data or OEM number, and our team will help identify the right component.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/products"
              className="bg-[#00E5EE] hover:bg-[#00c8d1] text-[#081516] px-7 py-3 rounded text-[14px] sm:text-[15px] font-bold shadow-md transition-all cursor-pointer min-w-[120px]"
            >
              Find a part
            </Link>
            <Link
              href="/contact-us"
              className="bg-white hover:bg-slate-100 text-[#111214] px-7 py-3 rounded text-[14px] sm:text-[15px] font-bold shadow-md transition-all cursor-pointer min-w-[120px]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

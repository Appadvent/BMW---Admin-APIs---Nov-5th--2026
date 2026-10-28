"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Check,
  Shield,
  Car,
  Layers,
  Phone,
  Mail,
  Truck,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Scan,
  ChevronRight,
  Box,
  Globe,
  Headphones,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchCategories } from "../redux/Slice/categorySlice";
import { fetchProducts } from "../redux/Slice/productSlice";
import { fetchAllBlogs } from "../redux/Slice/BlogSlice";
import ProductCard from "./ProductCard";
import CategoryCard from "./CategoryCard";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
  const [selectedGen, setSelectedGen] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [oemInput, setOemInput] = useState("");
  const [vinInput, setVinInput] = useState("");

  const handleVehicleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedModel) params.set("model", selectedModel);
    if (selectedCat) params.set("categoryId", selectedCat);
    if (oemInput.trim()) params.set("search", oemInput.trim());

    router.push(`/products?${params.toString()}`);
  };

  // Curated category fallback images from Figma assets
  const categoryAssets: Record<string, string> = {
    bumper: "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg",
    headlight: "/ce1d8aa4367dcb587ee79305a43bd21e5d10d260.jpg",
    grille: "/0065630ec2b4dbc86f746c86f25ccc999111c337.jpg",
    trim: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
    lens: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
  };

  const getCategoryAsset = (cat: any, idx: number) => {
    const name = (cat?.name || cat?.title || "").toLowerCase();
    if (name.includes("headlight") || name.includes("lamp")) return categoryAssets.headlight;
    if (name.includes("grille") || name.includes("atrap")) return categoryAssets.grille;
    if (name.includes("shell") || name.includes("trim") || name.includes("lens")) return categoryAssets.trim;
    if (name.includes("bumper") || name.includes("zderzak")) return categoryAssets.bumper;

    const fallbacks = [
      "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg",
      "/ce1d8aa4367dcb587ee79305a43bd21e5d10d260.jpg",
      "/0065630ec2b4dbc86f746c86f25ccc999111c337.jpg",
      "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
    ];
    return cat?.image || fallbacks[idx % fallbacks.length];
  };

  // Brand Cards matching Figma "Replacement by make and model"
  const brandCards = [
    {
      name: "BMW",
      num: "01",
      desc: "Precision body components for BMW series.",
      image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
      logo: "/B-M-W.png",
      brandParam: "BMW",
    },
    {
      name: "Mercedes-Benz",
      num: "02",
      desc: "Exterior elements for passenger and SUV models.",
      image: "/13d46830bc0c8f31c49b6fb7035b8c4135d3134c.jpg",
      logo: "/Benz.png",
      brandParam: "Mercedes-Benz",
    },
    {
      name: "Audi",
      num: "03",
      desc: "Modern body and lighting parts.",
      image: "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg",
      logo: "/Audi.png",
      brandParam: "Audi",
    },
    {
      name: "Range Rover",
      num: "04",
      desc: "Components for selected premium models.",
      image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
      logo: "/Land-Rover.png",
      brandParam: "Range Rover",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans antialiased selection:bg-[#00C2CB] selection:text-[#0B0F19]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Figma: Premium replacements, Perfect fitment.) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center border-b border-[#26354A]">
        {/* Full Hero Image matching reference image exactly */}
        <div className="absolute inset-0 z-0">
          <img
            src="/6e01705d37bba339a4a45c329968238c33c1ef92.png"
            alt="Premium automotive replacement parts"
            className="w-full h-full object-cover object-[center_right] sm:object-center"
          />
          {/* Dark gradient on the left side to keep text crisp and legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#070b12]/85 to-transparent w-full md:w-[65%]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
          <div className="max-w-2xl">
            {/* Main Hero Headline - exact word to word */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              Premium replacements.<br />
              Perfect fitment.
            </h1>

            {/* Description Paragraph - exact word to word */}
            <p className="text-[#C5D0DC] text-sm sm:text-base lg:text-[17px] font-normal leading-relaxed mb-8 max-w-xl">
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
                  className="bg-[#00e5ee] hover:bg-[#00f5ff] text-[#0B0F19] text-sm font-bold px-5 py-2.5 rounded-lg shrink-0 transition-colors cursor-pointer shadow-md"
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

      {/* Wrapper around Vehicle Search Widget */}
      {/* ========================================================================= */}
      {/* VEHICLE / VIN FILTER WIDGET (Figma: Replacement by make and model) */}
      {/* ========================================================================= */}
      <section id="vehicle-search-widget" className="relative pt-6 sm:pt-8 pb-10 sm:pb-12 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A] bg-[#081516]">
        {/* Header matching image */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight">
            Replacement by Make and Model
          </h2>

          <Link
            href="/products"
            className="text-xs sm:text-sm text-slate-400 hover:text-[#00C2CB] transition-colors flex items-center gap-1 font-medium group"
          >
            <span>All brands</span>
            <span className="group-hover:translate-x-0.5 transition-transform text-xs sm:text-sm">&rarr;</span>
          </Link>
        </div>

        {/* 4 Brand Cards with EQUAL size and larger prominent logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 items-stretch">
          {brandCards.map((b) => (
            <Link
              key={b.name}
              href={`/products?brand=${encodeURIComponent(b.brandParam)}`}
              className="group relative rounded-[8px] overflow-hidden border border-[#1E293B]/80 hover:border-[#00E5EE]/70 bg-[#0B1522] h-[255px] sm:h-[265px] flex flex-col justify-between p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/25"
            >
              {/* Card Background Car Photo */}
              <div className="absolute inset-0 z-0">
                <img
                  src={b.image}
                  alt={b.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${b.name === "BMW" ? "object-[center_top]" : "object-center"
                    }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25 pointer-events-none" />
              </div>

              {/* Top Row: Prominent Larger Brand Logos on top-left + Index number on top-right */}
              <div className="relative z-10 flex items-start justify-between w-full">
                {b.name === "BMW" && (
                  <div className=" px-2 sm:px-3 rounded-full bg-black/30 border border-white/20 flex items-center justify-center shadow-xl shrink-0">
                    <img
                      src={b.logo}
                      alt="BMW Logo"
                      className="w-17 h-19 sm:w-17 sm:h-19 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                    />
                  </div>
                )}
                {b.name === "Mercedes-Benz" && (
                  <div className=" px-2 sm:px-3 rounded-full bg-black/30 border border-white/20 flex items-center justify-center shadow-xl shrink-0">
                    <img
                      src={b.logo}
                      alt="Mercedes-Benz Logo"
                      className="w-17 h-19 sm:w-17 sm:h-19 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] "
                    />
                  </div>
                )}
                {b.name === "Audi" && (
                  <div className="h-11 sm:h-12 px-2 sm:px-3 rounded-full bg-black/30 border border-white/20 flex items-center justify-center shadow-xl shrink-0">
                    <img
                      src={b.logo}
                      alt="Audi Logo"
                      className="h-15 sm:h-17 w-auto object-contain"
                    />
                  </div>
                )}
                {b.name === "Range Rover" && (
                  <div className="h-11 sm:h-12 px-1.5 sm:px-2 rounded-full bg-white flex items-center justify-center shadow-xl overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={b.logo}
                      alt="Land Rover Logo"
                      className="h-12 sm:h-14 w-auto object-contain scale-110"
                    />
                  </div>
                )}
                {b.num && (
                  <span className="text-[11px] sm:text-xs font-mono text-white/60 tracking-wider">
                    {b.num}
                  </span>
                )}
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 mt-auto">
                <h3 className="text-[16px] sm:text-[17px] font-bold text-white mb-1 leading-snug group-hover:text-[#00E5EE] transition-colors">
                  {b.name}
                </h3>
                <p className="text-slate-300 text-[10px] sm:text-[11px] leading-[1.35] mb-2.5 line-clamp-2 max-w-[220px]">
                  {b.desc}
                </p>
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#00E5EE] group-hover:text-[#3bf7ff] transition-colors">
                  <span>Browse parts</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PARTS BY CATEGORY SECTION (Figma: Parts by category) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A] bg-[#000000]">
        {/* Header matching reference image */}
        <div className="mb-8">
          <p className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.2em] mb-2">
            CATEGORIES
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight">
            Parts by category
          </h2>
        </div>

        {/* Categories Grid (Top row: 2 large cards, Bottom row: 4 smaller cards) */}
        <div className="space-y-3.5">
          {/* Top Row: 2 Large Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Complete bumpers */}
            <Link
              href="/products?category=bumpers"
              className="group relative rounded-xl overflow-hidden border border-[#23354E]/60 bg-[#0B1522] h-[210px] sm:h-[240px] flex flex-col justify-end p-6 transition-all duration-300 hover:border-[#00C2CB] hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src="/7a633909f37ebad7ba458ab83b64e97d182de499.png"
                  alt="Complete bumpers"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 group-hover:text-[#00C2CB] transition-colors">
                  Complete bumpers
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00C2CB] group-hover:text-[#00E5FF] transition-colors">
                  <span>Discover category</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>

            {/* Headlights */}
            <Link
              href="/products?category=headlights"
              className="group relative rounded-xl overflow-hidden border border-[#23354E]/60 bg-[#0B1522] h-[210px] sm:h-[240px] flex flex-col justify-end p-6 transition-all duration-300 hover:border-[#00C2CB] hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src="/f93de2dfa9c809df119e34582c3f80a56d2e7e69.png"
                  alt="Headlights"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 group-hover:text-[#00C2CB] transition-colors">
                  Headlights
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00C2CB] group-hover:text-[#00E5FF] transition-colors">
                  <span>Discover category</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Row: 4 Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Grilles */}
            <Link
              href="/products?category=grilles"
              className="group relative rounded-xl overflow-hidden border border-[#23354E]/60 bg-[#0B1522] h-[190px] sm:h-[210px] flex flex-col justify-end p-5 transition-all duration-300 hover:border-[#00C2CB] hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src="/a92783c40197d1e216cf1371a696c41a78daff2a.png"
                  alt="Grilles"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-[#00C2CB] transition-colors">
                  Grilles
                </h3>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00C2CB] group-hover:text-[#00E5FF] transition-colors">
                  <span>Discover category</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>

            {/* Exterior trims */}
            <Link
              href="/products?category=trims"
              className="group relative rounded-xl overflow-hidden border border-[#23354E]/60 bg-[#0B1522] h-[190px] sm:h-[210px] flex flex-col justify-end p-5 transition-all duration-300 hover:border-[#00C2CB] hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src="/9b7be6140818a0c881d657f179c827d267409917.png"
                  alt="Exterior trims"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-[#00C2CB] transition-colors">
                  Exterior trims
                </h3>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00C2CB] group-hover:text-[#00E5FF] transition-colors">
                  <span>Discover category</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>

            {/* Front splitters */}
            <Link
              href="/products?category=splitters"
              className="group relative rounded-xl overflow-hidden border border-[#23354E]/60 bg-[#0B1522] h-[190px] sm:h-[210px] flex flex-col justify-end p-5 transition-all duration-300 hover:border-[#00C2CB] hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src="/5dd349e4eaad559c6d2ec0c7249e247ac00dc1b0.png"
                  alt="Front splitters"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-[#00C2CB] transition-colors">
                  Front splitters
                </h3>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00C2CB] group-hover:text-[#00E5FF] transition-colors">
                  <span>Discover category</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>

            {/* Body elements */}
            <Link
              href="/products?category=body"
              className="group relative rounded-xl overflow-hidden border border-[#23354E]/60 bg-[#0B1522] h-[190px] sm:h-[210px] flex flex-col justify-end p-5 transition-all duration-300 hover:border-[#00C2CB] hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src="/9b7be6140818a0c881d657f179c827d267409917.png"
                  alt="Body elements"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-[#00C2CB] transition-colors">
                  Body elements
                </h3>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00C2CB] group-hover:text-[#00E5FF] transition-colors">
                  <span>Discover category</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MOST SELLING PARTS (Figma: Most selling parts) */}
      {/* ========================================================================= */}
      <section className="pt-20 pb-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]/40 bg-[#081516]">
        {/* Header matching image */}
        <div className="flex items-center justify-between mb-9">
          <div>
            <p className="text-[#00E5EE] font-bold text-[11px] uppercase tracking-[0.2em] mb-2.5">
              SELECTED FROM THE CATALOG
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-none">
              Most selling parts
            </h2>
          </div>
          <Link
            href="/products"
            className="bg-white hover:bg-slate-100 text-[#0B0F19] text-xs font-bold px-5 py-2.5 rounded shadow transition-all cursor-pointer"
          >
            View All
          </Link>
        </div>

        {/* 4 White-Card Products exact to reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: "msp-1",
              title: "Front bumper BMW Series 3 G20",
              badge: "BMW",
              vehicle: "G20 • 2019-2022",
              number: "OEM: sample data",
              finish: "Primed",
              image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
              param: "BMW Series 3 G20 Bumper",
            },
            {
              id: "msp-2",
              title: "LED headlight BMW Series 5 G30",
              badge: "BMW",
              vehicle: "G30 / G31 • 2017-2020",
              number: "OEM: sample data",
              finish: "Primed",
              image: "/734295950a53ab641f4c489e327584416018d44d.jpg",
              param: "BMW Series 5 G30 LED Headlight",
            },
            {
              id: "msp-3",
              title: "Front bumper C-Class W206",
              badge: "MERCEDES-BENZ",
              vehicle: "W206 • 2021-",
              number: "OEM: sample data",
              finish: "To be painted",
              image: "/13d46830bc0c8f31c49b6fb7035b8c4135d3134c.jpg",
              param: "Mercedes C-Class W206 Bumper",
            },
            {
              id: "msp-4",
              title: "Front bumper C-Class W206",
              badge: "MERCEDES-BENZ",
              vehicle: "W213 • 2016-2020",
              number: "OEM: sample data",
              finish: "Gloss black",
              image: "/13d46830bc0c8f31c49b6fb7035b8c4135d3134c.jpg",
              param: "Mercedes C-Class W206 Gloss Black Bumper",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-none overflow-hidden flex flex-col justify-between text-[#111827] shadow-xl border border-white/10"
            >
              {/* Product Photo with Badge */}
              <div className="relative h-44 sm:h-[185px] w-full bg-black overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Brand Badge on photo bottom left */}
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="bg-[#11161f]/90 backdrop-blur-md text-[#00E5EE] text-[9px] font-bold px-2 py-0.5 rounded-sm border border-white/10 uppercase tracking-wider">
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

                  <div className="space-y-2.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Vehicle</span>
                      <span className="font-semibold text-slate-800">{item.vehicle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Number</span>
                      <span className="font-mono text-slate-800">{item.number}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Finish</span>
                      <span className="font-semibold text-slate-800">{item.finish}</span>
                    </div>
                  </div>
                </div>

                {/* Cyan Inquire Button */}
                <Link
                  href={`/contact-us?subject=Part+Inquiry&part=${encodeURIComponent(item.param)}`}
                  className="w-full bg-[#00E5EE] hover:bg-[#00c8d1] text-[#0B0F19] text-xs font-bold py-3 px-3 rounded text-center transition-colors shadow-sm block"
                >
                  Inquire about the part
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPATIBILITY VERIFICATION (The right part starts with the right match.) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]/40 bg-[#000000]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Car Front-End Image matching exact reference */}
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-white/10 bg-[#0d141e] aspect-square flex items-center justify-center shadow-2xl group">
            <img
              src="/compatibility_bmw_m5.jpg"
              alt="BMW M5 Front End Compatibility Verification"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Fine thin grid boundary overlay like in reference */}
            <div className="absolute inset-5 border border-white/20 pointer-events-none rounded-sm" />

            {/* Overlay indicators matching reference image: PDC CHECK top right, OEM MATCH bottom left */}
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
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[#00E5EE] font-bold text-[11px] uppercase tracking-[0.2em] mb-2.5">
              COMPATIBILITY VERIFICATION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.15] mb-4">
              The right part starts with the right match.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl">
              The same vehicle generation may have several equipment variants. Gather the most important data before sending an inquiry.
            </p>

            {/* 8-Item Quality Checklist matching reference 2 columns */}
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
                <div key={idx} className="flex items-center gap-2.5 text-[13px] text-slate-300">
                  <Check size={14} className="text-[#00E5EE] shrink-0" strokeWidth={2.5} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact-us?subject=Compatibility+Verification"
                className="bg-[#00E5EE] hover:bg-[#00c8d1] text-[#0B0F19] px-7 py-3 rounded-md text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                Verify the part
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white px-4 py-3 text-xs sm:text-sm font-medium transition-colors"
              >
                <span>Contact an advisor</span>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIMPLE PROCESS (How it works) */}
      {/* ========================================================================= */}
      <section className="pt-20 pb-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 bg-[#081516]">
        <div className="mb-14">
          <p className="text-[#00E5EE] font-bold text-[11px] uppercase tracking-[0.2em] mb-3">
            SIMPLE PROCESS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-none">
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
              className="border-l border-white/10 pl-6 sm:pl-7 pr-4 py-1 flex flex-col justify-between"
            >
              <div>
                <span className="text-[#00E5EE] font-mono font-bold text-xs uppercase tracking-widest block mb-8">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. B2B COOPERATION (Full-width dark container) */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#1c1e22] py-20 sm:py-24 relative overflow-hidden">
        {/* Subtle LA watermark in background matching reference */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[280px] font-black text-white/[0.03] select-none pointer-events-none leading-none tracking-tighter">
          LA
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <span className="text-[#00E5EE] font-bold text-[11px] uppercase tracking-[0.2em] mb-3 block">
                B2B COOPERATION
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.12] mb-4">
                A reliable partner for automotive professionals.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-xl">
                Workshops, body shops, paint shops, and distributors can send organized individual or recurring inquiries.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5">
                {["WORKSHOPS", "BODY SHOPS", "DISTRIBUTORS"].map((tag, i) => (
                  <span
                    key={i}
                    className="border border-white/20 text-[10px] font-semibold text-slate-400 px-3.5 py-1.5 rounded uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col gap-3 min-w-[210px] sm:min-w-[230px]">
              <Link
                href="/contact-us?subject=B2B+Partner"
                className="bg-[#00E5EE] hover:bg-[#00c8d1] text-[#0B0F19] text-center font-bold px-7 py-3.5 rounded-md text-xs sm:text-sm transition-all"
              >
                Become a partner
              </Link>
              <Link
                href="/contact-us?subject=B2B+Inquiry"
                className="bg-[#2c2f34] hover:bg-[#34383e] text-white border border-white/10 text-center font-bold px-7 py-3.5 rounded-md text-xs sm:text-sm transition-all"
              >
                Business inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6.1 VALUE PILLARS (Delivery in Poland, European shipping, Assistance in matching) */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#070b11] border-y border-white/10 py-8 sm:py-10">
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
                className={`flex items-center justify-center ${idx !== 0 ? "md:border-l md:border-white/15" : ""
                  }`}
              >
                <div className="flex items-center gap-4 py-1">
                  <item.icon size={22} className="text-[#00E5EE] shrink-0" strokeWidth={1.75} />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AUTOMOTIVE GUIDES (Knowledge Base) */}
      {/* ========================================================================= */}
      <section className="pt-20 pb-28 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-[#00E5EE] font-bold text-[11px] uppercase tracking-[0.2em] mb-2.5">
            KNOWLEDGE BASE
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-tight mb-2">
            Automotive guides
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
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
              className="bg-white rounded-none overflow-hidden shadow-lg flex flex-col justify-between group"
            >
              <div className="h-[210px] sm:h-[220px] overflow-hidden bg-black relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white text-[#0B0F19]">
                <div>
                  <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block mb-3">
                    {blog.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {blog.desc}
                  </p>
                </div>
                <Link
                  href={"/news/" + blog.id}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-[#00c8d1] transition-colors mt-auto"
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
      {/* 8. NEED HELP? (Looking for a specific car part?) */}
      {/* ========================================================================= */}
      <section className="pt-20 pb-28 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#081516]">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-[#00E5EE] font-bold text-[11px] uppercase tracking-[0.2em] mb-3 block">
            NEED HELP?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight mb-4 leading-tight">
            Looking for a specific car part?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-xl">
            Send vehicle data or OEM number, and our team will help identify the right component.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/products"
              className="bg-[#00E5EE] hover:bg-[#00c8d1] text-[#0B0F19] px-7 py-3 rounded text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer min-w-[120px]"
            >
              Find a part
            </Link>
            <Link
              href="/contact-us"
              className="bg-white hover:bg-slate-100 text-[#0B0F19] px-7 py-3 rounded text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer min-w-[120px]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

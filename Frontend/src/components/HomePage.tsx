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
      series: "F & G Series (1, 3, 4, 5, 7)",
      image: "/7b38ef87e0ed90915af6670b2661616389757b59.jpg",
      brandParam: "BMW",
    },
    {
      name: "Mercedes-Benz",
      series: "W205, W206, W213, W222, W223",
      image: "/13d46830bc0c8f31c49b6fb7035b8c4135d3134c.jpg",
      brandParam: "Mercedes-Benz",
    },
    {
      name: "Audi",
      series: "A4, A5, A6, A7, Q5, S-Line",
      image: "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg",
      brandParam: "Audi",
    },
    {
      name: "Range Rover",
      series: "Sport, Vogue, Velar, Evoque",
      image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
      brandParam: "Range Rover",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans antialiased selection:bg-[#00C2CB] selection:text-[#0B0F19]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Figma: Premium replacements, Perfect fitment.) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[#26354A]">
        {/* Background Gradients & Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#00C2CB]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[300px] bg-blue-900/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0F19]/80 to-[#0B0F19]" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines & Action CTAs */}
            <div className="lg:col-span-7 pt-4 sm:pt-6">
              {/* Top Cyan Subheading Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-[11px] font-bold tracking-[0.16em] uppercase mb-6 backdrop-blur-md">
                <Sparkles size={13} className="text-[#00C2CB]" />
                <span>Genuine OEM European Automotive Components</span>
              </div>

              {/* Main Hero Headline (Exact Figma) */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-white tracking-tight leading-[1.08] mb-6">
                Premium replacements, <br />
                <span className="text-[#00C2CB]">
                  Perfect fitment.
                </span>
              </h1>

              {/* Description Paragraph */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                Specialized catalog of replacement body elements for European premium vehicles. Verified fitment and OEM standards for BMW, Mercedes-Benz, Audi, and Range Rover.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  href="/products"
                  className="bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] px-7 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-cyan-900/30 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Browse Catalogue</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact-us"
                  className="bg-[#161F30] hover:bg-[#1E293B] text-white border border-[#26354A] hover:border-[#00C2CB] px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Request an offer</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 text-[12px] font-semibold text-slate-300 pt-2 border-t border-[#26354A]/60">
                <div className="flex items-center gap-1.5">
                  <Shield size={15} className="text-[#00C2CB]" />
                  <span>100% OEM Compatibility</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={15} className="text-[#00C2CB]" />
                  <span>Fast European Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#00C2CB]" />
                  <span>Pre-shipment Report</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Car Image matching Figma */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#26354A] shadow-2xl shadow-cyan-950/40 bg-[#161F30] aspect-[4/3] group">
                <img
                  src="/76f1295d1c66c026e83fe0b88ecfaad88654837c.png"
                  alt="Premium BMW M4 Replacement Fitment"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90 bg-[#0B0F19]/80 backdrop-blur-md px-3 py-1 rounded-md border border-[#26354A]">
                    BMW M4 Series F82 / F83
                  </span>
                  <span className="text-[11px] font-bold text-[#00C2CB] bg-[#00C2CB]/10 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#00C2CB]/30">
                    OEM FITMENT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* VEHICLE / VIN FILTER WIDGET (Figma: Replacement by make and model) */}
          {/* ===================================================================== */}
          <div className="mt-14">
            {/* Dark Floating Widget Container matching Figma */}
            <div className="bg-[#161F30] rounded-2xl shadow-2xl p-6 sm:p-8 text-white border border-[#26354A] backdrop-blur-md">
              {/* Widget Header & Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-[#26354A] gap-4">
                <div className="flex items-center gap-2.5">
                  <Car size={20} className="text-[#00C2CB]" />
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Replacement by make and model
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-[#0B0F19] p-1 rounded-lg border border-[#26354A]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("vehicle")}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "vehicle"
                        ? "bg-[#00C2CB] text-[#0B0F19] shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Vehicle Select
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("vin")}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "vin"
                        ? "bg-[#00C2CB] text-[#0B0F19] shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Search by VIN
                  </button>
                </div>
              </div>

              {/* Brand Visual Cards Row matching Figma */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {brandCards.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(b.brandParam);
                      router.push(`/products?brand=${encodeURIComponent(b.brandParam)}`);
                    }}
                    className={`group relative rounded-xl overflow-hidden border p-3 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                      selectedBrand === b.brandParam
                        ? "border-[#00C2CB] bg-[#0B0F19] shadow-md shadow-cyan-950/50"
                        : "border-[#26354A] bg-[#0E1524] hover:border-slate-500 hover:bg-[#111A2E]"
                    }`}
                  >
                    <div className="w-full h-20 sm:h-24 rounded-lg overflow-hidden mb-2 bg-[#0B0F19] relative">
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00C2CB] transition-colors">
                      {b.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-full">
                      {b.series}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tab 1: Vehicle Attributes Select */}
              {activeTab === "vehicle" ? (
                <form onSubmit={handleVehicleSearch} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                  {/* Col 1: MAKE / BRAND */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Vehicle Make
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#26354A] rounded-lg px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#00C2CB] cursor-pointer"
                    >
                      <option value="BMW">BMW</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Audi">Audi</option>
                      <option value="Range Rover">Range Rover</option>
                    </select>
                  </div>

                  {/* Col 2: MODEL */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Series / Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#26354A] rounded-lg px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#00C2CB] cursor-pointer"
                    >
                      <option value="">All Models</option>
                      <option value="1 Series">1 Series / F20</option>
                      <option value="3 Series">3 Series / G20</option>
                      <option value="4 Series">4 Series / F32</option>
                      <option value="5 Series">5 Series / G30</option>
                      <option value="7 Series">7 Series / G11</option>
                      <option value="X Series">X3 / X5 / X6</option>
                    </select>
                  </div>

                  {/* Col 3: GENERATION */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Chassis / Gen
                    </label>
                    <select
                      value={selectedGen}
                      onChange={(e) => setSelectedGen(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#26354A] rounded-lg px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#00C2CB] cursor-pointer"
                    >
                      <option value="">All Generations</option>
                      <option value="G20">G20 / G21 (2019-Present)</option>
                      <option value="G30">G30 / G31 (2017-2023)</option>
                      <option value="F30">F30 / F31 (2012-2018)</option>
                      <option value="F10">F10 / F11 (2010-2016)</option>
                    </select>
                  </div>

                  {/* Col 4: YEAR */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Model Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#26354A] rounded-lg px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#00C2CB] cursor-pointer"
                    >
                      <option value="">All Years</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                      <option value="2019">2019</option>
                    </select>
                  </div>

                  {/* Col 5: CATEGORY */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Component
                    </label>
                    <select
                      value={selectedCat}
                      onChange={(e) => setSelectedCat(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#26354A] rounded-lg px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#00C2CB] cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {categories?.map((cat: any) => (
                        <option key={cat.id || cat._id} value={cat.id || cat._id}>
                          {cat.name || cat.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Col 6: SEARCH ACTION BUTTON */}
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-900/30"
                    >
                      <Search size={14} />
                      <span>Search parts</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Tab 2: VIN Number Search */
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Enter 17-Digit Vehicle Identification Number (VIN)
                    </label>
                    <input
                      type="text"
                      maxLength={17}
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WBA3A5C59DF123456"
                      className="w-full bg-[#0B0F19] border border-[#26354A] rounded-lg px-4 py-2.5 text-sm font-mono tracking-widest text-white focus:outline-none focus:border-[#00C2CB]"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/contact-us?subject=VIN+Verification&vin=${encodeURIComponent(vinInput)}`}
                      className="w-full bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-900/30 text-center"
                    >
                      <span>Verify VIN</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PARTS BY CATEGORY SECTION (Figma: Parts by category) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.18em] mb-2">
              CORE INVENTORY
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Parts by category
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Browse through factory-certified European replacement parts across our core categories.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00C2CB] hover:text-[#00E5FF] transition-colors group cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories 4-Column Grid using CategoryCard with Figma Asset fallbacks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesLoading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              <span className="inline-block animate-pulse">Loading catalogue categories...</span>
            </div>
          ) : categories && categories.length > 0 ? (
            categories.slice(0, 4).map((cat: any, idx: number) => {
              const enrichedCat = {
                ...cat,
                image: getCategoryAsset(cat, idx),
              };
              return (
                <CategoryCard
                  key={cat.id || cat._id || idx}
                  cat={enrichedCat}
                  idx={idx}
                  href={`/products?categoryId=${cat.id || cat._id}`}
                />
              );
            })
          ) : (
            // Default 4 core categories matching Figma
            [
              { id: 9, name: "Bumper Assemblies", description: "Complete OEM bumper assemblies with brackets, grilles, and PDC sensors.", image: "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg" },
              { id: 11, name: "Adaptive LED Headlights", description: "Factory genuine matrix LED, laser, and xenon optical assemblies.", image: "/ce1d8aa4367dcb587ee79305a43bd21e5d10d260.jpg" },
              { id: 10, name: "Grilles & Fascias", description: "Genuine radiator grilles, radar trims, and sport honeycomb inserts.", image: "/0065630ec2b4dbc86f746c86f25ccc999111c337.jpg" },
              { id: 12, name: "Lenses & Housings", description: "High-grade optical polycarbonate lenses and rear housing shells.", image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg" },
            ].map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                idx={idx}
                href={`/products?categoryId=${cat.id}`}
              />
            ))
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MOST SELLING PARTS (Figma: Most selling parts) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.18em] mb-2">
              POPULAR REPLACEMENTS
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Most selling parts
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              High-demand genuine OEM body fascias and optical assemblies in stock and ready for immediate dispatch.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00C2CB] hover:text-[#00E5FF] transition-colors group cursor-pointer"
          >
            <span>Explore All Parts</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products 4-Column Grid using ProductCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              <span className="inline-block animate-pulse">Loading catalogue items...</span>
            </div>
          ) : products && products.length > 0 ? (
            products.slice(0, 4).map((prod: any, idx: number) => (
              <ProductCard
                key={prod.id || prod._id || idx}
                prod={prod}
                idx={idx}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              <p>No products loaded in catalogue.</p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRECISION FITMENT SPLIT BANNER (The right part starts with precision) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]">
        <div className="bg-[#161F30] rounded-2xl border border-[#26354A] overflow-hidden p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Technical Checklist & Copy */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.2em] mb-2.5">
                PRECISION ENGINEERING & OEM ACCURACY
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.12] mb-5">
                The right part starts with precision.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-xl">
                Modern luxury vehicles demand exact millimeter tolerance. Subtle variances in replica bumpers or aftermarket headlights can disable radar cruise control, trigger park assist errors, or produce uneven body shut lines.
              </p>

              {/* 4-Item Quality Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "100% VIN-matched fitment verification",
                  "Factory OEM mounting brackets & sensor clips intact",
                  "Original thermoplastic & polycarbonate materials",
                  "Guaranteed coding & electronic alignment",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-[13px] text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-[#00C2CB]/20 flex items-center justify-center shrink-0">
                      <Check size={13} className="text-[#00C2CB]" strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact-us?subject=VIN+Verification"
                  className="bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
                >
                  Verify My Part with VIN
                </Link>
                <Link
                  href="/about"
                  className="bg-[#0B0F19] hover:bg-[#1E293B] text-white border border-[#26354A] hover:border-[#00C2CB] px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all"
                >
                  About Our Quality Standards &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: Original Figma Close-Up Headlight Photo */}
            <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-[#26354A] bg-[#0B0F19] aspect-[4/3] flex items-center justify-center shadow-xl group">
              <img
                src="/734295950a53ab641f4c489e327584416018d44d.jpg"
                alt="Adaptive Matrix LED Headlamp Unit"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#0B0F19]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#26354A]">
                <span className="text-[10px] font-mono font-bold text-[#00C2CB] uppercase tracking-wider">
                  BMW ADAPTIVE LED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. B2B TRUST & VALUE PROPOSITION (Figma: A reliable partner) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.2em] mb-2">
            B2B & COLLISION CENTRES
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            A reliable partner for automotive professionals
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Streamlined supply chains and parts verification for independent bodyshops, fleet managers, and restoration specialists.
          </p>
        </div>

        {/* 4 Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Truck size={24} className="text-[#00C2CB]" />,
              title: "48h Dispatch in Europe",
              desc: "Dedicated logistics packaging in reinforced transit crates to prevent tab or bracket breakage during shipment.",
            },
            {
              icon: <Shield size={24} className="text-[#00C2CB]" />,
              title: "Zero-Risk VIN Match",
              desc: "Every part order is cross-checked with the vehicle's 17-digit VIN before dispatch, avoiding costly return cycles.",
            },
            {
              icon: <Layers size={24} className="text-[#00C2CB]" />,
              title: "800+ In-Stock Parts",
              desc: "Full catalogue covering OEM bumper assemblies, primed shells, matrix LED lights, and replacement outer lenses.",
            },
            {
              icon: <Users size={24} className="text-[#00C2CB]" />,
              title: "Dedicated B2B Desk",
              desc: "Priority RFQ processing, commercial VAT invoicing, and direct WhatsApp technical support for body shops.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#161F30] border border-[#26354A] rounded-xl p-6 flex flex-col justify-between hover:border-[#00C2CB] transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0B0F19] border border-[#26354A] flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. AUTOMOTIVE GUIDES (Figma: Automotive guides) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#26354A]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.18em] mb-2">
              KNOWLEDGE & STANDARDS
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Automotive guides
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Technical articles on OEM body repair, matrix lighting protocols, and parts procurement.
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00C2CB] hover:text-[#00E5FF] transition-colors group cursor-pointer"
          >
            <span>Read All Guides</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Guide Article Cards with Figma Assets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogsLoading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              <span className="inline-block animate-pulse">Loading technical guides...</span>
            </div>
          ) : (
            [
              {
                id: 1,
                title: "Matrix LED Headlight Coding & Fitment Guide for Modern BMWs",
                desc: "Understanding module initialization, voltage stability, and sensor calibration during adaptive front light replacement.",
                image: "/ce1d8aa4367dcb587ee79305a43bd21e5d10d260.jpg",
                author: "Engineering Desk",
                date: "Oct 2026",
              },
              {
                id: 2,
                title: "OEM Bumper Assembly Alignment & ADAS Radar Calibration",
                desc: "How precise bracket positioning directly impacts radar-guided cruise control and park assist sensors.",
                image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
                author: "Collision Standards",
                date: "Oct 2026",
              },
              {
                id: 3,
                title: "Distinguishing Factory OEM Components from Replica Panels",
                desc: "Key markings, stamping stamps, thermoplastic compound standards, and structural rigidity testing.",
                image: "/30580dfd4addb8615661ae3077d481e5696b239e.jpg",
                author: "Quality Audit",
                date: "Oct 2026",
              },
            ].map((blog) => (
              <div
                key={blog.id}
                className="bg-[#161F30] rounded-xl overflow-hidden border border-[#26354A] flex flex-col justify-between group hover:border-[#00C2CB] hover:shadow-[0_8px_24px_rgba(0,194,203,0.15)] transition-all duration-300"
              >
                <div className="h-[210px] overflow-hidden bg-[#0B0F19] relative">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161F30] via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mb-2">
                      <span className="flex items-center gap-1 text-[#00C2CB]">
                        <Calendar size={12} />
                        {blog.date}
                      </span>
                      <span>&bull;</span>
                      <span>{blog.author}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-[#00C2CB] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {blog.desc}
                    </p>
                  </div>
                  <Link
                    href={`/news/${blog.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00C2CB] group-hover:translate-x-1 transition-all"
                  >
                    <span>Read article</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CTA: LOOKING FOR A SPECIFIC CAR PART? */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#161F30] to-[#0E1524] border border-[#26354A] rounded-2xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C2CB]/10 rounded-full blur-[80px] pointer-events-none" />

          <span className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.2em] mb-2.5 block">
            DEDICATED PARTS SOURCING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Looking for a specific car part?
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Cannot find the exact part number in our catalogue? Submit an inquiry with your 17-digit VIN and our parts specialists will verify availability across our European distribution network.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] px-7 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-cyan-900/30 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              Send Part Inquiry (RFQ)
            </Link>
            <Link
              href="/contact-us?subject=VIN+Verification"
              className="bg-[#0B0F19] hover:bg-[#1E293B] text-white border border-[#26354A] hover:border-[#00C2CB] px-7 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              Verify by VIN
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

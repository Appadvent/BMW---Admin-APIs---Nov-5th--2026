"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Check,
  ChevronDown,
  Layers,
  Phone,
  Mail,
  Truck,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Shield,
  FileText,
  Sliders,
  Send,
  Sparkles,
  Award,
  Users,
  Car,
  Globe,
  Headphones,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchCategories } from "../redux/Slice/categorySlice";
import { fetchProducts } from "../redux/Slice/productSlice";
import { fetchAllBlogs } from "../redux/Slice/BlogSlice";
import { sendContact } from "../redux/Slice/contactSlice";
import { useLanguage } from "../utils/LanguageContext";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { list: products, loading: productsLoading, error: productsError } = useAppSelector((state) => state.products);
  const { list: categories, loading: categoriesLoading, error: categoriesError } = useAppSelector((state) => state.categories);
  const { list: blogs, loading: blogsLoading, error: blogsError } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    dispatch(fetchAllBlogs({ page: 1, limit: 10 }));
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
  const [headerSearch, setHeaderSearch] = useState("");

  // VIN inquiry state
  const [quickInquiryModal, setQuickInquiryModal] = useState<string | null>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryPhone) return;
    dispatch(
      sendContact({
        name: inquiryName || "Customer",
        email: "website-rfq@lampalzderzak.pl",
        phone: inquiryPhone,
        category: "Part Inquiry",
        message: `Inquiry regarding: ${quickInquiryModal || "General Part"}`,
      })
    );
    setInquirySent(true);
    setTimeout(() => {
      setQuickInquiryModal(null);
      setInquirySent(false);
      setInquiryName("");
      setInquiryPhone("");
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#070707] text-[#FFFFFF] font-sans antialiased selection:bg-[#DC2626] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (Exact Figma: Black bg, white/gray text, contact info) */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#0d0d0d] border-b border-white/5 text-[12px] text-gray-300 py-2.5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-gray-300">
              <Truck size={14} className="text-[#DC2626]" />
              <span>{t.topBar.delivery}</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-gray-400">
              <Briefcase size={14} className="text-[#DC2626]" />
              <span>{t.topBar.b2b} <strong className="text-white ml-1">+48 000 000 000</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-5 text-[12px] text-gray-300">
            <a
              href="mailto:kontakt@lampalzderzak.com"
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} className="text-[#DC2626]" />
              <span>kontakt@lampalzderzak.com</span>
            </a>
            <div className="flex items-center gap-1.5 pl-3 border-l border-white/15 text-xs font-semibold text-gray-400">
              <span className="text-white font-bold">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HEADER / NAVBAR (Exact Figma: White background, Logo, Links, Wide Search) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm py-2 sm:py-3 transition-all">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo with Emblem */}
          <Link href="/" className="flex items-center shrink-0 group">
            <img
              src="/d4399531705f2cd5cbd3dc79bab27b7f083023f8.png"
              alt="Lampalzderzak.pl"
              className="h-12 w-auto sm:h-14 object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Navigation Links: All Products, About Us, Contact us */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-gray-800 shrink-0">
            <Link href="/products" className="hover:text-[#DC2626] transition-colors">
              {t.nav.allProducts}
            </Link>
            <Link href="/about" className="hover:text-[#DC2626] transition-colors">
              {t.nav.aboutUs}
            </Link>
            <Link href="/contact-us" className="hover:text-[#DC2626] transition-colors">
              {t.nav.contactUs}
            </Link>
          </nav>

          {/* Wide Search Bar with Red "Search parts" Button matching Screenshot */}
          <div className="flex-1 max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (headerSearch.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(headerSearch.trim())}`;
                } else {
                  window.location.href = "/products";
                }
              }}
              className="flex items-stretch border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm focus-within:border-[#DC2626] transition-colors"
            >
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-[#DC2626] hover:bg-[#b91c1c] text-white px-5 sm:px-6 py-2.5 flex items-center gap-2 text-sm font-bold tracking-wide transition-colors shrink-0 cursor-pointer shadow-sm"
              >
                <Search size={16} />
                <span className="hidden sm:inline">{t.nav.searchButton}</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (Figma Car background, Headings, VIN badges) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-20 sm:pb-28 border-b border-white/10">
        {/* Background Image: BMW M4 Grey Car directly from public assets */}
        <div className="absolute inset-0 z-0">
          <img
            src="/76f1295d1c66c026e83fe0b88ecfaad88654837c.png"
            alt="BMW Sports Coupe"
            className="w-full h-full object-cover object-top filter brightness-[0.45] contrast-125"
          />
          {/* Gradients to blend seamless dark look */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl pt-4 sm:pt-10">
            {/* Top Red Subheading Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-white text-[11px] font-bold tracking-[0.16em] uppercase mb-4">
              <span>{t.hero.kicker}</span>
            </div>

            {/* Main Hero Headline (Word to Word from Figma) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[70px] font-extrabold text-white tracking-tight leading-[1.1] mb-5">
              The right part. <br />
              A reliable choice.
            </h1>

            {/* Description Paragraph */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              {t.hero.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <Link
                href="/products"
                className="bg-[#DC2626] hover:bg-[#b91c1c] text-white px-6 py-3 rounded-md text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>{t.hero.browseParts}</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="#vin-search"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-md text-sm font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
              >
                <span>{t.hero.checkVin}</span>
              </a>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* VEHICLE / VIN FILTER WIDGET (Image 2: Exact Layout from Screenshot) */}
          {/* ===================================================================== */}
          <div id="vin-search" className="mt-12 sm:mt-16">
            {/* Trust Badges immediately above the white card on dark background */}
            <div className="flex flex-wrap items-center gap-7 text-[13px] font-semibold text-gray-200 mb-3 px-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#DC2626]" />
                <span>{t.hero.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={17} className="text-[#DC2626]" />
                <span>{t.hero.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones size={17} className="text-[#DC2626]" />
                <span>{t.hero.trust3}</span>
              </div>
            </div>

            {/* White Floating Card with Top Red Accent Border */}
            <div className="bg-white rounded-sm shadow-2xl p-5 sm:p-7 text-gray-900 border-t-[3px] border-[#DC2626]">
              {/* Widget Tabs */}
              <div className="flex items-center gap-8 border-b border-gray-200 pb-3 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("vehicle")}
                  className={`text-sm font-bold pb-2 relative transition-colors cursor-pointer flex items-center gap-2 ${activeTab === "vehicle" ? "text-[#DC2626]" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <Car size={17} className={activeTab === "vehicle" ? "text-[#DC2626]" : "text-gray-500"} />
                  <span>{t.searchWidget.tabVehicle}</span>
                  {activeTab === "vehicle" && (
                    <span className="absolute -bottom-3 left-0 right-0 h-[3px] bg-[#DC2626]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("vin")}
                  className={`text-sm font-bold pb-2 relative transition-colors cursor-pointer flex items-center gap-2 ${activeTab === "vin" ? "text-[#DC2626]" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <ShieldCheck size={17} className={activeTab === "vin" ? "text-[#DC2626]" : "text-gray-500"} />
                  <span>{t.searchWidget.tabVin}</span>
                  {activeTab === "vin" && (
                    <span className="absolute -bottom-3 left-0 right-0 h-[3px] bg-[#DC2626]" />
                  )}
                </button>
              </div>

              {/* Tab 1: Exact 6 Columns from Image 2 */}
              {activeTab === "vehicle" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-end">
                  {/* Col 1: VEHICLE BRAND */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.searchWidget.vehicleBrand}
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#DC2626] cursor-pointer"
                    >
                      <option value="">{t.searchWidget.selectPlaceholder}</option>
                      <option value="BMW">BMW</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Audi">Audi</option>
                      <option value="Range Rover">Range Rover</option>
                    </select>
                  </div>

                  {/* Col 2: MODEL */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.searchWidget.model}
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#DC2626] cursor-pointer"
                    >
                      <option value="">{t.searchWidget.selectPlaceholder}</option>
                      <option value="3 Series">3 Series / M3</option>
                      <option value="4 Series">4 Series / M4</option>
                      <option value="5 Series">5 Series / M5</option>
                      <option value="7 Series">7 Series</option>
                      <option value="X3">X3 / X3 M</option>
                      <option value="X5">X5 / X5 M</option>
                    </select>
                  </div>

                  {/* Col 3: GENERATION */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.searchWidget.generation}
                    </label>
                    <select
                      value={selectedGen}
                      onChange={(e) => setSelectedGen(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#DC2626] cursor-pointer"
                    >
                      <option value="">{t.searchWidget.selectPlaceholder}</option>
                      <option value="G20/G21">G20 / G21</option>
                      <option value="G30/G31">G30 / G31</option>
                      <option value="F30/F31">F30 / F31</option>
                      <option value="F10/F11">F10 / F11</option>
                      <option value="W205">W205</option>
                      <option value="W213">W213</option>
                    </select>
                  </div>

                  {/* Col 4: MODEL YEAR */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.searchWidget.modelYear}
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#DC2626] cursor-pointer"
                    >
                      <option value="">{t.searchWidget.selectPlaceholder}</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                      <option value="2019">2019</option>
                      <option value="2018">2018</option>
                    </select>
                  </div>

                  {/* Col 5: CATEGORY */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.searchWidget.category}
                    </label>
                    <select
                      value={selectedCat}
                      onChange={(e) => setSelectedCat(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#DC2626] cursor-pointer"
                    >
                      <option value="">{t.searchWidget.selectPlaceholder}</option>
                      <option value="Bumpers">Bumpers</option>
                      <option value="Headlights">Headlights</option>
                      <option value="Grilles">Grilles</option>
                      <option value="Housings">Lenses & Housings</option>
                    </select>
                  </div>

                  {/* Col 6: OEM / OE NUMBER */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.searchWidget.oemNumber}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={oemInput}
                        onChange={(e) => setOemInput(e.target.value)}
                        placeholder={t.searchWidget.oemPlaceholder}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Tab 2: VIN Number Check */
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.searchWidget.vinLabel}
                    </label>
                    <input
                      type="text"
                      maxLength={17}
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                      placeholder={t.searchWidget.vinPlaceholder}
                      className="w-full bg-white border border-gray-300 rounded px-4 py-2.5 text-sm font-mono tracking-widest text-gray-800 focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/contact-us?subject=VIN+Verification&vin=${encodeURIComponent(vinInput)}`}
                      className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold py-2.5 px-4 rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-red-600/30"
                    >
                      <span>{t.searchWidget.vinVerifyBtn}</span>
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
      {/* 4. SELECT VEHICLE BRAND (Parts by brand) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[#DC2626] font-bold text-[11px] uppercase tracking-[0.18em] mb-1">
              {t.brands.kicker}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.brands.title}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {t.brands.desc}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors group cursor-pointer"
          >
            <span>{t.brands.allBrands}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#DC2626]" />
          </Link>
        </div>

        {/* 4 Brand Showcase Cards (BMW, Mercedes-Benz, Audi, Range Rover) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: "01",
              name: "BMW",
              desc: "Body panels and parts for Series 1, 3, 4, 5, 7 and the X lineup.",
              img: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
              link: "/products?brand=BMW",
            },
            {
              id: "02",
              name: "Mercedes-Benz",
              desc: "Exterior panels for passenger cars and SUVs (C, E, S, GLC, GLE).",
              img: "/13d46830bc0c8f31c49b6fb7035b8c4135d3134c.jpg",
              link: "/products?brand=Mercedes-Benz",
            },
            {
              id: "03",
              name: "Audi",
              desc: "Modern LED / Matrix lighting components and S-Line bumpers.",
              img: "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg",
              link: "/products?brand=Audi",
            },
            {
              id: "04",
              name: "Range Rover",
              desc: "Body components for Vogue, Sport, Velar, and Evoque models.",
              img: "/7b38ef87e0ed90915af6670b2661616389757b59.jpg",
              link: "/products?brand=Range+Rover",
            },
          ].map((brand) => (
            <Link
              key={brand.id}
              href={brand.link}
              className="group relative h-[360px] rounded-lg overflow-hidden border border-white/10 hover:border-[#DC2626]/60 transition-all duration-300 flex flex-col justify-end p-6 cursor-pointer bg-[#111]"
            >
              <img
                src={brand.img}
                alt={brand.name}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] group-hover:scale-105 group-hover:brightness-[0.75] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="relative z-10">
                <span className="text-[11px] font-mono font-bold text-[#DC2626] tracking-widest block mb-1">
                  {brand.id}
                </span>
                <h3 className="text-xl font-extrabold text-white mb-1.5 group-hover:text-[#DC2626] transition-colors">
                  {brand.name}
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed mb-3 line-clamp-2">
                  {brand.desc}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white group-hover:text-[#DC2626] transition-colors">
                  <span>Browse brand</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PARTS BY CATEGORY (Exact Figma Layout: 2 Large Top, 4 Small Bottom) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[#DC2626] font-bold text-[11px] uppercase tracking-[0.18em] mb-1">
              {t.categories.kicker}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.categories.title}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
              {t.categories.desc}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors group cursor-pointer"
          >
            <span>{t.categories.allCats}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#DC2626]" />
          </Link>
        </div>

        {/* Categories Asymmetric Grid: Row 1 (2 Large Cards), Row 2 (4 Smaller Cards) */}
        <div className="space-y-4">
          {/* Row 1: 2 Big Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Complete bumpers",
                desc: "114 parts • DEMO DATA",
                img: "/734295950a53ab641f4c489e327584416018d44d.jpg",
                link: "/products?category=bumpers",
              },
              {
                title: "Headlights",
                desc: "164 parts • DEMO DATA",
                img: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
                link: "/products?category=headlights",
              },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className="group relative h-[280px] sm:h-[320px] rounded-sm overflow-hidden border border-white/10 hover:border-[#DC2626]/70 transition-all duration-300 flex flex-col justify-end p-6 sm:p-8 bg-[#0d0d0d] cursor-pointer"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] group-hover:scale-105 group-hover:brightness-[0.7] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                    {cat.desc}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 group-hover:text-[#DC2626] transition-colors">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                    <span>Discover category</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-[#DC2626]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 2: 4 Smaller Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Grilles",
                desc: "72 PARTS • DEMO DATA",
                img: "/0065630ec2b4dbc86f746c86f25ccc999111c337.jpg",
                link: "/products?category=grilles",
              },
              {
                title: "Exterior trims",
                desc: "92 PARTS • DEMO DATA",
                img: "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg",
                link: "/products?category=trims",
              },
              {
                title: "Front splitters",
                desc: "34 PARTS • DEMO DATA",
                img: "/13d46830bc0c8f31c49b6fb7035b8c4135d3134c.jpg",
                link: "/products?category=splitters",
              },
              {
                title: "Body elements",
                desc: "118 PARTS • DEMO DATA",
                img: "/65743bae6004f15c86ba5c7172a8a08e3daa5382.jpg",
                link: "/products?category=body",
              },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className="group relative h-[210px] sm:h-[230px] rounded-sm overflow-hidden border border-white/10 hover:border-[#DC2626]/70 transition-all duration-300 flex flex-col justify-end p-5 bg-[#0d0d0d] cursor-pointer"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.5] group-hover:scale-105 group-hover:brightness-[0.7] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                <div className="relative z-10">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                    {cat.desc}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#DC2626] transition-colors">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300 group-hover:text-white transition-colors">
                    <span>Discover category</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform text-[#DC2626]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MOST SELLING PARTS (Exact Figma Card Layout & Styling) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[#DC2626] font-bold text-[11px] uppercase tracking-[0.18em] mb-1">
              {t.recommended.kicker}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.recommended.title}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
              {t.recommended.desc}
            </p>
          </div>
          <Link
            href="/products"
            className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-5 py-2.5 rounded-sm text-xs transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
          >
            {t.recommended.allCatalog}
          </Link>
        </div>

        {/* 4 Product Cards in Clean White Box style as shown in Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: 1,
              tag: "BMW",
              title: "Front bumper BMW Series 3 G20",
              img: "/734295950a53ab641f4c489e327584416018d44d.jpg",
              vehicle: "G20 - 2019-2022",
              number: "OEM: sample data",
              finish: "Primed",
              statusText: "COMPATIBILITY DATA AVAILABLE",
              statusType: "success",
            },
            {
              id: 2,
              tag: "BMW",
              title: "LED headlight BMW Series 5 G30",
              img: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
              vehicle: "G30 / G31 - 2017-2020",
              number: "OE: sample data",
              finish: "Complete",
              statusText: "REQUIRES VERIFICATION",
              statusType: "warning",
            },
            {
              id: 3,
              tag: "MERCEDES-BENZ",
              title: "Front bumper C-Class W205",
              img: "/13d46830bc0c8f31c49b6fb7035b8c4135d3134c.jpg",
              vehicle: "W205 - 2021+",
              number: "OEM: sample data",
              finish: "To be painted",
              statusText: "COMPATIBILITY DATA AVAILABLE",
              statusType: "success",
            },
            {
              id: 4,
              tag: "MERCEDES-BENZ",
              title: "Grille E-Class W213",
              img: "/0065630ec2b4dbc86f746c86f25ccc999111c337.jpg",
              vehicle: "W213 - 2016-2020",
              number: "OE: sample data",
              finish: "Gloss black",
              statusText: "REQUIRES VERIFICATION",
              statusType: "warning",
            },
          ].map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-none border border-gray-200 text-gray-900 flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
            >
              {/* Product Visual Photo */}
              <div className="relative h-[220px] bg-[#0c0c0c] overflow-hidden group">
                <img
                  src={prod.img}
                  alt={prod.title}
                  className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-500"
                />
                {/* Visualization label at bottom left of image */}
                <span className="absolute bottom-2 left-2 bg-black/70 text-gray-300 text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-xs">
                  VISUALIZATION
                </span>
              </div>

              {/* Product Details Section */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Brand Tag Kicker */}
                  <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider block mb-1">
                    {prod.tag}
                  </span>

                  {/* Title */}
                  <h4 className="text-[14px] font-extrabold text-gray-900 leading-snug mb-4 hover:text-[#DC2626] transition-colors line-clamp-2">
                    {prod.title}
                  </h4>

                  {/* Technical Specs Table */}
                  <div className="space-y-2 text-[11px] border-t border-gray-100 pt-3 mb-4">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Vehicle:</span>
                      <span className="font-medium text-gray-800 text-right">{prod.vehicle}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Number:</span>
                      <span className="font-mono font-medium text-gray-800 text-right">{prod.number}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Finish:</span>
                      <span className="font-medium text-gray-800 text-right">{prod.finish}</span>
                    </div>
                  </div>
                </div>

                {/* Compatibility Badge + Bottom Action Buttons */}
                <div>
                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        prod.statusType === "success"
                          ? "text-[#15803D]"
                          : "text-[#B45309]"
                      }`}
                    >
                      {prod.statusType === "success" ? (
                        <Check size={13} className="text-[#16A34A] stroke-[2.5]" />
                      ) : (
                        <ShieldCheck size={13} className="text-[#D97706] stroke-[2.5]" />
                      )}
                      <span>{prod.statusText}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Details -> and Inquire about the part */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Link
                      href="/products"
                      className="text-xs font-bold text-gray-700 hover:text-[#DC2626] transition-colors flex items-center gap-1 px-1"
                    >
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setQuickInquiryModal(prod.title)}
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-800 text-[11px] font-bold py-2 px-2 border border-gray-300 rounded-xs transition-colors cursor-pointer text-center truncate shadow-2xs"
                    >
                      Inquire about the part
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. COMPATIBILITY & VIN MATCHING SECTION (Image 3: Exact from Screenshot) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: Car Inspection photo with bounding box & PDC / OEM badges */}
          <div className="lg:col-span-6 relative rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d0d] group">
            <img
              src="/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg"
              alt="Compatibility Verification"
              className="w-full h-[400px] sm:h-[480px] object-cover filter brightness-[0.78] contrast-110"
            />
            {/* White outline bounding frame around car front */}
            <div className="absolute inset-5 sm:inset-8 border border-white/20 pointer-events-none" />

            {/* Top Right Tag: PDC CHECK */}
            <div className="absolute top-[32%] right-[16%] flex items-center bg-[#151515]/90 border border-white/15 backdrop-blur-md px-3 py-1.5 rounded-xs shadow-lg">
              <span className="w-1 h-3.5 bg-[#DC2626] mr-2 inline-block rounded-xs" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-white">
                PDC <span className="text-gray-400">CHECK</span>
              </span>
            </div>

            {/* Bottom Left Tag: OEM MATCH */}
            <div className="absolute bottom-[24%] left-[12%] flex items-center bg-[#151515]/90 border border-white/15 backdrop-blur-md px-3 py-1.5 rounded-xs shadow-lg">
              <span className="w-1 h-3.5 bg-[#DC2626] mr-2 inline-block rounded-xs" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-white">
                OEM <span className="text-[#DC2626]">MATCH</span>
              </span>
            </div>
          </div>

          {/* Right: Checklist & Content from Screenshot 3 */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[#DC2626] font-bold text-[11px] uppercase tracking-[0.2em] mb-2">
              {t.matchSection.kicker}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.15] mb-4">
              {t.matchSection.title}
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
              {t.matchSection.desc}
            </p>

            {/* 2-Column Checklist from Screenshot 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-8">
              {t.matchSection.checkItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[12px] sm:text-[13px] text-gray-200">
                  <Check size={14} className="text-[#DC2626] shrink-0" strokeWidth={2.5} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/contact-us?subject=VIN+Verification"
                className="bg-[#DC2626] hover:bg-[#b91c1c] text-white px-7 py-3 rounded-xs text-xs sm:text-sm font-bold shadow-lg shadow-red-900/30 transition-all cursor-pointer"
              >
                {t.matchSection.verifyBtn}
              </Link>
              <Link
                href="/contact-us"
                className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>{t.matchSection.contactAdvisor}</span>
                <span className="text-sm font-mono">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. HOW IT WORKS (Image 4: Exact 4-Column Bordered Layout from Screenshot) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="mb-12">
          <p className="text-[#DC2626] font-bold text-[11px] uppercase tracking-[0.2em] mb-1">
            {t.howItWorks.kicker}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            {t.howItWorks.desc}
          </p>
        </div>

        {/* 4 bordered step columns with vertical dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-r border-white/10">
          {t.howItWorks.steps.map((item, idx) => (
            <div
              key={idx}
              className="border-l border-white/10 p-6 sm:p-7 flex flex-col justify-start relative group"
            >
              <span className="text-xs font-mono font-bold text-[#DC2626] mb-8 block">
                {item.num}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. B2B COOPERATION (Image 5: Exact from Screenshot) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="relative rounded-sm overflow-hidden bg-[#161719] p-8 sm:p-14 border border-white/10">
          {/* Faint large capital letters "LA" watermark on the right */}
          <div className="absolute right-0 top-0 bottom-0 pointer-events-none flex items-center pr-6 sm:pr-12 select-none">
            <span className="text-[160px] sm:text-[230px] font-black text-white/5 leading-none tracking-tighter">
              LA
            </span>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-[#DC2626] font-bold text-[11px] uppercase tracking-[0.2em] mb-2 block">
                {t.b2b.kicker}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">
                {t.b2b.title}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                {t.b2b.desc}
              </p>

              {/* 3 tag outline boxes */}
              <div className="flex flex-wrap items-center gap-2.5">
                {t.b2b.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="border border-white/20 bg-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Buttons: Red "Become a partner" + Charcoal "Business inquiry" */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/contact-us?subject=Wspolpraca+B2B"
                className="bg-[#DC2626] hover:bg-[#b91c1c] text-white px-8 py-3.5 rounded-xs text-xs sm:text-sm font-bold text-center shadow-lg shadow-red-900/30 transition-all cursor-pointer min-w-[200px]"
              >
                {t.b2b.partnerBtn}
              </Link>
              <Link
                href="/contact-us"
                className="bg-[#242629] hover:bg-[#2e3135] text-white border border-white/10 px-8 py-3.5 rounded-xs text-xs sm:text-sm font-bold text-center transition-all cursor-pointer min-w-[200px]"
              >
                {t.b2b.quoteBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* 3-Column Feature Strip (Red-highlighted section from screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-8 pt-8 border-t border-white/10">
          {/* Feature 1: Delivery in Poland */}
          <div className="flex items-start gap-3.5 py-4 px-2 sm:px-6 border-b md:border-b-0 md:border-r border-white/10">
            <Package size={20} className="text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {t.b2b.features[0].title}
              </h4>
              <p className="text-xs text-gray-400">
                {t.b2b.features[0].desc}
              </p>
            </div>
          </div>

          {/* Feature 2: European shipping */}
          <div className="flex items-start gap-3.5 py-4 px-2 sm:px-6 border-b md:border-b-0 md:border-r border-white/10">
            <Globe size={20} className="text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {t.b2b.features[1].title}
              </h4>
              <p className="text-xs text-gray-400">
                {t.b2b.features[1].desc}
              </p>
            </div>
          </div>

          {/* Feature 3: Assistance in matching */}
          <div className="flex items-start gap-3.5 py-4 px-2 sm:px-6">
            <Headphones size={20} className="text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {t.b2b.features[2].title}
              </h4>
              <p className="text-xs text-gray-400">
                {t.b2b.features[2].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. AUTOMOTIVE GUIDES (Articles & Knowledge from Figma) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[#DC2626] font-bold text-[11px] uppercase tracking-[0.18em] mb-1">
              {t.guides.kicker}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.guides.title}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {t.guides.desc}
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors group cursor-pointer"
          >
            <span>{t.guides.allGuides}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#DC2626]" />
          </Link>
        </div>

        {/* 3 Guide Article Cards from API */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogsLoading ? (
            <div className="col-span-full py-12 text-center text-gray-400 text-sm">
              <span className="inline-block animate-pulse">Loading guides from database...</span>
            </div>
          ) : blogs && blogs.length > 0 ? (
            blogs.slice(0, 3).map((blog: any, idx: number) => {
              const dateStr = blog?.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
                : "—";
              const cleanDesc =
                blog?.shortDescription ||
                blog?.description?.replace(/<[^>]+>/g, "").slice(0, 110) + "...";
              const img =
                blog?.image ||
                blog?.thumbnail ||
                "/placeholder-car.jpg";
              const blogId = blog?.id || blog?._id || idx;

              return (
                <div
                  key={blogId}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 text-gray-900 flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-[200px] overflow-hidden bg-gray-900">
                    <img
                      src={img}
                      alt={blog?.title || "Automotive Guide"}
                      className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider block mb-2">
                        {dateStr}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#DC2626] transition-colors line-clamp-2">
                        {blog?.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {cleanDesc}
                      </p>
                    </div>
                    <Link
                      href={`/news/${blogId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 group-hover:text-[#DC2626] transition-colors"
                    >
                      <span>{t.guides.read}</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-[#DC2626]" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-gray-400 text-sm">
              <p>No guides found in database. Add articles in the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. BOTTOM CTA / LOOKING FOR A SPECIFIC CARPART? */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-[#DC2626] font-bold text-[11px] uppercase tracking-[0.18em] mb-2 block">
            {t.bottomCta.kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Looking for a specific carpart?
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-8">
            {t.bottomCta.desc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="bg-[#DC2626] hover:bg-[#b91c1c] text-white px-7 py-3.5 rounded text-sm font-bold shadow-lg shadow-red-900/40 transition-all cursor-pointer"
            >
              {t.bottomCta.sendInquiry}
            </Link>
            <Link
              href="/contact-us?subject=VIN+Verification"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded text-sm font-bold transition-all cursor-pointer"
            >
              {t.bottomCta.verifyVin}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Part Inquiry Modal Popup */}
      {quickInquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/15 rounded-xl max-w-md w-full p-6 text-white relative shadow-2xl">
            <button
              onClick={() => setQuickInquiryModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Check Part Availability</h3>
            <p className="text-xs text-gray-300 mb-4 bg-white/5 p-3 rounded border border-white/10">
              <strong className="text-white block">{quickInquiryModal}</strong>
              Enter your contact details so our parts specialist can confirm fitment, availability, and pricing.
            </p>

            {inquirySent ? (
              <div className="bg-green-900/40 border border-green-500/50 p-4 rounded text-center text-xs text-green-300">
                Thank you! Our advisor will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    Full Name / Company
                  </label>
                  <input
                    type="text"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full bg-[#1e1e1e] border border-white/15 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DC2626]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="e.g. +48 000 000 000"
                    className="w-full bg-[#1e1e1e] border border-white/15 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DC2626]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. FIGMA FOOTER (Complete Navigation & Legal in English) */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#0a0a0a] border-t border-white/10 pt-16 pb-12 text-gray-400 text-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4 group">
                <img
                  src="/d4399531705f2cd5cbd3dc79bab27b7f083023f8.png"
                  alt="Lampalzderzak.pl"
                  className="w-10 h-10 object-contain drop-shadow"
                />
                <span className="text-lg font-black tracking-tight text-white uppercase leading-none">
                  Lampa<span className="text-[#DC2626]">I</span>Zderzak<span className="text-[#DC2626] text-xs lowercase">.pl</span>
                </span>
              </Link>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-4">
                Specialized distributor of genuine OEM replacement body panels, bumpers, lighting systems,
                and exterior housings for BMW, Mercedes-Benz, Audi, and Range Rover.
              </p>
              <div className="flex flex-col gap-1 text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Phone size={12} className="text-[#DC2626]" /> +48 000 000 000
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={12} className="text-[#DC2626]" /> contact@lampalzderzak.com
                </span>
              </div>
            </div>

            {/* Col 2: Brand Catalog */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Vehicle Brands
              </h4>
              <ul className="space-y-2 text-[12px]">
                <li><Link href="/products?brand=BMW" className="hover:text-white transition-colors">BMW</Link></li>
                <li><Link href="/products?brand=Mercedes-Benz" className="hover:text-white transition-colors">Mercedes-Benz</Link></li>
                <li><Link href="/products?brand=Audi" className="hover:text-white transition-colors">Audi</Link></li>
                <li><Link href="/products?brand=Range+Rover" className="hover:text-white transition-colors">Range Rover</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">All Models</Link></li>
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Categories
              </h4>
              <ul className="space-y-2 text-[12px]">
                <li><Link href="/products?category=bumpers" className="hover:text-white transition-colors">Bumpers & Trims</Link></li>
                <li><Link href="/products?category=headlights" className="hover:text-white transition-colors">LED Headlights</Link></li>
                <li><Link href="/products?category=grilles" className="hover:text-white transition-colors">Grilles & Housings</Link></li>
                <li><Link href="/products?category=lenses" className="hover:text-white transition-colors">Lenses & Covers</Link></li>
                <li><Link href="/products?category=splitters" className="hover:text-white transition-colors">Splitters & Moldings</Link></li>
              </ul>
            </div>

            {/* Col 4: Info & Support */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Help & Information
              </h4>
              <ul className="space-y-2 text-[12px]">
                <li><Link href="/contact-us?subject=VIN+Verification" className="hover:text-white transition-colors">VIN Fitment Verification</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Company</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">Knowledge Base & Guides</Link></li>
                <li><Link href="/contact-us?subject=B2B" className="hover:text-white transition-colors">Workshop Cooperation</Link></li>
                <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Advisor</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <p>&copy; {new Date().getFullYear()} Lampalzderzak.pl. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/about" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <span className="text-gray-400 font-semibold">EN</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

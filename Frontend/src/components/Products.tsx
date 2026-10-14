'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldCheck, Car } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchCategories } from "../redux/Slice/categorySlice";
import { fetchProducts } from "../redux/Slice/productSlice";
import ProductCard from './ProductCard';

function ProductsContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategoryId = searchParams.get('categoryId');
  const urlSearch = searchParams.get('search') || '';

  const { list: categories } = useAppSelector((state) => state.categories);
  const { list: products, loading: prodLoading } = useAppSelector((state) => state.products);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>(urlCategoryId || 'all');
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch categories on mount if not loaded
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories?.length]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Synchronize state and fetch products whenever category or search changes
  useEffect(() => {
    const catParam = urlCategoryId || 'all';
    setSelectedCategoryId(catParam);

    const queryParams: any = {};
    if (catParam !== 'all') {
      queryParams.categoryId = catParam;
    }
    if (debouncedSearch.trim()) {
      queryParams.search = debouncedSearch.trim();
    }

    dispatch(fetchProducts(queryParams));
  }, [urlCategoryId, debouncedSearch, dispatch]);

  const handleCategorySelect = (catId: number | string) => {
    setSelectedCategoryId(catId);
    const params = new URLSearchParams(searchParams.toString());
    if (catId === 'all') {
      params.delete('categoryId');
    } else {
      params.set('categoryId', String(catId));
    }
    router.push(`/products?${params.toString()}`);
  };

  // Active Category Object
  const activeCategory = useMemo(() => {
    if (selectedCategoryId === 'all' || !categories) return null;
    return categories.find(
      (c: any) => String(c.id || c._id) === String(selectedCategoryId)
    );
  }, [categories, selectedCategoryId]);

  const headingText = activeCategory
    ? activeCategory.name
    : "Automotive Parts Catalogue";

  const descriptionText = activeCategory
    ? (activeCategory.description || "Genuine OEM automotive components. Guaranteed fitment and specification verification.")
    : "Genuine OEM replacement bumpers, shells, headlights, lenses, and housings for BMW, Mercedes-Benz, Audi, and Range Rover. Part verification via OEM numbers and VIN.";

  return (
    <div className="w-full bg-[#F8F9FA] min-h-screen">
      {/* 1. Header Banner */}
      <section className="relative bg-[#0F172A] pt-28 sm:pt-36 lg:pt-40 pb-14 sm:pb-20 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-radial-gradient from-red-950/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[#0F172A]/90"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C82021] animate-pulse"></span>
            <p className="text-[#C82021] font-bold text-[11px] uppercase tracking-[0.2em]">
              {activeCategory ? "OEM PRODUCT CATEGORY" : "REPLACEMENT PARTS CATALOGUE"}
            </p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {headingText}
          </h1>
          <p className="text-slate-300 font-normal text-[15px] md:text-[16px] max-w-[720px] leading-relaxed mb-8">
            {descriptionText}
          </p>

          {/* Quick Search Bar */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 max-w-3xl flex flex-col sm:flex-row items-center gap-2 shadow-xl">
            <div className="relative flex-grow w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by OEM number (e.g. 51117292959), model (G20, F30, W205)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#C82021] border border-slate-700/80"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-300 hover:text-white px-3 py-1.5 self-end sm:self-center cursor-pointer"
              >
                Clear
              </button>
            )}
            <Link
              href="/contact-us?subject=VIN+Verification"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#C82021] hover:bg-[#A01819] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Car size={15} />
              Verify via VIN
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Direct Category Filter Pills (No subcategories) */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories ({products?.length || 0})
            </button>
            {categories && categories.map((cat: any) => {
              const isActive = String(cat.id || cat._id) === String(selectedCategoryId);
              return (
                <button
                  key={cat.id || cat._id}
                  onClick={() => handleCategorySelect(cat.id || cat._id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#C82021] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Products Grid */}
      <section className="py-10 md:py-16 bg-[#F8F9FA] pb-24 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-medium text-gray-500">
              Showing <strong className="text-gray-900 font-bold">{products?.length || 0}</strong> parts
              {debouncedSearch && <span> for: &quot;{debouncedSearch}&quot;</span>}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Guaranteed OEM Compatibility</span>
            </div>
          </div>

          {!isMounted || prodLoading ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-24">
              <div className="w-10 h-10 border-4 border-[#C82021] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 text-sm font-medium">Loading automotive components...</p>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="py-12 md:py-20 px-6 text-center bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center max-w-xl mx-auto shadow-xs">
              <Car size={42} className="text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1.5">No matching parts found</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                We couldn&apos;t find any components matching your criteria. Contact us with your VIN or part number — our warehouse will confirm availability.
              </p>
              <Link
                href="/contact-us"
                className="px-5 py-2.5 bg-[#C82021] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#A01819] transition-colors"
              >
                Submit Part Inquiry
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {products.map((prod: any, idx: number) => (
                <ProductCard key={prod.id || prod._id || idx} prod={prod} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. B2B & RFQ Consultation Section */}
      <section className="bg-[#0F172A] py-12 md:py-20 text-center border-t border-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[#C82021] font-bold text-[11px] uppercase tracking-widest mb-3">
            WORKSHOP & DISTRIBUTOR INQUIRIES (B2B)
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Looking for Regular Supply of OEM Replacement Parts?
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            We partner with body repair workshops, independent collision specialists, and trade distributors. Benefit from VIN compatibility checks, direct warehouse pricing, and fast dispatch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact-us"
              className="w-full sm:w-auto bg-[#C82021] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#A01819] transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
            >
              Request for Quotation (RFQ) <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/48221234567?text=Hello%2C+I+would+like+to+inquire+about+OEM+automotive+parts."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-slate-800 text-white border border-slate-700 px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">Loading Catalogue...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

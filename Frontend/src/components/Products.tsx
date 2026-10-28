'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowRight, Shield, Car, Filter, Check, Layers } from 'lucide-react';
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
  const urlBrand = searchParams.get('brand') || '';

  const { list: categories } = useAppSelector((state) => state.categories);
  const { list: products, loading: prodLoading } = useAppSelector((state) => state.products);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>(urlCategoryId || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand || 'all');
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories?.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Filter products by brand client-side if selected
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedBrand === 'all') return products;
    return products.filter((p: any) =>
      p.make?.toLowerCase()?.includes(selectedBrand.toLowerCase()) ||
      p.title?.toLowerCase()?.includes(selectedBrand.toLowerCase())
    );
  }, [products, selectedBrand]);

  const activeCategory = useMemo(() => {
    if (selectedCategoryId === 'all' || !categories) return null;
    return categories.find(
      (c: any) => String(c.id || c._id) === String(selectedCategoryId)
    );
  }, [categories, selectedCategoryId]);

  return (
    <div className="w-full bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      {/* 1. Header Banner matching Figma Frame 2 */}
      <section className="relative pt-12 pb-10 border-b border-[#26354A] bg-[#0E1524]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-[11px] font-bold tracking-[0.16em] uppercase mb-3">
                <Shield size={12} />
                <span>FACTORY CERTIFIED CATALOGUE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                Spare parts for premium vehicles
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {activeCategory
                  ? activeCategory.description || "Original equipment manufacturer components with 100% VIN fitment guarantee."
                  : "Genuine OEM replacement bumpers, shells, headlights, lenses, and housings for BMW, Mercedes-Benz, Audi, and Range Rover."}
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by part # or model..."
                  className="w-full bg-[#161F30] border border-[#26354A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00C2CB]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid with Left Sidebar matching Figma Frame 2 */}
      <section className="py-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar: Parts Department */}
          <aside className="lg:col-span-3 bg-[#161F30] border border-[#26354A] rounded-2xl p-6 sticky top-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#26354A]">
                <Filter size={16} className="text-[#00C2CB]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Parts department
                </h3>
              </div>

              {/* Category Radio / Filter Buttons */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryId === 'all'
                      ? 'bg-[#00C2CB] text-[#0B0F19] font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-[#0B0F19] hover:text-white'
                  }`}
                >
                  <span>All Categories</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategoryId === 'all' ? 'bg-[#0B0F19]/20 text-[#0B0F19]' : 'bg-[#0B0F19] text-slate-400'}`}>
                    {products?.length || 0}
                  </span>
                </button>

                {categories?.map((cat: any) => {
                  const isActive = String(cat.id || cat._id) === String(selectedCategoryId);
                  return (
                    <button
                      key={cat.id || cat._id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id || cat._id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#00C2CB] text-[#0B0F19] font-bold shadow-sm'
                          : 'text-slate-300 hover:bg-[#0B0F19] hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name || cat.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Brand Filter */}
            <div className="pt-4 border-t border-[#26354A]">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Vehicle Brand
              </h4>
              <div className="space-y-2 text-xs">
                {['all', 'BMW', 'Mercedes-Benz', 'Audi', 'Range Rover'].map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="brandFilter"
                      checked={selectedBrand === brand}
                      onChange={() => setSelectedBrand(brand)}
                      className="accent-[#00C2CB] cursor-pointer"
                    />
                    <span>{brand === 'all' ? 'All Brands' : brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* VIN Match Help Box */}
            <div className="pt-4 border-t border-[#26354A]">
              <div className="bg-[#0B0F19] border border-[#26354A] rounded-xl p-4 text-center">
                <Shield size={24} className="text-[#00C2CB] mx-auto mb-2" />
                <h5 className="text-xs font-bold text-white mb-1">Uncertain on fitment?</h5>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Send your 17-digit VIN. We verify brackets, sensors, and coding.
                </p>
                <Link
                  href="/contact-us?subject=VIN+Verification"
                  className="block w-full py-2 bg-[#161F30] hover:bg-[#1E293B] text-[#00C2CB] border border-[#26354A] hover:border-[#00C2CB] rounded-lg text-[11px] font-bold transition-all"
                >
                  Verify via VIN &rarr;
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Column: Product Cards Grid */}
          <main className="lg:col-span-9">
            {/* Results Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#26354A] gap-3">
              <p className="text-xs text-slate-400">
                Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> parts in stock
                {debouncedSearch && <span> matching &quot;{debouncedSearch}&quot;</span>}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#00C2CB]">
                <Shield size={14} />
                <span>OEM Verified Condition</span>
              </div>
            </div>

            {!isMounted || prodLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-3 border-[#00C2CB] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 text-xs">Loading replacement parts catalogue...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 px-6 text-center bg-[#161F30] rounded-2xl border border-dashed border-[#26354A] flex flex-col items-center justify-center max-w-md mx-auto">
                <Car size={42} className="text-slate-600 mb-3" />
                <h4 className="text-base font-bold text-white mb-2">No matching parts found</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  We could not find any component matching your filters. Submit an inquiry with your vehicle VIN and our warehouse will verify availability.
                </p>
                <Link
                  href="/contact-us"
                  className="px-6 py-2.5 bg-[#00C2CB] hover:bg-[#00E5FF] text-[#0B0F19] rounded-xl text-xs font-bold transition-all"
                >
                  Submit Part Inquiry (RFQ)
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod: any, idx: number) => (
                  <ProductCard key={prod.id || prod._id || idx} prod={prod} idx={idx} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400">Loading Catalogue...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

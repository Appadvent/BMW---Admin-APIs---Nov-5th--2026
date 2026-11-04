'use client';

import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Check,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCategories } from '../redux/Slice/categorySlice';
import { fetchProducts } from '../redux/Slice/productSlice';
import ProductCard, { ProductItem } from './ProductCard';
import EnquiryPopup from './EnquiryPopup';

const ALL_BUMPER_SPECS = [
  'M Sport / AMG package',
  'PDC openings',
  'Radar support',
  'Camera support',
  'Washer openings',
  'Primed',
];

// Curated automotive parts catalogue ensuring every filter combination returns matching parts
// Matching Figma Frame 169:1136, BMW parts, Mercedes-Benz parts, and Rangerover parts frames
function ProductsContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mainRef = useRef<HTMLDivElement>(null);
  const productSectionRef = useRef<HTMLDivElement>(null);

  const urlCategoryId = searchParams.get('categoryId');
  const urlSearch = searchParams.get('search') || '';
  const urlBrand = searchParams.get('brand') || '';

  const { list: categories } = useAppSelector((state) => state.categories);
  const { list: reduxProducts } = useAppSelector((state) => state.products);

  // Filter States
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand || 'all');
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [selectedBumperSpecs, setSelectedBumperSpecs] = useState<string[]>([]);

  // Accordion Selection States
  const [selectedModelGen, setSelectedModelGen] = useState<string>('all');
  const [selectedModelYear, setSelectedModelYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMountingPosition, setSelectedMountingPosition] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedSpec, setSelectedSpec] = useState<string>('all');

  // Toolbar & View States
  const [activeSort, setActiveSort] = useState<string>('Relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Enquiry Modal State
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState<ProductItem | null>(null);

  // Accordion Open/Close State
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'Model and generation': true,
    'Model year': true,
    'Product category': true,
    'Mounting position': true,
    'Product condition': true,
    'EU / US specification': true,
  });

  const toggleAccordion = (name: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    if (urlBrand) {
      setSelectedBrand(urlBrand);
    }
  }, [urlBrand]);

  useEffect(() => {
    // Sync search query when url query changes
    setSearchQuery(urlSearch);
    setDebouncedSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories?.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const queryParams: any = {};
    if (urlCategoryId && urlCategoryId !== 'all') {
      queryParams.categoryId = urlCategoryId;
    }
    if (debouncedSearch.trim()) {
      queryParams.search = debouncedSearch.trim();
    }
    dispatch(fetchProducts(queryParams));
  }, [urlCategoryId, debouncedSearch, dispatch]);

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (brand === 'all') {
      params.delete('brand');
    } else {
      params.set('brand', brand);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClearAll = () => {
    setSelectedBrand('all');
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedBumperSpecs([]);
    setSelectedModelGen('all');
    setSelectedModelYear('all');
    setSelectedCategory('all');
    setSelectedMountingPosition('all');
    setSelectedCondition('all');
    setSelectedSpec('all');
    setActiveSort('Relevance');
    setCurrentPage(1);
    router.push('/products');
  };

  const toggleBumperSpec = (spec: string) => {
    setSelectedBumperSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
    setCurrentPage(1);
  };

  const handleOpenEnquiry = (prod?: ProductItem) => {
    setEnquiryProduct(prod || null);
    setEnquiryModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic Page Title & Subtitle matching the exact Figma brand screens
  const pageHeadingInfo = useMemo(() => {
    const b = selectedBrand.toLowerCase().trim();
    if (b === 'bmw') {
      return {
        breadcrumb: 'PARTS / BMW',
        title: 'BMW parts',
        subtitle: 'Choose by vehicle and technical parameters. Availability and compatibility are confirmed in response to inquiries.',
      };
    }
    if (b.includes('mercedes')) {
      return {
        breadcrumb: 'PARTS / MERCEDES-BENZ',
        title: 'Mercedes-Benz parts',
        subtitle: 'Choose by vehicle and technical parameters. Availability and compatibility are confirmed in response to inquiries.',
      };
    }
    if (b.includes('range') || b.includes('rover')) {
      return {
        breadcrumb: 'PARTS / RANGE ROVER',
        title: 'Rangerover parts',
        subtitle: 'Choose by vehicle and technical parameters. Availability and compatibility are confirmed in response to inquiries.',
      };
    }
    if (b === 'audi') {
      return {
        breadcrumb: 'PARTS / AUDI',
        title: 'Audi parts',
        subtitle: 'Choose by vehicle and technical parameters. Availability and compatibility are confirmed in response to inquiries.',
      };
    }

    // Default general catalogue
    return {
      breadcrumb: 'CATALOGUE',
      title: 'Spare parts for premium vehicles',
      subtitle: 'Browse our comprehensive catalogue of automotive replacement parts for BMW, Audi, Mercedes-Benz, and Range Rover. All OEM numbers and specifications guaranteed.',
    };
  }, [selectedBrand]);

  // Dynamic models based on selected brand
  const availableModels = useMemo(() => {
    const b = selectedBrand.toLowerCase().trim();
    if (b === 'bmw') {
      return [
        '3 Series (G20/G21)',
        '5 Series (G30/G31)',
        '4 Series (G22/G23)',
        'X5 (G05)',
        '7 Series (G11/G12)',
      ];
    }
    if (b.includes('mercedes')) {
      return [
        'C-Class (W206)',
        'E-Class (W214)',
        'S-Class (W223)',
        'GLC (X254)',
        'GLE (V167)',
      ];
    }
    if (b.includes('range') || b.includes('rover')) {
      return [
        'Range Rover Sport (L461)',
        'Range Rover (L460)',
        'Range Rover Velar (L560)',
        'Defender (L663)',
      ];
    }
    if (b === 'audi') {
      return [
        'A4 (B9)',
        'A6 (C8)',
        'Q7 (4M)',
        'Q8 (4M8)',
        'S3 (8Y)',
      ];
    }
    return [
      '3 Series (G20/G21)',
      '5 Series (G30/G31)',
      'X5 (G05)',
      'C-Class (W206)',
      'E-Class (W214)',
    ];
  }, [selectedBrand]);

  // Pure dynamic backend products
  const baseProducts: ProductItem[] = useMemo(() => {
    if (reduxProducts && Array.isArray(reduxProducts)) {
      return reduxProducts.map((p: any, idx: number) => {
        const specs = Array.isArray(p.specifications) ? p.specifications : [];
        const findSpec = (keyword: string) =>
          specs.find((s: any) => s.name?.toLowerCase().includes(keyword))?.value;

        const modelValue = p.model || findSpec('model') || findSpec('version') || '';
        const conditionValue = p.condition || findSpec('condition') || 'OEM complete piece';
        const finishValue = p.finish || findSpec('finish') || 'To be painted';
        const positionValue = p.position || findSpec('position') || findSpec('mounting') || '';
        const yearValue = p.yearRange || findSpec('year') || '';
        const specType = findSpec('spec') || '';
        const oemVal = p.oemNumber || findSpec('oem') || findSpec('number') || '';

        return {
          id: p.id || p._id || `db-${idx}`,
          title: p.title || p.name || 'Automotive Replacement Part',
          badge: p.make?.toUpperCase() || (p.tag ? p.tag.toUpperCase() : 'OEM'),
          make: p.make || '',
          version: modelValue || 'Universal / Specific Series',
          condition: conditionValue,
          price:
            p.price !== undefined && p.price !== null
              ? typeof p.price === 'number'
                ? `€${p.price.toLocaleString()}`
                : p.price
              : 'Inquire',
          finish: finishValue,
          image: p.image || p.images?.[0] || p.thumbnail || '/products/bumper_assy_row_1.jpeg',
          oemNumber: oemVal,
          category: p.category?.title || p.category?.name || '',
          modelGen: modelValue ? [modelValue] : [],
          modelYear: yearValue ? [yearValue] : [],
          mountingPosition: positionValue ? [positionValue] : [],
          productCondition: conditionValue ? [conditionValue] : [],
          spec: specType ? [specType] : [],
          bumperSpecs: specs.map((s: any) => s.name || s.value),
        };
      });
    }
    return [];
  }, [reduxProducts]);

  // Robust client-side filtering across all selected criteria
  const filteredProducts = useMemo(() => {
    return baseProducts.filter((p) => {
      const pTitle = (p.title || '').toLowerCase();
      const pMake = (p.make || '').toLowerCase();
      const pBadge = (p.badge || '').toLowerCase();
      const pVersion = (p.version || '').toLowerCase();
      const pCategory = (p.category || '').toLowerCase();
      const pOem = (p.oemNumber || '').toLowerCase();

      // 1. Brand Filter
      if (selectedBrand !== 'all') {
        const target = selectedBrand.toLowerCase().trim();
        if (target.includes('range') || target.includes('rover')) {
          if (!pMake.includes('range') && !pMake.includes('rover') && !pBadge.includes('range') && !pBadge.includes('rover') && !pTitle.includes('range') && !pTitle.includes('rover')) {
            return false;
          }
        } else if (target.includes('mercedes')) {
          if (!pMake.includes('mercedes') && !pBadge.includes('mercedes') && !pTitle.includes('mercedes') && !pTitle.includes('benz') && !pTitle.includes('w206') && !pTitle.includes('w214') && !pTitle.includes('glc')) {
            return false;
          }
        } else if (target.includes('bmw')) {
          if (!pMake.includes('bmw') && !pBadge.includes('bmw') && !pTitle.includes('bmw') && !pTitle.includes('g20') && !pTitle.includes('g30') && !pTitle.includes('f20') && !pTitle.includes('f30')) {
            return false;
          }
        } else if (target.includes('audi')) {
          if (!pMake.includes('audi') && !pBadge.includes('audi') && !pTitle.includes('audi')) {
            return false;
          }
        } else {
          if (!pMake.includes(target) && !pBadge.includes(target) && !pTitle.includes(target)) {
            return false;
          }
        }
      }

      // 2. Search Query
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const fullString = `${pTitle} ${pMake} ${pVersion} ${pBadge} ${pOem}`.toLowerCase();
        if (!fullString.includes(query)) {
          return false;
        }
      }

      // 3. Model & Generation
      if (selectedModelGen !== 'all') {
        const targetModel = selectedModelGen.toLowerCase();
        // Check exact match in modelGen array
        const matchGen = p.modelGen?.some((m) => m.toLowerCase().includes(targetModel) || targetModel.includes(m.toLowerCase()));
        
        // Smart matching by keywords in title, version, and model code
        const codes = targetModel.match(/\((.*?)\)/)?.[1]?.toLowerCase()?.split('/') || [];
        const modelName = targetModel.replace(/\(.*?\)/g, '').trim().toLowerCase();
        
        const matchCode = codes.some((c) => pTitle.includes(c) || pVersion.includes(c));
        const matchName = modelName && (pTitle.includes(modelName) || pVersion.includes(modelName));

        if (!matchGen && !matchCode && !matchName) return false;
      }

      // 4. Model Year
      if (selectedModelYear !== 'all') {
        const y = selectedModelYear;
        const matchYear = p.modelYear?.some((my) => my.includes(y));
        
        // Match year range from product title/description e.g. "15-18", "2023", "21-"
        let matchTextYear = false;
        if (y === '2024+') {
          matchTextYear = pTitle.includes('2024') || pTitle.includes('2025') || pTitle.includes('24-');
        } else if (y === '2021 - 2023') {
          matchTextYear = pTitle.includes('2021') || pTitle.includes('2022') || pTitle.includes('2023') || pTitle.includes('21-');
        } else if (y === '2018 - 2020') {
          matchTextYear = pTitle.includes('2018') || pTitle.includes('2019') || pTitle.includes('2020') || pTitle.includes('18-20') || pTitle.includes('18-');
        } else if (y === '2015 - 2017') {
          matchTextYear = pTitle.includes('2015') || pTitle.includes('2016') || pTitle.includes('2017') || pTitle.includes('15-18') || pTitle.includes('15-17') || pTitle.includes('15-19');
        } else if (y === '2010 - 2014') {
          matchTextYear = pTitle.includes('2010') || pTitle.includes('2011') || pTitle.includes('2012') || pTitle.includes('2013') || pTitle.includes('2014') || pTitle.includes('11-14') || pTitle.includes('12-15');
        }

        if (!matchYear && !matchTextYear) return false;
      }

      // 5. Product Category
      if (selectedCategory !== 'all') {
        const targetCat = selectedCategory.toLowerCase();
        const matchCat =
          pCategory.includes(targetCat) ||
          (targetCat.includes('lens') && (pTitle.includes('lens') || pTitle.includes('lamp lens'))) ||
          (targetCat.includes('housing') && (pTitle.includes('housing') || pTitle.includes('shell'))) ||
          (targetCat.includes('bumper') && pTitle.includes('bumper')) ||
          (targetCat.includes('headlight') && (pTitle.includes('headlamp') || pTitle.includes('headlight') || pTitle.includes('led'))) ||
          (targetCat.includes('grille') && (pTitle.includes('grille') || pTitle.includes('grill')));
        if (!matchCat) return false;
      }

      // 6. Mounting Position
      if (selectedMountingPosition !== 'all') {
        const pos = selectedMountingPosition.toLowerCase();
        const matchPos = p.mountingPosition?.some((mp) => mp.toLowerCase().includes(pos));
        const matchTitlePos =
          (pos === 'left' || pos.includes('left')) ? (pTitle.includes('left') || pTitle.includes(' l ') || pTitle.endsWith('left')) :
          (pos === 'right' || pos.includes('right')) ? (pTitle.includes('right') || pTitle.includes(' r ') || pTitle.endsWith('right')) :
          (pos === 'front' || pos.includes('front')) ? (pTitle.includes('front') || pTitle.includes('headlamp') || pTitle.includes('bumper') || pTitle.includes('lens')) :
          (pos === 'rear' || pos.includes('rear')) ? (pTitle.includes('rear') || pTitle.includes('tail')) : false;

        if (!matchPos && !matchTitlePos) return false;
      }

      // 7. Product Condition
      if (selectedCondition !== 'all') {
        const cond = selectedCondition.toLowerCase();
        const matchCond =
          p.productCondition?.some((pc) => pc.toLowerCase().includes(cond)) ||
          p.condition?.toLowerCase().includes(cond) ||
          (cond.includes('new') && (pTitle.includes('new') || pTitle.includes('2023') || pTitle.includes('2024'))) ||
          (cond.includes('restyle') || cond.includes('lci') ? (pTitle.includes('lci') || pTitle.includes('restyle')) : false) ||
          (cond.includes('complete') && (pTitle.includes('assembly') || pTitle.includes('complete')));
        if (!matchCond) return false;
      }

      // 8. EU / US Specification
      if (selectedSpec !== 'all') {
        const spec = selectedSpec.toLowerCase();
        const matchSpec =
          p.spec?.some((s) => s.toLowerCase().includes(spec)) ||
          (spec.includes('eu') || spec.includes('ece') ? (!pTitle.includes('us dot') && !pTitle.includes('usa')) : false) ||
          (spec.includes('us') || spec.includes('dot') ? (pTitle.includes('us') || pTitle.includes('dot') || pTitle.includes('sae')) : false);
        if (!matchSpec) return false;
      }

      // 9. Bumper Specification
      if (selectedBumperSpecs.length > 0) {
        const matchesAll = selectedBumperSpecs.every((spec) => {
          const s = spec.toLowerCase();
          return (
            p.bumperSpecs?.some((bs: string) => bs.toLowerCase().includes(s)) ||
            (s.includes('m sport') || s.includes('amg') ? (pTitle.includes('m sport') || pTitle.includes('amg') || pTitle.includes('sport')) : false) ||
            (s.includes('pdc') ? (pTitle.includes('pdc') || pTitle.includes('sensor')) : false) ||
            (s.includes('radar') ? (pTitle.includes('radar') || pTitle.includes('acc')) : false) ||
            (s.includes('camera') ? (pTitle.includes('camera')) : false) ||
            (s.includes('washer') ? (pTitle.includes('washer')) : false) ||
            (s.includes('primed') ? (pTitle.includes('primed') || p.finish?.toLowerCase().includes('paint')) : false)
          );
        });
        if (!matchesAll) return false;
      }

      return true;
    });
  }, [
    baseProducts,
    selectedBrand,
    debouncedSearch,
    selectedModelGen,
    selectedModelYear,
    selectedCategory,
    selectedMountingPosition,
    selectedCondition,
    selectedSpec,
    selectedBumperSpecs,
  ]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (activeSort === 'Price: Low to High') {
      list.sort((a, b) => {
        const pA = parseFloat(String(a.price).replace(/[^0-9.]+/g, '')) || 999999;
        const pB = parseFloat(String(b.price).replace(/[^0-9.]+/g, '')) || 999999;
        return pA - pB;
      });
    } else if (activeSort === 'Price: High to Low') {
      list.sort((a, b) => {
        const pA = parseFloat(String(a.price).replace(/[^0-9.]+/g, '')) || 0;
        const pB = parseFloat(String(b.price).replace(/[^0-9.]+/g, '')) || 0;
        return pB - pA;
      });
    } else if (activeSort === 'Name: A to Z') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (activeSort === 'Name: Z to A') {
      list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }
    return list;
  }, [filteredProducts, activeSort]);

  // Pagination (9 items per page)
  const itemsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // GSAP Animations (Header, Sidebar Filters, Product Cards Grid)
  useGSAP(
    () => {
      // 1. Header Animation on mount / brand switch
      const headerEl = mainRef.current?.querySelector('.gsap-products-header');
      if (headerEl) {
        gsap.fromTo(
          headerEl,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }
        );
      }

      // 2. Filter Sidebar Animation on mount
      const filterEl = mainRef.current?.querySelector('.gsap-filter-sidebar');
      if (filterEl) {
        gsap.fromTo(
          filterEl,
          { opacity: 0, x: -25 },
          { opacity: 1, x: 0, duration: 0.65, delay: 0.1, ease: 'power2.out' }
        );
      }
    },
    { scope: mainRef, dependencies: [selectedBrand] }
  );

  useGSAP(
    () => {
      // 3. Product Cards animation when page, filters, or viewMode changes
      const cards = mainRef.current?.querySelectorAll('.gsap-product-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.05,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: mainRef, dependencies: [currentPage, viewMode, paginatedProducts] }
  );

  return (
    <div ref={mainRef} className="w-full bg-[#081516] text-[#F8FAFC] min-h-screen font-sans selection:bg-[#00E5EE] selection:text-[#081516]">
      {/* 1. Header & Title Section matching Figma Frames (Spare parts, BMW parts, Mercedes-Benz parts, Rangerover parts) */}
      <section className="pt-10 sm:pt-14 pb-8 sm:pb-10 border-b border-[#1b2d30]/60">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 gsap-products-header">
          <div className="text-[#00E5EE] font-bold text-[11px] sm:text-xs tracking-[0.2em] uppercase mb-2.5 flex items-center gap-1.5">
            {pageHeadingInfo.breadcrumb.includes('/') ? (
              <>
                <Link href="/products" className="hover:underline">
                  {pageHeadingInfo.breadcrumb.split('/')[0].trim()}
                </Link>
                <span>/</span>
                <span>{pageHeadingInfo.breadcrumb.split('/')[1].trim()}</span>
              </>
            ) : (
              <span>{pageHeadingInfo.breadcrumb}</span>
            )}
          </div>
          <h1 className="text-[44px] sm:text-[44px] lg:text-[44px] font-medium text-white tracking-tight leading-tight mb-3">
            {pageHeadingInfo.title}
          </h1>
          <p className="text-[#9CA2A2] text-[14px] sm:text-[14px] font-regular max-w-3xl leading-relaxed">
            {pageHeadingInfo.subtitle}
          </p>
        </div>
      </section>

      {/* Mobile Filters Toggle Button */}
      <div className="lg:hidden max-w-[1360px] mx-auto px-4 sm:px-6 pt-6">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="w-full bg-[#0d1c1e] border border-[#1b2d30] text-white py-2.5 px-4 rounded-md text-xs font-semibold flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#F3F3F3] font-regular" />
            Filters {selectedBrand !== 'all' && `(${selectedBrand})`}
          </span>
          {mobileFilterOpen ? <X size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* 2. Main Content Grid (Left Sidebar + Right Product Grid) */}
      <section
        ref={productSectionRef}
        className="py-8 sm:py-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================================= */}
          {/* LEFT SIDEBAR: FILTERS */}
          {/* ========================================================================= */}
          <aside
            className={`lg:col-span-3 lg:block ${mobileFilterOpen ? 'block' : 'hidden'
              } space-y-5 gsap-filter-sidebar`}
          >
            {/* Header: Filters + Clear all */}
            <div>
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-[16px] font-regular text-white tracking-wide">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[12px] text-[#33FDFF] hover:text-[#33FDFF] transition-colors cursor-pointer font-bold"
                >
                  Clear all
                </button>
              </div>
              <div className="w-full h-[1px] bg-white mt-1 mb-5" />
            </div>

            {/* Vehicle brand section (Only shown in General Catalogue as per Figma screens) */}
            {selectedBrand === 'all' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[14px] font-medium text-[#F3F3F3] block">
                    Vehicle brand
                  </h4>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'BMW', label: 'BMW' },
                    { id: 'Mercedes-Benz', label: 'MERCEDES-BENZ' },
                    { id: 'Audi', label: 'AUDI' },
                    { id: 'Range Rover', label: 'RANGE ROVER' },
                  ].map((item) => {
                    const isChecked =
                      selectedBrand.toLowerCase().includes(item.id.toLowerCase()) ||
                      (item.id === 'all' && selectedBrand === 'all');
                    return (
                      <label
                        key={item.id}
                        onClick={() => handleBrandSelect(item.id)}
                        className="flex items-center gap-2.5 py-0.5 text-[14px] text-[#9CA2A2] hover:text-white cursor-pointer select-none group"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isChecked
                            ? 'border-[#00E5EE]'
                            : 'border-[#3E5255] group-hover:border-[#00E5EE]'
                            }`}
                        >
                          {isChecked && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5EE]" />
                          )}
                        </span>
                        <span className={isChecked ? 'text-white font-medium' : 'text-slate-300'}>
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 2: Accordion Filters with Interactive Sub-options */}
            <div className={`space-y-0 ${selectedBrand === 'all' ? 'border-t border-[#1b2d30] pt-2 mt-4' : ''}`}>
              {/* Accordion 1: Model and generation */}
              <div className="border-b border-[#162729]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('Model and generation')}
                  className="w-full flex items-center justify-between py-3 cursor-pointer select-none text-left"
                >
                  <span className={`text-[14px] font-medium ${selectedModelGen !== 'all' ? 'text-[#00E5EE]' : 'text-[#F3F3F3]'}`}>
                    Model and generation
                    {selectedModelGen !== 'all' && ' •'}
                  </span>
                  <span className="text-[#9CA2A2] text-[15px] font-light leading-none">
                    {openAccordions['Model and generation'] ? '−' : '+'}
                  </span>
                </button>
                {openAccordions['Model and generation'] && (
                  <div className="pb-3 pl-2 space-y-1.5 text-[11px]">
                    {availableModels.map((opt) => {
                      const isActive = selectedModelGen === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedModelGen(isActive ? 'all' : opt);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${isActive
                            ? 'bg-[#00E5EE]/15 text-[#00E5EE] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <span>{opt}</span>
                          {isActive && <Check size={12} className="text-[#00E5EE]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 2: Model year */}
              <div className="border-b border-[#162729]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('Model year')}
                  className="w-full flex items-center justify-between py-3 cursor-pointer select-none text-left"
                >
                  <span className={`text-[14px] font-medium ${selectedModelYear !== 'all' ? 'text-[#00E5EE]' : 'text-[#F3F3F3]'}`}>
                    Model year
                    {selectedModelYear !== 'all' && ' •'}
                  </span>
                  <span className="text-[#9CA2A2] text-[15px] font-light leading-none">
                    {openAccordions['Model year'] ? '−' : '+'}
                  </span>
                </button>
                {openAccordions['Model year'] && (
                  <div className="pb-3 pl-2 space-y-1.5 text-[11px]">
                    {['2024+', '2021 - 2023', '2018 - 2020', '2015 - 2017', '2010 - 2014'].map((opt) => {
                      const isActive = selectedModelYear === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedModelYear(isActive ? 'all' : opt);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${isActive
                            ? 'bg-[#00E5EE]/15 text-[#00E5EE] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <span>{opt}</span>
                          {isActive && <Check size={12} className="text-[#00E5EE]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 3: Product category */}
              <div className="border-b border-[#162729]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('Product category')}
                  className="w-full flex items-center justify-between py-3 cursor-pointer select-none text-left"
                >
                  <span className={`text-[14px] font-medium ${selectedCategory !== 'all' ? 'text-[#00E5EE]' : 'text-[#F3F3F3]'}`}>
                    Product category
                    {selectedCategory !== 'all' && ' •'}
                  </span>
                  <span className="text-[#9CA2A2] text-[15px] font-light leading-none">
                    {openAccordions['Product category'] ? '−' : '+'}
                  </span>
                </button>
                {openAccordions['Product category'] && (
                  <div className="pb-3 pl-2 space-y-1.5 text-[11px]">
                    {(categories && categories.length > 0 ? categories.map((cat: any) => cat.name || cat.title) : []).map((opt: string) => {
                      const isActive = selectedCategory === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(isActive ? 'all' : opt);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${isActive
                            ? 'bg-[#00E5EE]/15 text-[#00E5EE] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <span>{opt}</span>
                          {isActive && <Check size={12} className="text-[#00E5EE]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 4: Mounting position */}
              <div className="border-b border-[#162729]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('Mounting position')}
                  className="w-full flex items-center justify-between py-3 cursor-pointer select-none text-left"
                >
                  <span className={`text-[14px] font-medium ${selectedMountingPosition !== 'all' ? 'text-[#00E5EE]' : 'text-[#F3F3F3]'}`}>
                    Mounting position
                    {selectedMountingPosition !== 'all' && ' •'}
                  </span>
                  <span className="text-[#9CA2A2] text-[15px] font-light leading-none">
                    {openAccordions['Mounting position'] ? '−' : '+'}
                  </span>
                </button>
                {openAccordions['Mounting position'] && (
                  <div className="pb-3 pl-2 space-y-1.5 text-[11px]">
                    {['Front', 'Rear', 'Left side', 'Right side'].map((opt) => {
                      const isActive = selectedMountingPosition === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedMountingPosition(isActive ? 'all' : opt);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${isActive
                            ? 'bg-[#00E5EE]/15 text-[#00E5EE] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <span>{opt}</span>
                          {isActive && <Check size={12} className="text-[#00E5EE]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 5: Product condition */}
              <div className="border-b border-[#162729]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('Product condition')}
                  className="w-full flex items-center justify-between py-3 cursor-pointer select-none text-left"
                >
                  <span className={`text-[14px] font-medium ${selectedCondition !== 'all' ? 'text-[#00E5EE]' : 'text-[#F3F3F3]'}`}>
                    Product condition
                    {selectedCondition !== 'all' && ' •'}
                  </span>
                  <span className="text-[#9CA2A2] text-[15px] font-light leading-none">
                    {openAccordions['Product condition'] ? '−' : '+'}
                  </span>
                </button>
                {openAccordions['Product condition'] && (
                  <div className="pb-3 pl-2 space-y-1.5 text-[11px]">
                    {['OEM complete piece', 'Restyling', 'New OEM', 'Refurbished'].map((opt) => {
                      const isActive = selectedCondition === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedCondition(isActive ? 'all' : opt);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${isActive
                            ? 'bg-[#00E5EE]/15 text-[#00E5EE] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <span>{opt}</span>
                          {isActive && <Check size={12} className="text-[#00E5EE]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 6: EU / US specification */}
              <div className="border-b border-[#162729]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('EU / US specification')}
                  className="w-full flex items-center justify-between py-3 cursor-pointer select-none text-left"
                >
                  <span className={`text-[14px] font-medium ${selectedSpec !== 'all' ? 'text-[#00E5EE]' : 'text-[#F3F3F3]'}`}>
                    EU / US specification
                    {selectedSpec !== 'all' && ' •'}
                  </span>
                  <span className="text-[#9CA2A2] text-[15px] font-light leading-none">
                    {openAccordions['EU / US specification'] ? '−' : '+'}
                  </span>
                </button>
                {openAccordions['EU / US specification'] && (
                  <div className="pb-3 pl-2 space-y-1.5 text-[11px]">
                    {['EU specification (ECE)', 'US specification (DOT/SAE)'].map((opt) => {
                      const isActive = selectedSpec === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedSpec(isActive ? 'all' : opt);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${isActive
                            ? 'bg-[#00E5EE]/15 text-[#00E5EE] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <span>{opt}</span>
                          {isActive && <Check size={12} className="text-[#00E5EE]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Bumper specification */}
            <div className="border-t border-[#1b2d30] pt-4 mt-4">
              <h4 className="text-[14px] font-medium text-[#F3F3F3] mb-3 block">
                Bumper specification
              </h4>
              <div className="space-y-2">
                {ALL_BUMPER_SPECS.map((spec) => {
                  const isChecked = selectedBumperSpecs.includes(spec);
                  return (
                    <label
                      key={spec}
                      onClick={() => toggleBumperSpec(spec)}
                      className="flex items-center gap-2.5 py-0.5 text-[14px] text-[#9CA2A2] font-regular hover:text-white cursor-pointer select-none group"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center transition-colors shrink-0 ${isChecked
                          ? 'bg-[#00E5EE] border-[#00E5EE] text-[#081516]'
                          : 'border-[#3E5255] bg-[#081516] group-hover:border-[#00E5EE]'
                          }`}
                      >
                        {isChecked && <Check size={10} strokeWidth={3} />}
                      </span>
                      <span className={isChecked ? 'text-white font-medium' : 'text-slate-300'}>
                        {spec}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: TOOLBAR & PRODUCT GRID */}
          {/* ========================================================================= */}
          <main className="lg:col-span-9">
            {/* Top Toolbar matching Figma Frame */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
              {/* Left: Results Count */}
              <div className="shrink-0">
                <span className="text-[16px] font-bold text-white block">
                  {sortedProducts.length} results
                </span>
                <span className="text-[9px] text-[#9CA2A2] mt-0.5 block">
                  Showing all spare parts
                </span>
              </div>

              {/* Center: Search OEM number, VIN, make or model */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDebouncedSearch(searchQuery);
                  setCurrentPage(1);
                }}
                className="relative flex-1 max-w-md w-full"
              >
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setDebouncedSearch(searchQuery);
                      setCurrentPage(1);
                    }
                  }}
                  placeholder="Enter OEM number, VIN, make or model"
                  className="w-full bg-[#0d1c1e] border border-[#1b2d30] rounded-md pl-9 pr-9 py-2 text-[16px] text-[#9CA2A2] placeholder-slate-400 focus:outline-none focus:border-[#00E5EE] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setDebouncedSearch('');
                      setCurrentPage(1);
                    }}
                    title="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-0.5"
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {/* Right: Sort & View Toggle */}
              <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
                {/* Sort Dropdown matching Figma design */}
                <div className="relative inline-flex items-center cursor-pointer group">
                  <div className="flex items-center gap-1.5 text-[15px] select-none pointer-events-none">
                    <span className="text-[#8B939C] font-normal">Sort by:</span>
                    <span className="text-white font-bold">{activeSort}</span>
                    <ChevronDown
                      size={17}
                      className="text-white ml-0.5 stroke-[2.5]"
                    />
                  </div>
                  <select
                    value={activeSort}
                    onChange={(e) => {
                      setActiveSort(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer bg-[#0d1c1e] text-white"
                  >
                    <option value="Relevance" className="bg-[#0b1522] text-white">Relevance</option>
                    <option value="Price: Low to High" className="bg-[#0b1522] text-white">Price: Low to High</option>
                    <option value="Price: High to Low" className="bg-[#0b1522] text-white">Price: High to Low</option>
                    <option value="Name: A to Z" className="bg-[#0b1522] text-white">Name: A to Z</option>
                    <option value="Name: Z to A" className="bg-[#0b1522] text-white">Name: Z to A</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center border border-[#1b2d30] rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid View"
                    title="Grid View"
                    className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${viewMode === 'grid'
                      ? 'bg-white text-[#081516]'
                      : 'bg-[#0d1c1e] text-slate-400 hover:text-white'
                      }`}
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="List View"
                    title="List View"
                    className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${viewMode === 'list'
                      ? 'bg-white text-[#081516]'
                      : 'bg-[#0d1c1e] text-slate-400 hover:text-white'
                      }`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Listing */}
            {paginatedProducts.length === 0 ? (
              <div className="py-20 px-6 text-center bg-[#0d1c1e] rounded-md border border-dashed border-[#1b2d30] flex flex-col items-center justify-center">
                <h4 className="text-base font-bold text-white mb-2">
                  No matching spare parts found
                </h4>
                <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                  We could not find any component matching your current filter criteria. Try resetting your filters or submit a part inquiry.
                </p>
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-5 py-2.5 bg-[#00E5EE] hover:bg-[#00c8d1] text-[#081516] rounded-md text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear all filters
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEnquiry()}
                    className="px-5 py-2.5 bg-[#162729] hover:bg-[#1f373a] text-white border border-[#2A3F42] rounded-md text-xs font-bold transition-all cursor-pointer"
                  >
                    Submit Part Inquiry (RFQ)
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {paginatedProducts.map((prod, idx) => (
                  <div key={prod.id || idx} className="gsap-product-card h-full">
                    <ProductCard
                      prod={prod}
                      idx={idx}
                      onInquire={handleOpenEnquiry}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paginatedProducts.map((prod, idx) => (
                  <div
                    key={prod.id || idx}
                    className="gsap-product-card bg-white rounded-none overflow-hidden flex flex-col sm:flex-row justify-between text-[#111827] shadow-lg border border-white/10 group hover:shadow-2xl transition-all"
                  >
                    {/* Photo with Badge */}
                    <div className="relative w-full sm:w-56 h-48 bg-black shrink-0 overflow-hidden">
                      <Link
                        href={`/products/${prod.id || idx + 1}`}
                        className="block w-full h-full cursor-pointer"
                      >
                        <img
                          src={prod.image || '/products/bumper_assy_row_1.jpeg'}
                          alt={prod.title || 'Product'}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                        <span className="bg-[#11161f]/90 backdrop-blur-md text-[#00E5EE] text-[9px] font-bold px-2 py-0.5 rounded-xs border border-white/10 uppercase tracking-wider">
                          {prod.badge || prod.make}
                        </span>
                      </div>
                    </div>

                    {/* Info Table */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-2">
                          <Link
                            href={`/products/${prod.id || idx + 1}`}
                            className="hover:text-[#00C2CB] transition-colors cursor-pointer"
                          >
                            {prod.title}
                          </Link>
                        </h4>
                        <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 mb-4 max-w-lg">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Version:</span>
                            <span className="font-semibold text-slate-800">{prod.version}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Condition:</span>
                            <span className="font-semibold text-slate-800">{prod.condition}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Price:</span>
                            <span className="font-bold text-slate-900">{prod.price}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenEnquiry(prod)}
                        className="sm:self-start bg-[#00E5EE] hover:bg-[#00c8d1] active:scale-[0.99] text-[#081516] text-xs font-bold py-2.5 px-6 rounded-none text-center transition-all shadow-sm uppercase tracking-wider cursor-pointer"
                      >
                        Inquire about this part
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls matching Figma Frame */}
            <div className="flex items-center justify-center gap-2 mt-12 mb-10 select-none">
              {/* Previous Arrow Button */}
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                title="Previous Page"
                className={`w-11 h-11 border border-[#D9D9D9] bg-white text-[#111214] text-[15px] font-normal flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-slate-100 cursor-pointer'
                }`}
              >
                &larr;
              </button>

              {/* Number Buttons grouped together (max 5 visible at a time) */}
              <div className="inline-flex items-center border border-[#D9D9D9] divide-x divide-[#D9D9D9]">
                {(() => {
                  const maxVisible = 5;
                  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  let end = start + maxVisible - 1;

                  if (end > totalPages) {
                    end = totalPages;
                    start = Math.max(1, end - maxVisible + 1);
                  }

                  const pages = [];
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }

                  return pages.map((num) => {
                    const isActive = num === currentPage;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePageChange(num)}
                        aria-label={`Page ${num}`}
                        className={`w-11 h-11 text-[15px] flex items-center justify-center transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#121619] text-white font-normal'
                            : 'bg-white text-[#111214] font-normal hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  });
                })()}

                {/* Next Arrow Button inside the right cluster */}
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  title="Next Page"
                  className={`w-11 h-11 bg-white text-[#111214] text-[15px] font-normal flex items-center justify-center transition-colors ${
                    currentPage === totalPages
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  &rarr;
                </button>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* Interactive Enquiry Modal / RFQ Popup */}
      <EnquiryPopup
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        initialProductTitle={enquiryProduct?.title || ''}
        initialOem={enquiryProduct?.oemNumber || ''}
        initialCategory={enquiryProduct?.badge || enquiryProduct?.make || 'Spare Parts'}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#081516] flex items-center justify-center text-slate-400">
          Loading Catalogue...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

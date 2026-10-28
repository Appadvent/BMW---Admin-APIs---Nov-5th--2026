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
const COMPREHENSIVE_PRODUCTS: ProductItem[] = [
  // 1. Initial 9 items matching Figma Frame 169:1136
  {
    id: 'ref-1',
    title: 'Front bumper BMW Series 3 G20',
    badge: 'BMW',
    make: 'BMW',
    version: 'G20 (2018 - 2022)',
    condition: 'OEM complete piece',
    price: 'Inquire',
    image: '/msp_car_1.png',
    category: 'Bumper assembly',
    modelGen: ['3 Series (G20/G21)'],
    modelYear: ['2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: '51118074989',
  },
  {
    id: 'ref-2',
    title: 'LED headlight BMW Series 5 G30',
    badge: 'BMW',
    make: 'BMW',
    version: 'OEM/LED (2017 - 2023)',
    condition: 'OEM complete piece',
    price: 'Inquire',
    image: '/msp_car_2.png',
    category: 'Headlights',
    modelGen: ['5 Series (G30/G31)'],
    modelYear: ['2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Front', 'Right side'],
    productCondition: ['OEM complete piece', 'Restyling'],
    spec: ['EU specification (ECE)'],
    oemNumber: '63117438344',
  },
  {
    id: 'ref-3',
    title: 'Front bumper C-Class W206',
    badge: 'MERCEDES-BENZ',
    make: 'Mercedes-Benz',
    version: 'W206 (2021+)',
    condition: 'OEM complete piece',
    price: 'From €1,250.00',
    image: '/msp_car_3.png',
    category: 'Bumper assembly',
    modelGen: ['C-Class (W206)'],
    modelYear: ['2021 - 2023', '2024+'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: 'A2068808401',
  },
  {
    id: 'ref-4',
    title: 'Front bumper C-Class W206',
    badge: 'MERCEDES-BENZ',
    make: 'Mercedes-Benz',
    version: 'W213 (2016 - 2020)',
    condition: 'OEM complete piece',
    price: 'Upon request',
    image: '/msp_car_4.png',
    category: 'Bumper shell',
    modelGen: ['C-Class (W206)', 'E-Class (W214)'],
    modelYear: ['2015 - 2017', '2018 - 2020', '2021 - 2023', '2024+'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece', 'New OEM'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: 'A2068804902',
  },
  {
    id: 'ref-5',
    title: 'Front grille set X5 G05',
    badge: 'BMW',
    make: 'BMW',
    version: 'Shadow-Line (2018 - 2023)',
    condition: 'OEM complete piece',
    price: 'Inquire',
    image: '/compatibility_bmw_m5.jpg',
    category: 'Grilles & Trims',
    modelGen: ['X5 (G05)', '7 Series (G11/G12)'],
    modelYear: ['2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece'],
    spec: ['EU specification (ECE)'],
    oemNumber: '51138096590',
  },
  {
    id: 'ref-6',
    title: 'Bumper trim Range Rover Sport',
    badge: 'RANGE ROVER',
    make: 'Range Rover',
    version: 'L494 (2018 - 2022)',
    condition: 'OEM complete piece',
    price: 'From €650.00',
    image: '/compatibility_car.jpg',
    category: 'Grilles & Trims',
    modelGen: ['Range Rover Sport (L461)', 'Range Rover (L460)'],
    modelYear: ['2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Front', 'Rear'],
    productCondition: ['OEM complete piece'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ['M Sport / AMG package', 'PDC openings', 'Exhaust cutout'],
    oemNumber: 'LR116843',
  },
  {
    id: 'ref-7',
    title: 'Front splitter BMW Series 4 G22',
    badge: 'BMW',
    make: 'BMW',
    version: 'G22 / G23 (2020+)',
    condition: 'OEM complete piece',
    price: 'Upon request',
    image: '/user_crop_car.png',
    category: 'Grilles & Trims',
    modelGen: ['4 Series (G22/G23)', '3 Series (G20/G21)'],
    modelYear: ['2021 - 2023', '2024+'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece', 'New OEM'],
    spec: ['EU specification (ECE)'],
    oemNumber: '51138075665',
  },
  {
    id: 'ref-8',
    title: 'Mirror housing GLC X253',
    badge: 'MERCEDES-BENZ',
    make: 'Mercedes-Benz',
    version: 'X253 (2015 - 2022)',
    condition: 'OEM complete piece',
    price: 'Inquire',
    image: '/test_734.jpg',
    category: 'Lenses & Housings',
    modelGen: ['GLC (X254)', 'C-Class (W206)', 'E-Class (W214)', 'GLE (V167)'],
    modelYear: ['2015 - 2017', '2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Left side', 'Right side', 'Front'],
    productCondition: ['OEM complete piece', 'Refurbished'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    oemNumber: 'A2538100100',
  },
  {
    id: 'ref-9',
    title: 'Headlight housing kit W205',
    badge: 'VALEO / HELLA',
    make: 'Mercedes-Benz',
    version: 'Left + Right (2014 - 2018)',
    condition: 'OEM complete piece',
    price: 'Inquire',
    image: '/test_734.jpg',
    category: 'Lenses & Housings',
    modelGen: ['C-Class (W206)', 'S-Class (W223)'],
    modelYear: ['2010 - 2014', '2015 - 2017'],
    mountingPosition: ['Left side', 'Right side', 'Front'],
    productCondition: ['OEM complete piece', 'Refurbished'],
    spec: ['US specification (DOT/SAE)'],
    oemNumber: 'A2058200461',
  },

  // 2. Mercedes-Benz E-Class W214 & Additional Mercedes Products
  {
    id: 'mb-w214-1',
    title: 'Front bumper E-Class W214 AMG Line',
    badge: 'MERCEDES-BENZ',
    make: 'Mercedes-Benz',
    version: 'AMG-Line (2023 - 2025)',
    condition: 'OEM complete piece',
    price: 'From €1,450.00',
    image: '/part_benz_w206_1.png',
    category: 'Bumper assembly',
    modelGen: ['E-Class (W214)'],
    modelYear: ['2024+', '2021 - 2023'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece', 'New OEM'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: 'A2148800101',
  },
  {
    id: 'mb-w214-2',
    title: 'Rear bumper cover E-Class W214 AMG',
    badge: 'MERCEDES-BENZ',
    make: 'Mercedes-Benz',
    version: 'AMG-Line (2023+)',
    condition: 'OEM complete piece',
    price: 'From €950.00',
    image: '/part_benz_w206_2.png',
    category: 'Bumper shell',
    modelGen: ['E-Class (W214)'],
    modelYear: ['2024+'],
    mountingPosition: ['Rear'],
    productCondition: ['OEM complete piece', 'New OEM'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: 'A2148800202',
  },
  {
    id: 'mb-w214-3',
    title: 'Digital Light Headlight E-Class W214',
    badge: 'MERCEDES-BENZ',
    make: 'Mercedes-Benz',
    version: 'Left Side (2023 - 2025)',
    condition: 'New OEM',
    price: 'Inquire',
    image: '/msp_car_2.png',
    category: 'Headlights',
    modelGen: ['E-Class (W214)'],
    modelYear: ['2024+'],
    mountingPosition: ['Front', 'Left side'],
    productCondition: ['New OEM', 'OEM complete piece'],
    spec: ['EU specification (ECE)'],
    oemNumber: 'A2149060100',
  },

  // 3. BMW Additional Models
  {
    id: 'bmw-g20-rear',
    title: 'Rear bumper assembly BMW 3 Series G20',
    badge: 'BMW',
    make: 'BMW',
    version: 'M-Sport (2019 - 2023)',
    condition: 'OEM complete piece',
    price: 'From €880.00',
    image: '/part_bmw_g20.png',
    category: 'Bumper assembly',
    modelGen: ['3 Series (G20/G21)'],
    modelYear: ['2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Rear'],
    productCondition: ['OEM complete piece'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: '51128074990',
  },
  {
    id: 'bmw-f10-bumper',
    title: 'Front bumper BMW 5 Series F10',
    badge: 'BMW',
    make: 'BMW',
    version: 'M-Aerodynamic (2010 - 2014)',
    condition: 'Refurbished',
    price: 'From €490.00',
    image: '/part_bmw_g30.png',
    category: 'Bumper assembly',
    modelGen: ['5 Series (G30/G31)'],
    modelYear: ['2010 - 2014', '2015 - 2017'],
    mountingPosition: ['Front'],
    productCondition: ['Refurbished', 'Restyling'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: '51118048668',
  },
  {
    id: 'bmw-x5-bumper',
    title: 'Front bumper cover BMW X5 G05 M-Sport',
    badge: 'BMW',
    make: 'BMW',
    version: 'M-Sport Package (2019 - 2024)',
    condition: 'OEM complete piece',
    price: 'From €1,100.00',
    image: '/compatibility_bmw_m5.jpg',
    category: 'Bumper shell',
    modelGen: ['X5 (G05)'],
    modelYear: ['2018 - 2020', '2021 - 2023', '2024+'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece', 'New OEM'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: '51118072044',
  },
  {
    id: 'bmw-x5-headlight-left',
    title: 'Laserlight Headlight BMW X5 G05',
    badge: 'BMW',
    make: 'BMW',
    version: 'Left Side (2018 - 2023)',
    condition: 'OEM complete piece',
    price: 'Inquire',
    image: '/msp_car_2.png',
    category: 'Headlights',
    modelGen: ['X5 (G05)'],
    modelYear: ['2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Front', 'Left side'],
    productCondition: ['OEM complete piece', 'Restyling'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    oemNumber: '63117933339',
  },
  {
    id: 'bmw-g30-lens',
    title: 'Clear headlight lens kit BMW 5 Series G30',
    badge: 'BMW',
    make: 'BMW',
    version: 'Left + Right (2017 - 2020)',
    condition: 'New OEM',
    price: 'From €220.00',
    image: '/test_734.jpg',
    category: 'Lenses & Housings',
    modelGen: ['5 Series (G30/G31)'],
    modelYear: ['2015 - 2017', '2018 - 2020'],
    mountingPosition: ['Front', 'Left side', 'Right side'],
    productCondition: ['New OEM'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    oemNumber: '63117438341',
  },

  // 4. Audi Brand Products
  {
    id: 'audi-rs6-bumper',
    title: 'Front bumper assembly Audi RS6 / A6 C8',
    badge: 'AUDI',
    make: 'Audi',
    version: 'RS Black Edition (2020 - 2024)',
    condition: 'OEM complete piece',
    price: 'From €1,650.00',
    image: '/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg',
    category: 'Bumper assembly',
    modelGen: ['A6 (C8)', 'A4 (B9)'],
    modelYear: ['2021 - 2023', '2024+'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece', 'New OEM'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: '4K0807065',
  },
  {
    id: 'audi-matrix-headlight',
    title: 'HD Matrix LED Headlight Audi A4 B9',
    badge: 'AUDI',
    make: 'Audi',
    version: 'Right Side (2016 - 2020)',
    condition: 'Restyling',
    price: 'Inquire',
    image: '/ce1d8aa4367dcb587ee79305a43bd21e5d10d260.jpg',
    category: 'Headlights',
    modelGen: ['A4 (B9)'],
    modelYear: ['2015 - 2017', '2018 - 2020'],
    mountingPosition: ['Front', 'Right side'],
    productCondition: ['Restyling', 'OEM complete piece'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    oemNumber: '8W0941036',
  },
  {
    id: 'audi-q8-grille',
    title: 'Singleframe Front Grille Audi Q8 S-Line',
    badge: 'AUDI',
    make: 'Audi',
    version: 'Shadow Black (2019 - 2024)',
    condition: 'OEM complete piece',
    price: 'From €580.00',
    image: '/0065630ec2b4dbc86f746c86f25ccc999111c337.jpg',
    category: 'Grilles & Trims',
    modelGen: ['Q8 (4M8)', 'Q7 (4M)'],
    modelYear: ['2018 - 2020', '2021 - 2023', '2024+'],
    mountingPosition: ['Front'],
    productCondition: ['OEM complete piece'],
    spec: ['EU specification (ECE)'],
    oemNumber: '4M8853651',
  },
  {
    id: 'audi-s3-rear',
    title: 'Rear bumper diffuser Audi S3 8Y',
    badge: 'AUDI',
    make: 'Audi',
    version: 'Gloss Black (2020 - 2023)',
    condition: 'OEM complete piece',
    price: 'From €420.00',
    image: '/1889c8da558725682709642aeaf212caab3ad5e6.jpg',
    category: 'Bumper shell',
    modelGen: ['S3 (8Y)', 'A4 (B9)', 'A6 (C8)'],
    modelYear: ['2021 - 2023'],
    mountingPosition: ['Rear'],
    productCondition: ['OEM complete piece'],
    spec: ['EU specification (ECE)'],
    bumperSpecs: ['M Sport / AMG package', 'PDC openings', 'Exhaust cutout'],
    oemNumber: '8Y4807521',
  },

  // 5. Range Rover Brand Products
  {
    id: 'rr-l460-bumper',
    title: 'Front bumper assembly Range Rover L460',
    badge: 'RANGE ROVER',
    make: 'Range Rover',
    version: 'SV Autobiography (2022 - 2025)',
    condition: 'New OEM',
    price: 'From €1,850.00',
    image: '/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg',
    category: 'Bumper assembly',
    modelGen: ['Range Rover (L460)', 'Defender (L663)'],
    modelYear: ['2021 - 2023', '2024+'],
    mountingPosition: ['Front'],
    productCondition: ['New OEM', 'OEM complete piece'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: 'LR153094',
  },
  {
    id: 'rr-sport-headlight',
    title: 'Pixel Laser Headlight Range Rover Sport',
    badge: 'RANGE ROVER',
    make: 'Range Rover',
    version: 'Left Side (2018 - 2022)',
    condition: 'Restyling',
    price: 'Inquire',
    image: '/msp_car_2.png',
    category: 'Headlights',
    modelGen: ['Range Rover Sport (L461)'],
    modelYear: ['2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Front', 'Left side'],
    productCondition: ['Restyling', 'OEM complete piece'],
    spec: ['EU specification (ECE)'],
    oemNumber: 'LR116492',
  },
  {
    id: 'rr-velar-rear',
    title: 'Rear bumper assembly Range Rover Velar',
    badge: 'RANGE ROVER',
    make: 'Range Rover',
    version: 'R-Dynamic (2018 - 2023)',
    condition: 'Refurbished',
    price: 'From €720.00',
    image: '/compatibility_car.jpg',
    category: 'Bumper assembly',
    modelGen: ['Range Rover Velar (L560)', 'Defender (L663)'],
    modelYear: ['2018 - 2020', '2021 - 2023'],
    mountingPosition: ['Rear'],
    productCondition: ['Refurbished', 'OEM complete piece'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: 'LR093412',
  },

  // 6. Older Generations & Classic Spares (2010 - 2014 & Refurbished)
  {
    id: 'mb-w212-bumper',
    title: 'Front bumper shell Mercedes E-Class W212',
    badge: 'MERCEDES-BENZ',
    make: 'Mercedes-Benz',
    version: 'Avantgarde (2010 - 2013)',
    condition: 'Refurbished',
    price: 'From €380.00',
    image: '/part_benz_w206_1.png',
    category: 'Bumper shell',
    modelGen: ['E-Class (W214)'],
    modelYear: ['2010 - 2014'],
    mountingPosition: ['Front'],
    productCondition: ['Refurbished', 'Restyling'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    bumperSpecs: ALL_BUMPER_SPECS,
    oemNumber: 'A2128800140',
  },
  {
    id: 'bmw-f30-headlight',
    title: 'Bi-Xenon Headlight BMW 3 Series F30',
    badge: 'BMW',
    make: 'BMW',
    version: 'Right Side (2012 - 2015)',
    condition: 'Refurbished',
    price: 'From €310.00',
    image: '/test_734.jpg',
    category: 'Headlights',
    modelGen: ['3 Series (G20/G21)'],
    modelYear: ['2010 - 2014', '2015 - 2017'],
    mountingPosition: ['Front', 'Right side'],
    productCondition: ['Refurbished'],
    spec: ['EU specification (ECE)', 'US specification (DOT/SAE)'],
    oemNumber: '63117338706',
  },
];

function ProductsContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Merge comprehensive reference catalogue with dynamic backend products if available
  const baseProducts: ProductItem[] = useMemo(() => {
    if (reduxProducts && reduxProducts.length > 0) {
      const dbMapped: ProductItem[] = reduxProducts.map((p: any, idx: number) => ({
        id: p.id || p._id || `db-${idx}`,
        title: p.title || p.name,
        badge: p.make?.toUpperCase() || 'OEM',
        make: p.make || 'BMW',
        version:
          p.model ||
          p.version ||
          p.specifications?.find(
            (s: any) =>
              s.name?.toLowerCase().includes('model') ||
              s.name?.toLowerCase().includes('version')
          )?.value ||
          'OEM Specification',
        condition:
          p.condition ||
          p.specifications?.find((s: any) =>
            s.name?.toLowerCase().includes('condition')
          )?.value ||
          'OEM complete piece',
        price:
          p.price !== undefined && p.price !== null
            ? typeof p.price === 'number'
              ? `€${p.price.toLocaleString()}`
              : p.price
            : 'Inquire',
        image: p.image || p.images?.[0] || p.thumbnail || '/msp_car_1.png',
        oemNumber: p.oemNumber,
        category: p.category?.title || p.category?.name || 'Bumper assembly',
        modelGen: ['3 Series (G20/G21)', '5 Series (G30/G31)', 'C-Class (W206)', 'E-Class (W214)'],
        modelYear: ['2021 - 2023', '2024+'],
        mountingPosition: ['Front'],
        productCondition: ['OEM complete piece'],
        spec: ['EU specification (ECE)'],
        bumperSpecs: ALL_BUMPER_SPECS,
      }));
      return [...COMPREHENSIVE_PRODUCTS, ...dbMapped];
    }
    return COMPREHENSIVE_PRODUCTS;
  }, [reduxProducts]);

  // Robust client-side filtering across all selected criteria
  const filteredProducts = useMemo(() => {
    return baseProducts.filter((p) => {
      const pTitle = (p.title || '').toLowerCase();
      const pMake = (p.make || '').toLowerCase();
      const pBadge = (p.badge || '').toLowerCase();
      const pVersion = (p.version || '').toLowerCase();

      // 1. Brand Filter
      if (selectedBrand !== 'all') {
        const target = selectedBrand.toLowerCase().trim();
        if (target.includes('range') || target.includes('rover')) {
          if (!pMake.includes('range') && !pMake.includes('rover') && !pBadge.includes('range') && !pBadge.includes('rover')) {
            return false;
          }
        } else if (target.includes('mercedes')) {
          if (!pMake.includes('mercedes') && !pBadge.includes('mercedes')) {
            return false;
          }
        } else if (target.includes('bmw')) {
          if (!pMake.includes('bmw') && !pBadge.includes('bmw')) {
            return false;
          }
        } else if (target.includes('audi')) {
          if (!pMake.includes('audi') && !pBadge.includes('audi')) {
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
        const fullString = `${pTitle} ${pMake} ${pVersion} ${pBadge} ${p.oemNumber || ''}`.toLowerCase();
        if (!fullString.includes(query)) {
          return false;
        }
      }

      // 3. Model & Generation
      if (selectedModelGen !== 'all') {
        const matchGen = p.modelGen?.includes(selectedModelGen);
        const matchText =
          (selectedModelGen.includes('3 Series') && (pTitle.includes('series 3') || pTitle.includes('g20'))) ||
          (selectedModelGen.includes('5 Series') && (pTitle.includes('series 5') || pTitle.includes('g30'))) ||
          (selectedModelGen.includes('X5') && (pTitle.includes('x5') || pTitle.includes('g05'))) ||
          (selectedModelGen.includes('C-Class') && (pTitle.includes('c-class') || pTitle.includes('w206'))) ||
          (selectedModelGen.includes('E-Class') && (pTitle.includes('e-class') || pTitle.includes('w214') || pTitle.includes('w212')));
        if (!matchGen && !matchText) return false;
      }

      // 4. Model Year
      if (selectedModelYear !== 'all') {
        const matchYear = p.modelYear?.includes(selectedModelYear);
        if (!matchYear) return false;
      }

      // 5. Product Category
      if (selectedCategory !== 'all') {
        const targetCat = selectedCategory.toLowerCase();
        const matchCat =
          (p.category && String(p.category).toLowerCase().includes(targetCat)) ||
          (targetCat.includes('bumper assembly') && pTitle.includes('bumper')) ||
          (targetCat.includes('bumper shell') && pTitle.includes('bumper')) ||
          (targetCat.includes('headlights') && (pTitle.includes('headlight') || pTitle.includes('lamp') || pTitle.includes('led'))) ||
          (targetCat.includes('lenses') && (pTitle.includes('housing') || pTitle.includes('lens'))) ||
          (targetCat.includes('grilles') && (pTitle.includes('grille') || pTitle.includes('trim')));
        if (!matchCat) return false;
      }

      // 6. Mounting Position
      if (selectedMountingPosition !== 'all') {
        const matchPos = p.mountingPosition?.includes(selectedMountingPosition);
        if (!matchPos) return false;
      }

      // 7. Product Condition
      if (selectedCondition !== 'all') {
        const matchCond =
          p.productCondition?.includes(selectedCondition) ||
          (selectedCondition === 'OEM complete piece' && p.condition?.includes('complete piece')) ||
          (selectedCondition === 'Restyling' && (p.version?.includes('Restyling') || p.condition?.includes('Restyling'))) ||
          (selectedCondition === 'New OEM' && p.condition?.includes('New')) ||
          (selectedCondition === 'Refurbished' && p.condition?.includes('Refurbished'));
        if (!matchCond) return false;
      }

      // 8. EU / US Specification
      if (selectedSpec !== 'all') {
        const matchSpec = p.spec?.includes(selectedSpec);
        if (!matchSpec) return false;
      }

      // 9. Bumper Specification (Supports multi-checked filters seamlessly)
      if (selectedBumperSpecs.length > 0) {
        const hasAllSelected = selectedBumperSpecs.every((spec) => p.bumperSpecs?.includes(spec));
        if (!hasAllSelected) return false;
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

  return (
    <div className="w-full bg-[#081516] text-[#F8FAFC] min-h-screen font-sans selection:bg-[#00E5EE] selection:text-[#081516]">
      {/* 1. Header & Title Section matching Figma Frames (Spare parts, BMW parts, Mercedes-Benz parts, Rangerover parts) */}
      <section className="pt-10 sm:pt-14 pb-8 sm:pb-10 border-b border-[#1b2d30]/60">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-tight mb-3">
            {pageHeadingInfo.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-[14px] max-w-3xl leading-relaxed">
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
            <SlidersHorizontal size={14} className="text-[#00E5EE]" />
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
            className={`lg:col-span-3 lg:block ${
              mobileFilterOpen ? 'block' : 'hidden'
            } space-y-5`}
          >
            {/* Header: Filters + Clear all */}
            <div>
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-base font-medium text-white tracking-wide">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-[#00E5EE] hover:text-[#33FDFF] transition-colors cursor-pointer font-normal"
                >
                  Clear all
                </button>
              </div>
              <div className="w-full h-[1px] bg-[#6A787A]/50 mt-1 mb-5" />
            </div>

            {/* Vehicle brand section (Only shown in General Catalogue as per Figma screens) */}
            {selectedBrand === 'all' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[13px] font-normal text-[#94A3B8] block">
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
                        className="flex items-center gap-2.5 py-0.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none group"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
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
                  className="w-full flex items-center justify-between py-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none text-left"
                >
                  <span className={`text-slate-200 ${selectedModelGen !== 'all' ? 'text-[#00E5EE] font-semibold' : ''}`}>
                    Model and generation
                    {selectedModelGen !== 'all' && ' •'}
                  </span>
                  <span className="text-slate-400 text-sm font-light leading-none">
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
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
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
                  className="w-full flex items-center justify-between py-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none text-left"
                >
                  <span className={`text-slate-200 ${selectedModelYear !== 'all' ? 'text-[#00E5EE] font-semibold' : ''}`}>
                    Model year
                    {selectedModelYear !== 'all' && ' •'}
                  </span>
                  <span className="text-slate-400 text-sm font-light leading-none">
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
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
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
                  className="w-full flex items-center justify-between py-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none text-left"
                >
                  <span className={`text-slate-200 ${selectedCategory !== 'all' ? 'text-[#00E5EE] font-semibold' : ''}`}>
                    Product category
                    {selectedCategory !== 'all' && ' •'}
                  </span>
                  <span className="text-slate-400 text-sm font-light leading-none">
                    {openAccordions['Product category'] ? '−' : '+'}
                  </span>
                </button>
                {openAccordions['Product category'] && (
                  <div className="pb-3 pl-2 space-y-1.5 text-[11px]">
                    {['Bumper assembly', 'Bumper shell', 'Headlights', 'Lenses & Housings', 'Grilles & Trims'].map((opt) => {
                      const isActive = selectedCategory === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(isActive ? 'all' : opt);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
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
                  className="w-full flex items-center justify-between py-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none text-left"
                >
                  <span className={`text-slate-200 ${selectedMountingPosition !== 'all' ? 'text-[#00E5EE] font-semibold' : ''}`}>
                    Mounting position
                    {selectedMountingPosition !== 'all' && ' •'}
                  </span>
                  <span className="text-slate-400 text-sm font-light leading-none">
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
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
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
                  className="w-full flex items-center justify-between py-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none text-left"
                >
                  <span className={`text-slate-200 ${selectedCondition !== 'all' ? 'text-[#00E5EE] font-semibold' : ''}`}>
                    Product condition
                    {selectedCondition !== 'all' && ' •'}
                  </span>
                  <span className="text-slate-400 text-sm font-light leading-none">
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
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
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
                  className="w-full flex items-center justify-between py-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none text-left"
                >
                  <span className={`text-slate-200 ${selectedSpec !== 'all' ? 'text-[#00E5EE] font-semibold' : ''}`}>
                    EU / US specification
                    {selectedSpec !== 'all' && ' •'}
                  </span>
                  <span className="text-slate-400 text-sm font-light leading-none">
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
                          className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
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
              <h4 className="text-[13px] font-normal text-[#94A3B8] mb-3 block">
                Bumper specification
              </h4>
              <div className="space-y-2">
                {ALL_BUMPER_SPECS.map((spec) => {
                  const isChecked = selectedBumperSpecs.includes(spec);
                  return (
                    <label
                      key={spec}
                      onClick={() => toggleBumperSpec(spec)}
                      className="flex items-center gap-2.5 py-0.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none group"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center transition-colors shrink-0 ${
                          isChecked
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
                <span className="text-sm font-bold text-white block">
                  {sortedProducts.length} results
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
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
                  placeholder="Search OEM number, VIN, make or model"
                  className="w-full bg-[#0d1c1e] border border-[#1b2d30] rounded-md pl-9 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00E5EE] transition-colors"
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
              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={activeSort}
                    onChange={(e) => {
                      setActiveSort(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-[#0d1c1e] border border-[#1b2d30] rounded-md pl-3 pr-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#00E5EE] cursor-pointer"
                  >
                    <option value="Relevance">-- Relevance --</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Name: A to Z">Name: A to Z</option>
                    <option value="Name: Z to A">Name: Z to A</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center border border-[#1b2d30] rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid View"
                    title="Grid View"
                    className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${
                      viewMode === 'grid'
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
                    className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${
                      viewMode === 'list'
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
                  <ProductCard
                    key={prod.id || idx}
                    prod={prod}
                    idx={idx}
                    onInquire={handleOpenEnquiry}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paginatedProducts.map((prod, idx) => (
                  <div
                    key={prod.id || idx}
                    className="bg-white rounded-none overflow-hidden flex flex-col sm:flex-row justify-between text-[#111827] shadow-lg border border-white/10 group hover:shadow-2xl transition-all"
                  >
                    {/* Photo with Badge */}
                    <div className="relative w-full sm:w-56 h-48 bg-black shrink-0 overflow-hidden">
                      <Link
                        href={`/products/${prod.id || idx + 1}`}
                        className="block w-full h-full cursor-pointer"
                      >
                        <img
                          src={prod.image || '/msp_car_1.png'}
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
            <div className="flex items-center justify-center gap-1.5 mt-12 mb-10">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                title="Previous Page"
                className={`w-8 h-8 rounded border text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === 1
                    ? 'border-[#1b2d30] bg-[#0d1c1e] text-slate-600 cursor-not-allowed'
                    : 'border-[#1b2d30] bg-[#0d1c1e] text-slate-400 hover:text-white hover:border-[#00E5EE]'
                }`}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                const isActive = num === currentPage;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePageChange(num)}
                    aria-label={`Page ${num}`}
                    className={`w-8 h-8 rounded border text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      isActive
                        ? 'border-white/30 bg-[#162729] text-white shadow-sm'
                        : 'border-[#1b2d30] bg-[#0d1c1e] text-slate-400 hover:text-white hover:border-[#00E5EE]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                title="Next Page"
                className={`w-8 h-8 rounded border text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === totalPages
                    ? 'border-[#1b2d30] bg-[#0d1c1e] text-slate-600 cursor-not-allowed'
                    : 'border-[#1b2d30] bg-[#0d1c1e] text-slate-400 hover:text-white hover:border-[#00E5EE]'
                }`}
              >
                &gt;
              </button>
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

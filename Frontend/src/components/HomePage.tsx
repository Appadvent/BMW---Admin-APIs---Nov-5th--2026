"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Award,
  Zap,
  LayoutGrid,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  PackageOpen,
  Newspaper,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ProductCard from "./ProductCard";
import CategoryCard from "./CategoryCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedCounter from "./AnimatedCounter";
import AnimatedText from "./AnimatedText";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchCategories } from "../redux/Slice/categorySlice";
import { fetchProducts } from "../redux/Slice/productSlice";
import { fetchAllBlogs } from "../redux/Slice/BlogSlice";
import { fetchActiveBanners } from "../redux/Slice/bannerSlice";
import { sendContact, resetContactState } from "../redux/Slice/contactSlice";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const mainRef = useRef<HTMLDivElement>(null);

  // Selectors
  const { list: categories } = useAppSelector((state) => state.categories);
  const { list: products } = useAppSelector((state) => state.products);
  const { list: blogs } = useAppSelector((state) => state.blogs);
  const { list: bannerList, loading: bannerLoading } = useAppSelector((state) => state.banners);
  const { loading: contactLoading, success: contactSuccess } = useAppSelector(
    (state) => state.contact
  );

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    dispatch(fetchAllBlogs({ page: 1, limit: 10 }));
    dispatch(fetchActiveBanners());
  }, [dispatch]);

  // Slider State
  const [[currentSlide, direction], setSlideState] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  // Video Visibility & Playback control
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Dedicated Hero Banner Visibility Observer & Synchronous Scroll Controller
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // Helper to evaluate if the hero is sufficiently visible in the viewport
    const checkHeroVisibility = () => {
      const rect = heroEl.getBoundingClientRect();
      const heroHeight = rect.height || 600;
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleRatio = visibleHeight / heroHeight;

      // Hero is considered visible if at least 30% of it is within the viewport and rect.bottom > 120
      const isVisible = visibleRatio >= 0.3 && rect.bottom > 120 && rect.top < window.innerHeight - 120;

      setIsHeroInView(isVisible);
      if (!isVisible && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };

    // IntersectionObserver specifically for the Hero section
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.3;
        setIsHeroInView(inView);
        if (!inView && videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1.0] }
    );

    observer.observe(heroEl);

    // Synchronous scroll listener ensures instant pause the moment user scrolls past hero
    const handleScroll = () => {
      checkHeroVisibility();
    };

    // Handle tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      } else {
        checkHeroVisibility();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial check on mount
    checkHeroVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Dynamic Hero Slides mapped strictly from API (No hardcoded fallback array to prevent flash of wrong banner)
  const heroSlides = useMemo(() => {
    if (!bannerList || bannerList.length === 0) {
      return [];
    }
    return bannerList.map((banner: any, idx: number) => {
      const words = (banner.heading || "").split(" ");
      const mid = Math.ceil(words.length / 2);
      const titlePart = words.slice(0, mid).join(" ");
      const highlightPart = words.slice(mid).join(" ");

      return {
        id: banner.id,
        bgMediaType: banner.bgMediaType || "IMAGE",
        bgMedia: banner.bgMedia,
        tag: banner.label || "",
        heading: banner.heading || "",
        title: titlePart || banner.heading,
        highlight: highlightPart || "",
        description: banner.description || "",
        textAlignment: (banner.textAlignment || "LEFT").toLowerCase(),
        primaryBtnText: banner.primaryBtnText || "Explore Our Products",
        primaryBtnLink: banner.primaryBtnLink || "/products",
        secondaryBtnText: banner.secondaryBtnText || "Contact Us",
        secondaryBtnLink: banner.secondaryBtnLink || "#contact",
        sideImage: banner.sideImage || "",
        sideImagePosition: banner.sideImagePosition === "LEFT" ? "left" : "right",
        alt: banner.heading || `Hero Slide ${idx + 1}`,
      };
    });
  }, [bannerList]);

  // Safe Slide index calculation
  const safeSlide = heroSlides.length > 0 ? currentSlide % heroSlides.length : 0;

  // ONLY play video & sound when the current slide is a VIDEO AND the hero banner is in viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video || heroSlides.length === 0) return;

    const currentSlideData = heroSlides[safeSlide];
    const isVideoSlide = currentSlideData?.bgMediaType === "VIDEO";

    if (isVideoSlide && isHeroInView && !document.hidden) {
      video.muted = false;
      video.volume = 1;
      if (video.ended) {
        video.currentTime = 0;
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts unmuted autoplay before user interaction, play muted first
          video.muted = true;
          video.play().catch(() => { });
        });
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
      video.muted = true;
    }
  }, [safeSlide, isHeroInView, heroSlides]);

  // Unmute and ensure audio plays as soon as user interacts anywhere on page (if current slide is video)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (heroSlides.length === 0) return;
      const video = videoRef.current;
      const isVideoSlide = heroSlides[safeSlide]?.bgMediaType === "VIDEO";
      if (video && isVideoSlide && isHeroInView && !document.hidden) {
        video.muted = false;
        video.volume = 1;
        if (video.paused) {
          video.play().catch(() => { });
        }
      }
    };

    window.addEventListener("click", handleUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("scroll", handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };
  }, [safeSlide, isHeroInView, heroSlides]);

  const paginate = (newDirection: number) => {
    if (heroSlides.length <= 1) return;
    setSlideState(([prev]) => {
      const next = (prev + newDirection + heroSlides.length) % heroSlides.length;
      return [next, newDirection];
    });
  };

  // Mobile / Touch Swipe Handling for Banner Slider
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.PointerEvent) => {
    const clientX = "touches" in e ? e.touches[0]?.clientX : (e as React.PointerEvent).clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY : (e as React.PointerEvent).clientY;
    if (clientX === undefined) return;
    touchStartXRef.current = clientX;
    touchStartYRef.current = clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.PointerEvent) => {
    if (touchStartXRef.current === null) return;
    const clientX =
      "changedTouches" in e
        ? e.changedTouches[0]?.clientX
        : (e as React.PointerEvent).clientX;
    const clientY =
      "changedTouches" in e
        ? e.changedTouches[0]?.clientY
        : (e as React.PointerEvent).clientY;

    if (clientX === undefined) return;

    const diffX = touchStartXRef.current - clientX;
    const diffY = (touchStartYRef.current ?? 0) - (clientY ?? 0);

    // Check if horizontal movement is dominant
    const isHorizontal = Math.abs(diffX) > Math.abs(diffY) * 0.75;
    const minSwipeDistance = 30; // 30px threshold

    if (isHorizontal && Math.abs(diffX) >= minSwipeDistance) {
      if (diffX > 0) {
        // Swiped Left -> Next Slide
        paginate(1);
      } else {
        // Swiped Right -> Previous Slide
        paginate(-1);
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Auto-play slider only when hero is active, visible, and has more than 1 slide
  useEffect(() => {
    if (isPaused || !isHeroInView || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, isHeroInView, safeSlide, heroSlides.length]);

  // Contact form state & validation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Inquiry",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        if (value.trim().length > 60) return "Name cannot exceed 60 characters";
        if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) {
          return "Name should only contain alphabets, spaces, and hyphens";
        }
        return "";

      case "email":
        if (!value.trim()) return "Email address is required";
        if (value.length > 100) return "Email cannot exceed 100 characters";
        // Strict RFC standard email regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address (e.g. name@domain.com)";
        }
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const cleanPhone = value.replace(/[\s-+()]/g, "");
        if (cleanPhone.length < 7 || cleanPhone.length > 15) {
          return "Please enter a valid phone number";
        }
        return "";

      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        if (value.length > 1000) return "Message cannot exceed 1000 characters";
        return "";

      default:
        return "";
    }
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/[^0-9]/g, "");
      if (value.length > 10) return;
    } else if (name === "name") {
      if (value.length > 60) return;
    } else if (name === "email") {
      if (value.length > 100) return;
    } else if (name === "message") {
      if (value.length > 1000) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const errors: { [key: string]: string } = {};
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);
    const messageErr = validateField("message", formData.message);

    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (phoneErr) errors.phone = phoneErr;
    if (messageErr) errors.message = messageErr;

    setFormErrors(errors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    });

    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }
    dispatch(sendContact(formData));
  };

  // Auto-reset form after successful submission
  useEffect(() => {
    if (contactSuccess) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "General Inquiry",
        message: "",
      });
      setFormErrors({});
      setTouched({});
      const timer = setTimeout(() => {
        dispatch(resetContactState());
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [contactSuccess, dispatch]);

  // Filter products by Tag for dedicated homepage sections
  const bestsellers = useMemo(() => {
    if (!products || products.length === 0) return [];
    const tagged = products.filter(
      (p: any) => p.tag && p.tag.toLowerCase().replace(/[\s-_]+/g, "") === "bestseller"
    );
    return tagged.length > 0 ? tagged.slice(0, 5) : products.slice(0, 5);
  }, [products]);

  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const tagged = products.filter(
      (p: any) => p.tag && p.tag.toLowerCase().replace(/[\s-_]+/g, "") === "featured"
    );
    return tagged.length > 0 ? tagged.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  const getProductCount = (categoryName: string) => {
    return products?.filter((p: any) => {
      const catName = p.category?.title || p.category?.name || p.category || p.categoryName;
      return catName === categoryName;
    }).length || 0;
  };

  const displayCategories = categories && categories.length > 0 ? categories.slice(0, 4) : [];
  const displayBlogs = blogs && blogs.length > 0 ? blogs.slice(0, 3) : [];

  // =========================================================================
  // GSAP SCROLLTRIGGER ANIMATIONS WITH BIDIRECTIONAL REPLAY
  // =========================================================================
  useGSAP(
    () => {
      // 1. Categories Section Animation
      const catHeader = mainRef.current?.querySelector(".gsap-cat-header");
      const catCards = mainRef.current?.querySelectorAll(".gsap-cat-card");

      if (catHeader && catCards && catCards.length > 0) {
        const catTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#products",
            start: "top 88%",
            once: true,
          },
        });

        catTl
          .fromTo(
            catHeader,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            catCards,
            { opacity: 0, y: 45, scale: 0.96 },
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

      // 2. Bestsellers Section Animation
      const bestHeader = mainRef.current?.querySelector(".gsap-best-header");
      const bestCards = mainRef.current?.querySelectorAll(".gsap-best-card");

      if (bestHeader && bestCards && bestCards.length > 0) {
        const bestTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#bestsellers",
            start: "top 88%",
            once: true,
          },
        });

        bestTl
          .fromTo(
            bestHeader,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            bestCards,
            { opacity: 0, y: 45, scale: 0.96 },
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

      // 3. About Section (Split Horizon Animation)
      const aboutImg = mainRef.current?.querySelector(".gsap-about-img");
      const aboutContent = mainRef.current?.querySelector(".gsap-about-content");
      const aboutFeatures = mainRef.current?.querySelectorAll(".gsap-about-feature");

      if (aboutImg && aboutContent) {
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#about-section",
            start: "top 85%",
            once: true,
          },
        });

        aboutTl
          .fromTo(
            aboutImg,
            { opacity: 0, x: -45, scale: 0.96 },
            { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "power2.out" }
          )
          .fromTo(
            aboutContent,
            { opacity: 0, x: 45 },
            { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
            "-=0.5"
          );
        if (aboutFeatures && aboutFeatures.length > 0) {
          aboutTl.fromTo(
            aboutFeatures,
            { opacity: 0, y: 25, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.35"
          );
        }
      }

      // 4. Featured Products Section
      const featHeader = mainRef.current?.querySelector(".gsap-feat-header");
      const featCards = mainRef.current?.querySelectorAll(".gsap-feat-card");

      if (featHeader && featCards && featCards.length > 0) {
        const featTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#featured",
            start: "top 88%",
            once: true,
          },
        });

        featTl
          .fromTo(
            featHeader,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            featCards,
            { opacity: 0, y: 45, scale: 0.96 },
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

      // 5. Global Presence Section
      const presenceHeader = mainRef.current?.querySelector(".gsap-presence-header");
      const presenceStats = mainRef.current?.querySelectorAll(".gsap-presence-stat");
      const presenceMap = mainRef.current?.querySelector(".gsap-presence-map");

      if (presenceHeader && presenceStats && presenceMap) {
        const presTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#presence",
            start: "top 85%",
            once: true,
          },
        });

        presTl
          .fromTo(
            presenceHeader,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            presenceStats,
            { opacity: 0, y: 35, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.3"
          )
          .fromTo(
            presenceMap,
            { opacity: 0, scale: 0.95, y: 25 },
            { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power2.out" },
            "-=0.2"
          );
      }

      // 6. News & Media Section
      const newsHeader = mainRef.current?.querySelector(".gsap-news-header");
      const newsCards = mainRef.current?.querySelectorAll(".gsap-news-card");

      if (newsHeader && newsCards && newsCards.length > 0) {
        const newsTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#news",
            start: "top 88%",
            once: true,
          },
        });

        newsTl
          .fromTo(
            newsHeader,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(
            newsCards,
            { opacity: 0, y: 45, scale: 0.96 },
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

      // 7. Product Catalogue Banner Section
      const catBannerText = mainRef.current?.querySelector(".gsap-catalogue-text");
      const catBannerImg = mainRef.current?.querySelector(".gsap-catalogue-img");

      if (catBannerText && catBannerImg) {
        const catBannerTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#catalogue",
            start: "top 85%",
            once: true,
          },
        });

        catBannerTl
          .fromTo(
            catBannerText,
            { opacity: 0, x: -40, scale: 0.96 },
            { opacity: 1, x: 0, scale: 1, duration: 0.65, ease: "power2.out" }
          )
          .fromTo(
            catBannerImg,
            { opacity: 0, x: 40, scale: 0.96 },
            { opacity: 1, x: 0, scale: 1, duration: 0.65, ease: "power2.out" },
            "-=0.45"
          );
      }

      // 8. Contact Form Section ("Let's Build Something Better Together")
      const contactInfo = mainRef.current?.querySelector(".gsap-contact-info");
      const contactCard = mainRef.current?.querySelector(".gsap-contact-card");

      if (contactInfo && contactCard) {
        const contactTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#contact",
            start: "top 90%",
            once: true,
          },
        });

        contactTl
          .fromTo(
            contactInfo,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.65, ease: "power2.out" }
          )
          .fromTo(
            contactCard,
            { opacity: 0, x: 40, y: 20, scale: 0.96 },
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.65, ease: "power2.out" },
            "-=0.45"
          );
      }

      ScrollTrigger.refresh();
    },
    { scope: mainRef, dependencies: [categories, products, blogs] }
  );

  return (
    <main ref={mainRef} className="w-full min-h-screen overflow-x-hidden bg-white">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#10151C] text-white overflow-hidden min-h-[580px] sm:min-h-[660px] lg:min-h-[740px] flex items-center justify-center pt-20 sm:pt-24 pb-14 sm:pb-16 select-none touch-pan-y"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {heroSlides.length === 0 ? (
          /* Luxury Dark Shimmer Skeleton while banners are loading (Prevents flash of wrong content) */
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[460px] sm:min-h-[480px] lg:min-h-[520px] flex items-center justify-center animate-pulse">
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-6">
              {/* Badge placeholder */}
              <div className="h-6 w-44 sm:w-56 rounded-full bg-white/10" />
              {/* Title lines placeholder */}
              <div className="h-9 sm:h-12 lg:h-14 w-4/5 max-w-xl rounded-lg bg-white/10" />
              <div className="h-9 sm:h-12 lg:h-14 w-3/5 max-w-md rounded-lg bg-white/10" />
              {/* Description placeholder */}
              <div className="h-4 w-11/12 max-w-lg rounded bg-white/10 mt-2" />
              <div className="h-4 w-full md:w-3/4 max-w-sm rounded bg-white/10" />
              {/* Buttons placeholder */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 sm:pt-6 w-full max-w-xs sm:max-w-none justify-center">
                <div className="h-12 w-full sm:w-44 rounded-md bg-[#C82021]/40" />
                <div className="h-12 w-full sm:w-36 rounded-md bg-white/10" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Slide-specific Background Media & Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {heroSlides.map((slide: any, idx: number) => {
                const isCurrent = safeSlide === idx;
                const isVideo = slide.bgMediaType === "VIDEO";

                return (
                  <div
                    key={slide.id || idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      } ${!isVideo ? "bg-cover bg-center" : ""}`}
                    style={!isVideo ? { backgroundImage: `url(${slide.bgMedia})` } : undefined}
                  >
                    {isVideo ? (
                      <video
                        ref={isCurrent ? videoRef : undefined}
                        src={slide.bgMedia}
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(105deg, rgba(14, 29, 39, 0.93) 7.74%, rgba(14, 29, 39, 0.62) 54.23%, rgba(14, 29, 39, 0) 92.26%)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={() => paginate(-1)}
                  className="hidden sm:flex absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-white/10 hover:bg-[#C82021] hover:text-white hover:border-[#C82021] text-white rounded-full items-center justify-center border border-white/15 backdrop-blur-md transition-all duration-200 active:scale-90 shadow-lg cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                </button>
                <button
                  onClick={() => paginate(1)}
                  className="hidden sm:flex absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-white/10 hover:bg-[#C82021] hover:text-white hover:border-[#C82021] text-white rounded-full items-center justify-center border border-white/15 backdrop-blur-md transition-all duration-200 active:scale-90 shadow-lg cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
                </button>
              </>
            )}

            {/* Main Hero Container */}
            <div
              className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[460px] sm:min-h-[480px] lg:min-h-[520px] flex items-center justify-center touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onPointerDown={handleTouchStart}
              onPointerUp={handleTouchEnd}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={safeSlide}
                  custom={direction}
                  initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="w-full min-h-[460px] sm:min-h-[480px] lg:min-h-0 flex items-center justify-center touch-pan-y"
                >
                  {!heroSlides[safeSlide]?.sideImage ? (
                    /* Full-Width Centered/Aligned Slide Layout (No Side Image) */
                    <div
                      className={`w-full max-w-5xl mx-auto flex flex-col py-2 sm:py-8 lg:py-12 px-2 sm:px-4 ${heroSlides[safeSlide]?.textAlignment === "left"
                        ? "items-start text-left"
                        : heroSlides[safeSlide]?.textAlignment === "right"
                          ? "items-end text-right"
                          : "items-center text-center"
                        }`}
                    >
                      {heroSlides[safeSlide]?.tag && (
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm max-w-full mb-3 sm:mb-5">
                          <Sparkles size={14} className="text-[#C82021] shrink-0" />
                          <span className="text-[10px] tracking-[0.14em] sm:tracking-[0.18em] text-[#C82021] font-bold uppercase truncate">
                            {heroSlides[safeSlide].tag}
                          </span>
                        </div>
                      )}

                      <h1
                        style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
                        className="text-xl md:text-2xl sm:text-4xl xl:text-[62px] font-extrabold leading-tight tracking-tight text-white mb-3 sm:mb-6"
                      >
                        {heroSlides[safeSlide]?.title}{" "}
                        {heroSlides[safeSlide]?.highlight && (
                          <span className="text-[#C82021]">{heroSlides[safeSlide].highlight}</span>
                        )}
                      </h1>

                      {heroSlides[safeSlide]?.description && (
                        <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-6 sm:mb-10">
                          {heroSlides[safeSlide].description}
                        </p>
                      )}

                      <div
                        className={`inline-flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 w-[85%] max-w-[300px] sm:w-auto sm:max-w-none ${heroSlides[safeSlide]?.textAlignment === "left"
                          ? "justify-start"
                          : heroSlides[safeSlide]?.textAlignment === "right"
                            ? "justify-end"
                            : "justify-center"
                          }`}
                      >
                        {heroSlides[safeSlide]?.primaryBtnText && (
                          <Link
                            href={heroSlides[safeSlide].primaryBtnLink || "/products"}
                            className="inline-flex items-center justify-center gap-2 btn-automotive-primary text-white px-7 py-3.5 rounded-md text-[15px] font-semibold hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group cursor-pointer"
                          >
                            <span>{heroSlides[safeSlide].primaryBtnText}</span>
                            <ArrowRight
                              size={18}
                              className="transition-transform group-hover:translate-x-1 shrink-0"
                            />
                          </Link>
                        )}
                        {heroSlides[safeSlide]?.secondaryBtnText && (
                          <a
                            href={heroSlides[safeSlide].secondaryBtnLink || "#contact"}
                            style={{
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontWeight: 700,
                              fontSize: "14px",
                              lineHeight: "21px",
                              letterSpacing: "0.56px",
                              textAlign: "center",
                            }}
                            className="inline-flex items-center justify-center border border-white/25 bg-transparent text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-md hover:bg-white hover:text-[#10151C] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            <span>{heroSlides[safeSlide].secondaryBtnText}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Split Column Layout (With Side Image) */
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 sm:gap-10 lg:gap-12 items-center py-2 sm:py-6 lg:py-0 px-2 sm:px-4 lg:px-0">
                      {/* Left/Content Column */}
                      <div
                        className={`lg:col-span-7 flex flex-col space-y-3 sm:space-y-6 lg:space-y-7 z-20 ${heroSlides[safeSlide]?.sideImagePosition === "left"
                          ? "lg:order-2"
                          : "lg:order-1"
                          } ${heroSlides[safeSlide]?.textAlignment === "center"
                            ? "items-center text-center"
                            : heroSlides[safeSlide]?.textAlignment === "right"
                              ? "items-end text-right"
                              : "items-center sm:items-start text-center sm:text-left"
                          }`}
                      >
                        {heroSlides[safeSlide]?.tag && (
                          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm max-w-full">
                            <Sparkles size={14} className="text-[#C82021] shrink-0" />
                            <span className="text-[10px] tracking-[0.14em] sm:tracking-[0.18em] text-[#C82021] font-bold uppercase truncate">
                              {heroSlides[safeSlide].tag}
                            </span>
                          </div>
                        )}

                        <h1
                          style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
                          className="text-xl md:text-2xl lg:text-[68px] font-extrabold leading-tight lg:leading-[1.12] tracking-tight"
                        >
                          {heroSlides[safeSlide]?.title} <br className="hidden sm:inline" />
                          {heroSlides[safeSlide]?.highlight && (
                            <span className="text-[#C82021]">{heroSlides[safeSlide].highlight}</span>
                          )}
                        </h1>

                        {heroSlides[safeSlide]?.description && (
                          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
                            {heroSlides[safeSlide].description}
                          </p>
                        )}

                        <div
                          className={`inline-flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 pt-1 sm:pt-2 w-[85%] max-w-[300px] sm:w-auto sm:max-w-none ${heroSlides[safeSlide]?.textAlignment === "center"
                            ? "justify-center"
                            : heroSlides[safeSlide]?.textAlignment === "right"
                              ? "justify-end"
                              : "justify-center sm:justify-start"
                            }`}
                        >
                          {heroSlides[safeSlide]?.primaryBtnText && (
                            <Link
                              href={heroSlides[safeSlide].primaryBtnLink || "/products"}
                              className="inline-flex items-center justify-center gap-2 btn-automotive-primary text-white px-7 py-3.5 rounded-md text-[15px] font-semibold hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group cursor-pointer"
                            >
                              <span>{heroSlides[safeSlide].primaryBtnText}</span>
                              <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1 shrink-0"
                              />
                            </Link>
                          )}
                          {heroSlides[safeSlide]?.secondaryBtnText && (
                            <a
                              href={heroSlides[safeSlide].secondaryBtnLink || "#contact"}
                              style={{
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: "14px",
                                lineHeight: "21px",
                                letterSpacing: "0.56px",
                                textAlign: "center",
                              }}
                              className="inline-flex items-center justify-center border border-white/25 bg-transparent text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-md hover:bg-white hover:text-[#10151C] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                            >
                              <span>{heroSlides[safeSlide].secondaryBtnText}</span>
                            </a>
                          )}
                        </div>

                        {/* Hero Stats with Dynamic AnimatedCounter */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 pt-3 sm:pt-6 lg:pt-8 border-t border-white/10 mt-2 sm:mt-6 lg:mt-8 w-full max-w-sm sm:max-w-none">
                          <div>
                            <p className="text-lg font-bold text-[#C82021]">
                              <AnimatedCounter value="800+" duration={1.8} />
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase mt-0.5 sm:mt-1 tracking-wider">
                              OEM Parts in Catalogue
                            </p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-[#C82021]">
                              <AnimatedCounter value="100%" duration={1.8} />
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase mt-0.5 sm:mt-1 tracking-wider">
                              VIN Verification
                            </p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-[#C82021]">
                              <AnimatedCounter value="24h" duration={2.2} />
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase mt-0.5 sm:mt-1 tracking-wider">
                              24h RFQ Response
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Side Image Showcase Visual */}
                      <div
                        className={`hidden sm:flex lg:col-span-5 justify-center mt-4 lg:mt-0 ${heroSlides[safeSlide]?.sideImagePosition === "left"
                          ? "lg:order-1 lg:justify-start"
                          : "lg:order-2 lg:justify-end"
                          }`}
                      >
                        <div className="relative w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[360px] xl:max-w-[420px] aspect-[4/5] rounded-[120px] sm:rounded-[180px] lg:rounded-[220px] p-1.5 sm:p-2 bg-gradient-to-b from-[#C82021]/30 via-white/10 to-transparent border border-white/10 shadow-2xl overflow-hidden group">
                          <div className="w-full h-full rounded-[114px] sm:rounded-[172px] lg:rounded-[212px] overflow-hidden bg-[#151C23] relative">
                            <img
                              src={heroSlides[safeSlide].sideImage}
                              alt={heroSlides[safeSlide].alt}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Pagination Dots */}
            {heroSlides.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-30 bg-black/30 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/10">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideState([idx, idx > safeSlide ? 1 : -1])}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${safeSlide === idx ? "w-7 bg-[#C82021]" : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Sound Toggle (Slide 0) - Disabled */}
      </section>

      {/* ========================================================================= */}
      {/* 2. EXPLORE OUR PRODUCT CATEGORIES */}
      {/* ========================================================================= */}
      <section id="products" className="bg-[#F8F7F4] py-8 md:py-20 sm:py-24 border-b border-gray-200/60 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-cat-header mb-12 text-left">
            <p
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "11px",
                lineHeight: "16.5px",
                letterSpacing: "1.98px",
                color: "#C82021",
              }}
              className="uppercase mb-2"
            >
              PARTS CATALOGUE
            </p>
            <AnimatedText
              text="Genuine OEM Parts Categories"
              variant="typewriter-char"
              as="h2"
              trigger="#products"
              duration={0.45}
              stagger={0.02}
              style={{
                fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                fontWeight: 700,
              }}
              className="text-xl md:text-3xl font-bold text-[#10151C] tracking-tight"
            />
            <AnimatedText
              style={{ fontFamily: "var(--font-inter), 'Manrope', regular" }}
              text="Genuine OEM plastic body panels, bumper assemblies, shells, headlights, and lenses for BMW, Mercedes-Benz, Audi, and Range Rover. Verified by VIN."
              variant="smooth-paragraph"
              as="p"
              trigger="#products"
              duration={0.5}
              stagger={0.015}
              className="text-gray-600 mt-3 max-w-2xl text-base leading-relaxed"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayCategories?.map((cat: any, idx: number) => (
              <CategoryCard
                key={idx}
                cat={cat}
                idx={idx}
                className="gsap-cat-card"
                href={cat?.id ? `/products?categoryId=${cat.id}` : "/products"}
                productCount={getProductCount(cat?.name || cat?.title)}
              />
            ))}
            {(!displayCategories || displayCategories.length === 0) && (
              <div className="col-span-full py-8 md:py-16 px-6 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#C82021]/10 border border-[#C82021]/25 flex items-center justify-center mb-4 text-[#C82021]">
                  <Layers size={26} />
                </div>
                <h3 className="text-lg font-bold text-[#10151C] mb-1.5">No Categories Available</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  Categories are currently being updated. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OUR BESTSELLERS */}
      {/* ========================================================================= */}
      <section id="bestsellers" className="bg-white py-8 md:py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-best-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <p
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  lineHeight: "16.5px",
                  letterSpacing: "1.98px",
                  color: "#C82021",
                }}
                className="uppercase mb-2"
              >
                TOP REQUESTED PARTS
              </p>
              <AnimatedText
                text="Popular OEM Replacement Components"
                variant="typewriter-char"
                as="h2"
                trigger="#bestsellers"
                duration={0.45}
                stagger={0.02}
                style={{
                  fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                  fontWeight: 700,
                }}
                className="text-xl md:text-3xl font-bold text-[#10151C] tracking-tight"
              />
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 btn-automotive-outline px-5 py-2.5 rounded-lg text-xs font-semibold active:scale-95 cursor-pointer"
            >
              <span>View All Parts</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {bestsellers?.map((item: any, idx: number) => (
              <div
                key={item?._id || idx}
                className="gsap-best-card bg-white rounded-[12px] border border-gray-200/80 shadow-[0px_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="w-full h-[165px] overflow-hidden rounded-t-[11px] relative bg-gray-100">
                    {item?.image || item?.images?.[0] || item?.thumbnail ? (
                      <img
                        src={item?.image || item?.images?.[0] || item?.thumbnail}
                        alt={item?.name || item?.title || "Product"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1 bg-gray-100">
                        <Car size={28} className="text-gray-300" />
                        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">OEM Part</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 pb-2">
                    <p
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "10px",
                        lineHeight: "15px",
                        letterSpacing: "1.5px",
                        color: "#C82021",
                      }}
                      className="uppercase mb-1"
                    >
                      {item?.category?.title || item?.category?.name || item?.categoryName || item?.category || "OEM AUTOMOTIVE PART"}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                        fontWeight: 700,
                        fontSize: "15px",
                        lineHeight: "22px",
                        letterSpacing: "0px",
                      }}
                      className="text-[#10151C] mb-3 group-hover:text-[#C82021] transition-colors line-clamp-2"
                    >
                      {item?.title || item?.name || "Product Name"}
                    </h3>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-5 pt-0">
                  <a
                    href="#contact"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "12px",
                      lineHeight: "18px",
                      letterSpacing: "0.48px",
                      color: "#C82021",
                    }}
                    className="inline-flex items-center cursor-pointer hover:underline"
                  >
                    <span>Request Quote</span>
                    <ArrowRight
                      size={14}
                      className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1.5"
                    />
                  </a>
                </div>
              </div>
            ))}
            {(!bestsellers || bestsellers.length === 0) && (
              <div className="col-span-full py-8 md:py-16 px-6 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#C82021]/10 border border-[#C82021]/25 flex items-center justify-center mb-4 text-[#C82021]">
                  <Sparkles size={26} />
                </div>
                <h3 className="text-lg font-bold text-[#10151C] mb-1.5">No Bestsellers Available</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  Our curated bestselling collection is currently updating. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT / FOR THE SPACES YOU CARE ABOUT */}
      {/* ========================================================================= */}
      <section
        id="about-section"
        className="bg-[#373736] text-white py-8 md:py-20 sm:py-24 overflow-hidden relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-10 lg:gap-14 items-start">
            {/* Left Image Showcase */}
            <div className="gsap-about-img lg:col-span-6 rounded-[16px] overflow-hidden relative group shadow-2xl w-full h-[380px] sm:h-[460px] lg:h-full lg:min-h-[520px]">
              <img
                src="/images/automotive/workshop.jpg"
                alt="Automotive OEM Replacement Parts Installation & Fitting"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/automotive/warehouse.jpg";
                }}
              />
            </div>

            {/* Right Feature Highlights */}
            <div className="gsap-about-content lg:col-span-6 flex flex-col justify-between space-y-6 lg:pl-2">
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    lineHeight: "16.5px",
                    letterSpacing: "1.98px",
                    color: "#C82021",
                  }}
                  className="uppercase mb-3"
                >
                  ABOUT OUR OEM CENTRE
                </p>
                <AnimatedText
                  text="Complete OEM Body & Lighting Solutions."
                  variant="typewriter-char"
                  as="h2"
                  trigger="#about-section"
                  duration={0.45}
                  stagger={0.02}
                  style={{
                    fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "36px",
                    lineHeight: "44px",
                    letterSpacing: "-0.02em",
                  }}
                  className="text-white mb-4"
                />
                <AnimatedText
                  text="Specialized distributor of genuine OEM plastic body panels, complete bumper assemblies, shells, headlights, and lenses for BMW, Mercedes-Benz, Audi, and Range Rover."
                  variant="smooth-paragraph"
                  as="p"
                  trigger="#about-section"
                  duration={0.5}
                  stagger={0.012}
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    lineHeight: "22px",
                  }}
                  className="text-gray-400 max-w-xl mb-3"
                />
                <p
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    lineHeight: "22px",
                  }}
                  className="text-gray-400 max-w-xl"
                >
                  Every part in our catalogue features verified OEM numbers and is cross-referenced for fitment using the vehicle's unique 17-digit VIN. We support body shops, dealerships, and individual vehicle owners.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7 pt-2">
                {[
                  {
                    icon: <Award className="text-[#C82021]" size={18} />,
                    title: "OEM Authenticity",
                    desc: "Genuine factory parts meeting manufacturer standards for BMW, Audi, Mercedes-Benz.",
                  },
                  {
                    icon: <Users className="text-[#C82021]" size={18} />,
                    title: "VIN Fitment Check",
                    desc: "Guaranteed 100% factory fitment to the specific vehicle chassis.",
                  },
                  {
                    icon: <Zap className="text-[#C82021]" size={18} />,
                    title: "Rapid Availability",
                    desc: "Extensive inventory of bumpers and lighting ready for immediate dispatch.",
                  },
                  {
                    icon: <CheckCircle className="text-[#C82021]" size={18} />,
                    title: "B2B Workshop Support",
                    desc: "Dedicated RFQ processing and technical advisory for collision centers.",
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="gsap-about-feature bg-transparent">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-3 text-[#C82021]">
                      {feature.icon}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                        fontWeight: 700,
                        fontSize: "15px",
                        lineHeight: "22px",
                      }}
                      className="text-white mb-1 tracking-wide"
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "13px",
                        lineHeight: "20px",
                      }}
                      className="text-gray-400 pr-2"
                    >
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                  className="inline-flex items-center gap-2 btn-automotive-primary text-white px-6 py-2.5 rounded-[8px] active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED PRODUCTS SECTION */}
      {/* ========================================================================= */}
      <section id="featured" className="bg-white py-8 md:py-20 sm:py-24 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-feat-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <p
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  lineHeight: "16.5px",
                  letterSpacing: "1.98px",
                  color: "#C82021",
                }}
                className="uppercase mb-2"
              >
                FEATURED PARTS
              </p>
              <AnimatedText
                text="Featured Body Panels & Lighting"
                variant="typewriter-char"
                as="h2"
                trigger="#featured"
                duration={0.45}
                stagger={0.02}
                style={{
                  fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                  fontWeight: 700,
                }}
                className="text-xl md:text-3xl font-bold text-[#10151C] tracking-tight"
              />
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 btn-automotive-outline px-5 py-2.5 rounded-lg text-xs font-semibold hover:scale-95 cursor-pointer"
            >
              <span>View All Parts</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts?.map((item: any, idx: number) => (
              <ProductCard key={item?._id || idx} prod={item} idx={idx} className="gsap-feat-card" showTag={false} />
            ))}
            {(!featuredProducts || featuredProducts.length === 0) && (
              <div className="col-span-full py-8 md:py-16 px-6 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#C82021]/10 border border-[#C82021]/25 flex items-center justify-center mb-4 text-[#C82021]">
                  <PackageOpen size={26} />
                </div>
                <h3 className="text-lg font-bold text-[#10151C] mb-1.5">No Featured Products Available</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  Featured collections are currently refreshing. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. GLOBAL PRESENCE & DYNAMIC NUMBER COUNTERS */}
      {/* ========================================================================= */}
      <section id="presence" className="bg-[#373736] text-white py-8 md:py-20 sm:py-24 overflow-hidden relative scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-presence-header text-center mb-16">
            <p className="text-[#C82021] font-bold text-xs uppercase tracking-[0.16em] mb-2">
              TRUSTED BY REPAIR CENTERS
            </p>
            <AnimatedText
              text="OEM Parts Distribution Across North America & Europe"
              variant="typewriter-char"
              as="h2"
              trigger="#presence"
              duration={0.45}
              stagger={0.02}
              style={{
                fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                fontWeight: 700,
              }}
              className="text-xl md:text-3xl font-bold tracking-tight text-white block mb-4"
            />
            <AnimatedText
              text="We partner with authorized repair facilities, independent collision shops, and trade specialists requiring uncompromising OEM quality."
              variant="smooth-paragraph"
              as="p"
              trigger="#presence"
              duration={0.5}
              stagger={0.015}
              className="text-gray-400 max-w-5xl mx-auto text-base leading-relaxed block"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 text-center mb-16 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { val: "800+", label: "Parts in Catalogue" },
              { val: "100%", label: "VIN Fitment Rate" },
              { val: "4", label: "Premium Marques" },
              { val: "24h", label: "RFQ Turnaround" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="gsap-presence-stat p-6 transition-colors"
              >
                <p className="text-xl md:text-3xl font-bold text-[#C82021] mb-1.5">
                  <AnimatedCounter value={stat.val} duration={2.0} />
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="gsap-presence-map relative w-full rounded-none sm:rounded-2xl overflow-hidden">
            <img
              src="/Map.png"
              alt="Global Operations Map"
              className="w-full h-[300px] sm:h-auto object-cover opacity-75 hover:opacity-90 transition-opacity duration-300 mx-auto max-w-full scale-100"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LATEST NEWS & MEDIA */}
      {/* ========================================================================= */}
      <section id="news" className="bg-[#F4F3F0] py-8 md:py-20 sm:py-24 border-b border-gray-200/60 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gsap-news-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <p
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  lineHeight: "16.5px",
                  letterSpacing: "1.98px",
                  color: "#C82021",
                }}
                className="uppercase mb-2"
              >
                NEWS &amp; INSIGHTS
              </p>
              <AnimatedText
                text="Latest News & Media"
                variant="typewriter-char"
                as="h2"
                trigger="#news"
                duration={0.45}
                stagger={0.02}
                style={{
                  fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                  fontWeight: 700,
                }}
                className="text-xl md:text-3xl font-bold text-[#10151C] tracking-tight"
              />
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 btn-automotive-outline px-5 py-2.5 rounded-lg text-xs font-semibold active:scale-95 cursor-pointer"
            >
              <span>View All News</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {displayBlogs?.map((news: any, idx: number) => (
              <Link
                key={news?.id || idx}
                href={`/news/${news?.id || ""}`}
                className="gsap-news-card bg-white rounded-[12px] overflow-hidden border border-gray-200/80 shadow-[0px_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between cursor-pointer h-[432px] block"
              >
                <div className="overflow-hidden">
                  <div className="h-[200px] overflow-hidden rounded-t-[11px] bg-gray-100 relative flex items-center justify-center">
                    {news?.image || news?.coverImage ? (
                      <img
                        src={news.image || news.coverImage}
                        alt={news?.title || "News"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Newspaper size={36} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-6 pb-2">
                    <div className="text-[10px] sm:text-[11px] font-bold mb-2.5 text-[#C82021] tracking-[0.16em] uppercase">
                      {news?.publishedDate
                        ? new Date(news.publishedDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                        : news?.createdAt
                          ? new Date(news.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                          : ""}
                    </div>
                    <h3 className="font-bold text-[#10151C] text-base mb-2 line-clamp-2 group-hover:text-[#C82021] transition-colors leading-snug">
                      {news?.title}
                    </h3>
                    {news?.description && (
                      <div
                        className="text-gray-500 text-xs line-clamp-2 mb-2 leading-relaxed [&_p]:inline [&_p]:m-0 [&_span]:inline"
                        dangerouslySetInnerHTML={{
                          __html: news.description,
                        }}
                      />
                    )}
                    {news?.author && (
                      <p className="text-[11px] text-gray-400 font-medium">
                        By <span className="text-gray-600 font-semibold">{news.author}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <div
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "12px",
                      lineHeight: "18px",
                      letterSpacing: "0.48px",
                      color: "#C82021",
                    }}
                    className="inline-flex items-center"
                  >
                    <span>Read More</span>
                    <ArrowRight
                      size={14}
                      className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1.5"
                    />
                  </div>
                </div>
              </Link>
            ))}
            {(!displayBlogs || displayBlogs.length === 0) && (
              <div className="col-span-full py-8 md:py-16 px-6 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#C82021]/10 border border-[#C82021]/25 flex items-center justify-center mb-4 text-[#C82021]">
                  <Newspaper size={26} />
                </div>
                <h3 className="text-lg font-bold text-[#10151C] mb-1.5">No News &amp; Articles Available</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  Latest news and media publications are currently being updated. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PRODUCT CATALOGUE BANNER */}
      {/* ========================================================================= */}
      <section id="catalogue" className="bg-[#373736] py-8 md:py-20 sm:py-24 text-white overflow-hidden relative scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-10 lg:gap-14 items-center">
            <motion.div
              className="gsap-catalogue-text lg:col-span-6 space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: prefersReducedMotion ? 1 : 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              <motion.p
                variants={{
                  hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
                }}
                className="text-[#C82021] font-bold text-xs uppercase tracking-[0.16em]"
              >
                PARTS CATALOGUE
              </motion.p>
              <motion.h2
                variants={{
                  hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
                }}
                className="text-xl md:text-3xl font-bold leading-tight"
              >
                Genuine OEM <br className="hidden sm:block" /> Parts Catalogue.
              </motion.h2>
              <motion.p
                variants={{
                  hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
                }}
                className="text-gray-300 text-base leading-relaxed max-w-xl"
              >
                Browse our complete range of bumper assemblies, shells, headlights, and lenses for BMW, Mercedes-Benz, Audi, and Range Rover with verified OEM part numbers.
              </motion.p>
              <motion.div
                variants={{
                  hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
                }}
              >
                <a
                  href="/products"
                  className="inline-flex items-center gap-2.5 btn-automotive-primary text-white px-7 py-3.5 rounded-md text-sm font-semibold hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <Download size={18} />
                  <span>Browse Online Catalogue</span>
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              className="gsap-catalogue-img lg:col-span-6 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group"
              initial={prefersReducedMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <img
                src="/images/automotive/collection.jpg"
                alt="Automotive OEM Replacement Parts Catalogue Showcase — Bumpers, Headlights, Housings"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/automotive/warehouse.jpg";
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CONTACT / LET'S BUILD SOMETHING BETTER TOGETHER */}
      {/* ========================================================================= */}
      <section id="contact" className="bg-white py-8 md:py-20 sm:py-24 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-12 lg:gap-14 items-center">
            {/* Left Contact Info */}
            <div className="gsap-contact-info lg:col-span-6 space-y-6">
              <p className="text-[#C82021] font-bold text-xs uppercase tracking-[0.16em]">
                REQUEST A QUOTE
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                  fontWeight: 700,
                }}
                className="text-xl md:text-3xl lg:text-[42px] font-bold text-[#10151C] leading-tight"
              >
                Parts Quotation &amp; <br className="hidden sm:block" /> VIN Fitment Check.
              </h2>
              <p className="text-gray-600 text-base leading-relaxed max-w-lg">
                Send your vehicle VIN or required part number (BMW, Mercedes-Benz, Audi, Range Rover). Our technical specialists will verify factory fitment and prepare a quotation free of charge.
              </p>

              <div className="space-y-6 pt-2">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#F8FAFC] border border-gray-100 rounded-lg flex items-center justify-center text-[#C82021] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      Email Support
                    </p>
                    <p className="font-bold text-base text-[#10151C]">support@autoparts-oem.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#F8FAFC] border border-gray-100 rounded-lg flex items-center justify-center text-[#C82021] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      Phone / Hotline
                    </p>
                    <p className="font-bold text-base text-[#10151C]">+1 800 555 0199</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/18005550199"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#298C51] text-white px-6 py-3 rounded-md text-sm font-bold hover:bg-green-700 hover:shadow-green-900/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.005-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                  </svg>
                  <span>Quick WhatsApp Inquiry</span>
                </a>
              </div>
            </div>

            {/* Right Contact Form Card */}
            <div className="gsap-contact-card lg:col-span-6">
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-[16px] p-7 sm:p-9 shadow-sm">
                <h3 className="text-xl font-bold text-[#10151C] mb-2">
                  Request for Quotation (RFQ)
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Submit your inquiry below — our technical team will verify fitment and respond with a formal quotation.
                </p>

                {contactSuccess && (
                  <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center space-x-2.5 text-sm">
                    <CheckCircle size={18} className="shrink-0" />
                    <span>Your request has been submitted successfully! We will contact you shortly.</span>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleContactSubmit} noValidate>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-[#10151C]">
                        Full Name / Company *
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {formData.name.length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      maxLength={60}
                      value={formData.name}
                      onChange={handleContactChange}
                      onBlur={handleBlur}
                      placeholder="e.g. John Smith / Auto Repair LLC"
                      className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-all bg-white ${touched.name && formErrors.name
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#C82021]"
                        }`}
                    />
                    {touched.name && formErrors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-[#10151C]">
                        Email Address *
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {formData.email.length}/100
                      </span>
                    </div>
                    <input
                      type="email"
                      name="email"
                      maxLength={100}
                      value={formData.email}
                      onChange={handleContactChange}
                      onBlur={handleBlur}
                      placeholder="contact@example.com"
                      className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-all bg-white ${touched.email && formErrors.email
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#C82021]"
                        }`}
                    />
                    {touched.email && formErrors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-[#10151C]">
                        Phone Number *
                      </label>
                      <span className="text-[11px] text-gray-400">
                        Digits only
                      </span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={15}
                      value={formData.phone}
                      onChange={handleContactChange}
                      onBlur={handleBlur}
                      placeholder="e.g. +1 555 123 4567"
                      className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-all bg-white ${touched.phone && formErrors.phone
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#C82021]"
                        }`}
                    />
                    {touched.phone && formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10151C] mb-1.5">
                      Part Category / Inquiry Type
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleContactChange}
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#C82021] transition-all bg-white text-gray-700 cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry / Quotation</option>
                      <option value="BMW OEM Bumper Assembly">BMW OEM Bumper Assembly</option>
                      <option value="BMW OEM Bumper Shell">BMW OEM Bumper Shell</option>
                      <option value="Headlight OEM BMW">Headlight OEM BMW</option>
                      <option value="Lens and Housing - BMW / BENZ">Lens and Housing - BMW / BENZ</option>
                      <option value="B2B Workshop Inquiry">B2B Workshop / Fleet Wholesale Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-[#10151C]">
                        Message / VIN or OEM Part Number *
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {formData.message.length}/1000
                      </span>
                    </div>
                    <textarea
                      name="message"
                      maxLength={1000}
                      value={formData.message}
                      onChange={handleContactChange}
                      onBlur={handleBlur}
                      rows={5}
                      placeholder="Provide vehicle make, model, year, VIN or required OEM part number (min. 10 characters)..."
                      className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-all resize-none bg-white ${touched.message && formErrors.message
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#C82021]"
                        }`}
                    />
                    {touched.message && formErrors.message && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{formErrors.message}</span>
                      </p>
                    )}
                  </div>

                  <button
                    disabled={contactLoading}
                    type="submit"
                    className="w-full btn-automotive-primary text-white px-6 py-3 rounded-lg text-sm font-semibold active:scale-95 transition-all duration-200 mt-2 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-900/20"
                  >
                    {contactLoading ? (
                      <span>Submitting inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Part Request (RFQ)</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, User, X, Loader2, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAllBlogs } from "../redux/Slice/BlogSlice";

interface Category {
  id?: number;
  name?: string;
}

interface BlogItem {
  id: number;
  title: string;
  description?: string;
  image?: string | null;
  coverImage?: string | null;
  categoryId?: number;
  category?: Category | string;
  author?: string | null;
  publishedDate?: string | Date | null;
  createdAt?: string | Date | null;
}

const NewsMediaPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list: blogs, loading, loadingMore, hasMore, currentPage } = useAppSelector(
    (state) => state.blogs
  );

  const [selectedArticle, setSelectedArticle] = useState<BlogItem | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial fetch on mount with limit 10
  useEffect(() => {
    dispatch(fetchAllBlogs({ page: 1, limit: 10, append: false }));
  }, [dispatch]);

  // Handle Lazy Loading on scroll
  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      dispatch(fetchAllBlogs({ page: currentPage + 1, limit: 10, append: true }));
    }
  }, [dispatch, loading, loadingMore, hasMore, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "150px" }
    );

    const currentElem = observerTarget.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [handleLoadMore, hasMore, loading, loadingMore]);

  // Use only real data from backend
  const allBlogsList: BlogItem[] = Array.isArray(blogs) ? blogs : [];
  const featuredArticle: BlogItem | null = allBlogsList.length > 0 ? allBlogsList[0] : null;
  const gridArticles: BlogItem[] = allBlogsList.length > 1 ? allBlogsList.slice(1) : [];

  const formatDate = (dateString?: string | Date | null): string => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getCategoryName = (article?: BlogItem | null): string => {
    if (!article) return "NEWS";
    if (article.category && typeof article.category === "object" && article.category.name) {
      return article.category.name;
    }
    if (typeof article.category === "string") {
      return article.category;
    }
    return "NEWS";
  };

  return (
    <div className="w-full bg-white text-gray-900 overflow-x-hidden min-h-screen flex flex-col justify-between">
      <div>
        {/* Hero Banner Section */}
        <section className="relative bg-[#1A232C] pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 overflow-hidden border-b border-[#2D3742] text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/automotive/workshop.jpg"
              alt="Automotive News & Media Banner"
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-[#1A232C]/80"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-[#C82021] font-bold text-[11px] uppercase tracking-[0.2em] mb-3 sm:mb-4">
                NEWS &amp; MEDIA
              </p>
              <h1
                style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
                className="text-xl md:text-3xl sm:text-[52px] md:text-[52px] font-extrabold text-white mb-3 sm:mb-4 tracking-wide leading-tight"
              >
                Latest News &amp; Media
              </h1>
              <p className="text-[#9BA4B5] font-regular text-[16px] md:text-[16px] max-w-[550px] leading-relaxed">
                Company announcements, product launches, industry awards, and press coverage.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <main className="py-8 md:py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-16">
            {/* Initial Loading State */}
            {loading && allBlogsList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 md:py-20">
                <Loader2 size={36} className="animate-spin text-[#C82021] mb-3" />
                <p className="text-sm text-gray-500 font-medium">Loading news articles...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && allBlogsList.length === 0 && (
              <div className="py-8 md:py-20 px-6 text-center bg-[#FAFAF9] rounded-2xl border border-dashed border-[#E5E7E8] flex flex-col items-center justify-center max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#C82021]/10 border border-[#C82021]/25 flex items-center justify-center mb-4 text-[#C82021]">
                  <Newspaper size={26} />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
                  className="text-lg font-bold text-[#172631] mb-1.5"
                >
                  No News &amp; Media Published Yet
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  Publications and announcements are currently being prepared. Please check back shortly.
                </p>
              </div>
            )}

            {/* Top Featured Story Card */}
            {featuredArticle && (
              <Link
                href={`/news/${featuredArticle.id}`}
                className="bg-[#FAFAF9] rounded-2xl border border-[#E5E7E8] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 cursor-pointer group block"
              >
                {/* Image side */}
                <div className="lg:col-span-6 relative h-[280px] sm:h-[340px] lg:h-[400px] overflow-hidden bg-gray-100">
                  {featuredArticle.image || featuredArticle.coverImage ? (
                    <img
                      src={featuredArticle.image || featuredArticle.coverImage || ""}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <Newspaper size={48} />
                    </div>
                  )}
                </div>

                {/* Content side */}
                <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#FAFAF9]">
                  {/* Tag Pill */}
                  <div className="mb-2.5">
                    <span className="inline-block px-3 py-1 rounded-[4px] text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#C82021] bg-[#C82021]/10 border border-[#C82021]/20">
                      {getCategoryName(featuredArticle)}
                    </span>
                  </div>

                  {/* Date placed under tag */}
                  {(featuredArticle.publishedDate || featuredArticle.createdAt) && (
                    <div className="mb-3.5">
                      <span className="text-[#8E979F] text-[12.5px] font-normal">
                        {formatDate(featuredArticle.publishedDate || featuredArticle.createdAt)}
                      </span>
                    </div>
                  )}

                  {/* Heading */}
                  <h2
                    style={{
                      fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                      fontWeight: 800,
                      letterSpacing: "0px",
                      color: "#172631",
                    }}
                    className="text-lg sm:text-2xl lg:text-[28px] leading-snug sm:leading-tight lg:leading-[36.4px] font-extrabold mb-3 sm:mb-4 group-hover:text-[#C82021] transition-colors"
                  >
                    {featuredArticle.title}
                  </h2>

                  {/* Paragraph */}
                  {featuredArticle.description && (
                    <div
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "23.8px",
                        letterSpacing: "0px",
                        color: "#59636B",
                      }}
                      className="mb-6 line-clamp-3 [&_p]:inline [&_p]:m-0"
                      dangerouslySetInnerHTML={{
                        __html: featuredArticle.description || "",
                      }}
                    />
                  )}

                  {/* Action Link */}
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[#172631] group-hover:text-[#C82021] transition-colors">
                      <span>Read Full Story</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* MORE NEWS Section */}
            {gridArticles.length > 0 && (
              <div className="space-y-8">
                <div className="border-b border-[#E5E7E8] pb-4">
                  <p className="text-[#C82021] font-bold tracking-[0.2em] text-xs uppercase">
                    MORE NEWS
                  </p>
                </div>

                {/* Grid with 4 columns matching item gaps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
                  {gridArticles.map((article, idx) => (
                    <Link
                      key={article.id || idx}
                      href={`/news/${article.id}`}
                      style={{
                        borderRadius: "12px",
                        borderWidth: "1px",
                        borderColor: "#E5E7E8",
                        opacity: 1,
                      }}
                      className="w-full bg-white border rounded-[12px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-pointer block h-full"
                    >
                      {/* Top image & content container */}
                      <div className="overflow-hidden flex flex-col">
                        {/* Image matching height 200px */}
                        <div
                          style={{ height: "200px" }}
                          className="w-full overflow-hidden rounded-t-[11px] bg-gray-100 relative shrink-0"
                        >
                          {article.image || article.coverImage ? (
                            <img
                              src={article.image || article.coverImage || ""}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                              <Newspaper size={32} />
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-5 pb-2 flex flex-col">
                          <div className="flex items-center gap-2 mb-2 text-[10.5px] font-bold uppercase tracking-wider text-[#C82021]">
                            <span>{getCategoryName(article)}</span>
                            {(article.publishedDate || article.createdAt) && (
                              <>
                                <span className="text-[#A0A8AE] font-normal">&bull;</span>
                                <span className="text-[#A0A8AE] font-medium normal-case tracking-normal text-[11px]">
                                  {formatDate(article.publishedDate || article.createdAt)}
                                </span>
                              </>
                            )}
                          </div>

                          <h3
                            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
                            className="font-bold text-[#10151C] text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-[#C82021] transition-colors"
                          >
                            {article.title}
                          </h3>

                          {article.description && (
                            <div
                              className="text-[#64748B] text-[12px] leading-[1.6] line-clamp-3 font-normal [&_p]:inline [&_p]:m-0"
                              dangerouslySetInnerHTML={{
                                __html: article.description || "",
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Bottom Link */}
                      <div className="px-5 pb-5 pt-2 mt-auto">
                        <div className="inline-flex items-center text-[12px] font-semibold text-[#10151C] group-hover:text-[#C82021] transition-colors">
                          <span>Read More</span>
                          <ArrowRight
                            size={14}
                            className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Lazy Loading Sentinel / Spinner */}
                <div ref={observerTarget} className="py-8 md:py-8 flex justify-center items-center">
                  {loadingMore && (
                    <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white border border-[#E5E7E8] text-sm text-gray-700 shadow-sm">
                      <Loader2 size={18} className="animate-spin text-[#C82021]" />
                      <span>Loading more news...</span>
                    </div>
                  )}
                  {!loadingMore && hasMore && gridArticles.length >= 6 && (
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-2.5 rounded-lg border border-[#C82021] text-[#C82021] hover:bg-[#C82021] hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Load More News
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewsMediaPage;

"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Newspaper } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchBlogById, fetchAllBlogs } from "../redux/Slice/BlogSlice";

interface NewsDetailPageProps {
  id: string;
}

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
  category?: Category | string | null;
  author?: string | null;
  publishedDate?: string | Date | null;
  createdAt?: string | Date | null;
}

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { currentBlog, detailLoading, list: blogs } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
    // Also fetch recent blogs list for the sidebar
    if (!blogs || blogs.length === 0) {
      dispatch(fetchAllBlogs({ page: 1, limit: 10 }));
    }
  }, [dispatch, id, blogs]);

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

  const getCategoryName = (category?: Category | string | null): string => {
    if (!category) return "NEWS";
    if (typeof category === "object" && category.name) return category.name;
    if (typeof category === "string") return category;
    return "NEWS";
  };

  // Filter other news articles for sidebar
  const otherArticles: BlogItem[] = Array.isArray(blogs)
    ? (blogs as BlogItem[]).filter((item) => String(item.id) !== String(id)).slice(0, 3)
    : [];

  if (detailLoading) {
    return (
      <div className="w-full min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center pt-20">
        <Loader2 size={40} className="animate-spin text-[#00C2CB] mb-3" />
        <p className="text-slate-400 font-medium text-sm">Loading article details...</p>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="w-full min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center px-4 pt-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#161F30] border border-[#26354A] flex items-center justify-center text-slate-500 mb-4">
          <Newspaper size={32} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-md">
          The news article you are looking for might have been moved or removed.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 bg-[#00C2CB] hover:bg-[#00B0B8] text-[#0B0F19] font-bold px-6 py-2.5 rounded-lg text-xs"
        >
          <ArrowLeft size={14} />
          <span>Back to All News</span>
        </Link>
      </div>
    );
  }

  const blog = currentBlog as unknown as BlogItem;

  return (
    <div className="w-full bg-[#0B0F19] text-[#F8FAFC] min-h-screen overflow-x-hidden flex flex-col justify-between">
      <div>
        {/* Banner Section matching the reference screenshot */}
        <section className="relative bg-[#0E1524] pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 overflow-hidden border-b border-[#26354A] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center z-0 scale-105"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.6) 100%), url(${blog.image || "/images/automotive/warehouse.jpg"
                })`,
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Category Pill in Cyan */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-[4px] text-[11px] font-bold tracking-[0.1em] uppercase text-[#00C2CB] bg-[#00C2CB]/10 border border-[#00C2CB]/30">
                  {getCategoryName(blog.category)}
                </span>
              </div>

              {/* Date */}
              {(blog.publishedDate || blog.createdAt) && (
                <p className="text-slate-400 text-xs sm:text-[13px] font-medium mb-3.5">
                  {formatDate(blog.publishedDate || blog.createdAt)}
                </p>
              )}

              {/* Main Headline */}
              <h1
                style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
                className="text-xl md:text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]"
              >
                {blog.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Content Section (2 Columns) */}
        <main className="py-8 md:py-12 sm:py-16 lg:py-20 bg-[#0B0F19]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-10 lg:gap-14 items-start">
              {/* Left Column: Article Body */}
              <div className="lg:col-span-8 space-y-8 bg-[#161F30] border border-[#26354A] rounded-2xl p-6 sm:p-8">
                {/* Article Body in HTML format */}
                <div
                  className="text-slate-300 text-[15px] sm:text-[16px] leading-[1.8] font-normal space-y-4 [&_p]:leading-[1.8] [&_p]:mb-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-2 [&_strong]:font-bold [&_strong]:text-white [&_b]:font-bold [&_b]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#00C2CB] [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:font-bold [&_blockquote]:text-white [&_blockquote]:mb-5"
                  dangerouslySetInnerHTML={{
                    __html: blog?.description || "",
                  }}
                />

                {/* Back to News Navigation */}
                <div className="pt-8 border-t border-[#26354A]">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#00C2CB] hover:text-[#38ef7d] transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to News</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Sidebar Widget */}
              <div className="lg:col-span-4">
                <div className="bg-[#161F30] rounded-2xl border border-[#26354A] p-6 sm:p-7 space-y-6 sticky top-28 shadow-xl">
                  {/* MORE NEWS List */}
                  {otherArticles.length > 0 && (
                    <div>
                      <p className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.16em] mb-4">
                        MORE NEWS
                      </p>
                      <div className="space-y-4">
                        {otherArticles.map((article, idx) => (
                          <div
                            key={article.id || idx}
                            className="border-b border-[#26354A] pb-3.5 last:border-b-0 last:pb-0"
                          >
                            {(article.publishedDate || article.createdAt) && (
                              <p className="text-slate-500 text-[11px] font-medium mb-1">
                                {formatDate(article.publishedDate || article.createdAt)}
                              </p>
                            )}
                            <Link
                              href={`/news/${article.id}`}
                              className="font-bold text-[13.5px] sm:text-[14px] text-white hover:text-[#00C2CB] transition-colors leading-snug line-clamp-2"
                            >
                              {article.title}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ENQUIRE Section */}
                  <div className="border-t border-[#26354A] pt-6">
                    <p className="text-[#00C2CB] font-bold text-[11px] uppercase tracking-[0.16em] mb-3">
                      ENQUIRE
                    </p>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Hello, I would like to enquire about: ${blog.title}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-slate-950 font-bold text-sm py-3 px-4 rounded-lg transition-all duration-200 shadow-sm active:scale-98"
                    >
                      <WhatsAppIcon />
                      <span>WhatsApp Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewsDetailPage;

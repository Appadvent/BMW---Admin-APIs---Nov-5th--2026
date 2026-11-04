"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAllBlogs } from "../redux/Slice/BlogSlice";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function NewsMediaPage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { list: blogs, loading: blogsLoading } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchAllBlogs({ page: 1, limit: 100 }));
  }, [dispatch]);

  const allGuides = useMemo(() => {
    if (!blogs || !Array.isArray(blogs) || blogs.length === 0) {
      return [];
    }

    const fallbackImages = [
      "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
      "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
      "/734295950a53ab641f4c489e327584416018d44d.jpg",
    ];

    return blogs.map((blog: any, idx: number) => {
      const formattedDate = blog.publishedDate
        ? new Date(blog.publishedDate)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, ".")
        : blog.createdAt
        ? new Date(blog.createdAt)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, ".")
        : "14.05.2025";

      const categoryName = blog.category?.name || "KNOWLEDGE BASE";
      const cleanDesc = blog.description
        ? blog.description.replace(/<[^>]*>/g, "").trim()
        : "Learn about the data worth checking before sending a part inquiry.";

      return {
        id: blog.id,
        badge: `${categoryName} • ${formattedDate}`,
        title: blog.title || "Automotive Guide",
        desc: cleanDesc,
        image: blog.image || fallbackImages[idx % fallbackImages.length],
      };
    });
  }, [blogs]);

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return allGuides;
    const q = searchQuery.toLowerCase();
    return allGuides.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
    );
  }, [allGuides, searchQuery]);

  // GSAP animation on cards
  useGSAP(
    () => {
      const cardEls = containerRef.current?.querySelectorAll(".gsap-blog-card");
      if (cardEls && cardEls.length > 0) {
        gsap.fromTo(
          cardEls,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }
    },
    { scope: containerRef, dependencies: [filteredGuides] }
  );

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#070e12] text-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#00E5EE] mb-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="text-[#00E5EE]/60">|</span>
          <span className="text-[#00E5EE]">Blogs</span>
        </div>

        {/* Top Header Row: Title & Search Input */}
        <div className="gsap-blogs-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight">
            All blogs
          </h1>

          {/* Search by blog name box */}
          <div className="relative w-full sm:w-[320px] md:w-[360px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by blog name"
              className="w-full bg-transparent border border-[#23354E] rounded-md pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#00E5EE] transition-colors"
            />
          </div>
        </div>

        {/* Loading skeleton */}
        {blogsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 animate-pulse h-[400px] flex flex-col justify-between"
              >
                <div className="h-[210px] bg-white/10" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-white/10 w-1/3" />
                  <div className="h-6 bg-white/10 w-3/4" />
                  <div className="h-4 bg-white/10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Dynamic Blogs Grid from Backend */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filteredGuides.map((blog) => (
              <div
                key={blog.id}
                className="gsap-blog-card bg-white rounded-none overflow-hidden shadow-lg flex flex-col justify-between group"
              >
                {/* Card Image */}
                <div className="h-[210px] sm:h-[220px] overflow-hidden bg-black relative text-[17px] font-medium">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white text-[#0B0F19]">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#9CA2A2] uppercase tracking-wider block mb-3">
                      {blog.badge}
                    </span>
                    <h3 className="text-[17px] sm:text-lg font-medium text-[#111214] mb-3 leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-[14px] text-[#686B70] leading-relaxed mb-6 line-clamp-3">
                      {blog.desc}
                    </p>
                  </div>

                  {/* Read the article link */}
                  <Link
                    href={"/news/" + blog.id}
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-[#111214] hover:text-[#00c8d1] transition-colors mt-auto"
                  >
                    <span>Read the article</span>
                    <ArrowRight size={13} className="text-slate-900" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Search State */}
        {!blogsLoading && filteredGuides.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

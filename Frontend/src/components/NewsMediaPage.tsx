"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

interface GuideItem {
  id: number;
  badge: string;
  title: string;
  desc: string;
  image: string;
}

export default function NewsMediaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // 9 exact guides matching Figma screenshot: 3 rows of 3 columns each
  const allGuides: GuideItem[] = [
    // Row 1
    {
      id: 1,
      badge: "OEM NUMBERS • 14.05.2025",
      title: "How to find the right OEM number for BMW?",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
    },
    {
      id: 2,
      badge: "COMPATIBILITY • 14.05.2025",
      title: "BMW G20 — compatibility of body parts",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
    },
    {
      id: 3,
      badge: "TECHNICAL GUIDE • 14.05.2025",
      title: "How to check if the bumper supports PDC?",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/734295950a53ab641f4c489e327584416018d44d.jpg",
    },
    // Row 2
    {
      id: 4,
      badge: "COMPATIBILITY • 14.05.2025",
      title: "BMW G20 — compatibility of body parts",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
    },
    {
      id: 5,
      badge: "TECHNICAL GUIDE • 14.05.2025",
      title: "How to check if the bumper supports PDC?",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/734295950a53ab641f4c489e327584416018d44d.jpg",
    },
    {
      id: 6,
      badge: "OEM NUMBERS • 14.05.2025",
      title: "How to find the right OEM number for BMW?",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
    },
    // Row 3
    {
      id: 7,
      badge: "TECHNICAL GUIDE • 14.05.2025",
      title: "How to check if the bumper supports PDC?",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/734295950a53ab641f4c489e327584416018d44d.jpg",
    },
    {
      id: 8,
      badge: "OEM NUMBERS • 14.05.2025",
      title: "How to find the right OEM number for BMW?",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
    },
    {
      id: 9,
      badge: "COMPATIBILITY • 14.05.2025",
      title: "BMW G20 — compatibility of body parts",
      desc: "Learn about the data worth checking before sending a part inquiry.",
      image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
    },
  ];

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return allGuides;
    const q = searchQuery.toLowerCase();
    return allGuides.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
    );
  }, [searchQuery, allGuides]);

  return (
    <div className="w-full min-h-screen bg-[#070e12] text-white">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sm:mb-12">
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

        {/* 3x3 Blogs Grid - EXACT match to HomePage Knowledge Base card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filteredGuides.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-none overflow-hidden shadow-lg flex flex-col justify-between group"
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
                  <h3 className="text-[17px] sm:text-lg font-medium text-[#111214] mb-3 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-[14px] text-[#686B70] leading-relaxed mb-6">
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

        {/* Empty Search State */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No blogs found matching &quot;{searchQuery}&quot;.</p>
          </div>
        )}
      </div>
    </div>
  );
}

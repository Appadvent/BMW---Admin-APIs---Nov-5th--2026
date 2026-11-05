import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navber";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, FileText } from "lucide-react";

interface PolicyPageProps {
  expectedTypes: string[];
  fallbackTitle: string;
  defaultDescription: string;
}

export default function PolicyPageView({
  expectedTypes,
  fallbackTitle,
  defaultDescription,
}: PolicyPageProps) {
  const [pageData, setPageData] = useState<{
    title: string;
    content: string;
    updatedAt?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiBase}/api/page/get-pages`);
        const json = await res.json();
        const pagesList = json?.data?.pages || json?.data || [];

        if (Array.isArray(pagesList)) {
          // Find matching page by type
          const found = pagesList.find((p: any) =>
            expectedTypes.some(
              (t) => p.type?.toLowerCase() === t.toLowerCase()
            )
          );
          if (found) {
            setPageData(found);
          }
        }
      } catch (err) {
        console.error("Failed to load policy page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [expectedTypes]);

  const displayTitle = pageData?.title || fallbackTitle;
  const displayContent = pageData?.content || "";
  const lastUpdated = pageData?.updatedAt
    ? new Date(pageData.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "November 2025";

  return (
    <div className="min-h-screen bg-[#081516] text-[#E5E7EB] flex flex-col font-sans selection:bg-[#00C2CB] selection:text-black">

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#77797C] hover:text-[#00C2CB] transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Title Section */}
        <div className="mb-10 pb-8 border-b border-[#1E293B]">
          <div className="flex items-center gap-2 text-[#00C2CB] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck size={16} />
            <span>Official Policy & Legal Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            {displayTitle}
          </h1>
          <div className="flex items-center gap-4 text-xs text-[#77797C] mt-4">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#00C2CB]" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <span>•</span>
            <span>Motorium Automotive</span>
          </div>
        </div>

        {/* Policy Content Body */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#00C2CB] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#77797C]">Loading policy content...</p>
          </div>
        ) : displayContent ? (
          <div
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-[#94A3B8] prose-p:leading-relaxed prose-a:text-[#00C2CB] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-[#94A3B8] space-y-4 text-[15px] sm:text-[16px] leading-7"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        ) : (
          <div className="rounded-2xl bg-[#0D2224] border border-[#1A383B] p-8 md:p-12 text-center space-y-4">
            <FileText size={48} className="mx-auto text-[#00C2CB] opacity-60" />
            <h2 className="text-xl font-bold text-white">{displayTitle}</h2>
            <p className="text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
              {defaultDescription}
            </p>
          </div>
        )}
      </main>

    </div>
  );
}

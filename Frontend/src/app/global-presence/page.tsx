"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import Head from 'next/head';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedCounter from '../../components/AnimatedCounter';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GlobalPresence() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Stats Section
      const stats = containerRef.current?.querySelectorAll(".gsap-stat-item");
      if (stats && stats.length > 0) {
        const statsTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#stats-section",
            start: "top 85%",
            once: true,
          },
        });
        statsTl.fromTo(
          stats,
          { opacity: 0, y: 35, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      }

      // 2. Map Section
      const mapSection = containerRef.current?.querySelector("#map-section");
      if (mapSection) {
        const mapHeader = mapSection.querySelector(".gsap-header");
        const mapContent = mapSection.querySelector(".gsap-presence-map");

        const mapTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#map-section",
            start: "top 85%",
            once: true,
          },
        });
        if (mapHeader) {
          mapTl.fromTo(mapHeader, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
        }
        if (mapContent) {
          mapTl.fromTo(mapContent, { opacity: 0, scale: 0.95, y: 25 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3");
        }
      }

      // 3. Offices Section
      const officesSection = containerRef.current?.querySelector("#offices-section");
      if (officesSection) {
        const officesHeader = officesSection.querySelector(".gsap-header");
        const officeCards = officesSection.querySelectorAll(".gsap-office-card");

        const officesTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#offices-section",
            start: "top 85%",
            once: true,
          },
        });
        if (officesHeader) {
          officesTl.fromTo(officesHeader, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
        }
        if (officeCards && officeCards.length > 0) {
          officesTl.fromTo(officeCards, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.3");
        }
      }

      // 4. Partner Section
      const partnerSection = containerRef.current?.querySelector("#partner-section");
      if (partnerSection) {
        const partnerHeader = partnerSection.querySelector(".gsap-header");
        const partnerContent = partnerSection.querySelector(".gsap-partner-content");

        const partnerTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#partner-section",
            start: "top 85%",
            once: true,
          },
        });
        if (partnerHeader) {
          partnerTl.fromTo(partnerHeader, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
        }
        if (partnerContent) {
          partnerTl.fromTo(partnerContent, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3");
        }
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  const offices = [
    {
      region: "South Asia",
      city: "Mumbai",
      country: "India",
      address: "14th Floor, Bandra Kurla Complex, Mumbai 400 051",
      email: "india@autoparts-oem.com",
      phone: "+91 22 4000 0000",
      phoneLink: "+912240000000"
    },
    {
      region: "Middle East",
      city: "Dubai",
      country: "UAE",
      address: "Office 702, Business Bay Tower, Dubai",
      email: "uae@autoparts-oem.com",
      phone: "+971 4 000 0000",
      phoneLink: "+97140000000"
    },
    {
      region: "Southeast Asia",
      city: "Singapore",
      country: "Singapore",
      address: "18 Robinson Road, #08-01, Singapore 048547",
      email: "sg@autoparts-oem.com",
      phone: "+65 6000 0000",
      phoneLink: "+6560000000"
    },
    {
      region: "Europe",
      city: "Frankfurt",
      country: "Germany",
      address: "Mainzer Landstraße 46, 60325 Frankfurt",
      email: "eu@autoparts-oem.com",
      phone: "+49 69 0000 0000",
      phoneLink: "+496900000000"
    }
  ];

  return (
    <div ref={containerRef} className="w-full bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-[#0E1524] text-white pt-40 pb-20 flex flex-col justify-center overflow-hidden border-b border-[#26354A]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/automotive/warehouse.jpg"
            alt="Automotive OEM Logistics and Distribution"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E1524]/40 to-[#0B0F19]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-xs font-semibold mb-4 tracking-wider uppercase">
            Global Presence
          </div>
          <h1 className="gsap-header text-3xl sm:text-4xl md:text-[52px] font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight text-white">
            Our Global Distribution Footprint
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
            Trusted by body shops, collision repair specialists, and fleet distributors across 25+ countries spanning North America, Europe, and Asia-Pacific.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="w-full bg-[#161F30] text-white py-8 md:py-10 border-b border-[#26354A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#26354A] text-center">
          <div className="gsap-stat-item pt-6 md:pt-0">
            <h3 className="text-3xl md:text-4xl font-bold text-[#00C2CB] mb-2">
              <AnimatedCounter value="25+" duration={2.0} />
            </h3>
            <p className="text-xs text-slate-400 tracking-wide uppercase">Countries Served</p>
          </div>
          <div className="gsap-stat-item pt-6 md:pt-0">
            <h3 className="text-3xl md:text-4xl font-bold text-[#00C2CB] mb-2">
              <AnimatedCounter value="500+" duration={2.0} />
            </h3>
            <p className="text-xs text-slate-400 tracking-wide uppercase">Business Partners</p>
          </div>
          <div className="gsap-stat-item pt-6 md:pt-0">
            <h3 className="text-3xl md:text-4xl font-bold text-[#00C2CB] mb-2">
              <AnimatedCounter value="10,000+" duration={2.0} />
            </h3>
            <p className="text-xs text-slate-400 tracking-wide uppercase">OEM Parts Supplied</p>
          </div>
          <div className="gsap-stat-item pt-6 md:pt-0">
            <h3 className="text-3xl md:text-4xl font-bold text-[#00C2CB] mb-2">
              <AnimatedCounter value="30+" duration={2.0} />
            </h3>
            <p className="text-xs text-slate-400 tracking-wide uppercase">Years of Expertise</p>
          </div>
        </div>
      </section>

      {/* Distribution Network Section */}
      <section id="map-section" className="w-full bg-[#0B0F19] text-white py-12 md:py-20 border-b border-[#26354A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-xs font-semibold mb-4 tracking-wider uppercase">
            Distribution Network
          </div>
          <h2 className="gsap-header text-2xl sm:text-3xl md:text-[40px] font-extrabold mb-3 sm:mb-4 leading-tight text-white">
            Where We Operate
          </h2>
          <p className="text-slate-400 text-[15px] max-w-xl mx-auto mb-12">
            Active distribution and partner networks supplying genuine body parts and headlights.
          </p>

          <div className="gsap-presence-map relative w-full rounded-2xl overflow-hidden bg-[#161F30] border border-[#26354A] p-4">
            <img
              src="/Map.png"
              alt="Global Operations Map"
              className="w-full h-[300px] sm:h-auto object-cover opacity-85 hover:opacity-100 transition-opacity duration-300 mx-auto max-w-full"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section id="offices-section" className="w-full bg-[#0B0F19] text-[#F8FAFC] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-xs font-semibold mb-3 tracking-wider uppercase">
              Offices
            </div>
            <h2 className="gsap-header text-2xl sm:text-3xl md:text-[38px] font-extrabold text-white leading-tight">
              Regional Operations &amp; Hubs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {offices.map((office, index) => (
              <div key={index} className="gsap-office-card bg-[#161F30] rounded-xl p-6 sm:p-8 hover:border-[#00C2CB]/50 transition-all duration-300 border border-[#26354A]">
                <div className="w-6 h-0.5 bg-[#00C2CB] rounded-full mb-4"></div>
                <p className="text-[10px] font-bold text-[#00C2CB] tracking-[0.1em] mb-1 uppercase">
                  {office.region}
                </p>
                <h3 className="text-[20px] font-extrabold text-white">{office.city}</h3>
                <p className="text-[13px] text-slate-400 font-semibold mb-6">{office.country}</p>

                <p className="text-[13px] text-slate-300 font-regular mb-8 h-12 leading-relaxed">
                  {office.address}
                </p>

                <div className="flex flex-col gap-3">
                  <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-[12px] text-slate-300 font-medium hover:text-[#00C2CB] transition-colors">
                    <Mail size={14} className="text-[#00C2CB]" />
                    {office.email}
                  </a>
                  <a href={`tel:${office.phoneLink}`} className="flex items-center gap-2 text-[12px] text-slate-300 font-medium hover:text-[#00C2CB] transition-colors">
                    <Phone size={14} className="text-[#00C2CB]" />
                    {office.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner With Us Section */}
      <section id="partner-section" className="w-full bg-[#0E1524] border-t border-[#26354A] text-center py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="gsap-partner-content max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-xs font-semibold mb-4 tracking-wider uppercase">
            Partner With Us
          </div>
          <h2 className="gsap-header text-2xl sm:text-3xl md:text-[36px] font-extrabold text-white mb-4 leading-tight">
            Expand Into New Markets
          </h2>
          <p className="text-slate-300 text-sm md:text-[15px] font-normal mb-8 max-w-xl leading-relaxed">
            Interested in distributing our OEM replacement parts in your region? We are actively seeking new channel partners across all automotive markets.
          </p>
          <a
            href="/contact-us"
            className="bg-[#00C2CB] hover:bg-[#00B0B8] text-[#0B0F19] font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 text-sm shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            <span>Become a Channel Partner</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

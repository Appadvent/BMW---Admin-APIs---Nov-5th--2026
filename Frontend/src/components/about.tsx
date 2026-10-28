"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Award, ShieldCheck, Sparkles, PhoneCall, Quote, CheckCircle, Wrench, Truck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedCounter from "./AnimatedCounter";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTestimonials } from "../redux/Slice/testimonialSlice";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { list: testimonials, loading: testimonialsLoading } = useAppSelector(
    (state) => state.testimonials
  );

  useEffect(() => {
    dispatch(fetchTestimonials({ limit: 50 }));
  }, [dispatch]);

  useGSAP(
    () => {
      // 1. Quality Features Scroll Animation
      const featureRows = containerRef.current?.querySelectorAll(".gsap-feature-row");
      featureRows?.forEach((row) => {
        const img = row.querySelector(".gsap-feature-img");
        const text = row.querySelector(".gsap-feature-text");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            once: true,
          },
        });

        if (img && text) {
          tl.fromTo(
            img,
            { opacity: 0, scale: 0.96, y: 25 },
            { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "power2.out" }
          ).fromTo(
            text,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
            "-=0.45"
          );
        }
      });

      // 2. Craft Section Heritage Animation
      const craftLeft = containerRef.current?.querySelector(".gsap-craft-left");
      const craftRight = containerRef.current?.querySelector(".gsap-craft-right");
      if (craftLeft && craftRight) {
        const craftTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#craft-section",
            start: "top 85%",
            once: true,
          },
        });

        craftTl
          .fromTo(
            craftLeft,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
          )
          .fromTo(
            craftRight,
            { opacity: 0, x: 40, scale: 0.96 },
            { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
            "-=0.45"
          );
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full bg-[#0B0F19] text-[#F8FAFC] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[380px] sm:min-h-[460px] flex items-center bg-[#0E1524] border-b border-[#26354A]/60 overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/images/automotive/warehouse.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/90 to-transparent z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-xs font-semibold mb-4 tracking-wider uppercase">
              ABOUT OUR OEM PARTS DISTRIBUTION
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold mb-4 sm:mb-5 tracking-tight leading-tight text-white">
              Genuine OEM Body Panels &amp; Lighting Solutions
            </h1>
            <p className="text-slate-300 text-sm sm:text-base md:text-[16px] leading-relaxed">
              We are a dedicated distributor of genuine OEM plastic body panels, bumper assemblies, shells, and headlights for BMW, Mercedes-Benz, Audi, and Range Rover.
            </p>
          </div>
        </div>
      </section>

      {/* Uncompromising Quality Section */}
      <section className="py-12 md:py-24 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 md:space-y-36">
            {/* Feature 1 - Our Mission */}
            <div className="gsap-feature-row grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-24 items-center">
              <div className="gsap-feature-img rounded-2xl overflow-hidden shadow-xl bg-[#161F30] w-full max-w-[558px] h-[280px] md:h-[400px] mx-auto md:mx-0 relative group border border-[#26354A]">
                <img
                  src="/images/automotive/workshop.jpg"
                  alt="OEM bumper assemblies and body panels installation"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/uploads/products/bumper_assy_row_1.png";
                  }}
                />
              </div>
              <div className="gsap-feature-text space-y-5">
                <span className="text-xs font-bold text-[#00C2CB] tracking-wider uppercase">Mission &amp; Precision</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Guaranteed 100% VIN Compatibility
                </h2>
                <p className="text-slate-300 leading-relaxed text-[15px]">
                  Modern premium vehicles (BMW, Mercedes-Benz, Audi) demand precision-engineered replacement parts. Differences across production years, aero packages (M-Sport, AMG Line, S-Line), and driver-assistance sensors prevent generic fitment.
                </p>
                <p className="text-slate-400 leading-relaxed text-[15px]">
                  That is why every quotation is verified against factory manufacturer catalogs using your vehicle's unique 17-digit VIN.
                </p>
              </div>
            </div>

            {/* Feature 2 - Quality & Condition */}
            <div className="gsap-feature-row grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-24 items-center">
              <div className="order-1 md:order-2 gsap-feature-img rounded-2xl overflow-hidden shadow-xl bg-[#161F30] w-full max-w-[558px] h-[280px] md:h-[400px] mx-auto md:ml-auto relative group border border-[#26354A]">
                <img
                  src="/uploads/products/headlight_bmw_row_2.png"
                  alt="OEM Headlights BMW Adaptive LED"
                  className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/uploads/products/headlight_bmw_row_10.png";
                  }}
                />
              </div>
              <div className="order-2 md:order-1 gsap-feature-text space-y-5">
                <span className="text-xs font-bold text-[#00C2CB] tracking-wider uppercase">Quality Control</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Original Thermoplastics &amp; Verified Mounting Tabs
                </h2>
                <p className="text-slate-300 leading-relaxed text-[15px]">
                  Every bumper, shell, headlight, and lens in our catalogue undergoes thorough inspection for structural geometry, intact mounting tabs, undamaged bracket points, and authentic factory markings.
                </p>
                <p className="text-slate-400 leading-relaxed text-[15px]">
                  This gives collision centers and repair specialists complete assurance of straightforward installation without costly modifications.
                </p>
              </div>
            </div>

            {/* Feature 3 - Workshop Support */}
            <div className="gsap-feature-row grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-24 items-center">
              <div className="gsap-feature-img rounded-2xl overflow-hidden shadow-xl bg-[#161F30] w-full max-w-[558px] h-[280px] md:h-[400px] mx-auto md:mx-0 relative group border border-[#26354A]">
                <img
                  src="/images/automotive/collection.jpg"
                  alt="Repair workshop support and genuine OEM body parts"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/uploads/products/bumper_shell_row_1.png";
                  }}
                />
              </div>
              <div className="gsap-feature-text space-y-5">
                <span className="text-xs font-bold text-[#00C2CB] tracking-wider uppercase">Dedicated B2B Support</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Built for Body Shops, Dealerships &amp; Repair Centers
                </h2>
                <p className="text-slate-300 leading-relaxed text-[15px]">
                  We support collision repair facilities with comprehensive Request for Quotation (RFQ) processing. We provide high-resolution photos of specific parts, condition reports, and availability within 24 hours.
                </p>
                <p className="text-slate-400 leading-relaxed text-[15px]">
                  Our specialized logistics ensure oversized automotive parts are carefully packed and delivered securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craft Section with Animated Counters */}
      <section id="craft-section" className="bg-[#0E1524] text-white py-16 md:py-24 border-y border-[#26354A]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="gsap-craft-left lg:col-span-6 space-y-6">
              <span className="text-[#00C2CB] font-bold tracking-[0.16em] text-xs uppercase">
                WHY CHOOSE US
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
                Specialized in Premium Automotive Marques
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Rather than offering millions of generic aftermarket items, we focus strictly on our core expertise: genuine OEM bumper assemblies, shells, headlights, and lenses for BMW, Mercedes-Benz, Audi, and Range Rover.
              </p>
              <p className="text-slate-200 font-semibold italic text-sm sm:text-base border-l-2 border-[#00C2CB] pl-3">
                &ldquo;Genuine OEM parts guarantee vehicle safety, factory shut lines, and authentic showroom appearance.&rdquo;
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8 max-w-lg">
                {[
                  { val: "800+", label: "Catalogue Parts" },
                  { val: "100%", label: "VIN Verification" },
                  { val: "4", label: "Premium Marques" },
                  { val: "24h", label: "Quote Turnaround" },
                ].map((stat, idx) => (
                  <div key={idx} className="gsap-presence-stat p-3 rounded-lg bg-[#161F30] border border-[#26354A]">
                    <p className="text-2xl md:text-3xl font-bold text-[#00C2CB] mb-1">
                      <AnimatedCounter value={stat.val} duration={2.0} />
                    </p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="gsap-craft-right lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#26354A] h-[320px] md:h-[420px]">
                <img
                  src="/images/automotive/warehouse.jpg"
                  alt="OEM Bumpers and body panels in automotive warehouse"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/uploads/products/bumper_assy_row_1.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="values-section" className="py-12 md:py-24 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#00C2CB] font-bold tracking-[0.16em] text-xs uppercase mb-2 block">
              QUALITY STANDARDS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              Our Operational Standards
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Principles that guarantee reliability and confidence with every order.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "OEM Authenticity", desc: "Strictly authentic part numbers without questionable aftermarket alternatives." },
              { title: "Free VIN Check", desc: "Fitment confirmed against manufacturer EPC catalogs prior to order finalization." },
              { title: "Full Transparency", desc: "Actual photos and clear condition documentation for every component." },
              { title: "Technical Advisory", desc: "Expert assistance on mounting tabs, sensor provisions, and trim levels." },
              { title: "Rapid Quote Turnaround", desc: "Formal RFQ responses delivered within 24 business hours." },
              { title: "Dedicated B2B Program", desc: "Specialized wholesale terms for collision centers and independent shops." },
              { title: "Heavy-Duty Packaging", desc: "Reinforced crating and packaging designed specifically for automotive plastics." },
              { title: "Tracked Delivery", desc: "Reliable logistics partners providing real-time shipment monitoring." },
            ].map((val, idx) => (
              <div
                key={idx}
                className="bg-[#161F30] rounded-xl p-5 border border-[#26354A] shadow-lg hover:border-[#00C2CB]/50 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-[#00C2CB]/15 text-[#00C2CB] border border-[#00C2CB]/30 flex items-center justify-center font-bold text-sm mb-3">
                  ✓
                </div>
                <h3 className="font-bold text-white text-base mb-1.5">{val.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0E1524] border-t border-[#26354A] py-12 md:py-20 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-3xl font-bold mb-3 text-white">Looking for Parts for Your Vehicle or Fleet?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Explore our catalogue of over 800 OEM parts or contact us for free VIN verification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00C2CB] hover:bg-[#00B0B8] text-[#0B0F19] font-bold py-3.5 px-6 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-cyan-500/10"
            >
              <span>Browse Parts Catalogue</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact-us"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#26354A] hover:border-[#00C2CB] bg-[#161F30] hover:text-[#00C2CB] text-white font-semibold py-3.5 px-6 rounded-xl text-sm transition-all duration-200"
            >
              <span>Request for Quotation (RFQ)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

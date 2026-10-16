"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="bg-[#0F172A] text-slate-400 pt-14 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-[1256px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-12 sm:gap-x-16">

          {/* Column 1: Brand */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-extrabold text-2xl tracking-wider text-white flex items-center gap-2">
                <span className="text-[#C82021]">AUTO</span>PARTS <span className="text-xs bg-[#C82021] text-white px-2 py-0.5 rounded font-mono font-bold tracking-normal">OEM</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed max-w-sm mt-3 text-slate-400">
              Genuine OEM replacement parts, bumper assemblies, shells, headlights, lenses, and housings for BMW, Mercedes-Benz, Audi, and Range Rover.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <ShieldCheck size={16} className="text-[#C82021]" />
              <span>Free factory VIN fitment verification</span>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-3">
              {[
                { icon: <FacebookIcon />, label: "Facebook", href: "#" },
                { icon: <InstagramIcon />, label: "Instagram", href: "#" },
                { icon: <LinkedinIcon />, label: "LinkedIn", href: "#" },
                { icon: <YoutubeIcon />, label: "YouTube", href: "#" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  aria-label={item.label}
                  className="w-[32px] h-[32px] rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#C82021] hover:text-white transition-all duration-200"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-[#C82021] text-xs font-bold tracking-widest uppercase">Quick Links</h3>
            <ul className="space-y-3 text-[13px]">
              {[
                { name: "Home", href: "/" },
                { name: "Parts Catalogue", href: "/products" },
                { name: "About Us", href: "/about" },
                { name: "VIN Verification", href: "/contact-us?subject=VIN+Verification" },
                { name: "News & Articles", href: "/news" },
                { name: "Contact & RFQ", href: "/contact-us" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-[#C82021] text-xs font-bold tracking-widest uppercase">OEM Categories</h3>
            <ul className="space-y-3 text-[13px]">
              {[
                { name: "BMW OEM Bumper Assembly", href: "/products?categoryId=1" },
                { name: "BMW OEM Bumper Shell", href: "/products?categoryId=2" },
                { name: "Headlight OEM BMW", href: "/products?categoryId=3" },
                { name: "Lens and Housing - BMW / BENZ", href: "/products?categoryId=4" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & RFQ */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-[#C82021] text-xs font-bold tracking-widest uppercase">Inquiries & Support</h3>

            <div className="space-y-3.5 text-[13px]">
              <div>
                <p className="text-[10px] text-slate-500 mb-0.5 tracking-wider uppercase font-semibold">RFQ & Technical Support</p>
                <a href="mailto:inquiry@autoparts-oem.com" className="hover:text-white transition-colors text-slate-300 font-medium">
                  inquiry@autoparts-oem.com
                </a>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 mb-0.5 tracking-wider uppercase font-semibold">Customer Helpline</p>
                <a href="tel:+48221234567" className="hover:text-white transition-colors text-slate-300 font-medium">
                  +48 22 123 45 67
                </a>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 mb-0.5 tracking-wider uppercase font-semibold">Instant WhatsApp RFQ</p>
                <a href="https://wa.me/48221234567" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-emerald-400 font-medium">
                  WhatsApp Support (24/7 RFQ)
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Automotive OEM Replacement Parts. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">About Company</Link>
            <Link href="/contact-us" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact-us" className="hover:text-white transition-colors">B2B Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

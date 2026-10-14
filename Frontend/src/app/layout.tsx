import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Navber from "../components/Navber";
import Footer from "../components/Footer";
import ScrollToTop from "../utils/ScrollToTop";
import "animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Automotive OEM Replacement Parts | Bumpers, Headlights, Housings",
  description: "Catalogue of genuine OEM replacement bumpers, shells, headlights, lenses, and housings for BMW, Mercedes-Benz, Audi, and Range Rover. Guaranteed fitment verification via VIN.",
  keywords: [
    "OEM car parts",
    "BMW OEM bumper assembly",
    "BMW headlights LED Xenon",
    "Mercedes lens and housing",
    "Audi OEM replacement parts",
    "VIN verification",
    "automotive body parts OEM",
    "BMW F10 F30 G20 bumper",
  ],
  openGraph: {
    title: "Automotive OEM Replacement Parts | Bumpers, Headlights, Housings",
    description: "Catalogue of genuine OEM replacement bumpers, shells, headlights, lenses, and housings with VIN compatibility verification.",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/Icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    shortcut: "/Icon.svg",
    apple: "/Icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className={`${inter.className} min-h-screen min-w-[320px] m-0`}>
        <Providers>
          <ScrollToTop />
          <Navber />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

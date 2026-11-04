"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en";

export interface Translations {
  topBar: {
    delivery: string;
    b2b: string;
  };
  nav: {
    allProducts: string;
    aboutUs: string;
    contactUs: string;
    searchPlaceholder: string;
    searchButton: string;
  };
  hero: {
    kicker: string;
    title: string;
    desc: string;
    browseParts: string;
    checkVin: string;
    trust1: string;
    trust2: string;
    trust3: string;
  };
  searchWidget: {
    tabVehicle: string;
    tabVin: string;
    vehicleBrand: string;
    model: string;
    generation: string;
    modelYear: string;
    category: string;
    oemNumber: string;
    selectPlaceholder: string;
    oemPlaceholder: string;
    searchBtn: string;
    vinLabel: string;
    vinPlaceholder: string;
    vinVerifyBtn: string;
  };
  brands: {
    kicker: string;
    title: string;
    desc: string;
    allBrands: string;
    explore: string;
  };
  categories: {
    kicker: string;
    title: string;
    desc: string;
    allCats: string;
    discover: string;
  };
  recommended: {
    kicker: string;
    title: string;
    desc: string;
    allCatalog: string;
    details: string;
    inquire: string;
  };
  matchSection: {
    kicker: string;
    title: string;
    desc: string;
    verifyBtn: string;
    contactAdvisor: string;
    checkItems: string[];
  };
  howItWorks: {
    kicker: string;
    title: string;
    desc: string;
    steps: {
      num: string;
      title: string;
      desc: string;
    }[];
  };
  b2b: {
    kicker: string;
    title: string;
    desc: string;
    tags: string[];
    partnerBtn: string;
    quoteBtn: string;
    features: {
      title: string;
      desc: string;
    }[];
  };
  guides: {
    kicker: string;
    title: string;
    desc: string;
    allGuides: string;
    read: string;
  };
  bottomCta: {
    kicker: string;
    title: string;
    desc: string;
    sendInquiry: string;
    verifyVin: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    topBar: {
      delivery: "Delivery Across Poland and Europe",
      b2b: "Business Inquiries: +48 000 000 000",
    },
    nav: {
      allProducts: "All Products",
      aboutUs: "About Us",
      contactUs: "Contact us",
      searchPlaceholder: "What are you looking for?",
      searchButton: "Search parts",
    },
    hero: {
      kicker: "PREMIUM REPLACEMENT PARTS",
      title: "The right part. A reliable choice.",
      desc: "Discover high-quality replacement bumpers, headlights, grilles, and exterior parts for BMW, Mercedes-Benz, Audi, and Range Rover.",
      browseParts: "Find your parts",
      checkVin: "Verify by VIN",
      trust1: "Assistance in matching",
      trust2: "Delivery PL and Europe",
      trust3: "Professional inquiries",
    },
    searchWidget: {
      tabVehicle: "Vehicle or part",
      tabVin: "Check by VIN",
      vehicleBrand: "VEHICLE BRAND",
      model: "MODEL",
      generation: "GENERATION",
      modelYear: "MODEL YEAR",
      category: "CATEGORY",
      oemNumber: "OEM / OE NUMBER",
      selectPlaceholder: "Select",
      oemPlaceholder: "e.g. 51 11...",
      searchBtn: "Search parts",
      vinLabel: "ENTER 17-DIGIT VIN NUMBER",
      vinPlaceholder: "e.g. WBA3N5C51FK000000",
      vinVerifyBtn: "Verify VIN",
    },
    brands: {
      kicker: "PREMIUM BRANDS",
      title: "Select vehicle brand",
      desc: "Search parts by model, generation, and production year.",
      allBrands: "All brands",
      explore: "Browse brand",
    },
    categories: {
      kicker: "CATEGORIES",
      title: "Parts by category",
      desc: "External components tailored to specific vehicle specifications.",
      allCats: "All categories",
      discover: "Discover category",
    },
    recommended: {
      kicker: "SELECTED FROM THE CATALOG",
      title: "Most selling parts",
      desc: "Sample catalog items. Availability and matching require confirmation.",
      allCatalog: "See catalog",
      details: "Details",
      inquire: "Inquire about the part",
    },
    matchSection: {
      kicker: "COMPATIBILITY VERIFICATION",
      title: "The right part starts with the right match.",
      desc: "The same vehicle generation may have several equipment variants. Gather the most important data before sending an inquiry.",
      verifyBtn: "Verify the part",
      contactAdvisor: "Contact an advisor",
      checkItems: [
        "VIN and OEM/OE number",
        "Generation and model year",
        "Equipment package",
        "PDC sensor holes",
        "Radar and camera",
        "Headlight washers",
        "Lighting technology",
        "EU or US specification",
      ],
    },
    howItWorks: {
      kicker: "SIMPLE PROCESS",
      title: "How it works",
      desc: "From search to response — transparently and without unconfirmed promises.",
      steps: [
        {
          num: "01",
          title: "Find a part",
          desc: "Search by vehicle, OEM number, name, or VIN.",
        },
        {
          num: "02",
          title: "Check compatibility",
          desc: "Provide vehicle data and required specification.",
        },
        {
          num: "03",
          title: "Send inquiry",
          desc: "Include all product information.",
        },
        {
          num: "04",
          title: "Receive confirmation",
          desc: "We will check availability, matching, and delivery options.",
        },
      ],
    },
    b2b: {
      kicker: "B2B COOPERATION",
      title: "A reliable partner for automotive professionals.",
      desc: "Workshops, body shops, paint shops, and distributors can send organized individual or recurring inquiries.",
      tags: ["WORKSHOPS", "BODY SHOPS", "DISTRIBUTORS"],
      partnerBtn: "Become a partner",
      quoteBtn: "Business inquiry",
      features: [
        {
          title: "Delivery in Poland",
          desc: "We confirm delivery options individually.",
        },
        {
          title: "European shipping",
          desc: "We handle inquiries from European markets.",
        },
        {
          title: "Assistance in matching",
          desc: "Support based on vehicle data.",
        },
      ],
    },
    guides: {
      kicker: "KNOWLEDGE BASE",
      title: "Automotive guides",
      desc: "Practical tips to help identify the right part.",
      allGuides: "All guides",
      read: "Read the article",
    },
    bottomCta: {
      kicker: "NEED HELP?",
      title: "Looking for a specific carpart?",
      desc: "Send vehicle data or OEM number, and our team will help identify the right component.",
      sendInquiry: "Find a part",
      verifyVin: "Contact up",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => { },
  t: translations.en,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageContext.Provider
      value={{
        language: "en",
        setLanguage: () => { },
        t: translations.en,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

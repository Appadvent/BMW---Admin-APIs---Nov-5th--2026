"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "pl";

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
      kicker: "OEM REPLACEMENT PARTS",
      title: "The right part. A reliable choice.",
      desc: "High-quality replacement bumpers, headlights, grilles, and exterior parts for BMW, Mercedes-Benz, Audi, and Range Rover.",
      browseParts: "Find parts",
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
      kicker: "VEHICLE BRANDS",
      title: "Select vehicle brand",
      desc: "Search parts by model, generation, and production year.",
      allBrands: "All brands",
      explore: "Browse brand",
    },
    categories: {
      kicker: "PRODUCT CATEGORIES",
      title: "Parts by category",
      desc: "Browse parts tailored to specific vehicle specifications.",
      allCats: "All categories",
      discover: "Discover category",
    },
    recommended: {
      kicker: "FEATURED COMPONENTS",
      title: "Recommended parts",
      desc: "Popular products. Availability and matching require confirmation via VIN.",
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
      desc: "Articles and tips to help you identify the right body and lighting components.",
      allGuides: "All guides",
      read: "Read guide",
    },
    bottomCta: {
      kicker: "DEDICATED ADVISORY",
      title: "Looking for a specific carpart?",
      desc: "Provide your part number, description, or vehicle VIN, and our specialists will verify availability with an instant offer.",
      sendInquiry: "Send inquiry",
      verifyVin: "Check VIN number",
    },
  },
  pl: {
    topBar: {
      delivery: "Dostawa cała Polska i Europa",
      b2b: "Zapytania biznesowe: +48 000 000 000",
    },
    nav: {
      allProducts: "Wszystkie części",
      aboutUs: "O nas",
      contactUs: "Kontakt",
      searchPlaceholder: "Czego szukasz?",
      searchButton: "Szukaj części",
    },
    hero: {
      kicker: "CZĘŚCI KAROSERYJNE OEM",
      title: "The right part. A reliable choice.",
      desc: "Wysokiej jakości oryginalne i zamienne zderzaki, reflektory, atrapy oraz elementy karoserii dla marek BMW, Mercedes-Benz, Audi oraz Range Rover.",
      browseParts: "Przeglądaj ofertę",
      checkVin: "Sprawdź po VIN",
      trust1: "Pomoc w dopasowaniu",
      trust2: "Dostawa PL i Europa",
      trust3: "Zapytania profesjonalne",
    },
    searchWidget: {
      tabVehicle: "Wybór pojazdu lub części",
      tabVin: "Wyszukiwanie po VIN",
      vehicleBrand: "MARKA POJAZDU",
      model: "MODEL",
      generation: "GENERACJA",
      modelYear: "ROK PRODUKCJI",
      category: "KATEGORIA",
      oemNumber: "NUMER OEM / OE",
      selectPlaceholder: "Wybierz",
      oemPlaceholder: "np. 51 11...",
      searchBtn: "Wyszukaj części",
      vinLabel: "WPROWADŹ 17-ZNAKOWY NUMER VIN",
      vinPlaceholder: "np. WBA3N5C51FK000000",
      vinVerifyBtn: "Zweryfikuj VIN",
    },
    brands: {
      kicker: "MARKI POJAZDÓW",
      title: "Wybierz markę pojazdu",
      desc: "Szukaj części według modelu, generacji oraz rocznika produkcyjnego.",
      allBrands: "Wszystkie marki",
      explore: "Przeglądaj markę",
    },
    categories: {
      kicker: "KATEGORIE PRODUKTÓW",
      title: "Części według kategorii",
      desc: "Przeglądaj elementy dobrane do konkretnej specyfikacji nadwozia.",
      allCats: "Wszystkie kategorie",
      discover: "Odkryj kategorię",
    },
    recommended: {
      kicker: "POLECANE PRODUKTY",
      title: "Rekomendowane części zamienne",
      desc: "Popularne produkty. Dostępność i dopasowanie wymagają potwierdzenia po VIN.",
      allCatalog: "Zobacz cały katalog",
      details: "Szczegóły",
      inquire: "Zapytaj o część",
    },
    matchSection: {
      kicker: "DOPASOWANIE I WERYFIKACJA",
      title: "The right part starts with the right match.",
      desc: "Ta sama generacja pojazdu może posiadać kilka wariantów wyposażenia. Zbierz najważniejsze dane techniczne przed wysłaniem zapytania.",
      verifyBtn: "Zweryfikuj część",
      contactAdvisor: "Skontaktuj się z doradcą",
      checkItems: [
        "Numer VIN oraz numer OEM/OE",
        "Generacja i dokładny rok produkcji",
        "Pakiet wyposażenia (np. M-Pakiet / AMG)",
        "Otwory na czujniki parkowania PDC",
        "Obecność radaru i kamer 360°",
        "Spryskiwacze reflektorów",
        "Technologia oświetlenia (LED, Laser, Matrix)",
        "Specyfikacja europejska (EU) lub amerykańska (USA)",
      ],
    },
    howItWorks: {
      kicker: "PROSTY PROCES",
      title: "How it works",
      desc: "Od wyszukiwania do odpowiedzi — przejrzyście i bez niespełnionych obietnic.",
      steps: [
        {
          num: "01",
          title: "Znajdź część",
          desc: "Szukaj po pojeździe, numerze OEM, nazwie lub numerze VIN.",
        },
        {
          num: "02",
          title: "Sprawdź dopasowanie",
          desc: "Podaj dane pojazdu i wymaganą specyfikację techniczną.",
        },
        {
          num: "03",
          title: "Wyślij zapytanie",
          desc: "Załącz wszystkie informacje o poszukiwanym produkcie.",
        },
        {
          num: "04",
          title: "Otrzymaj potwierdzenie",
          desc: "Sprawdzimy dostępność magazynową, spasowanie oraz opcje dostawy.",
        },
      ],
    },
    b2b: {
      kicker: "WSPÓŁPRACA B2B",
      title: "A reliable partner for automotive professionals.",
      desc: "Warsztaty, serwisy blacharskie, lakiernie i dystrybutorzy mogą przesyłać zorganizowane zapytania jednorazowe lub cykliczne.",
      tags: ["WARSZTATY", "BLACHARNIE", "DYSTRYBUTORZY"],
      partnerBtn: "Zostań partnerem B2B",
      quoteBtn: "Zapytanie ofertowe",
      features: [
        {
          title: "Dostawa w Polsce",
          desc: "Opcje dostawy ustalamy indywidualnie.",
        },
        {
          title: "Wysyłka europejska",
          desc: "Obsługujemy zapytania z rynków europejskich.",
        },
        {
          title: "Wsparcie w doborze",
          desc: "Wsparcie w oparciu o dane pojazdu.",
        },
      ],
    },
    guides: {
      kicker: "BAZA WIEDZY",
      title: "Automotive guides",
      desc: "Artykuły i wskazówki pomagające w bezbłędnej identyfikacji części karoseryjnych.",
      allGuides: "Wszystkie poradniki",
      read: "Czytaj poradnik",
    },
    bottomCta: {
      kicker: "DEDYKOWANE WSPARCIE",
      title: "Looking for a specific carpart?",
      desc: "Podaj numer części, nazwę elementu lub numer VIN pojazdu, a nasz zespół ekspertów błyskawicznie sprawdzi dostępność.",
      sendInquiry: "Wyślij zapytanie",
      verifyVin: "Sprawdź numer VIN",
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
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_lang") as Language;
    if (saved === "en" || saved === "pl") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_lang", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

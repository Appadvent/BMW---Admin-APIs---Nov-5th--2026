"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface NewsDetailPageProps {
  id: string;
}

interface ArticleData {
  id: number;
  badge: string;
  title: string;
  image: string;
  intro: string[];
  sections: {
    heading: string;
    paragraphs?: string[];
    bullets?: { title: string; desc: string }[];
  }[];
  conclusion: string;
  nextArticleId: number;
}

// Articles mapping for the cards
const articlesDatabase: Record<string, ArticleData> = {
  "1": {
    id: 1,
    badge: "OEM NUMBERS • 14.05.2025",
    title: "How to find the right OEM number for BMW?",
    image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
    intro: [
      "Finding the right replacement part for your BMW can be challenging, especially when multiple parts look almost identical. Whether you need a bumper, headlight, grille, mirror, or another exterior component, choosing the correct part is essential for proper fitment and performance.",
      "One of the most reliable ways to identify the correct replacement part is by using its **OEM number**. This number helps you identify the specific part designed for your vehicle and reduces the risk of ordering an incompatible component.",
      "In this guide, we'll explain what a BMW OEM number is, where to find it, and how to use it to select the right replacement part.",
    ],
    sections: [
      {
        heading: "What Is a BMW OEM Number?",
        paragraphs: [
          "OEM stands for **Original Equipment Manufacturer**. An OEM part number is a unique reference number assigned to a specific automotive component by the manufacturer or its parts system.",
          "For BMW vehicles, this number helps distinguish between parts that may look similar but differ in dimensions, mounting points, features, or compatibility.",
          "For example, two BMW models may share a similar headlight design, but the actual parts can differ depending on the model generation, production year, trim level, or lighting technology.",
          "Using the correct OEM number makes it easier to identify the appropriate replacement part for your vehicle.",
        ],
      },
      {
        heading: "Why Is Finding the Correct BMW OEM Number Important?",
        paragraphs: [
          "Before purchasing any replacement part, it is important to verify its compatibility with your vehicle.",
          "Here are the main reasons why an accurate OEM number matters:",
        ],
        bullets: [
          {
            title: "Correct fitment",
            desc: "Helps ensure the replacement part matches your vehicle's specifications.",
          },
          {
            title: "Fewer ordering mistakes",
            desc: "Reduces the risk of buying a part that does not fit.",
          },
          {
            title: "Easier part identification",
            desc: "Helps distinguish between similar components.",
          },
          {
            title: "Time and cost savings",
            desc: "Minimizes avoidable returns, shipping costs, and installation delays.",
          },
          {
            title: "Better compatibility",
            desc: "Helps identify differences in features, mounting points, and vehicle configurations.",
          },
        ],
      },
    ],
    conclusion:
      "Whether you are buying genuine BMW parts or aftermarket replacements, OEM number verification is a useful step before placing an order.",
    nextArticleId: 2,
  },
  "2": {
    id: 2,
    badge: "COMPATIBILITY • 14.05.2025",
    title: "BMW G20 — compatibility of body parts",
    image: "/2b8b934ac924c6a627a96fbf63e3f9026d394379.jpg",
    intro: [
      "The BMW G20 3 Series has become one of the most popular platforms for exterior styling and replacement body components. However, body parts vary considerably across production years, aero packages, and vehicle specifications.",
      "Whether you are sourcing a replacement bumper, kidney grille, or headlight unit, understanding the platform's specific interchangeability rules ensures seamless fitment without unexpected workshop adjustments.",
      "In this technical overview, we break down what body panels interchange directly and what details require close verification.",
    ],
    sections: [
      {
        heading: "What Differentiates G20 Body Components?",
        paragraphs: [
          "BMW offers multiple distinct aerodynamic trims for the G20, most notably the Standard (Sport Line / Luxury Line) and the M Sport Package.",
          "Bumpers, lower grilles, brake air ducts, and front undertray splash guards differ between standard models and M Sport vehicles, meaning brackets and internal support guides do not cross-fit.",
          "Furthermore, LCI (Life Cycle Impulse) facelift updates introduced revised headlight geometries and front fascia mounting points.",
          "Always confirm whether your G20 is a pre-LCI or LCI model before selecting body elements.",
        ],
      },
      {
        heading: "Key Factors in G20 Body Component Selection",
        paragraphs: [
          "Before acquiring front or rear body panels for a G20, review these essential criteria:",
        ],
        bullets: [
          {
            title: "M Sport vs. Base Trim",
            desc: "Reinforcement brackets, lip spoilers, and fog light bezels are trim-specific.",
          },
          {
            title: "LCI Facelift Changes",
            desc: "Facelifted models feature modified headlight contours and grille brackets.",
          },
          {
            title: "Sensor Holes (PDC & Radar)",
            desc: "Bumper shells are manufactured with or without pre-drilled Park Distance Control and Active Cruise radar brackets.",
          },
          {
            title: "Camera Integration",
            desc: "Vehicles with Parking Assistance Plus require grilles and bumpers with front-facing camera cutouts.",
          },
          {
            title: "Mounting Tab Integrity",
            desc: "Ensure plastic fastening tabs are fully intact to maintain factory panel gaps and tight shut lines.",
          },
        ],
      },
    ],
    conclusion:
      "Verifying aero packages and sensor cutouts against your factory VIN ensures your BMW G20 body repairs restore original showroom aesthetics.",
    nextArticleId: 3,
  },
  "3": {
    id: 3,
    badge: "TECHNICAL GUIDE • 14.05.2025",
    title: "How to check if the bumper supports PDC?",
    image: "/734295950a53ab641f4c489e327584416018d44d.jpg",
    intro: [
      "Park Distance Control (PDC) and autonomous parking sensors have become standard equipment on modern European premium vehicles. However, replacement bumper assemblies and shells are manufactured in distinct configurations with and without sensor provisions.",
      "Purchasing a bumper without checking for PDC compatibility often leads to expensive drilling errors, incorrect bracket alignment, or sensor failure warnings.",
      "Here is how you can easily verify whether a replacement bumper supports PDC before placing your order.",
    ],
    sections: [
      {
        heading: "Understanding PDC Provisions in Modern Bumpers",
        paragraphs: [
          "Factory OEM bumpers supporting PDC are molded with precise circular holes and sonic-welded sensor retainers on the inner surface.",
          "Bumpers intended for vehicles without PDC have solid plastic faces and typically lack the inner alignment rings and wire harness clips required to secure ultrasonic sensors.",
          "Additionally, vehicles equipped with automated parking (Parking Assistant) feature extra side-facing sensors located near the wheel arches.",
          "Knowing the total count of sensors on your vehicle (typically 4 or 6 on the front bumper) is vital.",
        ],
      },
      {
        heading: "How to Confirm PDC Support Before Purchase",
        paragraphs: [
          "Check these technical details when inspecting a replacement bumper:",
        ],
        bullets: [
          {
            title: "Sensor hole count",
            desc: "Verify whether the bumper has 4 front holes or 6 holes (for auto-park / side sensors).",
          },
          {
            title: "Inner sensor brackets",
            desc: "Ensure original factory retaining rings and plastic clips are present and undamaged on the reverse side.",
          },
          {
            title: "Hole diameter & angle",
            desc: "Factory-stamped PDC holes feature specific bevel angles to ensure the sensor face sits flush with the bumper contour.",
          },
          {
            title: "Wiring harness channels",
            desc: "Confirm internal routing clips are intact so the sensor wiring loom is protected from road debris.",
          },
          {
            title: "Factory part number check",
            desc: "OEM parts catalogs specify distinct part numbers for bumpers with option code S508A (PDC).",
          },
        ],
      },
    ],
    conclusion:
      "Always check inner retaining brackets and sensor hole counts against your original bumper to guarantee error-free installation.",
    nextArticleId: 1,
  },
};

// Fallback generator for ids 4-9
const getArticleData = (id: string): ArticleData => {
  if (articlesDatabase[id]) {
    return articlesDatabase[id];
  }
  // Repeat content cyclically for ids 4 to 9
  const num = parseInt(id, 10);
  const baseId = !isNaN(num) ? String(((num - 1) % 3) + 1) : "1";
  const baseArticle = articlesDatabase[baseId] || articlesDatabase["1"];
  const nextId = num >= 9 ? 1 : num + 1;

  return {
    ...baseArticle,
    id: num || 1,
    nextArticleId: nextId,
  };
};

export default function NewsDetailPage({ id }: NewsDetailPageProps) {
  const article = getArticleData(id);

  return (
    <div className="w-full min-h-screen bg-[#070e12] text-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-28">
        {/* Breadcrumb matching Figma */}
        <div className="flex items-center gap-1.5 text-xs text-[#00E5EE] mb-6 flex-wrap">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="text-[#00E5EE]/60">|</span>
          <Link href="/news" className="hover:underline">
            Blogs
          </Link>
          <span className="text-[#00E5EE]/60">|</span>
          <span className="text-[#00E5EE] truncate max-w-[320px] sm:max-w-none">
            {article.title}
          </span>
        </div>

        {/* Hero Image Section matching Figma full width card banner */}
        <div className="w-full h-[280px] sm:h-[380px] md:h-[460px] lg:h-[500px] overflow-hidden rounded-none bg-black mb-8 sm:mb-10 relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Article Body Content Container */}
        <div className="max-w-[1240px]">
          {/* Badge */}
          <span
            style={{
              fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
              fontSize: "12px",
              lineHeight: "18.7px",
              letterSpacing: "0px",
            }}
            className="text-[#9CA2A2] uppercase tracking-wider block mb-3 font-medium"
          >
            {article.badge}
          </span>

          {/* Main Title */}
          <h1
            style={{
              fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: "36px",
              letterSpacing: "0px",
            }}
            className="text-white mb-6"
          >
            {article.title}
          </h1>

          {/* Intro Paragraphs */}
          <div className="space-y-4 mb-8">
            {article.intro.map((p, idx) => (
              <p
                key={idx}
                style={{
                  fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "18.7px",
                  letterSpacing: "0px",
                }}
                className="text-[#B0B8C1]"
              >
                {p.split("**").map((chunk, cIdx) =>
                  cIdx % 2 === 1 ? (
                    <strong key={cIdx} className="text-white font-semibold">
                      {chunk}
                    </strong>
                  ) : (
                    chunk
                  )
                )}
              </p>
            ))}
          </div>

          {/* Content Sections */}
          {article.sections.map((sec, idx) => (
            <div key={idx} className="mb-8">
              {/* Section Heading matching Figma spec */}
              <h2
                style={{
                  fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  lineHeight: "18.7px",
                  letterSpacing: "0px",
                }}
                className="text-white mb-5 mt-7"
              >
                {sec.heading}
              </h2>

              {/* Section Paragraphs */}
              {sec.paragraphs && (
                <div className="space-y-4 mb-4">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      style={{
                        fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "18.7px",
                        letterSpacing: "0px",
                      }}
                      className="text-[#B0B8C1]"
                    >
                      {p.split("**").map((chunk, cIdx) =>
                        cIdx % 2 === 1 ? (
                          <strong
                            key={cIdx}
                            className="text-white font-semibold"
                          >
                            {chunk}
                          </strong>
                        ) : (
                          chunk
                        )
                      )}
                    </p>
                  ))}
                </div>
              )}

              {/* Bullets */}
              {sec.bullets && (
                <div className="space-y-2 mt-4 mb-5">
                  {sec.bullets.map((b, bIdx) => (
                    <p
                      key={bIdx}
                      style={{
                        fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "18.7px",
                        letterSpacing: "0px",
                      }}
                      className="text-[#B0B8C1]"
                    >
                      <span className="text-[#00E5EE] mr-1.5">•</span>
                      <strong className="text-white font-semibold">
                        {b.title}:
                      </strong>{" "}
                      {b.desc}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Conclusion */}
          {article.conclusion && (
            <p
              style={{
                fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "18.7px",
                letterSpacing: "0px",
              }}
              className="text-[#B0B8C1] mb-8"
            >
              {article.conclusion}
            </p>
          )}

          {/* Next Article Link */}
          <div className="pt-4">
            <Link
              href={`/news/${article.nextArticleId}`}
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#00E5EE] hover:text-[#38ef7d] transition-colors"
            >
              <span>Next article</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

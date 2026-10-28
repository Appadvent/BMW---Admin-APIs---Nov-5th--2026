"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface AnimatedTextProps {
  text: string;
  variant?: "typewriter-char" | "typewriter-word" | "smooth-paragraph";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  duration?: number;
  delay?: number;
  trigger?: string;
  start?: string;
  highlightWords?: string[];
  highlightClass?: string;
  autoPlay?: boolean;
}

export default function AnimatedText({
  text,
  variant = "typewriter-word",
  as: Tag = "div",
  className = "",
  style = {},
  stagger,
  duration = 0.4,
  delay = 0,
  trigger,
  start = "top 85%",
  highlightWords = [],
  highlightClass = "text-[#00C2CB]",
  autoPlay = false,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = el.querySelectorAll(".anim-char, .anim-word");
    if (targets.length === 0 || prefersReducedMotion) {
      if (targets.length > 0) {
        gsap.set(targets, { opacity: 1, x: 0 });
      }
      return;
    }

    const defaultStagger =
      stagger !== undefined
        ? stagger
        : variant === "typewriter-char"
        ? 0.02
        : variant === "smooth-paragraph"
        ? 0.015
        : 0.03;

    // Set initial state for Left -> Right reveal
    gsap.set(targets, {
      opacity: 0,
      x: -6,
    });

    const playReveal = () => {
      gsap.to(targets, {
        opacity: 1,
        x: 0,
        duration: duration,
        ease: "power2.out",
        stagger: defaultStagger,
        delay: delay,
        overwrite: "auto",
      });
    };

    if (autoPlay) {
      playReveal();
      return;
    }

    const st = ScrollTrigger.create({
      trigger: trigger || el,
      start: start,
      onEnter: () => playReveal(),
      onEnterBack: () => playReveal(),
    });

    return () => {
      st.kill();
    };
  }, [variant, stagger, duration, delay, trigger, start, autoPlay, text]);

  if (variant === "typewriter-char") {
    const words = text.split(" ");
    return (
      <Tag
        ref={containerRef as any}
        className={className}
        style={style}
      >
        {words.map((word, wIdx) => {
          const isHighlight = highlightWords.some((hw) =>
            word.toLowerCase().includes(hw.toLowerCase())
          );
          const chars = word.split("");
          return (
            <span
              key={wIdx}
              className={`inline-block whitespace-nowrap mr-[0.28em] ${
                isHighlight ? highlightClass : ""
              }`}
            >
              {chars.map((char, cIdx) => (
                <span
                  key={cIdx}
                  className="anim-char inline-block will-change-[opacity,transform]"
                >
                  {char}
                </span>
              ))}
            </span>
          );
        })}
      </Tag>
    );
  }

  // Word-by-word / Smooth Paragraph Left-to-Right Reveal
  const words = text.split(" ");
  return (
    <Tag
      ref={containerRef as any}
      className={className}
      style={style}
    >
      {words.map((word, i) => {
        const isHighlight = highlightWords.some((hw) =>
          word.toLowerCase().includes(hw.toLowerCase())
        );
        return (
          <span
            key={i}
            className={`anim-word inline-block mr-[0.26em] will-change-[opacity,transform] ${
              isHighlight ? highlightClass : ""
            }`}
          >
            {word}
          </span>
        );
      })}
    </Tag>
  );
}

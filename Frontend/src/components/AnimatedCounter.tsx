"use client";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1.8,
  className = "",
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<string>(() => {
    // Parse initial representation to show formatted 0 with prefix/suffix
    const str = String(value).trim();
    const match = str.match(/^([^0-9.]*)([0-9,.]+)(.*)$/);
    if (!match) return str;
    const [, prefix = "", , suffix = ""] = match;
    return `${prefix}0${suffix}`;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const str = String(value).trim();
    const match = str.match(/^([^0-9.]*)([0-9,.]+)(.*)$/);
    if (!match) {
      setDisplayValue(str);
      return;
    }

    const [, prefix = "", numStr = "0", suffix = ""] = match;
    const hasCommas = numStr.includes(",");
    const cleanNumStr = numStr.replace(/,/g, "");
    const targetNum = parseFloat(cleanNumStr) || 0;
    const decimalParts = cleanNumStr.split(".");
    const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;

    const formatNumber = (val: number) => {
      let formatted: string;
      if (decimals > 0) {
        formatted = val.toFixed(decimals);
      } else {
        formatted = Math.round(val).toString();
      }

      if (hasCommas) {
        const parts = formatted.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        formatted = parts.join(".");
      }
      return `${prefix}${formatted}${suffix}`;
    };

    const countObj = { val: 0 };
    let tween: gsap.core.Tween | null = null;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () => {
        if (tween) tween.kill();
        countObj.val = 0;
        tween = gsap.to(countObj, {
          val: targetNum,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            setDisplayValue(formatNumber(countObj.val));
          },
          onComplete: () => {
            setDisplayValue(formatNumber(targetNum));
          },
        });
      },
    });

    return () => {
      if (tween) tween.kill();
      trigger.kill();
    };
  }, [value, duration]);

  return (
    <span ref={containerRef} className={className}>
      {displayValue}
    </span>
  );
}

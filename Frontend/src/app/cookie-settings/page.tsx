"use client";

import React from "react";
import PolicyPageView from "@/components/PolicyPageView";

export default function CookieSettingsPage() {
  return (
    <PolicyPageView
      expectedTypes={["cookie_policy", "cookies", "cookie_settings"]}
      fallbackTitle="Cookie Settings & Policy"
      defaultDescription="We use cookies and similar technologies to enhance browsing experience, analyze site traffic, and personalize content. Content will update once published from the Admin panel."
    />
  );
}


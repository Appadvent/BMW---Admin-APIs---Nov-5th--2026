"use client";

import React from "react";
import PolicyPageView from "@/components/PolicyPageView";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageView
      expectedTypes={["privacy_and_policy", "privacy_policy", "privacy"]}
      fallbackTitle="Privacy Policy"
      defaultDescription="We value your privacy and are committed to protecting your personal data in accordance with GDPR and applicable regulations. Content will update once published from the Admin panel."
    />
  );
}


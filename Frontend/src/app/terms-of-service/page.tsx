"use client";

import React from "react";
import PolicyPageView from "@/components/PolicyPageView";

export default function TermsOfServicePage() {
  return (
    <PolicyPageView
      expectedTypes={["terms_and_conditions", "terms", "terms_of_service"]}
      fallbackTitle="Terms of Service"
      defaultDescription="Terms of service govern the use of our website, product requests, quotations, and parts supply services. Content will update once published from the Admin panel."
    />
  );
}


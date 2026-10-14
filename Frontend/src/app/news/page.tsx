import { Metadata } from "next";
import NewsMediaPage from "@/components/NewsMediaPage";

export const metadata: Metadata = {
  title: "News & Media | AUTOPARTS OEM",
  description: "Company announcements, parts catalogue updates, and automotive industry press coverage.",
};

export default function News() {
  return (
    <main>
      <NewsMediaPage />
    </main>
  );
}

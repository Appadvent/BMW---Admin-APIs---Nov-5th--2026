import { Metadata } from "next";
import NewsDetailPage from "@/components/NewsDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `News Detail | AUTOPARTS OEM`,
    description: `Read the full story and announcements from AUTOPARTS OEM.`,
  };
}

export default async function NewsDetailRoute({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <main>
      <NewsDetailPage id={resolvedParams.id} />
    </main>
  );
}

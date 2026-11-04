import { Suspense } from 'react';
import ProductsPage from '@/components/Products';

export default function Products() {
  return (
    <main className="bg-[#081516] min-h-screen">
      <Suspense fallback={<div className="min-h-screen bg-[#081516]" />}>
        <ProductsPage />
      </Suspense>
    </main>
  );
}

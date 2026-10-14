import { Suspense } from 'react';
import ProductsPage from '@/components/Products';

export default function Products() {
  return (
    <main>
      <div className="bg-gray-900">
        <Suspense fallback={<div className="min-h-screen bg-[#1A232C]" />}>
          <ProductsPage />
        </Suspense>
      </div>
    </main>
  );
}

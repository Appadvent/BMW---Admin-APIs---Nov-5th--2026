import React from 'react';
import ProductDetail from '@/components/ProductDetail';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Details | AUTOPARTS OEM',
  description: 'Precision engineered genuine OEM replacement parts and technical specifications.',
};

export default function ProductDetailPage() {
  return (
    <main>
      <ProductDetail />
    </main>
  );
}

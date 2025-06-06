'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { getProducts } from '@/utils/supabase/queries';
import type { Tables } from '@/types_db';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface ProductMetadata {
  features?: string[];
}

export default function PricingPage() {
  const [products, setProducts] = useState<ProductWithPrices[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const products = await getProducts(supabase);
        console.log('Fetched products:', products);
        setProducts(products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-orange-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20">
          {products.map((product) => {
            const price = product.prices?.find(
              (price) => price.interval === 'month'
            );
            if (!price) return null;

            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);

            const metadata = product.metadata as ProductMetadata;
            const features = metadata.features || [
              'Basic template',
              'Standard format',
              '1 free generation'
            ];

            return (
              <div
                key={product.id}
                className={`flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-gray-200 xl:p-8 max-w-md mx-auto ${
                  product.name === 'Pro' ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      className={`text-base font-semibold leading-8 ${
                        product.name === 'Pro' ? 'text-orange-500' : 'text-gray-900'
                      }`}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {product.description || 'Perfect for getting started'}
                  </p>
                  <p className="mt-4 flex items-baseline gap-x-1">
                    <span className="text-3xl font-bold tracking-tight text-gray-900">
                      {priceString}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  </p>
                  <ul role="list" className="mt-6 space-y-2 text-sm leading-6 text-gray-600">
                    {features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <svg
                          className="h-5 w-4 flex-none text-orange-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={product.name === 'Pro' ? '/signin' : '/job-cover-letter'}
                  className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    product.name === 'Pro'
                      ? 'bg-orange-500 text-white shadow-sm hover:bg-orange-600 focus-visible:outline-orange-500'
                      : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                  }`}
                >
                  {product.name === 'Pro' ? 'Upgrade to Pro' : 'Get Started'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import type { Tables } from '@/types_db';
import { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { checkoutWithStripe, createStripePortal } from '@/utils/stripe/server';
import { getStripe } from '@/utils/stripe/client';
import { getErrorRedirect } from '@/utils/helpers';
import { Button } from '@/components/ui/button';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;

interface ProductWithPrices extends Product {
    prices: Price[];
  }
  interface PriceWithProduct extends Price {
    products: Product | null;
  }
  interface SubscriptionWithProduct extends Subscription {
    prices: PriceWithProduct | null;
  }

interface Props {
    user: User | null | undefined;
    products: ProductWithPrices[];
    subscription: SubscriptionWithProduct | null;
  }

export default function Pricing({ user, products, subscription }: Props) {
    const router = useRouter();
    const [priceIdLoading, setPriceIdLoading] = useState<string>();
    const currentPath = usePathname();

    const handleStripePortalRequest = async () => {

      const redirectUrl = await createStripePortal(currentPath);

      return router.push(redirectUrl);
    };
    
    const handleStripeCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);
    
        if (!user) {
          setPriceIdLoading(undefined);
          return router.push('/signin/signup');
        }
    
        const { errorRedirect, sessionId } = await checkoutWithStripe(
          price,
          currentPath
        );
    
        if (errorRedirect) {
          setPriceIdLoading(undefined);
          return router.push(errorRedirect);
        }
    
        if (!sessionId) {
          setPriceIdLoading(undefined);
          return router.push(
            getErrorRedirect(
              currentPath,
              'An unknown error occurred.',
              'Please try again later or contact a system administrator.'
            )
          );
        }
    
        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
    
        setPriceIdLoading(undefined);
      };


  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-semibold leading-7 text-orange-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Start Your Career Journey Today
          </p>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20">
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

            return (
              <div
                key={product.id}
                className={`flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-gray-200 xl:p-8 max-w-md mx-auto ${
                  product.name === 'Pro' ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-center gap-x-4">
                    <h3
                      className={`text-3xl font-semibold leading-8 ${
                        product.name === 'Pro' ? 'text-orange-500' : 'text-gray-900'
                      }`}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-600 space-y-2">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      Unlock unlimited cover letter generation with premium features
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      Tailored solutions for job applications (housing, and academic pursuits is coming soon)
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">💝</span>
                      A labor of love from an independent developer, growing with you
                    </span>
                    <span className="flex items-center gap-2 text-orange-600 font-medium">
                      <span className="text-lg">🎉</span>
                      Wish to help you get your dream job within a month - hope no need to renew! 
                    </span>
                  </p>
                  <p className="mt-4 flex items-baseline gap-x-1">
                    <span className="text-3xl font-bold tracking-tight text-gray-900">
                      {priceString}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  </p>
                </div>
                {
                  subscription ? (
                    <Button
                      type="button"
                      onClick={() => handleStripePortalRequest()}
                      className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                    >
                      Manage
                    </Button>
                  ) : (
                    <Button       
                      type="button"
                      onClick={() => handleStripeCheckout(price)}
                      className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                    >
                      Subscribe
                    </Button>
                  )
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '0',
    features: [
      '1 free generation',
      'Basic template',
      'Standard format',
    ],
    buttonText: 'Get Started',
    buttonLink: '/job-cover-letter',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '4.99',
    features: [
      'Unlimited generations',
      'Save personal information',
      'Generate personalized cover letters',
    ],
    buttonText: 'Upgrade to Pro',
    buttonLink: '/signin',
    highlighted: true,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="relative rounded-full p-1">
            <button
              type="button"
              className={`${
                isAnnual ? 'bg-indigo-600 text-white' : 'text-gray-900'
              } relative rounded-full px-4 py-2 text-sm font-semibold`}
              onClick={() => setIsAnnual(true)}
            >
              Annual
            </button>
            <button
              type="button"
              className={`${
                !isAnnual ? 'bg-indigo-600 text-white' : 'text-gray-900'
              } relative rounded-full px-4 py-2 text-sm font-semibold`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-gray-200 xl:p-8 ${
                plan.highlighted ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    className={`text-base font-semibold leading-8 ${
                      plan.highlighted ? 'text-indigo-600' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {plan.name === 'Free' ? 'Free Trial' : 'Professional'}
                </p>
                <p className="mt-4 flex items-baseline gap-x-1">
                  <span className="text-3xl font-bold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </p>
                <ul role="list" className="mt-6 space-y-2 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg
                        className="h-5 w-4 flex-none text-indigo-600"
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
                href={plan.buttonLink}
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
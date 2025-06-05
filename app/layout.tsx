import { Metadata } from 'next';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { Manrope } from 'next/font/google';
import Navbar from '@/components/ui/Navbar/Navbar';
const title = 'Next.js Subscription Starter';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};
const manrope = Manrope({ subsets: ['latin'] });

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
    lang="en"
    className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
  >
      <body className="min-h-[100dvh] bg-gray-50">
       <Navbar/>
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] pt-16"
        >
          {children}
        </main>

      </body>
    </html>
  );
}

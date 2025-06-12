import { Analytics } from '@vercel/analytics/next';
import { Metadata } from 'next';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { Manrope } from 'next/font/google';
import Navbar from '@/components/ui/Navbar/Navbar';
const title = 'CL-Master';
const description = 'CL-Master is a AI-powered tool that helps you write Cover Letters';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  keywords: ['AI Cover Letter', 'cover letter australia', 'cover letter generator', 'cover letter', 'cover letter examples', 'cover letter builder', 'cover letter maker', 'cover letter creator', 'cover letter generator', 'cover letter template', 'cover letter examples', 'cover letter builder', 'cover letter maker', 'cover letter creator', 'cover letter generator', 'cover letter template', 'cover letter examples', 'cover letter builder', 'cover letter maker', 'cover letter creator'],
  openGraph: {
    type: "website",
    title: title,
    description: description,
    url: new URL(getURL()),
    images: [
      {
        url: '/Cl-master-seo-bg.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: ['/Cl-master-seo-bg.png'],
  },
  icons: {
    icon: '/favicon.ico',
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
        <Analytics />
      </body>
    </html>
  );
}

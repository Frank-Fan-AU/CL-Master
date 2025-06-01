'use client';

import { createClient } from '@/utils/supabase/client';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';
import Link from 'next/link';
import { CircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <CircleIcon className="h-6 w-6 text-orange-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900">CL-Master</span>
            </Link>
            <div className="flex space-x-6">
              <Link 
                href="/job-cover-letter" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Job Cover Letter
              </Link>
              {/* <Link 
                href="/rent-coverletter" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Rent Cover Letter
              </Link> */}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Navlinks user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}

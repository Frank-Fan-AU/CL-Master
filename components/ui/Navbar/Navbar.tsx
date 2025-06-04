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
    let mounted = true;

    // 立即获取用户状态
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        console.log('Current session:', session);
        if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('Error in getUser:', err);
      }
    };

    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 添加调试信息
  console.log('Navbar render - user state:', user);

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

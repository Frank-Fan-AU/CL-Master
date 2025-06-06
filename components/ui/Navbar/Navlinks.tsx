'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';

import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';


interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  // 添加调试信息
  console.log('Navlinks render - user prop:', user);

  return (
    <div className="flex items-center space-x-8">
      <Link
        href="/pricing"
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Pricing
      </Link>
      {user && (
        <Link
          href="/profile"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Profile
        </Link>
        
      )}
      {user && (
        <Link
          href="/account"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          account
        </Link>
        
      )}
      {user ? (
        <form onSubmit={(e) => handleRequest(e, SignOut, router)} className="m-0">
           <input type="hidden" name="pathName" value={usePathname()} />
          <button type="submit" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Sign out
          </button>
        </form>
      ) : (
        <Link href="/signin" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          Sign In
        </Link>
      )}
    </div>
  );
}

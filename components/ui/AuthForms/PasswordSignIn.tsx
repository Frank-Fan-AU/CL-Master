'use client';


import Link from 'next/link';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <form
        noValidate={true}
        className="space-y-3"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-900">Email</label>
            <Input 
              id="email"
              name="email" 
              placeholder="name@example.com" 
              type="email" 
              autoCapitalize="none" 
              autoComplete="email" 
              autoCorrect="off" 
              className="w-full"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-900">Password</label>
            <Input 
              id="password"
              name="password" 
              placeholder="Password" 
              type="password" 
              autoComplete="current-password" 
              className="w-full"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <Link href="/signin/forgot_password" className="text-gray-600 hover:text-gray-900">
            Forgot your password?
          </Link>
        </div>

        {allowEmail && (
          <div className="text-center">
            <Link href="/signin/email_signin" className="text-gray-600 hover:text-gray-900">
              Sign in via magic link
            </Link>
          </div>
        )}

        <div className="text-center">
          <Link href="/signin/signup" className="text-gray-600 hover:text-gray-900">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

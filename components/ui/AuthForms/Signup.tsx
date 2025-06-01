'use client';


import React from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    try {
      await handleRequest(e, signUp, router);
      // 根据环境显示不同的提示信息
      if (process.env.NODE_ENV === 'development') {
        alert('Registration successful! In development mode, email verification is automatically completed.');
      } else {
        alert('Registration successful! Please check your email for verification link.');
      }
      // 重定向到登录页面
      if (router) {
        router.push('/signin/password_signin');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              autoComplete="new-password" 
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
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>

      <div className="space-y-2 text-sm">
        <p className="text-gray-600">
          {process.env.NODE_ENV === 'development' 
            ? 'In development mode, email verification is automatically completed.'
            : 'By signing up, you agree to receive a verification email to confirm your account.'}
        </p>
        <div className="text-center">
          <Link href="/signin/password_signin" className="text-gray-600 hover:text-gray-900">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

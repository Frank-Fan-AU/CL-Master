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
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signUp, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email" className="text-gray-900">Email</label>
           <Input name='email' placeholder='name@example.com' type='email' autoCapitalize='none' autoComplete='email' autoCorrect='off' className='w-full p-3 rounded-md '/>
            <label htmlFor="password" className="text-gray-900">Password</label>
            <Input name='password' placeholder='Password' type='password' autoComplete='current-password' className='w-full p-3 rounded-md '/>
          </div>
          <Button

            type="submit"
            className="mt-1"
          
          >
            Sign up
          </Button>
        </div>
      </form>
      <p className="text-gray-900">Already have an account?</p>
      <p>
        <Link href="/signin/password_signin" className="font-light text-sm text-gray-900">
          Sign in with email and password
        </Link>
      </p>
      {allowEmail && (
        <p>
          <Link href="/signin/email_signin" className="font-light text-sm text-gray-900">
            Sign in via magic link
          </Link>
        </p>
      )}
    </div>
  );
}

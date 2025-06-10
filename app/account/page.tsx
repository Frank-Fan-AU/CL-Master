'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import { updateName, updateEmail, updatePassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { createStripePortal } from '@/utils/stripe/server';

interface Subscription {
  status: string;
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  current_period_end: string;
}

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentPath = usePathname();

  useEffect(() => {
    let mounted = true;

    async function getProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!mounted) return;
        console.log(user);
        if (user) {
          setFullName(user.user_metadata.full_name || '');
          setEmail(user.email || null);
          
          // Get subscription info
          const { data: subscriptionData } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (!mounted) return;
          
          if (subscriptionData) {
            setSubscription({
              status: subscriptionData.status || 'active',
              price_id: subscriptionData.price_id || '',
              quantity: subscriptionData.quantity || 1,
              cancel_at_period_end: subscriptionData.cancel_at_period_end || false,
              current_period_end: subscriptionData.current_period_end
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const redirectPath = await handleRequest(e, updateName, router);
      if (redirectPath) {
        setSuccessMsg('Name updated successfully!');
      } else {
        setErrorMsg('Failed to update name. Please try again.');
      }
    } catch (error) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const redirectPath = await handleRequest(e, updateEmail, router);
      if (redirectPath) {
        setSuccessMsg('Email update confirmation sent!');
      } else {
        setErrorMsg('Failed to update email. Please try again.');
      }
    } catch (error) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const redirectPath = await handleRequest(e, updatePassword, router);
      if (redirectPath) {
        setSuccessMsg('Password updated successfully!');
      } else {
        setErrorMsg('Failed to update password. Please try again.');
      }
    } catch (error) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const redirectUrl = await createStripePortal(currentPath);
      if (redirectUrl.startsWith('/error')) {
        // Parse error information from the URL
        const errorParams = new URLSearchParams(redirectUrl.split('?')[1]);
        const errorMessage = errorParams.get('error');
        const errorDescription = errorParams.get('error_description');
        setErrorMsg(`${errorMessage}: ${errorDescription}`);
        return;
      }
      setIsSubmitting(false);
      return router.push(redirectUrl);
    } catch (error) {
      console.error('Error accessing Stripe portal:', error);
      setErrorMsg('Unable to access the subscription management portal. Please try again later or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Account Settings</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Manage your account
          </p>

          {errorMsg && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{errorMsg}</h3>
                </div>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">{successMsg}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {/* Subscription Information */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 pt-6 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Subscription</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Manage your subscription details.
                </p>
              </div>

              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Current Plan</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {subscription ? 'Pro Plan' : 'Free Plan'}
                      </p>
                    </div>
                   
                  </div>
                  {subscription && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        {subscription.cancel_at_period_end ? <p className="text-sm font-medium text-gray-900">will cancel at</p> : <p className="text-sm font-medium text-gray-900">Next billing date</p>}
                        
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(subscription.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Status</p>
                       
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-3 sm:px-6">
                  {subscription ? (
                    <button
                      type="button"
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={handleStripePortalRequest}
                    >
                      Manage Subscription
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => router.push('/pricing')}
                    >
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name Update Form */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 pt-6 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Update your name
                </p>
              </div>

              <form onSubmit={handleNameSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-4 sm:p-6">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">
                        Full name
                      </label>
                      <div className="mt-2 flex items-center gap-4">
                        <input
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={fullName || ''}
                          onChange={(e) => setFullName(e.target.value)}
                          className="block w-full rounded-md border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </form>
            </div>

            {/* Email Update Form */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 pt-6 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Email Address</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Update your email address. You will need to confirm the change.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-4 sm:p-6">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="newEmail" className="block text-sm font-medium leading-6 text-gray-900">
                        New email address
                      </label>
                      <div className="mt-2 flex items-center gap-4">
                        <input
                          type="email"
                          name="newEmail"
                          id="newEmail"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="block w-full rounded-md border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
               
              </form>
            </div>

            {/* Password Update Form */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 pt-6 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Password</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Update your password.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-4 sm:p-6">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        New password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="passwordConfirm" className="block text-sm font-medium leading-6 text-gray-900">
                        Confirm new password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="passwordConfirm"
                          id="passwordConfirm"
                          value={newPasswordConfirm}
                          onChange={(e) => setNewPasswordConfirm(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-3 sm:px-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

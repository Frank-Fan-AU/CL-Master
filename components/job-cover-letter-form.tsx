'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';

const FREE_GENERATION_KEY = 'has_free_generation';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;

interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  subscription: SubscriptionWithProduct | null;
}

export default function JobCoverLetterForm({ user, subscription }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasFreeGeneration, setHasFreeGeneration] = useState(true);
  const [remainingGenerations, setRemainingGenerations] = useState(20);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    jobRequirements: '',
    emphasis: ''
  });

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      // Get total generations count for logged-in users
      const getGenerationsCount = async () => {
        try {
          const { data, error } = await supabase
            .from('user_generations')
            .select('count')
            .eq('user_id', user.id)
            .maybeSingle(); // 使用 maybeSingle 而不是 single，这样当没有记录时不会报错

          console.log('Generation count data:', data);
          
          if (error) {
            console.error('Error fetching generation count:', error);
            return;
          }

          // 如果没有记录，说明用户还没有生成过，设置剩余次数为20
          if (!data) {
            setRemainingGenerations(20);
            return;
          }

          setRemainingGenerations(Math.max(0, 20 - data.count));
        } catch (err) {
          console.error('Error in getGenerationsCount:', err);
        }
      };
      getGenerationsCount();
    } else {
      // Check free generation for non-logged in users
      const storedFreeGeneration = localStorage.getItem(FREE_GENERATION_KEY);
      if (storedFreeGeneration === 'false') {
        setHasFreeGeneration(false);
      }
    }
  }, [user, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check generation limits
    if (!isLoggedIn && !hasFreeGeneration) {
      alert('You have reached your free generation limit. Please sign in to get more generations.');
      router.push('/signin');
      return;
    }

    if (isLoggedIn && subscription?.status !== 'active' && remainingGenerations <= 0) {
      setError('You have reached your generation limit (20 generations). Please subscribe for unlimited generations.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isFreeGeneration: !isLoggedIn && hasFreeGeneration,
          userResume: isLoggedIn ? user?.user_metadata.resume : undefined,
          userId: isLoggedIn ? user?.id : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter');
      }

      setGeneratedLetter(data.coverLetter);

      // Update generation counts
      if (!isLoggedIn && hasFreeGeneration) {
        setHasFreeGeneration(false);
        localStorage.setItem(FREE_GENERATION_KEY, 'false');
      } else if (isLoggedIn && subscription?.status !== 'active') {
        setRemainingGenerations(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getGenerationLimitText = () => {
    if (subscription?.status === 'active') {
      return 'Unlimited generations';
    }
    if (isLoggedIn) {
      return `Remaining generations: ${remainingGenerations}/20`;
    }
    return hasFreeGeneration ? '1 free generation remaining' : 'No free generations remaining';
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium text-gray-900">
              Company Name
            </label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Enter company name"
              className="text-gray-900"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-gray-900">
              Location
            </label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter job location"
              className="text-gray-900"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="jobRequirements" className="text-sm font-medium text-gray-900">
            Job Requirements
          </label>
          <Textarea
            id="jobRequirements"
            value={formData.jobRequirements}
            onChange={(e) => setFormData({ ...formData, jobRequirements: e.target.value })}
            placeholder="Paste the job requirements here..."
            className="min-h-[200px] text-gray-900"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="emphasis" className="text-sm font-medium text-gray-900">
            What would you like to emphasize?
          </label>
          <Textarea
            id="emphasis"
            value={formData.emphasis}
            onChange={(e) => setFormData({ ...formData, emphasis: e.target.value })}
            placeholder="Enter what you'd like to emphasize in your cover letter..."
            className="min-h-[100px] text-gray-900"
            required
          />
        </div>

        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || (!isLoggedIn && !hasFreeGeneration) || (isLoggedIn && subscription?.status !== 'active' && remainingGenerations <= 0)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Cover Letter'
            )}
          </Button>
          <div className="text-sm text-gray-500 text-center space-y-1">
            <p>{getGenerationLimitText()}</p>
            {!isLoggedIn && (
              <p>Sign in to get 20 generations</p>
            )}
            {isLoggedIn && subscription?.status !== 'active' && (
              <p>Subscribe for unlimited generations</p>
            )}
            {isLoggedIn && subscription?.status !== 'active' && remainingGenerations <= 5 && (
              <p className="text-amber-600">Note: You're running low on generations. Consider subscribing for unlimited access.</p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </form>

      {generatedLetter && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Cover Letter</h3>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="relative"
              >
                {isCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  'Copy to Clipboard'
                )}
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
              {generatedLetter}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 
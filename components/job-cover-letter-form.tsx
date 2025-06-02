'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const FREE_GENERATION_KEY = 'has_free_generation';

export default function JobCoverLetterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasFreeGeneration, setHasFreeGeneration] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    jobRequirements: '',
    emphasis: ''
  });

  useEffect(() => {
    // 从 localStorage 读取免费生成状态
    const storedFreeGeneration = localStorage.getItem(FREE_GENERATION_KEY);
    if (storedFreeGeneration === 'false') {
      setHasFreeGeneration(false);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 如果用户未登录且已经使用过免费生成机会，则跳转到登录页面
    if (!isLoggedIn && !hasFreeGeneration) {
      router.push('/signin');
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
          isFreeGeneration: !isLoggedIn && hasFreeGeneration
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter');
      }

      setGeneratedLetter(data.coverLetter);
      
      // 如果是未登录用户，标记已使用免费生成机会并保存到 localStorage
      if (!isLoggedIn && hasFreeGeneration) {
        setHasFreeGeneration(false);
        localStorage.setItem(FREE_GENERATION_KEY, 'false');
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

        {isLoggedIn ? (
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
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
        ) : hasFreeGeneration ? (
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Free Cover Letter'
              )}
            </Button>
            <p className="text-sm text-gray-500 text-center">
              You have 1 free generation. Sign in to generate unlimited cover letters.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Button 
              type="button" 
              className="w-full" 
              onClick={() => router.push('/signin')}
            >
              Sign in to Generate More
            </Button>
            <p className="text-sm text-gray-500 text-center">
              You've used your free generation. Sign in to generate more cover letters.
            </p>
          </div>
        )}

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
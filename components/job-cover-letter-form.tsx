'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';

import { Loader2, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';

export default function JobCoverLetterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    jobRequirements: '',
    emphasis: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter');
      }

      setGeneratedLetter(data.coverLetter);
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
    setTimeout(() => setIsCopied(false), 2000); // 2秒后重置状态
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Cover Letter'
          )}
        </Button>

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
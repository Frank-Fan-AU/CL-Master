
import JobCoverLetterForm from '@/components/job-cover-letter-form';
import { Metadata } from 'next';
import Link from 'next/link';
// import { JobCoverLetterForm } from '@/components/job-cover-letter-form';

export const metadata: Metadata = {
  title: 'Job Cover Letter - CL-Master',
  description: 'Create professional job cover letters'
};

export default function JobCoverLetterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Job Cover Letter Generator</h1>
        <p className="text-gray-900 mb-8">
          If you want to use your own profile which is more personalized, please sign in and go to <Link href="/profile" className="text-blue-500 hover:text-blue-600">Profile</Link> to upload your resume.
        </p>
      <JobCoverLetterForm/>
      </div>
    </div>
  );
} 
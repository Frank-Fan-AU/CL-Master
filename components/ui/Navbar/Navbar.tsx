import { createClient } from '@/utils/supabase/server';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';
import Link from 'next/link';
import { CircleIcon } from 'lucide-react';

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <CircleIcon className="h-6 w-6 text-orange-500" />
                <span className="ml-2 text-xl font-semibold text-gray-900">CL-Master</span>
              </Link>
              <nav className="flex space-x-6">
                <Link 
                  href="/job-cover-letter" 
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Job Cover Letter
                </Link>
                <Link 
                  href="/rent-coverletter" 
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Rent Cover Letter
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
            <div className="max-w-6xl px-6 mx-auto">
        <Navlinks user={user} />
      </div>
            </div>
          </div>
      {/* <div className="max-w-6xl px-6 mx-auto">
        <Navlinks user={user} />
      </div> */}
    </nav>
  );
}

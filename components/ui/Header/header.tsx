import { CircleIcon } from "lucide-react";
import Link from "next/link";

export function Header() {  
    return (
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <CircleIcon className="h-6 w-6 text-orange-500" />
                <span className="ml-2 text-xl font-semibold text-gray-900">CL-Master</span>
              </Link>
              <nav className="flex space-x-6">
                <Link 
                  href="/job-coverletter" 
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
              
            </div>
          </div>
        </header>
      );
}
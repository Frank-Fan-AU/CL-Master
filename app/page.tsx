import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-300 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Let AI Craft Your Perfect Cover Letter
            </h1>
            <p className="text-xl mb-8">
              Just paste the company information, and AI will generate a personalized cover letter that highlights your strengths and increases your chances of success
            </p>
            <Link 
              href="/job-cover-letter" 
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="text-orange-500 text-2xl mb-4">⚡️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Lightning Fast</h3>
              <p className="text-gray-600">Generate professional cover letters in seconds based on your background and company information</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="text-orange-500 text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Personalized</h3>
              <p className="text-gray-600">Highlight your tech stack and project experience to make each cover letter unique</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="text-orange-500 text-2xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Template Management</h3>
              <p className="text-gray-600">Save your personal information and preferences for quick cover letter generation</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Upload Your Profile</h3>
                <p className="text-gray-600">Fill in your education, work experience, and skills</p>
              </div>
            </div>
            <div className="flex items-center mb-8">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Paste Company Info</h3>
                <p className="text-gray-600">Copy the job description and requirements from your target company</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Get Your Cover Letter</h3>
                <p className="text-gray-600">AI generates a tailored cover letter highlighting your strengths</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Job Search?</h2>
          <p className="text-xl mb-8">Sign up now and start generating AI-powered cover letters</p>
          <Link 
            href="/signin" 
            className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
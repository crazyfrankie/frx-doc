import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">frx</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
              Convenient Go coding encapsulation libraries
            </p>
            <p className="text-lg mb-10 max-w-3xl mx-auto text-gray-600">
              This project provides Go-related encapsulations including non-business 
              logic code for large-scale project development, transport frameworks 
              for standard libraries, and third-party toolkits.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/docs" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <a 
                href="https://github.com/crazyfrankie/frx" 
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Categories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Non-Business Logic Code</h3>
              <p className="text-gray-600 mb-4">
                Encapsulation for large-scale project development
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• HTTP middleware (ctxcache)</li>
                <li>• Error code management (errorx)</li>
                <li>• Logging functionality (logs)</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">Framework Wrappers</h3>
              <p className="text-gray-600 mb-4">
                Wrappers for frameworks and standard libraries
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• HTTP client/server wrappers (httpx)</li>
                <li>• Enhanced standard library interfaces</li>
                <li>• Framework integrations</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-600">Third-Party Toolkits</h3>
              <p className="text-gray-600 mb-4">
                Useful third-party tools and utilities
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Distributed ID generation (idgen)</li>
                <li>• JSON processing utilities (iox)</li>
                <li>• Language extensions (lang)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
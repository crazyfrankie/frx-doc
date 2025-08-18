import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main title */}
            <div className="mb-8">
              <h1 className="text-6xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                frx
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Modern Go libraries for scalable applications
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                href="/docs"
                className="group bg-black text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105 transform flex items-center justify-center"
              >
                Get Started
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <a
                href="https://github.com/crazyfrankie/frx"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:bg-gray-200 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              <div className="group p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  High Performance
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Optimized Go libraries designed for high-concurrency scenarios
                </p>
              </div>

              <div className="group p-10 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Modular Design
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Use what you need with lightweight, modular architecture
                </p>
              </div>

              <div className="group p-10 rounded-3xl bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Production Ready
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Battle-tested enterprise-grade solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick start section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Start</h2>
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl mx-auto">
            <code className="text-green-400 text-lg font-mono">
              go get github.com/crazyfrankie/frx
            </code>
          </div>
          <p className="text-gray-600 mt-6">
            One command to start your modern Go development journey
          </p>
        </div>
      </div>
    </div>
  );
}

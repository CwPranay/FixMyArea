import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center px-4 [font-family:var(--font-poppins)]">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <h1 className="text-[150px] md:text-[200px] font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent leading-none">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"></div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved or deleted.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <svg
            className="w-64 h-64 mx-auto opacity-50"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" fill="#E0F2FE" />
            <path
              d="M70 90C70 85.5817 73.5817 82 78 82C82.4183 82 86 85.5817 86 90C86 94.4183 82.4183 98 78 98C73.5817 98 70 94.4183 70 90Z"
              fill="#3B82F6"
            />
            <path
              d="M114 90C114 85.5817 117.582 82 122 82C126.418 82 130 85.5817 130 90C130 94.4183 126.418 98 122 98C117.582 98 114 94.4183 114 90Z"
              fill="#3B82F6"
            />
            <path
              d="M70 120C70 120 80 110 100 110C120 110 130 120 130 120"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

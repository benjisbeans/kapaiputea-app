"use client";

import Link from "next/link";

export default function AuthError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Login trouble
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t sign you in right now. Check your connection and try
          again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

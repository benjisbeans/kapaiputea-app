"use client";

import Link from "next/link";

export default function PlatformError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">😅</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Oops, something broke
        </h2>
        <p className="text-gray-600 mb-6">
          This page hit an error, but your XP and progress are safe. Try
          refreshing or head back to the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

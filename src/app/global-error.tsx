"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            Ka Pai Pūtea hit an unexpected error. Don&apos;t worry — your
            progress is saved.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

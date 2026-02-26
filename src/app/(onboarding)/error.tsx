"use client";

export default function OnboardingError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Quiz hit a snag
        </h2>
        <p className="text-gray-600 mb-6">
          Something went wrong with the quiz. Your answers haven&apos;t been
          lost — give it another go.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

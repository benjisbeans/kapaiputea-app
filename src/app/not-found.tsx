import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Page not found
        </h2>
        <p className="text-gray-600 mb-6">
          This page doesn&apos;t exist. Maybe the URL is wrong, or this content
          was moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

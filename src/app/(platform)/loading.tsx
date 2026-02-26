export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6">
      {/* Hero skeleton */}
      <div className="h-40 rounded-3xl bg-gray-100" />
      {/* Cards */}
      <div className="h-20 rounded-3xl bg-gray-100" />
      <div className="h-28 rounded-3xl bg-gray-100" />
      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-24 rounded-3xl bg-gray-100" />
        <div className="h-24 rounded-3xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <span className="text-3xl font-bold tracking-tight">
          <span className="text-kpp-dark">Ka Pai</span>{" "}
          <span className="text-kpp-purple">Putea</span>
        </span>
        <span className="ml-2 text-2xl">💰</span>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

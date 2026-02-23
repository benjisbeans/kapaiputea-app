export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-kpp-yellow px-4">
      <div className="mb-8 text-center">
        <span className="text-4xl font-black tracking-tight text-kpp-dark">
          Ka Pai Pūtea
        </span>
        <span className="ml-2 text-3xl">💰</span>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

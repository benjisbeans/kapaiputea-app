import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Free",
  description:
    "Create your free Ka Pai Pūtea account and start your financial literacy journey. Gamified money skills for NZ students.",
  alternates: { canonical: "/signup" },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Ka Pai Pūtea collects, uses, and protects student data. Compliant with the NZ Privacy Act 2020.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        &larr; Back to home
      </Link>

      <h1 className="mb-8 text-3xl font-black text-gray-900">
        Privacy Policy
      </h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <p className="text-sm text-gray-500">
          Last updated: February 2026
        </p>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            Who we are
          </h2>
          <p>
            Ka Pai Pūtea is a financial literacy education platform built for
            New Zealand secondary school students. This policy explains how we
            collect, use, and protect your personal information in accordance
            with the New Zealand Privacy Act 2020.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            What we collect
          </h2>
          <p>When you sign up and use Ka Pai Pūtea, we collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Account info:</strong> display name, email address, and
              password (hashed, we never see your password)
            </li>
            <li>
              <strong>Quiz answers:</strong> year group, gender, career
              direction, financial confidence, and goals &mdash; used to
              personalise your learning path
            </li>
            <li>
              <strong>Learning progress:</strong> which modules and lessons
              you&apos;ve completed, XP earned, streaks, and badges
            </li>
            <li>
              <strong>School info:</strong> school name and class code (if
              provided by your teacher)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            How we use it
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To personalise your learning experience and recommend modules</li>
            <li>To track your progress, streaks, and achievements</li>
            <li>To power leaderboards (display name and XP only)</li>
            <li>To help teachers see how their class is progressing</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your data to anyone. We do{" "}
            <strong>not</strong> use your data for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            Where we store it
          </h2>
          <p>
            Your data is stored securely using{" "}
            <strong>Supabase</strong> (hosted on AWS). Our application is
            deployed on <strong>Vercel</strong> in the Sydney (Australia)
            region, keeping your data close to New Zealand.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            Students under 16
          </h2>
          <p>
            If you are under 16, your school or teacher must consent to your
            use of Ka Pai Pūtea. We do not knowingly collect personal
            information from students under 16 without school or
            parental/caregiver consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            Your rights
          </h2>
          <p>Under the NZ Privacy Act 2020, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Ask us to correct any inaccurate information</li>
            <li>
              Request deletion of your account and all associated data
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            Data retention
          </h2>
          <p>
            We keep your data for as long as your account is active. If you
            delete your account, all your personal data is permanently removed
            within 30 days. Anonymous, aggregated usage statistics may be
            retained for improving the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            Contact
          </h2>
          <p>
            If you have questions about this privacy policy or want to make a
            request about your data, email us at:{" "}
            <strong>benji@icthub.ai</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

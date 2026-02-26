import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Ka Pai Pūtea, a free financial literacy platform for NZ secondary school students.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        &larr; Back to home
      </Link>

      <h1 className="mb-8 text-3xl font-black text-gray-900">
        Terms of Service
      </h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <p className="text-sm text-gray-500">Last updated: February 2026</p>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            1. About Ka Pai Pūtea
          </h2>
          <p>
            Ka Pai Pūtea is a free financial literacy education platform for
            New Zealand secondary school students. By creating an account or
            using the platform, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            2. Who can use it
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Ka Pai Pūtea is designed for NZ secondary school students (Years
              10&ndash;13) and their teachers.
            </li>
            <li>
              If you are under 16, your school or parent/caregiver must consent
              to your use of the platform.
            </li>
            <li>
              You must provide a valid email address and choose a display name
              that is appropriate for a school environment.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            3. Your account
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              You are responsible for keeping your password secure. Do not share
              your login details with others.
            </li>
            <li>
              Your display name appears on leaderboards and is visible to other
              users. Choose something appropriate &mdash; offensive names will be
              removed.
            </li>
            <li>
              You can delete your account at any time from the Settings page.
              This permanently removes all your data within 30 days.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            4. Acceptable use
          </h2>
          <p>When using Ka Pai Pūtea, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use offensive, inappropriate, or misleading display names</li>
            <li>Attempt to access other users&apos; accounts or data</li>
            <li>
              Abuse, exploit, or interfere with the platform&apos;s functionality
            </li>
            <li>Use automated tools or bots to interact with the platform</li>
          </ul>
          <p>
            We reserve the right to suspend or delete accounts that violate
            these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            5. Educational content
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Ka Pai Pūtea provides general financial education. It is{" "}
              <strong>not</strong> personalised financial advice.
            </li>
            <li>
              Simulated activities (e.g. the stock market game) use fictional
              money and do not involve real transactions.
            </li>
            <li>
              We make every effort to keep content accurate and up to date, but
              we do not guarantee that all information is error-free.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            6. Privacy
          </h2>
          <p>
            Your privacy matters to us. Please read our{" "}
            <Link
              href="/privacy"
              className="font-medium text-kpp-dark underline hover:no-underline"
            >
              Privacy Policy
            </Link>{" "}
            for details on how we collect, use, and protect your data. We comply
            with the New Zealand Privacy Act 2020.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            7. Availability
          </h2>
          <p>
            We aim to keep Ka Pai Pūtea available at all times, but we do not
            guarantee uninterrupted access. We may update, modify, or
            temporarily take the platform offline for maintenance without
            notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            8. Limitation of liability
          </h2>
          <p>
            Ka Pai Pūtea is provided &ldquo;as is&rdquo; without warranties of
            any kind. To the maximum extent permitted by NZ law, we are not
            liable for any loss or damage arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            9. Changes to these terms
          </h2>
          <p>
            We may update these terms from time to time. If we make significant
            changes, we will notify users through the platform. Continued use
            after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            10. Governing law
          </h2>
          <p>
            These terms are governed by the laws of New Zealand. Any disputes
            will be subject to the jurisdiction of the New Zealand courts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Contact</h2>
          <p>
            Questions about these terms? Email us at:{" "}
            <strong>benji@icthub.ai</strong>
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/privacy"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}

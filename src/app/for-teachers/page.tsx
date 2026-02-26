import Link from "next/link";

export const metadata = {
  title: "For Teachers",
  description:
    "Set up Ka Pai Pūtea for your classroom in minutes. Free financial literacy platform for NZ secondary school students — quick-start guide for teachers.",
  alternates: { canonical: "/for-teachers" },
};

const steps = [
  {
    number: "1",
    title: "Create your own account",
    description:
      "Sign up at kapaiputea.com/signup with your school email. Complete the onboarding quiz yourself so you know what students will experience.",
  },
  {
    number: "2",
    title: "Get students to sign up",
    description:
      "Students need an email address and a password. They will complete a short quiz that personalises their learning path based on their career direction and goals.",
  },
  {
    number: "3",
    title: "Students complete modules",
    description:
      "The platform recommends modules based on each student's stream (uni, trades, workforce, military, or unsure). Students earn XP and badges as they go.",
  },
  {
    number: "4",
    title: "Track progress via the leaderboard",
    description:
      "The leaderboard shows student rankings by XP. Students can filter by school and class code to see how their class is doing.",
  },
];

const faqs = [
  {
    question: "How long does a module take?",
    answer:
      "Most modules take 10\u201320 minutes. Each module contains 3\u20135 lessons with interactive activities like quizzes, drag-and-drop, and sliders.",
  },
  {
    question: "What topics are covered?",
    answer:
      "Budgeting, saving, investing, KiwiSaver, tax, debt, insurance, and more. Modules are tailored to each student's career path.",
  },
  {
    question: "Is it free?",
    answer: "Yes. Ka Pai P\u016btea is free for all NZ schools and students.",
  },
  {
    question: "What data do you collect from students?",
    answer:
      "Display name, email, quiz answers (year group, gender, goals), and learning progress. We do not sell data or use it for advertising. See our privacy policy for details.",
  },
  {
    question: "Can I see my students' progress?",
    answer:
      "Students appear on the leaderboard by display name. A dedicated teacher dashboard is coming soon.",
  },
  {
    question: "Do students need email confirmation?",
    answer:
      "This depends on your setup. For classroom use, we recommend the school admin contacts us to disable email confirmation so all 30 students can sign up at once without issues.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function ForTeachersPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        &larr; Back to home
      </Link>

      <h1 className="mb-2 text-3xl font-black text-gray-900">
        Setting up Ka Pai Pūtea for your class
      </h1>
      <p className="mb-12 text-gray-500">
        A quick-start guide for NZ secondary school teachers.
      </p>

      {/* Steps */}
      <div className="space-y-8 mb-16">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kpp-yellow font-black text-sm text-kpp-dark">
              {step.number}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{step.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <h2 className="mb-6 text-2xl font-black text-gray-900">
        Common questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="font-bold text-gray-900">{faq.question}</h3>
            <p className="mt-1 text-sm text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-kpp-yellow/20 p-6 text-center">
        <p className="mb-4 font-bold text-gray-900">
          Ready to get your class started?
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-kpp-dark px-6 py-3 font-bold text-white transition-all hover:bg-gray-800"
        >
          Create your account
        </Link>
      </div>

      <div className="mt-8 text-center">
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

import BackButton from "@/components/BackButton";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I update my profile information?",
      answer:
        "Navigate to Settings → Profile Information and save your changes.",
    },
    {
      question: "How do I manage my availability?",
      answer:
        "Go to Settings → Availability to update your working hours.",
    },
    {
      question: "How do I cancel an appointment?",
      answer:
        "Open Appointments, select the appointment, and click Cancel.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Go to Settings → Security and choose Change Password.",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <BackButton/>
      <div>
        <h1 className="text-3xl font-extrabold text-on-surface">
          Help Center
        </h1>
        <p className="mt-2 text-on-surface-variant">
          Find answers, guides, and support resources.
        </p>
      </div>
    
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <button className="p-6 rounded-2xl bg-primary text-on-primary text-left">
          <span className="material-symbols-outlined text-3xl mb-3">
            support_agent
          </span>
          <h3 className="font-bold">Contact Support</h3>
          <p className="text-sm opacity-80 mt-1">
            Reach out to our support team.
          </p>
        </button>

        <button className="p-6 rounded-2xl bg-surface-container-low">
          <span className="material-symbols-outlined text-3xl mb-3">
            chat
          </span>
          <h3 className="font-bold">Live Chat</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Chat with an available agent.
          </p>
        </button>

        <button className="p-6 rounded-2xl bg-surface-container-low">
          <span className="material-symbols-outlined text-3xl mb-3">
            description
          </span>
          <h3 className="font-bold">Documentation</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Browse platform guides.
          </p>
        </button>
      </div>

      {/* FAQ */}
      <div className="rounded-3xl bg-surface-container-low p-6">
        <h2 className="text-xl font-bold mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="p-4 rounded-2xl bg-surface-container-lowest"
            >
              <h3 className="font-semibold">
                {faq.question}
              </h3>

              <p className="text-sm text-on-surface-variant mt-2">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="rounded-3xl bg-surface-container-low p-6">
        <h2 className="text-xl font-bold mb-6">
          Resources
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <button className="p-4 rounded-2xl bg-surface-container-lowest text-left">
            <h3 className="font-semibold">
              Appointment Management Guide
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Learn how to manage patient appointments.
            </p>
          </button>

          <button className="p-4 rounded-2xl bg-surface-container-lowest text-left">
            <h3 className="font-semibold">
              Security & Privacy
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Protect your account and patient data.
            </p>
          </button>

          <button className="p-4 rounded-2xl bg-surface-container-lowest text-left">
            <h3 className="font-semibold">
              Verification Requirements
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Learn about medical credential verification.
            </p>
          </button>

          <button className="p-4 rounded-2xl bg-surface-container-lowest text-left">
            <h3 className="font-semibold">
              Platform Policies
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Read the latest platform policies and guidelines.
            </p>
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-3xl bg-surface-container-low p-6">
        <h2 className="text-xl font-bold mb-4">
          Support Information
        </h2>

        <div className="space-y-2 text-on-surface-variant">
          <p>📧 support@maou3idy.com</p>
          <p>📞 +212 6 12 34 56 78</p>
          <p>🕒 Monday - Friday, 09:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
}
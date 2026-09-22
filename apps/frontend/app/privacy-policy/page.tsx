import BackButton from "@/components/BackButton";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#16181C]">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10">
        <BackButton />

        <main className="mt-8">
          <div className="bg-white rounded-[40px] border border-[#E4E1D8] p-8 sm:p-12 lg:p-16">
            {/* Header */}
            <div className="border-b border-[#E4E1D8] pb-10 mb-10">
              <p className="text-sm uppercase tracking-[0.18em] text-[#63666D] mb-4">
                Legal
              </p>

              <h1 className="font-manrope text-4xl sm:text-5xl font-semibold tracking-tight">
                Privacy Policy
              </h1>

              <p className="mt-4 text-[#63666D]">
                Last Updated: June 29, 2026
              </p>
            </div>

            {/* Content */}
            <div className="space-y-12">
              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  1. Introduction
                </h2>

                <p className="text-[#63666D] leading-8">
                  Welcome to Maou3idy. We respect your privacy and are committed
                  to protecting your personal information. This Privacy Policy
                  explains how we collect, use, and safeguard your information.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  2. Information We Collect
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Full Name",
                    "Email Address",
                    "Phone Number",
                    "Account Credentials",
                    "Doctor Verification Documents",
                    "Appointment Information",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#E4E1D8] p-4 bg-[#FAF9F5]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  3. How We Use Your Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Create and manage accounts",
                    "Verify healthcare professionals",
                    "Schedule appointments",
                    "Improve platform performance",
                    "Maintain platform security",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#E4E1D8] p-4 bg-[#FAF9F5]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  4. Data Protection
                </h2>

                <p className="text-[#63666D] leading-8">
                  We implement reasonable technical and organizational measures
                  to protect your personal information from unauthorized access
                  or disclosure.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  5. Sharing Information
                </h2>

                <p className="text-[#63666D] leading-8">
                  We do not sell personal information. Information may be shared
                  only when required for appointment services, legal
                  obligations, or platform security.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  6. Cookies
                </h2>

                <p className="text-[#63666D] leading-8">
                  We may use cookies to maintain user sessions, remember
                  preferences, and improve platform functionality.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  7. Your Rights
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Access your personal data",
                    "Request corrections",
                    "Request account deletion",
                    "Ask how your information is used",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#E4E1D8] p-4 bg-[#FAF9F5]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  8. Contact Us
                </h2>

                <div className="rounded-2xl border border-[#E4E1D8] bg-[#FAF9F5] p-6">
                  <p className="text-[#63666D] mb-2">
                    For privacy-related questions:
                  </p>

                  <a
                    href="mailto:support@maou3idy.com"
                    className="text-[#33437A] font-medium hover:underline"
                  >
                    support@maou3idy.com
                  </a>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
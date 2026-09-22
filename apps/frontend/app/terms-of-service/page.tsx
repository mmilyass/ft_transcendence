import BackButton from "@/components/BackButton";

export default function TermsOfService() {
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
                Terms of Service
              </h1>

              <p className="mt-4 text-[#63666D]">
                Last Updated: June 29, 2026
              </p>
            </div>

            {/* Content */}
            <div className="space-y-12">
              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  1. Acceptance of Terms
                </h2>

                <p className="text-[#63666D] leading-8">
                  By accessing or using Maou3idy, you agree to comply with these
                  Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  2. Services Provided
                </h2>

                <p className="text-[#63666D] leading-8">
                  Maou3idy provides an online platform that enables patients to
                  search for healthcare professionals and schedule appointments.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  3. User Accounts
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Provide accurate information",
                    "Maintain account security",
                    "Protect login credentials",
                    "Update account information when necessary",
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
                  4. Doctor Verification
                </h2>

                <p className="text-[#63666D] leading-8">
                  Healthcare professionals must provide valid credentials and
                  verification documents. False information may result in
                  account suspension.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  5. Appointment Bookings
                </h2>

                <p className="text-[#63666D] leading-8">
                  Users are responsible for providing accurate appointment
                  information and attending scheduled appointments.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  6. Prohibited Activities
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Using the platform unlawfully",
                    "Impersonating another person",
                    "Submitting false credentials",
                    "Attempting unauthorized access",
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
                  7. Intellectual Property
                </h2>

                <p className="text-[#63666D] leading-8">
                  All platform content, branding, and software are owned by
                  Maou3idy and protected by applicable intellectual property
                  laws.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  8. Limitation of Liability
                </h2>

                <p className="text-[#63666D] leading-8">
                  Maou3idy does not provide medical advice and is not
                  responsible for medical outcomes resulting from healthcare
                  services.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  9. Account Suspension
                </h2>

                <p className="text-[#63666D] leading-8">
                  We reserve the right to suspend or terminate accounts that
                  violate these terms.
                </p>
              </section>

              <section>
                <h2 className="font-manrope text-2xl mb-4">
                  10. Contact Information
                </h2>

                <div className="rounded-2xl border border-[#E4E1D8] bg-[#FAF9F5] p-6">
                  <p className="text-[#63666D] mb-2">
                    For questions regarding these terms:
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
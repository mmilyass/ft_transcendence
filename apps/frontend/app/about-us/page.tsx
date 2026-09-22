"use client";

import Navbar from "@/components/Navbar";

const values = [
  {
    label: "Trust",
    accent: "indigo",
    title: "Verified providers you can rely on",
    body: "Every specialist on the platform is credentialed and re-checked, so the person you book is exactly who they say they are.",
  },
  {
    label: "Access",
    accent: "brass",
    title: "Care within reach, wherever you are",
    body: "Appointments, records, and follow-ups live in one place, so getting care doesn't depend on where you happen to live.",
  },
  {
    label: "Transparency",
    accent: "indigo",
    title: "Clear information, no surprises",
    body: "Availability, pricing, and provider background are shown up front — never buried behind a call or a form.",
  },
  {
    label: "Compassion",
    accent: "brass",
    title: "Every patient treated with dignity",
    body: "The platform is built around the person seeking care first, and the paperwork second.",
  },
  {
    label: "Privacy",
    accent: "indigo",
    title: "Your health data stays yours",
    body: "Records are encrypted end to end and never shared or sold without explicit, revocable consent.",
  },
  {
    label: "Quality",
    accent: "brass",
    title: "Only credentialed specialists, vetted rigorously",
    body: "Providers are reviewed against licensing, outcomes, and patient feedback before they ever appear in a search.",
  },
];

export default function AboutUs() {
  return (
    <div className="bg-surface text-on-surface">
      <Navbar activeLink="about" />

      <div className="bg-[#FAF9F5] text-[#16181C] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col gap-16">
          {/* Hero */}
          <section className="pt-24">
            <div className="bg-white rounded-[40px] p-10 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="font-manrope text-sm uppercase tracking-[0.2em] text-[#33437A]">
                    Who we are
                  </p>

                  <h1 className="font-manrope text-4xl sm:text-5xl lg:text-6xl leading-tight mt-6">
                    We're building a more direct path between patients and the
                    care they can trust.
                  </h1>
                </div>

                <div>
                  <p className="text-lg text-[#63666D] leading-relaxed">
                    Maou3idy connects patients with top-rated doctors and
                    specialists across every field of medicine, so finding and
                    booking the right care is as simple as it should have always
                    been.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How we're different */}
          <section>
            <div className="bg-white rounded-[40px] p-10 lg:p-16">
              <div className="mb-14">
                <h2 className="font-manrope text-3xl sm:text-4xl">
                  How we're different
                </h2>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {values.map((v) => (
                  <div
                    key={v.label}
                    className="
                      border border-[#E4E1D8]
                      rounded-[28px]
                      p-8
                      min-h-[260px]
                      hover:-translate-y-1
                      hover:shadow-xl
                      transition-all
                      duration-300
                      bg-[#FAF9F5]
                    "
                  >
                    <div
                      className={`w-12 h-1 rounded-full mb-6 ${
                        v.accent === "indigo"
                          ? "bg-[#33437A]"
                          : "bg-[#8C6A3B]"
                      }`}
                    />

                    <p className="text-xs uppercase tracking-[0.18em] text-[#63666D] mb-4">
                      {v.label}
                    </p>

                    <h3 className="font-semibold text-xl mb-4">
                      {v.title}
                    </h3>

                    <p className="text-[#63666D] leading-relaxed">
                      {v.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission */}
          <section>
            <div className="bg-white rounded-[40px] p-10 lg:p-16">
              <div className="max-w-5xl">
                <p className="text-sm uppercase tracking-[0.18em] text-[#63666D] mb-6">
                  Our mission
                </p>

                <h2 className="font-manrope text-3xl sm:text-4xl leading-[1.4]">
                  To improve healthcare accessibility and quality by connecting
                  patients with qualified professionals — making the process of
                  finding and booking care seamless, transparent, and human.
                </h2>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
<section className="py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Seamless Healthcare Journey</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto mb-8">
                Skip the waiting room. Our streamlined process connects you with experts in three simple steps.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 lg:grid-cols-3 gap-8 sm:gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-primary/10 -z-10"></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-8 border border-outline-variant/30 transition-all group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-lg group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-3xl">person_search</span>
                </div>
                <div className="bg-primary-fixed text-on-primary-fixed text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mb-4">1</div>
                <h3 className="text-xl font-bold mb-3">Find Doctor</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Search by name, specialty, or hospital to find the perfect medical match for your needs.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-8 border border-outline-variant/30 transition-all group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-lg group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-3xl">event_available</span>
                </div>
                <div className="bg-primary-fixed text-on-primary-fixed text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mb-4">2</div>
                <h3 className="text-xl font-bold mb-3">Choose Time</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  View real-time availability and select a slot that fits perfectly into your busy schedule.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-8 border border-outline-variant/30 transition-all group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-lg group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <div className="bg-primary-fixed text-on-primary-fixed text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mb-4">3</div>
                <h3 className="text-xl font-bold mb-3">Book Appointment</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Confirm your booking instantly and receive automated reminders via email or SMS.
                </p>
              </div>
            </div>
          </div>
        </section> 
);
}
import { DoctorDetailResponse } from '@/types/types';

type Props = {
  services: DoctorDetailResponse['services'];
};

export default function DoctorServices({ services }: Props) {
    return (
        <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-headline font-bold text-on-surface">
                  Services &amp; Procedures
                </h3>
                <span className="text-sm font-medium text-primary">
                  Insurance Accepted
                </span>
              </div>
              <div className="grid gap-3">
                {services.map((service) => (
                  <div key={service.id} className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group hover:bg-surface-bright transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">{service.icon}</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-on-surface">{service.name}</h5>
                        <p className="text-xs text-on-surface-variant">{service.description}</p>
                      </div>
                    </div>
                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                      <span className="font-headline font-extrabold text-lg">${service.price}</span>
                      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                        Out of pocket
                      </span>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <p className="text-sm text-on-surface-variant">
                    No services available for this doctor.
                  </p>
                )}
              </div>
            </section>
    );
}

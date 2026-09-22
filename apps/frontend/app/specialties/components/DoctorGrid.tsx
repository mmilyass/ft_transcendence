import DoctorCard from './DoctorCard';
import { Doctor } from '@/types/doctor';

interface DoctorGridProps {
  doctors: Doctor[];
}

export default function DoctorGrid({
  doctors,
}: DoctorGridProps) {
  if (doctors.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-bold text-on-surface">
          No doctors found
        </h3>

        <p className="text-on-surface-variant mt-2">
          Try changing your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
      <DoctorCard
        key={doctor.id}
        {...doctor}
      />
      ))}
    </div>
  );
}
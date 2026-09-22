import { DoctorDetailResponse } from "@/types/types";

type Props = {
  doctor: DoctorDetailResponse['doctor'];
  publications?: number;
};

export default function DoctorAbout({ doctor, publications }: Props) {
    return (
        <section>
              <h3 className="text-2xl font-headline font-bold mb-6 text-on-surface">
                About Dr. {doctor.user.name}
              </h3>
              <div className="bg-surface-container-lowest p-8 rounded-3xl leading-relaxed text-on-surface-variant">
                {doctor.bio ? (
                  <p className="mb-4">{doctor.bio}</p>
                ) : (
                  <p className="mb-4 text-outline">No biography available.</p>
                )}
                {publications != null && publications > 0 && (
                  <p>
                    Having published over {publications} peer-reviewed articles, Dr. {doctor.user.name} remains at the forefront of medical innovation.
                  </p>
                )}
              </div>
            </section>
    );
}

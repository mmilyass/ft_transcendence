import { DoctorLocation } from '@/types';
import Link from 'next/link';

type Props = {
  locations: DoctorLocation[];
};

export default function DoctorLocations({ locations }: Props) {
  return (
    <section>
      <h3 className="text-2xl font-headline font-bold mb-6 text-on-surface">
        Available Locations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((location, index) => {
          const query = encodeURIComponent(`${location.address}, ${location.city}, ${location.state}`);
          const mapSrc = location.latitude && location.longitude
            ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`
            : `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
          const mapsHref = location.latitude && location.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${query}`;

          return (
            <div key={location.id ?? index} className="bg-surface-container-low p-6 rounded-3xl">
              <div className="aspect-video rounded-2xl mb-4 overflow-hidden border border-slate-200">
                <iframe
                  title={location.address}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="w-full h-full"
                  src={mapSrc}
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h6 className="font-bold text-on-surface">
                  {location.city}, {location.state}
                </h6>
                {location.isPrimary && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Primary</span>
                )}
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                {location.address}, {location.zip_code}, {location.country}
              </p>
              <Link
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">directions</span>
                Get Directions
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
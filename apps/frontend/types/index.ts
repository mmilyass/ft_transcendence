import { Doctor, DoctorLocation } from './types';

export type { Doctor, DoctorLocation };

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  insuranceAccepted: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  mapImageUrl: string;
  isActive: boolean;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  locationId: string;
}

export interface AvailabilitySlot {
  date: string;
  dayOfWeek: string;
  slots: TimeSlot[];
}

// Matches what GET /doctor/:id actually returns for each review (nested
// under `user`, not flat name/image — the reviewer has no profile image at
// all in this schema, only doctors do).
export interface Review {
  id: string;
  doctorId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface DoctorDetailResponse {
  doctor: Doctor;
  location: Location;
  availability: AvailabilitySlot[];
  reviews: Review[];
  services: Service[];
  publications: number;
}

export interface LandingPageStats {
  totalDoctors: number;
  totalPatients: number;
  totalSpecializedClinicians: number;
}

export interface LandingPageData {
  featuredDoctors: Doctor[];
  stats: LandingPageStats;
  specialties: string[];
  locations: string[];
}

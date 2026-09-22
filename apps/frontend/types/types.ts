export interface DoctorLocation {
  id?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isPrimary?: boolean;
}

export interface Doctor {
  id: string;
  user: { name: string; image: string | null };
  speciality: string;
  bio: string;
  experience: number;
  rating: number;
  reviewCount: number;
  profileImage: string;
  languages: string[];
  location: DoctorLocation[];
  verified: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  isActive: boolean;
  mapImageUrl: string;
}

export interface DoctorDetailResponse {
  doctor: Doctor;
  services: Service[];
  locations: Location[];
  availability: any[];
}
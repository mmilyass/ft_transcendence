
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

// Shape returned by GET /doctor/find (list view)
export interface Doctor {
  id: string;
  name: string;
  image?: string | null;
  speciality: string;
  experience: number;
  rating: number;
  reviewCount: number;
  location: DoctorLocation[];
}


export interface DoctorsResponse {
  doctors: Doctor[];
  total: number;
  page: number;
  totalPages: number;
}
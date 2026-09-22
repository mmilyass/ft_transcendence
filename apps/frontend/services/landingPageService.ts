'use client';

import api from './api';

export type FeaturedDoctor = {
  id: string;
  location: {
        address: string,
        city: string,
        state: string,
        zip_code: string,
        country: string,
        latitude?: number,
        longitude?: number,
  } [];
  verified: boolean;
  rating?: number;
  speciality: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string;
  };
};

export const getFeaturedDoctors = async (): Promise<FeaturedDoctor[]> => {
  try {
    const response = await api.get('/doctor/featured');

    return response.data;
  } catch (error) {
    console.error('Failed to fetch featured doctors:', error);
    return [];
  }
};

export const searchDoctors = async (
  specialty?: string,
  location?: string
): Promise<FeaturedDoctor[]> => {
  try {
    const response = await api.get('/doctor/search', {
      params: {
        specialty,
        location,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};
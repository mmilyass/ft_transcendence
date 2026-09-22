import api from './api';
import { DoctorDetailResponse, AvailabilitySlot } from '@/types';

export type SlotStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'BOOKED' | 'CANCELLED' | 'COMPLETED';

export type DoctorSlot = {
  id: number;
  doctor_id: string | null;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  status: SlotStatus;
};

type SlotRecord = {
  id: number | string;
  doctor_id?: string | null;
  doctorId?: string | null;
  date: string | Date;
  start_time?: string;
  startTime?: string;
  end_time?: string;
  endTime?: string;
  is_booked?: boolean;
  isBooked?: boolean;
  status?: string;
};

function toDateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function normalizeSlot(slot: SlotRecord): DoctorSlot {
  return {
    id: Number(slot.id),
    doctor_id: slot.doctor_id ?? slot.doctorId ?? null,
    date: toDateKey(slot.date),
    start_time: String(slot.start_time ?? slot.startTime ?? '').slice(0, 5),
    end_time: String(slot.end_time ?? slot.endTime ?? '').slice(0, 5),
    is_booked: Boolean(slot.is_booked ?? slot.isBooked),
    status: String(slot.status ?? 'AVAILABLE').toUpperCase() as SlotStatus,
  };
}

export const getDoctorDetail = async (
  doctorId: string
): Promise<DoctorDetailResponse> => {
  const [doctorResponse, slotsResponse] = await Promise.all([
    api.get(`/doctor/${doctorId}`),
    api.get(`/slots/doctor/${doctorId}`),
  ]);

  const doctor = doctorResponse.data;

  return {
    doctor,
    location: doctor.location,
    services: doctor.services ?? [],
    publications: doctor.publications ?? 0,
    reviews: doctor.reviews ?? [],
    availability: slotsResponse.data ?? [],
  };
};

export const getAvailability = async (
  doctorId: string,
  date?: string
): Promise<AvailabilitySlot[]> => {
  try {
    const response = await api.get(`/slots/doctor/${doctorId}`);
    const rawSlots: SlotRecord[] = Array.isArray(response.data) ? response.data : response.data?.slots ?? [];
    const filteredSlots: SlotRecord[] = date
      ? rawSlots.filter((slot) => toDateKey(slot.date) === date)
      : rawSlots;

    return filteredSlots.reduce<AvailabilitySlot[]>((groups, rawSlot) => {
      const slot = normalizeSlot(rawSlot);
      let dayGroup = groups.find((entry) => entry.date === slot.date);

      if (!dayGroup) {
        dayGroup = {
          date: slot.date,
          dayOfWeek: new Date(`${slot.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' }),
          slots: [],
        };
        groups.push(dayGroup);
      }

      dayGroup.slots.push({
        time: slot.start_time,
        isAvailable: !slot.is_booked && slot.status === 'AVAILABLE',
        locationId: slot.doctor_id ?? '1',
      });

      return groups;
    }, []);
  } catch (error) {
    console.warn('Failed to fetch availability:', error);
    return [];
  }
};

export const createBooking = async (data: {
  slotId: number | string;
}): Promise<{ success: boolean; slot?: DoctorSlot }> => {
  try {
    const response = await api.post(`/slots/${data.slotId}/book`);
    const slot = response.data?.slot ?? response.data;

    return {
      success: Boolean(response.data?.success ?? true),
      slot: slot ? normalizeSlot(slot) : undefined,
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return { success: false };
  }
};

export const getDoctorSlots = async (doctorId: string): Promise<DoctorSlot[]> => {
  const response = await api.get(`/slots/doctor/${doctorId}`);
  const rawSlots = Array.isArray(response.data) ? response.data : response.data?.slots ?? [];

  return rawSlots.map(normalizeSlot);
};

export const bookSlot = async (slotId: number | string) => {
  const response = await api.post(`/slots/${slotId}/book`);
  const slot = response.data?.slot ?? response.data;

  return {
    success: Boolean(response.data?.success ?? true),
    slot: slot ? normalizeSlot(slot) : undefined,
  };
};

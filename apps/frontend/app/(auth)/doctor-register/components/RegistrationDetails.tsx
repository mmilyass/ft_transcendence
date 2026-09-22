'use client';

import { useState, useEffect } from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { MOROCCO_REGIONS } from "@/lib/morocco-location";

type location = {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

type RegisterDoctorForm = {
  name: string;
  email: string;
  phone: string;
  speciality: string;
  languages: string[];
  license_number: string;
  experience: number;
  bio: string;
  location: location;
};

interface Props {
  register: UseFormRegister<RegisterDoctorForm>;
  setValue: UseFormSetValue<RegisterDoctorForm>;
  errors: FieldErrors<RegisterDoctorForm>;
}

const selectClass = 'w-full bg-surface-container-low rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-primary/20 transition-all';
const labelClass = 'text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1';

function RegistrationDetailsSection({ register, setValue, errors }: Props) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const cities = selectedRegion ? MOROCCO_REGIONS[selectedRegion as keyof typeof MOROCCO_REGIONS] : [];

  useEffect(() => {
    setValue('location.country', 'Morocco');
  }, [setValue]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            person_add
          </span>
          Registration Details
        </h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Please provide your primary clinical contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Full Name */}
        <div className="space-y-2">
          <label className={labelClass} htmlFor="name">Full Name</label>
          <input
            className={selectClass}
            id="name"
            placeholder="Dr. Jane Smith"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-600">{String(errors.name.message)}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className={labelClass} htmlFor="email">Professional Email</label>
          <input
            className={selectClass}
            id="email"
            placeholder="doctor@clinic.com"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-600">{String(errors.email.message)}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className={labelClass} htmlFor="phone">Phone Number</label>
          <input
            className={selectClass}
            id="phone"
            placeholder="+212 600 000 000"
            {...register('phone')}
          />
          {errors.phone && <p className="text-xs text-red-600">{String(errors.phone.message)}</p>}
        </div>

        {/* Location heading */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant mb-4">
            Clinic Location
          </h3>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className={labelClass} htmlFor="country">
            Country
          </label>

          <input
            id="country"
            value="Morocco"
            readOnly
            className={`${selectClass} cursor-not-allowed opacity-70`}
          />

          <input
            type="hidden"
            {...register("location.country")}
            value="Morocco"
          />

          {errors.location?.country && (
            <p className="text-xs text-red-600">
              {String(errors.location.country.message)}
            </p>
          )}
        </div>

        {/* State */}
        <div className="space-y-2">
          <label className={labelClass} htmlFor="state">State / Region</label>
          <select
            className={selectClass}
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setValue('location.state', e.target.value);
              setValue('location.city', '');
            }}
          >
            <option value="">Select Region</option>
            {Object.keys(MOROCCO_REGIONS).map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {errors.location?.state && (
            <p className="text-xs text-red-600">{String(errors.location.state.message)}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className={labelClass} htmlFor="city">City</label>
          <select
            id="city"
            className={selectClass}
            onChange={(e) => setValue('location.city', e.target.value)}
            disabled={!selectedRegion}
          >
            <option value="">{selectedRegion ? 'Select City' : 'Select a region first'}</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.location?.city && (
            <p className="text-xs text-red-600">{String(errors.location.city.message)}</p>
          )}
        </div>

        {/* Zip Code */}
        <div className="space-y-2">
          <label className={labelClass} htmlFor="zip_code">Zip Code</label>
          <input
            id="zip_code"
            placeholder="20000"
            className={selectClass}
            {...register('location.zip_code')}
          />
          {errors.location?.zip_code && (
            <p className="text-xs text-red-600">{String(errors.location.zip_code.message)}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <label className={labelClass} htmlFor="address">Address</label>
          <input
            id="address"
            placeholder="123 Boulevard Zerktouni"
            className={selectClass}
            {...register('location.address')}
          />
          {errors.location?.address && (
            <p className="text-xs text-red-600">{String(errors.location.address.message)}</p>
          )}
        </div>

        {/* Specialty */}
        <div className="space-y-2 md:col-span-2">
          <label className={labelClass} htmlFor="speciality">Specialty</label>
          <select className={selectClass} id="speciality" {...register('speciality')}>
            <option value="">Select Specialty</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="General Medicine">General Medicine</option>
          </select>
          {errors.speciality && (
            <p className="text-xs text-red-600">{String(errors.speciality.message)}</p>
          )}
        </div>

        {/* Languages */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1 block mb-3">
            Languages Spoken
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Arabic', 'French', 'English', 'Spanish', 'German', 'Italian', 'Portuguese', 'Tamazight'].map((language) => (
              <label
                key={language}
                className="flex items-center gap-2 bg-surface-container-low px-4 py-3 rounded-xl cursor-pointer hover:bg-surface-container transition-all"
              >
                <input
                  type="checkbox"
                  value={language}
                  {...register('languages')}
                  className="accent-primary"
                />
                <span className="text-sm">{language}</span>
              </label>
            ))}
          </div>
          {errors.languages && (
            <p className="text-xs text-red-600 mt-2">{String(errors.languages.message)}</p>
          )}
        </div>

      </div>
    </>
  );
}

export default RegistrationDetailsSection;

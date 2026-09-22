'use client';

import { RegisterDoctorForm } from '@/types/doctor-register';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface Props {
  register: UseFormRegister<RegisterDoctorForm>;
  errors: FieldErrors<RegisterDoctorForm>;
}

function ClinicalDetails({
  register,
  errors,
}: Props) {
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            workspace_premium
          </span>
          Clinical Details
        </h2>

        <p className="text-on-surface-variant text-sm mt-1">
          Verify your professional medical background.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1"
            htmlFor="license-number"
          >
            License Number
          </label>

          <input
            className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
            id="license-number"
            placeholder="MD-XXXX-XXXX"
            type="text"
            {...register('license_number')}
          />

          {errors.license_number && (
            <p
              className="text-xs"
              style={{ color: '#dc2626' }}
            >
              {String(errors.license_number.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1"
            htmlFor="experience"
          >
            Years of Experience
          </label>

          <input
            className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
            id="experience"
            placeholder="10"
            type="number"
            {...register('experience', {
              valueAsNumber: true,
            })}
          />

          {errors.experience && (
            <p
              className="text-xs"
              style={{ color: '#dc2626' }}
            >
              {String(errors.experience.message)}
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label
            className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1"
            htmlFor="bio"
          >
            Brief Bio
          </label>

          <textarea
            className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
            id="bio"
            placeholder="Describe your clinical focus and patient philosophy..."
            rows={3}
            {...register('bio')}
          />

          {errors.bio && (
            <p
              className="text-xs"
              style={{ color: '#dc2626' }}
            >
              {String(errors.bio.message)}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default ClinicalDetails;
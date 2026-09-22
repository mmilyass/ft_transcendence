'use client';

import React from 'react';

interface Props {
  medicalLicense: File | null;
  medicalLicenseError: string | null;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

function MedicalLicenseUpload({
  medicalLicense,
  medicalLicenseError,
  handleFileChange,
}: Props) {
  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1">
        Upload Medical License & Credentials
      </label>

      <input
        className="hidden"
        id="file-upload"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileChange}
      />

      <label
        htmlFor="file-upload"
        className={`block cursor-pointer border-2 rounded-2xl p-8 text-center transition-all ${
          medicalLicense
            ? 'border-green-500 bg-green-50'
            : 'border-dashed border-outline-variant/50 hover:bg-surface-container-low'
        }`}
      >
        <div className="flex flex-col items-center">
          <span
            className={`material-symbols-outlined text-5xl mb-3 ${
              medicalLicense
                ? 'text-green-600'
                : 'text-outline'
            }`}
          >
            {medicalLicense
              ? 'check_circle'
              : 'cloud_upload'}
          </span>

          <p className="font-bold text-on-surface">
            {medicalLicense
              ? 'Medical License Uploaded Successfully'
              : 'Click to upload or drag and drop'}
          </p>

          <p className="text-xs text-on-surface-variant mt-2">
            {medicalLicense
              ? medicalLicense.name
              : 'PDF, PNG or JPG (max. 10MB)'}
          </p>

          {medicalLicense && (
            <p className="text-green-600 text-sm font-medium mt-3">
              ✓ File is ready to be submitted
            </p>
          )}
        </div>
      </label>

      {medicalLicenseError && (
        <p className="text-xs text-red-600">
          {medicalLicenseError}
        </p>
      )}
    </div>
  );
}

export default MedicalLicenseUpload;
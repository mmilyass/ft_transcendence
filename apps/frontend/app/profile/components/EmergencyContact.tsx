'use client';

interface EmergencyContactProps {
  name?: string;
  phone?: string;
  relationship?: string;
}

export default function EmergencyContact({
  name,
  phone,
  relationship,
}: EmergencyContactProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Emergency Contact
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-on-surface-variant">
            Full Name
          </p>

          <p className="font-semibold">
            {name || 'Not provided'}
          </p>
        </div>

        <div>
          <p className="text-sm text-on-surface-variant">
            Phone Number
          </p>

          <p className="font-semibold">
            {phone || 'Not provided'}
          </p>
        </div>

        <div>
          <p className="text-sm text-on-surface-variant">
            Relationship
          </p>

          <p className="font-semibold">
            {relationship || 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  );
}
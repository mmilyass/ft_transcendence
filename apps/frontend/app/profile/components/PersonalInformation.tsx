'use client';

interface PersonalInformationProps {
  phone?: string;
  email: string;
  address?: string;
  gender?: string;
  birthDate?: string;
}

export default function PersonalInformation({
  phone,
  email,
  address,
  gender,
  birthDate,
}: PersonalInformationProps) {
  const items = [
    { label: 'Email', value: email },
    { label: 'Phone', value: phone },
    { label: 'Address', value: address },
    { label: 'Gender', value: gender },
    { label: 'Date of Birth', value: birthDate },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-sm text-on-surface-variant">
              {item.label}
            </p>

            <p className="font-semibold mt-1">
              {item.value || 'Not provided'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
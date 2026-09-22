interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="bg-surface-container-low rounded-3xl p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface">
          {title}
        </h2>

        <p className="text-sm text-on-surface-variant mt-1">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}
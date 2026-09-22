import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  showPassword: boolean;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export default function PasswordField({
  id,
  label,
  placeholder,
  showPassword,
  register,
  error,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label
        className="block text-xs font-semibold uppercase tracking-wider"
        htmlFor={id}
        style={{ color: "#191c1e" }}
      >
        {label}
      </label>

      <input
        id={id}
        placeholder={placeholder}
        autoComplete="off"
        type={showPassword ? "text" : "password"}
        {...register}
        className="w-full px-4 py-4 border-none rounded-xl outline-none font-medium"
        style={{
          backgroundColor: "#f3f3f7",
          color: "#191c1e",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 0 2px rgba(0,87,205,0.2)";
          e.currentTarget.style.backgroundColor = "#ffffff";
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.backgroundColor = "#f3f3f7";
        }}
      />

      {error && (
        <p className="text-xs" style={{ color: "#dc2626" }}>
          {error.message}
        </p>
      )}
    </div>
  );
}
'use client';

import { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface ResetForm {
  password: string;
  confirmPassword: string;
}

interface Props {
  register: UseFormRegister<ResetForm>;
  errors: FieldErrors<ResetForm>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  loading: boolean;
}

function ResetPasswordForm({
  register,
  errors,
  showPassword,
  setShowPassword,
  loading,
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <label
          className="block text-xs font-semibold uppercase tracking-wider"
          htmlFor="password"
          style={{ color: "#191c1e" }}
        >
          New Password
        </label>

        <input
          className="w-full px-4 py-4 border-none rounded-xl outline-none font-medium"
          style={{
            backgroundColor: "#f3f3f7",
            color: "#191c1e",
          }}
          id="password"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 2px rgba(0, 87, 205, 0.2)";
            e.currentTarget.style.backgroundColor =
              "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.backgroundColor =
              "#f3f3f7";
          }}
        />

        {errors.password && (
          <p
            className="text-xs"
            style={{ color: "#dc2626" }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          className="block text-xs font-semibold uppercase tracking-wider"
          htmlFor="confirmPassword"
          style={{ color: "#191c1e" }}
        >
          Confirm Password
        </label>

        <input
          className="w-full px-4 py-4 border-none rounded-xl outline-none font-medium"
          style={{
            backgroundColor: "#f3f3f7",
            color: "#191c1e",
          }}
          id="confirmPassword"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          {...register("confirmPassword")}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 2px rgba(0, 87, 205, 0.2)";
            e.currentTarget.style.backgroundColor =
              "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.backgroundColor =
              "#f3f3f7";
          }}
        />

        {errors.confirmPassword && (
          <p
            className="text-xs"
            style={{ color: "#dc2626" }}
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          className="w-4 h-4 rounded"
          style={{
            accentColor: "#0057cd",
            borderColor: "#c2c6d8",
            backgroundColor: "#f3f3f7",
          }}
          id="showPassword"
          type="checkbox"
          checked={showPassword}
          onChange={(e) =>
            setShowPassword(e.target.checked)
          }
        />

        <label
          className="ml-2 text-sm font-medium cursor-pointer select-none"
          htmlFor="showPassword"
          style={{ color: "#424655" }}
        >
          Show password
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 font-bold rounded-xl transition-all duration-200 active:scale-[0.98]"
        style={{
          backgroundColor: "#0057cd",
          color: "#ffffff",
          boxShadow:
            "0 8px 16px rgba(0, 87, 205, 0.2)",
          opacity: loading ? 0.5 : 1,
          borderRadius: "24px",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 12px 24px rgba(0, 87, 205, 0.3)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 8px 16px rgba(0, 87, 205, 0.2)")
        }
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </>
  );
}

export default ResetPasswordForm;
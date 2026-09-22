'use client';

import Link from 'next/link';

interface Props {
  isLoading: boolean;
}

function Submit({
  isLoading,
}: Props) {
  return (
    <div className="pt-4">
      <button
        className="w-full py-4 bg-linear-to-r from-primary to-primary-container text-on-primary font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Apply to Join'}

        <span className="material-symbols-outlined">
          arrow_forward
        </span>
      </button>

      <p className="text-center text-xs text-on-surface-variant mt-6">
        By applying, you agree to our{' '}
        <Link
          className="text-primary font-semibold"
          href="/terms-of-service"
        >
          Verification Terms
        </Link>{' '}
        and{' '}
        <Link
          className="text-primary font-semibold"
          href="/privacy-policy"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

export default Submit;
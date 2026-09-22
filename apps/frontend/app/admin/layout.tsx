'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../layout';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      toast.error('You must be an admin to access this page.');
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}
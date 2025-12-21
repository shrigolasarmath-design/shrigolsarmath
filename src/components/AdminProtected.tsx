'use client';

import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AdminProtected({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isLoggedIn && isMounted) {
      redirect('/login');
    }
  }, [isLoggedIn, isMounted]);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

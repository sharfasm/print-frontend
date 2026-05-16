// @ts-nocheck
"use client";
import DashboardLayoutComponent from '../../views/Dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth() as any;
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}

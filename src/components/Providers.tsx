// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { ShopProvider } from "../context/ShopContext";
import { AuthProvider } from "../context/AuthContext";
import RouteTransition from "./RouteTransition";
import AnnouncementBar from "./AnnouncementBar";
import BottomNav from "./BottomNav";
import PWAInstallPrompt from "./PWAInstallPrompt";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import { ReactLenis } from 'lenis/react';
import ScrollEngine from "./scroll/ScrollEngine";
import ScrollProgress from "./scroll/ScrollProgress";
import config from "@/brand/config";

const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

// Check maintenance mode and redirect if needed
function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Don't check if already on maintenance page
    if (pathname === '/maintenance') {
      setChecked(true);
      return;
    }

    const checkMaintenance = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(`${config.api}/settings`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const text = await res.text();
        if (!text) {
          setChecked(true);
          return;
        }
        const data = JSON.parse(text);
        if (data.maintenanceMode) {
          router.push('/maintenance');
          return;
        }
      } catch (error: any) {
        // API is down or unreachable - allow app to work anyway.
        // Use warn (not error) so a transient backend outage isn't a red overlay.
        if (error.name !== 'AbortError') {
          console.warn('Maintenance check skipped (API unavailable), continuing:', error?.message);
        }
      }
      setChecked(true);
    };

    checkMaintenance();
  }, [pathname, router]);

  // Show nothing while checking to avoid flashing
  if (!checked && pathname !== '/maintenance') {
    return null;
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      <ScrollProgress />
      <ScrollEngine />
      <AuthProvider>
        <ShopProvider>
          <MaintenanceGuard>
            <AnnouncementBar />
            <Navbar />
            <RouteTransition>
              {children}
            </RouteTransition>
            <BottomNav />
            <PWAInstallPrompt />
            <ServiceWorkerRegister />
          </MaintenanceGuard>
        </ShopProvider>
      </AuthProvider>
    </ReactLenis>
  );
}

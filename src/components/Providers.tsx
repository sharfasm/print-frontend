// @ts-nocheck
"use client";
import React from 'react';
import { ShopProvider } from "../context/ShopContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "./Navbar";
import RouteTransition from "./RouteTransition";
import { ReactLenis } from 'lenis/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      <AuthProvider>
        <ShopProvider>
          <Navbar />
          <RouteTransition>
            {children}
          </RouteTransition>
        </ShopProvider>
      </AuthProvider>
    </ReactLenis>
  );
}

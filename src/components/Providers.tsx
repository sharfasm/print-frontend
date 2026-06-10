// @ts-nocheck
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { ShopProvider } from "../context/ShopContext";
import { AuthProvider } from "../context/AuthContext";
import RouteTransition from "./RouteTransition";
import { ReactLenis } from 'lenis/react';

const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
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

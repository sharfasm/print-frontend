// @ts-nocheck
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const RouteTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change instantly
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
};

export default RouteTransition;

"use client";

import React, { useEffect, useState } from "react";
import config from "@/brand/config";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="inline-block p-4 bg-yellow-500/20 rounded-2xl">
            <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-serif">
          Under Maintenance
        </h1>

        <MaintenanceContent />

        <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm">We'll be back soon</span>
        </div>
      </div>
    </div>
  );
}

function MaintenanceContent() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${config.api}/settings`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMessage(data.maintenanceMessage || "We're temporarily offline for maintenance. We'll be back soon!");
      } catch (error) {
        console.error("Error fetching maintenance message:", error);
        setMessage("We're temporarily offline for maintenance. We'll be back soon!");
      }
    };

    fetchSettings();
  }, []);

  return (
    <>
      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
        {message || "Loading..."}
      </p>

      <div className="space-y-3 text-gray-400 text-sm">
        <p>Thank you for your patience.</p>
        <p>Our team is working hard to bring you an even better experience.</p>
      </div>
    </>
  );
}

"use client";
import React, { Suspense } from 'react';
import DashboardRequests from "../../../views/Dashboard/DashboardRequests";

export default function RequestsPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-bold text-[var(--text)] opacity-50">Loading support desk...</div>}>
            <DashboardRequests />
        </Suspense>
    );
}

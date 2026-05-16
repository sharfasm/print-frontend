// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from "next/link";
import api from '../../lib/axios';

export default function Overview() {
    const { user } = useAuth();

    const [metrics, setMetrics] = useState({
        totalOrders: 0,
        activeOrders: 0,
        totalSpent: 0,
        recentOrders: []
    });

    useEffect(() => {
        if (user) {
            api.get('/users/dashboard').then(res => {
                setMetrics(res.data);
            }).catch(err => console.error("Failed to load dashboard metrics", err));
        }
    }, [user]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Hello, {user?.name?.split(' ')[0]}</h1>
            <p className="opacity-70 font-medium mb-12">Manage your printing orders, tracking, and account settings all in one place.</p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 p-6 rounded-2xl flex flex-col justify-center">
                    <span className="opacity-60 font-bold uppercase tracking-widest text-xs mb-2">Active Orders</span>
                    <span className="text-4xl font-black text-[var(--primary)]">{metrics.activeOrders}</span>
                </div>
                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 p-6 rounded-2xl flex flex-col justify-center">
                    <span className="opacity-60 font-bold uppercase tracking-widest text-xs mb-2">Total Orders</span>
                    <span className="text-4xl font-black">{metrics.totalOrders}</span>
                </div>
                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 p-6 rounded-2xl flex flex-col justify-center">
                    <span className="opacity-60 font-bold uppercase tracking-widest text-xs mb-2">Total Spent</span>
                    <span className="text-4xl font-black">₹{metrics.totalSpent}</span>
                </div>
            </div>

            {/* Recent Orders Overview */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black">Recent Activity</h2>
                    <Link href="/dashboard/orders" className="text-[var(--primary)] font-bold text-sm hover:underline">View All &rarr;</Link>
                </div>

                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="bg-[var(--secondary)]/10 text-sm font-bold opacity-80 border-b border-[var(--secondary)]/10">
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-[var(--secondary)]/5 hover:bg-[var(--secondary)]/5 transition-colors">
                                    <td className="p-4 font-bold text-[var(--primary)]">{order.id}</td>
                                    <td className="p-4 opacity-80 text-sm font-medium">{order.date}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                                            order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 
                                            order.status === 'cancelled' || order.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-500' :
                                            'bg-orange-500/10 text-orange-500'
                                        }`}>
                                            {order.paymentStatus === 'verification_pending' ? 'Verifying' : order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-black">₹{order.total}</td>
                                </tr>
                            ))}
                            {metrics.recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center opacity-60">No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

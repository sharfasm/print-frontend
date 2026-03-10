import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Overview() {
    const { user } = useAuth();

    // Mock recent orders for the dashboard view
    const recentOrders = [
        { id: "#ORD-9982X", date: "Oct 24, 2026", total: 4999, status: "Delivered" },
        { id: "#ORD-9981A", date: "Oct 12, 2026", total: 1250, status: "Processing" },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Hello, {user?.name?.split(' ')[0]}</h1>
            <p className="opacity-70 font-medium mb-12">Manage your printing orders, tracking, and account settings all in one place.</p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 p-6 rounded-2xl flex flex-col justify-center">
                    <span className="opacity-60 font-bold uppercase tracking-widest text-xs mb-2">Active Orders</span>
                    <span className="text-4xl font-black text-[var(--primary)]">1</span>
                </div>
                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 p-6 rounded-2xl flex flex-col justify-center">
                    <span className="opacity-60 font-bold uppercase tracking-widest text-xs mb-2">Total Orders</span>
                    <span className="text-4xl font-black">12</span>
                </div>
                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 p-6 rounded-2xl flex flex-col justify-center">
                    <span className="opacity-60 font-bold uppercase tracking-widest text-xs mb-2">Total Spent</span>
                    <span className="text-4xl font-black">₹14.2k</span>
                </div>
            </div>

            {/* Recent Orders Overview */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black">Recent Activity</h2>
                    <Link to="/dashboard/orders" className="text-[var(--primary)] font-bold text-sm hover:underline">View All &rarr;</Link>
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
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-[var(--secondary)]/5 hover:bg-[var(--secondary)]/5 transition-colors">
                                    <td className="p-4 font-bold text-[var(--primary)]">{order.id}</td>
                                    <td className="p-4 opacity-80 text-sm font-medium">{order.date}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                            order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-black">₹{order.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

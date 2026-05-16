// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from '../lib/axios';

export default function OrderConfirmation() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (orderId) {
            api.get(`/orders/${orderId}`)
                .then(res => {
                    setOrder(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching order", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>;
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)]">
                <h1 className="text-2xl font-black mb-4">Order Not Found</h1>
                <Link href="/" className="text-[var(--primary)] font-bold">Return Home</Link>
            </div>
        );
    }

    const { paymentStatus, orderStatus, cancelReason, deliveryDate, estimatedDelivery } = order;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center pt-32 pb-12 px-4">
            <div className="max-w-2xl w-full bg-[var(--secondary)]/5 p-8 rounded-[2rem] border border-[var(--secondary)]/10 text-center animate-in zoom-in-95 duration-500 shadow-xl">
                
                {paymentStatus === "verification_pending" && (
                    <>
                        <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h1 className="text-3xl font-black mb-2">Payment Submitted</h1>
                        <p className="opacity-70 font-medium mb-6 text-lg">Waiting for Confirmation</p>
                        <div className="bg-blue-500/10 p-4 rounded-xl text-blue-600 font-bold mb-8 inline-block">
                            Estimated Delivery: {estimatedDelivery ? new Date(estimatedDelivery).toLocaleDateString() : 'Pending'}
                        </div>
                    </>
                )}

                {paymentStatus === "paid" && (
                    <>
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 className="text-3xl font-black mb-2">Payment Confirmed</h1>
                        <p className="opacity-70 font-medium mb-6 text-lg">Order Processing</p>
                        <div className="bg-green-500/10 p-4 rounded-xl text-green-600 font-bold mb-8 inline-block">
                            Delivery Date: {deliveryDate ? new Date(deliveryDate).toLocaleDateString() : 'Pending'}
                        </div>
                    </>
                )}

                {(paymentStatus === "failed" || orderStatus === "cancelled") && (
                    <>
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                        <h1 className="text-3xl font-black mb-2">Order Cancelled</h1>
                        <p className="text-red-500 font-bold mb-6 text-lg">Reason: {cancelReason || "Payment Failed"}</p>
                        <div className="mb-8">
                            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-emerald-500/10 text-emerald-600 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-emerald-500/20 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.128.553 4.195 1.603 6.012L.392 23.608l5.706-1.498A11.968 11.968 0 0012.03 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.015c-1.802 0-3.567-.485-5.114-1.404l-.367-.217-3.8.997.997-3.8-.217-.367A9.972 9.972 0 011.985 12.03c0-5.545 4.515-10.06 10.06-10.06 5.546 0 10.06 4.515 10.06 10.06 0 5.546-4.514 10.06-10.06 10.06zm5.522-7.534c-.302-.151-1.792-.885-2.069-.986-.277-.101-.479-.151-.68.151-.202.302-.781.986-.957 1.188-.176.202-.353.227-.655.076-1.51-.745-2.613-1.636-3.608-3.32-.176-.302.176-.277.479-.882.101-.202.05-.378-.025-.529-.076-.151-.68-1.638-.932-2.243-.252-.605-.504-.523-.68-.529-.176-.006-.378-.006-.58-.006-.202 0-.529.076-.806.378-.277.302-1.058 1.033-1.058 2.519s1.083 2.923 1.234 3.125c.151.202 2.128 3.248 5.152 4.558 2.065.894 2.87.755 3.398.63.63-.151 1.792-.73 2.044-1.436.252-.705.252-1.31.176-1.436-.076-.126-.277-.202-.58-.353z" /></svg>
                                Contact WhatsApp Support
                            </a>
                        </div>
                    </>
                )}

                <div className="border-t border-[var(--secondary)]/10 pt-6 text-left">
                    <h3 className="font-black text-lg mb-4 text-[var(--primary)]">Order Snapshot</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="opacity-70 font-medium">Order ID</span>
                            <span className="font-bold">{order._id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-70 font-medium">Total Amount</span>
                            <span className="font-black text-[var(--primary)] text-lg">₹{order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-70 font-medium">Payment Method</span>
                            <span className="font-bold bg-[var(--secondary)]/10 px-2 py-0.5 rounded text-sm">{order.paymentMethod}</span>
                        </div>
                        {order.transactionLast4 && (
                            <div className="flex justify-between">
                                <span className="opacity-70 font-medium">Txn Last 4</span>
                                <span className="font-bold tracking-widest">{order.transactionLast4}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--secondary)]/10">
                    <Link href="/products" className="px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-lg hover:opacity-90 transition inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

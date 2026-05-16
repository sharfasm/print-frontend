// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { resolveImage } from '../../lib/imageUtils';
import api from '../../lib/axios';

export default function DeliveryTracking() {
    const [orders, setOrders] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [foundOrder, setFoundOrder] = useState(null);
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [truckProgress, setTruckProgress] = useState(0);

    const trackingStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    // Fetch user orders on mount so we can search by short ID
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my');
                const formattedOrders = response.data.map(order => ({
                    id: `#${order._id.substring(order._id.length - 6).toUpperCase()}`,
                    _id: order._id,
                    createdAt: order.createdAt,
                    deliveryDate: order.deliveryDate,
                    date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    total: order.totalAmount,
                    status: order.orderStatus === 'pending' && order.paymentStatus === 'paid' ? 'processing' : order.orderStatus,
                    items: order.items.length,
                    image: order.items[0]?.image,
                    productName: order.items[0]?.name,
                    productId: order.items[0]?.productId,
                    paymentStatus: order.paymentStatus
                }));
                setOrders(formattedOrders);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            }
        };
        fetchOrders();
    }, []);

    const calculateTruckProgress = (order) => {
        if (!order) return 0;
        
        const mappedStatus = order.status === 'confirmed' ? 'Processing' : 
                             order.status === 'processing' ? 'Shipped' : 
                             order.status === 'delivered' ? 'Delivered' : 'Processing';
        
        if (mappedStatus === 'Delivered') return 100;
        
        if (!order.deliveryDate || !order.createdAt) {
            // Fallback to step-based progress if no delivery date is set
            const currentStatusIndex = trackingStatuses.indexOf(mappedStatus) !== -1 ? trackingStatuses.indexOf(mappedStatus) : 0;
            return Math.max(5, (currentStatusIndex / (trackingStatuses.length - 1)) * 100);
        }

        const today = new Date().getTime();
        const orderDate = new Date(order.createdAt).getTime();
        const deliveryDate = new Date(order.deliveryDate).getTime();

        if (today <= orderDate) return 5; // Just started
        if (today >= deliveryDate) return 95; // Almost there or should be delivered
        
        const progress = ((today - orderDate) / (deliveryDate - orderDate)) * 100;
        // Clamp between 10% and 90% while moving
        return Math.max(10, Math.min(90, progress));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchAttempted(true);
        if (!searchId.trim()) return;

        const order = orders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase() || o._id.toLowerCase() === searchId.trim().toLowerCase());
        setFoundOrder(order || null);
        
        if (order) {
            // Add a slight delay for the truck animation effect
            setTimeout(() => {
                setTruckProgress(calculateTruckProgress(order));
            }, 300);
        } else {
            setTruckProgress(0);
        }
    };

    const getMappedStatus = (orderStatus) => {
        return orderStatus === 'confirmed' ? 'Processing' : 
               orderStatus === 'processing' ? 'Shipped' : 
               orderStatus === 'delivered' ? 'Delivered' : 'Processing';
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">Delivery Tracking</h1>
            <p className="opacity-70 font-medium mb-10">Enter your Order ID to track your package's current location and estimated delivery date.</p>

            {/* Search Box */}
            <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-[2rem] p-6 sm:p-8 mb-8 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--secondary)]/50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => {
                                setSearchId(e.target.value);
                                if (searchAttempted) setSearchAttempted(false);
                            }}
                            placeholder="e.g. #ORD-9982X"
                            className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-bold text-lg transition-all"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-lg hover:opacity-90 transition-all sm:w-auto w-full"
                    >
                        Track Order
                    </button>
                </form>
            </div>

            {/* Tracking Result */}
            {searchAttempted && !foundOrder && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-6 text-center font-bold flex flex-col items-center gap-3 animate-in zoom-in-95">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Order not found. Please check the Order ID and try again.
                </div>
            )}

            {foundOrder && (
                <div className="bg-[var(--bg)] border border-[var(--secondary)]/10 rounded-[2rem] p-6 sm:p-10 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4">
                    {foundOrder.status === 'delivered' && (
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-[var(--secondary)]/5 shadow-inner">
                            <img src={resolveImage(foundOrder.image)} alt="Order item" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 w-full space-y-3">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-[var(--primary)]">{foundOrder.id}</h2>
                                    <p className="opacity-70 font-medium">Placed on {foundOrder.date}</p>
                                </div>
                                <span className={`px-4 py-2 text-sm font-black uppercase tracking-widest rounded-lg shadow-sm ${
                                    foundOrder.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                                }`}>
                                    {getMappedStatus(foundOrder.status)}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[var(--secondary)]/10">
                                <div>
                                    <p className="text-xs opacity-60 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                    <p className="font-extrabold text-lg">₹{foundOrder.total}</p>
                                </div>
                                <div>
                                    <p className="text-xs opacity-60 font-bold uppercase tracking-wider mb-1">Items</p>
                                    <p className="font-extrabold text-lg">{foundOrder.items} items</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs opacity-60 font-bold uppercase tracking-wider mb-1">Estimated Delivery</p>
                                    <p className="font-extrabold text-lg text-green-600">
                                        {foundOrder.deliveryDate ? new Date(foundOrder.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'To be assigned'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline & Truck Tracking */}
                    <div className="pt-8 border-t border-[var(--secondary)]/10">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-lg font-black uppercase tracking-wider">Tracking Path</h3>
                        </div>
                        
                        <div className="relative pt-6">
                            {/* Animated Truck */}
                            <div 
                                className="absolute top-0 -translate-y-[80%] z-20 transition-all duration-1000 ease-out"
                                style={{ left: `calc(${truckProgress}% - 20px)` }}
                            >
                                <div className="bg-[var(--bg)] p-1 rounded-full shadow-lg border border-[var(--secondary)]/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8.514a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="7.5" cy="19.5" r="1.5" />
                                        <circle cx="17.5" cy="19.5" r="1.5" />
                                    </svg>
                                </div>
                            </div>

                            {/* Background Line */}
                            <div className="absolute top-8 left-4 right-4 h-1.5 bg-[var(--secondary)]/10 -translate-y-1/2 rounded-full z-0"></div>
                            
                            {/* Active Line */}
                            <div 
                                className={`absolute top-8 left-4 h-1.5 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out ${foundOrder.status === 'delivered' ? 'bg-green-500' : 'bg-[var(--primary)]'}`}
                                style={{ width: `calc((100% - 2rem) * ${truckProgress / 100})` }}
                            ></div>

                            <div className="flex justify-between relative z-10 text-center mt-4">
                                {trackingStatuses.map((status, idx) => {
                                    const mappedStatus = getMappedStatus(foundOrder.status);
                                    const currentStatusIndex = trackingStatuses.indexOf(mappedStatus) !== -1 ? trackingStatuses.indexOf(mappedStatus) : 0;
                                    const isCompleted = idx <= currentStatusIndex;
                                    const isCurrent = idx === currentStatusIndex;
                                    
                                    return (
                                        <div key={status} className="flex flex-col items-center gap-3 w-1/4">
                                            <div className={`w-8 h-8 rounded-full flex justify-center items-center border-4 transition-all duration-500 bg-[var(--bg)]
                                                ${isCompleted 
                                                    ? (foundOrder.status === 'delivered' && idx === trackingStatuses.length - 1 ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'border-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]') 
                                                    : 'border-[var(--secondary)]/20'
                                                }
                                                ${isCurrent ? 'scale-125' : ''}
                                            `}>
                                                {isCompleted ? (
                                                    <div className={`w-2.5 h-2.5 rounded-full ${foundOrder.status === 'delivered' && idx === trackingStatuses.length - 1 ? 'bg-green-500' : 'bg-[var(--primary)]'}`}></div>
                                                ) : null}
                                            </div>
                                            <span className={`text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wide mt-2
                                                ${isCompleted 
                                                    ? (foundOrder.status === 'delivered' && idx === trackingStatuses.length - 1 ? 'text-green-600' : 'text-[var(--primary)]') 
                                                    : 'text-[var(--text)] opacity-40'
                                                }
                                            `}>
                                                {status}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

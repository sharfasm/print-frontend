// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import config from '../../brand/config';
import { resolveImage } from '../../lib/imageUtils';
import api from '../../lib/axios';

export default function Orders() {
    const navigate = useRouter();
    const [allProducts, setAllProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products to allow fallback matching for old orders
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${config.api}/products`);
                if (response.ok) {
                    const data = await response.json();
                    setAllProducts(data);
                }
            } catch (error) {
                console.error("Error fetching products for matching:", error);
            }
        };
        fetchProducts();
    }, []);

    // Fetch user orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my');
                
                // Format for UI
                const formattedOrders = response.data.map(order => ({
                    id: `#${order._id.substring(order._id.length - 6).toUpperCase()}`,
                    _id: order._id,
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
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleNavigateToProduct = (order) => {
        // 1. Direct match if productId exists (New Orders)
        if (order.productId) {
            navigate.push(`/product/${order.productId}`);
            return;
        }

        // 2. Fallback: Find product by name or image (Old Orders)
        const matchedProduct = allProducts.find(p => 
            (order.productName && p.name === order.productName) || 
            (order.image && p.image === order.image)
        );

        if (matchedProduct) {
            navigate.push(`/product/${matchedProduct._id}`);
        } else {
            // 3. Last resort: Navigate to products page if no match
            navigate.push('/products');
        }
    };

    const trackingStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">My Orders</h1>
            <p className="opacity-70 font-medium mb-10">Track, return, or repurchase items.</p>

            <div className="flex flex-col gap-8">
                {loading ? (
                    <div className="text-center py-10 opacity-70">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 opacity-70">No orders found.</div>
                ) : orders.map(order => {
                    const mappedStatus = order.status === 'confirmed' ? 'Processing' : 
                                         order.status === 'processing' ? 'Shipped' : 
                                         order.status === 'delivered' ? 'Delivered' : 'Processing';
                    const currentStatusIndex = trackingStatuses.indexOf(mappedStatus) !== -1 ? trackingStatuses.indexOf(mappedStatus) : 0;
                    const progressPercentage = Math.max(5, (currentStatusIndex / (trackingStatuses.length - 1)) * 100);

                    return (
                    <div key={order.id} className="bg-[var(--bg)] border border-[var(--secondary)]/10 rounded-[2rem] p-6 sm:p-8 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                        
                        {/* Decorative background element for delivered */}
                        {order.status === 'delivered' && (
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-2xl pointer-events-none"></div>
                        )}

                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        
                        {/* Order Image Thumbnail */}
                        <div 
                            onClick={() => handleNavigateToProduct(order)}
                            className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[var(--secondary)]/5 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <img src={resolveImage(order.image)} alt="Order item" className="w-full h-full object-cover" />
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 flex flex-col gap-2 w-full">
                            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[var(--secondary)]/10 pb-4">
                                <div>
                                    <h3 
                                        onClick={() => handleNavigateToProduct(order)}
                                        className="text-xl font-bold cursor-pointer hover:text-[var(--primary)] transition-colors"
                                    >
                                        {order.productName || order.id}
                                    </h3>
                                    <p className="text-sm opacity-70 font-medium">Placed on {order.date} • {order.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-70 font-medium uppercase tracking-wider mb-1">Total</p>
                                    <span className="text-xl font-extrabold text-[var(--primary)]">₹{order.total}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md ${
                                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                    }`}>
                                        {order.status === 'pending' && order.paymentStatus === 'verification_pending' ? 'Verifying Payment' : order.status}
                                    </span>
                                    <span className="text-sm font-bold opacity-60">• {order.items} Items</span>
                                </div>
                                
                                <button 
                                    onClick={() => handleNavigateToProduct(order)}
                                    className="px-6 py-2.5 bg-[var(--secondary)]/5 hover:bg-[var(--primary)] text-[var(--text)] hover:text-[var(--bg)] font-bold rounded-xl transition-all shadow-sm"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                        </div>

                        {/* Delivery Tracking Timeline */}
                        <div className="mt-2 w-full pt-6 border-t border-[var(--secondary)]/10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-black uppercase tracking-widest text-[var(--primary)] flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                    Delivery Tracking
                                </span>
                                <span className="text-xs font-bold opacity-60">Est. Date: {order.date}</span>
                            </div>
                            
                            <div className="relative w-full h-2.5 bg-[var(--secondary)]/10 rounded-full overflow-hidden mb-4">
                                <div 
                                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-[var(--primary)]'}`}
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            
                            <div className="flex justify-between text-[9px] sm:text-[11px] md:text-xs font-black uppercase tracking-wider">
                                {trackingStatuses.map((status, idx) => (
                                    <span 
                                        key={status} 
                                        className={`transition-colors duration-300 text-center w-1/4 ${
                                            idx <= currentStatusIndex 
                                                ? (order.status === 'delivered' && idx === trackingStatuses.length - 1 ? 'text-green-600 drop-shadow-sm' : 'text-[var(--primary)] drop-shadow-sm') 
                                                : 'text-[var(--text)] opacity-30'
                                        }`}
                                    >
                                        {status}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                    );
                })}
            </div>
        </div>
    );
}

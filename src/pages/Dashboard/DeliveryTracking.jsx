import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';

export default function DeliveryTracking() {
    const { orders } = useShop();
    const [searchId, setSearchId] = useState('');
    const [foundOrder, setFoundOrder] = useState(null);
    const [searchAttempted, setSearchAttempted] = useState(false);

    const trackingStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchAttempted(true);
        if (!searchId.trim()) return;

        const order = orders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase());
        setFoundOrder(order || null);
    };

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
                    {foundOrder.status === 'Delivered' && (
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-[var(--secondary)]/5 shadow-inner">
                            <img src={foundOrder.image} alt="Order item" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 w-full space-y-3">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-[var(--primary)]">{foundOrder.id}</h2>
                                    <p className="opacity-70 font-medium">Placed on {foundOrder.date}</p>
                                </div>
                                <span className={`px-4 py-2 text-sm font-black uppercase tracking-widest rounded-lg shadow-sm ${
                                    foundOrder.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                                }`}>
                                    {foundOrder.status}
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
                                    <p className="font-extrabold text-lg text-green-600">{foundOrder.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="pt-8 border-t border-[var(--secondary)]/10">
                        <h3 className="text-lg font-black uppercase tracking-wider mb-8">Tracking Path</h3>
                        
                        <div className="relative">
                            {/* Background Line */}
                            <div className="absolute top-4 left-4 right-4 h-1.5 bg-[var(--secondary)]/10 -translate-y-1/2 rounded-full z-0"></div>
                            
                            {/* Active Line */}
                            {(() => {
                                const currentStatusIndex = trackingStatuses.indexOf(foundOrder.status) !== -1 ? trackingStatuses.indexOf(foundOrder.status) : 0;
                                const progressPercentage = (currentStatusIndex / (trackingStatuses.length - 1)) * 100;
                                return (
                                    <div 
                                        className={`absolute top-4 left-4 h-1.5 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out ${foundOrder.status === 'Delivered' ? 'bg-green-500' : 'bg-[var(--primary)]'}`}
                                        style={{ width: `calc((100% - 2rem) * ${progressPercentage / 100})` }}
                                    ></div>
                                );
                            })()}

                            <div className="flex justify-between relative z-10 text-center">
                                {trackingStatuses.map((status, idx) => {
                                    const currentStatusIndex = trackingStatuses.indexOf(foundOrder.status) !== -1 ? trackingStatuses.indexOf(foundOrder.status) : 0;
                                    const isCompleted = idx <= currentStatusIndex;
                                    const isCurrent = idx === currentStatusIndex;
                                    
                                    return (
                                        <div key={status} className="flex flex-col items-center gap-3 w-1/4">
                                            <div className={`w-8 h-8 rounded-full flex justify-center items-center border-4 transition-all duration-500 bg-[var(--bg)]
                                                ${isCompleted 
                                                    ? (foundOrder.status === 'Delivered' && idx === trackingStatuses.length - 1 ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'border-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]') 
                                                    : 'border-[var(--secondary)]/20'
                                                }
                                                ${isCurrent ? 'scale-125' : ''}
                                            `}>
                                                {isCompleted ? (
                                                    <div className={`w-2.5 h-2.5 rounded-full ${foundOrder.status === 'Delivered' && idx === trackingStatuses.length - 1 ? 'bg-green-500' : 'bg-[var(--primary)]'}`}></div>
                                                ) : null}
                                            </div>
                                            <span className={`text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wide
                                                ${isCompleted 
                                                    ? (foundOrder.status === 'Delivered' && idx === trackingStatuses.length - 1 ? 'text-green-600' : 'text-[var(--primary)]') 
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

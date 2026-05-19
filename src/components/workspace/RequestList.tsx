"use client";
import React from 'react';
import { MessageSquare, CheckCircle, Search } from 'lucide-react';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='18' fill='%23e7e2cb'/%3E%3Cpath d='M36 80h48L72 64 62 75 50 56 36 80z' fill='%23505039' fill-opacity='.35'/%3E%3Ccircle cx='76' cy='43' r='8' fill='%23505039' fill-opacity='.35'/%3E%3C/svg%3E";

interface RequestListProps {
    requests: any[];
    selectedId: string | null;
    onSelect: (req: any) => void;
    resolveImage: (path: string) => string;
    searchQuery: string;
    onSearchChange: (q: string) => void;
}

const statusColors: Record<string, string> = {
    pending_review: "bg-gray-100 text-gray-600",
    waiting_for_payment: "bg-amber-50 text-amber-700",
    payment_verified: "bg-blue-50 text-blue-700",
    designing_started: "bg-purple-50 text-purple-700",
    preview_sent: "bg-indigo-50 text-indigo-700",
    approved: "bg-emerald-50 text-emerald-700",
    production_started: "bg-cyan-50 text-cyan-700",
    completed: "bg-green-50 text-green-800",
    rejected: "bg-red-50 text-red-700",
};

const paymentColors: Record<string, string> = {
    paid: "text-emerald-600",
    unpaid: "text-amber-600",
};

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
}

export default function RequestList({ requests, selectedId, onSelect, resolveImage, searchQuery, onSearchChange }: RequestListProps) {
    const filtered = requests.filter(r =>
        !searchQuery || r.productId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r._id.includes(searchQuery)
    );

    return (
        <>
            {/* Header */}
            <div className="px-4 sm:px-5 pt-safe pb-4 border-b border-[var(--secondary)]/10 bg-[var(--bg)]/95 backdrop-blur-2xl shrink-0 z-10">
                <div className="flex items-end justify-between gap-3 mt-4 sm:mt-5">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_8px_var(--primary)]"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Live Design Desk</p>
                        </div>
                        <h2 className="text-[28px] sm:text-2xl font-black text-[var(--text)] leading-none tracking-tight">
                            Requests
                        </h2>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="min-w-8 h-8 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 text-xs font-black px-2.5 rounded-full flex items-center justify-center">
                            {requests.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3 bg-gradient-to-b from-[var(--bg)]/95 to-transparent z-10 shrink-0">
                <div className="relative group">
                    <input 
                        value={searchQuery}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search requests..."
                        className="w-full h-11 sm:h-10 bg-[var(--secondary)]/5 border border-[var(--secondary)]/15 rounded-2xl py-2 pl-10 pr-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/30 text-[var(--text)] placeholder:text-[var(--text)]/40 transition-all shadow-sm"
                    />
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text)]/40 group-focus-within:text-[var(--primary)]/70 transition-colors" />
                </div>
            </div>

            {/* Request Cards */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-1 sm:p-3 space-y-1.5 overscroll-contain min-h-0" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
                {filtered.map(req => {
                    const isSelected = selectedId === req._id;
                    const lastMsg = req.messages?.[req.messages.length - 1];
                    const hasPreview = req.requestStatus === 'preview_sent';
                    const unread = req.messages?.filter((m: any) => m.sender === 'admin' && !m.isRead)?.length || 0;
                    const productImage = req.productId?.primaryImage || req.productId?.coverImage || req.productId?.image || req.productId?.images?.[0] || '';

                    return (
                        <div
                            key={req._id}
                            onClick={() => onSelect(req)}
                            className={`p-3.5 sm:p-4 rounded-[1.25rem] cursor-pointer transition-all border touch-manipulation group ${
                                isSelected
                                    ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 shadow-[0_8px_20px_rgba(80,80,57,0.08)]'
                                    : 'bg-transparent border-transparent hover:bg-[var(--secondary)]/5 hover:border-[var(--secondary)]/10 active:bg-[var(--secondary)]/10'
                            }`}
                        >
                            <div className="flex items-start gap-3.5 sm:gap-4">
                                {/* Product Image */}
                                <div className="relative shrink-0">
                                    <div className="w-14 h-14 sm:w-14 sm:h-14 rounded-[1rem] overflow-hidden bg-[var(--secondary)]/5 border border-[var(--secondary)]/15 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-transform group-hover:scale-105 group-active:scale-95">
                                        <img
                                            src={resolveImage(productImage)}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            alt={req.productId?.name || 'Product'}
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
                                        />
                                    </div>
                                    {!isSelected && (unread > 0 || hasPreview) && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00A884] border-2 border-[var(--bg)] rounded-full animate-pulse shadow-sm" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[56px] py-0.5">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-[15px] sm:text-[14px] truncate pr-2 text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{req.productId?.name || 'Product'}</h4>
                                        <span className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${unread > 0 && !isSelected ? 'text-[#00A884]' : 'text-[var(--text)]/40'}`}>
                                            {lastMsg ? timeAgo(lastMsg.createdAt) : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1.5 gap-2">
                                        <p className={`text-[13px] sm:text-[12px] truncate font-medium ${unread > 0 && !isSelected ? 'text-[var(--text)] font-semibold' : 'text-[var(--text)]/60'}`}>
                                            {lastMsg
                                                ? (lastMsg.type === 'audio' ? '🎤 Voice' : lastMsg.text || '📎 Attachment')
                                                : 'Waiting for response...'}
                                        </p>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {unread > 0 && !isSelected && (
                                                <div className="min-w-5 h-5 bg-[#00A884] text-white text-[10px] font-black px-1.5 rounded-full shrink-0 flex items-center justify-center shadow-sm">
                                                    {unread > 9 ? '9+' : unread}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${statusColors[req.requestStatus] || 'bg-[var(--secondary)]/10 text-[var(--text)] border border-[var(--secondary)]/20'}`}>
                                            {req.requestStatus?.replace(/_/g, ' ')}
                                        </span>
                                        {req.paymentStatus !== 'paid' && (
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                                                Unpaid
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="py-14 text-center text-[var(--text)]/45">
                        <Search size={28} className="mx-auto mb-3 opacity-60" />
                        <p className="text-sm font-black">No matching requests</p>
                    </div>
                )}
            </div>
        </>
    );
}

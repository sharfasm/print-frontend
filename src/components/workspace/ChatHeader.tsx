"use client";
import React, { useState } from 'react';
import { ChevronLeft, CheckCircle, AlertCircle, Edit3, Trash2, MoreVertical, ExternalLink } from 'lucide-react';

const workflowSteps = ['pending_review', 'designing_started', 'preview_sent', 'approved', 'production_started', 'completed'];
const stepLabels = ['Review', 'Designing', 'Preview', 'Approved', 'Production', 'Done'];
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='18' fill='%23e7e2cb'/%3E%3Cpath d='M36 80h48L72 64 62 75 50 56 36 80z' fill='%23505039' fill-opacity='.35'/%3E%3Ccircle cx='76' cy='43' r='8' fill='%23505039' fill-opacity='.35'/%3E%3C/svg%3E";

interface ChatHeaderProps {
    request: any;
    resolveImage: (path: string) => string;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onProductClick?: () => void;
}

export default function ChatHeader({ request, resolveImage, onBack, onEdit, onDelete, onProductClick }: ChatHeaderProps) {
    const [showMenu, setShowMenu] = useState(false);
    const currentStep = workflowSteps.indexOf(request.requestStatus);
    const productImage = request.productId?.primaryImage || request.productId?.coverImage || request.productId?.image || request.productId?.images?.[0] || '';

    const whatsappUrl = request.contactNumber
        ? `https://wa.me/${request.contactNumber.replace(/\D/g, '')}`
        : '#';

    return (
        <div className="border-b border-[var(--secondary)]/15 bg-[var(--bg)]/90 backdrop-blur-lg shrink-0 z-10">
            {/* Main header row */}
            <div className="flex items-center gap-3 px-3 sm:px-5 py-3">
                <button className="lg:hidden p-1.5 -ml-1 rounded-full hover:bg-[var(--secondary)]/10 text-[var(--text)]/60 transition-colors" onClick={onBack}>
                    <ChevronLeft size={22} />
                </button>
                <img
                    src={resolveImage(productImage) || FALLBACK_IMAGE}
                    className="w-10 h-10 rounded-xl object-cover border border-[var(--secondary)]/15 shadow-sm shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    loading="lazy"
                    alt={request.productId?.name || 'Product'}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    onClick={onProductClick}
                />
                <div className="flex-1 min-w-0">
                    <h3 onClick={onProductClick} className="font-bold text-sm text-[var(--text)] truncate cursor-pointer hover:underline">{request.productId?.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[9px] font-bold text-[var(--primary)] bg-[var(--primary)]/5 px-1.5 py-0.5 rounded uppercase tracking-widest">
                            REQ-{(request._id as string).slice(-6)}
                        </span>
                        {request.paymentStatus === 'paid'
                            ? <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5"><CheckCircle size={9} /> Paid</span>
                            : <span className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5"><AlertCircle size={9} /> Unpaid</span>
                        }
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <a href={whatsappUrl} target="_blank" rel="noreferrer"
                        className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors">
                        <ExternalLink size={10} /> WhatsApp
                    </a>
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-[var(--text)]/40 hover:text-[var(--text)] hover:bg-[var(--secondary)]/10 rounded-full transition-colors">
                            <MoreVertical size={18} />
                        </button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                <div className="absolute top-full right-0 mt-1 bg-[var(--bg)] border border-[var(--secondary)]/15 shadow-xl rounded-xl p-1.5 w-44 z-50">
                                    <button onClick={() => { setShowMenu(false); onEdit(); }}
                                        className="w-full text-left px-3 py-2 text-xs font-bold text-[var(--text)] hover:bg-[var(--secondary)]/10 rounded-lg flex items-center gap-2 transition-colors">
                                        <Edit3 size={14} /> Update Request
                                    </button>
                                    <a href={whatsappUrl} target="_blank" rel="noreferrer"
                                        className="sm:hidden w-full text-left px-3 py-2 text-xs font-bold text-[var(--text)] hover:bg-[var(--secondary)]/10 rounded-lg flex items-center gap-2 transition-colors">
                                        <ExternalLink size={14} /> WhatsApp
                                    </a>
                                    <button onClick={() => { setShowMenu(false); onDelete(); }}
                                        className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 transition-colors">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Workflow progress tracker */}
            <div className="px-4 sm:px-5 pb-2.5 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-0 min-w-max">
                    {stepLabels.map((label, i) => {
                        const isActive = i <= currentStep;
                        const isCurrent = i === currentStep;
                        return (
                            <React.Fragment key={label}>
                                <div className="flex flex-col items-center gap-1">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${
                                        isCurrent ? 'bg-[var(--primary)] text-white scale-110 shadow-md shadow-[var(--primary)]/30'
                                        : isActive ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                                        : 'bg-[var(--secondary)]/10 text-[var(--text)]/40'
                                    }`}>
                                        {isActive ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-[8px] font-bold whitespace-nowrap ${isCurrent ? 'text-[var(--primary)]' : isActive ? 'text-[var(--text)]/60' : 'text-[var(--text)]/40'}`}>
                                        {label}
                                    </span>
                                </div>
                                {i < stepLabels.length - 1 && (
                                    <div className={`w-6 sm:w-10 h-[2px] mt-[-12px] ${i < currentStep ? 'bg-[var(--primary)]/30' : 'bg-[var(--secondary)]/15'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

"use client";
import React, { useState, useEffect, useRef } from 'react';
import config from '../../brand/config';
import api from '../../lib/axios';
import { 
    Clock, AlertCircle, Edit3, X, CheckCircle, Package, 
    CreditCard, Sparkles, MessageSquare, Image as ImageIcon, 
    Trash2, Upload, ShieldCheck, ChevronLeft, 
    Send, Paperclip, MoreVertical, Check, CheckCheck, Play, Pause, FileText, Search
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useRouter, useSearchParams } from 'next/navigation';
import VoiceRecorder from '../../components/VoiceRecorder';
import UpdateCustomizationModal from './UpdateCustomizationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../context/ShopContext';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='24' fill='%23e7e2cb'/%3E%3Cpath d='M50 105h60l-15-20-12 14-17-24-16 30z' fill='%23505039' fill-opacity='.35'/%3E%3Ccircle cx='98' cy='58' r='10' fill='%23505039' fill-opacity='.35'/%3E%3Crect x='35' y='35' width='90' height='90' rx='16' fill='none' stroke='%23505039' stroke-opacity='.22' stroke-width='6'/%3E%3C/svg%3E";
const WHATSAPP_SUPPORT_NUMBER = "919747723150";
const getWorkflowSteps = (type: string) => {
    if (type === 'bulk') {
        return ['pending_review', 'waiting_for_payment', 'approved', 'production_started', 'completed'];
    }
    return ['pending_review', 'designing_started', 'preview_sent', 'approved', 'production_started', 'completed'];
};

const getWorkflowLabels = (type: string) => {
    if (type === 'bulk') {
        return ['Review', 'Quotation', 'Approved', 'Production', 'Done'];
    }
    return ['Review', 'Designing', 'Preview', 'Approved', 'Production', 'Done'];
};

// --- Whatsapp-style Voice Message Player ---
const VoiceMessagePlayer = ({ src, isUser, durationText = "0:12" }: { src: string, isUser: boolean, durationText?: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={`flex items-center gap-3 w-[220px] max-w-full rounded-full p-1 ${isUser ? '' : ''}`}>
            <button 
                onClick={togglePlay} 
                className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-transform hover:scale-105 shadow-md ${isUser ? 'bg-white text-[var(--primary)]' : 'bg-[var(--primary)] text-white'}`}
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-0.5">
                    {/* Simulated Waveform */}
                    {Array.from({length: 15}).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-1 rounded-full ${isUser ? 'bg-white/70' : 'bg-[var(--primary)]/40'}`} 
                            style={{ 
                                height: Math.random() * 14 + 4 + 'px',
                                opacity: isPlaying ? 1 : 0.6,
                                animation: isPlaying ? `pulse 1s infinite ${i * 0.1}s` : 'none'
                            }}
                        ></div>
                    ))}
                </div>
                <div className={`text-[10px] font-black tracking-wider ${isUser ? 'text-white/80' : 'text-gray-500'}`}>
                    {durationText}
                </div>
            </div>
            <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} className="hidden" />
        </div>
    );
};

export default function DashboardRequests() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');
    const { setBuyNowItem } = useShop();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    useEffect(() => {
        if (typeParam === 'support') {
            setRequests(prevRequests => {
                const supportItem = prevRequests.find((req: any) => req.requestType === 'support');
                if (supportItem) {
                    setSelectedRequest(supportItem);
                }
                return prevRequests;
            });
        }
    }, [typeParam]);
    
    const [messageText, setMessageText] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [otherTyping, setOtherTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchRequests();
        const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL , { withCredentials: true });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        const poll = setInterval(() => fetchRequests(true), 25000);
        return () => clearInterval(poll);
    }, [selectedRequest?._id]);

    useEffect(() => {
        if (!socket) return;
        requests.forEach(req => socket.emit("join_request", req._id));
    }, [socket, requests]);

    useEffect(() => {
        if (!socket) return;

        if (selectedRequest?._id) socket.emit("join_request", selectedRequest._id);

        const handleReceiveMessage = (message: any) => {
            const targetId = message.requestId || selectedRequest?._id;
            if (!targetId) {
                fetchRequests(true);
                return;
            }
            setSelectedRequest((prev: any) => {
                if (!prev || prev._id !== targetId) return prev;
                return {
                    ...prev,
                    messages: [...(prev.messages || []), message]
                };
            });
            setRequests(prev => prev.map(req => 
                req._id === targetId
                ? { ...req, messages: [...(req.messages || []), message] }
                : req
            ));
        };

        const handleTyping = () => setOtherTyping(true);
        const handleStopTyping = () => setOtherTyping(false);
        const handleStatusUpdate = (data: any) => {
            const targetId = data.requestId || selectedRequest?._id;
            if (!targetId) {
                fetchRequests(true);
                return;
            }
            setSelectedRequest((prev: any) => prev?._id === targetId ? {...prev, ...data} : prev);
            setRequests(prev => prev.map(req => req._id === targetId ? { ...req, ...data } : req));
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_typing", handleTyping);
        socket.on("user_stopped_typing", handleStopTyping);
        socket.on("status_update", handleStatusUpdate);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("user_typing", handleTyping);
            socket.off("user_stopped_typing", handleStopTyping);
            socket.off("status_update", handleStatusUpdate);
        };
    }, [socket, selectedRequest?._id]);

    useEffect(() => {
        const t = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return () => clearTimeout(t);
    }, [selectedRequest?.messages]);

    // Instant scroll to bottom when switching conversations
    useEffect(() => {
        if (selectedRequest?._id) {
            const t = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
            }, 100);
            return () => clearTimeout(t);
        }
    }, [selectedRequest?._id]);

    const fetchRequests = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await api.get('/customization/my-requests');
            setRequests(res.data);

            // Check if there is an explicit query param to select support
            const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
            const forceSupport = params?.get('type') === 'support';

            if (forceSupport) {
                const supportItem = res.data.find((req: any) => req.requestType === 'support');
                if (supportItem) {
                    setSelectedRequest(supportItem);
                    return;
                }
            }

            if (selectedRequest?._id) {
                const freshSelected = res.data.find((req: any) => req._id === selectedRequest._id);
                if (freshSelected) setSelectedRequest(freshSelected);
            } else if (res.data.length > 0) {
                // Default select the Live Support request on load
                const supportItem = res.data.find((req: any) => req.requestType === 'support');
                if (supportItem) {
                    setSelectedRequest(supportItem);
                } else if (window.innerWidth > 1024) {
                    setSelectedRequest(res.data[0]);
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const resolveImage = (path: string) => {
        if (!path) return FALLBACK_IMAGE;
        if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
        const backend = config.api.replace('/api', '');
        if (path.startsWith('/uploads')) return `${backend}${path}`;
        if (path.startsWith('uploads/')) return `${backend}/${path}`;
        return `${backend}/uploads/${path.replace(/^\/+/, '')}`;
    };

    const getProductImageSource = (product: any) => (
        product?.primaryImage ||
        product?.coverImage ||
        product?.image ||
        product?.images?.[0] ||
        product?.images?.find?.((img: string) => Boolean(img)) ||
        ""
    );
    const productImage = (req: any) => resolveImage(getProductImageSource(req?.productId));
    const openProduct = (productId?: string) => {
        if (productId) router.push(`/product/${productId}`);
    };
    const openCheckout = (request?: any) => {
        const product = request?.productId;
        if (!product?._id) return;
        
        const isBulk = request?.requestType === 'bulk';
        const finalPrice = isBulk && request?.bulkData?.quotedPrice ? request.bulkData.quotedPrice : product.price;
        const finalQty = isBulk && request?.bulkData?.quantity ? request.bulkData.quantity : 1;

        setBuyNowItem({
            ...product,
            price: finalPrice,
            quantity: finalQty,
            categoryName: isBulk ? "Bulk Quotation" : "Custom Request",
            isCustom: true,
            customization: {
                customRequestId: request._id,
                requestId: `REQ-${String(request._id).slice(-6).toUpperCase()}`,
                designStatus: request.requestStatus
            },
            image: getProductImageSource(product)
        });
        router.push('/checkout');
    };
    const openWhatsAppChat = (request?: any) => {
        const requestId = request?._id ? `REQ-${String(request._id).slice(-6).toUpperCase()}` : 'Custom request';
        const productName = request?.productId?.name || 'Custom Request';
        const message = [
            'Hi Print Cloud,',
            `I want to chat about ${productName}.`,
            `Request ID: ${requestId}`
        ].join('\n');

        window.open(`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    };
    const timeAgo = (date?: string) => {
        if (!date) return 'now';
        // Avoid hydration mismatch by not calculating relative time during SSR
        if (typeof window === 'undefined') return '';
        const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
        if (mins < 1) return 'now';
        if (mins < 60) return `${mins}m ago`;
        if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
        return `${Math.floor(mins / 1440)}d ago`;
    };
    const previewText = (msg: any) => {
        if (!msg) return 'Waiting for response...';
        if (msg.type === 'audio' || msg.audio) return 'Voice message';
        if (msg.type === 'file' || msg.files?.length) return 'Attachment';
        if (msg.images?.length) return 'Image uploaded';
        return msg.text || 'New update';
    };
    const formatMessageText = (text: string) => (
        text.replace(/\b[A-Z]+(?:_[A-Z]+)+\b|\b(?:APPROVED|CANCELLED|PAID|UNPAID)\b/g, (status) =>
            status
                .toLowerCase()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase())
        )
    );
    const filteredRequests = requests.filter((req) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return (
            req.productId?.name?.toLowerCase().includes(query) ||
            req.designIdea?.toLowerCase().includes(query) ||
            req.requestStatus?.toLowerCase().includes(query) ||
            req.paymentStatus?.toLowerCase().includes(query) ||
            String(req._id || "").toLowerCase().includes(query) ||
            req.requestType === 'support'
        );
    });

    const pinnedRequests = [...filteredRequests];
    const supportIndex = pinnedRequests.findIndex(r => r.requestType === 'support');
    if (supportIndex > -1) {
        const [supportItem] = pinnedRequests.splice(supportIndex, 1);
        pinnedRequests.unshift(supportItem);
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
        if (socket && selectedRequest) {
            socket.emit("typing", { requestId: selectedRequest._id, user: "Customer" });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stop_typing", { requestId: selectedRequest._id, user: "Customer" });
            }, 2000);
        }
    };

    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    const removeAttachment = (idx: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== idx));
    };

    const sendMessage = async (e?: React.FormEvent, audioBlob?: Blob) => {
        if (e) e.preventDefault();
        if (!messageText.trim() && attachments.length === 0 && !audioBlob) return;

        setIsSending(true);
        const formData = new FormData();
        formData.append('text', messageText);

        attachments.forEach(file => {
            if (file.type.startsWith('image/')) {
                formData.append('images', file);
            } else {
                formData.append('files', file);
            }
        });

        if (audioBlob) {
            formData.append('audio', audioBlob, 'voice.webm');
        }

        try {
            await api.post(`/customization/${selectedRequest._id}/message`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessageText("");
            setAttachments([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteRequest = async () => {
        if (!selectedRequest) return;
        setIsSending(true); 

        try {
            await api.delete(`/customization/${selectedRequest._id}`);
            setRequests(prev => prev.filter(req => req._id !== selectedRequest._id));
            setSelectedRequest(null);
            setShowDeleteModal(false);
            setShowDropdown(false);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete request");
        } finally {
            setIsSending(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: any = {
            pending_review: "bg-[var(--secondary)]/10 text-[var(--text)] border border-[var(--secondary)]/20",
            waiting_for_payment: "bg-amber-100 text-amber-700 border border-amber-200",
            payment_verified: "bg-blue-100 text-blue-700 border border-blue-200",
            designing_started: "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20",
            preview_sent: "bg-indigo-100 text-indigo-700 border border-indigo-200",
            approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
            production_started: "bg-cyan-100 text-cyan-700 border border-cyan-200",
            completed: "bg-green-100 text-green-800 border border-green-200",
            rejected: "bg-red-100 text-red-700 border border-red-200"
        };
        return <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status?.replace(/_/g, ' ')}</span>;
    };

    if (loading) return <div className="p-10 text-center font-bold text-[var(--text)] opacity-50">Loading workspace...</div>;
    if (error) return <div className="text-red-500 p-10">{error}</div>;

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text)] opacity-40">
                <Sparkles size={48} className="mb-4" />
                <h3 className="text-xl font-bold">No requests yet</h3>
            </div>
        );
    }

    return (
        <>
        <style>{`
            .msg-root {
                display: flex;
                width: 100%;
                height: 100%;
                min-height: 0;
                overflow: hidden;
                position: relative;
                color: var(--text);
            }
            .msg-sidebar {
                width: 100%;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                min-height: 0;
                overflow: hidden;
                background: var(--bg);
                border-right: 1px solid rgba(128,128,100,0.12);
                z-index: 20;
            }
            .msg-sidebar.is-hidden-mobile { display: none; }
            .msg-chat {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-width: 0;
                min-height: 0;
                overflow: hidden;
                background: #efeae2;
                position: relative;
            }
            .msg-chat.is-hidden-mobile { display: none; }
            .msg-chat-empty {
                flex: 1;
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-width: 0;
                min-height: 0;
                background: #efeae2;
                position: relative;
            }
            .msg-messages {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                min-height: 0;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
            }
            .msg-input-bar {
                flex-shrink: 0;
                z-index: 20;
            }
            .msg-chat-header { flex-shrink: 0; z-index: 30; }
            .msg-progress { flex-shrink: 0; z-index: 10; }
            .msg-payment-bar { flex-shrink: 0; z-index: 10; }
            @media (min-width: 1024px) {
                .msg-sidebar {
                    width: 380px;
                    display: flex !important;
                }
                .msg-chat { display: flex !important; }
                .msg-chat.no-selection { display: none !important; }
                .msg-chat-empty.no-selection-desktop { display: flex !important; }
            }
            @media (min-width: 1024px) and (max-width: 1279px) {
                .msg-sidebar { width: 340px; }
            }
            @media (min-width: 1536px) {
                .msg-sidebar { width: 420px; }
            }
        `}</style>

        <div className="msg-root">
            {/* ══════ SIDEBAR ══════ */}
            <div className={`msg-sidebar ${selectedRequest ? 'is-hidden-mobile' : ''}`}>
                {/* Sidebar Header */}
                <div className="px-4 sm:px-5 pb-4 border-b border-[var(--secondary)]/10 bg-[var(--bg)] shrink-0" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
                    <button 
                        onClick={() => router.push('/dashboard')} 
                        className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg)] hover:bg-[var(--primary)] text-[var(--text)]/80 hover:text-[var(--bg)] border border-[var(--secondary)]/20 hover:border-[var(--primary)] transition-all duration-300 text-[10px] font-black uppercase tracking-widest mb-4 w-fit shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(80,80,57,0.12)] active:scale-95"
                    >
                        <ChevronLeft size={12} strokeWidth={3.5} className="text-[var(--primary)] group-hover:text-[var(--bg)] transition-colors transition-transform group-hover:-translate-x-0.5" /> 
                        <span>Back to Dashboard</span>
                    </button>
                    <div className="flex items-end justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_8px_var(--primary)]"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Live Design Desk</p>
                            </div>
                            <h2 className="text-2xl font-black text-[var(--text)] leading-none tracking-tight">
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
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search requests..." 
                            className="w-full h-11 sm:h-10 bg-[var(--secondary)]/5 border border-[var(--secondary)]/15 rounded-2xl py-2 pl-10 pr-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/30 text-[var(--text)] placeholder:text-[var(--text)]/40 transition-all shadow-sm"
                        />
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text)]/40 group-focus-within:text-[var(--primary)]/70 transition-colors" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-1 sm:p-3 space-y-1.5 overscroll-contain min-h-0" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
                    {pinnedRequests.map(req => {
                        const isSelected = selectedRequest?._id === req._id;
                        const latestMsg = req.messages?.[req.messages.length - 1];
                        const unreadCount = req.messages?.filter((m: any) => m.sender === 'admin' && !m.isRead)?.length || 0;
                        const isSupport = req.requestType === 'support';
                        const isMessage = req.requestType === 'message';
                        const isPlain = isSupport || isMessage; // no product / workflow / payment
                        return (
                            <motion.div 
                                whileHover={{ scale: 1.005 }}
                                whileTap={{ scale: 0.985 }}
                                key={req._id}
                                onClick={() => setSelectedRequest(req)}
                                className={`p-3.5 sm:p-4 rounded-[1.25rem] cursor-pointer transition-all border touch-manipulation group ${isSelected ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 shadow-[0_8px_20px_rgba(80,80,57,0.08)]' : 'bg-transparent border-transparent hover:bg-[var(--secondary)]/5 hover:border-[var(--secondary)]/10 active:bg-[var(--secondary)]/10'}`}
                            >
                                <div className="flex items-start gap-3.5 sm:gap-4">
                                    <div className="relative shrink-0">
                                        {/* Product image with proper fallback */}
                                        {isPlain ? (
                                            <div className={`w-14 h-14 rounded-[1rem] flex items-center justify-center shadow-md transition-transform group-hover:scale-105 group-active:scale-95 ${isMessage ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                                                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className={isMessage ? 'text-indigo-600' : 'text-emerald-600'}>
                                                    {isMessage ? (
                                                        <><path d="M4 4h16v12H5.17L4 17.17V4z"></path><path d="M8 9h8M8 12h5"></path></>
                                                    ) : (
                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                    )}
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 sm:w-14 sm:h-14 rounded-[1rem] overflow-hidden bg-[var(--secondary)]/5 border border-[var(--secondary)]/15 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-transform group-hover:scale-105 group-active:scale-95">
                                                <img
                                                    src={productImage(req)}
                                                    loading="lazy"
                                                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
                                                    className="w-full h-full object-cover"
                                                    alt={req.productId?.name || 'Product'}
                                                />
                                            </div>
                                        )}
                                        {isSupport && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[var(--bg)] rounded-full animate-pulse shadow-sm z-10"></div>
                                        )}
                                        {!isSupport && !isSelected && (unreadCount > 0 || req.requestStatus === 'preview_sent') && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00A884] border-2 border-[var(--bg)] rounded-full animate-pulse shadow-sm"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[56px] py-0.5">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-[15px] sm:text-[14px] truncate pr-2 text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{isSupport ? 'Live Support' : isMessage ? (req.designIdea || 'Message') : (req.productId?.name || 'Custom Product')}</h4>
                                            <span className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${unreadCount > 0 && !isSelected ? 'text-[#00A884]' : 'text-[var(--text)]/40'}`}>
                                                {isMounted ? timeAgo(latestMsg?.createdAt || req.updatedAt) : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-1.5 gap-2">
                                            <p className={`text-[13px] sm:text-[12px] truncate font-medium ${unreadCount > 0 && !isSelected ? 'text-[var(--text)] font-semibold' : 'text-[var(--text)]/60'}`}>
                                                {previewText(latestMsg)}
                                            </p>
                                            {unreadCount > 0 && !isSelected && (
                                                <div className="min-w-5 h-5 bg-[#00A884] text-white text-[10px] font-black px-1.5 rounded-full shrink-0 flex items-center justify-center shadow-sm">{unreadCount > 9 ? '9+' : unreadCount}</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                                            {isSupport ? (
                                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                                    Online Support
                                                </span>
                                            ) : isMessage ? (
                                                <>
                                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                        Message
                                                    </span>
                                                    {getStatusBadge(req.requestStatus)}
                                                </>
                                            ) : (
                                                <>
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${req.requestType === 'bulk' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                        {req.requestType === 'bulk' ? 'Bulk' : 'Custom'}
                                                    </span>
                                                    {getStatusBadge(req.requestStatus)}
                                                    {req.paymentStatus !== 'paid' && (
                                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                                                            Unpaid
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                    {filteredRequests.length === 0 && (
                        <div className="py-14 text-center text-[var(--text)]/45">
                            <Search size={28} className="mx-auto mb-3 opacity-60" />
                            <p className="text-sm font-black">No matching requests</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════ CHAT PANEL ══════ */}
            <div className={`msg-chat ${!selectedRequest ? 'is-hidden-mobile no-selection' : ''}`}>
                <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
                {selectedRequest && (
                    <>
                        {/* Mobile Header */}
                        {(selectedRequest.requestType === 'support' || selectedRequest.requestType === 'message') ? (
                            <div className="msg-chat-header lg:hidden flex items-center justify-between gap-2 border-b border-[var(--secondary)]/15 bg-[var(--bg)] px-2.5 py-2">
                                <button aria-label="Back" onClick={() => setSelectedRequest(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/10 text-[var(--text)] active:bg-[var(--secondary)]/20"><ChevronLeft size={24} strokeWidth={2.6} /></button>
                                <div className="flex min-w-0 flex-1 items-center gap-2 text-left">
                                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[var(--secondary)]/15 bg-emerald-500/10 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[var(--bg)] rounded-full animate-pulse shadow-sm z-10"></div>
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-black leading-tight text-[var(--text)]">{selectedRequest.requestType === 'message' ? (selectedRequest.designIdea || 'Message') : 'Live Support Team'}</span>
                                        <span className="block truncate text-[10px] font-bold text-emerald-600">{selectedRequest.requestType === 'message' ? 'Inquiry • We reply within 24h' : 'Online • Live Chat'}</span>
                                    </span>
                                </div>
                                <button onClick={() => openWhatsAppChat(selectedRequest)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/12 text-[#128C4A]"><svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></button>
                            </div>
                        ) : (
                            <div className="msg-chat-header lg:hidden flex items-center justify-between gap-2 border-b border-[var(--secondary)]/15 bg-[var(--bg)] px-2.5 py-2">
                                <button aria-label="Back" onClick={() => setSelectedRequest(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/10 text-[var(--text)] active:bg-[var(--secondary)]/20"><ChevronLeft size={24} strokeWidth={2.6} /></button>
                                <button type="button" onClick={() => openProduct(selectedRequest.productId?._id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[var(--secondary)]/15 bg-[var(--secondary)]/10"><img src={productImage(selectedRequest)} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }} className="h-full w-full object-cover" alt="" /></span>
                                    <span className="min-w-0"><span className="block truncate text-sm font-black leading-tight text-[var(--text)]">{selectedRequest.productId?.name || 'Custom Request'}</span><span className="block truncate text-[10px] font-bold text-[var(--text)]/55">ID: {String(selectedRequest._id).slice(-6).toUpperCase()}</span></span>
                                </button>
                                <button onClick={() => openWhatsAppChat(selectedRequest)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/12 text-[#128C4A]"><svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></button>
                            </div>
                        )}
                        {/* Desktop Header */}
                        {(selectedRequest.requestType === 'support' || selectedRequest.requestType === 'message') ? (
                            <div className="msg-chat-header hidden lg:flex items-center justify-between px-4 md:px-6 py-3 border-b border-[var(--secondary)]/10 bg-[var(--bg)]">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-full overflow-hidden bg-emerald-500/10 border border-emerald-500/20 shadow-sm shrink-0 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                            </svg>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg)] rounded-full animate-pulse z-10"></div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-[var(--text)] text-[16px] leading-tight truncate">{selectedRequest.requestType === 'message' ? (selectedRequest.designIdea || 'Message') : 'Live Support Team'}</h3>
                                        <span className="text-[11px] font-medium text-emerald-600 block flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                                            {selectedRequest.requestType === 'message' ? 'Inquiry • We reply within 24h' : 'Online • Help Desk'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 relative shrink-0">
                                    <button onClick={() => openWhatsAppChat(selectedRequest)} className="flex h-9 items-center gap-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-3 rounded-full text-[11px] font-bold transition-colors"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg><span className="hidden sm:inline">WhatsApp</span></button>
                                </div>
                            </div>
                        ) : (
                            <div className="msg-chat-header hidden lg:flex items-center justify-between px-4 md:px-6 py-3 border-b border-[var(--secondary)]/10 bg-[var(--bg)]">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative cursor-pointer" onClick={() => openProduct(selectedRequest.productId?._id)}>
                                        <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--secondary)]/10 border border-[var(--secondary)]/15 shadow-sm shrink-0"><img src={productImage(selectedRequest)} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }} className="w-full h-full object-cover" alt="" /></div>
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[var(--bg)] rounded-full animate-pulse z-10"></div>
                                    </div>
                                    <div className="min-w-0 cursor-pointer" onClick={() => openProduct(selectedRequest.productId?._id)}>
                                        <h3 className="font-bold text-[var(--text)] text-[16px] leading-tight truncate hover:text-[var(--primary)] transition-colors">{selectedRequest.productId?.name || 'Custom Request'}</h3>
                                        <span className="text-[11px] font-medium text-[var(--text)]/60 block">Online • ID: {String(selectedRequest._id).slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 relative shrink-0">
                                    <button onClick={() => openWhatsAppChat(selectedRequest)} className="flex h-9 items-center gap-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-3 rounded-full text-[11px] font-bold transition-colors"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg><span className="hidden sm:inline">WhatsApp</span></button>
                                    <button onClick={() => setShowDropdown(!showDropdown)} className="w-10 h-10 text-[var(--text)]/60 hover:text-[var(--text)] hover:bg-[var(--secondary)]/10 rounded-full transition-colors flex items-center justify-center"><MoreVertical size={20} /></button>
                                    <AnimatePresence>{showDropdown && (<motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-12 right-0 bg-[var(--bg)] border border-[var(--secondary)]/20 shadow-2xl rounded-2xl p-2 w-48 z-50 flex flex-col"><button onClick={() => { setShowDropdown(false); setShowUpdateModal(true); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-[var(--text)] hover:bg-[var(--secondary)]/10 rounded-xl transition-colors flex items-center gap-2"><Edit3 size={16} /> Update</button><button onClick={() => { setShowDropdown(false); setShowDeleteModal(true); }} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-red-500/10 text-red-500 rounded-xl transition-colors flex items-center gap-2 mt-1"><Trash2 size={16} /> Delete</button></motion.div>)}</AnimatePresence>
                                </div>
                            </div>
                        )}
                        {/* Progress */}
                        {selectedRequest.requestType !== 'support' && selectedRequest.requestType !== 'message' && (
                            <div className="msg-progress bg-[var(--bg)]/90 px-3 sm:px-5 pt-3 pb-3 border-b border-[var(--secondary)]/5 flex justify-center overflow-x-auto no-scrollbar">
                                {(() => {
                                    const steps = getWorkflowSteps(selectedRequest.requestType);
                                    const labels = getWorkflowLabels(selectedRequest.requestType);
                                    const currentStep = Math.max(0, steps.indexOf(selectedRequest.requestStatus));
                                    return (
                                        <div className="flex items-start justify-between w-full min-w-[380px] max-w-xl">
                                            {labels.map((step, idx) => {
                                                const isActive = idx <= currentStep;
                                                const isConnectorActive = idx < currentStep;
                                                return (
                                                    <div key={idx} className="relative flex w-14 shrink-0 flex-col items-center text-center">
                                                        <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black shadow-sm ${isActive ? 'bg-[var(--text)] text-[var(--bg)]' : 'bg-[var(--secondary)]/20 text-[var(--text)]/40'}`}>
                                                            {isActive && idx === 0 ? <Check size={12}/> : (idx + 1)}
                                                        </div>
                                                        <span className={`mt-1.5 block text-[8px] sm:text-[9px] font-black leading-none ${isActive ? 'text-[var(--text)]' : 'text-[var(--text)]/40'}`}>
                                                            {step}
                                                        </span>
                                                        {idx < labels.length - 1 && (
                                                            <div className={`absolute left-1/2 top-3 h-0.5 w-full ${isConnectorActive ? 'bg-[var(--text)]' : 'bg-[var(--secondary)]/20'}`}></div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                        {/* Payment Warning */}
                        {selectedRequest.requestType !== 'support' && selectedRequest.requestType !== 'message' && selectedRequest.paymentStatus !== 'paid' && (
                            <div className="msg-payment-bar bg-amber-50 border-b border-amber-200 px-3 sm:px-5 py-2.5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 flex-1 items-center gap-2">
                                        <AlertCircle size={15} className="text-amber-700 shrink-0" />
                                        <span className="text-[11px] sm:text-xs font-black text-amber-900">
                                            {selectedRequest.requestType === 'bulk' ? (
                                                selectedRequest.bulkData?.quotedPrice ? (
                                                    `Formal Quotation Received! Total: ₹${selectedRequest.bulkData.quotedTotal} for ${selectedRequest.bulkData.quantity} units (₹${selectedRequest.bulkData.quotedPrice}/unit). Please pay to start production.`
                                                ) : (
                                                    "Bulk Quotation requested. Our design & pricing team is calculating the best corporate quote for you."
                                                )
                                            ) : (
                                                "Payment pending. Design starts after confirmation."
                                            )}
                                        </span>
                                    </div>
                                    {(selectedRequest.requestType !== 'bulk' || selectedRequest.bulkData?.quotedPrice) && (
                                        <button onClick={() => openCheckout(selectedRequest)} className="h-8 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-3 rounded-lg shadow-md transition-colors shrink-0">Pay Now</button>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Messages */}
                        <div className="msg-messages px-3 pb-3 pt-3 sm:px-4 md:px-6 space-y-2.5 relative z-0">
                            <div className="flex justify-center my-3"><span className="bg-white/80 border border-[var(--secondary)]/10 text-[#667781] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">Today</span></div>
                            {selectedRequest.messages?.map((msg: any, idx: number) => { const isUser = msg.sender === 'user'; const showTail = idx === 0 || selectedRequest.messages[idx - 1].sender !== msg.sender; return (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
                                    <div className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 shadow-[0_1px_4px_rgba(17,27,33,0.06)] ring-1 ring-black/[0.04] ${isUser ? 'bg-[#d9fdd3] text-[#111B21] rounded-br-md' : 'bg-white text-[#111B21] rounded-bl-md'} ${showTail && isUser ? 'rounded-tr-md' : ''} ${showTail && !isUser ? 'rounded-tl-md' : ''}`}>
                                        {!isUser && showTail && (<div className="text-[12px] font-bold text-[#00A884] mb-1">Design Team</div>)}
                                        {msg.text && (<p className="text-[14px] leading-[1.45] whitespace-pre-wrap break-words pr-1 font-medium">{formatMessageText(msg.text)}</p>)}
                                        {msg.audio && (<div className="mt-1 mb-1"><VoiceMessagePlayer src={resolveImage(msg.audio)} isUser={isUser} /></div>)}
                                        {msg.images?.length > 0 && (<div className={`mt-1.5 grid gap-1 ${msg.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>{msg.images.map((img: string, i: number) => (<a key={i} href={resolveImage(img)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-black/5"><img src={resolveImage(img)} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }} className="w-full h-40 md:h-48 object-cover" /></a>))}</div>)}
                                        {msg.files?.length > 0 && (<div className="mt-1.5 space-y-1">{msg.files.map((file: string, i: number) => { const ext = file.split('.').pop()?.toUpperCase() || 'FILE'; return (<a key={i} href={resolveImage(file)} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-2.5 rounded-xl ${isUser ? 'bg-black/5' : 'bg-gray-50'}`}><div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] relative ${isUser ? 'bg-[#00A884] text-white' : 'bg-[var(--primary)] text-white'}`}><FileText size={20} className="absolute opacity-30" /><span className="relative z-10">{ext}</span></div><span className="text-[13px] font-medium truncate flex-1">{file.split('/').pop()?.split('-').slice(2).join('-') || 'Document.pdf'}</span></a>); })}</div>)}
                                        {!isUser && msg.images?.length > 0 && selectedRequest.requestStatus === 'preview_sent' && (<div className="mt-3 bg-white/50 rounded-xl p-3 border border-[var(--secondary)]/10 text-center"><h5 className="text-[12px] font-bold mb-2">Preview Uploaded</h5><div className="flex gap-2"><button className="flex-1 bg-[#00A884] hover:bg-[#008f6f] text-white text-[12px] font-bold py-2 rounded-lg">Approve</button><button className="flex-1 bg-[var(--secondary)]/10 text-[var(--text)] text-[12px] font-bold py-2 rounded-lg">Request Changes</button></div></div>)}
                                        <div className="flex items-center justify-end gap-1 mt-1.5 float-right pl-3 text-[10px] leading-none text-[#667781]">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}{isUser && (msg.isRead ? <CheckCheck size={14} className="text-[#53bdeb] ml-0.5"/> : <Check size={14} className="ml-0.5"/>)}</div>
                                        <div className="clear-both"></div>
                                    </div>
                                </motion.div>
                            ); })}
                            {otherTyping && (<div className="flex justify-start"><div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-[var(--text)]/40 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div><div className="w-1.5 h-1.5 bg-[var(--text)]/40 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div><div className="w-1.5 h-1.5 bg-[var(--text)]/40 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div></div></div>)}
                            <div ref={messagesEndRef} className="h-1" />
                        </div>
                        {/* Input Bar */}
                        <div className="msg-input-bar px-3 pt-2 md:px-5 bg-[#f0f2f5] border-t border-black/5" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
                            {attachments.length > 0 && (<div className="flex gap-2 mb-2 overflow-x-auto pb-2">{attachments.map((file, i) => (<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={i} className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-black/10 bg-white flex items-center justify-center shadow-sm">{file.type.startsWith('image/') ? (<img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />) : (<div className="flex flex-col items-center gap-1"><FileText size={16} className="text-gray-500" /><span className="text-[8px] font-bold text-gray-500 uppercase">{file.name.split('.').pop()}</span></div>)}<button onClick={() => removeAttachment(i)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500"><X size={10} /></button></motion.div>))}</div>)}
                            <div className="flex items-end gap-2 relative">
                                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileAttach} />
                                <form onSubmit={sendMessage} className="flex-1 flex items-end bg-white rounded-[1.65rem] min-h-[48px] shadow-[0_1px_6px_rgba(17,27,33,0.06)] border border-black/5 pr-1.5 py-1">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-10 h-10 flex items-center justify-center text-[#54656f] hover:bg-gray-100 rounded-full transition-colors shrink-0 ml-0.5"><Paperclip size={20} className="rotate-45" /></button>
                                    <textarea value={messageText} onChange={(e) => { handleTextChange(e as any); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }} placeholder="Type a message" rows={1} className="flex-1 bg-transparent px-2 py-3 text-[16px] leading-6 resize-none focus:outline-none placeholder:text-[#8696a0] text-[#111b21] min-w-0" disabled={isSending} style={{ minHeight: '40px', maxHeight: '120px' }} />
                                </form>
                                <div className="shrink-0">{messageText.trim() || attachments.length > 0 ? (<motion.button initial={{ scale: 0.8 }} animate={{ scale: 1 }} type="button" onClick={() => sendMessage()} disabled={isSending} className="w-11 h-11 flex items-center justify-center bg-[#00A884] text-white rounded-full hover:bg-[#008f6f] shadow-sm transition-all disabled:opacity-50">{isSending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send size={20} className="ml-1" />}</motion.button>) : (<VoiceRecorder onSend={(blob) => sendMessage(undefined, blob)} />)}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ══════ EMPTY STATE (Desktop) ══════ */}
            <div className={`msg-chat-empty ${!selectedRequest ? 'no-selection-desktop' : ''}`}>
                <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
                <div className="text-center flex flex-col items-center z-10 p-8">
                    <div className="w-24 h-24 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-6"><ShieldCheck size={48} className="text-[var(--primary)]" /></div>
                    <h2 className="text-3xl font-black text-[var(--text)]">Workspace Connect</h2>
                    <p className="text-sm font-bold text-[var(--text)]/60 max-w-xs mt-2">Select a request to start collaborating.</p>
                </div>
            </div>
        </div>

        {/* Modals */}
        <AnimatePresence>{showDeleteModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"><div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={32} className="text-red-500" /></div><h3 className="text-2xl font-black text-center text-[var(--text)] mb-3">Delete Request?</h3><p className="text-[var(--text)]/60 text-center font-medium mb-8">Are you sure? This cannot be undone.</p><div className="flex gap-4"><button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3.5 rounded-2xl bg-[var(--secondary)]/10 text-[var(--text)] font-black text-xs hover:bg-[var(--secondary)]/20">Cancel</button><button onClick={handleDeleteRequest} disabled={isSending} className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white font-black text-xs hover:bg-red-600 shadow-lg disabled:opacity-50 flex items-center justify-center">{isSending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "Delete Now"}</button></div></motion.div></motion.div>)}</AnimatePresence>
        {showUpdateModal && selectedRequest && (<UpdateCustomizationModal request={selectedRequest} onClose={() => setShowUpdateModal(false)} onUpdate={(updatedData) => { setSelectedRequest(updatedData); setRequests(prev => prev.map(r => r._id === updatedData._id ? updatedData : r)); }} />)}
        </>
    );
}


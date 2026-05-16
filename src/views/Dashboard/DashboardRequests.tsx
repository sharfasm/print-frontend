"use client";
import React, { useState, useEffect, useRef } from 'react';
import config from '../../brand/config';
import api from '../../lib/axios';
import { 
    Clock, AlertCircle, Edit3, X, CheckCircle, Package, 
    CreditCard, Sparkles, MessageSquare, Image as ImageIcon, 
    Trash2, Plus, Upload, ShieldCheck, ChevronRight, ChevronLeft, 
    Send, Paperclip, MoreVertical, Check, CheckCheck
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import VoiceRecorder from '../../components/VoiceRecorder';
import UpdateCustomizationModal from './UpdateCustomizationModal';

export default function DashboardRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    
    // Chat states
    const [messageText, setMessageText] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [otherTyping, setOtherTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchRequests();
        const newSocket = io("http://localhost:5000", { withCredentials: true });
        setSocket(newSocket);

        newSocket.on("receive_message", (message) => {
            setRequests(prev => prev.map(req => {
                // If it's for the currently open request
                if (selectedRequest && req._id === selectedRequest._id) {
                    // Update selected request automatically in the effect below? No, react state is tricky here.
                    // Instead, we will rely on selectedRequest reference updating, or just update the master list
                }
                return req; // We need to inject the message into the correct request in the state
            }));
            
            // To properly update the specific request's messages:
            setRequests(prev => prev.map(req => {
                // Check if message belongs to this request (we might need requestId in payload, but backend sends just message)
                // Actually backend sends just the message object. Wait, how do we know which request it belongs to?
                // The socket is joined to a specific room "request_ID". We need to listen dynamically.
                return req;
            }));
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !selectedRequest) return;

        socket.emit("join_request", selectedRequest._id);

        const handleReceiveMessage = (message: any) => {
            setSelectedRequest((prev: any) => ({
                ...prev,
                messages: [...(prev.messages || []), message]
            }));
            setRequests(prev => prev.map(req => 
                req._id === selectedRequest._id 
                ? { ...req, messages: [...(req.messages || []), message] }
                : req
            ));
        };

        const handleTyping = () => setOtherTyping(true);
        const handleStopTyping = () => setOtherTyping(false);
        const handleStatusUpdate = (data: any) => {
            setSelectedRequest((prev: any) => ({...prev, ...data}));
            setRequests(prev => prev.map(req => req._id === selectedRequest._id ? { ...req, ...data } : req));
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedRequest?.messages]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get('/customization/my-requests');
            setRequests(res.data);
            if (res.data.length > 0 && !selectedRequest) {
                // Don't auto-select on mobile, but maybe on desktop
                if(window.innerWidth > 1024) setSelectedRequest(res.data[0]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resolveImage = (path: string) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `${config.api.replace('/api', '')}/${path}`;
    };

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
        setIsSending(true); // Re-use isSending for loading state

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
            pending_review: "bg-gray-100 text-gray-700",
            waiting_for_payment: "bg-amber-100 text-amber-700",
            payment_verified: "bg-blue-100 text-blue-700",
            designing_started: "bg-purple-100 text-purple-700",
            preview_sent: "bg-indigo-100 text-indigo-700",
            approved: "bg-emerald-100 text-emerald-700",
            production_started: "bg-cyan-100 text-cyan-700",
            completed: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-700"
        };
        return <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status?.replace(/_/g, ' ')}</span>;
    };

    if (loading) return <div className="p-10 text-center font-bold opacity-50">Loading workspace...</div>;
    if (error) return <div className="text-red-500 p-10">{error}</div>;

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <Sparkles size={48} className="mb-4" />
                <h3 className="text-xl font-bold">No customization requests yet</h3>
            </div>
        );
    }

    return (
        <div className="flex h-[80vh] min-h-[600px] bg-[var(--bg)] border border-gray-200/50 rounded-[2.5rem] shadow-2xl overflow-hidden relative text-[var(--text)] transition-colors duration-500">
            
            {/* LEFT PANEL - Request List */}
            <div className={`w-full lg:w-[380px] flex-shrink-0 border-r border-gray-200/30 bg-white/40 backdrop-blur-md flex flex-col transition-transform duration-300 ${selectedRequest ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-6 border-b border-gray-200/30 bg-white/60">
                    <h2 className="text-xl font-black flex items-center gap-2 text-[var(--text)]">
                        <MessageSquare size={20} className="text-[var(--primary)]" />
                        Active Requests
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {requests.map(req => {
                        const isSelected = selectedRequest?._id === req._id;
                        const latestMsg = req.messages?.[req.messages.length - 1];
                        return (
                            <div 
                                key={req._id}
                                onClick={() => setSelectedRequest(req)}
                                className={`p-4 rounded-3xl cursor-pointer transition-all border-2 ${isSelected ? 'bg-white border-[var(--primary)] shadow-lg scale-[1.02] z-10' : 'bg-white/50 border-transparent hover:bg-white/80 hover:scale-[1.01]'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <img src={resolveImage(req.productId?.images?.[0])} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-black text-sm truncate pr-2 text-[var(--text)]">{req.productId?.name}</h4>
                                            <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                                                {latestMsg ? new Date(latestMsg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'New'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-500 truncate pr-2 font-bold opacity-70">
                                                {latestMsg ? (latestMsg.type === 'audio' ? '🎤 Voice message' : latestMsg.type === 'file' ? '📎 Attachment' : latestMsg.text) : 'Waiting for designer...'}
                                            </p>
                                            {req.requestStatus === 'preview_sent' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shrink-0 animate-pulse"></div>}
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            {getStatusBadge(req.requestStatus)}
                                            {req.paymentStatus === 'paid' && <CheckCircle size={10} className="text-emerald-500" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* RIGHT PANEL - Active Conversation */}
            <div className={`flex-1 flex flex-col bg-white/20 backdrop-blur-sm ${!selectedRequest ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
                {!selectedRequest ? (
                    <div className="text-center opacity-40 flex flex-col items-center">
                        <div className="w-24 h-24 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-6">
                            <ShieldCheck size={48} className="text-[var(--primary)]" />
                        </div>
                        <h2 className="text-3xl font-black text-[var(--text)]">Design Workspace</h2>
                        <p className="text-sm font-bold text-gray-500 max-w-xs">Select a request from the list to start collaborating with our design team.</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="h-[96px] px-8 border-b border-gray-200/30 bg-white/80 backdrop-blur-lg flex items-center justify-between shadow-sm z-10 shrink-0">
                            <div className="flex items-center gap-5">
                                <button className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 text-[var(--text)]" onClick={() => setSelectedRequest(null)}>
                                    <ChevronLeft size={24} />
                                </button>
                                <img src={resolveImage(selectedRequest.productId?.images?.[0])} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md" />
                                <div>
                                    <h3 className="font-black text-[var(--text)] text-lg leading-tight">{selectedRequest.productId?.name}</h3>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] font-black text-[var(--primary)]/60 bg-[var(--primary)]/5 px-2 py-0.5 rounded-full uppercase tracking-widest">REQ-{(selectedRequest._id as string).slice(-6)}</span>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                        {selectedRequest.paymentStatus === 'paid' ? 
                                            <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1"><CheckCircle size={10}/> Paid</span> :
                                            <span className="text-[10px] font-black text-amber-600 uppercase flex items-center gap-1"><AlertCircle size={10}/> Unpaid</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 relative">
                                <span className="bg-[var(--primary)] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[var(--primary)]/20">
                                    {selectedRequest.designStatus.replace(/_/g, ' ')}
                                </span>
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {showDropdown && (
                                    <div className="absolute top-12 right-0 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 w-48 z-50 flex flex-col">
                                        <button 
                                            onClick={() => { setShowDropdown(false); setShowUpdateModal(true); }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
                                        >
                                            <Edit3 size={16} /> Update Request
                                        </button>
                                        <button 
                                            onClick={() => { setShowDropdown(false); setShowDeleteModal(true); }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-red-50 text-red-600 rounded-xl transition-colors flex items-center gap-2 mt-1"
                                        >
                                            <Trash2 size={16} /> Delete Request
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Custom Delete Confirmation Modal */}
                        {showDeleteModal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                                <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-300">
                                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Trash2 size={32} className="text-red-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-center text-gray-900 mb-3">Delete Request?</h3>
                                    <p className="text-gray-500 text-center font-medium mb-8 leading-relaxed">
                                        Are you sure you want to permanently delete this customization request? This action cannot be undone.
                                    </p>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setShowDeleteModal(false)}
                                            className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 text-gray-900 font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleDeleteRequest}
                                            disabled={isSending}
                                            className="flex-1 py-4 px-6 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {isSending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "Delete Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Warning */}
                        {selectedRequest.paymentStatus !== 'paid' && (
                            <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center justify-center gap-2 shrink-0">
                                <AlertCircle size={14} className="text-amber-600" />
                                <span className="text-xs font-bold text-amber-800">Payment pending. Design work will start after confirmation.</span>
                            </div>
                        )}

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white/5">
                            {/* Form Request Intro Box */}
                            <div className="flex justify-center mb-10">
                                <div 
                                    onClick={() => setShowUpdateModal(true)}
                                    className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-[2.5rem] p-8 max-w-lg text-center shadow-xl cursor-pointer hover:shadow-2xl hover:border-[var(--primary)] transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50"></div>
                                    <Package size={28} className="mx-auto text-gray-300 mb-4 group-hover:text-[var(--primary)] group-hover:scale-110 transition-all" />
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3 group-hover:text-[var(--primary)] transition-colors">Initial Customization Data</h4>
                                    <p className="text-base font-bold text-[var(--text)] italic leading-relaxed">"{selectedRequest.designIdea}"</p>
                                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <Edit3 size={12}/> CLICK TO EDIT REQUEST
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.messages?.map((msg: any, idx: number) => {
                                const isUser = msg.sender === 'user';
                                return (
                                    <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`group relative max-w-[85%] md:max-w-[70%] rounded-[2rem] p-5 shadow-lg ${isUser ? 'bg-[var(--primary)] text-white rounded-tr-sm shadow-[var(--primary)]/20' : 'bg-white text-[var(--text)] border border-gray-100 rounded-tl-sm'}`}>
                                            
                                            <div className="flex items-center justify-between gap-6 mb-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isUser ? 'text-white/60' : 'text-[var(--primary)]/60'}`}>
                                                    {isUser ? 'YOU' : 'DESIGN TEAM'}
                                                </span>
                                            </div>

                                            {/* Text */}
                                            {msg.text && <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                                            {/* Audio */}
                                            {msg.audio && (
                                                <div className="mt-3">
                                                    <audio controls src={resolveImage(msg.audio)} className={`h-10 w-full max-w-[250px] outline-none rounded-full ${isUser ? 'brightness-200' : ''}`} />
                                                </div>
                                            )}

                                            {/* Images */}
                                            {msg.images?.length > 0 && (
                                                <div className={`mt-4 grid gap-3 ${msg.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                                    {msg.images.map((img: string, i: number) => (
                                                        <a key={i} href={resolveImage(img)} target="_blank" rel="noreferrer" className="block relative group/img overflow-hidden rounded-2xl border-2 border-white/10 shadow-md">
                                                            <img src={resolveImage(img)} className="w-full h-40 object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                                                                <ImageIcon size={24} className="text-white scale-75 group-hover/img:scale-100 transition-transform" />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Files */}
                                            {msg.files?.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {msg.files.map((file: string, i: number) => {
                                                        const ext = file.split('.').pop()?.toUpperCase() || 'FILE';
                                                        return (
                                                            <a key={i} href={resolveImage(file)} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${isUser ? 'bg-white/10 border-white/5 hover:bg-white/20' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[9px] ${isUser ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'}`}>
                                                                    {ext}
                                                                </div>
                                                                <span className="text-xs font-bold truncate flex-1">{file.split('/').pop()?.split('-').slice(2).join('-') || 'Document attached'}</span>
                                                            </a>
                                                        )
                                                    })}
                                                </div>
                                            )}

                                            <div className={`flex items-center justify-end gap-1 mt-2 text-[9px] font-bold ${isUser ? 'text-white/40' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                {isUser && (msg.isRead ? <CheckCheck size={12} className="text-blue-400 ml-1"/> : <Check size={12} className="ml-1"/>)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {otherTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 rounded-3xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-6 bg-white border-t border-gray-200/30 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                            
                            {attachments.length > 0 && (
                                <div className="flex gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {attachments.map((file, i) => (
                                        <div key={i} className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-[var(--primary)]/20 bg-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                                            {file.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <FileText size={20} className="text-[var(--primary)]" />
                                                    <span className="text-[10px] font-black text-gray-500 uppercase">{file.name.split('.').pop()}</span>
                                                </div>
                                            )}
                                            <button onClick={() => removeAttachment(i)} className="absolute top-1.5 right-1.5 bg-black/80 text-white p-1 rounded-full hover:bg-red-500 transition-all hover:scale-110">
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-end gap-4">
                                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileAttach} />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-4 text-gray-400 hover:text-[var(--primary)] bg-gray-50 hover:bg-[var(--primary)]/5 rounded-2xl transition-all flex shrink-0 shadow-inner"
                                >
                                    <Paperclip size={24} />
                                </button>

                                <form onSubmit={sendMessage} className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-[2.5rem] p-2 shadow-inner focus-within:ring-2 focus-within:ring-[var(--primary)]/30 focus-within:bg-white transition-all">
                                    <input 
                                        value={messageText}
                                        onChange={handleTextChange}
                                        placeholder="Type your design feedback here..."
                                        className="flex-1 bg-transparent px-5 py-3 text-sm font-bold focus:outline-none placeholder-gray-400 text-[var(--text)]"
                                        disabled={isSending}
                                    />
                                    {messageText.trim() || attachments.length > 0 ? (
                                        <button 
                                            type="submit"
                                            disabled={isSending}
                                            className="w-12 h-12 flex items-center justify-center bg-[var(--primary)] text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--primary)]/30 shrink-0 disabled:opacity-50"
                                        >
                                            {isSending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send size={20} className="ml-1" />}
                                        </button>
                                    ) : (
                                        <div className="shrink-0 mr-1">
                                            <VoiceRecorder onSend={(blob) => sendMessage(undefined, blob)} />
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showUpdateModal && selectedRequest && (
                <UpdateCustomizationModal 
                    request={selectedRequest} 
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={(updatedData) => {
                        setSelectedRequest(updatedData);
                        setRequests(prev => prev.map(r => r._id === updatedData._id ? updatedData : r));
                    }}
                />
            )}
        </div>
    );
}

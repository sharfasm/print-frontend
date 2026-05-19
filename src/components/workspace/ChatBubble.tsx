"use client";
import React, { useState, useRef } from 'react';
import { Play, Pause, Check, CheckCheck, Image as ImageIcon, ThumbsUp, MessageSquareText } from 'lucide-react';

const resolveImg = (path: string, backend: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${backend}/${path}`;
};

interface ChatBubbleProps {
    msg: any;
    backend: string;
    onApprovePreview?: () => void;
    onRequestChanges?: () => void;
}

export default function ChatBubble({ msg, backend, onApprovePreview, onRequestChanges }: ChatBubbleProps) {
    const isUser = msg.sender === 'user';
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (playing) audioRef.current.pause();
        else audioRef.current.play();
        setPlaying(!playing);
    };

    const staticBars = Array.from({ length: 24 }, (_, i) => 4 + ((i * 7 + 5) % 20));

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 px-3 sm:px-4 animate-[fadeSlideUp_0.3s_ease]`}>
            <div className={`relative max-w-[80%] sm:max-w-[75%] lg:max-w-[65%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                isUser
                    ? 'bg-[var(--primary)] text-[var(--bg)] rounded-br-sm'
                    : 'bg-[var(--bg)] text-[var(--text)] border border-[var(--secondary)]/15 rounded-bl-sm'
            }`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isUser ? 'text-[var(--bg)]/50' : 'text-[var(--primary)]/60'}`}>
                    {isUser ? 'You' : 'Design Team'}
                </p>

                {msg.text && <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                {msg.audio && (
                    <div className="flex items-center gap-2 mt-1.5 min-w-[180px]">
                        <button onClick={toggleAudio} className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-white/20' : 'bg-[var(--primary)]/10'}`}>
                            {playing ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                        </button>
                        <div className="flex items-end gap-[2px] flex-1 h-6">
                            {staticBars.map((h, i) => (
                                <div key={i} className="rounded-full transition-all duration-100" style={{
                                    height: `${h}px`, width: '2.5px',
                                    backgroundColor: (i / staticBars.length) * 100 <= progress
                                        ? (isUser ? '#fff' : 'var(--primary)')
                                        : (isUser ? 'rgba(255,255,255,0.3)' : 'var(--secondary)'),
                                }} />
                            ))}
                        </div>
                        <span className={`text-[10px] font-bold tabular-nums ${isUser ? 'text-[var(--bg)]/50' : 'text-[var(--text)]/40'}`}>
                            {audioRef.current ? `0:${Math.floor(audioRef.current.duration || 0).toString().padStart(2,'0')}` : '0:00'}
                        </span>
                        <audio ref={audioRef} src={resolveImg(msg.audio, backend)} className="hidden"
                            onTimeUpdate={() => { if (audioRef.current) setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100); }}
                            onEnded={() => { setPlaying(false); setProgress(0); }}
                        />
                    </div>
                )}

                {msg.images?.length > 0 && (
                    <div className={`mt-2 grid gap-1.5 ${msg.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {msg.images.map((img: string, i: number) => (
                            <a key={i} href={resolveImg(img, backend)} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden group/img">
                                <img src={resolveImg(img, backend)} className="w-full h-32 sm:h-40 object-cover group-hover/img:scale-105 transition-transform duration-300" alt="" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Image'; }} />
                            </a>
                        ))}
                    </div>
                )}

                {msg.files?.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {msg.files.map((file: string, i: number) => (
                            <a key={i} href={resolveImg(file, backend)} target="_blank" rel="noreferrer"
                                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-bold ${isUser ? 'bg-[var(--bg)]/10 hover:bg-[var(--bg)]/20' : 'bg-[var(--secondary)]/5 hover:bg-[var(--secondary)]/10'} transition-colors`}>
                                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-black ${isUser ? 'bg-[var(--bg)] text-[var(--text)]' : 'bg-[var(--secondary)]/15 text-[var(--text)]/60'}`}>
                                    {file.split('.').pop()?.toUpperCase() || 'FILE'}
                                </div>
                                <span className="truncate flex-1">{file.split('/').pop()?.split('-').slice(2).join('-') || 'Document'}</span>
                            </a>
                        ))}
                    </div>
                )}

                {/* Preview card for design previews */}
                {msg.type === 'preview' && msg.previewImage && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/10">
                        <img src={resolveImg(msg.previewImage, backend)} className="w-full h-40 object-cover" alt="Preview" />
                        <div className="p-3 space-y-2">
                            <p className="text-xs font-bold">Design Preview Uploaded</p>
                            <div className="flex gap-2">
                                <button onClick={onApprovePreview} className="flex-1 py-2 bg-emerald-500 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-emerald-600 transition-colors">
                                    <ThumbsUp size={12} /> Approve
                                </button>
                                <button onClick={onRequestChanges} className="flex-1 py-2 bg-white/20 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-white/30 transition-colors">
                                    <MessageSquareText size={12} /> Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isUser ? 'text-[var(--bg)]/35' : 'text-[var(--text)]/40'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isUser && (msg.isRead ? <CheckCheck size={11} className="text-blue-300 ml-0.5" /> : <Check size={11} className="ml-0.5" />)}
                </div>
            </div>
        </div>
    );
}

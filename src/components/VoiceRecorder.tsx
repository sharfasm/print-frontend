import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
    onSend: (audioBlob: Blob) => void;
}

export default function VoiceRecorder({ onSend }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const sendAfterStopRef = useRef(false);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                if (sendAfterStopRef.current) {
                    sendAfterStopRef.current = false;
                    onSend(audioBlob);
                    setRecordingTime(0);
                    return;
                }
                const url = URL.createObjectURL(audioBlob);
                setAudioBlob(audioBlob);
                setAudioUrl(url);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = (sendNow = false) => {
        if (mediaRecorderRef.current && isRecording) {
            sendAfterStopRef.current = sendNow;
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const togglePlayback = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSend = () => {
        if (audioBlob) {
            onSend(audioBlob);
            setAudioBlob(null);
            setAudioUrl(null);
            setRecordingTime(0);
        }
    };

    const cancelRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    if (audioUrl) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-[var(--bg)] border border-[var(--secondary)]/20 shadow-lg rounded-full px-4 py-2 w-full max-w-[280px]"
            >
                <button onClick={cancelRecording} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                </button>
                <button onClick={togglePlayback} className="w-8 h-8 flex shrink-0 items-center justify-center bg-[var(--primary)] text-white rounded-full">
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-1" />}
                </button>
                <div className="flex-1 h-2 bg-[var(--secondary)]/10 rounded-full overflow-hidden relative flex items-center">
                    {/* Visual waveform placeholder */}
                    <div className="h-full bg-[var(--primary)]/50 absolute left-0 top-0 bottom-0 transition-all duration-100" style={{ width: isPlaying ? '100%' : '30%' }}></div>
                    <div className="w-full h-full flex items-center justify-between px-1 relative z-10">
                        {Array.from({length: 12}).map((_, i) => (
                            <div key={i} className="w-0.5 bg-[var(--primary)] rounded-full" style={{ height: Math.random() * 6 + 2 + 'px' }}></div>
                        ))}
                    </div>
                </div>
                <span className="text-xs font-bold text-[var(--text)]/60">{formatTime(recordingTime)}</span>
                <button onClick={handleSend} className="w-8 h-8 flex shrink-0 items-center justify-center bg-[var(--primary)] text-white rounded-full hover:scale-105 transition-transform shadow-md">
                    <Send size={14} className="mr-0.5 mt-0.5" />
                </button>
                <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} className="hidden" />
            </motion.div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <AnimatePresence>
                {isRecording && (
                    <motion.div 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full px-4 py-2 flex-1 shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden whitespace-nowrap"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]" 
                        />
                        <span className="text-sm font-black flex-1">{formatTime(recordingTime)}</span>
                        <span className="text-xs text-red-500/70 mr-2 uppercase tracking-widest hidden sm:inline">Release to send</span>
                        <button onClick={() => stopRecording(true)} className="w-8 h-8 flex shrink-0 items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-105">
                            <Square size={12} fill="currentColor" />
                        </button>
                        <button onClick={cancelRecording} className="w-8 h-8 flex shrink-0 items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors ml-1">
                            <Trash2 size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isRecording && (
                <button 
                    type="button"
                    onPointerDown={startRecording}
                    onPointerUp={() => stopRecording(true)}
                    onPointerCancel={cancelRecording}
                    className="w-12 h-12 flex shrink-0 items-center justify-center bg-[var(--primary)] text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/30"
                    title="Hold to record"
                >
                    <Mic size={22} />
                </button>
            )}
        </div>
    );
}

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Send } from 'lucide-react';

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

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
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
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 w-full">
                <button onClick={cancelRecording} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                </button>
                <button onClick={togglePlayback} className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-[var(--bg)] rounded-full">
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-1" />}
                </button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    {/* Visual waveform placeholder */}
                    <div className="h-full bg-[var(--primary)] w-full opacity-50 relative">
                       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4=')]"></div>
                    </div>
                </div>
                <span className="text-xs font-bold text-gray-500">{formatTime(recordingTime)}</span>
                <button onClick={handleSend} className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-[var(--bg)] rounded-full hover:scale-105 transition-transform">
                    <Send size={14} className="mr-0.5 mt-0.5" />
                </button>
                <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} className="hidden" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {isRecording ? (
                <div className="flex items-center gap-3 bg-red-50 text-red-600 rounded-full px-4 py-2 flex-1 animate-pulse border border-red-100">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-black flex-1">{formatTime(recordingTime)}</span>
                    <button onClick={stopRecording} className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full shadow-lg">
                        <Square size={12} fill="currentColor" />
                    </button>
                </div>
            ) : (
                <button 
                    type="button"
                    onClick={startRecording}
                    className="p-3 text-gray-400 hover:text-[var(--primary)] hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                >
                    <Mic size={22} />
                </button>
            )}
        </div>
    );
}

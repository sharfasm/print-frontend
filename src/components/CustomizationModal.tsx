import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft, Eye, Trash2, Image as ImageIcon, MessageCircle, CheckCircle2, ShoppingBag, LayoutDashboard, AlertCircle, Sparkles } from 'lucide-react';
import config from '../brand/config';

export default function CustomizationModal({ isOpen, onClose, product }) {
  const { isLoggedIn } = useAuth();
  const { triggerAuthGuard } = useShop();
  const router = useRouter();
  
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [designIdea, setDesignIdea] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // States for images (Files)
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [customerImages, setCustomerImages] = useState<File[]>([]);
  
  // States for preview URLs
  const [refPreviews, setRefPreviews] = useState<string[]>([]);
  const [custPreviews, setCustPreviews] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(20);

  // Medium Preview State
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  const refInputRef = useRef<HTMLInputElement>(null);
  const custInputRef = useRef<HTMLInputElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      onClose();
    }
    return () => clearInterval(timer);
  }, [success, countdown, onClose]);

  if (!isOpen) return null;

  const handleWhatsappConnect = () => {
    const message = `Hello, I want to discuss a custom design for ${product?.name}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
    setWhatsappConnected(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'reference' | 'customer') => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map(file => URL.createObjectURL(file));

    if (type === 'reference') {
      setReferenceImages(prev => [...prev, ...files]);
      setRefPreviews(prev => [...prev, ...newPreviews]);
    } else {
      setCustomerImages(prev => [...prev, ...files]);
      setCustPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number, type: 'reference' | 'customer') => {
    if (type === 'reference') {
      URL.revokeObjectURL(refPreviews[index]);
      setReferenceImages(prev => prev.filter((_, i) => i !== index));
      setRefPreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      URL.revokeObjectURL(custPreviews[index]);
      setCustomerImages(prev => prev.filter((_, i) => i !== index));
      setCustPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      triggerAuthGuard("Login to request customization");
      onClose();
      return;
    }

    if (!designIdea || !contactNumber || referenceImages.length === 0 || customerImages.length === 0) {
      setError("Please fill all required fields and upload images.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('productId', product._id);
    formData.append('designIdea', designIdea);
    formData.append('contactNumber', contactNumber);
    formData.append('additionalNotes', additionalNotes);
    formData.append('whatsappConnected', String(whatsappConnected));

    referenceImages.forEach(file => {
      formData.append('referenceImages', file);
    });
    
    customerImages.forEach(file => {
      formData.append('customerImages', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.api}/customization/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit request');
      }

      setIsSubmitting(false);
      setSuccess(true);
      
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-500">
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInScale {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      {/* Medium Image Preview Popup */}
      {previewImageModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300">
           <div className="relative max-w-4xl max-h-[90vh] bg-transparent scale-in-95 animate-in duration-300">
              <button 
                onClick={() => setPreviewImageModal(null)}
                className="absolute -top-12 right-0 sm:-right-12 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
              </button>
              <img src={previewImageModal} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
           </div>
        </div>
      )}

      {success ? (
        /* CONDENSED PREMIUM SUCCESS POPUP */
        <div className="bg-white/95 backdrop-blur-xl w-[92%] sm:w-full sm:max-w-md p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative animate-[fadeInScale_0.4s_cubic-bezier(0.16,1,0.3,1)] border border-white/40 overflow-hidden">
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-black/5 rounded-full transition-colors z-10">
                <X size={20} className="text-gray-400" />
            </button>

            <div className="flex flex-col items-center text-center space-y-5">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                    <div className="relative bg-green-500 text-white p-3 rounded-full shadow-lg shadow-green-500/30">
                        <CheckCircle2 size={32} strokeWidth={3} />
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 leading-tight">Request Submitted!</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Your customization details are safely received.</p>
                </div>

                {/* COMPACT INFO CARD */}
                <div className="w-full bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 text-left space-y-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                        <AlertCircle size={14} /> Please Note
                    </div>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2.5 text-[11px] sm:text-xs font-bold text-amber-900/80 leading-snug">
                            <span className="shrink-0">⚠️</span> 
                            <span>Complete product checkout to start the design process.</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-[11px] sm:text-xs font-medium text-amber-800/70 leading-snug">
                            <span className="shrink-0">✨</span> 
                            <span>Edit request within 24 hours from your Dashboard.</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-[11px] sm:text-xs font-medium text-amber-800/70 leading-snug">
                            <span className="shrink-0">✨</span> 
                            <span>Design updates will be shared via Dashboard & WhatsApp.</span>
                        </li>
                    </ul>
                </div>

                {/* SMALLER BUTTONS */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                        onClick={onClose}
                        className="h-11 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black rounded-xl transition-all active:scale-95"
                    >
                        <ShoppingBag size={16} />
                        Shopping
                    </button>
                    <button 
                        onClick={() => router.push('/dashboard?tab=requests')}
                        className="h-11 flex items-center justify-center gap-2 bg-black text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                        <LayoutDashboard size={16} />
                        Dashboard
                    </button>
                </div>

                {/* SLIM PROGRESS BAR */}
                <div className="w-full">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter text-gray-400 mb-1.5 px-1">
                        <span>Auto-close</span>
                        <span>{countdown}s</span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 transition-all duration-1000 ease-linear rounded-full"
                            style={{ width: `${(countdown / 20) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-[var(--bg)] w-full sm:rounded-3xl sm:w-full max-w-2xl h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col animate-[slideUp_0.3s_ease-out] overscroll-contain touch-pan-y">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[var(--bg)]/90 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 font-medium">
                    <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
                </button>
                <h2 className="text-xl font-black truncate max-w-[200px] sm:max-w-[300px]">Custom Request</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="p-6 sm:p-8 flex-1">
                {/* WhatsApp Connect Section */}
                <div className="mb-8">
                    <h3 className="font-bold mb-3 text-lg">Need instant support?</h3>
                    <div className={`border-2 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${whatsappConnected ? 'border-green-500 bg-green-50' : 'border-green-100 bg-green-50/50'}`}>
                        <div>
                            <p className="text-sm text-green-800 font-medium">Discuss your design live with our experts.</p>
                            {whatsappConnected && <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> WhatsApp Connected</span>}
                        </div>
                        <button 
                            type="button"
                            onClick={handleWhatsappConnect}
                            className="w-full sm:w-auto bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                        >
                            <MessageCircle size={20} />
                            {whatsappConnected ? 'Open WhatsApp Again' : 'Connect WhatsApp'}
                        </button>
                    </div>
                </div>

                {/* Important Info Card */}
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 p-5 rounded-2xl mb-8 space-y-3 text-sm font-medium">
                    <p className="flex items-start gap-2"><Sparkles size={16} className="text-amber-500 mt-0.5 shrink-0" /> Custom design discussion will begin after request submission.</p>
                    <p className="flex items-start gap-2"><Sparkles size={16} className="text-amber-500 mt-0.5 shrink-0" /> Final production starts only after order/payment confirmation.</p>
                    <p className="flex items-start gap-2"><Sparkles size={16} className="text-amber-500 mt-0.5 shrink-0" /> Preview/design updates will be shared through your dashboard and WhatsApp.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-500/20 flex items-center gap-2">
                    <X size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Design Idea */}
                    <div>
                        <label className="block text-sm font-black mb-2 uppercase tracking-wide">Design Idea *</label>
                        <textarea 
                            required
                            rows={4}
                            value={designIdea}
                            onChange={(e) => setDesignIdea(e.target.value)}
                            placeholder="Describe your design vision, colors, placement, etc..."
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all resize-none"
                        />
                    </div>

                    {/* Reference Images */}
                    <div>
                        <label className="block text-sm font-black mb-2 uppercase tracking-wide">Reference Images (Inspiration) *</label>
                        <p className="text-xs text-gray-500 mb-3">Upload ideas, styles, or concepts you like.</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            {refPreviews.map((src, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100">
                                    <img src={src} className="w-full h-full object-cover" alt={`Ref ${idx}`} />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => setPreviewImageModal(src)} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        <button type="button" onClick={() => removeImage(idx, 'reference')} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={() => refInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[var(--primary)] transition-all"
                            >
                                <ImageIcon size={24} />
                                <span className="text-xs font-bold">Add Ref</span>
                            </button>
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden" ref={refInputRef} onChange={(e) => handleFileChange(e, 'reference')} />
                    </div>

                    {/* Customer Images */}
                    <div>
                        <label className="block text-sm font-black mb-2 uppercase tracking-wide">Your Design/Logo *</label>
                        <p className="text-xs text-gray-500 mb-3">Upload the exact logo or photo you want us to use.</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            {custPreviews.map((src, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100">
                                    <img src={src} className="w-full h-full object-cover" alt={`Cust ${idx}`} />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => setPreviewImageModal(src)} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        <button type="button" onClick={() => removeImage(idx, 'customer')} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={() => custInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[var(--primary)] transition-all"
                            >
                                <ImageIcon size={24} />
                                <span className="text-xs font-bold">Add Design</span>
                            </button>
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden" ref={custInputRef} onChange={(e) => handleFileChange(e, 'customer')} />
                    </div>

                    {/* Contact & Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-black mb-2 uppercase tracking-wide">Contact Number *</label>
                            <input 
                                type="tel" 
                                required
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                placeholder="WhatsApp/Phone"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-black mb-2 uppercase tracking-wide">Additional Notes</label>
                            <input 
                                type="text" 
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                placeholder="Any extra info? (Optional)"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6 pb-6 sm:pb-0 border-t border-gray-100 sticky bottom-0 bg-[var(--bg)] sm:relative sm:border-0 z-10">
                        <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 bg-[var(--text)] text-[var(--bg)] font-black rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center shadow-xl shadow-black/10 text-lg group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                            <span className="relative z-10 flex items-center gap-2 group-hover:scale-[1.02] transition-transform">
                                {isSubmitting ? 'Submitting Request...' : 'Submit Custom Request 👉'}
                            </span>
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">By submitting, you agree to our design review terms.</p>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

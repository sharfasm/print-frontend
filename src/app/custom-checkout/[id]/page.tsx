"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';
import config from '@/brand/config';

export default function CustomCheckout() {
    const { id } = useParams(); // Custom Request ID
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [transactionLast4, setTransactionLast4] = useState("");
    const [paymentProof, setPaymentProof] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login?redirect=/custom-checkout/' + id);
            return;
        }

        const fetchRequest = async () => {
            try {
                const token = localStorage.getItem('token');
                // Getting all requests for the user, then filtering (could be optimized with a specific GET by ID API if it existed, but we have getMyCustomizationRequests)
                const res = await fetch(`${config.api}/customization/my-requests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Failed to fetch requests");
                const requests = await res.json();
                const currentReq = requests.find(r => r._id === id);
                if (!currentReq) throw new Error("Customization request not found");
                
                setRequest(currentReq);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id, isLoggedIn, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (paymentMethod !== "WHATSAPP" && !paymentProof) {
            alert("Payment proof is mandatory for UPI/Bank Transfer.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("paymentMethod", paymentMethod);
        if (transactionLast4) formData.append("transactionLast4", transactionLast4);
        if (paymentProof) formData.append("paymentProof", paymentProof[0]);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.api}/customization/${id}/payment`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Payment submission failed");
            }

            // Redirect to dashboard where they can see their requests
            router.push('/dashboard?tab=requests');
        } catch (err) {
            alert(err.message);
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-32 pb-16">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black mb-2">Complete Your Custom Request</h1>
                    <p className="opacity-70">Payment verification needed to start designing</p>
                </div>

                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-3xl p-8 mb-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 border-b border-[var(--secondary)]/10 pb-4">Request Summary</h2>
                    <div className="flex items-center gap-4 mb-6">
                        {request.productId?.images && request.productId.images[0] && (
                            <img 
                                src={request.productId.images[0].startsWith('http') ? request.productId.images[0] : `${config.api.replace('/api', '')}/${request.productId.images[0]}`} 
                                className="w-16 h-16 object-cover rounded-xl" 
                                alt="Product" 
                            />
                        )}
                        <div>
                            <div className="font-bold">{request.productId?.name}</div>
                            <div className="text-sm opacity-70">Custom Design Request</div>
                        </div>
                    </div>
                    
                    <div className="bg-amber-500/10 text-amber-600 p-4 rounded-xl text-sm font-bold flex items-start gap-3">
                        <span className="text-xl">✨</span>
                        <div>
                            <p>Our design team will begin working on your custom {request.productId?.name} immediately after your payment is verified.</p>
                            <p className="mt-1">You will receive a design preview within 2 days.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl shadow-[var(--primary)]/5 border border-[var(--primary)]/10">
                    <h2 className="text-2xl font-black mb-6">Payment Details</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-3">Select Payment Method</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input type="radio" name="method" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="hidden" />
                                    <div className="font-bold text-center">UPI / Bank Transfer</div>
                                </label>
                                <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'WHATSAPP' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input type="radio" name="method" value="WHATSAPP" checked={paymentMethod === 'WHATSAPP'} onChange={() => setPaymentMethod('WHATSAPP')} className="hidden" />
                                    <div className="font-bold text-center">WhatsApp Manual</div>
                                </label>
                            </div>
                        </div>

                        {paymentMethod === 'UPI' && (
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="mb-6 text-center">
                                    <p className="font-bold mb-2">Scan QR Code or Pay to UPI ID:</p>
                                    <p className="text-lg font-black text-[var(--primary)]">printcloud@upi</p>
                                    {/* Mock QR Placeholder */}
                                    <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 mx-auto mt-4 rounded-xl flex items-center justify-center text-gray-400 font-bold">QR CODE</div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Transaction Last 4 Digits (Optional)</label>
                                        <input 
                                            type="text" 
                                            maxLength={4}
                                            value={transactionLast4}
                                            onChange={(e) => setTransactionLast4(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3"
                                            placeholder="e.g. 8452"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Upload Payment Screenshot *</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            required
                                            onChange={(e) => setPaymentProof(e.target.files)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'WHATSAPP' && (
                            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
                                <p className="font-bold text-green-800 mb-4">Complete payment via our official WhatsApp</p>
                                <a 
                                    href={`https://wa.me/1234567890?text=Hello, I want to pay for my custom request ID: ${id}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    Pay via WhatsApp
                                </a>
                                <p className="text-sm mt-4">After paying on WhatsApp, click submit below to finish.</p>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center"
                        >
                            {isSubmitting ? 'Submitting...' : 'Confirm Payment & Start Design 👉'}
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}

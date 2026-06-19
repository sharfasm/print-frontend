import React, { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';

interface UpdateModalProps {
    request: any;
    onClose: () => void;
    onUpdate: (updatedRequest: any) => void;
}

export default function UpdateCustomizationModal({ request, onClose, onUpdate }: UpdateModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        designIdea: request.designIdea || '',
        contactNumber: request.contactNumber || '',
        additionalNotes: request.additionalNotes || ''
    });

    const [existingReference, setExistingReference] = useState<string[]>(request.referenceImages || []);
    const [existingCustomer, setExistingCustomer] = useState<string[]>(request.customerImages || []);

    const [newReference, setNewReference] = useState<File[]>([]);
    const [newCustomer, setNewCustomer] = useState<File[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('designIdea', formData.designIdea);
        data.append('contactNumber', formData.contactNumber);
        data.append('additionalNotes', formData.additionalNotes);

        existingReference.forEach(img => data.append('existingReferenceImages', img));
        existingCustomer.forEach(img => data.append('existingCustomerImages', img));

        newReference.forEach(file => data.append('referenceImages', file));
        newCustomer.forEach(file => data.append('customerImages', file));

        try {
            const res = await api.put(`/customization/${request._id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUpdate(res.data);
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to update request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} />
                </button>
                
                <h2 className="text-2xl font-black mb-6">Update Request</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">Design Idea <span className="text-red-500">*</span></label>
                            <textarea 
                                required
                                value={formData.designIdea}
                                onChange={e => setFormData({...formData, designIdea: e.target.value})}
                                className="w-full border border-gray-200 rounded-2xl p-4 min-h-[100px] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2">Additional Notes</label>
                            <textarea 
                                value={formData.additionalNotes}
                                onChange={e => setFormData({...formData, additionalNotes: e.target.value})}
                                className="w-full border border-gray-200 rounded-2xl p-4 min-h-[80px] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Contact Number <span className="text-red-500">*</span></label>
                            <input 
                                type="text"
                                required
                                value={formData.contactNumber}
                                onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                                className="w-full border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-sm font-bold mb-2">Reference Images</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {existingReference.map((img, i) => (
                                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                                        <img src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_BACKEND_URL }/${img}`} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setExistingReference(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-red-500">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                                {newReference.map((file, i) => (
                                    <div key={`new-${i}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[var(--primary)]">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setNewReference(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-red-500">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 hover:border-[var(--primary)] flex items-center justify-center cursor-pointer bg-gray-50 text-gray-400 hover:text-[var(--primary)] transition-colors">
                                    <Upload size={16} />
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                                        if (e.target.files) setNewReference(prev => [...prev, ...Array.from(e.target.files!)]);
                                    }} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Customer Design Images</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {existingCustomer.map((img, i) => (
                                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                                        <img src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_BACKEND_URL }/${img}`} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setExistingCustomer(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-red-500">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                                {newCustomer.map((file, i) => (
                                    <div key={`new-${i}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[var(--primary)]">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setNewCustomer(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-red-500">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 hover:border-[var(--primary)] flex items-center justify-center cursor-pointer bg-gray-50 text-gray-400 hover:text-[var(--primary)] transition-colors">
                                    <Upload size={16} />
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                                        if (e.target.files) setNewCustomer(prev => [...prev, ...Array.from(e.target.files!)]);
                                    }} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-3 bg-[var(--primary)] text-[var(--bg)] font-black rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                            {loading ? "Updating..." : "Save Changes"} <CheckCircle size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useShop } from '../../context/ShopContext';

export default function Addresses() {
    const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useShop();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        recipient: '',
        street: '',
        city: '',
        state: '',
        pin: '',
        phone: '',
    });

    const openModal = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                name: address.name,
                recipient: address.recipient,
                street: address.street,
                city: address.city,
                state: address.state,
                pin: address.pin,
                phone: address.phone,
            });
        } else {
            setEditingAddress(null);
            setFormData({
                name: '',
                recipient: '',
                street: '',
                city: '',
                state: '',
                pin: '',
                phone: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            updateAddress(editingAddress.id, formData);
        } else {
            addAddress(formData);
        }
        closeModal();
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">Saved Addresses</h1>
                    <p className="opacity-70 font-medium font-inter tracking-wide">Manage your shipping and billing locations.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-[var(--primary)] text-[var(--bg)] px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:rotate-90"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Add New Address
                </button>
            </div>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {addresses.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-[var(--secondary)]/5 rounded-[2rem] border-2 border-dashed border-[var(--secondary)]/20">
                        <p className="text-xl font-bold opacity-40">No saved addresses yet.</p>
                        <button onClick={() => openModal()} className="mt-4 text-[var(--primary)] font-bold hover:underline">Add your first address</button>
                    </div>
                ) : (
                    addresses.map((address) => (
                        <div key={address.id} className="relative group">
                            {/* Premium Card Background with Glassmorphism */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/5 to-transparent rounded-[2.5rem] -z-10 blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="bg-[var(--bg)]/40 backdrop-blur-xl border border-[var(--secondary)]/20 rounded-[2.5rem] p-8 sm:p-10 shadow-lg shadow-[var(--secondary)]/5 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full overflow-hidden">
                                
                                {/* Top Badges & Icons */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-inner">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                        </div>
                                        <h3 className="text-xl font-black text-[var(--text)]">{address.name}</h3>
                                    </div>
                                    
                                    {address.isDefault && (
                                        <span className="bg-[var(--primary)] text-[var(--bg)] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-[var(--primary)]/20">
                                            Default
                                        </span>
                                    )}
                                </div>
                                
                                {/* Address Content */}
                                <div className="flex-grow space-y-2 mb-10">
                                    <p className="font-extrabold text-2xl text-[var(--text)] mb-4">{address.recipient}</p>
                                    <p className="opacity-70 leading-relaxed font-bold text-[17px]">
                                        {address.street}
                                    </p>
                                    <p className="opacity-70 leading-relaxed font-bold text-[17px]">
                                        {address.city}, {address.state} {address.pin}
                                    </p>
                                    <p className="opacity-70 leading-relaxed font-bold text-[17px]">
                                        India
                                    </p>
                                    
                                    <div className="pt-6 flex items-center gap-3">
                                        <span className="uppercase tracking-[0.2em] opacity-40 text-[11px] font-black">Phone:</span>
                                        <span className="font-extrabold text-lg text-[var(--text)]/80 tracking-tight">{address.phone}</span>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="flex items-center gap-6 pt-8 border-t border-[var(--secondary)]/10">
                                    <button 
                                        onClick={() => openModal(address)}
                                        className="inline-flex items-center gap-2 text-[var(--text)] font-black text-sm hover:text-[var(--primary)] uppercase tracking-widest transition-colors group/btn"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center group-hover/btn:bg-[var(--primary)] group-hover/btn:text-[var(--bg)] transition-all">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </div>
                                        Edit
                                    </button>
                                    <div className="w-px h-6 bg-[var(--secondary)]/20 shadow-[-1px_0_0_rgba(255,255,255,0.1)]"></div>
                                    <button 
                                        onClick={() => { if(window.confirm('Delete this address?')) deleteAddress(address.id) }}
                                        className="text-red-500 font-black text-sm hover:text-red-600 hover:scale-110 active:scale-95 transition-all uppercase tracking-widest"
                                    >
                                        Delete
                                    </button>
                                    
                                    {!address.isDefault && (
                                        <button 
                                            onClick={() => setDefaultAddress(address.id)}
                                            className="ml-auto text-xs font-black opacity-40 hover:opacity-100 hover:text-[var(--primary)] uppercase tracking-tighter"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Address Form Modal - Using Portal for global render */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop with heavy blur and dark overlay */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" 
                        onClick={closeModal}
                    />
                    
                    {/* Modal Content - Added max-h and scrollable logic */}
                    <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[var(--bg)] rounded-[3rem] border border-[var(--secondary)]/20 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 shadow-2xl">
                        
                        {/* Modal Header - Sticky at the top */}
                        <div className="p-10 pb-6 flex justify-between items-center bg-gradient-to-br from-[var(--primary)]/5 to-transparent shrink-0">
                            <div>
                                <h2 className="text-4xl font-black text-[var(--text)] tracking-tight">
                                    {editingAddress ? 'EDIT ADDRESS' : 'NEW ADDRESS'}
                                </h2>
                                <p className="text-sm opacity-50 font-black uppercase tracking-[0.3em] mt-2">Shipping & Billing Details</p>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="w-14 h-14 rounded-2xl bg-[var(--bg)] shadow-xl flex items-center justify-center text-[var(--text)] hover:scale-110 active:scale-90 transition-all border border-[var(--secondary)]/10 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-4">
                            <form id="address-form" onSubmit={handleSubmit} className="space-y-8 pb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Address Name (Home, Work, etc) */}
                                    <div className="space-y-3 md:col-span-2 group">
                                        <label className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 ml-1 group-focus-within:text-[var(--primary)] group-focus-within:opacity-100 transition-all">Address Label (Home / Work)</label>
                                        <input 
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Home, Shalu's Address" 
                                            className="w-full bg-[var(--secondary)]/5 border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] focus:shadow-lg p-5 rounded-[1.5rem] outline-none font-bold placeholder:opacity-40 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg"
                                        />
                                    </div>

                                    {/* Recipient Name */}
                                    <div className="space-y-3 group">
                                        <label className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 ml-1 group-focus-within:text-[var(--primary)] group-focus-within:opacity-100 transition-all">Full Name</label>
                                        <input 
                                            required
                                            name="recipient"
                                            value={formData.recipient}
                                            onChange={handleInputChange}
                                            placeholder="Recipient Name" 
                                            className="w-full bg-[var(--secondary)]/5 border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] focus:shadow-lg p-5 rounded-[1.5rem] outline-none font-bold transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-3 group">
                                        <label className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 ml-1 group-focus-within:text-[var(--primary)] group-focus-within:opacity-100 transition-all">Phone Number</label>
                                        <input 
                                            required
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Phone Number" 
                                            className="w-full bg-[var(--secondary)]/5 border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] focus:shadow-lg p-5 rounded-[1.5rem] outline-none font-bold transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg"
                                        />
                                    </div>

                                    {/* Street */}
                                    <div className="space-y-3 md:col-span-2 group">
                                        <label className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 ml-1 group-focus-within:text-[var(--primary)] group-focus-within:opacity-100 transition-all">Address Line</label>
                                        <input 
                                            required
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            placeholder="Street Address, P.O. Box" 
                                            className="w-full bg-[var(--secondary)]/5 border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] focus:shadow-lg p-5 rounded-[1.5rem] outline-none font-bold transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg"
                                        />
                                    </div>

                                    {/* City */}
                                    <div className="space-y-3 group">
                                        <label className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 ml-1 group-focus-within:text-[var(--primary)] group-focus-within:opacity-100 transition-all">City</label>
                                        <input 
                                            required
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="City" 
                                            className="w-full bg-[var(--secondary)]/5 border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] focus:shadow-lg p-5 rounded-[1.5rem] outline-none font-bold transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg"
                                        />
                                    </div>

                                    {/* State/Province */}
                                    <div className="space-y-3 group">
                                        <label className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 ml-1 group-focus-within:text-[var(--primary)] group-focus-within:opacity-100 transition-all">State</label>
                                        <input 
                                            required
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="State" 
                                            className="w-full bg-[var(--secondary)]/5 border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] focus:shadow-lg p-5 rounded-[1.5rem] outline-none font-bold transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg"
                                        />
                                    </div>

                                    {/* Pin Code */}
                                    <div className="space-y-3 group">
                                        <label className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 ml-1 group-focus-within:text-[var(--primary)] group-focus-within:opacity-100 transition-all">PIN Code</label>
                                        <input 
                                            required
                                            name="pin"
                                            value={formData.pin}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 681753" 
                                            className="w-full bg-[var(--secondary)]/5 border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] focus:shadow-lg p-5 rounded-[1.5rem] outline-none font-bold transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Sticky Footer for Buttons */}
                        <div className="p-10 pt-6 bg-gradient-to-t from-[var(--bg)] to-transparent shrink-0">
                            <div className="flex gap-6">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-8 py-6 rounded-[1.5rem] border-2 border-[var(--secondary)]/20 font-black uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white hover:border-black transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    form="address-form"
                                    className="flex-[2] px-8 py-6 rounded-[1.5rem] bg-[var(--primary)] text-[var(--bg)] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-[var(--primary)]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {editingAddress ? 'SAVE CHANGES' : 'ADD ADDRESS'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, MapPin, CreditCard, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { resolveImage } from '../lib/imageUtils';
import api from '../lib/axios';

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Checkout() {
    const { 
        cart, 
        cartTotal, 
        addresses, 
        addAddress, 
        walletBalance, 
        buyNowItem, 
        setBuyNowItem, 
        clearCart,
        appliedCoupon,
        couponDiscount,
        freeShipping,
        couponError,
        couponLoading,
        applyCouponCode,
        removeCoupon
    } = useShop();
    const [couponInput, setCouponInput] = useState('');
    const [promoExpanded, setPromoExpanded] = useState(!!appliedCoupon);
    const { user } = useAuth();

    useEffect(() => {
        if (appliedCoupon) {
            setPromoExpanded(true);
        }
    }, [appliedCoupon]);
    const navigate = useRouter();

    // Derived checkout items
    const checkoutItems = buyNowItem ? [buyNowItem] : cart;
    const checkoutTotal = buyNowItem ? (buyNowItem.price * buyNowItem.quantity) : cartTotal;

    const [currentStep, setCurrentStep] = useState(1);
    const [paymentError, setPaymentError] = useState('');
    const [errors, setErrors] = useState({});
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    
    // Payment Specific State
    const [pendingOrderId, setPendingOrderId] = useState(null);
    const [transactionLast4, setTransactionLast4] = useState('');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customRequests, setCustomRequests] = useState([]);

    // Fetch user's customization requests to link them
    useEffect(() => {
        const fetchCustomRequests = async () => {
            if (!user) return;
            try {
                const res = await api.get('/customization/my-requests');
                setCustomRequests(res.data);
            } catch (err) {
                console.error("Failed to fetch custom requests", err);
            }
        };
        fetchCustomRequests();
    }, [user]);

    const findLinkedCustomization = (productId) => {
        return customRequests.find(req => 
            req.productId?._id === productId &&
            [
                'pending_review',
                'waiting_for_payment',
                'payment_verified',
                'designing_started',
                'preview_sent',
                'waiting_customer_response',
                'changes_requested',
                'approved',
                'production_started',
                'completed'
            ].includes(req.requestStatus)
        );
    };

    // Form State
    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: '',
        fullName: user?.name || '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        paymentMethod: 'upi', // upi, whatsapp
        saveAddress: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
            if (!formData.phone) newErrors.phone = 'Phone number is required';
        } else if (step === 2) {
            if (!formData.fullName) newErrors.fullName = 'Full name is required';
            if (!formData.address1) newErrors.address1 = 'Address line 1 is required';
            if (formData.country === 'India' && !/^[1-9][0-9]{5}$/.test(formData.zip)) newErrors.zip = 'Invalid PIN code';
            else if (!formData.zip) newErrors.zip = 'Pincode is required';
            if (!formData.city) newErrors.city = 'City is required';
            if (!formData.state) newErrors.state = 'State is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = async () => {
        if (validateStep(currentStep)) {
            if (currentStep === 2) {
                // Create Pending Order on navigating to Payment Step
                try {
                    const orderData = {
                        items: checkoutItems.map(i => ({
                            productId: i._id,
                            name: i.name,
                            price: i.price,
                            quantity: i.quantity,
                            isCustom: i.isCustom || false,
                            customization: i.customization || null,
                            image: i.image || (i.images && i.images[0]) || ''
                        })),
                        shippingAddress: {
                            fullName: formData.fullName,
                            address1: formData.address1,
                            address2: formData.address2,
                            city: formData.city,
                            state: formData.state,
                            zip: formData.zip,
                            country: formData.country,
                            phone: formData.phone,
                            email: formData.email
                        },
                        totalAmount: finalTotal,
                        paymentMethod: formData.paymentMethod.toUpperCase(),
                        couponCode: appliedCoupon ? appliedCoupon.code : null,
                        couponDiscount: couponDiscount || 0,
                        freeShipping: freeShipping || false,
                    };
                    const res = await api.post('/orders', orderData);
                    setPendingOrderId(res.data._id);
                    setCurrentStep(3);
                    window.scrollTo(0, 0);
                } catch (err) {
                    console.error(err);
                    alert("Failed to initialize payment. Please try again.");
                }
            } else {
                setCurrentStep(prev => Math.min(prev + 1, 3));
                window.scrollTo(0, 0);
            }
        }
    };

    const prevStep = () => {
        setErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const handleWhatsappClick = async () => {
        if (pendingOrderId) {
            try {
                await api.post(`/orders/${pendingOrderId}/whatsapp-click`);
            } catch (err) {
                console.error("Failed to track WhatsApp click", err);
            }
        }
        window.open(`https://wa.me/919876543210?text=Hi,%20I%20want%20to%20pay%20for%20order%20%23${pendingOrderId}`, '_blank');
    };

    const handleSubmitPayment = async () => {
        if (!pendingOrderId) {
            setPaymentError('Order not initialized. Please go back and try again.');
            return;
        }
        if (transactionLast4.length !== 4) {
            setPaymentError('Please enter exactly 4 digits of the transaction ID.');
            return;
        }
        if (!paymentProof) {
            setPaymentError('Please upload a payment screenshot.');
            return;
        }
        
        setIsSubmitting(true);
        setPaymentError('');

        try {
            const formDataPayload = new FormData();
            formDataPayload.append('transactionLast4', transactionLast4);
            formDataPayload.append('paymentMethod', formData.paymentMethod.toUpperCase());
            formDataPayload.append('paymentProof', paymentProof);

            await api.post(`/orders/${pendingOrderId}/submit-payment`, formDataPayload, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Save Address
            if (formData.saveAddress && user) {
                addAddress({
                    name: `${formData.fullName}'s Address`,
                    fullName: formData.fullName,
                    address1: formData.address1,
                    address2: formData.address2,
                    city: formData.city,
                    state: formData.state,
                    pin: formData.zip,
                    phone: formData.phone || user?.phone || '',
                    isDefault: false
                });
            }

            // Clear shop context items
            if (buyNowItem && setBuyNowItem) {
                setBuyNowItem(null);
            } else {
                clearCart();
            }

            // Redirect
            navigate.push(`/order-confirmation?orderId=${pendingOrderId}`);
        } catch (error) {
            setPaymentError(error.response?.data?.message || "Payment submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Derived values
    const finalTotal = Math.max(0, checkoutTotal - (couponDiscount || 0)); // Subtract coupon discount

    const steps = [
        { id: 1, name: 'Info', label: 'Customer' },
        { id: 2, name: 'Address', label: 'Shipping Address' },
        { id: 3, name: 'Payment', label: 'Payment Method' },
    ];

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)]">
                <h2 className="text-3xl font-black mb-4">Your Cart is Empty</h2>
                <Link href="/products" className="px-8 py-3 bg-[var(--primary)] text-[var(--bg)] font-bold rounded-xl shadow-lg hover:opacity-90 transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col pt-[120px] pb-12">
            
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 flex-1 flex flex-col lg:flex-row gap-8 lg:gap-16">
                
                {/* Left Column: Form Steps */}
                <div className="flex-1 max-w-2xl w-full mx-auto lg:mx-0">
                    
                    {/* Breadcrumb / Stepper */}
                    <div className="mb-10 sm:mb-14 relative z-0">
                        {/* Background Track */}
                        <div className="absolute top-4 left-4 right-4 h-1 bg-[var(--secondary)]/10 -translate-y-1/2 -z-10 rounded-full"></div>
                        
                        {/* Active Track */}
                        <div 
                            className="absolute top-4 left-4 h-1 bg-[var(--primary)] -translate-y-1/2 -z-10 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `calc((100% - 2rem) * ${(currentStep - 1) / (steps.length - 1)})` }}
                        ></div>

                        <div className="flex items-start justify-between">
                            {steps.map((step) => {
                                const isCompleted = currentStep > step.id;
                                const isCurrent = currentStep === step.id;

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 sm:gap-3 w-1/3">
                                        <div 
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 shadow-sm
                                                ${isCompleted ? 'bg-[var(--primary)] text-[var(--bg)] scale-95 border-2 border-[var(--primary)]' : 
                                                  isCurrent ? 'bg-[var(--bg)] text-[var(--primary)] scale-110 ring-4 ring-[var(--primary)]/20 border-2 border-[var(--primary)]' : 
                                                  'bg-[var(--bg)] text-[var(--text)] border-2 border-[var(--secondary)]/20 opacity-50'}`}
                                        >
                                            {isCompleted ? (
                                                <svg className="w-5 h-5 animate-in zoom-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                        <span 
                                            className={`text-[10px] sm:text-xs font-black transition-all duration-300 text-center leading-tight sm:whitespace-nowrap
                                                ${isCurrent ? 'text-[var(--primary)] scale-110 transform-origin-top' : 
                                                  isCompleted ? 'opacity-80' : 
                                                  'opacity-40'}`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 1: Customer Information */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black mb-6">Customer Information</h2>
                            {!user && (
                                <p className="mb-6 opacity-80 font-medium">
                                    Already have an account? <Link href="/login" className="text-[var(--primary)] font-bold hover:underline">Log in</Link> for faster checkout.
                                </p>
                            )}
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                        <span>Email Address <span className="text-red-500">*</span></span>
                                        {errors.email && <span className="text-xs font-bold text-red-500">{errors.email}</span>}
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                        <span>Phone Number <span className="text-red-500">*</span></span>
                                        {errors.phone && <span className="text-xs font-bold text-red-500">{errors.phone}</span>}
                                    </label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium" 
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <button onClick={nextStep} className="px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
                                    Continue to Shipping
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Shipping Address */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black mb-6">Shipping Address</h2>
                            
                            {user && addresses.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-wider">Saved Addresses</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {addresses.map(addr => (
                                            <div 
                                                key={addr.id}
                                                onClick={() => {
                                                    setSelectedAddressId(addr.id);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        fullName: addr.fullName || addr.recipient || '',
                                                        address1: addr.address1 || addr.street,
                                                        address2: addr.address2 || '',
                                                        city: addr.city,
                                                        state: addr.state,
                                                        zip: addr.pin,
                                                        phone: addr.phone,
                                                        saveAddress: false // Already saved
                                                    }));
                                                }}
                                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-left ${selectedAddressId === addr.id ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md scale-[1.02]' : 'border-[var(--secondary)]/10 hover:border-[var(--primary)]/50'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-black">{addr.name}</span>
                                                    {addr.isDefault && <span className="bg-[var(--primary)] text-[var(--bg)] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>}
                                                </div>
                                                <p className="text-sm font-bold opacity-80">{addr.recipient}</p>
                                                <p className="text-sm opacity-60 truncate">{addr.street}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 my-6">
                                        <hr className="flex-1 border-[var(--secondary)]/10" />
                                        <span className="text-xs font-black uppercase opacity-40">OR ENTER NEW ADDRESS</span>
                                        <hr className="flex-1 border-[var(--secondary)]/10" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                        <span>Full Name <span className="text-red-500">*</span></span>
                                        {errors.fullName && <span className="text-[10px] font-bold text-red-500">{errors.fullName}</span>}
                                    </label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold mb-2">Address Line 1 <span className="text-red-500">*</span></label>
                                    <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} placeholder="House No, Building, Street" className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold mb-2">Address Line 2 (Optional)</label>
                                    <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} placeholder="Area, Landmark, Flat (optional)" className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">City <span className="text-red-500">*</span></label>
                                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">State <span className="text-red-500">*</span></label>
                                        <select name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium appearance-none">
                                            <option value="">Select State</option>
                                            {indianStates.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Pincode <span className="text-red-500">*</span></label>
                                        <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="6-digit Pincode" className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                    </div>
                                </div>
                                
                                {user && (
                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-[var(--secondary)]/5 rounded-xl border border-[var(--secondary)]/10 hover:bg-[var(--secondary)]/10 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                name="saveAddress" 
                                                checked={formData.saveAddress} 
                                                onChange={handleInputChange}
                                                className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer"
                                            />
                                            <span className="font-bold">Save this address for future use</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <button onClick={prevStep} className="font-bold opacity-60 hover:opacity-100 flex items-center gap-2 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Return to Info
                                </button>
                                <button onClick={nextStep} className="px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
                                    Proceed to Payment
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment Method */}
                    {currentStep === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black mb-6">Payment Details</h2>
                            <p className="opacity-70 font-medium mb-6">Please complete your payment manually to confirm the order.</p>
                            
                            <div className="bg-[var(--secondary)]/5 rounded-2xl border border-[var(--secondary)]/20 overflow-hidden divide-y divide-[var(--secondary)]/20 mb-8">
                                {/* Option: UPI */}
                                <div>
                                    <label className={`flex items-center gap-4 p-5 cursor-pointer transition-colors hover:bg-[var(--secondary)]/5`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.paymentMethod === 'upi' ? 'border-[var(--primary)]' : 'border-[var(--secondary)]/40'}`}>
                                            {formData.paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <span className="font-bold text-lg flex-1">UPI (GPay, PhonePe, Paytm)</span>
                                        <div className="w-12 h-6 bg-green-500 rounded flex items-center justify-center font-bold text-white text-[10px]">UPI</div>
                                        <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleInputChange} className="sr-only" />
                                    </label>
                                    {formData.paymentMethod === 'upi' && (
                                        <div className="p-6 bg-[var(--secondary)]/5 border-t border-[var(--secondary)]/10 animate-in fade-in slide-in-from-top-2 flex flex-col items-center text-center">
                                            <div className="w-48 h-48 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                                                {/* Placeholder for real QR code */}
                                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=printcloud@okhdfcbank&pn=PrintCloud&cu=INR" alt="UPI QR Code" className="w-full h-full p-2" />
                                            </div>
                                            <p className="font-bold mb-1">Scan to Pay: ₹{finalTotal}</p>
                                            <p className="text-sm opacity-70 font-medium mb-6">UPI ID: printcloud@okhdfcbank</p>
                                        </div>
                                    )}
                                </div>

                                {/* Option: WhatsApp */}
                                <div>
                                    <label className={`flex items-center gap-4 p-5 cursor-pointer transition-colors hover:bg-[var(--secondary)]/5`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.paymentMethod === 'whatsapp' ? 'border-[var(--primary)]' : 'border-[var(--secondary)]/40'}`}>
                                            {formData.paymentMethod === 'whatsapp' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <span className="font-bold text-lg flex-1">Pay via WhatsApp</span>
                                        <div className="w-12 h-6 bg-emerald-500 rounded flex items-center justify-center font-bold text-white text-[10px]">CHAT</div>
                                        <input type="radio" name="paymentMethod" value="whatsapp" checked={formData.paymentMethod === 'whatsapp'} onChange={handleInputChange} className="sr-only" />
                                    </label>
                                    {formData.paymentMethod === 'whatsapp' && (
                                        <div className="p-6 bg-emerald-500/10 border-t border-[var(--secondary)]/10 flex flex-col items-center animate-in fade-in slide-in-from-top-2">
                                            <p className="text-emerald-700 font-bold mb-4 text-center">We will send you a payment link on WhatsApp.</p>
                                            <button onClick={handleWhatsappClick} className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow hover:bg-emerald-600 transition flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.128.553 4.195 1.603 6.012L.392 23.608l5.706-1.498A11.968 11.968 0 0012.03 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.015c-1.802 0-3.567-.485-5.114-1.404l-.367-.217-3.8.997.997-3.8-.217-.367A9.972 9.972 0 011.985 12.03c0-5.545 4.515-10.06 10.06-10.06 5.546 0 10.06 4.515 10.06 10.06 0 5.546-4.514 10.06-10.06 10.06zm5.522-7.534c-.302-.151-1.792-.885-2.069-.986-.277-.101-.479-.151-.68.151-.202.302-.781.986-.957 1.188-.176.202-.353.227-.655.076-1.51-.745-2.613-1.636-3.608-3.32-.176-.302.176-.277.479-.882.101-.202.05-.378-.025-.529-.076-.151-.68-1.638-.932-2.243-.252-.605-.504-.523-.68-.529-.176-.006-.378-.006-.58-.006-.202 0-.529.076-.806.378-.277.302-1.058 1.033-1.058 2.519s1.083 2.923 1.234 3.125c.151.202 2.128 3.248 5.152 4.558 2.065.894 2.87.755 3.398.63.63-.151 1.792-.73 2.044-1.436.252-.705.252-1.31.176-1.436-.076-.126-.277-.202-.58-.353z" /></svg>
                                                Open WhatsApp to Pay
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[var(--primary)]/5 p-6 rounded-2xl border border-[var(--primary)]/20 mb-6">
                                <h3 className="font-black text-lg mb-4 text-[var(--primary)]">Submit Payment Details</h3>
                                
                                <label className="block text-sm font-bold mb-2">Last 4 Digits of Transaction ID <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    maxLength={4}
                                    placeholder="e.g. 9482" 
                                    value={transactionLast4}
                                    onChange={(e) => setTransactionLast4(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-bold text-center tracking-[0.5em] text-lg mb-4" 
                                />

                                <label className="block text-sm font-bold mb-2">Upload Payment Screenshot <span className="text-red-500">*</span></label>
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={(e) => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                                    className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm mb-2" 
                                />
                                
                                <p className="text-xs font-medium opacity-60 text-center mt-2">This helps us verify your payment quickly.</p>
                            </div>

                            {paymentError && (
                                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    {paymentError}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <button onClick={() => navigate.push('/cart')} className="w-full sm:w-auto px-6 py-4 font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all">
                                    Cancel Order
                                </button>
                                <button 
                                    onClick={handleSubmitPayment} 
                                    disabled={transactionLast4.length !== 4 || !paymentProof || isSubmitting}
                                    className="w-full sm:w-auto px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isSubmitting ? 'Verifying...' : 'Submit Payment Details'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-[420px] shrink-0">
                    <div className="bg-[var(--secondary)]/5 rounded-[2rem] border border-[var(--secondary)]/10 p-6 sm:p-8 sticky top-28">
                        <h2 className="text-xl font-black mb-6">Order Summary</h2>

                        {/* Items */}
                        <div className="space-y-4 mb-6">
                            {checkoutItems.map(item => (
                                <div key={item._id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-xl bg-[var(--bg)] border border-[var(--secondary)]/10 overflow-hidden relative shrink-0">
                                        <img src={resolveImage(item.image || (item.images && item.images[0]))} alt={item.name} className="w-full h-full object-cover" />
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--secondary)]/20 backdrop-blur text-[var(--text)] rounded-full flex items-center justify-center text-[10px] font-bold border border-[var(--secondary)]/20 shadow-sm">{item.quantity}</div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm line-clamp-2 leading-tight mb-1">{item.name}</h4>
                                        
                                        {/* Product Options (Dynamic Form) */}
                                        {item.customization && Object.keys(item.customization).length > 0 && (
                                            <div className="mt-1.5 space-y-0.5">
                                                {Object.entries(item.customization).map(([key, value]) => (
                                                    <div key={key} className="text-[11px] flex items-center gap-1">
                                                        <span className="font-bold opacity-60 text-gray-500">{key}:</span>
                                                        <span className="font-bold text-[var(--text)]">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Linked Custom Request */}
                                        {findLinkedCustomization(item._id) && (() => {
                                            const linked = findLinkedCustomization(item._id);
                                            return (
                                                <div className="mt-2.5 bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-lg p-2.5">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                            <CheckCircle2 size={10} className="text-emerald-600" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text)]">Design Request Linked</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-[10px] font-bold opacity-80">
                                                        <div className="flex justify-between items-center">
                                                            <span className="opacity-70">Source:</span>
                                                            <span className={linked.whatsappConnected ? "text-emerald-600" : "text-[var(--primary)]"}>
                                                                {linked.whatsappConnected ? "WhatsApp" : "Website Form"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="opacity-70">Status:</span>
                                                            <span className="text-[var(--text)]">{linked.requestStatus.replace(/_/g, ' ').toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <div className="font-black self-start pt-1">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>
 
                        <hr className="border-[var(--secondary)]/10 my-6" />

                        {/* Collapsible Promo Code Section */}
                        <div className="mb-6 border-b border-[var(--secondary)]/10 pb-4">
                            <button 
                                onClick={() => setPromoExpanded(!promoExpanded)} 
                                className="w-full flex items-center justify-between text-sm font-bold text-[var(--text)] opacity-80 hover:opacity-100 py-2 transition-all cursor-pointer"
                            >
                                <span>Have a Promo Code?</span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={2.5} 
                                    stroke="currentColor" 
                                    className={`w-4 h-4 transition-transform duration-200 ${promoExpanded ? 'rotate-180' : ''}`}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            
                            <div 
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    promoExpanded ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0 pointer-events-none'
                                }`}
                            >
                                {!appliedCoupon ? (
                                    <div className="space-y-2 pb-2">
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Enter code" 
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                className="flex-1 bg-[var(--bg)] px-4 py-2.5 rounded-xl border border-[var(--secondary)]/20 focus:border-[var(--primary)]/50 focus:outline-none font-mono text-sm font-bold uppercase tracking-wider transition-all"
                                            />
                                            <button 
                                                onClick={() => {
                                                    if (couponInput.trim()) {
                                                        applyCouponCode(couponInput.trim(), checkoutTotal);
                                                    }
                                                }}
                                                disabled={couponLoading || !couponInput.trim()}
                                                className="bg-[var(--primary)] text-[var(--bg)] px-5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-50 cursor-pointer"
                                            >
                                                {couponLoading ? "Applying..." : "Apply"}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                                                <span>⚠️</span> {couponError}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="pb-2">
                                        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-3.5 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                <div>
                                                    <p className="text-xs font-bold tracking-wider uppercase flex items-center gap-1">
                                                        Coupon Applied ✓
                                                    </p>
                                                    <p className="text-[10px] font-medium opacity-80">
                                                        Code: {appliedCoupon.code} (-₹{couponDiscount} Saved)
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    removeCoupon();
                                                    setCouponInput('');
                                                }}
                                                className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline px-2 py-1 transition-colors cursor-pointer"
                                                title="Remove coupon"
                                            >
                                                Remove Coupon
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="border-[var(--secondary)]/10 my-6" />
 
                        {/* Totals */}
                        <div className="space-y-3.5 text-sm font-semibold">
                            <div className="flex justify-between opacity-80">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold">₹{checkoutTotal}</span>
                            </div>
                            {couponDiscount > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400 font-bold bg-green-500/5 px-3 py-2 rounded-xl border border-green-500/10">
                                    <span className="flex items-center gap-1.5 text-xs">
                                        <Tag size={12} className="animate-pulse" />
                                        Discount ({appliedCoupon?.code})
                                    </span>
                                    <span>- ₹{couponDiscount}</span>
                                </div>
                            )}
                            <div className="flex justify-between opacity-80">
                                <span className="text-gray-500">Shipping</span>
                                <span className="text-emerald-600 font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-green-500 font-semibold">
                                <span className="text-gray-500">Taxes (Included)</span>
                                <span>₹0</span>
                            </div>
                        </div>
 
                        <hr className="border-[var(--secondary)]/10 my-5" />
 
                        <div className="flex justify-between items-end bg-[var(--primary)]/5 p-4.5 rounded-2xl border border-[var(--primary)]/10">
                            <span className="text-base font-black">Final Total</span>
                            <span className="text-2xl font-black text-[var(--primary)] font-mono">₹{finalTotal}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

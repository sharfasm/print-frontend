import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
    const { cart, cartTotal, placeOrder, addAddress, walletBalance, spendFromWallet } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const buyNowItem = location.state?.buyNowItem;
    
    // Derived checkout items
    const checkoutItems = buyNowItem ? [buyNowItem] : cart;
    const checkoutTotal = buyNowItem ? (buyNowItem.price * buyNowItem.quantity) : cartTotal;

    const [currentStep, setCurrentStep] = useState(1);
    const [paymentError, setPaymentError] = useState('');
    const [errors, setErrors] = useState({});

    // Form State
    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        shippingMethod: 'standard', // standard, express
        paymentMethod: 'card', // card, upi, cod, wallet
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
            if (!formData.firstName) newErrors.firstName = 'First name is required';
            if (!formData.lastName) newErrors.lastName = 'Last name is required';
            if (!formData.address1) newErrors.address1 = 'Address line 1 is required';
            if (formData.country === 'India' && !/^[1-9][0-9]{5}$/.test(formData.zip)) newErrors.zip = 'Invalid PIN code';
            else if (!formData.zip) newErrors.zip = 'Zip code is required';
            if (!formData.city) newErrors.city = 'City is required';
            if (!formData.state) newErrors.state = 'State is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = () => {
        setPaymentError('');

        // Pre-validate Wallet Payment
        if (formData.paymentMethod === 'wallet') {
            if (walletBalance < finalTotal) {
                setPaymentError('Insufficient Wallet Balance. Please top-up or select another payment method.');
                return; // Block order
            }
            // Execute Wallet Debit
            const success = spendFromWallet(finalTotal, `Order Payment`);
            if (!success) {
                setPaymentError('Failed to process wallet payment. Please try again.');
                return;
            }
        }

        const orderBatchId = `#ORD-${Math.floor(Math.random() * 90000) + 10000}X`;
        
        // Save Address - Mandatory for Dashboard Sync per user request
        addAddress({
            name: `${formData.firstName}'s Address`,
            recipient: `${formData.firstName} ${formData.lastName}`,
            street: `${formData.address1} ${formData.address2}`,
            city: formData.city,
            state: formData.state,
            pin: formData.zip,
            phone: formData.phone || user?.phone || '',
            isDefault: false
        });

        // Create individual Order entries for each product to allow direct navigation in dashboard
        checkoutItems.forEach((item, index) => {
            const newOrder = {
                id: `${orderBatchId}${checkoutItems.length > 1 ? `-${index + 1}` : ''}`,
                orderBatchId: orderBatchId,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                total: item.price * item.quantity,
                status: 'Processing',
                items: 1,
                image: item.image || '',
                productName: item.name,
                productId: item._id, // Critical for navigation
                paymentMethod: formData.paymentMethod,
                quantity: item.quantity
            };
            placeOrder(newOrder);
        });

        // Navigate to success page
        navigate('/order-confirmation', { state: { orderNumber: orderBatchId } });
    };

    // Derived values
    const shippingCost = formData.shippingMethod === 'express' ? 99 : 0;
    const finalTotal = checkoutTotal + shippingCost;

    const steps = [
        { id: 1, name: 'Info', label: 'Customer' },
        { id: 2, name: 'Address', label: 'Shipping Address' },
        { id: 3, name: 'Shipping', label: 'Shipping Method' },
        { id: 4, name: 'Payment', label: 'Payment Method' },
    ];

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)]">
                <h2 className="text-3xl font-black mb-4">Your Cart is Empty</h2>
                <Link to="/products" className="px-8 py-3 bg-[var(--primary)] text-[var(--bg)] font-bold rounded-xl shadow-lg hover:opacity-90 transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col pt-[120px] pb-12">
            
            {/* Removed internal checkout header per UI request */}

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
                                const isUpcoming = currentStep < step.id;

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 sm:gap-3 w-1/4">
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
                                    Already have an account? <Link to="/login" className="text-[var(--primary)] font-bold hover:underline">Log in</Link> for faster checkout.
                                </p>
                            )}
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                        <span>Email Address <span className="text-red-500">*</span></span>
                                        {errors.email && <span className="text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-2">{errors.email}</span>}
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        className={`w-full bg-[var(--secondary)]/5 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium ${errors.email ? 'border-red-500/50 ring-red-500/10' : 'border-[var(--secondary)]/20 focus:ring-[var(--primary)]'}`} 
                                        placeholder="you@example.com" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                        <span>Phone Number <span className="text-red-500">*</span></span>
                                        {errors.phone && <span className="text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-2">{errors.phone}</span>}
                                    </label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleInputChange} 
                                        className={`w-full bg-[var(--secondary)]/5 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium ${errors.phone ? 'border-red-500/50 ring-red-500/10' : 'border-[var(--secondary)]/20 focus:ring-[var(--primary)]'}`} 
                                        placeholder="+91 98765 43210" 
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
                            
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>First Name <span className="text-red-500">*</span></span>
                                            {errors.firstName && <span className="text-[10px] font-bold text-red-500">{errors.firstName}</span>}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="firstName" 
                                            value={formData.firstName} 
                                            onChange={handleInputChange} 
                                            className={`w-full bg-[var(--secondary)]/5 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium ${errors.firstName ? 'border-red-500/50' : 'border-[var(--secondary)]/20 focus:ring-[var(--primary)]'}`} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>Last Name <span className="text-red-500">*</span></span>
                                            {errors.lastName && <span className="text-[10px] font-bold text-red-500">{errors.lastName}</span>}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="lastName" 
                                            value={formData.lastName} 
                                            onChange={handleInputChange} 
                                            className={`w-full bg-[var(--secondary)]/5 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium ${errors.lastName ? 'border-red-500/50' : 'border-[var(--secondary)]/20 focus:ring-[var(--primary)]'}`} 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                        <span>Address Line 1 <span className="text-red-500">*</span></span>
                                        {errors.address1 && <span className="text-xs font-bold text-red-500">{errors.address1}</span>}
                                    </label>
                                    <input 
                                        type="text" 
                                        name="address1" 
                                        value={formData.address1} 
                                        onChange={handleInputChange} 
                                        className={`w-full bg-[var(--secondary)]/5 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium ${errors.address1 ? 'border-red-500/50' : 'border-[var(--secondary)]/20 focus:ring-[var(--primary)]'}`} 
                                        placeholder="Street address or P.O. Box" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold mb-2">Address Line 2 (Optional)</label>
                                    <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium" placeholder="Apartment, suite, etc." />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>City <span className="text-red-500">*</span></span>
                                            {errors.city && <span className="text-[10px] font-bold text-red-500">{errors.city}</span>}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            value={formData.city} 
                                            onChange={handleInputChange} 
                                            className={`w-full bg-[var(--secondary)]/5 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium ${errors.city ? 'border-red-500/50' : 'border-[var(--secondary)]/20 focus:ring-[var(--primary)]'}`} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>State <span className="text-red-500">*</span></span>
                                            {errors.state && <span className="text-[10px] font-bold text-red-500">{errors.state}</span>}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="state" 
                                            value={formData.state} 
                                            onChange={handleInputChange} 
                                            className={`w-full bg-[var(--secondary)]/5 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium ${errors.state ? 'border-red-500/50' : 'border-[var(--secondary)]/20 focus:ring-[var(--primary)]'}`} 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>Zip / Pin Code <span className="text-red-500">*</span></span>
                                            {errors.zip && <span className="text-xs font-bold text-red-500">{errors.zip}</span>}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="zip" 
                                            value={formData.zip} 
                                            onChange={handleInputChange} 
                                            className={`w-full bg-[var(--secondary)]/5 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium ${errors.zip ? 'border-red-500/50' : 'border-[var(--secondary)]/20 focus:ring-[var(--primary)]'}`} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Country</label>
                                        <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium appearance-none">
                                            <option value="India">India</option>
                                            <option value="United States">United States</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="bg-[var(--primary)]/5 p-4 rounded-xl border border-[var(--primary)]/10 flex items-start gap-3">
                                        <svg className="w-5 h-5 text-[var(--primary)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-xs font-bold opacity-80 leading-relaxed">
                                            This address will be automatically saved to your <span className="text-[var(--primary)]">Dashboard</span> for faster checkout in the future.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <button onClick={prevStep} className="font-bold opacity-60 hover:opacity-100 flex items-center gap-2 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Return to Info
                                </button>
                                <button onClick={nextStep} className="px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
                                    Continue
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Shipping Method */}
                    {currentStep === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black mb-6">Shipping Method</h2>
                            
                            <div className="space-y-4">
                                <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.shippingMethod === 'standard' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--secondary)]/20 hover:border-[var(--secondary)]/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.shippingMethod === 'standard' ? 'border-[var(--primary)]' : 'border-[var(--secondary)]/40'}`}>
                                            {formData.shippingMethod === 'standard' && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <div>
                                            <span className="block font-bold text-lg">Standard Delivery</span>
                                            <span className="text-sm font-medium opacity-60">Delivered within 3-5 business days</span>
                                        </div>
                                    </div>
                                    <span className="font-black text-lg">Free</span>
                                    <input type="radio" name="shippingMethod" value="standard" checked={formData.shippingMethod === 'standard'} onChange={handleInputChange} className="sr-only" />
                                </label>

                                <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.shippingMethod === 'express' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--secondary)]/20 hover:border-[var(--secondary)]/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.shippingMethod === 'express' ? 'border-[var(--primary)]' : 'border-[var(--secondary)]/40'}`}>
                                            {formData.shippingMethod === 'express' && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <div>
                                            <span className="block font-bold text-lg">Express Delivery</span>
                                            <span className="text-sm font-medium text-orange-500">Delivered in 1-2 business days</span>
                                        </div>
                                    </div>
                                    <span className="font-black text-lg">₹99</span>
                                    <input type="radio" name="shippingMethod" value="express" checked={formData.shippingMethod === 'express'} onChange={handleInputChange} className="sr-only" />
                                </label>
                            </div>

                            <div className="mt-12 flex items-center justify-between">
                                <button onClick={prevStep} className="font-bold opacity-60 hover:opacity-100 flex items-center gap-2 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Return to Address
                                </button>
                                <button onClick={nextStep} className="px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
                                    Continue to Payment
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Method */}
                    {currentStep === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black mb-6">Payment Method</h2>
                            <p className="opacity-70 font-medium mb-6">All transactions are secure and encrypted.</p>
                            
                            <div className="bg-[var(--secondary)]/5 rounded-2xl border border-[var(--secondary)]/20 overflow-hidden divide-y divide-[var(--secondary)]/20">
                                {/* Option: Credit Card */}
                                <div>
                                    <label className={`flex items-center gap-4 p-5 cursor-pointer transition-colors hover:bg-[var(--secondary)]/5`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.paymentMethod === 'card' ? 'border-[var(--primary)]' : 'border-[var(--secondary)]/40'}`}>
                                            {formData.paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <span className="font-bold text-lg flex-1">Credit / Debit Card</span>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-6 bg-blue-500 rounded text-white text-[8px] flex justify-center items-center font-bold">VISA</div>
                                            <div className="w-10 h-6 bg-red-500 rounded text-white text-[8px] flex justify-center items-center font-bold">MC</div>
                                        </div>
                                        <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="sr-only" />
                                    </label>
                                    {formData.paymentMethod === 'card' && (
                                        <div className="p-6 bg-[var(--secondary)]/5 border-t border-[var(--secondary)]/10 space-y-4 animate-in fade-in slide-in-from-top-2">
                                            <div>
                                                <input type="text" placeholder="Card Number" className="w-full bg-white/50 border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" placeholder="Exp (MM/YY)" className="w-full bg-white/50 border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                                <input type="text" placeholder="CVV" className="w-full bg-white/50 border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Name on Card" className="w-full bg-white/50 border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                            </div>
                                        </div>
                                    )}
                                </div>

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
                                        <div className="p-6 bg-[var(--secondary)]/5 border-t border-[var(--secondary)]/10 animate-in fade-in slide-in-from-top-2">
                                            <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" className="w-full bg-white/50 border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium" />
                                        </div>
                                    )}
                                </div>

                                {/* Option: Cash on Delivery */}
                                <div>
                                    <label className={`flex items-center gap-4 p-5 cursor-pointer transition-colors hover:bg-[var(--secondary)]/5`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)]' : 'border-[var(--secondary)]/40'}`}>
                                            {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <span className="font-bold text-lg flex-1">Cash on Delivery</span>
                                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="sr-only" />
                                    </label>
                                    {formData.paymentMethod === 'cod' && (
                                        <div className="p-6 bg-orange-500/10 border-t border-[var(--secondary)]/10 text-orange-600 font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Additional ₹50 charge applies for COD handling.
                                        </div>
                                    )}
                                </div>

                                {/* Option: Digital Wallet */}
                                <div>
                                    <label className={`flex items-center gap-4 p-5 cursor-pointer transition-colors ${walletBalance < finalTotal ? 'opacity-50 grayscale' : 'hover:bg-[var(--secondary)]/5'}`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.paymentMethod === 'wallet' ? 'border-[var(--primary)]' : 'border-[var(--secondary)]/40'}`}>
                                            {formData.paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-bold text-lg block">Pay with Wallet</span>
                                            <span className={`text-xs font-bold ${walletBalance < finalTotal ? 'text-red-500' : 'text-green-600'}`}>
                                                Available Balance: ₹{walletBalance.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>
                                        </div>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="wallet" 
                                            disabled={walletBalance < finalTotal}
                                            checked={formData.paymentMethod === 'wallet'} 
                                            onChange={handleInputChange} 
                                            className="sr-only" 
                                        />
                                    </label>
                                    {formData.paymentMethod === 'wallet' && (
                                        <div className="p-6 bg-[var(--primary)]/5 border-t border-[var(--secondary)]/10 font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                            <svg className="w-6 h-6 shrink-0 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            ₹{finalTotal.toLocaleString()} will be securely deducted from your wallet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {paymentError && (
                                <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    {paymentError}
                                </div>
                            )}

                            <div className="mt-8 flex items-center justify-between">
                                <button onClick={prevStep} className="font-bold opacity-60 hover:opacity-100 flex items-center gap-2 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Return to Shipping
                                </button>
                                <button onClick={handlePlaceOrder} className="px-8 py-4 bg-[var(--primary)] text-[var(--bg)] font-black rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Place Order • ₹{finalTotal}
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-[420px] shrink-0">
                    <div className="bg-[var(--secondary)]/5 rounded-[2rem] border border-[var(--secondary)]/10 p-6 sm:p-8 sticky top-28">
                        <h2 className="text-xl font-black mb-6">Order Summary</h2>

                        {/* Items - Removed scroll to show full list automatically */}
                        <div className="space-y-4 mb-6">
                            {checkoutItems.map(item => (
                                <div key={item._id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-xl bg-[var(--bg)] border border-[var(--secondary)]/10 overflow-hidden relative shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--secondary)]/20 backdrop-blur text-[var(--text)] rounded-full flex items-center justify-center text-[10px] font-bold border border-[var(--secondary)]/20 shadow-sm">{item.quantity}</div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm line-clamp-2 leading-tight mb-1">{item.name}</h4>
                                        <p className="text-xs font-bold opacity-60 uppercase">{item.categoryName || 'Product'}</p>
                                    </div>
                                    <div className="font-black">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <hr className="border-[var(--secondary)]/10 my-6" />

                        {/* Coupon Code */}
                        <div className="flex gap-2 mb-6">
                            <input type="text" placeholder="Promo code / Gift card" className="flex-1 bg-[var(--bg)] border border-[var(--secondary)]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm font-medium transition-all" />
                            <button className="px-4 py-3 bg-[var(--secondary)] text-[var(--bg)] font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">Apply</button>
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 text-sm font-medium">
                            <div className="flex justify-between opacity-80">
                                <span>Subtotal</span>
                                <span>₹{checkoutTotal}</span>
                            </div>
                            <div className="flex justify-between opacity-80">
                                <span>Shipping</span>
                                <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                            </div>
                            <div className="flex justify-between text-green-500 font-bold">
                                <span>Taxes (Included)</span>
                                <span>₹0</span>
                            </div>
                        </div>

                        <hr className="border-[var(--secondary)]/10 my-4" />

                        <div className="flex justify-between items-end">
                            <span className="text-lg font-black">Total</span>
                            <span className="text-2xl font-black text-[var(--primary)]">₹{finalTotal}</span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

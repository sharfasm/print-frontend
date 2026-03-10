import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all required fields.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            await register(formData);
            // On successful registration, redirect to Dashboard
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="max-w-xl w-full relative z-10 pt-20 mt-10">
                {/* Back Navigation */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-4 flex items-center gap-2 font-bold text-sm opacity-70 hover:text-[var(--primary)] hover:opacity-100 transition-all hover:-translate-x-1 duration-300 w-max"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to previous
                </button>
                
                <div className="bg-[var(--bg)]/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-2xl border border-[var(--secondary)]/10">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-2xl font-black tracking-tighter text-[var(--primary)]">PRINT<span className="text-[var(--text)]">CO.</span></span>
                        </Link>
                        <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">Create an Account</h2>
                        <p className="text-base opacity-70 font-medium">Join us to manage orders and track printing history.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--bg)] transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--bg)] transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="phone">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--bg)] transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--bg)] transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--bg)] transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[var(--primary)] text-[var(--bg)] font-black text-lg mt-4 py-4 rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--bg)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm opacity-80 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-[var(--primary)] hover:opacity-80 transition-opacity">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

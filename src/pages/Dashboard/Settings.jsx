import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
    const { user, updateProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    // Toggle eyes
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMsg('');
        setErrorMsg('');
        
        try {
            await updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            setSuccessMsg('Profile updated successfully!');
            // clear passwords
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            setErrorMsg(error.message || 'Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">Account Settings</h1>
            <p className="opacity-70 font-medium mb-10">Update your personal details and security settings.</p>

            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {errorMsg}
                </div>
            )}

            {successMsg && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {successMsg}
                </div>
            )}

            <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 p-6 sm:p-10 rounded-3xl shadow-sm">
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                    
                    {/* Public Profile Section */}
                    <div>
                        <h3 className="text-xl font-black mb-6 uppercase tracking-wider">Public Profile</h3>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group cursor-pointer">
                                <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full bg-[var(--secondary)]/10 border-4 border-[var(--bg)] shadow-md group-hover:opacity-50 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-[var(--text)]"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
                                </div>
                            </div>
                            <div>
                                <button type="button" className="bg-[var(--secondary)]/10 text-[var(--text)] px-4 py-2 text-sm font-bold rounded-lg hover:bg-[var(--secondary)]/20 transition-colors mb-2">Change Avatar</button>
                                <p className="text-xs opacity-50 font-medium">SVG, PNG, or JPG. Max 800x800px.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-[var(--secondary)]/10" />

                    {/* Security Section */}
                    <div>
                        <h3 className="text-xl font-black mb-6 uppercase tracking-wider">Security</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="currentPassword">Current Password <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                        {showCurrentPassword ? (
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
                            <div>
                                <label className="block text-sm font-bold opacity-80 mb-2" htmlFor="newPassword">New Password (Optional)</label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                        {showNewPassword ? (
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
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-[var(--primary)] text-[var(--bg)] font-black px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--bg)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

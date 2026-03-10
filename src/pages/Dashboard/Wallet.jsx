import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';

export default function Wallet() {
    const { walletBalance, walletTransactions, addMoneyToWallet } = useShop();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');

    const handleAddMoney = (e) => {
        e.preventDefault();
        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) return;

        setIsLoading(true);
        // Simulate Gateway Processing Delay
        setTimeout(() => {
            const methodLabel = paymentMethod === 'razorpay' ? 'Razorpay' : paymentMethod === 'stripe' ? 'Stripe' : 'UPI Gateway';
            addMoneyToWallet(numAmount, `Deposit via ${methodLabel}`);
            setAmount('');
            setIsLoading(false);
        }, 1200);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">My Wallet</h1>
            <p className="opacity-70 font-medium mb-10">Manage your digital funds for faster checkouts.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Side: Balance & Top-Up */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    
                    {/* Premium Balance Card */}
                    <div className="relative bg-[var(--text)] text-[var(--bg)] rounded-3xl p-8 overflow-hidden shadow-2xl">
                        {/* Decorative Background Elements */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--primary)] blur-[60px] opacity-40 rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white blur-[40px] opacity-10 rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">Available Balance</h3>
                            <div className="text-5xl font-black tracking-tighter mb-8">
                                ₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </div>
                            
                            <div className="mt-auto">
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-50 mb-1">Card Network</div>
                                <div className="flex gap-2 items-center">
                                    <div className="w-10 h-6 bg-[var(--bg)]/20 rounded flex items-center justify-center font-black text-xs">ZPX</div>
                                    <div className="w-10 h-6 bg-[var(--primary)]/50 rounded flex items-center justify-center font-black text-[10px]">PAY</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top-Up Form */}
                    <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/20 rounded-3xl p-6 md:p-8">
                        <h3 className="text-xl font-black mb-6 uppercase tracking-wider">Add Money</h3>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[500, 1000, 2000, 5000].map(val => (
                                <button 
                                    key={val}
                                    onClick={() => setAmount(val)}
                                    className="px-4 py-2 rounded-xl border border-[var(--secondary)]/20 font-bold text-sm hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
                                >
                                    +₹{val}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleAddMoney} className="flex flex-col gap-4">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl opacity-50">₹</span>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl pl-10 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-black text-xl"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold opacity-70 mb-2 uppercase tracking-wide">Payment Gateway</label>
                                <select 
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium appearance-none"
                                >
                                    <option value="razorpay">Razorpay Checkout</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="upi">UPI Framework (GPay)</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading || !amount || Number(amount) <= 0}
                                className="mt-2 w-full bg-[var(--primary)] text-[var(--bg)] font-black py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>Top Up Wallet</>
                                )}
                            </button>
                        </form>
                    </div>

                </div>

                {/* Right Side: Transactions */}
                <div className="lg:col-span-2">
                    <div className="bg-[var(--bg)] border border-[var(--secondary)]/20 rounded-3xl p-6 md:p-8 shadow-sm h-full">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-wider">Transaction History</h3>
                                <p className="opacity-60 font-medium text-sm mt-1">Your recent deposits and purchases.</p>
                            </div>
                        </div>

                        {walletTransactions.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-bold text-lg">No transactions yet.</p>
                                <p className="text-sm">Top up your wallet to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {walletTransactions.map((tx) => (
                                    <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--secondary)]/5 hover:bg-[var(--secondary)]/10 transition-colors border border-transparent hover:border-[var(--secondary)]/20 group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'CREDIT' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                                {tx.type === 'CREDIT' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg line-clamp-1">{tx.reference}</h4>
                                                <div className="flex items-center gap-2 opacity-60 text-xs font-bold mt-0.5">
                                                    <span>{tx.date}</span>
                                                    <span>•</span>
                                                    <span>{tx.time}</span>
                                                    <span>•</span>
                                                    <span className="font-mono text-[10px] bg-[var(--secondary)]/20 px-1.5 py-0.5 rounded text-[var(--text)]">{tx.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right sm:pl-4">
                                            <div className={`font-black text-xl whitespace-nowrap ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-[var(--text)]'}`}>
                                                {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                            </div>
                                            <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full inline-block mt-1 ${tx.type === 'CREDIT' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                                                {tx.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

export default function DashboardWishlist() {
    const { wishlist, removeFromWishlist, moveWishlistToCart } = useShop();
    const navigate = useNavigate();

    const handleBuyNow = (item) => {
        // Automatically add to cart and redirect to checkout
        moveWishlistToCart(item);
        navigate('/checkout');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">My Wishlist</h1>
            <p className="opacity-70 font-medium mb-10">Products you've saved for later.</p>

            {wishlist.length === 0 ? (
                <div className="bg-[var(--secondary)]/5 border border-[var(--secondary)]/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-inner">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500/50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black mb-2">Your wishlist is empty</h2>
                    <p className="opacity-60 font-medium mb-8 shrink-0">Start saving your favorite products securely.</p>
                    <Link to="/products" className="bg-[var(--primary)] text-[var(--bg)] font-bold px-8 py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity">
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wishlist.map(item => (
                        <div key={item._id} className="group flex flex-col bg-[var(--bg)] border border-[var(--secondary)]/10 rounded-[2rem] p-5 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[var(--secondary)]/5 mb-5 shrink-0 block">
                                <Link to={`/product/${item._id}`}>
                                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                </Link>
                                <button 
                                    onClick={(e) => { e.preventDefault(); removeFromWishlist(item._id); }}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all z-10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col flex-1 px-2 pb-2">
                                <span className="text-[10px] font-black text-[var(--primary)] opacity-80 uppercase tracking-widest mb-1">{item.categoryName || 'Product'}</span>
                                <Link to={`/product/${item._id}`} className="block mb-3">
                                    <h3 className="text-lg font-black line-clamp-1 group-hover:text-[var(--primary)] transition-colors">{item.name}</h3>
                                </Link>
                                <div className="text-2xl font-black mb-6 mt-auto text-[var(--primary)]">₹{item.price}</div>
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => moveWishlistToCart(item)}
                                        className="flex-1 bg-[var(--secondary)]/10 text-[var(--text)] font-bold py-3 rounded-xl hover:bg-[var(--secondary)]/20 transition-all flex items-center justify-center gap-2"
                                        title="Move to Cart"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                                        </svg>
                                        Cart
                                    </button>
                                    <button 
                                        onClick={() => handleBuyNow(item)}
                                        className="flex-[1.5] bg-[var(--primary)] text-[var(--bg)] font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all border-2 border-transparent"
                                    >
                                        Buy Now
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

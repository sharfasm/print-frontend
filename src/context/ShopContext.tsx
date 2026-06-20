// @ts-nocheck
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import AuthContext to tie data to user
import config from '../brand/config';
import api from '../lib/axios'; // Add axios for API calls

const ShopContext = createContext<any>({ cart: [], wishlist: [], orders: [], addresses: [], walletBalance: 0, walletTransactions: [] });

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const { user } = useAuth(); // Get current logged-in user
    // Prefix for localStorage based on user email (or 'guest' if none)
    const storeKey = user ? `shop_data_${user.email}` : 'shop_data_guest';

    // State
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [brandInfo, setBrandInfo] = useState(null);
    const [buyNowItem, setBuyNowItem] = useState(null);

    // Wallet State
    const [walletBalance, setWalletBalance] = useState(0);
    const [walletTransactions, setWalletTransactions] = useState([]);

    // --- PREMIUM AUTH GUARD STATE ---
    const [notification, setNotification] = useState({ show: false, message: "" });
    const [modal, setModal] = useState({ show: false });

    // Subtotals
    const [cartTotal, setCartTotal] = useState(0);

    // Coupon State
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [freeShipping, setFreeShipping] = useState(false);
    const [couponError, setCouponError] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);

    // Load brand info from backend
    useEffect(() => {
        const fetchBrandInfo = async () => {
            try {
                const response = await api.get('/settings');
                const data = response.data;
                setBrandInfo(data);

                // Apply theme colors based on user preference
                if (data.theme) {
                    const currentTheme = localStorage.getItem("theme-mode") ||
                        (typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                    const theme = data.theme[currentTheme];
                    if (theme) {
                        document.documentElement.style.setProperty("--primary", theme.primary);
                        document.documentElement.style.setProperty("--secondary", theme.secondary);
                        document.documentElement.style.setProperty("--bg", theme.bg);
                        document.documentElement.style.setProperty("--text", theme.text);
                    }
                }
            }
            catch (error) {
                console.error("Error fetching brand info:", error);
            }
        };
        fetchBrandInfo();
    }, []);

    // Fixed localStorage keys for the GUEST cart/wishlist. These are independent of
    // the per-user storeKey so we can always find a guest's data at login time to
    // merge it into their account.
    const GUEST_CART_KEY = 'shop_data_guest_cart';
    const GUEST_WISHLIST_KEY = 'shop_data_guest_wishlist';

    // Normalize a product (full product OR an already-stored line) into the compact
    // shape the cart/wishlist views render. Mirrors the backend's formatted payload
    // so guest items and server items look identical to the UI.
    const normalizeProduct = (product) => {
        const image =
            product.image ||
            product.primaryImage ||
            product.coverImage ||
            (Array.isArray(product.images) ? product.images[0] : null);
        return {
            _id: product._id,
            name: product.name,
            price: product.price,
            image,
            slug: product.slug,
            category: product.category,
            categoryName:
                product.categoryName ||
                (product.category && typeof product.category === 'object' ? product.category.name : undefined),
            shortDescription: product.shortDescription,
        };
    };

    const persistGuest = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // Storage may be unavailable (private mode / quota) — ignore.
        }
    };

    // Resilience guard: an API may return an error object, HTML from a proxy, or
    // null instead of the expected list. Coerce anything non-array to [] so the
    // cart/wishlist views (which .map/.reduce/.length over state) can never crash.
    const asArray = (v) => (Array.isArray(v) ? v : []);

    // Load data when user changes.
    //  - Logged in: merge any guest (localStorage) cart/wishlist into the account,
    //    clear the guest copy, then load the authoritative server state.
    //  - Guest: hydrate cart/wishlist from localStorage.
    useEffect(() => {
        let cancelled = false;

        const syncOnAuth = async () => {
            if (user) {
                try {
                    // 1. Read anything the user built while logged out.
                    let guestCart = [];
                    let guestWishlist = [];
                    try {
                        const c = localStorage.getItem(GUEST_CART_KEY);
                        const w = localStorage.getItem(GUEST_WISHLIST_KEY);
                        guestCart = c ? JSON.parse(c) : [];
                        guestWishlist = w ? JSON.parse(w) : [];
                    } catch (e) {
                        guestCart = [];
                        guestWishlist = [];
                    }

                    // 2. Push the guest data into the account (one round-trip each).
                    if (Array.isArray(guestCart) && guestCart.length > 0) {
                        await api.post('/cart/merge', {
                            items: guestCart.map(i => ({
                                productId: i._id,
                                quantity: i.quantity || 1,
                                customization: i.customization || {},
                            })),
                        }).catch(err => console.error("Cart merge failed", err));
                    }
                    if (Array.isArray(guestWishlist) && guestWishlist.length > 0) {
                        await api.post('/wishlist/merge', {
                            productIds: guestWishlist.map(i => i._id),
                        }).catch(err => console.error("Wishlist merge failed", err));
                    }

                    // 3. Drop the guest copy so it never re-merges or leaks across accounts.
                    localStorage.removeItem(GUEST_CART_KEY);
                    localStorage.removeItem(GUEST_WISHLIST_KEY);

                    // 4. Load the authoritative server state.
                    const [cartRes, wishRes, addrRes] = await Promise.all([
                        api.get('/cart'),
                        api.get('/wishlist'),
                        api.get('/address'),
                    ]);
                    if (cancelled) return;
                    // Coerce to arrays — API may return an object/error payload.
                    setCart(Array.isArray(cartRes.data) ? cartRes.data : []);
                    setWishlist(Array.isArray(wishRes.data) ? wishRes.data : []);
                    setAddresses(Array.isArray(addrRes.data) ? addrRes.data : []);
                } catch (error) {
                    console.error("Failed to sync backend shop data", error);
                }
            } else {
                try {
                    const savedCart = localStorage.getItem(GUEST_CART_KEY);
                    setCart(savedCart ? JSON.parse(savedCart) : []);

                    const savedWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
                    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);

                    const savedOrders = localStorage.getItem(`${storeKey}_orders`);
                    setOrders(savedOrders ? JSON.parse(savedOrders) : []);

                    const savedAddresses = localStorage.getItem(`${storeKey}_addresses`);
                    setAddresses(savedAddresses ? JSON.parse(savedAddresses) : []);

                    const savedWalletBalance = localStorage.getItem(`${storeKey}_walletBalance`);
                    setWalletBalance(savedWalletBalance ? JSON.parse(savedWalletBalance) : 0);

                    const savedWalletTransactions = localStorage.getItem(`${storeKey}_walletTransactions`);
                    setWalletTransactions(savedWalletTransactions ? JSON.parse(savedWalletTransactions) : []);
                } catch (e) {
                    setCart([]);
                    setWishlist([]);
                    setOrders([]);
                    setAddresses([]);
                    setWalletBalance(0);
                    setWalletTransactions([]);
                }
            }
        };

        syncOnAuth();
        return () => { cancelled = true; };
    }, [user, storeKey]);

    // Keep the cart subtotal in sync with the cart. Guest cart/wishlist are
    // persisted write-through inside the mutation handlers below (not via a generic
    // save-effect) which avoids a mount-time race that could wipe a guest's stored
    // items before they hydrate, and lets an emptied guest cart persist correctly.
    useEffect(() => {
        const list = Array.isArray(cart) ? cart : [];
        const total = list.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setCartTotal(total);
    }, [cart]);

    useEffect(() => {
        if (!user && orders.length === 0) return;
        localStorage.setItem(`${storeKey}_orders`, JSON.stringify(orders));
    }, [orders, storeKey]);

    useEffect(() => {
        if (!user && addresses.length === 0) return;
        localStorage.setItem(`${storeKey}_addresses`, JSON.stringify(addresses));
    }, [addresses, storeKey]);

    useEffect(() => {
        if (!user && walletBalance === 0) return;
        localStorage.setItem(`${storeKey}_walletBalance`, JSON.stringify(walletBalance));
    }, [walletBalance, storeKey]);

    useEffect(() => {
        if (!user && walletTransactions.length === 0) return;
        localStorage.setItem(`${storeKey}_walletTransactions`, JSON.stringify(walletTransactions));
    }, [walletTransactions, storeKey]);

    // --- AUTH GUARD TRIGGER ---
    const triggerAuthGuard = (message = "Please login to continue") => {
        // Step 1: Show Notification
        setNotification({ show: true, message });
        
        // Step 2: Show Modal after 2 seconds
        setTimeout(() => {
            setModal({ show: true });
        }, 2000);
    };

    // --- CART ACTIONS ---
    // Guests mutate a local (localStorage) cart; logged-in users go through the API
    // exclusively. Local state is never written for a logged-in user — the server is
    // the single source of truth (guest data is merged in once, on login).
    const addToCart = async (product, quantity = 1, customization) => {
        const cust = customization ?? product.customization ?? {};

        if (!user) {
            // GUEST: write-through to the local cart.
            setCart(prev => {
                const list = Array.isArray(prev) ? prev : [];
                const idx = list.findIndex(i =>
                    i._id === product._id &&
                    JSON.stringify(i.customization || {}) === JSON.stringify(cust || {})
                );
                let next;
                if (idx > -1) {
                    next = list.map((i, k) => k === idx ? { ...i, quantity: (i.quantity || 1) + quantity } : i);
                } else {
                    next = [...list, { ...normalizeProduct(product), quantity, customization: cust }];
                }
                persistGuest(GUEST_CART_KEY, next);
                return next;
            });
            return;
        }

        try {
            const res = await api.post('/cart/add', {
                productId: product._id,
                quantity,
                customization: cust,
            });
            setCart(asArray(res.data));
        } catch (err) {
            console.error("Failed to add to cart", err);
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) {
            setCart(prev => {
                const next = (Array.isArray(prev) ? prev : []).filter(i => i._id !== productId);
                persistGuest(GUEST_CART_KEY, next);
                return next;
            });
            return;
        }
        try {
            const res = await api.delete(`/cart/remove/${productId}`);
            setCart(asArray(res.data));
        } catch (err) {
            console.error("Failed to remove from cart", err);
        }
    };

    const updateCartQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        if (!user) {
            setCart(prev => {
                const next = (Array.isArray(prev) ? prev : []).map(i =>
                    i._id === productId ? { ...i, quantity: newQuantity } : i
                );
                persistGuest(GUEST_CART_KEY, next);
                return next;
            });
            return;
        }
        try {
            const res = await api.patch('/cart/update', { productId, quantity: newQuantity });
            setCart(asArray(res.data));
        } catch (err) {
            console.error("Failed to update cart", err);
        }
    };

    const clearCart = async () => {
        if (!user) {
            setCart([]);
            persistGuest(GUEST_CART_KEY, []);
            return;
        }
        try {
            await api.delete('/cart/clear');
            setCart([]);
        } catch (err) {
            console.error("Failed to clear cart", err);
        }
    };

    // --- WISHLIST ACTIONS ---
    const toggleWishlist = async (product) => {
        if (!user) {
            // GUEST: write-through to the local wishlist.
            setWishlist(prev => {
                const list = Array.isArray(prev) ? prev : [];
                const exists = list.some(item => item._id === product._id);
                const next = exists
                    ? list.filter(item => item._id !== product._id)
                    : [...list, normalizeProduct(product)];
                persistGuest(GUEST_WISHLIST_KEY, next);
                return next;
            });
            return;
        }
        try {
            const exists = (wishlist || []).some(item => item._id === product._id);
            if (exists) {
                const res = await api.delete(`/wishlist/remove/${product._id}`);
                setWishlist(asArray(res.data));
            } else {
                const res = await api.post('/wishlist/add', { productId: product._id });
                setWishlist(asArray(res.data));
            }
        } catch (err) {
            console.error("Failed to toggle wishlist", err);
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) {
            setWishlist(prev => {
                const next = (Array.isArray(prev) ? prev : []).filter(i => i._id !== productId);
                persistGuest(GUEST_WISHLIST_KEY, next);
                return next;
            });
            return;
        }
        try {
            const res = await api.delete(`/wishlist/remove/${productId}`);
            setWishlist(asArray(res.data));
        } catch (err) {
            console.error("Failed to remove from wishlist", err);
        }
    };

    const isInWishlist = (productId) => {
        return (wishlist || []).some(item => item._id === productId);
    };

    const moveWishlistToCart = (product) => {
        addToCart(product, 1);
        removeFromWishlist(product._id);
    };

    // --- ORDERS & ADDRESS ACTIONS ---
    const placeOrder = (order) => {
        // Handled by backend now, this is just a placeholder if needed
        setOrders(prev => [order, ...prev]);
        clearCart();
    };

    const addAddress = async (address) => {
        if (!user) return;
        try {
            const res = await api.post('/address', address);
            setAddresses(asArray(res.data));
        } catch (err) {
            console.error("Failed to add address", err);
        }
    };

    const updateAddress = async (id, updatedAddress) => {
        if (!user) return;
        try {
            const res = await api.patch(`/address/${id}`, updatedAddress);
            setAddresses(asArray(res.data));
        } catch (err) {
            console.error("Failed to update address", err);
        }
    };

    const deleteAddress = async (id) => {
        if (!user) return;
        try {
            const res = await api.delete(`/address/${id}`);
            setAddresses(asArray(res.data));
        } catch (err) {
            console.error("Failed to delete address", err);
        }
    };

    const setDefaultAddress = async (id) => {
        if (!user) return;
        try {
            const res = await api.patch(`/address/${id}`, { isDefault: true });
            setAddresses(asArray(res.data));
        } catch (err) {
            console.error("Failed to set default address", err);
        }
    };

    // --- WALLET ACTIONS ---
    const addMoneyToWallet = (amount, reference = 'Top-Up') => {
        const numAmount = Number(amount);
        if (numAmount <= 0) return;

        setWalletBalance(prev => prev + numAmount);
        setWalletTransactions(prev => [{
            id: `WTXN-${Math.floor(Math.random() * 900000) + 100000}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            amount: numAmount,
            type: 'CREDIT',
            reference: reference
        }, ...prev]);
    };

    const spendFromWallet = (amount, reference = 'Order Purchase') => {
        const numAmount = Number(amount);
        if (numAmount <= 0 || numAmount > walletBalance) return false;

        setWalletBalance(prev => prev - numAmount);
        setWalletTransactions(prev => [{
            id: `WTXN-${Math.floor(Math.random() * 900000) + 100000}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            amount: numAmount,
            type: 'DEBIT',
            reference: reference
        }, ...prev]);

        return true; 
    };

    const applyCouponCode = async (code, customTotal?: number) => {
        // Coupons work for everyone — guests included (it's a gift for buyers).
        // The backend applies first-order checks for logged-in users and
        // re-validates the discount again server-side at order creation.
        setCouponLoading(true);
        setCouponError(null);
        try {
            const total = customTotal !== undefined ? customTotal : cartTotal;
            const response = await api.post('/coupons/apply', { couponCode: code, cartTotal: total }, {
                validateStatus: (status) => status < 500
            });
            const data = response.data;
            if (data.success) {
                setAppliedCoupon({
                    code: data.code,
                    discount: data.discount,
                    freeShipping: data.freeShipping,
                    couponId: data.couponId
                });
                setCouponDiscount(data.discount);
                setFreeShipping(data.freeShipping);
            } else {
                setCouponError(data.message || "Failed to apply coupon");
                removeCoupon();
            }
        } catch (error: any) {
            console.error("Apply coupon error:", error);
            setCouponError(error.response?.data?.message || "Invalid coupon code");
            removeCoupon();
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setFreeShipping(false);
        setCouponError(null);
    };

    // Re-validate coupon when cart total changes
    useEffect(() => {
        if (appliedCoupon && cartTotal > 0) {
            const reapply = async () => {
                try {
                    const response = await api.post('/coupons/apply', { 
                        couponCode: appliedCoupon.code, 
                        cartTotal 
                    }, {
                        validateStatus: (status) => status < 500
                    });
                    const data = response.data;
                    if (data.success) {
                        setAppliedCoupon(prev => prev ? {
                            ...prev,
                            discount: data.discount,
                            freeShipping: data.freeShipping
                        } : null);
                        setCouponDiscount(data.discount);
                        setFreeShipping(data.freeShipping);
                    } else {
                        removeCoupon();
                    }
                } catch (error) {
                    removeCoupon();
                }
            };
            reapply();
        } else if (cartTotal === 0) {
            removeCoupon();
        }
    }, [cartTotal]);

    return (
        <ShopContext.Provider value={{
            cart,
            cartTotal,
            wishlist,
            orders,
            addresses,
            walletBalance,
            walletTransactions,
            notification,
            setNotification,
            modal,
            setModal,
            triggerAuthGuard,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            toggleWishlist,
            removeFromWishlist,
            isInWishlist,
            moveWishlistToCart,
            placeOrder,
            addAddress,
            updateAddress,
            deleteAddress,
            setDefaultAddress,
            addMoneyToWallet,
            spendFromWallet,
            brandInfo,
            buyNowItem,
            setBuyNowItem,
            appliedCoupon,
            couponDiscount,
            freeShipping,
            couponError,
            couponLoading,
            applyCouponCode,
            removeCoupon
        }}>
            {children}
        </ShopContext.Provider>
    );
};

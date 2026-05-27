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
                const response = await api.get('/info');
                const data = response.data;
                setBrandInfo(data);
                    
                    // Update CSS variables if theme exists in fetched data
                    if (data.theme) {
                        const mode = "light"; 
                        const theme = data.theme[mode];
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

    // Load data when user changes
    useEffect(() => {
        const fetchBackendData = async () => {
            if (user) {
                try {
                    const [cartRes, wishRes, addrRes] = await Promise.all([
                        api.get('/cart'),
                        api.get('/wishlist'),
                        api.get('/address')
                    ]);
                    setCart(cartRes.data);
                    setWishlist(wishRes.data);
                    setAddresses(addrRes.data);
                } catch (error) {
                    console.error("Failed to fetch backend shop data", error);
                }
            } else {
                try {
                    const savedCart = localStorage.getItem(`${storeKey}_cart`);
                    setCart(savedCart ? JSON.parse(savedCart) : []);

                    const savedWishlist = localStorage.getItem(`${storeKey}_wishlist`);
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
        fetchBackendData();
    }, [user, storeKey]);

    // Save to localStorage on change
    useEffect(() => {
        if (!user && cart.length === 0) return; // Prevent overwriting guest empty state unnecessarily
        localStorage.setItem(`${storeKey}_cart`, JSON.stringify(cart));
        calculateTotal();
    }, [cart, storeKey]);

    useEffect(() => {
        if (!user && wishlist.length === 0) return;
        localStorage.setItem(`${storeKey}_wishlist`, JSON.stringify(wishlist));
    }, [wishlist, storeKey]);

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

    const calculateTotal = () => {
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setCartTotal(total);
    };

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
    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            triggerAuthGuard("Login to add items to your cart");
            return;
        }
        try {
            const res = await api.post('/cart/add', { 
                productId: product._id, 
                quantity,
                customization: product.customization || {} 
            });
            setCart(res.data);
        } catch (err) {
            console.error("Failed to add to cart", err);
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) return;
        try {
            const res = await api.delete(`/cart/remove/${productId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Failed to remove from cart", err);
        }
    };

    const updateCartQuantity = async (productId, newQuantity) => {
        if (!user || newQuantity < 1) return;
        try {
            const res = await api.patch('/cart/update', { productId, quantity: newQuantity });
            setCart(res.data);
        } catch (err) {
            console.error("Failed to update cart", err);
        }
    };

    const clearCart = async () => {
        if (!user) return;
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
            triggerAuthGuard("Login to save items to your wishlist");
            return;
        }
        try {
            const exists = wishlist.some(item => item._id === product._id);
            if (exists) {
                const res = await api.delete(`/wishlist/remove/${product._id}`);
                setWishlist(res.data);
            } else {
                const res = await api.post('/wishlist/add', { productId: product._id });
                setWishlist(res.data);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist", err);
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) return;
        try {
            const res = await api.delete(`/wishlist/remove/${productId}`);
            setWishlist(res.data);
        } catch (err) {
            console.error("Failed to remove from wishlist", err);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
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
            setAddresses(res.data);
        } catch (err) {
            console.error("Failed to add address", err);
        }
    };

    const updateAddress = async (id, updatedAddress) => {
        if (!user) return;
        try {
            const res = await api.patch(`/address/${id}`, updatedAddress);
            setAddresses(res.data);
        } catch (err) {
            console.error("Failed to update address", err);
        }
    };

    const deleteAddress = async (id) => {
        if (!user) return;
        try {
            const res = await api.delete(`/address/${id}`);
            setAddresses(res.data);
        } catch (err) {
            console.error("Failed to delete address", err);
        }
    };

    const setDefaultAddress = async (id) => {
        if (!user) return;
        try {
            const res = await api.patch(`/address/${id}`, { isDefault: true });
            setAddresses(res.data);
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
        if (!user) {
            triggerAuthGuard("Login to apply coupons");
            return;
        }
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import AuthContext to tie data to user
import config from '../brand/config';

const ShopContext = createContext();

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

    // Wallet State
    const [walletBalance, setWalletBalance] = useState(0);
    const [walletTransactions, setWalletTransactions] = useState([]);

    // --- PREMIUM AUTH GUARD STATE ---
    const [notification, setNotification] = useState({ show: false, message: "" });
    const [modal, setModal] = useState({ show: false });

    // Subtotals
    const [cartTotal, setCartTotal] = useState(0);

    // Load brand info from backend
    useEffect(() => {
        const fetchBrandInfo = async () => {
            try {
                const response = await fetch(`${config.api}/${config.brand}/info`);
                const data = await response.json();
                setBrandInfo(data);
                
                // Update CSS variables if theme exists in fetched data
                if (data.theme) {
                    const mode = "light"; // Default to light or get from localStorage
                    const theme = data.theme[mode];
                    if (theme) {
                        document.documentElement.style.setProperty("--primary", theme.primary);
                        document.documentElement.style.setProperty("--secondary", theme.secondary);
                        document.documentElement.style.setProperty("--bg", theme.bg);
                        document.documentElement.style.setProperty("--text", theme.text);
                    }
                }
            } catch (error) {
                console.error("Error fetching brand info:", error);
            }
        };
        fetchBrandInfo();
    }, []);

    // Load data when user changes
    useEffect(() => {
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
    const addToCart = (product, quantity = 1) => {
        if (!user) {
            triggerAuthGuard("Login to add items to your cart");
            return;
        }
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    };

    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart => prevCart.map(item =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    // --- WISHLIST ACTIONS ---
    const toggleWishlist = (product) => {
        if (!user) {
            triggerAuthGuard("Login to save items to your wishlist");
            return;
        }
        setWishlist(prevWishlist => {
            const exists = prevWishlist.find(item => item._id === product._id);
            if (exists) {
                return prevWishlist.filter(item => item._id !== product._id);
            }
            return [...prevWishlist, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prevWishlist => prevWishlist.filter(item => item._id !== productId));
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
        setOrders(prev => [order, ...prev]);
        clearCart();
    };

    const addAddress = (address) => {
        setAddresses(prev => {
            const newAddress = { ...address, id: Date.now(), isDefault: prev.length === 0 };
            return [...prev, newAddress];
        });
    };

    const updateAddress = (id, updatedAddress) => {
        setAddresses(prev => prev.map(addr => addr.id === id ? { ...addr, ...updatedAddress } : addr));
    };

    const deleteAddress = (id) => {
        setAddresses(prev => {
            const updated = prev.filter(addr => addr.id !== id);
            // If we deleted the default address, make the first remaining one default
            if (updated.length > 0 && !updated.some(addr => addr.isDefault)) {
                updated[0].isDefault = true;
            }
            return updated;
        });
    };

    const setDefaultAddress = (id) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
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
            brandInfo
        }}>
            {children}
        </ShopContext.Provider>
    );
};

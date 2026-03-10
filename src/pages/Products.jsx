import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import config from '../brand/config';
import CategoryUI from './HomeUI/CategoryUI';
import { useShop } from '../context/ShopContext';

export default function Products() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, isInWishlist, brandInfo } = useShop();
    const brandName = brandInfo?.name || config.brand;

    // State management
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters and Sorting
    const [sortOption, setSortOption] = useState('Popular');
    const [activeFilters, setActiveFilters] = useState([]);
    
    const [priceFilter, setPriceFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [discountFilter, setDiscountFilter] = useState('');

    // Fetch Categories on Mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${config.api}/${config.brand}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                    
                    // Check if we navigated back from a product details page
                    if (location.state && location.state.categoryId) {
                        const catToSelect = data.find(c => c._id === location.state.categoryId);
                        if (catToSelect) {
                            // Automatically select the category we just came from
                            setSelectedCategory(catToSelect);
                            updateActiveFilters(catToSelect.name, priceFilter, brandFilter, discountFilter);
                        }
                    }
                } else {
                    console.error("Failed to fetch categories from API");
                    setCategories([]); // Fallback to empty if fails
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    // Fetch Products when a Category is selected
    useEffect(() => {
        if (!selectedCategory) return; 

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${config.api}/${config.brand}/products`);
                if (response.ok) {
                    let data = await response.json();
                    
                    // Filter the fetched products by the chosen category ID
                    let filteredProducts = data.filter(
                        p => p.category === selectedCategory._id || p.category === selectedCategory.name
                    );
                    
                    // Sort Mock logic applied on frontend for now
                    let sorted = [...filteredProducts];
                    if (sortOption === 'PriceLowToHigh') sorted.sort((a,b) => a.price - b.price);
                    if (sortOption === 'PriceHighToLow') sorted.sort((a,b) => b.price - a.price);
                    if (sortOption === 'Newest') sorted = sorted.filter(p => p.isNew).concat(sorted.filter(p => !p.isNew));

                    // Price filter logic
                    if (priceFilter === 'under500') sorted = sorted.filter(p => p.price <= 500);
                    if (priceFilter === 'over500') sorted = sorted.filter(p => p.price > 500);

                    // Brand filter logic
                    if (brandFilter) {
                        sorted = sorted.filter(p => p.brand && p.brand.toLowerCase() === brandFilter.toLowerCase());
                    }

                    // Discount filter logic (assuming p.discount is a number like 10, 25, 50)
                    if (discountFilter) {
                        sorted = sorted.filter(p => p.discount && p.discount >= parseInt(discountFilter));
                    }

                    setProducts(sorted);
                } else {
                    console.error("Failed to fetch products from API");
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, sortOption, priceFilter, brandFilter, discountFilter]);

    // Handle Category Click
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        updateActiveFilters(category ? category.name : null, priceFilter, brandFilter, discountFilter);
    };

    // Handle Filter Changes
    const handlePriceFilterChange = (e) => {
        const val = e.target.value;
        setPriceFilter(val);
        updateActiveFilters(selectedCategory?.name, val, brandFilter, discountFilter);
    };

    const updateActiveFilters = (catName, price, brand, discount) => {
        const filters = [];
        if (catName) filters.push(catName);
        if (price === 'under500') filters.push('Under ₹500');
        if (price === 'over500') filters.push('Over ₹500');
        if (brand) filters.push(`Brand: ${brand.charAt(0).toUpperCase() + brand.slice(1)}`);
        if (discount) filters.push(`Discount: ${discount}%+`);
        setActiveFilters(filters);
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setPriceFilter('');
        setRatingFilter('');
        setBrandFilter('');
        setDiscountFilter('');
        setSortOption('Popular');
        setActiveFilters([]);
    };

    const handleCartClick = (e, prod) => {
        e.preventDefault();
        e.stopPropagation(); // prevent link click
        addToCart(prod, 1);
    };

    const handleWishlistClick = (e, prod) => {
        e.preventDefault();
        e.stopPropagation(); // prevent link click
        toggleWishlist(prod); // toggle takes care of add/remove natively
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)]">
            {/* 2. Products Header Section */}
            <div className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center pt-24 pb-12">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Hero Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop" 
                        alt={`${brandName} Products Header`} 
                        className="w-full h-full object-cover transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
                </div>
                <div className="relative z-10 text-center text-white space-y-5 px-4 max-w-4xl flex flex-col items-center mt-8">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-xl uppercase">
                        Products
                    </h1>
                    <p className="text-lg md:text-2xl font-medium opacity-90 drop-shadow-lg tracking-wide">
                        Explore our premium product range
                    </p>
                    <div className="w-24 h-1.5 bg-[var(--primary)] rounded-full mt-4 shadow-[0_0_15px_var(--primary)]" />
                </div>
            </div>

            {/* 3. Main Section */}
            <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-14 py-8">
                
                {/* Breadcrumb */}
                <div className="text-sm font-medium mb-8 flex items-center gap-2 opacity-80">
                    <Link to="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
                    <span>&gt;</span>
                    <button onClick={() => handleCategoryClick(null)} className="hover:text-[var(--primary)] transition-colors">Products</button>
                    {selectedCategory ? (
                        <>
                            <span>&gt;</span>
                            <span className="text-[var(--primary)]">{selectedCategory.name}</span>
                        </>
                    ) : (
                        <>
                            <span>&gt;</span>
                            <span className="text-[var(--text)]">View All</span>
                        </>
                    )}
                </div>

                {/* Global Filter Bar */}
                <div className="bg-[var(--bg)]/80 backdrop-blur-2xl rounded-2xl p-5 md:p-6 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border border-[var(--secondary)]/20 shadow-2xl shadow-[var(--secondary)]/10 relative z-20 -mt-14 mx-auto max-w-full overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5 pointer-events-none" />
                    {/* Filters (Left) */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Category Dropdown */}
                        <div className="relative">
                            <select 
                                value={selectedCategory ? selectedCategory.name : ''}
                                onChange={(e) => {
                                    const cat = categories.find(c => c.name === e.target.value);
                                    handleCategoryClick(cat || null);
                                }}
                                className="appearance-none bg-[var(--bg)] text-[var(--text)] text-sm font-medium border border-[var(--secondary)]/40 rounded-lg pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm cursor-pointer"
                            >
                                <option value="">Category ▼</option>
                                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                            </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">

                        {/* Price Dropdown */}
                        <div className="relative">
                            <select 
                                value={priceFilter}
                                onChange={handlePriceFilterChange}
                                className="appearance-none bg-[var(--bg)] text-[var(--text)] text-sm font-medium border border-[var(--secondary)]/40 rounded-lg pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm cursor-pointer"
                            >
                                <option value="">Price ▼</option>
                                <option value="under500">Under ₹500</option>
                                <option value="over500">Above ₹500</option>
                            </select>
                        </div>

                        {/* Rating Dropdown */}
                        <div className="relative hidden sm:block">
                            <select 
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                                className="appearance-none bg-[var(--bg)] text-[var(--text)] text-sm font-medium border border-[var(--secondary)]/40 rounded-lg pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm cursor-pointer"
                            >
                                <option value="">Rating ▼</option>
                                <option value="4+">4 Stars & Up</option>
                                <option value="3+">3 Stars & Up</option>
                            </select>
                        </div>

                        {/* Brand Dropdown */}
                        <div className="relative">
                            <select 
                                value={brandFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setBrandFilter(val);
                                    updateActiveFilters(selectedCategory?.name, priceFilter, val, discountFilter);
                                }}
                                className="appearance-none bg-[var(--bg)] text-[var(--text)] text-sm font-medium border border-[var(--secondary)]/40 rounded-lg pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm cursor-pointer"
                            >
                                <option value="">Brand ▼</option>
                                <option value="nike">Nike</option>
                                <option value="adidas">Adidas</option>
                                <option value="puma">Puma</option>
                            </select>
                        </div>

                        {/* Discount Dropdown */}
                        <div className="relative">
                            <select 
                                value={discountFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setDiscountFilter(val);
                                    updateActiveFilters(selectedCategory?.name, priceFilter, brandFilter, val);
                                }}
                                className="appearance-none bg-[var(--bg)] text-[var(--text)] text-sm font-medium border border-[var(--secondary)]/40 rounded-lg pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm cursor-pointer"
                            >
                                <option value="">Discount ▼</option>
                                <option value="10">10% Off or more</option>
                                <option value="25">25% Off or more</option>
                                <option value="50">50% Off or more</option>
                            </select>
                        </div>
                    </div>
                    </div>

                    {/* Sorting (Right) */}
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <span className="text-sm font-semibold opacity-70 whitespace-nowrap">Sort:</span>
                        <select 
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-transparent text-[var(--text)] text-sm font-bold border-b-2 border-[var(--primary)] px-2 py-1 outline-none min-w-[140px] cursor-pointer"
                        >
                            <option value="Popular">Popular ▼</option>
                            <option value="PriceLowToHigh">Price Low→High ▼</option>
                            <option value="PriceHighToLow">Price High→Low ▼</option>
                            <option value="Newest">Newest ▼</option>
                        </select>
                    </div>
                </div>

                {/* Active Filters Display */}
                {activeFilters.length > 0 && (
                    <div className="flex items-center flex-wrap gap-2 mb-8 bg-[var(--bg)] p-3 rounded-lg border border-[var(--secondary)]/20 shadow-sm">
                        <span className="text-sm font-medium opacity-70 mr-2">Active Filters:</span>
                        {activeFilters.map((filter, idx) => (
                            <span key={idx} className="bg-[var(--primary)] text-[var(--bg)] text-xs font-bold px-3 py-1.5 rounded-md flex items-center shadow-sm">
                                {filter}
                            </span>
                        ))}
                        <button onClick={clearFilters} className="text-sm text-[var(--text)] font-semibold underline hover:text-[var(--primary)] ml-2 transition-colors">
                            Clear All
                        </button>
                    </div>
                )}

                {/* Main Layout (Two Column Layout) */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Side: Category Sidebar (Sticky) */}
                    <aside className="w-full lg:w-[280px] shrink-0 sticky top-24 bg-[var(--text)]/5 p-6 rounded-[16px] border border-[var(--secondary)]/20 shadow-sm hidden lg:block">
                        <h3 className="text-lg font-bold mb-6 uppercase tracking-wider border-b-2 border-[var(--primary)] inline-block pb-1">
                            Categories
                        </h3>
                        {/* Scrollable category navigation */}
                        <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <li>
                                <button 
                                    onClick={() => handleCategoryClick(null)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-3 ${!selectedCategory ? 'bg-[var(--primary)] text-[var(--bg)] shadow-md' : 'hover:bg-[var(--text)]/10'}`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                                    View All
                                </button>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat._id}>
                                    <button 
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-between group ${selectedCategory?._id === cat._id ? 'bg-[var(--primary)] text-[var(--bg)] shadow-md' : 'hover:bg-[var(--text)]/10'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                                            {cat.name}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Right Side: Products Grid Area */}
                    <div className="w-full flex-grow min-h-[50vh]">
                        {loading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                                <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mb-4"></div>
                                <p className="font-medium opacity-70 text-sm">Loading...</p>
                            </div>
                        ) : (
                            <>
                                {/* State 1: No category selected -> Display CATEGORY CARDS */}
                                {!selectedCategory ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {categories.map((cat) => (
                                            <div 
                                                key={cat._id} 
                                                onClick={() => handleCategoryClick(cat)}
                                                className="group cursor-pointer relative rounded-[16px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-[var(--text)]/5 aspect-[4/5] flex items-end border border-[var(--secondary)]/10"
                                            >
                                                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                                <div className="relative z-10 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                    <h3 className="text-white text-2xl font-bold tracking-wide">{cat.name}</h3>
                                                    <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-2 transition-all opacity-0 group-hover:opacity-100">
                                                        <span className="text-[var(--secondary)] text-sm font-semibold flex items-center gap-1 uppercase tracking-wider">
                                                            Shop Collection &rarr;
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* State 2: Category Selected -> Fetch/Filter and Display PRODUCT CARDS */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {products.length === 0 ? (
                                            <div className="col-span-full py-20 text-center bg-[var(--text)]/5 rounded-2xl border border-[var(--secondary)]/20">
                                                <p className="text-lg font-bold opacity-70">No products found in this category.</p>
                                                <button onClick={() => handleCategoryClick(null)} className="mt-4 px-6 py-2 bg-[var(--primary)] text-[var(--bg)] rounded-full text-sm font-bold shadow-md hover:bg-opacity-90 transition-all">
                                                    Go Back
                                                </button>
                                            </div>
                                        ) : (
                                            products.map(prod => (
                                                <Link to={`/product/${prod._id}`} key={prod._id} className="group bg-[var(--bg)] rounded-[12px] border border-[var(--secondary)]/20 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
                                                    {/* Image Wrapper */}
                                                    <div className="relative aspect-square overflow-hidden bg-[var(--text)]/5 p-0">
                                                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        
                                                        {/* Wishlist Icon on Top Right of Image */}
                                                        <button 
                                                            onClick={(e) => handleWishlistClick(e, prod)}
                                                            className={`absolute top-3 right-3 w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 group/wishlist
                                                                ${isInWishlist(prod._id) 
                                                                    ? 'bg-red-500 text-white hover:bg-red-600' 
                                                                    : 'bg-white/90 text-[var(--secondary)] hover:bg-white hover:text-red-500'
                                                                }
                                                                hover:scale-110 active:scale-90 active:bg-red-600 active:text-white
                                                            `}
                                                            title={isInWishlist(prod._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                                        >
                                                            <svg 
                                                                xmlns="http://www.w3.org/2000/svg" 
                                                                fill={isInWishlist(prod._id) ? "currentColor" : "none"} 
                                                                viewBox="0 0 24 24" 
                                                                strokeWidth={2} 
                                                                stroke="currentColor" 
                                                                className={`w-5 h-5 transition-transform duration-300 ${isInWishlist(prod._id) ? 'scale-110' : 'group-hover/wishlist:scale-110'}`}
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Content */}
                                                    <div className="p-4 flex flex-col flex-grow">
                                                        <div className="text-xs font-bold text-[var(--secondary)] mb-1 uppercase tracking-widest">{prod.category}</div>
                                                        <h3 className="text-[15px] font-bold text-[var(--text)] mb-2 line-clamp-2 leading-tight">{prod.name}</h3>
                                                        
                                                        {/* Footer of Card */}
                                                        <div className="mt-auto flex items-end justify-between pt-3">
                                                            <div>
                                                                <span className="text-lg font-black text-[var(--text)]">₹{prod.price}</span>
                                                                {/* Rating Stars Mock */}
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <span className="text-[10px] font-bold bg-[var(--text)]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                        {prod.rating} 
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-500"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Cart Button Next to Price */}
                                                            <button 
                                                                onClick={(e) => handleCartClick(e, prod)}
                                                                className="w-11 h-11 bg-[var(--primary)] text-[var(--bg)] rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-opacity-90 active:scale-95 group/cart overflow-hidden relative"
                                                                title="Add to Cart"
                                                            >
                                                                {/* Static Shopping Bag Icon */}
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover/cart:scale-110">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                </div>
            </main>

            <CategoryUI/>

            {/* 4. Footer */}
            <Footer />
        </div>
    );
}

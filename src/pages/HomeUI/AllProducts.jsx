import React, { useState, useEffect } from 'react';
import InfiniteMenu from "../../components/InfiniteProducts";
import config from "../../brand/config";

export default function AllProducts() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${config.api}/${config.brand}/products`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // Take only 16 items max to avoid WebGL texture Memory overflow
                    // Creating an atlas of 112 high-res images frequently crashes the canvas.
                    const limitedData = data.slice(0, 16); 
                    
                    const formattedItems = limitedData.map(product => ({
                        // Ensure we have a valid image URL for the 3D texture
                        image: product.image || 'https://picsum.photos/600/600?grayscale',
                        link: `/product/${product._id}`, // This connects to your React Router ProductDetails page
                        title: product.name,
                        description: `₹${product.price}`
                    }));
                    setItems(formattedItems);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Don't render the 3D canvas until the items are loaded, otherwise it defaults to placeholder items
    if (!items.length) {
        return (
            <section className="py-24 bg-[var(--bg)] text-[var(--text)] border-t border-[var(--secondary)]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-[var(--bg)] text-[var(--text)] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4 text-[var(--text)]">
                        Discover More
                    </h2>
                    <p className="text-lg font-medium opacity-70 text-[var(--text)]">
                        Navigate our interactive 3D product universe.
                    </p>
                    <hr className="w-24 h-1.5 mx-auto my-6 bg-[var(--primary)] border-0 rounded-full" />
                </div>
                {/* The height defines the size of the WebGL canvas block. Set to solid black to match 3D environment */}
                <div className="rounded-3xl shadow-2xl relative w-full h-[600px] overflow-hidden bg-black border-[4px] border-[var(--primary)]/30 group">
                    <InfiniteMenu items={items} scale={1} />
                </div>
            </div>
        </section>
    );
}

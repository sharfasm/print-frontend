// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import InfiniteMenu from "../../components/InfiniteProducts";
import config from "../../brand/config";
import { resolveImage } from "../../lib/imageUtils";
import api from "../../lib/axios";

export default function AllProducts() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                const data = response.data;
                
                // Take only 16 items max to avoid WebGL texture Memory overflow
                const limitedData = data.slice(0, 16); 
                
                const formattedItems = limitedData.map(product => ({
                    image: resolveImage(product.coverImage || product.primaryImage || (product.images && product.images[0])),
                    link: `/product/${product._id}`,
                    title: product.name,
                    description: `₹${product.price}`
                }));
                setItems(formattedItems);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

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
                <div className="rounded-3xl shadow-2xl relative w-full h-[600px] overflow-hidden bg-black border-[4px] border-[var(--primary)]/30 group">
                    <InfiniteMenu items={items} scale={1} />
                </div>
            </div>
        </section>
    );
}

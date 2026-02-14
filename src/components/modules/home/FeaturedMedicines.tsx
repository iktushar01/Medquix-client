"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface Medicine {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    manufacturer: string;
    category: { name: string };
    images: { imageUrl: string }[];
}

export default function FeaturedMedicines() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://medquix-server.vercel.app/api/medicines")
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setMedicines(json.data.slice(0, 4));
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch medicines", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex justify-center items-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
                            Latest Medicine
                        </h2>
                        <p className="text-muted-foreground">
                            Explore our newest arrivals and top-quality OTC medicines sourced from trusted manufacturers.
                        </p>
                    </div>
                    <Link href="/shop" className="text-primary font-semibold flex items-center gap-2 hover:underline">
                        View all products <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Medicine Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {medicines.map((med) => (
                        <Link
                            key={med.id}
                            href={`/shop/${med.id}`}
                            className="group bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
                                <img
                                    src={med.images[0]?.imageUrl || "https://via.placeholder.com/200"}
                                    alt={med.name}
                                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Quick Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                        med.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {med.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                <span className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">
                                    {med.category.name}
                                </span>
                                <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                    {med.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                                    {med.description}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Price</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            ${parseFloat(med.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <button className="p-2.5 rounded-lg bg-primary text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
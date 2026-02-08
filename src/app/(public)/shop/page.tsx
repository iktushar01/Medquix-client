"use client";

import React, { useState } from "react";
// import { useMedicines } from "@/lib/hooks/useMedicines";
import { MedicineCard } from "@/components/MedicineCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useMedicines } from "@/hooks/useMedicines";

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const { data: medicines, isLoading } = useMedicines(selectedCategory);

    const { data: categories } = useQuery<{ id: number; name: string }[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get("/categories");
            return res.data.data;
        },
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-4">Shop</h1>

            {categories && (
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {medicines?.map((medicine) => (
                    <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
            </div>
        </div>
    );
}

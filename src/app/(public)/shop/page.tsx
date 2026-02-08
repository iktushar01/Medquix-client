"use client";

import React, { useState } from "react";
import { MedicineCard } from "@/components/modules/shoppages/MedicineCard";
import { CategoryFilter } from "@/components/modules/shoppages/CategoryFilter";
import { useMedicines } from "@/hooks/useMedicines";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import Loading from "@/app/loading";

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

  if (isLoading) return <Loading/>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Shop Medicines</h1>

      {categories && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {medicines?.map((medicine) => (
          <MedicineCard key={medicine.id} medicine={medicine} />
        ))}
      </div>
    </div>
  );
}

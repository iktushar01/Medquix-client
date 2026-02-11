"use client";

import React, { useState, useMemo } from "react";
import { MedicineCard } from "@/components/modules/shoppages/MedicineCard";
import { ShopFilters } from "@/components/modules/shoppages/CategoryFilter";
import { useMedicines, Medicine } from "@/hooks/useMedicines";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import Loading from "@/app/loading";

export default function ShopPage() {
  const [filters, setFilters] = useState<any>({
    categoryId: null,
    search: "",
    minPrice: undefined,
    maxPrice: undefined,
    manufacturer: "",
  });

  // Fetch all medicines (without filters if backend filtering fails)
  const { data: allMedicines, isLoading } = useMedicines();

  const { data: categories } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data;
    },
  });

  // Apply frontend filtering
  const filteredMedicines = useMemo(() => {
    if (!allMedicines) return [];

    return allMedicines.filter((medicine: Medicine) => {
      // Filter by category
      if (filters.categoryId && medicine.categoryId !== filters.categoryId) {
        return false;
      }

      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = medicine.name.toLowerCase().includes(searchLower);
        const matchesDescription = medicine.description?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesDescription) {
          return false;
        }
      }

      // Filter by price range
      const price = parseFloat(medicine.price);
      if (filters.minPrice !== undefined && price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && price > filters.maxPrice) {
        return false;
      }

      // Filter by manufacturer
      if (filters.manufacturer) {
        const manufacturerLower = filters.manufacturer.toLowerCase();
        if (!medicine.manufacturer?.toLowerCase().includes(manufacturerLower)) {
          return false;
        }
      }

      return true;
    });
  }, [allMedicines, filters]);

  if (isLoading) return <Loading />

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary mb-8 px-4 lg:px-0">Shop Medicines</h1>

      <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-0">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          {categories && (
            <ShopFilters
              categories={categories}
              filters={filters}
              setFilters={setFilters}
            />
          )}
        </div>

        {/* Medicine Grid */}
        <div className="flex-1">
          {filteredMedicines && filteredMedicines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-xl border-dashed border-2">
              <p className="text-muted-foreground">No medicines found matching your criteria.</p>
              <button
                onClick={() => setFilters({ categoryId: null, search: "", minPrice: undefined, maxPrice: undefined, manufacturer: "" })}
                className="text-primary hover:underline mt-2 text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface Category {
  id: number;
  name: string;
}

interface FilterState {
  categoryId: number | null;
  search: string;
  minPrice?: number;
  maxPrice?: number;
  manufacturer: string;
}

interface ShopFiltersProps {
  categories: Category[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const ShopFilters = ({
  categories,
  filters,
  setFilters,
}: ShopFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || "");

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: localSearch }));
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  // Handle Price Apply
  const applyPriceFilter = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({
      categoryId: null,
      search: "",
      minPrice: undefined,
      maxPrice: undefined,
      manufacturer: "",
    });
    setLocalSearch("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
  };

  const activeFiltersCount = [
    filters.categoryId,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.manufacturer,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="px-2 py-0.5 h-auto">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your medicine search</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <FilterContent
                categories={categories}
                filters={filters}
                setFilters={setFilters}
                localSearch={localSearch}
                setLocalSearch={setLocalSearch}
                localMinPrice={localMinPrice}
                setLocalMinPrice={setLocalMinPrice}
                localMaxPrice={localMaxPrice}
                setLocalMaxPrice={setLocalMaxPrice}
                applyPriceFilter={applyPriceFilter}
                clearFilters={clearFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filters</h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-0 text-muted-foreground hover:text-primary"
            >
              Clear All
            </Button>
          )}
        </div>
        <FilterContent
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          localSearch={localSearch}
          setLocalSearch={setLocalSearch}
          localMinPrice={localMinPrice}
          setLocalMinPrice={setLocalMinPrice}
          localMaxPrice={localMaxPrice}
          setLocalMaxPrice={setLocalMaxPrice}
          applyPriceFilter={applyPriceFilter}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
};

const FilterContent = ({
  categories,
  filters,
  setFilters,
  localSearch,
  setLocalSearch,
  localMinPrice,
  setLocalMinPrice,
  localMaxPrice,
  setLocalMaxPrice,
  applyPriceFilter,
}: any) => {
  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Search</h4>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Categories</h4>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          <button
            onClick={() => setFilters((prev: any) => ({ ...prev, categoryId: null }))}
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${filters.categoryId === null
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted"
              }`}
          >
            All Categories
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setFilters((prev: any) => ({ ...prev, categoryId: cat.id }))}
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${filters.categoryId === cat.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Price Range</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            className="h-8"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className="h-8"
          />
        </div>
        <Button onClick={applyPriceFilter} variant="secondary" size="sm" className="w-full h-8">
          Apply Price
        </Button>
      </div>

      <Separator />

      {/* Manufacturer */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Manufacturer</h4>
        <Input
          placeholder="Filter by brand..."
          value={filters.manufacturer}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, manufacturer: e.target.value }))}
        />
      </div>
    </div>
  );
};

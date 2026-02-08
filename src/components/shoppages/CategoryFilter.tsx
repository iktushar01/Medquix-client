"use client";

import React from "react";

interface CategoryFilterProps {
  categories: { id: number; name: string }[];
  selectedCategory: number | null;
  onSelect: (id: number | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      <button
        className={`px-4 py-2 rounded-lg font-semibold ${
          selectedCategory === null
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`px-4 py-2 rounded-lg font-semibold ${
            selectedCategory === cat.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

"use client";

import React from "react";

interface CategoryFilterProps {
  categories: { id: number; name: string }[];
  selectedCategory: number | null;
  onSelect: (id: number | null) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      <button
        className={`px-3 py-1 rounded ${selectedCategory === null ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`px-3 py-1 rounded ${selectedCategory === cat.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

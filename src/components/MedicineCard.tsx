"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MedicineProps {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  manufacturer: string;
  expiryDate: string;
  category: { name: string };
}

export const MedicineCard = ({ medicine }: { medicine: MedicineProps }) => {
  return (
    <div className={cn("border rounded-lg p-4 shadow hover:shadow-md transition")}>
      <h2 className="font-bold text-lg">{medicine.name}</h2>
      <p className="text-sm text-muted-foreground">{medicine.description}</p>
      <p className="mt-2 text-sm">
        <span className="font-medium">Price:</span> ${medicine.price}
      </p>
      <p className="text-sm">
        <span className="font-medium">Stock:</span> {medicine.stock}
      </p>
      <p className="text-sm">
        <span className="font-medium">Manufacturer:</span> {medicine.manufacturer}
      </p>
      <p className="text-sm">
        <span className="font-medium">Expiry:</span> {new Date(medicine.expiryDate).toLocaleDateString()}
      </p>
      <p className="text-sm mt-1">
        <span className="font-medium">Category:</span> {medicine.category.name}
      </p>
    </div>
  );
};

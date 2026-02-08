"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    <div
      className={cn(
        "border border-border rounded-xl p-5 bg-card text-card-foreground shadow hover:shadow-lg transition-all duration-300"
      )}
    >
      <h2 className="text-xl font-bold text-primary-foreground">{medicine.name}</h2>
      <p className="text-muted-foreground mt-1">{medicine.description}</p>
      <p className="mt-2">
        <span className="font-semibold">Price:</span>{" "}
        <span className="text-secondary">${medicine.price}</span>
      </p>
      <p>
        <span className="font-semibold">Stock:</span> {medicine.stock}
      </p>
      <p>
        <span className="font-semibold">Manufacturer:</span> {medicine.manufacturer}
      </p>
      <p>
        <span className="font-semibold">Expiry:</span>{" "}
        {new Date(medicine.expiryDate).toLocaleDateString()}
      </p>
      <p className="mt-1">
        <span className="font-semibold">Category:</span> {medicine.category.name}
      </p>
      <Link href={`/shop/${medicine.id}`}>
        <button className="mt-3 w-full bg-primary text-primary-foreground rounded-md py-2 hover:bg-primary/90 transition cursor-pointer">
          details
        </button>
      </Link>
    </div>
  );
};

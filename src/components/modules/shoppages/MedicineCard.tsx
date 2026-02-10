"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";


interface MedicineProps {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: { name: string };
  images: { imageUrl: string }[];
}

export const MedicineCard = ({ medicine }: { medicine: MedicineProps }) => {
  const imageUrl = medicine.images?.[0]?.imageUrl || "/placeholder-medicine.png";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE CONTAINER */}
      <Link href={`/shop/${medicine.id}`} className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={medicine.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
            {medicine.category.name}
          </span>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/shop/${medicine.id}`}>
              <h3 className="line-clamp-1 font-semibold text-foreground transition-colors hover:text-primary">
                {medicine.name}
              </h3>
            </Link>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {medicine.stock > 0 ? `${medicine.stock} in stock` : "Out of stock"}
            </p>
          </div>
          <p className="text-lg font-bold text-primary">৳{medicine.price}</p>
        </div>

        {/* Action Button - Simplified */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/shop/${medicine.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View Details
          </Link>

        </div>
      </div>
    </div>
  );
};
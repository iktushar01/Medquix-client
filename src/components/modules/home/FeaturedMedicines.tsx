"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, Pill, ShoppingCart } from "lucide-react";

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
      <section className="bg-background py-24">
        <div className="flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[linear-gradient(180deg,var(--background)_0%,var(--muted)_100%)] py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
              Featured Shelf
            </span>
            <h2 className="mt-5 font-serif text-3xl font-black text-foreground sm:text-4xl">
              Fast-moving picks from the MedQuix medicine shelf.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              A sharper product layout with clearer category, stock, and price
              information so customers can scan essentials faster.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
          >
            View all medicines
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {medicines.map((med) => (
            <Link
              key={med.id}
              href={`/shop/${med.id}`}
              className="group overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.10)]"
            >
              <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--accent)_0%,var(--background)_55%,var(--muted)_100%)] p-6">
                <div className="absolute right-4 top-4 rounded-full bg-card/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
                  {med.category.name}
                </div>
                <div className="relative mx-auto aspect-square max-w-[210px]">
                  <Image
                    src={med.images[0]?.imageUrl || "https://via.placeholder.com/300"}
                    alt={med.name}
                    fill
                    className="object-contain transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 22vw"
                  />
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Pill className="h-3.5 w-3.5" />
                    {med.manufacturer}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${
                      med.stock > 0
                        ? "bg-primary/12 text-primary"
                        : "bg-destructive/12 text-destructive"
                    }`}
                  >
                    {med.stock > 0 ? "In stock" : "Unavailable"}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground transition group-hover:text-primary">
                    {med.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
                    {med.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Price
                    </p>
                    <p className="mt-1 text-2xl font-black text-foreground">
                      ${parseFloat(med.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                    View
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  BadgeCheck
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MySwal = withReactContent(Swal);

interface MedicineImage {
  id: number;
  imageUrl: string;
}

interface MedicineProps {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  manufacturer: string;
  expiryDate: string;
  category: { name: string };
  images: MedicineImage[];
}

export default function MedicineDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Detect Tailwind dark mode
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);

  // 1. Fetch Medicine Data
  const { data: medicine, isLoading } = useQuery<MedicineProps>({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const res = await api.get(`/medicines/${id}`);
      return res.data.data;
    },
  });

  // 2. Add to Cart Mutation
  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        medicineId: Number(id),
        quantity: quantity,
      };
      const res = await api.post(`/cart`, payload);
      return res.data;
    },
    onSuccess: (res) => {
      MySwal.fire({
        title: "Success!",
        text: res.message || "Added to cart successfully!",
        icon: "success",
        confirmButtonText: "OK",
        background: isDark ? "#1a1a1a" : "#fff",
        color: isDark ? "#f0f0f0" : "#000",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      MySwal.fire({
        title: "Error!",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "OK",
        background: isDark ? "#1a1a1a" : "#fff",
        color: isDark ? "#f0f0f0" : "#000",
      });
      console.error("Cart API Error:", error.response?.data);
    },
  });

  if (isLoading) return <Loading />;
  if (!medicine)
    return (
      <div className="flex h-[50vh] items-center justify-center text-xl font-semibold text-muted-foreground">
        Medicine not found.
      </div>
    );

  const images = medicine.images?.length > 0 ? medicine.images : [{ id: 0, imageUrl: "/placeholder-medicine.png" }];

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        
        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm">
            <Image
              src={images[activeImg].imageUrl}
              alt={medicine.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6 transition-all duration-300"
              priority
            />
            <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary backdrop-blur-md">
              {medicine.category.name}
            </Badge>
          </div>
          
          {/* Slider Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImg(idx)}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  activeImg === idx ? "border-primary ring-2 ring-primary/10" : "border-muted opacity-60 hover:opacity-100"
                )}
              >
                <Image 
                  src={img.imageUrl} 
                  alt="thumbnail" 
                  fill 
                  sizes="80px" 
                  className="object-cover" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS & PURCHASE */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-bold uppercase tracking-widest text-primary/70">
              {medicine.manufacturer || "Generic Health"}
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
              {medicine.name}
            </h1>
            
            <div className="mt-6 flex items-center gap-6">
              <span className="text-4xl font-bold text-primary">৳{medicine.price}</span>
              <div className="h-8 w-px bg-border" />
              {medicine.stock > 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-semibold">In Stock ({medicine.stock})</span>
                </div>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
          </div>

          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            {medicine.description}
          </p>

          <div className="mb-8 space-y-6 rounded-2xl border bg-card dark:bg-slate-900 p-6 shadow-sm">
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border bg-background dark:bg-slate-800 p-1 shadow-inner">
                  <Button 
                    variant="ghost" size="icon" className="h-10 w-10 rounded-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-bold">{quantity}</span>
                  <Button 
                    variant="ghost" size="icon" className="h-10 w-10 rounded-lg"
                    onClick={() => setQuantity(Math.min(medicine.stock, quantity + 1))}
                    disabled={quantity >= medicine.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm font-medium text-muted-foreground italic">
                  Total: <span className="text-foreground">৳{(Number(medicine.price) * quantity).toFixed(2)}</span>
                </p>
              </div>
            </div>

            <Button 
              onClick={() => addToCart()} 
              disabled={medicine.stock === 0 || isPending}
              className="h-14 w-full gap-3 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <ShoppingCart className="h-5 w-5" />
              {isPending ? "Processing..." : "Add to Cart"}
            </Button>
          </div>

          {/* FEATURES GRID */}
          <div className="grid grid-cols-2 gap-6 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Expires On</p>
                <p className="text-sm font-semibold italic text-destructive">
                  {new Date(medicine.expiryDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Delivery</p>
                <p className="text-sm font-semibold">Home Delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Quality</p>
                <p className="text-sm font-semibold">100% Original</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Returns</p>
                <p className="text-sm font-semibold">7 Days Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

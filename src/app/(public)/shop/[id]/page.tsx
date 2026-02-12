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
  BadgeCheck,
  Star,
  ChevronRight,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface IImage {
  id: number;
  imageUrl: string;
}

interface IReview {
  id: number;
  user: {
    name: string;
  };
  createdAt: string;
  rating: number;
  comment: string;
}

const MySwal = withReactContent(Swal);

export default function MedicineDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const { data: medicine, isLoading: isMedicineLoading } = useQuery({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const res = await api.get(`/medicines/${id}`);
      return res.data.data;
    },
  });

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await api.get(`/reviews/medicine/${id}`);
      return res.data;
    },
  });

  const reviews = reviewsData?.reviews || [];

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/cart`, { medicineId: Number(id), quantity });
      return res.data;
    },
    onSuccess: (res) => {
      MySwal.fire({
        title: "Added to Cart",
        text: res.message,
        icon: "success",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isMedicineLoading) return <Loading />;
  if (!medicine) return <div className="h-screen flex items-center justify-center font-medium">Medicine Not Found</div>;

  const images: IImage[] = medicine.images?.length > 0 ? medicine.images : [{ id: 0, imageUrl: "/placeholder-medicine.png" }];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 lg:py-16 max-w-6xl">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">

          {/* LEFT: IMAGES - Clean medical framing */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted flex items-center justify-center border border-border">
              <Image
                src={images[activeImg].imageUrl}
                alt={medicine.name}
                fill
                className="object-contain p-8 mix-blend-multiply dark:mix-blend-normal"
                priority
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: IImage, idx: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(idx)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 rounded-lg border transition-all duration-200",
                    activeImg === idx 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-border opacity-60 hover:opacity-100 hover:border-primary/50"
                  )}
                >
                  <Image src={img.imageUrl} alt="thumb" fill className="object-cover rounded-md p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT - Medical professional design */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
                {medicine.manufacturer}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-4">
                {medicine.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-light text-foreground">৳{medicine.price}</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-medium border-none rounded-full px-3",
                    medicine.stock > 0 
                      ? "bg-primary/10 text-primary" 
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {medicine.stock > 0 ? `In Stock (${medicine.stock})` : "Out of Stock"}
                </Badge>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8 text-sm lg:text-base">
              {medicine.description}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg h-12 bg-card">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium tabular-nums text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(medicine.stock, quantity + 1))}
                    className="px-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  onClick={() => addToCart()}
                  disabled={medicine.stock === 0 || isPending}
                  className="h-12 flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md hover:shadow-lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isPending ? "Adding..." : "Add to Cart"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
                <QuickSpec 
                  icon={<ShieldCheck />} 
                  label="Expiry" 
                  value={new Date(medicine.expiryDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} 
                />
                <QuickSpec 
                  icon={<Truck />} 
                  label="Delivery" 
                  value="Free Over ৳500" 
                />
                <QuickSpec 
                  icon={<BadgeCheck />} 
                  label="Product" 
                  value="100% Original" 
                />
                <QuickSpec 
                  icon={<RotateCcw />} 
                  label="Returns" 
                  value="7 Days Policy" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABS - Medical professional style */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-12 w-full justify-start gap-8">
            <TabsTrigger 
              value="description" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-0 pb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Product Info
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-0 pb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="animate-in fade-in duration-500">
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-8">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Detailed Pharmacology</h3>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-sm leading-loose">
                  {medicine.description}
                </div>
              </div>
              <div className="md:col-span-4 space-y-4">
                <div className="p-5 rounded-xl border border-border bg-accent/50">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Manufacturer</p>
                  <p className="text-sm font-medium text-foreground">{medicine.manufacturer}</p>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Category</p>
                  <p className="text-sm font-medium text-foreground">{medicine.category.name}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="animate-in fade-in duration-500">
            <div className="max-w-2xl space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">Community Reviews</h3>
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{reviewsData?.averageRating || "0.0"}</span>
                  <span className="text-muted-foreground text-sm">({reviews.length} reviews)</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-16 bg-muted rounded-xl border border-dashed border-border">
                  <p className="text-muted-foreground text-sm">No reviews yet for this product.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {reviews.map((review: IReview) => (
                    <div key={review.id} className="py-8 first:pt-0">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {review.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-semibold text-foreground">{review.user?.name || "Verified Buyer"}</h4>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-0.5 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "h-3 w-3", 
                                  i < review.rating 
                                    ? "fill-primary text-primary" 
                                    : "text-border"
                                )} 
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function QuickSpec({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-card p-4 flex flex-col gap-1">
      <div className="text-primary">{React.cloneElement(icon, { className: "h-4 w-4" })}</div>
      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">{label}</p>
      <p className="text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
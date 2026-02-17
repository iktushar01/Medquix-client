"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ChevronLeft,
  Info,
  AlertCircle,
  FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const MySwal = withReactContent(Swal);

export default function MedicineDetailPage() {
  const { id } = useParams();
  const router = useRouter();
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

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await api.get(`/reviews/medicine/${id}`);
      return res.data;
    },
  });

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

  const images = medicine.images?.length > 0 ? medicine.images : [{ id: 0, imageUrl: "/placeholder-medicine.png" }];
  const reviews = reviewsData?.reviews || [];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => router.back()} className="hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Shop
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">{medicine.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 mb-16">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
              <Image
                src={images[activeImg].imageUrl}
                alt={medicine.name}
                fill
                className="object-contain p-8 md:p-16"
                priority
              />
              {medicine.stock <= 5 && medicine.stock > 0 && (
                <Badge className="absolute top-6 left-6 bg-orange-500 hover:bg-orange-500">Low Stock</Badge>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 px-1">
              {images.map((img: any, idx: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(idx)}
                  className={cn(
                    "relative h-24 w-24 flex-shrink-0 rounded-2xl border-2 transition-all duration-300 bg-white",
                    activeImg === idx 
                      ? "border-primary shadow-md scale-105" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img.imageUrl} alt="thumb" fill className="object-cover rounded-xl p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: CORE INFO & PURCHASE */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 rounded-full px-3">
                  {medicine.manufacturer}
                </Badge>
                {medicine.stock > 0 ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> In Stock
                    </span>
                ) : (
                    <span className="text-xs font-medium text-red-500">Out of Stock</span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                {medicine.name}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 font-bold text-slate-900 dark:text-white">{reviewsData?.averageRating || "0.0"}</span>
                </div>
                <span className="text-slate-400">({reviews.length} Verified Reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-bold text-primary">৳{medicine.price}</span>
              <span className="text-slate-500 text-sm font-medium">Unit Price</span>
            </div>

            {/* PURCHASE CARD */}
            <div className="bg-white dark:bg-card rounded-3xl border border-slate-100 dark:border-border p-6 shadow-sm mb-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Quantity</span>
                  <div className="flex items-center bg-slate-50 dark:bg-muted rounded-xl p-1 border border-slate-100 dark:border-border">
                    <Button
                      variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white dark:hover:bg-background shadow-sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold tabular-nums text-lg">{quantity}</span>
                    <Button
                      variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white dark:hover:bg-background shadow-sm"
                      onClick={() => setQuantity(Math.min(medicine.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={() => addToCart()}
                    disabled={medicine.stock === 0 || isPending}
                    size="lg"
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    {isPending ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard icon={<ShieldCheck />} title="Verified" desc="100% Genuine" />
              <FeatureCard icon={<Truck />} title="Delivery" desc="Safe & Fast" />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: TABS */}
        <div className="bg-white dark:bg-card rounded-3xl border border-slate-100 dark:border-border p-8 shadow-sm">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="bg-slate-50 dark:bg-muted mb-10 p-1.5 h-14 rounded-2xl inline-flex w-full sm:w-auto">
              <TabsTrigger value="description" className="px-8 rounded-xl font-bold data-[state=active]:shadow-md">Information</TabsTrigger>
              <TabsTrigger value="reviews" className="px-8 rounded-xl font-bold data-[state=active]:shadow-md">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="focus-visible:outline-none">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" /> Product Pharmacology
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                      {medicine.description}
                    </p>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
                    <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Medical Disclaimer:</strong> Please consult a healthcare professional before use. This product is for professional therapeutic use as directed.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Specifications</h4>
                  <div className="space-y-1">
                    <SpecItem label="Manufacturer" value={medicine.manufacturer} />
                    <SpecItem label="Category" value={medicine.category.name} />
                    <SpecItem label="Expiry Date" value={new Date(medicine.expiryDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} />
                    <SpecItem label="Return Policy" value="7 Days Policy" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="max-w-3xl space-y-8">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-3xl border-slate-100">
                    <p className="text-slate-400 italic font-medium">Be the first to review this product.</p>
                  </div>
                ) : (
                  reviews.map((review: any) => <ReviewItem key={review.id} review={review} />)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 dark:border-border bg-slate-50/50 dark:bg-muted/30">
      <div className="text-primary h-10 w-10 flex items-center justify-center bg-white dark:bg-background rounded-xl shadow-sm">
        {React.cloneElement(icon, { className: "h-5 w-5" })}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{title}</p>
        <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{desc}</p>
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-border last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}

function ReviewItem({ review }: { review: any }) {
  return (
    <div className="group animate-in fade-in slide-in-from-bottom-2">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">{review.user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-slate-900 dark:text-white">{review.user?.name}</h4>
            <span className="text-xs text-slate-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
            ))}
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{review.comment}</p>
        </div>
      </div>
      <Separator className="mt-8 bg-slate-100 dark:bg-border" />
    </div>
  );
}
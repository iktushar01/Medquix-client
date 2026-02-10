"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";

import { 
  ShieldCheck, 
  Calendar, 
  Tag, 
  Building2, 
  ChevronLeft,
  Info,
  PackageSearch
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);

  // Fetch Medicine Data
  const { data: medicine, isLoading } = useQuery<MedicineProps>({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const res = await api.get(`/medicines/${id}`);
      return res.data.data;
    },
  });

  if (isLoading) return <Loading />;
  
  if (!medicine)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <PackageSearch className="h-12 w-12 opacity-20" />
        <p className="text-xl font-medium">Medicine details not found.</p>
        <button onClick={() => router.back()} className="text-primary underline">Go Back</button>
      </div>
    );

  const images = medicine.images?.length > 0 ? medicine.images : [{ id: 0, imageUrl: "/placeholder-medicine.png" }];

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-transparent">
      <div className="container mx-auto px-4 py-10 lg:px-12">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="group mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Listing
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* LEFT: GALLERY (Sticky on Desktop) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-3xl border bg-white dark:bg-slate-950 shadow-sm">
                <Image
                  src={images[activeImg].imageUrl}
                  alt={medicine.name}
                  fill
                  className="object-contain p-10"
                  priority
                />
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(idx)}
                      className={cn(
                        "relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all",
                        activeImg === idx ? "border-primary ring-4 ring-primary/5" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image src={img.imageUrl} alt="preview" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-7">
            <div className="flex flex-col h-full">
              
              {/* Header Info */}
              <div className="mb-8">
                <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1 font-bold text-primary">
                  {medicine.category.name}
                </Badge>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 lg:text-5xl">
                  {medicine.name}
                </h1>
                <div className="mt-4 flex items-center gap-4">
                   <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">৳{medicine.price}</p>
                   <Separator orientation="vertical" className="h-6" />
                   <span className={cn(
                     "text-sm font-bold uppercase tracking-wide",
                     medicine.stock > 0 ? "text-emerald-500" : "text-red-500"
                   )}>
                     {medicine.stock > 0 ? `In Stock (${medicine.stock})` : "Out of Stock"}
                   </span>
                </div>
              </div>

              <Separator className="mb-8" />

              {/* Technical Specifications Grid */}
              <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard 
                  icon={<Building2 className="h-5 w-5" />} 
                  label="Manufacturer" 
                  value={medicine.manufacturer} 
                />
                <InfoCard 
                  icon={<Calendar className="h-5 w-5" />} 
                  label="Expiry Date" 
                  value={new Date(medicine.expiryDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  valueClassName="text-destructive"
                />
                <InfoCard 
                  icon={<Tag className="h-5 w-5" />} 
                  label="Category" 
                  value={medicine.category.name} 
                />
                <InfoCard 
                  icon={<ShieldCheck className="h-5 w-5" />} 
                  label="Certification" 
                  value="Drug Administration Approved" 
                />
              </div>

              {/* Description Section */}
              <div className="rounded-2xl border bg-white dark:bg-slate-900/50 p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-slate-50">
                  <Info className="h-5 w-5 text-primary" />
                  <h2>Product Information</h2>
                </div>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {medicine.description}
                </p>
              </div>

              {/* Compliance Footer */}
              <div className="mt-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 text-center">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Disclaimer: This information is for reference only. Please consult a registered physician before using any medication.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Info Card Component */
function InfoCard({ icon, label, value, valueClassName }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string,
  valueClassName?: string 
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors hover:border-primary/30">
      <div className="rounded-lg bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-tight text-slate-400">{label}</p>
        <p className={cn("text-sm font-semibold text-slate-700 dark:text-slate-200", valueClassName)}>
          {value || "Not Available"}
        </p>
      </div>
    </div>
  );
}
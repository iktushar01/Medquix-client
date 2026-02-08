"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";

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

export default function MedicineDetailPage() {
  const { id } = useParams();

  const { data: medicine, isLoading } = useQuery<MedicineProps>({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const res = await api.get(`/medicines/${id}`);
      return res.data.data;
    },
  });

  const handleAddToCart = () => {
    // TODO: Connect with cart context or API
    alert(`Added ${medicine?.name} to cart!`);
  };

  if (isLoading) return <Loading/>
  if (!medicine) return <p className="text-center py-6">Medicine not found.</p>;

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =================== Medicine Info =================== */}
        <div className="lg:col-span-2 border rounded-lg p-6 shadow hover:shadow-md transition">
          <h1 className="text-3xl font-bold mb-2">{medicine.name}</h1>
          <p className="text-muted-foreground mb-4">{medicine.description}</p>

          <div className="space-y-2">
            <p>
              <span className="font-medium">Price:</span>{" "}
              <span className="text-primary">${medicine.price}</span>
            </p>
            <p>
              <span className="font-medium">Stock:</span> {medicine.stock}
            </p>
            <p>
              <span className="font-medium">Manufacturer:</span> {medicine.manufacturer}
            </p>
            <p>
              <span className="font-medium">Expiry:</span>{" "}
              {new Date(medicine.expiryDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Category:</span> {medicine.category.name}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "mt-6 px-6 py-2 rounded text-white bg-primary hover:bg-primary-foreground transition"
            )}
          >
            Add to Cart
          </button>
        </div>

        {/* =================== Sidebar / Related Info =================== */}
        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Quick Info</h2>
          <p className="mb-2">
            <span className="font-medium">Available Stock:</span> {medicine.stock}
          </p>
          <p className="mb-2">
            <span className="font-medium">Expires On:</span>{" "}
            {new Date(medicine.expiryDate).toLocaleDateString()}
          </p>
          <p className="mb-2">
            <span className="font-medium">Manufacturer:</span> {medicine.manufacturer}
          </p>
          <p className="mb-2">
            <span className="font-medium">Category:</span> {medicine.category.name}
          </p>
        </div>
      </div>

      {/* =================== Optional: Related Medicines =================== */}
      {/* <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Related Medicines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedMedicines.map(med => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      </div> */}
    </div>
  );
}

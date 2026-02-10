"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loading from "@/app/loading";
import Swal from "sweetalert2";

interface CartItem {
  id: number;
  medicineId: number;
  quantity: number;
  medicine: {
    id: number;
    name: string;
    price: string;
    manufacturer: string;
    stock: number;
    images?: { imageUrl: string }[];
  };
}

interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    total: number;
  };
}

export default function CartPage() {
  const queryClient = useQueryClient();

  // Fetch Cart Data
  const { data, isLoading } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data;
    },
  });

  // Delete Mutation
  const { mutate: removeItem } = useMutation({
    mutationFn: async (cartItemId: number) => {
      return await api.delete(`/cart/${cartItemId}`);
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Item removed from cart.",
        background: "var(--card)",
        color: "var(--foreground)",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: any) => {
      Swal.fire("Error", err.message || "Failed to remove item", "error");
    },
  });

  // Update Quantity Mutation
  const { mutate: updateQuantity } = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      return await api.patch(`/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: any) => {
      Swal.fire("Error", err.message || "Failed to update quantity", "error");
    },
  });

  const handleDeleteConfirm = (id: number) => {
    Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this medicine from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--destructive)",
      confirmButtonText: "Yes, delete it!",
      background: "var(--card)",
      color: "var(--foreground)",
    }).then((result) => {
      if (result.isConfirmed) removeItem(id);
    });
  };

  if (isLoading) return <Loading />;

  const cartItems = data?.data?.items || [];
  const subtotal = data?.data?.total || 0;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Looks like you haven&apos;t added any medicine yet.</p>
        <Link href="/shop">
          <Button className="mt-4">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-primary" />
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: ITEM LIST */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 overflow-hidden border-border bg-card shadow-sm transition-hover hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                {/* Medicine Image */}
                <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted border">
                  <Image
                    src={item.medicine.images?.[0]?.imageUrl || "/placeholder-medicine.png"}
                    alt={item.medicine.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.medicineId}`} className="hover:text-primary transition-colors">
                    <h3 className="font-bold text-lg truncate">{item.medicine.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground capitalize">{item.medicine.manufacturer}</p>
                  <p className="mt-1 font-bold text-primary">৳{item.medicine.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center border rounded-md bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) })
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity({ id: item.id, quantity: Math.min(item.medicine.stock, item.quantity + 1) })
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <button
                    onClick={() => handleDeleteConfirm(item.id)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 border-border bg-card shadow-lg">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 border-b pb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Fee</span>
                <span className="text-emerald-500 font-medium font-semibold italic">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black text-primary">৳{subtotal.toFixed(2)}</span>
            </div>

            <Link href="/cart/checkout">
              <Button className="w-full h-12 text-lg font-bold gap-2 group shadow-lg shadow-primary/20">
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 border-r pr-2">Secure Payment</span>
              <span className="flex items-center gap-1 pl-1">24/7 Support</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { MapPin, CreditCard, Truck, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/app/loading";
import Swal from "sweetalert2";

// ✅ Ensure this is the ONLY default export in the file
export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");

  // 1. Fetch Cart to show summary
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data;
    },
  });

  // 2. Place Order Mutation
  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: async (shippingAddress: string) => {
      const res = await api.post("/orders", { shippingAddress });
      return res.data;
    },
    onSuccess: (res) => {
      Swal.fire({
        title: "Order Placed!",
        text: `Your order #${res.data.id} has been confirmed.`,
        icon: "success",
        confirmButtonColor: "var(--primary)",
        background: "var(--card)",
        color: "var(--foreground)",
      }).then(() => {
        // Clear cart cache and redirect
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        router.push("/shop"); 
      });
    },
    onError: (err: any) => {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to place order",
        icon: "error",
        confirmButtonColor: "var(--destructive)",
        background: "var(--card)",
        color: "var(--foreground)",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      return Swal.fire("Required", "Please provide a shipping address", "info");
    }
    placeOrder(address);
  };

  if (isLoading) return <Loading />;

  const total = cartData?.data?.total || 0;
  const items = cartData?.data?.items || [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <Button className="mt-4" onClick={() => router.push("/shop")}>Go Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6 gap-2 hover:bg-transparent hover:text-primary p-0"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: SHIPPING FORM */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Shipping Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  placeholder="e.g. House 12, Road 5, Gazipur, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-12 border-muted-foreground/20 focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Payment Method</h2>
                </div>
                <div className="border rounded-xl p-4 bg-muted/30 flex items-center justify-between border-primary/30">
                  <div className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <Truck className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="lg:col-span-5">
          <Card className="p-6 sticky top-24 border-primary/20 bg-card shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-foreground">Order Summary</h2>
            
            <div className="max-h-[300px] overflow-y-auto mb-6 space-y-3 pr-2">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.medicine.name} <span className="font-bold text-foreground">x{item.quantity}</span>
                  </span>
                  <span className="font-medium text-foreground">৳{(Number(item.medicine.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">৳{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-emerald-500 font-bold text-[10px] tracking-widest uppercase">Free</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-2 border-t text-foreground">
                <span>Total Amount</span>
                <span className="text-primary text-xl">৳{total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full h-14 mt-8 text-lg font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              {isPending ? "Placing Order..." : "Confirm Order"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}